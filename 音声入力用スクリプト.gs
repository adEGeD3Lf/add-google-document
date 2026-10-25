
/**
 * Webアプリを表示するための設定
 */
function doGet() {
  return HtmlService.createTemplateFromFile('index')
      .evaluate()
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/**
 * 登録済みドキュメント一覧を取得する（DriveAppは使わない）
 */
function getRegisteredDocs() {
  const json = PropertiesService.getUserProperties().getProperty('docs');
  return json ? JSON.parse(json) : [];
}

/**
 * URLまたはIDからドキュメントを登録する
 */
function registerDoc(urlOrId) {
  const m = String(urlOrId || '').match(/\/d\/([a-zA-Z0-9_-]+)/);
  const id = m ? m[1] : String(urlOrId || '').trim();
  if (!id) return {ok: false, message: 'URLまたはIDを入力してください。'};
  try {
    const name = DocumentApp.openById(id).getName();
    const docs = getRegisteredDocs().filter(d => d.id !== id);
    docs.unshift({id: id, name: name});
    PropertiesService.getUserProperties().setProperty('docs', JSON.stringify(docs));
    return {ok: true, message: '✅ 登録しました: ' + name, docs: docs};
  } catch (e) {
    return {ok: false, message: '❌ 開けませんでした: ' + e.message};
  }
}

/**
 * 登録を解除する
 */
function removeDoc(id) {
  const docs = getRegisteredDocs().filter(d => d.id !== id);
  PropertiesService.getUserProperties().setProperty('docs', JSON.stringify(docs));
  return docs;
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