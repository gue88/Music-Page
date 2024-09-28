document.addEventListener("DOMContentLoaded", async () => {
  const audioFiles = await fetchAudioFiles(); // Fetch the audio files from server
  const songContainer = document.querySelector(".song-container");

  audioFiles.forEach((file) => {
    const songItem = createSongItem(file);
    songContainer.appendChild(songItem);
  });
});

// Fetch the audio files from the server (replace the endpoint as needed)
async function fetchAudioFiles() {
  try {
    const response = await fetch("/audio-files"); // Node.js endpoint to get audio file list
    const files = await response.json();
    return files;
  } catch (error) {
    console.error("Error fetching audio files:", error);
    return [];
  }
}

function createSongItem(file) {
  const songItem = document.createElement("div");
  songItem.classList.add("song-item");

  const playButton = document.createElement("button");
  playButton.classList.add("play-button");
  playButton.innerHTML = "►";

  const songInfo = document.createElement("div");
  songInfo.classList.add("song-info");

  const songTitle = document.createElement("div");
  songTitle.classList.add("song-title");
  songTitle.textContent = file;

  const seekbarContainer = document.createElement("div");
  seekbarContainer.classList.add("seekbar-container");

  const timeStart = document.createElement("span");
  timeStart.classList.add("time-start");
  timeStart.textContent = "0:00";

  const seekbar = document.createElement("input");
  seekbar.type = "range";
  seekbar.classList.add("seekbar");
  seekbar.value = 0;
  seekbar.max = 100;

  const timeEnd = document.createElement("span");
  timeEnd.classList.add("time-end");
  timeEnd.textContent = "0:00";

  seekbarContainer.appendChild(timeStart);
  seekbarContainer.appendChild(seekbar);
  seekbarContainer.appendChild(timeEnd);

  songInfo.appendChild(songTitle);
  songInfo.appendChild(seekbarContainer);

  songItem.appendChild(playButton);
  songItem.appendChild(songInfo);

  // Adjust audio URL to point to the file served by the Node.js server
  const audio = new Audio(`/audio/${file}`);

  audio.addEventListener("loadedmetadata", () => {
    const duration = audio.duration;
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60)
      .toString()
      .padStart(2, "0");
    timeEnd.textContent = `${minutes}:${seconds}`;
  });

  playButton.addEventListener("click", () => {
    if (audio.paused) {
      audio.play();
      playButton.innerHTML = "❚❚"; // Pause symbol
    } else {
      audio.pause();
      playButton.innerHTML = "►"; // Play symbol
    }
  });

  audio.addEventListener("timeupdate", () => {
    const currentTime = audio.currentTime;
    const minutes = Math.floor(currentTime / 60);
    const seconds = Math.floor(currentTime % 60)
      .toString()
      .padStart(2, "0");
    timeStart.textContent = `${minutes}:${seconds}`;
    seekbar.value = (currentTime / audio.duration) * 100;
  });

  seekbar.addEventListener("input", () => {
    const seekTo = (seekbar.value / 100) * audio.duration;
    audio.currentTime = seekTo;
  });

  return songItem;
}
