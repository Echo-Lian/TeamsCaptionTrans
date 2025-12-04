// background.js
console.log('[TeamsCaption] background worker running');

// store recent translations in chrome.storage.local
const HISTORY_KEY = 'caption_history';
const MAX_HISTORY = 200;

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg && msg.type === 'NEW_TRANSLATION') {
        const original = msg.original;
        const payload = msg.payload; // { translated, detectedLang, targetLang }
        const entry = { original, translated: payload.translated, detectedLang:
            payload.detectedLang, targetLang: payload.targetLang, ts: Date.now() };
        
        chrome.storage.local.get([HISTORY_KEY], (res) => {
            const arr = res[HISTORY_KEY] || [];
            arr.unshift(entry);
            if (arr.length > MAX_HISTORY) arr.length = MAX_HISTORY;
            chrome.storage.local.set({ [HISTORY_KEY]: arr });
        });

        // broadcast to any open popup by runtime message
        chrome.runtime.sendMessage({ type: 'HISTORY_UPDATE', entry });
    }
});

// provide a simple method to clear history via message
chrome.runtime.onMessage.addListener((msg, sender, resp) => {
    if (msg && msg.type === 'CLEAR_HISTORY') {
        chrome.storage.local.set({ [HISTORY_KEY]: [] });
        chrome.runtime.sendMessage({ type: 'HISTORY_CLEARED' });
   }
});