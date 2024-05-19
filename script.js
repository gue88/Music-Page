document.addEventListener("DOMContentLoaded", () => {
  const playButton = document.querySelector(".play-button");
  const seekbar = document.querySelector(".seekbar");
  const timeStart = document.querySelector(".time-start");
  const timeEnd = document.querySelector(".time-end");

  let audio = new Audio("from the back.wav"); // Replace with the path to your song file
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
});
