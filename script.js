const container = document.getElementById('container');
let scene, camera, renderer;
let stars = [], planet, textures = [];
let imageIndex = 0;

const imagePaths = [
  'img/1.jpg',
  'img/2.JPG',
  'img/3.JPG',
  // Thêm ảnh tại đây
];

init();
animate();

function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    75, window.innerWidth / window.innerHeight, 0.1, 1000
  );
  camera.position.z = 20;

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  // Tải ảnh làm texture
  const loader = new THREE.TextureLoader();
  imagePaths.forEach(path => {
    textures.push(loader.load(path));
  });

  // Tạo quả cầu địa cầu ở giữa
  const sphereGeometry = new THREE.SphereGeometry(5, 64, 64);
  const sphereMaterial = new THREE.MeshStandardMaterial({
    map: textures[0],
    roughness: 0.8,
    metalness: 0.3
  });
  planet = new THREE.Mesh(sphereGeometry, sphereMaterial);
  scene.add(planet);

  // Ánh sáng
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xffffff, 2);
  pointLight.position.set(50, 50, 50);
  scene.add(pointLight);

  // Tạo các ngôi sao bay xung quanh
  for (let i = 0; i < 500; i++) {
    const star = new THREE.Mesh(
      new THREE.SphereGeometry(0.05, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    resetStar(star);
    scene.add(star);
    stars.push(star);
  }

  // Cập nhật kích thước
  window.addEventListener('resize', onWindowResize, false);
}

function resetStar(star) {
  const radius = Math.random() * 50 + 10;
  const theta = Math.random() * 2 * Math.PI;
  const phi = Math.acos(2 * Math.random() - 1);

  star.position.setFromSphericalCoords(radius, phi, theta);
  star.userData = { velocity: Math.random() * 0.05 + 0.01 };
}

function animate() {
  requestAnimationFrame(animate);

  // Xoay hành tinh
  planet.rotation.y += 0.002;

  // Di chuyển các ngôi sao
  stars.forEach(star => {
    star.position.multiplyScalar(1 - star.userData.velocity);
    if (star.position.length() < 6) resetStar(star);
  });

  // Tự động đổi texture sau mỗi 6 giây
  const currentTime = Date.now();
  if (!window.lastImageChangeTime || currentTime - window.lastImageChangeTime > 6000) {
    imageIndex = (imageIndex + 1) % textures.length;
    planet.material.map = textures[imageIndex];
    window.lastImageChangeTime = currentTime;
  }

  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
