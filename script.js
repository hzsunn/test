let controls;
controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // làm chuyển động mượt
controls.dampingFactor = 0.05;
controls.minDistance = 10;     // không zoom quá gần
controls.maxDistance = 100;    // không zoom quá xa
controls.enablePan = false;    // không cho kéo ngang dọc
function animate() {
  requestAnimationFrame(animate);

  earth.rotation.y += 0.002;

  satellites.forEach(sat => {
    sat.userData.angle += sat.userData.speed;
    const angle = sat.userData.angle;
    const r = sat.userData.radius;
    const tilt = sat.userData.tilt;
    const x = Math.cos(angle) * r;
    const z = Math.sin(angle) * r;
    const y = Math.sin(angle * 2) * tilt * 10;
    sat.position.set(x, y, z);
    sat.lookAt(earth.position);
  });

  stars.rotation.y += 0.0005;
  ringText.rotation.z += 0.002;

  controls.update(); // << THÊM DÒNG NÀY

  renderer.render(scene, camera);
}
const container = document.getElementById('container');

let scene, camera, renderer;
let earth, satellites = [];
const satelliteCount = 10;
let stars;
const orbits = [];
let ringText;

init();
animate();

function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    75, window.innerWidth / window.innerHeight, 0.1, 1000
  );
  camera.position.set(0, 15, 35);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0xffffff, 0.6));
  const light = new THREE.PointLight(0xffffff, 1);
  light.position.set(50, 50, 50);
  scene.add(light);

  const loader = new THREE.TextureLoader();
  const earthTexture = loader.load('img/earth.jpg');
  const earthGeometry = new THREE.SphereGeometry(5, 64, 64);
  const earthMaterial = new THREE.MeshStandardMaterial({ map: earthTexture });
  earth = new THREE.Mesh(earthGeometry, earthMaterial);
  scene.add(earth);

  // Vệ tinh + quỹ đạo
  for (let i = 1; i <= satelliteCount; i++) {
    const satTexture = loader.load(`img/sat${i}.JPG`);
    const satMaterial = new THREE.MeshBasicMaterial({
      map: satTexture,
      transparent: true,
      side: THREE.DoubleSide
    });
    const satGeometry = new THREE.PlaneGeometry(2, 2);
    const satMesh = new THREE.Mesh(satGeometry, satMaterial);

    const radius = 8 + i * 0.5;
    satMesh.userData = {
      radius: radius,
      angle: (i / satelliteCount) * Math.PI * 2,
      speed: 0.005 + i * 0.001,
      tilt: (Math.random() * 0.6 - 0.3)
    };
    satellites.push(satMesh);
    scene.add(satMesh);

    // Tạo đường tròn quỹ đạo
    const points = [];
    for (let j = 0; j <= 64; j++) {
      const theta = (j / 64) * 2 * Math.PI;
      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;
      points.push(new THREE.Vector3(x, 0, z));
    }
    const orbitGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const orbitMaterial = new THREE.LineBasicMaterial({ color: 0x888888 });
    const orbitLine = new THREE.LineLoop(orbitGeometry, orbitMaterial);
    scene.add(orbitLine);
    orbits.push(orbitLine);
  }

  // Nền sao
  const starGeometry = new THREE.BufferGeometry();
  const starPositions = [];
  for (let i = 0; i < 1000; i++) {
    const x = (Math.random() - 0.5) * 200;
    const y = (Math.random() - 0.5) * 200;
    const z = (Math.random() - 0.5) * 200;
    starPositions.push(x, y, z);
  }
  starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
  const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.7 });
  stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);

  // Chữ chạy quanh trái đất
  const ringTextTexture = createTextTexture("🌍 YÊU HUYỀN RẤT NHIỀU 🌍 ");
  const ringMaterial = new THREE.MeshBasicMaterial({ map: ringTextTexture, transparent: true });
  const ringGeometry = new THREE.RingGeometry(5.8, 6, 128);
  ringText = new THREE.Mesh(ringGeometry, ringMaterial);
  ringText.rotation.x = -Math.PI / 2;
  ringText.rotation.z = Math.PI / 2;
  scene.add(ringText);

  // Resize
  window.addEventListener('resize', onWindowResize, false);
}

function animate() {
  requestAnimationFrame(animate);

  earth.rotation.y += 0.002;

  satellites.forEach(sat => {
    sat.userData.angle += sat.userData.speed;
    const angle = sat.userData.angle;
    const r = sat.userData.radius;
    const tilt = sat.userData.tilt;
    const x = Math.cos(angle) * r;
    const z = Math.sin(angle) * r;
    const y = Math.sin(angle * 2) * tilt * 10;
    sat.position.set(x, y, z);
    sat.lookAt(earth.position);
  });

  stars.rotation.y += 0.0005;

  // Quay chữ quanh Trái Đất
  ringText.rotation.z += 0.002;

  renderer.render(scene, camera);
}

function createTextTexture(text) {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = '48px Arial';
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.fillText(text.repeat(10), canvas.width / 2, canvas.height / 2 + 16);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 1);
  return texture;
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
