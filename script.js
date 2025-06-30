const commonThumbnail = "music/IMG_0947.jpeg";

const tracks = [
  { name: "Em Ơi Em Đừng Khóc", file: "music/Emoiem.m4a" },
  { name: "Đừng Yêu Ai Em Nhé", file: "music/Dyaen.m4a" },
  // Thêm bài khác tại đây
];

let currentTrackIndex = 0;
let startTime = parseInt(localStorage.getItem("totalPlayTime") || 0);

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
    li.innerHTML = `
      <div class="text"><strong>${index + 1}. ${track.name}</strong></div>
    `;
    li.addEventListener("click", () => playTrack(tracks.indexOf(track)));
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

  const lrcText = lyricsData[track.name] || "";
  showKaraoke(lrcText);

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

  syncKaraoke(audioPlayer.currentTime);
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

function showKaraoke(lrcText) {
  const karaokeBox = document.getElementById("karaoke-lines");
  karaokeBox.innerHTML = "";

  const lines = lrcText.split("\n").filter(line => line.trim() !== "");
  const parsedLines = lines.map(line => {
    const match = line.match(/\[(\d+):(\d+\.\d+)\](.*)/);
    if (!match) return null;
    const time = parseInt(match[1]) * 60 + parseFloat(match[2]);
    const text = match[3].trim();
    return { time, text };
  }).filter(Boolean);

  parsedLines.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("karaoke-line");
    div.dataset.time = item.time;
    div.textContent = item.text;
    karaokeBox.appendChild(div);
  });

  audioPlayer.karaokeLines = parsedLines;
}

function syncKaraoke(currentTime) {
  const karaokeBox = document.getElementById("karaoke-lines");
  const lines = karaokeBox.querySelectorAll(".karaoke-line");

  lines.forEach((line, i) => {
    const time = parseFloat(line.dataset.time);
    const nextTime = i < lines.length - 1 ? parseFloat(lines[i + 1].dataset.time) : Infinity;

    if (currentTime >= time && currentTime < nextTime) {
      line.classList.add("active");
    } else {
      line.classList.remove("active");
    }
  });
}

renderPlaylist();
