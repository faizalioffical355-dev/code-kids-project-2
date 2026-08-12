// ==========================================================================
// Kids Coding Playground - Application Logic
// ==========================================================================

// Global state
let currentSession = null;
let currentChapterIdx = 0;
let currentSessionIdx = 0;
let progress = {}; // Track completed sessions e.g., {'ch1-s1': true}
let audioCtx = null;

// DOM Elements
const chaptersList = document.getElementById("chaptersList");
const htmlEditor = document.getElementById("htmlEditor");
const cssEditor = document.getElementById("cssEditor");
const jsEditor = document.getElementById("jsEditor");
const previewFrame = document.getElementById("previewFrame");
const runCheckBtn = document.getElementById("runCheckBtn");
const hintBtn = document.getElementById("hintBtn");
const ttsBtn = document.getElementById("ttsBtn");
const voiceHoverToggle = document.getElementById("voiceHoverToggle");
const kbSoundToggle = document.getElementById("kbSoundToggle");
const aiBubble = document.getElementById("aiBubble");
const aiAvatar = document.getElementById("aiAvatar");
const progressFill = document.getElementById("progressFill");
const progressPercentage = document.getElementById("progressPercentage");
const successCard = document.getElementById("successCard");
const nextSessionBtn = document.getElementById("nextSessionBtn");
const themeToggleBtn = document.getElementById("themeToggleBtn");
const audioBanner = document.getElementById("audioBanner");
const enableAudioBtn = document.getElementById("enableAudioBtn");

// Autocomplete DOM Elements
const autocompletePopup = document.getElementById("autocompletePopup");
const autocompleteItems = document.getElementById("autocompleteItems");
const autocompletePreview = document.getElementById("autocompletePreview");
const autocompletePreviewBox = document.getElementById("autocompletePreviewBox");
const autocompletePreviewDesc = document.getElementById("autocompletePreviewDesc");
const voiceWave = document.getElementById("voiceWave");

// Tab setup
const tabs = document.querySelectorAll(".editor-tab");
const panels = document.querySelectorAll(".editor-panel");

// Audio Synthesizer for Retro Game Style sound effects
function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    audioBanner.classList.add("hidden");
  }
}

function playSound(type) {
  if (!audioCtx) return;
  
  // Resume context if suspended (browser security)
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);

  const now = audioCtx.currentTime;

  if (type === 'click') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    osc.start(now);
    osc.stop(now + 0.15);
  } else if (type === 'type') {
    if (!kbSoundToggle || !kbSoundToggle.checked) return;
    osc.type = 'triangle';
    // Randomize slightly for an organic sound
    const freq = 1200 + Math.random() * 600;
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0.012, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    osc.start(now);
    osc.stop(now + 0.05);
  } else if (type === 'sparkle') {
    const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    freqs.forEach((freq, idx) => {
      const sOsc = audioCtx.createOscillator();
      const sGain = audioCtx.createGain();
      sOsc.connect(sGain);
      sGain.connect(audioCtx.destination);
      sOsc.type = 'sine';
      sOsc.frequency.setValueAtTime(freq, now + idx * 0.05);
      sGain.gain.setValueAtTime(0.05, now + idx * 0.05);
      sGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.25);
      sOsc.start(now + idx * 0.05);
      sOsc.stop(now + idx * 0.05 + 0.3);
    });
  } else if (type === 'success') {
    // Beautiful major arpeggio
    const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
    notes.forEach((freq, idx) => {
      const timeOffset = idx * 0.1;
      const noteOsc = audioCtx.createOscillator();
      const noteGain = audioCtx.createGain();
      noteOsc.connect(noteGain);
      noteGain.connect(audioCtx.destination);

      noteOsc.type = 'triangle';
      noteOsc.frequency.setValueAtTime(freq, now + timeOffset);
      noteGain.gain.setValueAtTime(0.15, now + timeOffset);
      noteGain.gain.exponentialRampToValueAtTime(0.01, now + timeOffset + 0.3);

      noteOsc.start(now + timeOffset);
      noteOsc.stop(now + timeOffset + 0.35);
    });
  } else if (type === 'error') {
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.linearRampToValueAtTime(80, now + 0.25);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    osc.start(now);
    osc.stop(now + 0.3);
  } else if (type === 'hint') {
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.15);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    osc.start(now);
    osc.stop(now + 0.25);
  }
}

