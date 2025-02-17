const voiceSelect = document.querySelector('#voiceSelect');
const playButton = document.querySelector('#playButton');
const textInput = document.querySelector('textarea');
const languageSelect = document.querySelector('#languageSelect')

// Array pf supported languages with their ISO codes
const languages = [
    {code: 'en', name: 'English'},
    {code: 'es', name: 'Spanish'},
    {code: 'fr', name : 'French'},
    {code: 'de', name: 'German'},
    {code: 'it', name: 'Italian'},
    {code: 'ja', name: 'Japanese'},
    {code: 'ta', name: 'Tamil'},
];

// Populating language select box
// languages.forEach(({code, name}) => {
//     const option = document.createElement('option');
//     option.value = code;
//     option.textContent = name;
//     languageSelect.appendChild(option);
// })



// Load available voices
let voices = [];
function loadVoices() {
    voices = speechSynthesis.getVoices();
    voiceSelect.innerHTML = voices
        .map((voice, index) => `<option value="${index}">${voice.name} (${voice.lang})</option>`)
        .join('');
}

// Trigger loading voices when they become available
speechSynthesis.onvoiceschanged = loadVoices;
loadVoices();

// play TTS
playButton.addEventListener('click', () => {
    const utterance = new SpeechSynthesisUtterance(textInput.value);
    const selectedVoice = voices[voiceSelect.value];
    if(selectedVoice) 
    {
        utterance.voice = selectedVoice;
    }
    speechSynthesis.speak(utterance);  
})


// 18:12