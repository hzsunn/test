// Danh sách 10 ảnh (thay bằng link thật hoặc ảnh trong thư mục bạn)
const images = [
  "sat1.jpg", "sat2.JPG", "earth.jpg", "img4.jpg", "img5.jpg",
  "img6.jpg", "img7.jpg", "img8.jpg", "img9.jpg", "img10.jpg"
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
  heart.style.left = Math.random() * 100 + "vw";
  heart.style.animationDuration = 3 + Math.random() * 2 + "s";
  heartContainer.appendChild(heart);
  setTimeout(() => heart.remove(), 5000);
}

setInterval(createHeart, 300);
