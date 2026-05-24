/**
 * =========================================================================
 * קוד Google Apps Script משודרג ועמיד עבור אתר "טיפים לכלכלה נכונה"
 * =========================================================================
 * 
 * קוד זה סורק את תיקיית ה-Google Drive שלכם ומחזיר את כל הקבצים והתיקיות בזמן אמת.
 * תומך ב:
 * 1. קבצים המונחים ישירות בתיקיית האב (מציג אותם תחת "קבצים ומדריכים כלליים").
 * 2. תתי-תיקיות (מציג כל תיקייה כקטגוריה נפרדת באתר).
 * 3. חילוץ אוטומטי של שם הכותב מתוך תיאור הקובץ בדרייב (לדוגמה תיאור: "מדריך... מאת: פישל רוזנפלד").
 * 4. ניקוי סיומת ה-PDF משם הקובץ לתצוגה נקייה ואסתטית באתר.
 * 
 * =========================================================================
 * 🛠️ הוראות פריסה ועדכון (חשוב מאוד לקרוא!):
 * 1. העתיקו את כל הקוד שבקובץ זה.
 * 2. כנסו ל-Google Apps Script שלכם והדביקו אותו במקום הקוד הישן.
 * 3. לחצו על שמירה (סמל הדיסקט).
 * 4. לחצו למעלה על Deploy -> ואז על Manage deployments.
 * 5. לחצו על סמל העיפרון (עריכה) בשורת ה-Web app.
 * 6. תחת תיבת הדו-שיח "Version", שנו את הבחירה ל-"New version" (גרסה חדשה) - שלב זה קריטי!
 * 7. לחצו על הכפתור הכחול Deploy.
 * =========================================================================
 */

function doGet(e) {
  // מזהה תיקיית האב שלכם ב-Google Drive
  var parentFolderId = "15w9PaAXKnqkdY-6laKe1uWnTwI_DjrzT"; 
  
  try {
    var parentFolder = DriveApp.getFolderById(parentFolderId);
    var result = [];
    
    // 1. סריקת תתי-תיקיות (קטגוריות) במידה וקיימות
    var subfolders = parentFolder.getFolders();
    
    while (subfolders.hasNext()) {
      var subfolder = subfolders.next();
      var categoryData = {
        id: subfolder.getId(),
        name: subfolder.getName(),
        files: []
      };
      
      var files = subfolder.getFiles();
      while (files.hasNext()) {
        var file = files.next();
        categoryData.files.push(parseFile(file));
      }
      
      if (categoryData.files.length > 0) {
        result.push(categoryData);
      }
    }
    
    // 2. סריקת קבצים שנמצאים ישירות בתיקיית השורש הראשית (תיקיית האב)
    var rootFiles = parentFolder.getFiles();
    if (rootFiles.hasNext()) {
      var rootCategory = {
        id: parentFolderId,
        name: "קבצים ומדריכים כלליים",
        files: []
      };
      while (rootFiles.hasNext()) {
        var file = rootFiles.next();
        rootCategory.files.push(parseFile(file));
      }
      
      if (rootCategory.files.length > 0) {
        // הצבת תיקיית השורש בראש רשימת הקטגוריות
        result.unshift(rootCategory);
      }
    }
    
    // החזרת התוצאה כ-JSON תואם CORS לשימוש חופשי בדפדפן
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * פונקציית עזר לפרסור ועיבוד נתוני קובץ בודד
 */
function parseFile(file) {
  var desc = file.getDescription() || "";
  var author = "מערכת כלכלה נכונה";
  
  // תמיכה בחילוץ אוטומטי של שם הכותב מתוך תיאור הקובץ (למשל: "טיפ שבועי מאת: ניסן עציוני")
  if (desc.includes("מאת:")) {
    var parts = desc.split("מאת:");
    desc = parts[0].trim();
    author = parts[1].trim();
  }
  
  return {
    id: file.getId(),
    name: file.getName().replace(/\.[^/.]+$/, ""), // הסרת סיומת הקובץ (למשל .pdf) מהשם המוצג
    mimeType: file.getMimeType(),
    webViewLink: file.getUrl(),
    webContentLink: "https://drive.google.com/uc?export=download&id=" + file.getId(),
    thumbnailLink: "https://drive.google.com/thumbnail?id=" + file.getId() + "&sz=w600",
    modifiedTime: file.getLastUpdated().toISOString(),
    size: file.getSize().toString(),
    description: desc || "",
    author: author
  };
}
