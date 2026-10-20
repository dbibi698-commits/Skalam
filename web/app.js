const $ = (id) => document.getElementById(id);

const templates = {
  html: `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
body { font-family: system-ui; background:#101827; color:white; text-align:center; padding:28px; }
button { padding:12px 16px; border:0; border-radius:10px; color:white; background:#0284c7; }
</style>
</head>
<body>
<h1>Hello, Studio!</h1>
<p>Edit this file and press Run / Preview.</p>
<button onclick="document.querySelector('p').textContent='It works!'">Test button</button>
</body>
</html>`,
  javascript: `const message = "Hello from JavaScript";\nconsole.log(message);\nmessage;`,
  python: `print("Hello from Python!")\n# Editing is available here.\n# Run Python with a Python runtime, not the browser.`,
  java: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello from Java!");\n    }\n}`,
  css: `body {\n  background: #101827;\n  color: white;\n  font-family: system-ui;\n}\n`
};
const names = {html:"index.html", javascript:"script.js", python:"main.py", java:"Main.java", css:"style.css"};

function selectedLanguage() { return $("languageSelect").value; }
function updateFileLabel() { $("fileLabel").textContent = names[selectedLanguage()]; }
function setResponse(text) { $("assistantResponse").textContent = text; }

$("languageSelect").addEventListener("change", () => {
  const lang = selectedLanguage();
  $("codeEditor").value = templates[lang];
  updateFileLabel();
  $("editorHint").textContent = lang === "html" ? "HTML/CSS/JS browser preview." :
    `${names[lang]} ফাইল এডিট ও export করা যাবে। এই ভাষার জন্য আলাদা runtime/compiler লাগবে।`;
});

$("goEditor").addEventListener("click", () => $("editorPanel").scrollIntoView({behavior:"smooth"}));
$("sendCommand").addEventListener("click", handleCommand);
$("commandInput").addEventListener("keydown", e => { if (e.key === "Enter") handleCommand(); });

function handleCommand() {
  const raw = $("commandInput").value.trim();
  const q = raw.toLowerCase();
  if (!q) return;
  if (q.includes("youtube") || q.includes("ইউটিউব")) {
    setResponse("YouTube খুলছি।"); window.open("https://m.youtube.com", "_blank", "noopener");
  } else if (q.includes("facebook") || q.includes("ফেসবুক")) {
    setResponse("Facebook খুলছি।"); window.open("https://www.facebook.com", "_blank", "noopener");
  } else if (q.includes("google") || q.includes("গুগল") || q.includes("search") || q.includes("সার্চ")) {
    setResponse("Google Search খুলছি।");
    window.open("https://www.google.com/search?q=" + encodeURIComponent(raw), "_blank", "noopener");
  } else if (q.includes("editor") || q.includes("এডিটর") || q.includes("code") || q.includes("কোড")) {
    setResponse("Code Editor খুলছি।"); $("editorPanel").scrollIntoView({behavior:"smooth"});
  } else if (q.includes("preview") || q.includes("প্রিভিউ") || q.includes("run") || q.includes("রান")) {
    runCode(); setResponse("Preview চালানো হয়েছে।"); $("previewPanel").scrollIntoView({behavior:"smooth"});
  } else if (q.includes("hello") || q.includes("হ্যালো") || q.includes("হাই")) {
    setResponse("হ্যালো! আমি তোমার লোকাল সহকারী। কী করতে হবে বলো।");
  } else {
    setResponse("এই কমান্ডটি লোকাল assistant-এ যোগ করা হয়নি। Google Search বা Editor কমান্ড চেষ্টা করো।");
  }
}

function speakText(text) {
  if (!("speechSynthesis" in window)) { setResponse("এই browser-এ text-to-speech support নেই।"); return; }
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "bn-IN";
  utterance.rate = 0.92;
  speechSynthesis.speak(utterance);
}
$("assistantResponse").addEventListener("dblclick", () => speakText($("assistantResponse").textContent));
$("voiceButton").addEventListener("click", () => {
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Recognition) {
    setResponse("Voice recognition এই browser-এ নেই। Chrome বা Android WebView speech integration ব্যবহার করো।");
    return;
  }
  const rec = new Recognition();
  rec.lang = "bn-IN";
  rec.interimResults = false;
  rec.onresult = event => {
    $("commandInput").value = event.results[0][0].transcript;
    handleCommand();
  };
  rec.onerror = () => setResponse("Voice input ব্যর্থ। Microphone permission ও internet/browser support পরীক্ষা করো।");
  rec.start();
});
document.querySelectorAll("[data-url]").forEach(button => button.addEventListener("click", () => {
  window.open(button.dataset.url, "_blank", "noopener");
}));

function runCode() {
  const lang = selectedLanguage();
  const code = $("codeEditor").value;
  if (lang === "html") {
    $("previewFrame").srcdoc = code;
    $("editorHint").textContent = "HTML preview আপডেট হয়েছে।";
  } else if (lang === "javascript") {
    // Execute only in a sandboxed preview frame and show console output.
    const safe = JSON.stringify(code).replace(/</g, "\\u003c");
    $("previewFrame").srcdoc = `<!doctype html><meta charset="utf-8"><body style="font:14px monospace;padding:12px"><b>JavaScript output</b><pre id="out"></pre><script>
      const out=document.getElementById('out');
      const oldLog=console.log;
      console.log=(...args)=>{out.textContent+=args.map(String).join(' ')+'\\n';oldLog(...args)};
      try { const result=(function(){ ${code}\n})(); if(result!==undefined) out.textContent+=String(result); }
      catch(e){out.textContent='Error: '+e.message}
    <\/script>`;
    $("editorHint").textContent = "JavaScript sandbox preview চালানো হয়েছে।";
  } else {
    $("editorHint").textContent = `${names[lang]} ফাইলটি edit/export করা যায়, কিন্তু browser-এ রান হয় না। উপযুক্ত Python runtime বা Java compiler দরকার।`;
    setResponse(`${lang.toUpperCase()} চালাতে আলাদা runtime/compiler দরকার।`);
  }
}
$("runCode").addEventListener("click", runCode);
$("clearPreview").addEventListener("click", () => { $("previewFrame").srcdoc = ""; });

$("saveFile").addEventListener("click", () => {
  const lang = selectedLanguage();
  const blob = new Blob([$("codeEditor").value], {type:"text/plain;charset=utf-8"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = names[lang]; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});
$("openFile").addEventListener("click", () => $("fileInput").click());
$("fileInput").addEventListener("change", async event => {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  $("codeEditor").value = await file.text();
  $("fileLabel").textContent = file.name;
  $("editorHint").textContent = "Loaded: " + file.name;
  const ext = file.name.split(".").pop().toLowerCase();
  const mapping = {html:"html",htm:"html",js:"javascript",py:"python",java:"java",css:"css"};
  if (mapping[ext]) $("languageSelect").value = mapping[ext];
  event.target.value = "";
});
$("codeEditor").addEventListener("keydown", e => {
  if (e.key === "Tab") {
    e.preventDefault();
    const start = e.target.selectionStart, end = e.target.selectionEnd;
    e.target.setRangeText("  ", start, end, "end");
  }
});

$("codeEditor").value = templates.html;
updateFileLabel();
$("previewFrame").srcdoc = templates.html;
