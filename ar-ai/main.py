import os
import json
import shutil
import requests
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse, FileResponse
import logging
from datetime import datetime
import re
from gtts import gTTS
import io

# ==================== IMPORT WHISPER ====================
try:
    from faster_whisper import WhisperModel
    WHISPER_AVAILABLE = True
except ImportError as e:
    WHISPER_AVAILABLE = False
    print(f"❌ Không thể import faster_whisper: {e}")
    print("💡 Hãy cài đặt: pip install faster-whisper")

# Cấu hình logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Tạo thư mục tạm
TEMP_AUDIO_DIR = "temp_audio"
os.makedirs(TEMP_AUDIO_DIR, exist_ok=True)

# ==================== KHỞI TẠO WHISPER MODEL ====================
whisper_model = None
model_loaded = False

if WHISPER_AVAILABLE:
    try:
        logger.info("🔄 Đang load Whisper model tiny...")
        whisper_model = WhisperModel("tiny", device="cpu", compute_type="int8", num_workers=1)
        model_loaded = True
        logger.info("✅ Load model thành công!")
    except Exception as e:
        logger.error(f"❌ Lỗi load model: {e}")

# ==================== CẤU HÌNH OLLAMA ====================
OLLAMA_URL = "http://localhost:11434/api/generate"
LLM_NAME = "llama3.2:1b"

# ==================== THÔNG TIN SẢN PHẨM ====================
PRODUCT_INFO = {
    "mã": "CHAIR_001",
    "tên": "Ghế Văn Phòng Ergonomic Premium",
    "mô_tả": "Ghế văn phòng công thái học, hỗ trợ cột sống, tựa lưng lưới thoáng khí.",
    "danh_mục": "Ghế Văn Phòng",
    "thương_hiệu": "ComfortSeat",
    "giá": 3490000,
    "giá_gốc": 4290000,
    "giảm_giá": 19,
    "màu_sắc": ["Đen", "Xám", "Xanh Navy"],
    "chất_liệu": ["Lưới Mesh", "Khung thép sơn tĩnh điện", "Nhựa PP cao cấp"],
    "kích_thước": {"rộng": 65, "sâu": 60, "cao": "110-125 cm"},
    "trọng_lượng": "14.5 kg",
    "tải_trọng_tối_đa": "150 kg",
    "tính_năng": ["Điều chỉnh độ cao", "Ngả lưng 135 độ", "Tay vịn 3D", "Tựa đầu điều chỉnh", "Bánh xe chống trầy sàn"],
    "đánh_giá": 4.7,
    "số_lượt_đánh_giá": 326,
    "tồn_kho": 85,
    "trạng_thái": "Còn hàng",
    "miễn_phí_vận_chuyển": True,
    "thời_gian_giao_hàng": "2-5 ngày",
    "bảo_hành": "24 tháng"
}

SYSTEM_PROMPT = f"""
Bạn là một nhân viên bán hàng chuyên nghiệp cho sản phẩm sau:
{json.dumps(PRODUCT_INFO, ensure_ascii=False, indent=2)}

Quy tắc trả lời:
1. Chỉ trả lời các câu hỏi liên quan đến sản phẩm ghế này.
2. Nếu khách hỏi về chủ đề khác, hãy lịch sự từ chối.
3. Trả lời ngắn gọn, thân thiện, dưới 50 từ.
4. Sử dụng tiếng Việt.
"""

# ==================== TEXT TO SPEECH VỚI gTTS ====================
def text_to_speech_gtts(text: str, output_file: str):
    """Chuyển văn bản thành file MP3 bằng Google TTS"""
    try:
        # Làm sạch text
        clean_text = re.sub(r'[^\w\s\.\,\?\:\!]', ' ', text)
        clean_text = re.sub(r'\s+', ' ', clean_text).strip()
        
        # Giới hạn độ dài (gTTS giới hạn 100 ký tự? Thực tế có thể dài hơn)
        if len(clean_text) > 500:
            clean_text = clean_text[:500]
        
        if not clean_text:
            logger.warning("Text rỗng sau khi làm sạch")
            return False
        
        logger.info(f"🔊 Đang TTS với text: '{clean_text[:100]}...' (độ dài: {len(clean_text)} ký tự)")
        
        # Tạo TTS với ngôn ngữ tiếng Việt
        tts = gTTS(text=clean_text, lang='vi', slow=False)
        
        # Lưu file
        tts.save(output_file)
        
        # Kiểm tra file
        if os.path.exists(output_file) and os.path.getsize(output_file) > 0:
            logger.info(f"✅ Tạo file MP3 thành công: {output_file} (size: {os.path.getsize(output_file)} bytes)")
            return True
        else:
            logger.error(f"File MP3 rỗng hoặc không tồn tại")
            return False
            
    except Exception as e:
        logger.error(f"❌ Lỗi gTTS: {e}")
        return False

# ==================== API ENDPOINTS ====================
@app.get("/")
async def root():
    return {
        "status": "running",
        "whisper_model_loaded": model_loaded,
        "llm_model": LLM_NAME,
        "tts_engine": "gTTS (Google TTS)"
    }

