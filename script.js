const container = document.getElementById("circle-container");

// Tạo 10 ảnh gắn lên vòng tròn
const images = [
  "img/earth.jpg", "img/1.JPG", "img/2.JPG", "img/3.JPG", "img/img5.jpg",
  "img/img6.jpg", "img/img7.jpg", "img/img8.jpg", "img/img9.jpg", "img/img10.jpg"
];

const total = images.length;
const radius = 150; // bán kính vòng tròn
const centerX = 200;
const centerY = 200;

images.forEach((src, i) => {
  const angle = (i / total) * 2 * Math.PI;
  const img = document.createElement("img");
  img.src = src;
  const x = centerX + radius * Math.cos(angle) - 40;
  const y = centerY + radius * Math.sin(angle) - 40;
  img.style.left = x + "px";
  img.style.top = y + "px";
  container.appendChild(img);
});

// Tim bay lãng mạn
const heartContainer = document.getElementById("heart-container");

function createHeart() {
  const heart = document.createElement("div");
  heart.className = "heart";

  // Màu và kích thước ngẫu nhiên
  const colors = ["#ff6699", "#ff3366", "#ff99cc", "#ffffff", "#cc33ff"];
  heart.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
  const size = Math.random() * 10 + 10;
  heart.style.width = size + "px";
  heart.style.height = size + "px";

  heart.style.left = Math.random() * 100 + "vw";
  heart.style.animationDuration = 3 + Math.random() * 2 + "s";

  heartContainer.appendChild(heart);
  setTimeout(() => heart.remove(), 5000);
}

setInterval(createHeart, 300);
