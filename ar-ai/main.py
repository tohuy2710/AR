import os
import json
import shutil
import requests
import subprocess
import uuid
from fastapi import FastAPI, UploadFile, File, HTTPException, Request
from fastapi.responses import JSONResponse, FileResponse, Response
from fastapi.middleware.cors import CORSMiddleware
import logging
from datetime import datetime
import re
from gtts import gTTS
import io
import time

# ==================== CÁC PHẦN IMPORT VÀ CẤU HÌNH WHISPER GIỮ NGUYÊN ====================
try:
    from faster_whisper import WhisperModel
    WHISPER_AVAILABLE = True
except ImportError as e:
    WHISPER_AVAILABLE = False
    print(f"❌ Không thể import faster_whisper: {e}")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Mở CORS để React App có thể gọi API thoải mái
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"Request: {request.method} {request.url.path}")
    response = await call_next(request)
    logger.info(f"Response status: {response.status_code}")
    return response

TEMP_AUDIO_DIR = "temp_audio"
os.makedirs(TEMP_AUDIO_DIR, exist_ok=True)
VOICE_CHAT_DEBUG_LOG = os.path.join(TEMP_AUDIO_DIR, "voice_chat_debug.jsonl")

whisper_model = None
model_loaded = False

if WHISPER_AVAILABLE:
    try:
        whisper_model = WhisperModel("tiny", device="cpu", compute_type="int8", num_workers=1)
        model_loaded = True
    except Exception as e:
        pass

OLLAMA_URL = "http://localhost:11434/api/generate"
LLM_NAME = "llama3.2:3b"
TTS_PLAYBACK_SPEED = 1.2
WHISPER_BEAM_SIZE = 6

# ==================== LỊCH SỬ TRÒ CHUYỆN (MỚI) ====================
CHAT_HISTORY = []

# ==================== THÔNG TIN SẢN PHẨM ====================
PRODUCT_INFO = {
    "mã": "CHAIR_001",
    "tên": "Ghế Văn Phòng Ergonomic Premium",
    "mô_tả": "Ghế văn phòng công thái học",
    "màu_sắc": ["Đen", "Xám", "Xanh Navy"],
    "giá": 3490000,
    "tính_năng": ["Điều chỉnh độ cao", "Ngả lưng 135 độ", "Tay vịn 3D"]
}

# ==================== SYSTEM PROMPT MỚI DÀNH CHO JSON ====================
SYSTEM_PROMPT = f"""
Bạn là trợ lý ảo AR tên "Frog" (Ếch) và là nhân viên bán hàng.
Thông tin sản phẩm: {json.dumps(PRODUCT_INFO, ensure_ascii=False)}

Nhiệm vụ: Phân tích câu nói của người dùng, kết hợp với LỊCH SỬ TRÒ CHUYỆN, và TRẢ VỀ DUY NHẤT ĐỊNH DẠNG JSON. KHÔNG markdown, KHÔNG giải thích.
1. "qa": Khách hỏi thông tin sản phẩm (màu, giá...).
2. "command": Khách ra lệnh thực hiện hành động. Action có thể là "rotate" (xoay), "stop" (dừng xoay), "delete" (xóa).
3. "order": Khách chốt đơn, đồng ý mua. Tóm tắt thông tin sản phẩm khách chọn vào order_summary.

Định dạng JSON BẮT BUỘC:
{{
  "intent": "qa" | "command" | "order",
  "action": "rotate" | "stop" | "delete" | "none",
  "order_summary": "Thông tin chốt đơn nếu có" | "",
  "reply_text": "Câu trả lời ngắn gọn (dưới 40 từ) bằng tiếng Việt."
}}
"""

CORRECTION_SYSTEM_PROMPT = """Bạn là công cụ sửa lỗi chính tả từ nhận dạng giọng nói.
CHỈ trả về câu đã sửa, TUYỆT ĐỐI không giải thích."""
ASR_CORRECTION_RULES = {
    "sói": "xóa",
    "xói": "xóa",
    "soi": "xoay",
    "sài": "xoay",
    "sai": "xoay",
    "gòn": "còn",
    "ghon": "ghế",
    "ghê": "ghế"
}