// Confetti Celebration Canvas Overlay Simulation
const confettiCanvas = document.getElementById("confettiCanvas");
let confettiCtx = confettiCanvas ? confettiCanvas.getContext("2d") : null;
let confettiParticles = [];
let confettiAnimationId = null;

function resizeConfettiCanvas() {
  if (confettiCanvas) {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }
}
window.addEventListener("resize", resizeConfettiCanvas);
resizeConfettiCanvas();

class ConfettiParticle {
  constructor() {
    this.x = window.innerWidth / 2 + (Math.random() - 0.5) * 200;
    this.y = window.innerHeight + 20;
    this.size = Math.random() * 8 + 6;
    this.color = `hsl(${Math.random() * 360}, 90%, 60%)`;
    this.vx = (Math.random() - 0.5) * 8;
    this.vy = -Math.random() * 12 - 12;
    this.gravity = 0.45;
    this.rotation = Math.random() * 360;
    this.rotationSpeed = (Math.random() - 0.5) * 8;
    this.opacity = 1;
    this.type = Math.random() > 0.4 ? 'square' : 'circle';
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity;
    this.rotation += this.rotationSpeed;
    if (this.vy > 0) {
      this.opacity -= 0.015;
    }
  }
  draw() {
    if (!confettiCtx) return;
    confettiCtx.save();
    confettiCtx.translate(this.x, this.y);
    confettiCtx.rotate(this.rotation * Math.PI / 180);
    confettiCtx.globalAlpha = this.opacity;
    confettiCtx.fillStyle = this.color;
    
    if (this.type === 'square') {
      confettiCtx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
    } else {
      confettiCtx.beginPath();
      confettiCtx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
      confettiCtx.fill();
    }
    confettiCtx.restore();
  }
}

function startConfetti() {
  if (!confettiCanvas || !confettiCtx) return;
  confettiParticles = [];
  for (let i = 0; i < 100; i++) {
    confettiParticles.push(new ConfettiParticle());
  }
  
  if (confettiAnimationId) {
    cancelAnimationFrame(confettiAnimationId);
  }
  
  function animate() {
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    let active = false;
    confettiParticles.forEach(p => {
      p.update();
      if (p.opacity > 0 && p.y < confettiCanvas.height + 50) {
        p.draw();
        active = true;
      }
    });
    
    if (active) {
      confettiAnimationId = requestAnimationFrame(animate);
    } else {
      confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      confettiAnimationId = null;
    }
  }
  animate();
}

// Aki Mascot expression controller
function setAkiExpression(expression) {
  if (!aiAvatar) return;
  aiAvatar.classList.remove('expr-idle', 'expr-happy', 'expr-thinking', 'expr-hint');
  aiAvatar.classList.add(`expr-${expression}`);
}

// Text to Speech engine
let speechUtterance = null;
function speakText(text) {
  if (!window.speechSynthesis) return;

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  // Highlight speaker avatar state
  aiAvatar.classList.add("speaking");
  if (voiceWave) voiceWave.classList.add("active");

  speechUtterance = new SpeechSynthesisUtterance(text);
  speechUtterance.rate = 0.95; // Child friendly pacing
  speechUtterance.pitch = 1.1; // Friendly higher pitch for Aki bot

  speechUtterance.onend = () => {
    aiAvatar.classList.remove("speaking");
    if (voiceWave) voiceWave.classList.remove("active");
  };

  speechUtterance.onerror = () => {
    aiAvatar.classList.remove("speaking");
    if (voiceWave) voiceWave.classList.remove("active");
  };

  window.speechSynthesis.speak(speechUtterance);
}

// Check localStorage progress
function loadProgress() {
  const saved = localStorage.getItem("codekids_progress");
  if (saved) {
    try {
      progress = JSON.parse(saved);
    } catch(e) {
      progress = {};
    }
  }
  updateProgressBar();
}

function saveProgress() {
  localStorage.setItem("codekids_progress", JSON.stringify(progress));
  updateProgressBar();
}

