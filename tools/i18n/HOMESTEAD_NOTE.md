Page: docs/<LANG>/projects/off-grid-ai-homestead.html ("One Acre, Zero Dependency", an off-grid AI farming build: solar sensor node, local LLM scheduler, biodynamic calendar). It is a portfolio/case page, technical and personal.
- Keep the product name "One Acre, Zero Dependency" in English (it is a project name), translate everything around it.
- Technical terms (MicroPython, Pico 2 W, BLE, LoRa, SQLite, LSTM, MPPT, LiFePO4, sensor model names, file/dir names like ingest/, store/, scheduler/) stay as they are.
- Text inside SVG <text> elements in diagrams: translate human words, keep code/file names.
- docs/lt/projects/off-grid-ai-homestead.html is an earlier Lithuanian version: useful for seeing what stays English, but translate from the skeleton (current English).
- SEO: title (<=60) and description (<=155) aimed at what people search in your language for off-grid farming with AI / smart farming / solar sensor for agriculture (e.g. DE "autarke Landwirtschaft KI", NL "off-grid boerderij AI", FR "ferme autonome IA", IT "agricoltura off-grid AI", ES "granja autosuficiente IA", PT "quinta autossuficiente IA"), without adding claims.
Check: python3 tools/check_locale.py <LANG> projects/off-grid-ai-homestead.html until OK.
