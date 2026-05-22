import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { ARButton } from 'three/examples/jsm/webxr/ARButton';

const ARView = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const containerRef = useRef();

  useEffect(() => {
    let container, scene, camera, renderer, reticle, model;
    let hitTestSource = null;
    let hitTestSourceRequested = false;

    const init = async () => {
      container = document.createElement('div');
      containerRef.current.appendChild(container);

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);

      const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
      scene.add(light);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.xr.enabled = true;
      container.appendChild(renderer.domElement);

      // Tạo vòng tròn xanh (Reticle) để xác định điểm đặt
      reticle = new THREE.Mesh(
        new THREE.RingGeometry(0.15, 0.2, 32).rotateX(-Math.PI / 2),
        new THREE.MeshBasicMaterial({ color: 0x00ff00 }) // Màu xanh lá
      );
      reticle.matrixAutoUpdate = false;
      reticle.visible = false;
      scene.add(reticle);

      // Load Model từ API (giả định cấu trúc path như trước)
      const loader = new GLTFLoader();
      // Fetch thông tin model từ API dựa vào slug
      fetch(`https://localhost:3000/dev/api/v1/products/${slug}`)
        .then(res => res.json())
        .then(json => {
          loader.load(json.data.models[0].model_url, (gltf) => {
            model = gltf.scene;
          });
        });

      document.body.appendChild(ARButton.createButton(renderer, { requiredFeatures: ['hit-test'] }));

      // Sự kiện chạm màn hình để đặt ghế
      const controller = renderer.xr.getController(0);
      controller.addEventListener('select', () => {
        if (reticle.visible && model) {
          const spawnModel = model.clone();
          spawnModel.position.setFromMatrixPosition(reticle.matrix);
          scene.add(spawnModel);
        }
      });
      scene.add(controller);

      renderer.setAnimationLoop(render);
    };

    const render = (timestamp, frame) => {
      if (frame) {
        const referenceSpace = renderer.xr.getReferenceSpace();
        const session = renderer.xr.getSession();

        if (hitTestSourceRequested === false) {
          session.requestReferenceSpace('viewer').then((referenceSpace) => {
            session.requestHitTestSource({ space: referenceSpace }).then((source) => {
              hitTestSource = source;
            });
          });
          hitTestSourceRequested = true;
        }

        if (hitTestSource) {
          const hitTestResults = frame.getHitTestResults(hitTestSource);
          if (hitTestResults.length) {
            const hit = hitTestResults[0];
            reticle.visible = true;
            reticle.matrix.fromArray(hit.getPose(referenceSpace).transform.matrix);
          } else {
            reticle.visible = false;
          }
        }
      }
      renderer.render(scene, camera);
    };

    init();

    return () => {
      // Cleanup khi thoát trang
      if (containerRef.current) containerRef.current.innerHTML = '';
      const button = document.getElementById('ARButton');
      if (button) button.remove();
    };
  }, [slug]);

  return (
    <div ref={containerRef}>
      <button 
        onClick={() => navigate(-1)} 
        style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 999, padding: '10px' }}
      >
        Quay lại
      </button>
    </div>
  );
};

export default ARView;