/**
 * Google Drive Apps Script Service for "טיפים לכלכלה נכונה"
 * Fetches the entire folder structure (categories and nested files)
 * in a single request from the user's custom Apps Script Web App.
 * Falls back to high-quality mock data if the request fails or returns empty.
 */

export const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzmr-QJU-8bqTh2v_QgZxRSv5vO9teJMeZkevmPsvjMdCLf3UavnWYQhQ90TK6yenQr/exec';

// Mock Data based on the PDF & brand style (for fallback)
const MOCK_DATA = [
  {
    id: 'cat-magazines',
    name: 'גליונות שבועיים',
    files: [
      {
        id: 'mock-mag-53',
        name: 'גליון מספר 053 /// פרשת נשא /// סיון תשפ"ו',
        mimeType: 'application/pdf',
        webViewLink: '#',
        webContentLink: '#',
        thumbnailLink: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&q=80&w=300',
        modifiedTime: new Date('2026-05-20').toISOString(),
        size: '734105',
        description: 'הכל על אשראי (חלק 1), למה כל כך קשה לנו להעלות מחירים?, דירות על הנייר, הסיכון בדרייברים, החובה להיות אקטיביים בניהול הכסף המשפחתי, ועוד.',
        author: 'ניסן עציוני'
      },
      {
        id: 'mock-mag-52',
        name: 'גליון מספר 052 /// פרשת במדבר /// אייר תשפ"ו',
        mimeType: 'application/pdf',
        webViewLink: '#',
        webContentLink: '#',
        thumbnailLink: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=300',
        modifiedTime: new Date('2026-05-13').toISOString(),
        size: '680000',
        description: 'ניהול תקציב בחגים, היערכות פיננסית לקיץ, דירוג אשראי אישי, והטבות מיוחדות לחברי הקהילה.',
        author: 'ניסן עציוני'
      },
      {
        id: 'mock-mag-51',
        name: 'גליון מספר 051 /// פרשת בהר-בחוקותי /// אייר תשפ"ו',
        mimeType: 'application/pdf',
        webViewLink: '#',
        webContentLink: '#',
        thumbnailLink: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=300',
        modifiedTime: new Date('2026-05-06').toISOString(),
        size: '710000',
        description: 'משכנתאות במסלול ישיר, השקעות נדל"ן בפריפריה, וחיסכון חכם בסופרמרקט לקראת שבועות.',
        author: 'ניסן עציוני'
      }
    ]
  },
  {
    id: 'cat-guides',
    name: 'מדריכים וכלים פרקטיים',
    files: [
      {
        id: 'mock-guide-mortgage',
        name: 'מדריך מעשי לנטילת משכנתא אופטימלית',
        mimeType: 'application/pdf',
        webViewLink: '#',
        webContentLink: '#',
        thumbnailLink: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=300',
        modifiedTime: new Date('2026-04-10').toISOString(),
        size: '1250000',
        description: 'הבנת מסלולי משכנתא, תמהיל מומלץ, ניהול משא ומתן מול הבנקים, וכיצד למנוע טעויות נפוצות שעולות מאות אלפי שקלים.',
        author: 'יעקב ולדמן'
      },
      {
        id: 'mock-guide-credit',
        name: 'חוברת השוואת כרטיסי אשראי והטבות קאשבק',
        mimeType: 'application/pdf',
        webViewLink: '#',
        webContentLink: '#',
        thumbnailLink: 'https://images.unsplash.com/photo-1589758438368-0ad531db3366?auto=format&fit=crop&q=80&w=300',
        modifiedTime: new Date('2026-04-25').toISOString(),
        size: '950000',
        description: 'סקירה מקיפה של כרטיסי Cash Back מובילים בישראל (Fly Card, Max Back Total, Cal Pro) וכיצד להתאים אותם להרגלי ההוצאות שלכם.',
        author: 'איטה שטיין'
      },
      {
        id: 'mock-guide-budget',
        name: 'מדריך חמשת השלבים לניהול תקציב משפחתי',
        mimeType: 'application/pdf',
        webViewLink: '#',
        webContentLink: '#',
        thumbnailLink: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=300',
        modifiedTime: new Date('2026-03-15').toISOString(),
        size: '1050000',
        description: 'שיטה מעשית מבוססת מחקר בכלכלה התנהגותית לשליטה בהוצאות והגדלת החיסכון החודשי מבלי לפגוע באיכות החיים.',
        author: 'פישל רוזנפלד'
      }
    ]
  },
  {
    id: 'cat-tips',
    name: 'טיפים מהירים לחיסכון',
    files: [
      {
        id: 'mock-tip-1',
        name: 'טיפ שבועי: מבחן היחסיות למניעת רכישות רגשיות',
        mimeType: 'application/pdf',
        webViewLink: '#',
        webContentLink: '#',
        thumbnailLink: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=300',
        modifiedTime: new Date('2026-05-18').toISOString(),
        size: '150000',
        description: 'כיצד תרגיל מנטלי פשוט של השהיית תגובה ב-48 שעות יכול לחסוך לכם אלפי שקלים בשנה על קניות אימפולסיביות.',
        author: 'ישראל גוטמן'
      },
      {
        id: 'mock-tip-2',
        name: 'טיפ שבועי: דירות על הנייר - פירוק אשליית המחיר למ"ר',
        mimeType: 'application/pdf',
        webViewLink: '#',
        webContentLink: '#',
        thumbnailLink: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=300',
        modifiedTime: new Date('2026-05-12').toISOString(),
        size: '180000',
        description: 'הבנת ההבדלים בין שוק יד שנייה לרכישה מקבלן ואיך אנשי שיווק משתמשים במרפסות ומחסנים כדי להציג מחיר מוזל כביכול.',
        author: 'מולי פשדמיסקי'
      }
    ]
  }
];

