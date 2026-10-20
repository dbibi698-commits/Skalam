# Mobile AI Studio

A starter Android + Python project for a mobile coding studio and Bengali voice assistant.

## Project structure
- `requirements.txt`: Python dependencies for the optional Flask preview server.
- `app.py`: optional local web preview server (Python + Flask).
- `web/index.html`: mobile-friendly editor UI with HTML/CSS/JavaScript preview.
- `web/style.css`: UI styles.
- `web/app.js`: editor interactions, local file import/export, voice commands.
- `android/README.md`: Android packaging options and notes.
- `android/app/src/main/AndroidManifest.xml`: starter manifest for a native Android shell.
- `android/app/src/main/java/com/example/mobileaistudio/MainActivity.java`: basic WebView activity.
- `android/app/src/main/res/values/styles.xml`: Android theme.

## Run the web preview in Termux
```bash
pkg update
pkg install python
pip install -r requirements.txt
python app.py
```
Open `http://127.0.0.1:5000` in a browser.

## Build an APK
The Android folder is a starter source layout, not a complete Gradle project yet. For a reliable APK, open/create an Android project in Android Studio and copy the manifest, Java activity, and resources into it, then add a Gradle wrapper/build files. Android Studio is the recommended route. A web page alone cannot grant full phone control; Android permissions and platform APIs are required.

## Important limits
- No AI API key is used. The assistant is rule-based and works with local commands.
- HTML/CSS/JavaScript preview runs in a sandboxed browser frame.
- Python editor text is editable but Python execution needs a Python runtime.
- Android apps, calls, camera, microphone, accessibility and arbitrary file access require explicit Android APIs/permissions. This project does not bypass permissions or secretly control other apps.