def call_ollama(prompt: str, system_prompt: str, num_predict: int = 150, temperature: float = 0.3):
    payload = {
        "model": LLM_NAME, "prompt": prompt, "system": system_prompt, "stream": False,
        "format": "json",
        "options": {"num_predict": num_predict, "temperature": temperature}
    }
    response = requests.post(OLLAMA_URL, json=payload, timeout=30)
    response.raise_for_status()
    return response.json().get("response", "").strip()

def extract_json_object(text: str):
    if not text:
        return None

    cleaned_text = text.strip()

    if cleaned_text.startswith("```"):
        cleaned_text = re.sub(r"^```(?:json)?\s*", "", cleaned_text, flags=re.IGNORECASE)
        cleaned_text = re.sub(r"\s*```$", "", cleaned_text)
        cleaned_text = cleaned_text.strip()

    start_idx = cleaned_text.find("{")
    end_idx = cleaned_text.rfind("}")
    if start_idx == -1 or end_idx == -1 or end_idx <= start_idx:
        return None

    candidate = cleaned_text[start_idx : end_idx + 1]
    return json.loads(candidate)

def apply_asr_rule_corrections(text: str): return text
def is_low_confidence_transcript(segments): return False
def normalize_whisper_text(text: str, should_call_llm: bool): return text
def speed_up_audio_ffmpeg(input_file: str, output_file: str, speed: float): return True

def text_to_speech_gtts(text: str, output_file: str):
    try:
        tts = gTTS(text=text, lang='vi', slow=False)
        tts.save(output_file)
        logger.info(f"Đã tạo file audio: {output_file}")
        return True
    except Exception as e:
        logger.error(f"Lỗi tạo TTS: {e}")
        return False

def log_voice_chat_debug(entry: dict):
    try:
        with open(VOICE_CHAT_DEBUG_LOG, "a", encoding="utf-8") as f:
            f.write(json.dumps(entry, ensure_ascii=False) + "\n")
    except Exception as e:
        logger.warning("Không thể ghi debug log voice-chat: %s", e)


