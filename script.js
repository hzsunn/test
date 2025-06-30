const tracks = [
  { name: "Em Ơi Em Đừng Khóc", file: "Emoiem.m4a" },
  ];
const track = tracks[index];
const lrcText = lyricsData[track.name] || "";
showKaraoke(lrcText);
let currentTrackIndex = 0;
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");
const playlistEl = document.getElementById("playlist");
const audioPlayer = document.getElementById("audio-player");

const trackImg = document.getElementById("track-img");
const trackTitle = document.getElementById("track-title");
const trackArtist = document.getElementById("track-artist");

const playBtn = document.getElementById("play-btn");
const playIcon = document.getElementById("play-icon"); // 👉 cần có icon con trong nút play
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const progressBar = document.getElementById("progress-bar");
const searchInput = document.getElementById("search");
const wave = document.getElementById("wave");

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}
function renderPlaylist(filter = "") {
  playlistEl.innerHTML = "";

  const filteredTracks = tracks
    .filter(t => t.name.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  // 👉 Cập nhật bộ đếm bài hát
  const trackCountEl = document.getElementById("track-count");
  if (trackCountEl) {
    trackCountEl.textContent = `Tổng số bài hát: ${filteredTracks.length}`;
  }

  filteredTracks.forEach((track, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="text"><strong>${track.name}</strong></div>
    `;
    li.addEventListener("click", () => playTrack(tracks.indexOf(track))); // giữ đúng index
    playlistEl.appendChild(li);
  });
}



function playTrack(index) {
  currentTrackIndex = index;
  const track = tracks[index];
  audioPlayer.src = track.file;
  trackImg.src = commonThumbnail;
  trackTitle.textContent = track.name;
  trackArtist.textContent = "Đặng Hồng";
  audioPlayer.play();
  playIcon.classList.remove("fa-play");
  playIcon.classList.add("fa-pause");
  document.body.classList.add("playing");
  wave.classList.add("playing");
}

playBtn.addEventListener("click", () => {
  if (audioPlayer.paused) {
    audioPlayer.play();
    playIcon.classList.remove("fa-play");
    playIcon.classList.add("fa-pause");
    document.body.classList.add("playing");
    wave.classList.add("playing");
  } else {
    audioPlayer.pause();
    playIcon.classList.remove("fa-pause");
    playIcon.classList.add("fa-play");
    document.body.classList.remove("playing");
    wave.classList.remove("playing");
  }
});

prevBtn.addEventListener("click", () => {
  currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
  playTrack(currentTrackIndex);
});

nextBtn.addEventListener("click", () => {
  currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
  playTrack(currentTrackIndex);
});



progressBar.addEventListener("input", () => {
  audioPlayer.currentTime = (progressBar.value / 100) * audioPlayer.duration;
});

audioPlayer.addEventListener("timeupdate", () => {
  progressBar.value = (audioPlayer.currentTime / audioPlayer.duration) * 100 || 0;
  currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
  if (!isNaN(audioPlayer.duration)) {
    durationEl.textContent = formatTime(audioPlayer.duration);
  }
});

audioPlayer.addEventListener("ended", () => {
  let nextIndex;
  do {
    nextIndex = Math.floor(Math.random() * tracks.length);
  } while (nextIndex === currentTrackIndex); // tránh trùng bài đang phát

  playTrack(nextIndex);
});

searchInput.addEventListener("input", (e) => {
  renderPlaylist(e.target.value);
});
document.getElementById("search-btn").addEventListener("click", () => {
  const searchValue = searchInput.value.trim();
  renderPlaylist(searchValue);
  searchInput.blur(); // ← lệnh quan trọng: tắt bàn phím
});
document.addEventListener("touchstart", (e) => {
  if (e.target.id !== "search") {
    searchInput.blur(); // bỏ focus nếu bấm ra ngoài
  }
});
