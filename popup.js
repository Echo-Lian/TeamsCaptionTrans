const translations = [];

async function loadSettings() {
  try {
    const result = await chrome.storage.sync.get(['targetLanguage']);
    const targetLanguage = result.targetLanguage || 'zh-CN';
    document.getElementById('targetLanguage').value = targetLanguage;
  } catch (error) {
    console.error('Error loading settings:', error);
  }
}

async function saveSettings() {
  const targetLanguage = document.getElementById('targetLanguage').value;
  const statusEl = document.getElementById('saveStatus');

  try {
    await chrome.storage.sync.set({ targetLanguage });
    statusEl.textContent = 'Settings saved!';
    statusEl.className = 'status-message success';

    setTimeout(() => {
      statusEl.textContent = '';
      statusEl.className = 'status-message';
    }, 2000);
  } catch (error) {
    console.error('Error saving settings:', error);
    statusEl.textContent = 'Error saving settings';
    statusEl.className = 'status-message error';
  }
}

function formatTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString();
}

function displayTranslations() {
  const listEl = document.getElementById('translationsList');

  if (translations.length === 0) {
    listEl.innerHTML = '<div class="no-translations">No translations yet. Start a Teams meeting with live captions!</div>';
    return;
  }

  listEl.innerHTML = translations.map(t => `
    <div class="translation-item">
      <div class="translation-original">${escapeHtml(t.original)}</div>
      <div class="translation-translated">${escapeHtml(t.translated)}</div>
      <div class="translation-time">${formatTime(t.timestamp)}</div>
    </div>
  `).join('');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function clearHistory() {
  translations.length = 0;
  displayTranslations();
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'NEW_TRANSLATION') {
    translations.unshift({
      original: message.original,
      translated: message.translated,
      timestamp: message.timestamp
    });

    if (translations.length > 50) {
      translations.pop();
    }

    displayTranslations();
  }
});

document.getElementById('saveSettings').addEventListener('click', saveSettings);
document.getElementById('clearHistory').addEventListener('click', clearHistory);

loadSettings();
displayTranslations();
