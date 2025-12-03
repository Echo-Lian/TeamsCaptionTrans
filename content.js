console.log("[TeamsCaption] Extension loaded.");

const seen = new Set();
let targetLanguage = 'zh-CN';
let observer = null;

async function loadSettings() {
  try {
    const result = await chrome.storage.sync.get(['targetLanguage']);
    targetLanguage = result.targetLanguage || 'zh-CN';
    console.log("[TeamsCaption] Target language:", targetLanguage);
  } catch (error) {
    console.error("[TeamsCaption] Error loading settings:", error);
  }
}

async function translateText(text) {
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLanguage}&dt=t&q=${encodeURIComponent(text)}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data && data[0] && data[0][0] && data[0][0][0]) {
      return data[0][0][0];
    }
    return null;
  } catch (error) {
    console.error("[TeamsCaption] Translation error:", error);
    return null;
  }
}

function displayTranslation(original, translated) {
  chrome.runtime.sendMessage({
    type: 'NEW_TRANSLATION',
    original: original,
    translated: translated,
    timestamp: Date.now()
  }).catch(err => {
    console.error("[TeamsCaption] Error sending message:", err);
  });
}

async function handleNewCaption(text) {
  if (!text || seen.has(text)) return;
  seen.add(text);

  console.log("[TeamsCaption] NEW:", text);

  const translated = await translateText(text);
  if (translated) {
    console.log("[TeamsCaption] TRANSLATED:", translated);
    displayTranslation(text, translated);
  }
}

function startObserver() {
  if (observer) {
    observer.disconnect();
  }

  observer = new MutationObserver(mutations => {
    try {
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const spans = node.querySelectorAll?.('[data-tid="closed-caption-text"]');
            spans?.forEach(span => {
              const text = span.innerText?.trim();
              if (text) {
                handleNewCaption(text);
              }
            });
          }
        }
      }
    } catch (error) {
      console.error("[TeamsCaption] Observer error:", error);
    }
  });

  if (document.body) {
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    console.log("[TeamsCaption] Observer started.");
  } else {
    console.error("[TeamsCaption] document.body not available.");
  }
}

function initialize() {
  loadSettings().then(() => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', startObserver);
    } else {
      startObserver();
    }
    console.log("[TeamsCaption] Ready.");
  });
}

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && changes.targetLanguage) {
    targetLanguage = changes.targetLanguage.newValue;
    console.log("[TeamsCaption] Language changed to:", targetLanguage);
  }
});

initialize();
