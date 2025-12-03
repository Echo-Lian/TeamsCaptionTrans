console.log("[TeamsCaption] Extension loaded.");

const seen = new Set();
let observer = null;

async function detectLanguage(text) {
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(text)}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data && data[2]) {
      return data[2];
    }
    return null;
  } catch (error) {
    console.error("[TeamsCaption] Language detection error:", error);
    return null;
  }
}

function isChineseLanguage(langCode) {
  return langCode && (langCode.startsWith('zh') || langCode === 'zh-CN' || langCode === 'zh-TW');
}

async function translateText(text, sourceLang) {
  try {
    let targetLang;

    if (isChineseLanguage(sourceLang)) {
      targetLang = 'en';
    } else {
      targetLang = 'zh-CN';
    }

    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang || 'auto'}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data && data[0] && data[0][0] && data[0][0][0]) {
      return {
        translated: data[0][0][0],
        detectedLang: data[2] || sourceLang,
        targetLang: targetLang
      };
    }
    return null;
  } catch (error) {
    console.error("[TeamsCaption] Translation error:", error);
    return null;
  }
}

function displayTranslation(original, result) {
  chrome.runtime.sendMessage({
    type: 'NEW_TRANSLATION',
    original: original,
    translated: result.translated,
    detectedLang: result.detectedLang,
    targetLang: result.targetLang,
    timestamp: Date.now()
  }).catch(err => {
    console.error("[TeamsCaption] Error sending message:", err);
  });
}

async function handleNewCaption(text) {
  if (!text || seen.has(text)) return;
  seen.add(text);

  console.log("[TeamsCaption] NEW:", text);

  const detectedLang = await detectLanguage(text);
  console.log("[TeamsCaption] Detected language:", detectedLang);

  const result = await translateText(text, detectedLang);
  if (result) {
    console.log("[TeamsCaption] TRANSLATED:", result.translated);
    console.log("[TeamsCaption] Direction:", `${result.detectedLang} -> ${result.targetLang}`);
    displayTranslation(text, result);
  }
}

function checkExistingCaptions() {
  const captions = document.querySelectorAll('[data-tid="closed-caption-text"]');
  console.log("[TeamsCaption] Found", captions.length, "existing caption elements");

  captions.forEach(span => {
    const text = span.innerText?.trim();
    if (text) {
      console.log("[TeamsCaption] Existing caption:", text);
      handleNewCaption(text);
    }
  });
}

function startObserver() {
  if (observer) {
    observer.disconnect();
  }

  observer = new MutationObserver(mutations => {
    try {
      for (const m of mutations) {
        // Check for text changes in existing caption elements
        if (m.type === 'characterData' || m.type === 'childList') {
          let target = m.target;

          // Check if the mutation is within a caption element
          if (target.nodeType === Node.TEXT_NODE) {
            target = target.parentElement;
          }

          // Check if this is a caption element or contains one
          if (target && target.nodeType === Node.ELEMENT_NODE) {
            if (target.getAttribute?.('data-tid') === 'closed-caption-text') {
              const text = target.innerText?.trim();
              if (text) {
                console.log("[TeamsCaption] Caption changed:", text);
                handleNewCaption(text);
              }
            }

            // Also check for newly added caption elements
            const spans = target.querySelectorAll?.('[data-tid="closed-caption-text"]');
            spans?.forEach(span => {
              const text = span.innerText?.trim();
              if (text) {
                console.log("[TeamsCaption] New caption element:", text);
                handleNewCaption(text);
              }
            });
          }
        }

        // Check added nodes
        for (const node of m.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Check if the added node itself is a caption
            if (node.getAttribute?.('data-tid') === 'closed-caption-text') {
              const text = node.innerText?.trim();
              if (text) {
                console.log("[TeamsCaption] Caption node added:", text);
                handleNewCaption(text);
              }
            }

            // Check for captions within the added node
            const spans = node.querySelectorAll?.('[data-tid="closed-caption-text"]');
            spans?.forEach(span => {
              const text = span.innerText?.trim();
              if (text) {
                console.log("[TeamsCaption] Caption in added node:", text);
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
      subtree: true,
      characterData: true,
      characterDataOldValue: false
    });
    console.log("[TeamsCaption] Observer started.");

    // Check for existing captions
    checkExistingCaptions();

    // Periodically check for new captions (fallback)
    setInterval(() => {
      checkExistingCaptions();
    }, 2000);
  } else {
    console.error("[TeamsCaption] document.body not available.");
  }
}

function initialize() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startObserver);
  } else {
    startObserver();
  }
  console.log("[TeamsCaption] Ready - Bidirectional mode (Chinese ↔ English).");
}

initialize();
