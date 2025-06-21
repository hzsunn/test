// Danh sách 10 ảnh trong thư mục "img"
const images = [
  "img/earth.jpg",
  "img/1.JPG",
  "img/2.JPG",
  "img/img4.jpg",
  "img/img5.jpg",
  "img/img6.jpg",
  "img/img7.jpg",
  "img/img8.jpg",
  "img/img9.jpg",
  "img/img10.jpg"
];

let index = 0;
const slideshow = document.getElementById("slideshow");

function showNextImage() {
  slideshow.classList.remove("show");
  setTimeout(() => {
    slideshow.src = images[index];
    slideshow.classList.add("show");
    index = (index + 1) % images.length;
  }, 500);
}

setInterval(showNextImage, 4000);
showNextImage();

// Tạo hiệu ứng trái tim bay
const heartContainer = document.getElementById("heart-container");

function createHeart() {
  const heart = document.createElement("div");
  heart.className = "heart";

  // Vị trí ngẫu nhiên
  heart.style.left = Math.random() * 100 + "vw";

  // Màu ngẫu nhiên
  const colors = ["#ff6699", "#ff3366", "#ff99cc", "#ffffff", "#cc33ff"];
  heart.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

  // Kích thước ngẫu nhiên
  const size = Math.random() * 10 + 10; // từ 10px đến 20px
  heart.style.width = size + "px";
  heart.style.height = size + "px";

  // Thêm hiệu ứng xoay hoặc nghiêng nhẹ
  heart.style.transform = `rotate(45deg) scale(${Math.random() * 0.5 + 0.8}) rotateZ(${Math.random() * 40 - 20}deg)`;

  // Thời gian bay ngẫu nhiên
  heart.style.animationDuration = 3 + Math.random() * 2 + "s";

  heartContainer.appendChild(heart);
  setTimeout(() => heart.remove(), 5000);
}
