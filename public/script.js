document.addEventListener("DOMContentLoaded", async () => {
  const audioFiles = await fetchAudioFiles(); // Fetch the audio files from the server
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

  // Add the SVG play icon inside the button
  playButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" width="36px" height="36px">
      <path d="M8 5v14l11-7z"/>
    </svg>
  `;

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
      playButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" width="36px" height="36px">
  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
</svg>

      `; // Pause symbol
    } else {
      audio.pause();
      playButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" width="36px" height="36px">
          <path d="M8 5v14l11-7z"/>
        </svg>
      `; // Play symbol
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
