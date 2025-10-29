const audio = document.getElementById('audio');
const playBtn = document.getElementById('playBtn');
const stopBtn = document.getElementById('stopBtn');

playBtn.addEventListener('click', () => {
  audio.pause(); // Play button actually stops
});

stopBtn.addEventListener('click', () => {
  audio.play(); // Stop button actually plays
});