function updateProgressBar() {
  let totalSessions = 0;
  let completedCount = 0;
  
  CHAPTERS_DATA.forEach(ch => {
    ch.sessions.forEach(s => {
      totalSessions++;
      if (progress[s.id]) {
        completedCount++;
      }
    });
  });

  const percentage = totalSessions > 0 ? Math.round((completedCount / totalSessions) * 100) : 0;
  progressFill.style.width = `${percentage}%`;
  progressPercentage.textContent = `${percentage}%`;
}

// Layout theme toggle
themeToggleBtn.addEventListener("click", () => {
  initAudio();
  playSound('click');
  document.body.classList.toggle("light-mode");
  document.body.classList.toggle("dark-mode");
});

// Tab navigation handler
tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    initAudio();
    playSound('click');
    tabs.forEach(t => t.classList.remove("active"));
    panels.forEach(p => p.classList.remove("active"));

    tab.classList.add("active");
    const targetPanel = document.getElementById(`${tab.dataset.tab}Panel`);
    if (targetPanel) targetPanel.classList.add("active");
  });
});

// Live editor sandbox compiler
function compileCode() {
  const html = htmlEditor.value;
  const css = cssEditor.value;
  const js = jsEditor.value;

  // Let's form an encapsulated sandboxed HTML frame
  const source = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <style>
        ${css}
      </style>
    </head>
    <body>
      ${html}
      <script>
        // Catch frame errors
        window.addEventListener('error', function(e) {
          console.error("Frame Error: " + e.message);
        });
      </script>
      <script>
        ${js}
      </script>
    </body>
    </html>
  `;
  
  previewFrame.srcdoc = source;
}

// ==========================================================================
// Autocomplete & Code Intelligence (Intellisense) System
// ==========================================================================

const AUTOCOMPLETE_DICTIONARY = {
  html: [
    { label: '<h1>', value: '<h1>$1</h1>', detail: 'Heading 1 👑', desc: 'Creates a big, bold title for your webpage.', previewClass: 'demo-heading' },
    { label: '<p>', value: '<p>$1</p>', detail: 'Paragraph 📝', desc: 'Adds normal reading text blocks.', previewClass: 'demo-heading' },
    { label: '<button>', value: '<button>$1</button>', detail: 'Button 🔘', desc: 'Creates a clickable button for interactions.', previewClass: 'demo-button' },
    { label: '<div>', value: '<div class="$1">', detail: 'Division Card 📦', desc: 'Groups elements into container cards.', previewClass: 'demo-border' },
    { label: '<span>', value: '<span>$1</span>', detail: 'Span Text 🏷️', desc: 'Styles specific parts of text.', previewClass: 'demo-heading' },
    { label: '<img>', value: '<img src="$1" alt="Image">', detail: 'Image 🖼️', desc: 'Inlines a photo or artwork illustration.', previewClass: 'demo-scale' },
    { label: '<a>', value: '<a href="$1">Link</a>', detail: 'Hyperlink 🔗', desc: 'Links to another webpage.', previewClass: 'demo-heading' }
  ],
  css: [
    { label: 'background-color', value: 'background-color: $1;', detail: 'Background Color 🎨', desc: 'Fills the background with a colorful splash.', previewClass: 'demo-bg' },
    { label: 'color', value: 'color: $1;', detail: 'Text Color ✏️', desc: 'Changes the color of the writing.', previewClass: 'demo-bg' },
    { label: 'border', value: 'border: $1;', detail: 'Border Frame 🖼️', desc: 'Draws a solid framing line around elements.', previewClass: 'demo-border' },
    { label: 'border-radius', value: 'border-radius: $1;', detail: 'Corner Rounder 🔄', desc: 'Makes sharp boxy corners smooth and round.', previewClass: 'demo-radius' },
    { label: 'transform: scale', value: 'transform: scale($1);', detail: 'Zoom Grow 🚀', desc: 'Enlarges or shrinks elements on hovering.', previewClass: 'demo-scale' },
    { label: 'transition', value: 'transition: $1;', detail: 'Smooth Transition ⏰', desc: 'Makes styling changes glide smoothly over time.', previewClass: 'demo-scale' },
    { label: 'font-size', value: 'font-size: $1;', detail: 'Text Size 🔎', desc: 'Makes text larger or smaller.', previewClass: 'demo-heading' },
    { label: 'padding', value: 'padding: $1;', detail: 'Inner Spacing 🧽', desc: 'Adds soft breathing space inside elements.', previewClass: 'demo-border' }
  ],
  js: [
    { label: 'alert()', value: 'alert(\'$1\');', detail: 'Alert Pop-up 🔔', desc: 'Pops up a window with a message box.', previewClass: 'demo-alert' },
    { label: 'document.getElementById', value: 'document.getElementById(\'$1\')', detail: 'Find ID Element 🔍', desc: 'Finds an element by its ID tag.', previewClass: 'demo-border' },
    { label: 'addEventListener', value: 'addEventListener(\'$1\', () => {\n  \n});', detail: 'Listen to Click 👂', desc: 'Listens for actions (like click or hover).', previewClass: 'demo-button' },
    { label: 'classList.toggle', value: 'classList.toggle(\'$1\');', detail: 'Toggle Theme 🌗', desc: 'Switches dark/light mode styles on and off.', previewClass: 'demo-darkmode' },
    { label: 'innerText', value: 'innerText = \'$1\';', detail: 'Change Text ✍️', desc: 'Replaces writing inside an HTML element.', previewClass: 'demo-heading' }
  ]
};

let activeEditor = null;
let activeTabType = 'html'; // 'html', 'css', 'js'
let selectedSuggestionIdx = 0;
let filteredSuggestions = [];

// Caret position tracking in textarea (Mirror Div method)
function getCaretCoordinates(element, position) {
  const properties = [
    'direction', 'boxSizing', 'width', 'height', 'overflowX', 'overflowY',
    'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth',
    'borderStyle', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
    'fontStyle', 'fontVariant', 'fontWeight', 'fontStretch', 'fontSize',
    'fontSizeAdjust', 'lineHeight', 'fontFamily', 'textAlign', 'textTransform',
    'textIndent', 'textDecoration', 'letterSpacing', 'wordSpacing', 'tabSize',
    'MozTabSize'
  ];

  const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

  const div = document.createElement('div');
  div.id = 'input-textarea-caret-position-mirror-div';
  document.body.appendChild(div);

  const style = div.style;
  const computed = window.getComputedStyle(element);

  style.whiteSpace = 'pre-wrap';
  style.wordWrap = 'break-word';
  style.position = 'absolute';
  style.visibility = 'hidden';

  properties.forEach(prop => {
    style[prop] = computed[prop];
  });

  if (isFirefox) {
    if (element.scrollHeight > element.clientHeight)
      style.overflowY = 'scroll';
  } else {
    style.overflowY = 'hidden';
  }

  div.textContent = element.value.substring(0, position);

  const span = document.createElement('span');
  span.textContent = element.value.substring(position) || '.';
  div.appendChild(span);

  const coordinates = {
    top: span.offsetTop + parseInt(computed['borderTopWidth']),
    left: span.offsetLeft + parseInt(computed['borderLeftWidth']),
    height: parseInt(computed['lineHeight'])
  };

  document.body.removeChild(div);
  return coordinates;
}

// Check if a suggestion matches the current active session skills
function isSessionGoal(suggestion) {
  if (!currentSession || !currentSession.skills) return false;
  const label = suggestion.label.replace(/[<>;()]/g, '').toLowerCase();
  return currentSession.skills.some(skill => {
    const s = skill.toLowerCase();
    return s.includes(label) || label.includes(s) || (s === 'h1-tag' && label === 'h1') || (s === 'p-tag' && label === 'p') || (s === 'button-tag' && label === 'button');
  });
}

function updateAutocomplete(editor, tabType) {
  activeEditor = editor;
  activeTabType = tabType;
  
  const text = editor.value;
  const cursorIdx = editor.selectionStart;
  
  const textBeforeCursor = text.substring(0, cursorIdx);
  const words = textBeforeCursor.split(/[\s,;{}()<>]/);
  const currentWord = words[words.length - 1] || "";
  
  let searchWord = currentWord;
  const lastChar = textBeforeCursor[textBeforeCursor.length - 1];
  
  if (searchWord.length === 0 && lastChar !== '<' && lastChar !== ':' && lastChar !== '.') {
    hideAutocomplete();
    return;
  }
  
  if (searchWord.startsWith('<')) searchWord = searchWord.slice(1);
  if (searchWord.startsWith('.')) searchWord = searchWord.slice(1);
  if (searchWord.startsWith(':')) searchWord = searchWord.slice(1);
  
  const dictionary = AUTOCOMPLETE_DICTIONARY[tabType] || [];
  filteredSuggestions = dictionary.filter(item => {
    const cleanLabel = item.label.replace(/[<>]/g, '');
    return cleanLabel.toLowerCase().includes(searchWord.toLowerCase()) || 
           item.detail.toLowerCase().includes(searchWord.toLowerCase());
  });
  
  filteredSuggestions.sort((a, b) => {
    const goalA = isSessionGoal(a) ? 1 : 0;
    const goalB = isSessionGoal(b) ? 1 : 0;
    return goalB - goalA;
  });
  
  if (filteredSuggestions.length === 0) {
    hideAutocomplete();
    return;
  }
  
  renderSuggestions();
  positionAutocomplete(editor, cursorIdx);
}

function renderSuggestions() {
  if (!autocompleteItems) return;
  autocompleteItems.innerHTML = "";
  if (selectedSuggestionIdx >= filteredSuggestions.length) {
    selectedSuggestionIdx = 0;
  }
  
  filteredSuggestions.forEach((item, idx) => {
    const div = document.createElement("div");
    div.className = "autocomplete-item";
    if (idx === selectedSuggestionIdx) {
      div.classList.add("focused");
    }
    
    const isGoal = isSessionGoal(item);
    
    div.innerHTML = `
      <div class="autocomplete-item-header">
        <span class="autocomplete-label">${escapeHtml(item.label)}</span>
        ${isGoal ? '<span class="autocomplete-goal-badge">⭐ Goal</span>' : ''}
      </div>
      <span class="autocomplete-detail">${item.detail}</span>
    `;
    
    div.addEventListener("click", (e) => {
      e.stopPropagation();
      selectedSuggestionIdx = idx;
      applySuggestion();
    });
    
    div.addEventListener("mouseenter", () => {
      selectedSuggestionIdx = idx;
      const items = autocompleteItems.querySelectorAll(".autocomplete-item");
      items.forEach((it, i) => {
        it.classList.toggle("focused", i === idx);
      });
      updatePreview(item);
    });
    
    autocompleteItems.appendChild(div);
  });
  
  updatePreview(filteredSuggestions[selectedSuggestionIdx]);
}

function updatePreview(item) {
  if (!item || !autocompletePreviewDesc || !autocompletePreviewBox) return;
  autocompletePreviewDesc.textContent = item.desc;
  
  autocompletePreviewBox.innerHTML = "";
  autocompletePreviewBox.className = "preview-animation-box " + item.previewClass;
  
  if (item.previewClass === 'demo-heading' || item.previewClass === 'demo-button' || item.previewClass === 'demo-alert' || item.previewClass === 'demo-darkmode') {
    // Custom labels rendered via CSS ::before
  } else {
    const box = document.createElement("div");
    box.className = "demo-box";
    autocompletePreviewBox.appendChild(box);
  }
}

function positionAutocomplete(editor, cursorIdx) {
  if (!autocompletePopup) return;
  const coords = getCaretCoordinates(editor, cursorIdx);
  const panel = editor.parentElement;
  
  let top = coords.top - editor.scrollTop + coords.height + 4;
  let left = coords.left - editor.scrollLeft + 50; // offset line numbers width
  
  panel.appendChild(autocompletePopup);
  autocompletePopup.classList.add("show");
  autocompletePopup.classList.remove("hidden");
  
  const maxLeft = panel.clientWidth - autocompletePopup.clientWidth - 10;
  const maxTop = panel.clientHeight - autocompletePopup.clientHeight - 10;
  
  if (left > maxLeft) left = maxLeft;
  if (top > maxTop) {
    top = coords.top - editor.scrollTop - autocompletePopup.clientHeight - 4;
  }
  if (left < 50) left = 55;
  if (top < 0) top = 10;
  
  autocompletePopup.style.top = `${top}px`;
  autocompletePopup.style.left = `${left}px`;
}

function hideAutocomplete() {
  if (autocompletePopup) {
    autocompletePopup.classList.remove("show");
    autocompletePopup.classList.add("hidden");
  }
  filteredSuggestions = [];
}

function applySuggestion() {
  if (filteredSuggestions.length === 0 || !activeEditor) return;
  const item = filteredSuggestions[selectedSuggestionIdx];
  const editor = activeEditor;
  
  const text = editor.value;
  const cursorIdx = editor.selectionStart;
  
  const textBeforeCursor = text.substring(0, cursorIdx);
  const words = textBeforeCursor.split(/[\s,;{}()<>]/);
  const currentWord = words[words.length - 1] || "";
  
  let prefixLen = currentWord.length;
  const lastChar = textBeforeCursor[textBeforeCursor.length - 1];
  if (prefixLen === 0 && (lastChar === '<' || lastChar === '.' || lastChar === ':')) {
    // Do not count
  }
  
  const startPos = cursorIdx - prefixLen;
  const valTemplate = item.value;
  const hasPlaceholder = valTemplate.includes("$1");
  const replacement = valTemplate.replace("$1", "");
  
  editor.value = text.substring(0, startPos) + replacement + text.substring(cursorIdx);
  
  if (hasPlaceholder) {
    const newCaretPos = startPos + valTemplate.indexOf("$1");
    editor.selectionStart = editor.selectionEnd = newCaretPos;
  } else {
    editor.selectionStart = editor.selectionEnd = startPos + replacement.length;
  }
  
  editor.focus();
  
  initAudio();
  playSound('type');
  playSound('sparkle');
  
  hideAutocomplete();
  compileCode();
  syncLineNumbers(editor);
}

function escapeHtml(string) {
  return string
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Global click handler to dismiss autocomplete
document.addEventListener("click", (e) => {
  if (autocompletePopup && !autocompletePopup.contains(e.target) && e.target !== htmlEditor && e.target !== cssEditor && e.target !== jsEditor) {
    hideAutocomplete();
  }
});

// Input & Keyboard listeners for editors
[htmlEditor, cssEditor, jsEditor].forEach(editor => {
  const tabType = editor.id.replace('Editor', ''); // 'html', 'css', 'js'

  editor.addEventListener("keydown", (e) => {
    initAudio();
    playSound('type');
    
    if (autocompletePopup && !autocompletePopup.classList.contains("hidden")) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        selectedSuggestionIdx = (selectedSuggestionIdx + 1) % filteredSuggestions.length;
        renderSuggestions();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        selectedSuggestionIdx = (selectedSuggestionIdx - 1 + filteredSuggestions.length) % filteredSuggestions.length;
        renderSuggestions();
      } else if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        applySuggestion();
      } else if (e.key === "Escape") {
        e.preventDefault();
        hideAutocomplete();
      }
    }
  });

  editor.addEventListener("input", (e) => {
    compileCode();
    syncLineNumbers(editor);
    
    // Auto-closing tag check for HTML
    if (tabType === 'html' && e.inputType !== 'deleteContentBackward') {
      const text = editor.value;
      const pos = editor.selectionStart;
      const textBefore = text.substring(0, pos);
      const match = textBefore.match(/<([a-zA-Z1-6]+)>$/);
      if (match) {
        const tagName = match[1];
        const selfClosing = ['img', 'br', 'hr', 'input'].includes(tagName);
        if (!selfClosing) {
          const closingTag = `</${tagName}>`;
          editor.value = text.substring(0, pos) + closingTag + text.substring(pos);
          editor.selectionStart = editor.selectionEnd = pos;
        }
      }
    }
    
    setTimeout(() => {
      updateAutocomplete(editor, tabType);
    }, 0);
  });
  
  editor.addEventListener("scroll", () => {
    const numbers = document.getElementById(`${tabType}LineNumbers`);
    if (numbers) {
      numbers.scrollTop = editor.scrollTop;
    }
  });
  
  editor.addEventListener("click", () => {
    hideAutocomplete();
  });
});

// Line numbers generator
function syncLineNumbers(editor) {
  const name = editor.id.replace('Editor', '');
  const lineNumbersDiv = document.getElementById(`${name}LineNumbers`);
  if (!lineNumbersDiv) return;

  const lines = editor.value.split("\n");
  let html = "";
  for (let i = 1; i <= lines.length; i++) {
    html += `<span>${i}</span>`;
  }
  lineNumbersDiv.innerHTML = html;
}

// Load curriculum sidebar dynamically
function renderSidebar() {
  chaptersList.innerHTML = "";
  let isPreviousCompleted = true; // First session is always unlocked

  CHAPTERS_DATA.forEach((chapter, chIdx) => {
    const chGroup = document.createElement("div");
    chGroup.className = "chapter-group";

    const chTitle = document.createElement("div");
    chTitle.className = "chapter-title";
    chTitle.textContent = chapter.title;
    chGroup.appendChild(chTitle);

    chapter.sessions.forEach((session, sIdx) => {
      const btn = document.createElement("button");
      btn.className = "session-btn";
      
      const isCompleted = progress[session.id] || false;
      const isLocked = false; // All sessions are unlocked and selectable by default

      btn.classList.toggle("completed", isCompleted);
      btn.classList.toggle("locked", isLocked);
      
      if (currentSession && currentSession.id === session.id) {
        btn.classList.add("active");
      }

      // Voice over when hovered
      btn.addEventListener("mouseenter", () => {
        if (voiceHoverToggle.checked) {
          speakText(`Session: ${session.title}`);
        }
      });

      btn.addEventListener("click", () => {
        initAudio();
        playSound('click');
        selectSession(chIdx, sIdx);
      });

      // Label & Status Indicator
      const labelSpan = document.createElement("span");
      labelSpan.textContent = session.title;
      
      const statusSpan = document.createElement("span");
      statusSpan.className = "status-icon";
      if (isCompleted) {
        statusSpan.textContent = "✅";
      } else {
        statusSpan.textContent = "⚡";
      }

      btn.appendChild(labelSpan);
      btn.appendChild(statusSpan);
      chGroup.appendChild(btn);

      // Track completeness for unlocking next
      isPreviousCompleted = isCompleted;
    });

    chaptersList.appendChild(chGroup);
  });
}

// Select session event
function selectSession(chIdx, sIdx) {
  currentChapterIdx = chIdx;
  currentSessionIdx = sIdx;
  currentSession = CHAPTERS_DATA[chIdx].sessions[sIdx];

  // Load starter templates
  htmlEditor.value = currentSession.starterCode.html || "";
  cssEditor.value = currentSession.starterCode.css || "";
  jsEditor.value = currentSession.starterCode.js || "";

  // Reset line numbers
  syncLineNumbers(htmlEditor);
  syncLineNumbers(cssEditor);
  syncLineNumbers(jsEditor);

  // Render preview
  compileCode();

  // Update AI Aki advice
  aiBubble.textContent = currentSession.instructions;
  setAkiExpression('idle');
  
  // Highlight currently unlocked skills
  updateSkillsDashboard();

  // Hide success card
  successCard.classList.add("hidden");

  // Rerender sidebar selection highlight
  renderSidebar();

  // Voice narration triggers
  if (voiceHoverToggle.checked) {
    speakText(`Let's start! ${currentSession.instructions}`);
  }
}

