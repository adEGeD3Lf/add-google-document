
/**
 * Webアプリを表示するための設定
 */
function doGet() {
  return HtmlService.createTemplateFromFile('index')
      .evaluate()
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/**
 * 初期表示用：最近使った5件を取得する
 */
function getRecentDocs() {
  const files = DriveApp.getFilesByType(MimeType.GOOGLE_DOCS);
  let docList = [];
  let count = 0;
  while (files.hasNext() && count < 5) {
    let file = files.next();
    if (!file.isTrashed()) {
      docList.push({id: file.getId(), name: file.getName()});
      count++;
    }
  }
  return docList;
}

/**
 * 全件取得用：すべてのGoogleドキュメントを取得する
 */
function getAllDocs() {
  const files = DriveApp.getFilesByType(MimeType.GOOGLE_DOCS);
  let docList = [];
  while (files.hasNext()) {
    let file = files.next();
    if (!file.isTrashed()) {
      docList.push({id: file.getId(), name: file.getName()});
    }
  }
  // 名前順に並び替え
  docList.sort((a, b) => a.name.localeCompare(b.name, 'ja'));
  return docList;
}

/**
 * 指定したドキュメントの先頭にテキストを追加する
 */
function addTextToTop(docId, text) {
  if (!docId || !text) return "ファイルまたは内容が空です。";

  try {
    const doc = DocumentApp.openById(docId);
    const body = doc.getBody();
    
    // 現在の日時を取得（日本時間）
    const now = Utilities.formatDate(new Date(), "JST", "yyyy/MM/dd HH:mm");
    
    // フォーマットの組み立て：【日時】 + 改行 + 本文 + 改行
    const formattedText = "【" + now + "】\n" + text + "\n";
    
    // 0番目の位置（ドキュメントの一番上）に挿入
    body.insertParagraph(0, formattedText);
    
    return "✅ 保存に成功しました！";
  } catch (e) {
    return "❌ エラーが発生しました: " + e.message;
  }
}