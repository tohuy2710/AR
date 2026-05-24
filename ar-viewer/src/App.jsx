import { useEffect, useRef } from "react";
import * as THREE from "three";
import { ARButton } from "three/examples/jsm/webxr/ARButton.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const API_BASE_URL = "https://d2a0-2405-4803-f159-f3d0-cd90-5c1b-1ed9-956.ngrok-free.app";

export default function App() {
  const mountRef = useRef(null);
  const overlayRef = useRef(null);
  
  // Cờ trạng thái ghi âm
  const isRecordingRef = useRef(false);
  const audioChunksRef = useRef([]);

  // Các cờ hệ thống AR
  const greetingDoneRef = useRef(false);
  const planeFoundPlayedRef = useRef(false);
  const hasPlacedObjectRef = useRef(false);
  const loopTimeoutRef = useRef(null);
  const hasPlayedDoiViTriRef = useRef(false);
  const rotateKichHoatTimeoutRef = useRef(null);
  const isVoicePlayingRef = useRef(false);
  const hasPlayedRotateSuccessRef = useRef(false);

  // Đếm số lần chạm để kích hoạt trợ lý (5 lần ở góc phải dưới)
  const tapCountRef = useRef(0);
  const tapTimerRef = useRef(null);
  const isCountingTapRef = useRef(false);

  // Cờ để đảm bảo voice cố định chỉ phát 1 lần
  const hasPlayedXinChaoRef = useRef(false);
  const hasPlayedNhanDienRef = useRef(false);
  const hasPlayedVongTronXanhRef = useRef(false);
  const hasPlayedDoiViTriVoiceRef = useRef(false);
  const hasPlayedXoayKichHoatRef = useRef(false);
  const hasPlayedXoayThanhCongRef = useRef(false);

  // Tham chiếu đến speech synthesis
  const speechSynthesisRef = useRef(window.speechSynthesis);
  const currentUtteranceRef = useRef(null);

  useEffect(() => {
    const mountNode = mountRef.current;
    let scene, camera, renderer;
    let controller, reticle, hitTestSource = null, hitTestSourceRequested = false;
    let placedModels = [];
    let textSprite = null;

    // ================== HÀM TẠO GIỌNG NÓI TRÊN FE ==================
    function speakText(text, onEnd = null) {
      return new Promise((resolve, reject) => {
        // Dừng phát hiện tại nếu có
        if (currentUtteranceRef.current) {
          speechSynthesisRef.current.cancel();
        }
        
        // Tạo utterance mới
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'vi-VN';
        utterance.rate = 1.2;    // Tốc độ nói
        utterance.pitch = 1.0;    // Cao độ
        utterance.volume = 1.0;   // Âm lượng
        
        // Chọn giọng nói tiếng Việt
        const setVoice = () => {
          const voices = speechSynthesisRef.current.getVoices();
          
          const vietnameseVoice = voices.find(voice => 
            voice.lang.includes('vi') 
          );
          if (vietnameseVoice) {
            utterance.voice = vietnameseVoice;
          } 
        };
        
        // Event listeners
        utterance.onstart = () => {
          console.log("Speaking:", text);
          isVoicePlayingRef.current = true;
          updateInstructionText("🔊 " + text);
        };
        
        utterance.onend = () => {
          console.log("Speech ended");
          isVoicePlayingRef.current = false;
          currentUtteranceRef.current = null;
          updateInstructionText("");
          if (onEnd) onEnd();
          resolve(true);
        };
        
        utterance.onerror = (event) => {
          console.error("Speech error:", event);
          isVoicePlayingRef.current = false;
          currentUtteranceRef.current = null;
          reject(event);
        };
        
        // Chờ voices loaded
        if (speechSynthesisRef.current.getVoices().length === 0) {
          speechSynthesisRef.current.addEventListener('voiceschanged', setVoice, { once: true });
        } else {
          setVoice();
        }
        
        currentUtteranceRef.current = utterance;
        speechSynthesisRef.current.speak(utterance);
      });
    }

    function stopSpeaking() {
      if (speechSynthesisRef.current) {
        speechSynthesisRef.current.cancel();
      }
      if (currentUtteranceRef.current) {
        currentUtteranceRef.current = null;
      }
      isVoicePlayingRef.current = false;
      updateInstructionText("");
    }

    // Hàm phát voice với kiểm tra idle
    const playVoiceIfIdle = async (text, voiceFlagRef) => {
      if (voiceFlagRef.current) return;
      if (isVoicePlayingRef.current) {
        // Đợi 1 chút rồi thử lại
        setTimeout(() => playVoiceIfIdle(text, voiceFlagRef), 500);
        return;
      }
      
      voiceFlagRef.current = true;
      await speakText(text);
    };

    // ================== TRỢ LÝ GIỌNG NÓI ==================
    async function startRecordingVoice() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        audioChunksRef.current = [];
        
        mediaRecorder.start();
        updateInstructionText("🎙️ Đang thu âm... (Hãy nói yêu cầu của bạn)");

        mediaRecorder.ondataavailable = e => {
          if (e.data.size > 0) {
            audioChunksRef.current.push(e.data);
          }
        };

        mediaRecorder.onstop = async () => {
          if (audioChunksRef.current.length === 0) {
            console.warn("No audio data recorded");
            isRecordingRef.current = false;
            updateInstructionText("");
            return;
          }
          
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          stream.getTracks().forEach(track => track.stop());
          await sendVoiceToBackend(audioBlob);
        };

        // Tự động dừng sau 5 giây
        setTimeout(() => {
          if (mediaRecorder.state === "recording") {
            mediaRecorder.stop();
            updateInstructionText("⏳ Đang xử lý yêu cầu...");
          }
        }, 5000);
      } catch (err) {
        console.error("Lỗi cấp quyền mic:", err);
        isRecordingRef.current = false;
        updateInstructionText("❌ Không thể truy cập microphone");
        setTimeout(() => updateInstructionText(""), 2000);
        await speakText("Không thể truy cập microphone, vui lòng kiểm tra quyền truy cập");
      }
    }

    async function sendVoiceToBackend(audioBlob) {
      const formData = new FormData();
      formData.append("file", audioBlob, "voice.webm");

      try {
        console.log("Sending voice to backend...");
        const response = await fetch(`${API_BASE_URL}/api/voice-chat`, {
          method: "POST",
          body: formData
        });
        
        const data = await response.json();
        console.log("Backend response:", data);
        
        // Xử lý intent order / command / QA
        if (data.intent === "order") {
          // Phát giọng nói từ text response
          if (data.tro_ly_tra_loi) {
            await speakText(data.tro_ly_tra_loi);
          } else {
            await speakText("Đã chốt đơn thành công: " + data.order_summary);
          }
          
        } else if (data.intent === "command") {
          // Phát giọng nói trước khi thực hiện command
          if (data.tro_ly_tra_loi) {
            await speakText(data.tro_ly_tra_loi);
          }
          
          // Thực hiện command
          if (data.action === "rotate") {
            placedModels.forEach(m => m.userData.isRotating = true);
          } else if (data.action === "stop") {
            placedModels.forEach(m => m.userData.isRotating = false);
          } else if (data.action === "delete") {
            placedModels.forEach(m => scene.remove(m));
            placedModels.splice(0, placedModels.length);
            if (rotateKichHoatTimeoutRef.current) clearTimeout(rotateKichHoatTimeoutRef.current);
          }
          
        } else if (data.intent === "qa") {
          // Phát câu trả lời bằng giọng nói
          if (data.tro_ly_tra_loi) {
            await speakText(data.tro_ly_tra_loi);
          } else {
            await speakText("Xin lỗi, tôi chưa hiểu câu hỏi của bạn.");
          }
        }
        
        // Reset trạng thái recording
        isRecordingRef.current = false;
        
      } catch (err) {
        console.error("Lỗi giao tiếp backend:", err);
        isRecordingRef.current = false;
        updateInstructionText("❌ Lỗi kết nối server");
        setTimeout(() => updateInstructionText(""), 3000);
        await speakText("Xin lỗi, có lỗi kết nối server. Vui lòng thử lại sau.");
      }
    }

    function activateVoiceAssistant() {
      if (isRecordingRef.current) return;
      if (isVoicePlayingRef.current) {
        stopSpeaking();
        setTimeout(() => activateVoiceAssistant(), 500);
        return;
      }
      
      isRecordingRef.current = true;
      updateInstructionText("🎤 Frog đang lắng nghe...");
      
      // Phát "Tôi đang lắng nghe" bằng Web Speech
      speakText("Tôi đang lắng nghe", () => {
        startRecordingVoice();
      }).catch(() => {
        startRecordingVoice();
      });
    }
    // =====================================================

    // ================== CÁC HÀM UI (text sprite) ==================
    function wrapText(context, text, maxWidth) {
      const words = text.split(" ");
      const lines = [];
      let currentLine = words[0];
      for (let i = 1; i < words.length; i++) {
        let word = words[i];
        let width = context.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
          currentLine += " " + word;
        } else {
          lines.push(currentLine);
          currentLine = word;
        }
      }
      lines.push(currentLine);
      return lines;
    }

    function updateInstructionText(text) {
      if (!text) {
        if (textSprite) textSprite.visible = false;
        return;
      }
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.width = 1024;
      canvas.height = 512;
      const padding = 40;
      const maxWidth = canvas.width - padding * 2;
      const lineHeight = 55;
      
      context.font = "bold 42px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      const lines = wrapText(context, text, maxWidth);
      const boxHeight = lines.length * lineHeight + padding * 2;
      const boxY = (canvas.height - boxHeight) / 2;
      
      context.shadowColor = "rgba(0, 0, 0, 0.6)";
      context.shadowBlur = 6;
      context.shadowOffsetX = 3;
      context.shadowOffsetY = 3;
      context.fillStyle = "#FFFFFF";
      context.textAlign = "center";
      context.textBaseline = "top";
      context.clearRect(0, 0, canvas.width, canvas.height);
      
      lines.forEach((line, index) => {
        const textY = boxY + padding + index * lineHeight;
        context.fillText(line, canvas.width / 2, textY);
      });

      const texture = new THREE.CanvasTexture(canvas);
      texture.minFilter = THREE.LinearFilter;

      if (!textSprite) {
        const material = new THREE.SpriteMaterial({ 
          map: texture, depthTest: false, depthWrite: false, transparent: true, opacity: 0 
        });
        textSprite = new THREE.Sprite(material);
        textSprite.position.set(0, 0.6, -1);
        textSprite.scale.set(0.8, 0.4, 1);
        textSprite.renderOrder = 99999;
        if (camera) camera.add(textSprite);
      } else {
        if (textSprite.material.map) textSprite.material.map.dispose();
        textSprite.material.map = texture;
        textSprite.material.opacity = 0;
        textSprite.visible = true;
        textSprite.position.set(0, 0.6, -1);
      }
    }

    const scheduleRotateKichHoat = () => {
      if (rotateKichHoatTimeoutRef.current) clearTimeout(rotateKichHoatTimeoutRef.current);
      rotateKichHoatTimeoutRef.current = setTimeout(() => {
        if (hasPlacedObjectRef.current && !isVoicePlayingRef.current) {
          playVoiceIfIdle("Chạm hai lần vào sản phẩm để xoay", hasPlayedXoayKichHoatRef);
        }
      }, 10000);
    };

    // ================== TƯƠNG TÁC AR ==================
    let isDragging = false;
    let currentTouchedObject = null;
    let previousPinchDistance = 0;
    const touchRaycaster = new THREE.Raycaster();
    const touchMouse = new THREE.Vector2();

    function getIntersects(event) {
      if (event.touches.length > 0 && camera) {
        touchMouse.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
        touchMouse.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
        touchRaycaster.setFromCamera(touchMouse, camera);
        return touchRaycaster.intersectObjects(placedModels, true);
      }
      return [];
    }

    // ================== LẮNG NGHE CHẠM 5 LẦN Ở GÓC PHẢI DƯỚI ==================
    function isInBottomRightCorner(x, y) {
      const cornerSize = 150;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      return (x > windowWidth - cornerSize && y > windowHeight - cornerSize);
    }

    function setupTapToActivate() {
      const handleTap = (e) => {
        const touch = e.touches[0];
        if (!touch) return;
        
        const { clientX, clientY } = touch;
        
        if (!isInBottomRightCorner(clientX, clientY)) return;
        if (isRecordingRef.current) return;
        
        isCountingTapRef.current = true;
        
        if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
        tapCountRef.current += 1;
        
        if (tapCountRef.current === 1) {
          updateInstructionText("👆 Chạm thêm 4 lần vào góc phải dưới để gọi Frog...");
          setTimeout(() => {
            if (tapCountRef.current < 5) updateInstructionText("");
          }, 1000);
        } else if (tapCountRef.current > 1 && tapCountRef.current < 5) {
          updateInstructionText(`👆 Còn ${5 - tapCountRef.current} lần chạm nữa...`);
          setTimeout(() => {
            if (tapCountRef.current < 5) updateInstructionText("");
          }, 800);
        }
        
        tapTimerRef.current = setTimeout(() => {
          tapCountRef.current = 0;
          isCountingTapRef.current = false;
          updateInstructionText("");
        }, 500);
        
        if (tapCountRef.current === 5) {
          tapCountRef.current = 0;
          isCountingTapRef.current = false;
          if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
          updateInstructionText("");
          activateVoiceAssistant();
        }
      };
      
      window.addEventListener('touchstart', handleTap);
      return () => window.removeEventListener('touchstart', handleTap);
    }
    // =====================================================

    function init() {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);
      scene.add(camera);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.xr.enabled = true;
      if (mountNode) mountNode.appendChild(renderer.domElement);

      renderer.xr.addEventListener("sessionstart", async () => {
        greetingDoneRef.current = false;
        planeFoundPlayedRef.current = false;
        hasPlacedObjectRef.current = false;
        hasPlayedDoiViTriRef.current = false;
        hasPlayedRotateSuccessRef.current = false;
        placedModels = [];
        
        if (rotateKichHoatTimeoutRef.current) clearTimeout(rotateKichHoatTimeoutRef.current);
        isVoicePlayingRef.current = false;
        
        updateInstructionText("📱 Vui lòng di chuyển camera xung quanh để nhận diện mặt phẳng");
        
        if (!hasPlayedXinChaoRef.current) {
          hasPlayedXinChaoRef.current = true;
          await speakText("Xin chào, tôi là trợ lý ảo. Hãy di chuyển camera để tôi thấy mặt phẳng.");
          greetingDoneRef.current = true;
        }
      });

      renderer.xr.addEventListener("sessionend", () => {
        updateInstructionText("");
        if (loopTimeoutRef.current) clearTimeout(loopTimeoutRef.current);
        if (rotateKichHoatTimeoutRef.current) clearTimeout(rotateKichHoatTimeoutRef.current);
      });

      const arButton = ARButton.createButton(renderer, {
        requiredFeatures: ["hit-test"],
        optionalFeatures: ["dom-overlay"],
        domOverlay: { root: overlayRef.current },
      });
      arButton.style.zIndex = "10000";
      document.body.appendChild(arButton);

      const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
      scene.add(light);

      const geometry = new THREE.RingGeometry(0.1, 0.12, 32).rotateX(-Math.PI / 2);
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      reticle = new THREE.Mesh(geometry, material);
      reticle.matrixAutoUpdate = false;
      reticle.visible = false;
      scene.add(reticle);

      controller = renderer.xr.getController(0);
      controller.addEventListener("select", onSelect);
      scene.add(controller);

      window.addEventListener("resize", onResize);

      const overlayEl = overlayRef.current;
      if (overlayEl) {
        overlayEl.addEventListener("touchstart", (e) => {
          if (e.touches.length === 1) {
            const intersects = getIntersects(e);
            if (intersects.length > 0) {
              let rootModel = intersects[0].object;
              while (rootModel.parent && !placedModels.includes(rootModel)) {
                rootModel = rootModel.parent;
              }
              currentTouchedObject = rootModel;
            } else {
              currentTouchedObject = null;
            }
          } else if (e.touches.length === 2) {
            isDragging = true;
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            previousPinchDistance = Math.hypot(dx, dy);
          }
        });

        overlayEl.addEventListener("touchmove", (e) => {
          if (!currentTouchedObject) return;
          if (e.touches.length === 2) {
            isDragging = true;
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            const distance = Math.hypot(dx, dy);
            
            const scaleDiff = (distance - previousPinchDistance) * 0.005;
            const currentScale = currentTouchedObject.scale.x;
            const newScale = currentScale + scaleDiff;

            if (newScale > 0.05 && newScale < 5) {
              currentTouchedObject.scale.set(newScale, newScale, newScale);
            }
            previousPinchDistance = distance;
          }
        });

        overlayEl.addEventListener("touchend", (e) => {
          if (e.touches.length === 0) {
            currentTouchedObject = null;
            setTimeout(() => {
              isDragging = false;
            }, 100);
          }
        });
      }

      async function onSelect(event) {
        if (isDragging || isCountingTapRef.current) return;

        const controller = event.target;
        const raycaster = new THREE.Raycaster();
        
        const matrix = new THREE.Matrix4();
        matrix.extractRotation(controller.matrixWorld);
        raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
        raycaster.ray.direction.set(0, 0, -1).applyMatrix4(matrix);

        const intersects = raycaster.intersectObjects(placedModels, true);

        if (intersects.length > 0) {
          let hitObject = intersects[0].object;
          let rootModel = hitObject;
          while (rootModel.parent && !placedModels.includes(rootModel)) {
            rootModel = rootModel.parent;
          }

          if (placedModels.includes(rootModel)) {
            const now = Date.now();
            const timeDiff = now - (rootModel.userData.lastTapTime || 0);

            if (timeDiff < 600) {
              rootModel.userData.tapCount += 1;
            } else {
              rootModel.userData.tapCount = 1;
            }
            rootModel.userData.lastTapTime = now;

            if (rootModel.userData.tapCount === 2) {
              const wasRotating = rootModel.userData.isRotating;
              rootModel.userData.isRotating = !wasRotating;
              if (!wasRotating && rootModel.userData.isRotating && !hasPlayedRotateSuccessRef.current) {
                hasPlayedRotateSuccessRef.current = true;
                await playVoiceIfIdle("Sản phẩm đang xoay, chạm hai lần để dừng", hasPlayedXoayThanhCongRef);
              }
            } else if (rootModel.userData.tapCount === 3) {
              scene.remove(rootModel);
              placedModels = placedModels.filter((m) => m !== rootModel);
              if (placedModels.length === 0) {
                hasPlayedRotateSuccessRef.current = false;
                if (rotateKichHoatTimeoutRef.current) clearTimeout(rotateKichHoatTimeoutRef.current);
              }
              await speakText("Đã xóa sản phẩm");
            }
            return;
          }
        }

        if (!reticle.visible) return;

        hasPlacedObjectRef.current = true;
        updateInstructionText("");

        if (loopTimeoutRef.current) clearTimeout(loopTimeoutRef.current);

        const loader = new GLTFLoader();
        loader.load("/model3d/model.glb", (gltf) => {
          const model = gltf.scene;
          model.scale.set(0.5, 0.5, 0.5);

          const position = new THREE.Vector3();
          position.setFromMatrixPosition(reticle.matrix);
          model.position.copy(position);
          
          model.userData = { tapCount: 0, lastTapTime: 0, isRotating: false };

          scene.add(model);
          placedModels.push(model);

          scheduleRotateKichHoat();

          if (placedModels.length >= 2 && !hasPlayedDoiViTriRef.current) {
            hasPlayedDoiViTriRef.current = true;
            playVoiceIfIdle("Chạm ba lần vào sản phẩm để xóa", hasPlayedDoiViTriVoiceRef);
          }
        });
      }
    }

    function animate() {
      renderer.setAnimationLoop(render);
    }

    function render(_, frame) {
      placedModels.forEach((model) => {
        if (model.userData && model.userData.isRotating) {
          model.rotation.y += 0.03;
        }
      });

      if (textSprite && textSprite.visible && textSprite.material.opacity < 1) {
        textSprite.material.opacity += 0.06;
      }

      if (frame) {
        const referenceSpace = renderer.xr.getReferenceSpace();
        const session = renderer.xr.getSession();

        if (!hitTestSourceRequested) {
          session.requestReferenceSpace("viewer").then((viewerSpace) => {
            session.requestHitTestSource({ space: viewerSpace }).then((source) => {
              hitTestSource = source;
            });
          });

          session.addEventListener("end", () => {
            hitTestSourceRequested = false;
            hitTestSource = null;
          });

          hitTestSourceRequested = true;
        }

        if (hitTestSource) {
          const hitTestResults = frame.getHitTestResults(hitTestSource);

          if (hitTestResults.length > 0) {
            const hit = hitTestResults[0];
            const pose = hit.getPose(referenceSpace);

            reticle.visible = true;
            reticle.matrix.fromArray(pose.transform.matrix);

            if (greetingDoneRef.current && !planeFoundPlayedRef.current) {
              planeFoundPlayedRef.current = true;
              playVoiceIfIdle("Đã nhận diện mặt phẳng thành công", hasPlayedNhanDienRef).then(() => {
                if (!hasPlacedObjectRef.current && !hasPlayedVongTronXanhRef.current) {
                  hasPlayedVongTronXanhRef.current = true;
                  speakText("Chạm vào vòng tròn xanh để đặt sản phẩm");
                  updateInstructionText("🟢 Chạm vào vòng tròn xanh để đặt vật phẩm");
                  
                  // Loop nhắc nhở nếu chưa đặt sản phẩm
                  if (!hasPlacedObjectRef.current) {
                    loopTimeoutRef.current = setTimeout(() => {
                      if (!hasPlacedObjectRef.current) {
                        updateInstructionText("🟢 Chạm vào vòng tròn xanh để đặt vật phẩm");
                      }
                    }, 30000);
                  }
                }
              });
            }
          } else {
            reticle.visible = false;
          }
        }
      }
      renderer.render(scene, camera);
    }

    function onResize() {
      if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
    }

    init();
    animate();

    const removeTapListener = setupTapToActivate();

    return () => {
      removeTapListener();
      stopSpeaking();
      window.removeEventListener("resize", onResize);
      const existingARButton = document.getElementById("ARButton");
      if (existingARButton) existingARButton.remove();

      if (loopTimeoutRef.current) clearTimeout(loopTimeoutRef.current);
      if (rotateKichHoatTimeoutRef.current) clearTimeout(rotateKichHoatTimeoutRef.current);

      if (textSprite) {
        if (textSprite.material.map) textSprite.material.map.dispose();
        textSprite.material.dispose();
      }

      if (renderer) {
        renderer.setAnimationLoop(null);
        renderer.dispose();
      }
      if (mountNode && renderer?.domElement) {
        mountNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div ref={mountRef} style={{ width: "100vw", height: "100vh" }} />
  );
}