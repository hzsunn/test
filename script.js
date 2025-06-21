const container = document.getElementById('container');

let scene, camera, renderer;
let earth, satellites = [];
const satelliteCount = 10;
const starCount = 1000;
let stars = [];

init();
animate();

function init() {
  scene = new THREE.Scene();

  // Camera
  camera = new THREE.PerspectiveCamera(
    75, window.innerWidth / window.innerHeight, 0.1, 1000
  );
  camera.position.set(0, 15, 35);

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  // Ánh sáng
  scene.add(new THREE.AmbientLight(0xffffff, 0.6));
  const light = new THREE.PointLight(0xffffff, 1);
  light.position.set(50, 50, 50);
  scene.add(light);

  // Trái đất
  const textureLoader = new THREE.TextureLoader();
  const earthTexture = textureLoader.load('img/earth.jpg');
  const earthGeometry = new THREE.SphereGeometry(5, 64, 64);
  const earthMaterial = new THREE.MeshStandardMaterial({ map: earthTexture });
  earth = new THREE.Mesh(earthGeometry, earthMaterial);
  scene.add(earth);

  // Vệ tinh (10 ảnh)
  for (let i = 1; i <= satelliteCount; i++) {
    const satTexture = textureLoader.load(`img/sat${i}.JPG`);
    const satMaterial = new THREE.MeshBasicMaterial({
      map: satTexture,
      transparent: true,
      side: THREE.DoubleSide
    });
    const satGeometry = new THREE.PlaneGeometry(2, 2);
    const satMesh = new THREE.Mesh(satGeometry, satMaterial);

    // Gán thông tin quỹ đạo 3D nghiêng
    satMesh.userData = {
      radius: 8 + i * 0.5,
      angle: (i / satelliteCount) * Math.PI * 2,
      speed: 0.005 + i * 0.001,
      tilt: (Math.random() * 0.6 - 0.3) // độ nghiêng quỹ đạo
    };
    satellites.push(satMesh);
    scene.add(satMesh);
  }

  // Nền sao: nhiều điểm trắng nhỏ di chuyển
  const starGeometry = new THREE.BufferGeometry();
  const starPositions = [];

  for (let i = 0; i < starCount; i++) {
    const x = (Math.random() - 0.5) * 200;
    const y = (Math.random() - 0.5) * 200;
    const z = (Math.random() - 0.5) * 200;
    starPositions.push(x, y, z);
  }

  starGeometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(starPositions, 3)
  );

  const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.7 });
  const starField = new THREE.Points(starGeometry, starMaterial);
  scene.add(starField);

  stars = starField;

  // Resize
  window.addEventListener('resize', onWindowResize, false);
}

function animate() {
  requestAnimationFrame(animate);

  // Quay Trái Đất
  earth.rotation.y += 0.002;

  // Di chuyển vệ tinh theo quỹ đạo nghiêng
  satellites.forEach(sat => {
    sat.userData.angle += sat.userData.speed;
    const angle = sat.userData.angle;
    const r = sat.userData.radius;
    const tilt = sat.userData.tilt;

    const x = Math.cos(angle) * r;
    const z = Math.sin(angle) * r;
    const y = Math.sin(angle * 2) * tilt * 10; // nghiêng nhẹ theo sin

    sat.position.set(x, y, z);
    sat.lookAt(earth.position); // hướng về Trái Đất
  });

  // Quay sao nền nhẹ nhàng
  stars.rotation.y += 0.0005;

  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
