const picker = document.getElementById("colorPicker");
const saved  = document.getElementById("saved");

// 保存済みの色を読み込み
chrome.storage.sync.get({ highlightColor: "#ffe2e2" }, (data) => {
  picker.value = data.highlightColor;
});

// 変更を保存 & content-script に通知
picker.addEventListener("input", (e) => {
  const color = e.target.value;
  chrome.storage.sync.set({ highlightColor: color }, () => {
    saved.hidden = false;
    setTimeout(() => (saved.hidden = true), 1200);
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { type: "COLOR_CHANGED", color });
    });
  });
});
