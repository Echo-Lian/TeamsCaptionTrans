const translations = [];

function getLanguageName(code) {
  const languages = {
    'en': 'English',
    'zh': 'Chinese',
    'zh-CN': 'Chinese (Simplified)',
    'zh-TW': 'Chinese (Traditional)'
  };
  return languages[code] || code;
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

  listEl.innerHTML = translations.map(t => {
    const sourceLang = getLanguageName(t.detectedLang);
    const targetLang = getLanguageName(t.targetLang);
    return `
      <div class="translation-item">
        <div class="translation-direction">${sourceLang} → ${targetLang}</div>
        <div class="translation-original">${escapeHtml(t.original)}</div>
        <div class="translation-translated">→ ${escapeHtml(t.translated)}</div>
        <div class="translation-time">${formatTime(t.timestamp)}</div>
      </div>
    `;
  }).join('');
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
      detectedLang: message.detectedLang,
      targetLang: message.targetLang,
      timestamp: message.timestamp
    });

    if (translations.length > 50) {
      translations.pop();
    }

    displayTranslations();
  }
});

document.getElementById('clearHistory').addEventListener('click', clearHistory);

displayTranslations();
