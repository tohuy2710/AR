import { useEffect, useRef } from "react";
import * as THREE from "three";
import { ARButton } from "three/examples/jsm/webxr/ARButton.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default function App() {
  const mountRef = useRef(null);
  const overlayRef = useRef(null);

  // Các cờ trạng thái hệ thống
  const greetingDoneRef = useRef(false);
  const planeFoundPlayedRef = useRef(false);
  const hasPlacedObjectRef = useRef(false);
  const loopTimeoutRef = useRef(null);
  const hasPlayedDoiViTriRef = useRef(false);
  
  // Các cờ cho tính năng voice xoay
  const rotateKichHoatTimeoutRef = useRef(null);
  const isVoicePlayingRef = useRef(false);
  const hasPlayedRotateSuccessRef = useRef(false);

  useEffect(() => {
    let scene, camera, renderer;
    let controller;
    let reticle;
    let hitTestSource = null;
    let hitTestSourceRequested = false;

    let placedModels = [];
    let textSprite = null; // Quản lý đối tượng Text 3D HUD

    const audioXinChao = new Audio("/voice/xin_chao.mp3");
    const audioNhanDien = new Audio("/voice/nhan_dien_thanh_cong.mp3");
    const audioVongTronXanh = new Audio("/voice/vong_tron_xanh.mp3");
    const audioDoiViTri = new Audio("/voice/doi_vi_tri.mp3");
    const audioXoayKichHoat = new Audio("/voice/xoay_kich_hoat.mp3");
    const audioXoayThanhCong = new Audio("/voice/xoay_thanh_cong.mp3");

    // Hàm tự động xuống dòng khi text quá dài trên Canvas
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

    // Hàm khởi tạo/cập nhật Text 3D chất lượng cao bám theo góc nhìn Camera
    // Modified: removed background color, text positioned higher on screen
    function updateInstructionText(text) {
      if (!text) {
        if (textSprite) textSprite.visible = false;
        return;
      }

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      
      // Khởi tạo kích thước canvas lớn để chữ sắc nét, không bị vỡ hạt (pixelated)
      canvas.width = 1024;
      canvas.height = 512;

      const padding = 40;
      const maxWidth = canvas.width - padding * 2;
      const lineHeight = 55;
      
      context.font = "bold 42px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      
      // Tính toán số dòng thực tế để co giãn chiều cao Box Background tự động
      const lines = wrapText(context, text, maxWidth);
      const boxHeight = lines.length * lineHeight + padding * 2;
      const boxWidth = canvas.width - padding * 2;
      
      // Tọa độ vẽ Box căn giữa canvas (vẫn giữ để tính toán vị trí text)
      const boxX = padding;
      const boxY = (canvas.height - boxHeight) / 2;
      
      // 1. BACKGROUND REMOVED: Không vẽ khung nền màu đen. Chỉ giữ lại nền trong suốt.
      // context.fillStyle = "rgba(0, 0, 0, 0.75)"; // Đã xóa theo yêu cầu
      
      // 2. Cấu hình Hiệu ứng Đổ bóng chữ (Subtle Text Shadow) nhằm tăng cực đại độ tương phản
      context.shadowColor = "rgba(0, 0, 0, 0.6)";
      context.shadowBlur = 6;
      context.shadowOffsetX = 3;
      context.shadowOffsetY = 3;

      // 3. Vẽ Text đa dòng (Pure White, Center Align)
      context.fillStyle = "#FFFFFF";
      context.textAlign = "center";
      context.textBaseline = "top";

      // Xóa canvas trước khi vẽ để đảm bảo nền trong suốt
      context.clearRect(0, 0, canvas.width, canvas.height);
      
      lines.forEach((line, index) => {
        const textY = boxY + padding + index * lineHeight;
        context.fillText(line, canvas.width / 2, textY);
      });

      const texture = new THREE.CanvasTexture(canvas);
      texture.minFilter = THREE.LinearFilter;

      if (!textSprite) {
        // Sử dụng depthTest/depthWrite = false để text luôn đè lên vật thể 3D trong không gian
        const material = new THREE.SpriteMaterial({ 
          map: texture, 
          depthTest: false, 
          depthWrite: false,
          transparent: true,
          opacity: 0 // Khởi tạo bằng 0 để chạy hiệu ứng Fade-in
        });
        textSprite = new THREE.Sprite(material);
        
        // Vị trí: x=0 (Căn giữa ngang), y được tăng lên 0.6 để đưa text lên cao hơn trên màn hình, z=-1 (Cách mắt 1 mét)
        textSprite.position.set(0, 0.6, -1); 
        textSprite.scale.set(0.8, 0.4, 1);
        textSprite.renderOrder = 99999; // Đảm bảo lớp hiển thị cao nhất vượt trên tất cả layer khác
        
        if (camera) camera.add(textSprite);
      } else {
        if (textSprite.material.map) textSprite.material.map.dispose();
        textSprite.material.map = texture;
        textSprite.material.opacity = 0; // Reset opacity về 0 để kích hoạt lại fade-in khi đổi text
        textSprite.visible = true;
        // Cập nhật vị trí lên cao hơn nếu textSprite đã tồn tại
        textSprite.position.set(0, 0.6, -1);
      }
    }

    audioXinChao.addEventListener("ended", () => {
      greetingDoneRef.current = true;
      updateInstructionText(""); 
    });

    audioNhanDien.addEventListener("ended", () => {
      if (!hasPlacedObjectRef.current) {
        updateInstructionText("Chạm vào vòng tròn xanh để đặt vật phẩm");
        audioVongTronXanh.play().catch((e) => console.warn(e));
      }
    });

    audioVongTronXanh.addEventListener("ended", () => {
      updateInstructionText(""); 
      if (!hasPlacedObjectRef.current) {
        loopTimeoutRef.current = setTimeout(() => {
          if (!hasPlacedObjectRef.current) {
            updateInstructionText("Chạm vào vòng tròn xanh để đặt vật phẩm");
            audioVongTronXanh.play().catch((e) => console.warn(e));
          }
        }, 30000);
      }
    });

    const playVoiceIfIdle = (audio, text = "") => {
      if (!isVoicePlayingRef.current) {
        isVoicePlayingRef.current = true;
        if (text) updateInstructionText(text);
        
        audio.play().catch((e) => console.warn(e));
        audio.addEventListener("ended", () => {
          isVoicePlayingRef.current = false;
          updateInstructionText(""); 
        }, { once: true });
      }
    };

    const scheduleRotateKichHoat = () => {
      if (rotateKichHoatTimeoutRef.current) clearTimeout(rotateKichHoatTimeoutRef.current);

      rotateKichHoatTimeoutRef.current = setTimeout(() => {
        if (hasPlacedObjectRef.current && !isVoicePlayingRef.current) {
          playVoiceIfIdle(audioXoayKichHoat, "Chạm 2 lần vào sản phẩm để xoay");
        }
      }, 10000);
    };

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

    init();
    animate();

    function init() {
      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        0.01,
        20
      );
      
      // Bắt buộc add camera vào scene để các object con (như textSprite HUD) hiển thị theo tầm nhìn
      scene.add(camera);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.xr.enabled = true;

      mountRef.current.appendChild(renderer.domElement);

      renderer.xr.addEventListener("sessionstart", () => {
        greetingDoneRef.current = false;
        planeFoundPlayedRef.current = false;
        hasPlacedObjectRef.current = false;
        hasPlayedDoiViTriRef.current = false;
        hasPlayedRotateSuccessRef.current = false; 
        placedModels = [];
        
        if (rotateKichHoatTimeoutRef.current) clearTimeout(rotateKichHoatTimeoutRef.current);
        isVoicePlayingRef.current = false;
        
        updateInstructionText("Vui lòng di chuyển camera xung quanh để ứng dụng nhận diện mặt phẳng");
        audioXinChao.play().catch((e) => console.warn(e));
      });

      renderer.xr.addEventListener("sessionend", () => {
        audioXinChao.pause(); audioXinChao.currentTime = 0;
        audioNhanDien.pause(); audioNhanDien.currentTime = 0;
        audioVongTronXanh.pause(); audioVongTronXanh.currentTime = 0;
        audioDoiViTri.pause(); audioDoiViTri.currentTime = 0;
        audioXoayKichHoat.pause(); audioXoayKichHoat.currentTime = 0;
        audioXoayThanhCong.pause(); audioXoayThanhCong.currentTime = 0;
        
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

      function onSelect(event) {
        if (isDragging) return;

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
                playVoiceIfIdle(audioXoayThanhCong, "Chạm 2 lần để dừng xoay");
              }
            } 
            else if (rootModel.userData.tapCount === 3) {
              scene.remove(rootModel);
              placedModels = placedModels.filter((m) => m !== rootModel);
              
              if (placedModels.length === 0) {
                hasPlayedRotateSuccessRef.current = false;
                if (rotateKichHoatTimeoutRef.current) {
                  clearTimeout(rotateKichHoatTimeoutRef.current);
                }
              }
            }
            return;
          }
        }

        if (!reticle.visible) return;

        hasPlacedObjectRef.current = true;
        audioVongTronXanh.pause();
        audioVongTronXanh.currentTime = 0;
        updateInstructionText(""); 

        if (loopTimeoutRef.current) clearTimeout(loopTimeoutRef.current);

        const loader = new GLTFLoader();
        loader.load("/model3d/model.glb", (gltf) => {
          const model = gltf.scene;
          model.scale.set(0.5, 0.5, 0.5);

          const position = new THREE.Vector3();
          position.setFromMatrixPosition(reticle.matrix);
          model.position.copy(position);
          
          model.userData = { 
            tapCount: 0, 
            lastTapTime: 0, 
            isRotating: false 
          };

          scene.add(model);
          placedModels.push(model);

          scheduleRotateKichHoat();

          if (placedModels.length >= 2 && !hasPlayedDoiViTriRef.current) {
            hasPlayedDoiViTriRef.current = true;
            playVoiceIfIdle(audioDoiViTri, "Chạm 3 lần vào vật phẩm để xoá");
          }
        });
      }
    }

    function animate() {
      renderer.setAnimationLoop(render);
    }

    function render(_, frame) {
      // 1. Xử lý xoay model tự động
      placedModels.forEach((model) => {
        if (model.userData && model.userData.isRotating) {
          model.rotation.y += 0.03;
        }
      });

      // 2. Hiệu ứng Smooth Fade-in cho Text Overlay bằng cách tịnh tiến opacity qua từng frame
      if (textSprite && textSprite.visible && textSprite.material.opacity < 1) {
        textSprite.material.opacity += 0.06; // Tốc độ fade-in mượt mà, vừa phải
      }

      // 3. Tính toán Hit-test mặt phẳng
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
              playVoiceIfIdle(audioNhanDien); 
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

    return () => {
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
      if (mountRef.current && renderer?.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <>
      <div ref={mountRef} style={{ width: "100vw", height: "100vh" }} />

      <div
        ref={overlayRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "auto", 
          touchAction: "none"
        }}
      >
        <img
          src="/frog/frog_default.gif"
          alt="Trợ lý ếch"
          style={{
            position: "absolute",
            bottom: "20px",
            right: "20px",
            width: "60px",
            height: "auto",
            zIndex: 1000,
            pointerEvents: "none",
          }}
        />
      </div>
    </>
  );
}