// Update UI skills display
function updateSkillsDashboard() {
  const allBadges = document.querySelectorAll(".skill-badge");
  allBadges.forEach(badge => {
    const tagName = badge.dataset.tag;
    // Check if this badge is unlocked by completed sessions
    let unlocked = false;
    CHAPTERS_DATA.forEach(ch => {
      ch.sessions.forEach(s => {
        if (progress[s.id] && s.skills.includes(tagName)) {
          unlocked = true;
        }
      });
    });
    
    // Also light up if currently editing in active session
    if (currentSession && currentSession.skills.includes(tagName)) {
      unlocked = true;
    }

    if (unlocked) {
      badge.classList.remove("disabled");
    } else {
      badge.classList.add("disabled");
    }
  });
}

// Evaluate Code Check
runCheckBtn.addEventListener("click", () => {
  initAudio();
  if (!currentSession) {
    playSound('error');
    aiBubble.textContent = "Please select a coding lesson first from the left sidebar!";
    return;
  }

  const iframeDoc = previewFrame.contentDocument || previewFrame.contentWindow.document;
  const html = htmlEditor.value;
  const css = cssEditor.value;
  const js = jsEditor.value;

  // Run the validator custom JS function defined in chapters.js
  let passed = false;
  try {
    passed = currentSession.validate(iframeDoc, html, css, js);
  } catch(e) {
    console.error("Validation error:", e);
    passed = false;
  }

  if (passed) {
    playSound('success');
    startConfetti();
    progress[currentSession.id] = true;
    saveProgress();
    renderSidebar();
    updateSkillsDashboard();

    // Aki celebration animation!
    setAkiExpression('happy');
    aiAvatar.style.transform = "scale(1.4) rotate(360deg)";
    setTimeout(() => {
      aiAvatar.style.transform = "";
    }, 1000);
    
    aiBubble.textContent = "Amazing! You coded it perfectly! Aki is super proud of you. Let's move onto the next adventure!";
    speakText(aiBubble.textContent);

    successCard.classList.remove("hidden");
    
    // Auto-scroll dashboard-panel to bring success card into focus
    successCard.scrollIntoView({ behavior: 'smooth' });
  } else {
    playSound('error');
    setAkiExpression('thinking');
    aiAvatar.style.transform = "scale(0.85) translateY(8px)";
    setTimeout(() => {
      aiAvatar.style.transform = "";
    }, 800);
    
    aiBubble.textContent = "Hmm, not quite there yet. Check the instructions or click the Hint button for a helpful clue! You can do it!";
    speakText(aiBubble.textContent);
  }
});