@app.post("/api/voice-chat")
async def voice_chat(file: UploadFile = File(...)):
    temp_file_path = f"temp_{file.filename}"
    request_id = uuid.uuid4().hex[:12]
    request_started_at = datetime.now().isoformat(timespec="seconds")
    
    try:
        # Lưu file tạm
        with open(temp_file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Transcribe với Whisper
        segments, _ = whisper_model.transcribe(
            temp_file_path, 
            language="vi", 
            beam_size=WHISPER_BEAM_SIZE,
            initial_prompt="ghế văn phòng, xoay, xóa, dừng xoay, màu sắc, giá tiền, mua"
        )
        user_text = "".join([s.text for s in list(segments)]).strip()
        corrected_text = normalize_whisper_text(user_text, False)
        
        logger.info(f"User said: {corrected_text}")
        
        # Xây dựng prompt chứa cả lịch sử
        history_text = "\n".join([f"Khách: {h['user']}\nFrog: {h['bot']}" for h in CHAT_HISTORY[-4:]])
        full_prompt = f"Lịch sử:\n{history_text}\n\nKhách hiện tại: {corrected_text}"
        
        # Gọi LLM
        llm_answer = call_ollama(prompt=full_prompt, system_prompt=SYSTEM_PROMPT, num_predict=150, temperature=0.3)
        logger.info(f"LLM response: {llm_answer}")
        
        # Parse JSON từ phản hồi của LLM
        parsed_data = {}
        try:
            parsed_data = extract_json_object(llm_answer)
            if not isinstance(parsed_data, dict):
                raise ValueError("LLM response is not a JSON object")
        except Exception as e:
            logger.warning(
                "Lỗi parse JSON từ LLM: %s | raw_response=%r",
                e,
                llm_answer[:300] if llm_answer else "",
            )
            parsed_data = {
                "intent": "qa",
                "reply_text": llm_answer or "Xin lỗi, tôi chưa rõ ý bạn.",
                "action": "none",
                "order_summary": "",
            }
            
        reply_text = parsed_data.get("reply_text", "Dạ, tôi chưa nghe rõ ạ.")
        
        # Tạo file audio
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S_%f")[:-3]
        audio_file_path = os.path.join(TEMP_AUDIO_DIR, f"response_{timestamp}.mp3")
        tts_success = text_to_speech_gtts(reply_text, audio_file_path)
        
        # Đợi file được tạo hoàn tất
        if tts_success:
            max_wait = 5  # seconds
            waited = 0
            while not os.path.exists(audio_file_path) and waited < max_wait:
                time.sleep(0.1)
                waited += 0.1
            logger.info(f"Audio file created: {os.path.exists(audio_file_path)} at {audio_file_path}")
        
        # Log debug
        log_voice_chat_debug({
            "request_id": request_id,
            "requested_at": request_started_at,
            "filename": file.filename,
            "content_type": file.content_type,
            "user_text_raw": user_text,
            "user_text_final": corrected_text,
            "llm_raw_response": llm_answer,
            "parsed_intent": parsed_data.get("intent", "qa"),
            "parsed_action": parsed_data.get("action", "none"),
            "parsed_order_summary": parsed_data.get("order_summary", ""),
            "reply_text": reply_text,
            "audio_file_created": tts_success,
            "audio_file_path": audio_file_path if tts_success else None,
        })
        
        # Lưu vào lịch sử
        CHAT_HISTORY.append({"user": corrected_text, "bot": reply_text})
        
        # Chuẩn bị response
        response_data = {
            "success": True,
            "request_id": request_id,
            "khach_noi": corrected_text,
            "intent": parsed_data.get("intent", "qa"),
            "action": parsed_data.get("action", "none"),
            "order_summary": parsed_data.get("order_summary", ""),
            "tro_ly_tra_loi": reply_text,
        }
        
        if tts_success and os.path.exists(audio_file_path):
            response_data["has_audio"] = True
            response_data["audio_file"] = f"/api/audio/{timestamp}"
            logger.info(f"Returning audio_file: {response_data['audio_file']}")
        else:
            response_data["has_audio"] = False
            logger.warning("No audio file created")
        
        return JSONResponse(content=response_data)
        
    except Exception as e:
        logger.error(f"Lỗi: {e}", exc_info=True)
        raise HTTPException(500, str(e))
    finally:
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)

@app.api_route("/api/audio/{timestamp}", methods=["GET", "HEAD"])
async def get_audio(timestamp: str, method: str = "HEAD"):
    clean_timestamp = timestamp.replace(".mp3", "")
    audio_file_path = os.path.join(TEMP_AUDIO_DIR, f"response_{clean_timestamp}.mp3")
    
    logger.info(f"Looking for audio file: {audio_file_path}, method: {method}")
    
    if not os.path.exists(audio_file_path):
        logger.error(f"Audio file not found: {audio_file_path}")
        raise HTTPException(status_code=404, detail="Audio file not found")
    
    # Kiểm tra file size
    file_size = os.path.getsize(audio_file_path)
    logger.info(f"Audio file size: {file_size} bytes")
    
    if file_size == 0:
        logger.error(f"Audio file is empty: {audio_file_path}")
        raise HTTPException(status_code=500, detail="Audio file is empty")
    
    headers = {
        "Content-Type": "audio/mpeg",
        "Content-Length": str(file_size),
        "Accept-Ranges": "bytes",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
        "Access-Control-Allow-Headers": "*",
    }

    if method == "HEAD":
        return Response(headers=headers)
    
    return FileResponse(
        audio_file_path, 
        media_type="audio/mpeg", 
        filename=f"response_{clean_timestamp}.mp3",
        headers=headers
    )

@app.options("/api/audio/{timestamp}")
async def audio_options(timestamp: str):
    return Response(
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
            "Access-Control-Allow-Headers": "*",
        }
    )

@app.get("/api/health")
async def health_check():
    """Endpoint kiểm tra sức khỏe của backend"""
    return {
        "status": "ok",
        "whisper_available": WHISPER_AVAILABLE,
        "model_loaded": model_loaded,
        "temp_audio_dir_exists": os.path.exists(TEMP_AUDIO_DIR),
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
