console.log("[TeamsCaption] Extension loaded.");

const seen = new Set();

function handleNewCaption(text) {
  if (!text || seen.has(text)) return;
  seen.add(text);

  console.log("[TeamsCaption] NEW:", text);

  // TODO: send to translation API
  // translate(text).then(result => console.log("[Translated]", result));
}

const observer = new MutationObserver(mutations => {
  for (const m of mutations) {
    for (const node of m.addedNodes) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const spans = node.querySelectorAll?.('[data-tid="closed-caption-text"]');
        spans?.forEach(span => handleNewCaption(span.innerText.trim()));
      }
    }
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

console.log("[TeamsCaption] Ready.");
