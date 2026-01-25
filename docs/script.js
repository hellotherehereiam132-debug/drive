// DOM Elements
const editor = document.getElementById('editor');
const fontSelector = document.querySelector('.font-selector');
const sizeSelector = document.querySelector('.size-selector');
const boldBtn = document.getElementById('btn-bold');
const italicBtn = document.getElementById('btn-italic');
const underlineBtn = document.getElementById('btn-underline');
const textColorBtn = document.getElementById('btn-text-color');
const highlightBtn = document.getElementById('btn-highlight');
const alignLeftBtn = document.getElementById('btn-align-left');
const alignCenterBtn = document.getElementById('btn-align-center');
const alignRightBtn = document.getElementById('btn-align-right');
const alignJustifyBtn = document.getElementById('btn-align-justify');
const listBtn = document.getElementById('btn-list');
const numberedListBtn = document.getElementById('btn-numbered-list');
const undoBtn = document.getElementById('btn-undo');
const redoBtn = document.getElementById('btn-redo');
const titleElement = document.querySelector('.title');
const subtitleElement = document.querySelector('.subtitle');

// History for undo/redo
let history = [editor.innerHTML];
let historyStep = 0;

// Update subtitle with last edit time
function updateLastEdit() {
  const now = new Date();
  subtitleElement.textContent = `Last edit: ${now.toLocaleTimeString()}`;
}

// Font selection
fontSelector.addEventListener('change', () => {
  document.execCommand('fontName', false, fontSelector.value);
  editor.focus();
});

// Font size selection
sizeSelector.addEventListener('change', () => {
  document.execCommand('fontSize', false, sizeSelector.value);
  editor.focus();
});

// Text formatting
boldBtn.addEventListener('click', () => {
  document.execCommand('bold', false, null);
  updateButtonStates();
  editor.focus();
});

italicBtn.addEventListener('click', () => {
  document.execCommand('italic', false, null);
  updateButtonStates();
  editor.focus();
});

underlineBtn.addEventListener('click', () => {
  document.execCommand('underline', false, null);
  updateButtonStates();
  editor.focus();
});

// Text color
textColorBtn.addEventListener('click', () => {
  const color = prompt('Enter color (e.g., red, #FF0000):');
  if (color) {
    document.execCommand('foreColor', false, color);
    editor.focus();
  }
});

// Highlight
highlightBtn.addEventListener('click', () => {
  const color = prompt('Enter highlight color (e.g., yellow, #FFFF00):');
  if (color) {
    document.execCommand('backColor', false, color);
    editor.focus();
  }
});

// Text alignment
alignLeftBtn.addEventListener('click', () => {
  document.execCommand('justifyLeft', false, null);
  updateAlignmentButtons();
  editor.focus();
});

alignCenterBtn.addEventListener('click', () => {
  document.execCommand('justifyCenter', false, null);
  updateAlignmentButtons();
  editor.focus();
});

alignRightBtn.addEventListener('click', () => {
  document.execCommand('justifyRight', false, null);
  updateAlignmentButtons();
  editor.focus();
});

alignJustifyBtn.addEventListener('click', () => {
  document.execCommand('justifyFull', false, null);
  updateAlignmentButtons();
  editor.focus();
});

// Lists
listBtn.addEventListener('click', () => {
  document.execCommand('insertUnorderedList', false, null);
  editor.focus();
});

numberedListBtn.addEventListener('click', () => {
  document.execCommand('insertOrderedList', false, null);
  editor.focus();
});

// Undo/Redo
undoBtn.addEventListener('click', () => {
  if (historyStep > 0) {
    historyStep--;
    editor.innerHTML = history[historyStep];
  }
});

redoBtn.addEventListener('click', () => {
  if (historyStep < history.length - 1) {
    historyStep++;
    editor.innerHTML = history[historyStep];
  }
});

// Keyboard shortcuts
editor.addEventListener('keydown', (e) => {
  if (e.ctrlKey || e.metaKey) {
    if (e.key === 'z' && !e.shiftKey) {
      e.preventDefault();
      undoBtn.click();
    } else if ((e.key === 'z' && e.shiftKey) || (e.key === 'y')) {
      e.preventDefault();
      redoBtn.click();
    }
  }
});

// Save to history
editor.addEventListener('input', () => {
  history = history.slice(0, historyStep + 1);
  history.push(editor.innerHTML);
  historyStep++;
  updateLastEdit();
  updateButtonStates();
});

// Update button states based on current formatting
function updateButtonStates() {
  boldBtn.classList.toggle('active', document.queryCommandState('bold'));
  italicBtn.classList.toggle('active', document.queryCommandState('italic'));
  underlineBtn.classList.toggle('active', document.queryCommandState('underline'));
}

// Update alignment buttons
function updateAlignmentButtons() {
  alignLeftBtn.classList.toggle('active', document.queryCommandState('justifyLeft'));
  alignCenterBtn.classList.toggle('active', document.queryCommandState('justifyCenter'));
  alignRightBtn.classList.toggle('active', document.queryCommandState('justifyRight'));
  alignJustifyBtn.classList.toggle('active', document.queryCommandState('justifyFull'));
}

// Prevent editor from being completely empty
editor.addEventListener('keydown', (e) => {
  if (e.key === 'Backspace' && editor.textContent.length === 1) {
    e.preventDefault();
  }
});

// Initialize
editor.focus();
updateLastEdit();

// Update last edit time periodically
setInterval(updateLastEdit, 60000); // Every minute

// Auto-save to localStorage
setInterval(() => {
  localStorage.setItem('googleDocsCloneDraft', editor.innerHTML);
  localStorage.setItem('googleDocsCloneTitle', titleElement.textContent);
}, 5000); // Every 5 seconds

// Load from localStorage on page load
window.addEventListener('load', () => {
  const savedContent = localStorage.getItem('googleDocsCloneDraft');
  const savedTitle = localStorage.getItem('googleDocsCloneTitle');

  if (savedContent) {
    editor.innerHTML = savedContent;
  }
  if (savedTitle) {
    titleElement.textContent = savedTitle;
  }
});