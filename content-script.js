// デフォルト色を取得し、行をチェックしてハイライト
function highlightRows(color) {
  // 対象テーブルを取得（必要なら class や id で絞る）
  const rows = document.querySelectorAll(
    'table.jbc-table tbody tr'
  );
  rows.forEach((tr) => {
    const tds = tr.querySelectorAll("td");
    if (tds.length < 3) return;

    const totalTime = tds[1].innerText.trim(); // 総労働時間
    const manHour   = tds[2].innerText.trim(); // 工数合計

    // 「入力がありません」を数値 0 とみなす
    const isBlank   = manHour.includes("入力がありません");

    // 00:00 行は対象外
    if (totalTime === "00:00") return;

    // 一致しない場合だけハイライト
    if (!isBlank && totalTime !== manHour) {
      tr.style.backgroundColor = color;
    }
  });
}

// 初回実行
chrome.storage.sync.get({ highlightColor: "#ffe2e2" }, (data) => {
  highlightRows(data.highlightColor);
});

// ポップアップから色が変更されたら再ハイライト
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "COLOR_CHANGED") {
    highlightRows(msg.color);
  }
});
