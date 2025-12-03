# Teams Live Caption Translator

A Chrome/Edge browser extension that captures live captions from Microsoft Teams meetings and translates them bidirectionally between Chinese and English.

## Features

- Automatically detects and captures live captions from Teams meetings
- **Bidirectional translation**: Chinese → English and English → Chinese
- Automatic language detection
- Real-time translation display with language direction indicators
- Clean popup interface to view live translations
- Translation history with timestamps
- Shows detected source language and target language for each translation

## Installation

### Step 1: Generate Icons

1. Open `generate-icons.html` in your browser
2. Click each download button to save the three icon files (icon16.png, icon48.png, icon128.png)
3. Place the downloaded icons in the extension directory

### Step 2: Load the Extension

1. Open Chrome or Edge browser
2. Navigate to `chrome://extensions/` (Chrome) or `edge://extensions/` (Edge)
3. Enable "Developer mode" (toggle in the top right)
4. Click "Load unpacked"
5. Select the extension directory containing these files

## Usage

### Starting a Translation Session

1. Join a Microsoft Teams meeting
2. Enable live captions in Teams (More > Language and speech > Show live captions)
3. The extension will automatically detect and translate captions:
   - **Chinese captions** → Translated to **English**
   - **English captions** → Translated to **Chinese (Simplified)**
4. Click the extension icon in your browser toolbar to:
   - View real-time translations with language direction
   - See translation history
   - Clear translation history

### How It Works

The extension uses automatic language detection to determine if the caption is in Chinese or English, then translates it to the opposite language:

- Detects Chinese (Simplified, Traditional, or any zh variant) → Translates to English
- Detects English → Translates to Chinese (Simplified)
- Shows the detected source language and target language for each translation

## Files

- `manifest.json` - Extension configuration
- `content.js` - Caption detection and translation logic
- `popup.html` - Extension popup interface
- `popup.js` - Popup functionality
- `popup.css` - Popup styling
- `generate-icons.html` - Icon generation tool

## Privacy

This extension:
- Only runs on teams.microsoft.com domains
- Uses Google Translate API for translations
- Does not store or transmit your meeting content
- All translations are processed locally in your browser

## Troubleshooting

### Captions not being detected

- Make sure live captions are enabled in Teams (More > Language and speech > Show live captions)
- Refresh the Teams page after installing the extension
- Open the browser console (F12) and look for `[TeamsCaption]` log messages
- Verify you see messages like `[TeamsCaption] Ready - Bidirectional mode (Chinese ↔ English)`

### Translations not appearing

- Click the extension icon to open the popup
- Check the browser console for `[TeamsCaption] NEW:` and `[TeamsCaption] TRANSLATED:` messages
- Verify your internet connection (translation requires Google Translate API access)
- Make sure the caption text is either in Chinese or English

### Console debugging

Open the browser console (F12) to see detailed logs:
- `[TeamsCaption] NEW: [text]` - Caption detected
- `[TeamsCaption] Detected language: [lang]` - Language detected
- `[TeamsCaption] TRANSLATED: [text]` - Translation completed
- `[TeamsCaption] Direction: [source] -> [target]` - Translation direction

## Development

To modify the extension:

1. Make changes to the source files
2. Go to `chrome://extensions/`
3. Click the refresh icon on the extension card
4. Reload the Teams page to test changes

## License

MIT License - Feel free to modify and use this extension as needed.
