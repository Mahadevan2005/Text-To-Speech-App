const voiceSelect = document.querySelector('#voiceSelect');
const playButton = document.querySelector('#playButton');
const textInput = document.querySelector('textarea');
const downloadButton = document.querySelector('#downloadButton');
const audioPlayer = document.querySelector('#audioPlayer');

let voices = [];
function loadVoices() {
    voices = speechSynthesis.getVoices();
    voiceSelect.innerHTML = voices
        .map((voice, index) => `<option value="${index}">${voice.name} (${voice.lang})</option>`)
        .join('');
}
speechSynthesis.onvoiceschanged = loadVoices;
loadVoices();

let mediaRecorder;
let audioChunks = [];

// Play TTS and record audio
playButton.addEventListener('click', () => {
    const utterance = new SpeechSynthesisUtterance(textInput.value);
    const selectedVoice = voices[voiceSelect.value];
    if (selectedVoice) {
        utterance.voice = selectedVoice;
    }

    // Capture audio using MediaRecorder
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        const audioContext = new AudioContext();
        const dest = audioContext.createMediaStreamDestination();
        const source = audioContext.createMediaStreamSource(dest.stream);
        source.connect(audioContext.destination);

        mediaRecorder = new MediaRecorder(dest.stream);
        mediaRecorder.ondataavailable = (event) => {
            audioChunks.push(event.data);
        };
        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
            const audioURL = URL.createObjectURL(audioBlob);
            audioPlayer.src = audioURL;
            downloadButton.href = audioURL;
            downloadButton.download = 'speech.mp3';
            downloadButton.disabled = false;
        };

        mediaRecorder.start();
        speechSynthesis.speak(utterance);

        utterance.onend = () => {
            mediaRecorder.stop();
        };
    });
});