// Hint click
hintBtn.addEventListener("click", () => {
  initAudio();
  if (!currentSession) return;
  playSound('hint');
  
  setAkiExpression('hint');
  aiAvatar.style.transform = "scale(1.25) rotate(-15deg)";
  setTimeout(() => {
    aiAvatar.style.transform = "";
  }, 800);
  
  aiBubble.textContent = `Hint: ${currentSession.hint}`;
  speakText(aiBubble.textContent);
});

// TTS click trigger
ttsBtn.addEventListener("click", () => {
  initAudio();
  if (!currentSession) return;
  playSound('click');
  speakText(aiBubble.textContent);
});

// Hover voiceover for AI bubble
aiBubble.addEventListener("mouseenter", () => {
  if (voiceHoverToggle.checked) {
    speakText(aiBubble.textContent);
  }
});

// Next Session Trigger
nextSessionBtn.addEventListener("click", () => {
  initAudio();
  playSound('click');
  
  let nextSessionExists = false;
  let nextChIdx = currentChapterIdx;
  let nextSIdx = currentSessionIdx + 1;

  if (nextSIdx >= CHAPTERS_DATA[currentChapterIdx].sessions.length) {
    nextChIdx = currentChapterIdx + 1;
    nextSIdx = 0;
  }

  if (nextChIdx < CHAPTERS_DATA.length) {
    nextSessionExists = true;
  }

  if (nextSessionExists) {
    selectSession(nextChIdx, nextSIdx);
  } else {
    // Finished all sessions!
    setAkiExpression('happy');
    aiBubble.textContent = "Hooray! You completed all the coding chapters! You are officially a Web Coding Wizard! 🧙‍♂️🎉";
    speakText(aiBubble.textContent);
    successCard.classList.add("hidden");
  }
});

// Enable audio banner interactions
enableAudioBtn.addEventListener("click", () => {
  initAudio();
  playSound('click');
});

// Prompt for Audio Interaction permission after user loads page
window.addEventListener("click", () => {
  initAudio();
}, { once: true });

// Initialize Platform
function init() {
  loadProgress();
  
  // Find first uncompleted session to start with, or default to ch1-s1
  let targetChIdx = 0;
  let targetSIdx = 0;
  let found = false;

  for (let c = 0; c < CHAPTERS_DATA.length; c++) {
    for (let s = 0; s < CHAPTERS_DATA[c].sessions.length; s++) {
      if (!progress[CHAPTERS_DATA[c].sessions[s].id]) {
        targetChIdx = c;
        targetSIdx = s;
        found = true;
        break;
      }
    }
    if (found) break;
  }

  // Load first session
  selectSession(targetChIdx, targetSIdx);
  
  // Show system audio note banner for 8 seconds if not clicked
  setTimeout(() => {
    if (!audioCtx) {
      audioBanner.classList.remove("hidden");
    }
  }, 1000);
}

// Kick off
init();