@app.post("/api/voice-chat")
async def voice_chat(file: UploadFile = File(...)):
    if not model_loaded:
        raise HTTPException(503, "Model chưa được load")
    
    if not file.filename.endswith(('.wav', '.mp3', '.m4a', '.webm')):
        raise HTTPException(400, "Chỉ hỗ trợ file audio (.wav, .mp3, .m4a, .webm)")
    
    temp_file_path = f"temp_{file.filename}"
    try:
        with open(temp_file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        logger.info(f"📁 Đã lưu file: {temp_file_path}")
        
        # ========== SPEECH TO TEXT ==========
        logger.info("🎤 Đang chuyển giọng nói...")
        segments, _ = whisper_model.transcribe(temp_file_path, language="vi", beam_size=3)
        user_text = "".join([segment.text for segment in segments]).strip()
        
        logger.info(f"📝 Khách nói: '{user_text}'")
        
        if not user_text:
            raise HTTPException(400, "Không nghe rõ giọng nói")
        
        # ========== GỌI OLLAMA ==========
        logger.info(f"🤖 Đang gọi Ollama...")
        payload = {
            "model": LLM_NAME,
            "prompt": user_text,
            "system": SYSTEM_PROMPT,
            "stream": False,
            "options": {
                "num_predict": 100,  # Giới hạn câu trả lời ngắn
                "temperature": 0.7
            }
        }
        
        response = requests.post(OLLAMA_URL, json=payload, timeout=30)
        llm_answer = response.json().get("response", "")
        
        if not llm_answer:
            llm_answer = "Xin lỗi, tôi chưa hiểu câu hỏi của bạn về sản phẩm ghế."
        
        logger.info(f"💬 Trả lời: '{llm_answer[:100]}...'")
        
        # ========== TEXT TO SPEECH ==========
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S_%f")[:-3]
        audio_file_path = os.path.join(TEMP_AUDIO_DIR, f"response_{timestamp}.mp3")
        
        tts_success = text_to_speech_gtts(llm_answer, audio_file_path)
        
        response_data = {
            "success": True,
            "khach_noi": user_text,
            "tro_ly_tra_loi": llm_answer,
        }
        
        if tts_success:
            response_data["audio_file"] = f"/api/audio/{timestamp}"
            response_data["has_audio"] = True
        else:
            response_data["has_audio"] = False
            response_data["tts_error"] = "gTTS failed"
        
        return JSONResponse(content=response_data)
        
    except Exception as e:
        logger.error(f"❌ Lỗi: {e}", exc_info=True)
        raise HTTPException(500, str(e))
    finally:
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
            logger.info(f"🗑️ Đã xóa file tạm")

@app.get("/api/audio/{timestamp}")
async def get_audio(timestamp: str):
    """Trả về file MP3"""
    audio_file_path = os.path.join(TEMP_AUDIO_DIR, f"response_{timestamp}.mp3")
    
    if not os.path.exists(audio_file_path):
        raise HTTPException(404, "File audio không tồn tại")
    
    return FileResponse(
        audio_file_path,
        media_type="audio/mpeg",
        filename=f"response_{timestamp}.mp3"
    )

@app.get("/api/test-tts")
async def test_tts():
    """Test TTS với câu mẫu"""
    test_text = "Xin chào, đây là test giọng nói từ Google TTS. Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi."
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S_%f")[:-3]
    audio_file_path = os.path.join(TEMP_AUDIO_DIR, f"test_{timestamp}.mp3")
    
    success = text_to_speech_gtts(test_text, audio_file_path)
    
    if success:
        return JSONResponse({
            "success": True,
            "audio_file": f"/api/audio/{timestamp}",
            "text": test_text
        })
    else:
        raise HTTPException(500, "TTS test failed")

@app.get("/health")
async def health_check():
    """Kiểm tra trạng thái"""
    # Kiểm tra Ollama
    ollama_status = "unknown"
    try:
        ollama_test = requests.get("http://localhost:11434/api/tags", timeout=5)
        if ollama_test.status_code == 200:
            ollama_status = "connected"
            models = ollama_test.json().get("models", [])
            llm_available = any(m.get("name", "").startswith(LLM_NAME) for m in models)
            if not llm_available:
                ollama_status = f"missing_model_{LLM_NAME}"
    except:
        ollama_status = "disconnected"
    
    return {
        "whisper_model_loaded": model_loaded,
        "ollama_status": ollama_status,
        "llm_model": LLM_NAME,
        "tts_engine": "gTTS (Google TTS)"
    }

# ==================== CLEANUP OLD FILES ====================
@app.on_event("startup")
async def startup_event():
    """Xóa file cũ khi khởi động"""
    try:
        current_time = datetime.now().timestamp()
        deleted_count = 0
        for filename in os.listdir(TEMP_AUDIO_DIR):
            file_path = os.path.join(TEMP_AUDIO_DIR, filename)
            if os.path.isfile(file_path):
                file_age = current_time - os.path.getctime(file_path)
                if file_age > 3600:  # 1 giờ
                    os.remove(file_path)
                    deleted_count += 1
        if deleted_count > 0:
            logger.info(f"🗑️ Đã xóa {deleted_count} file cũ")
    except Exception as e:
        logger.error(f"Lỗi dọn dẹp: {e}")

if __name__ == "__main__":
    import uvicorn
    
    print("=" * 50)
    print("🚀 KHỞI ĐỘNG SERVER VOICE CHAT")
    print("=" * 50)
    print(f"📦 Faster-whisper: {'✅' if WHISPER_AVAILABLE else '❌'}")
    print(f"📊 Whisper model: {'✅' if model_loaded else '❌'}")
    print(f"🤖 Ollama model: {LLM_NAME}")
    print(f"🔊 TTS engine: gTTS (Google TTS)")
    print(f"🌐 Server: http://0.0.0.0:8000")
    print(f"📖 API docs: http://localhost:8000/docs")
    print(f"🧪 Test TTS: http://localhost:8000/api/test-tts")
    print("=" * 50)
    
    uvicorn.run(app, host="0.0.0.0", port=8000)