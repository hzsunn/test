const commonThumbnail = "music/IMG_0947.jpeg";

const tracks = [
  { name: "Em Ơi Em Đừng Khóc", file: "music/Emoiem.m4a" },
  { name: "Đừng Yêu Ai Em Nhé", file: "music/Dyaen.m4a" },
  // 👉 thêm bài khác tại đây
];

let currentTrackIndex = 0;
let startTime = parseInt(localStorage.getItem("totalPlayTime")) || 0;

const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");
const playlistEl = document.getElementById("playlist");
const audioPlayer = document.getElementById("audio-player");
const trackImg = document.getElementById("track-img");
const trackTitle = document.getElementById("track-title");
const trackArtist = document.getElementById("track-artist");
const playBtn = document.getElementById("play-btn");
const playIcon = document.getElementById("play-icon");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const progressBar = document.getElementById("progress-bar");
const searchInput = document.getElementById("search");
const wave = document.getElementById("wave");
const playTimeCounter = document.getElementById("play-time");
const karaokeContainer = document.getElementById("karaoke");

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function renderPlaylist(filter = "") {
  playlistEl.innerHTML = "";

  const filteredTracks = tracks
    .filter(t => t.name.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  const trackCountEl = document.getElementById("track-count");
  if (trackCountEl) {
    trackCountEl.textContent = `Tổng số bài hát: ${filteredTracks.length}`;
  }

  filteredTracks.forEach((track, index) => {
    const li = document.createElement("li");
    li.innerHTML = `<div class="text"><strong>${index + 1}. ${track.name}</strong></div>`;
    li.addEventListener("click", () => playTrack(tracks.indexOf(track)));
    playlistEl.appendChild(li);
  });
}

function showKaraoke(lrcText) {
  if (!karaokeContainer) return;
  karaokeContainer.innerHTML = "";

  const lines = lrcText.split("\n").map(line => {
    const match = line.match(/\[(\d{2}):(\d{2})(?:\.(\d{2}))?\](.*)/);
    if (match) {
      const time = parseInt(match[1]) * 60 + parseInt(match[2]);
      return { time, text: match[4].trim() };
    }
    return null;
  }).filter(Boolean);

  lines.forEach(line => {
    const p = document.createElement("p");
    p.textContent = line.text;
    p.dataset.time = line.time;
    karaokeContainer.appendChild(p);
  });

  audioPlayer.addEventListener("timeupdate", () => {
    const currentTime = Math.floor(audioPlayer.currentTime);
    const allLines = karaokeContainer.querySelectorAll("p");
    allLines.forEach(p => {
      const lineTime = parseInt(p.dataset.time);
      p.classList.toggle("active", lineTime === currentTime);
    });
  });
}

function playTrack(index) {
  currentTrackIndex = index;
  const track = tracks[index];
  audioPlayer.src = track.file;
  trackImg.src = commonThumbnail;
  trackTitle.textContent = track.name;
  trackArtist.textContent = "Đặng Hồng";

  const lrcText = lyricsData[track.name] || "";
  showKaraoke(lrcText);

  audioPlayer.play();
  playIcon.classList.replace("fa-play", "fa-pause");
  document.body.classList.add("playing");
  wave.classList.add("playing");
}

playBtn.addEventListener("click", () => {
  if (audioPlayer.paused) {
    audioPlayer.play();
    playIcon.classList.replace("fa-play", "fa-pause");
    document.body.classList.add("playing");
    wave.classList.add("playing");
  } else {
    audioPlayer.pause();
    playIcon.classList.replace("fa-pause", "fa-play");
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

audioPlayer.addEventListener("timeupdate", () => {
  if (!audioPlayer.duration) return;
  progressBar.value = (audioPlayer.currentTime / audioPlayer.duration) * 100;
  currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
  durationEl.textContent = formatTime(audioPlayer.duration);

  startTime++;
  if (playTimeCounter) {
    playTimeCounter.textContent = `⏱️ Đã phát: ${formatTime(startTime)}`;
  }
  localStorage.setItem("totalPlayTime", startTime);
});

progressBar.addEventListener("input", () => {
  audioPlayer.currentTime = (progressBar.value / 100) * audioPlayer.duration;
});

audioPlayer.addEventListener("ended", () => {
  let nextIndex;
  do {
    nextIndex = Math.floor(Math.random() * tracks.length);
  } while (nextIndex === currentTrackIndex);
  playTrack(nextIndex);
});

searchInput.addEventListener("input", (e) => {
  renderPlaylist(e.target.value);
});

document.getElementById("search-btn").addEventListener("click", () => {
  const searchValue = searchInput.value.trim();
  renderPlaylist(searchValue);
  searchInput.blur();
});

document.addEventListener("touchstart", (e) => {
  if (e.target.id !== "search") {
    searchInput.blur();
  }
});

renderPlaylist();