/**
 * Fetches all categories and their files from the Apps Script Web App.
 * Automatically falls back to mock data if the script URL is not loaded,
 * if there is a network error, or if it returns an empty array.
 */
export async function fetchAllData(customUrl = null) {
  const targetUrl = customUrl || localStorage.getItem('gdrive_apps_script_url') || APPS_SCRIPT_URL;
  
  if (!targetUrl) {
    console.log('No Web App URL provided, returning mock data.');
    return MOCK_DATA;
  }

  try {
    console.log('Fetching data from Google Apps Script...', targetUrl);
    const response = await fetch(targetUrl);
    
    if (!response.ok) {
      throw new Error(`Server returned status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(`Apps Script Error: ${data.error}`);
    }

    // If data is empty (e.g. return is []), fall back to mock data
    if (!data || data.length === 0) {
      console.warn('Apps Script returned an empty array. This might mean you do not have subfolders or files in your main Drive folder yet. Loading mock data so the site is beautiful!');
      return MOCK_DATA;
    }

    // Map through the received categories to ensure all properties exist
    return data.map(category => ({
      id: category.id,
      name: category.name,
      files: (category.files || []).map(file => ({
        id: file.id,
        name: file.name,
        mimeType: file.mimeType || 'application/pdf',
        webViewLink: file.webViewLink || '#',
        webContentLink: file.webContentLink || '#',
        // If Google Drive has a thumbnail, use it, otherwise use Unsplash relative images or fallbacks
        thumbnailLink: file.thumbnailLink ? file.thumbnailLink.replace('=s220', '=s600') : null,
        modifiedTime: file.modifiedTime || new Date().toISOString(),
        size: file.size || '0',
        description: file.description || 'קובץ מקצועי מתוך קהילת טיפים לכלכלה נכונה.',
        author: file.author || 'מערכת כלכלה נכונה'
      }))
    }));
  } catch (error) {
    console.error('Error fetching data from Google Apps Script:', error);
    console.log('Gracefully falling back to mock data for demonstration.');
    return MOCK_DATA;
  }
}

/**
 * Format bytes to readable size (e.g. 710 KB, 1.2 MB)
 */
export function formatBytes(bytes, decimals = 2) {
  if (!bytes || bytes === '0') return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
