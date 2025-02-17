const voiceSelect = document.querySelector('#voiceSelect');
const playButton = document.querySelector('#playButton');
const textInput = document.querySelector('textarea');
const downloadButton = document.querySelector('#downloadButton');
const audioPlayer = document.querySelector('#audioPlayer');

let voices = [];

// Load available voices
function loadVoices() {
    voices = speechSynthesis.getVoices();
    voiceSelect.innerHTML = voices
        .map((voice, index) => `<option value="${index}">${voice.name} (${voice.lang})</option>`)
        .join('');
}
speechSynthesis.onvoiceschanged = loadVoices;
loadVoices();

// Function to generate speech and record it
playButton.addEventListener('click', () => {
    if (!textInput.value.trim()) {
        alert("Please enter some text to convert to speech.");
        return;
    }

    const utterance = new SpeechSynthesisUtterance(textInput.value);
    const selectedVoice = voices[voiceSelect.value];

    if (selectedVoice) {
        utterance.voice = selectedVoice;
    }

    // Use MediaRecorder API to capture audio
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        let audioChunks = [];

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
