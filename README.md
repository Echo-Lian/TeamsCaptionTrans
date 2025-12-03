# Teams Live Caption Translator

A Chrome/Edge browser extension that captures live captions from Microsoft Teams meetings and translates them in real-time.

## Features

- Automatically detects and captures live captions from Teams meetings
- Real-time translation to multiple languages
- Clean popup interface to view translations and manage settings
- Supports 12+ target languages including Chinese, Spanish, French, German, Japanese, and more
- Translation history with timestamps

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
2. Enable live captions in Teams (Settings > Captions)
3. The extension will automatically detect and translate captions
4. Click the extension icon in your browser toolbar to:
   - View real-time translations
   - Change target language
   - Clear translation history

### Supported Languages

- Chinese (Simplified)
- Chinese (Traditional)
- Spanish
- French
- German
- Japanese
- Korean
- Portuguese
- Russian
- Arabic
- Hindi
- Italian

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

- Make sure live captions are enabled in Teams
- Refresh the Teams page after installing the extension
- Check the browser console (F12) for any errors

### Translations not appearing

- Click the extension icon to open the popup
- Verify your target language is selected
- Check your internet connection

## Development

To modify the extension:

1. Make changes to the source files
2. Go to `chrome://extensions/`
3. Click the refresh icon on the extension card
4. Reload the Teams page to test changes

## License

MIT License - Feel free to modify and use this extension as needed.
