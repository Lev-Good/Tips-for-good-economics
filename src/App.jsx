import React, { useState, useEffect } from 'react';
import './App.css';
import { 
  fetchAllData, 
  formatBytes,
  APPS_SCRIPT_URL 
} from './driveService';

// Real articles extracted from Issue 53 for mock interactive reading!
const MOCK_ARTICLES = [
  {
    title: 'למה כל כך קשה לנו להעלות מחירים?',
    author: 'זאב וויינברגר',
    role: 'מלווה ומאמן פיננסי לעסקים ופרטיים',
    content: `אנחנו יודעים שצריך להעלות מחיר. יודעים שהמחיר הנוכחי לא באמת מחזיק את העסק. יודעים שאם נמשיך ככה, נעבוד קשה מדי ויישאר מעט מדי. ובכל זאת, אנחנו לא מצליחים להעלות.

הפחד מהפסד חזק יותר מהרצון להרוויח:
הכלכלנים דניאל כהנמן ועמוס טברסקי קראו לזה "שנאת הפסד": הכאב מהפסד מורגש אצלנו חזק יותר מהרווח האפשרי. לכן בעל עסק יכול להבין שהעלאת מחיר תעשה לו טוב, ועדיין להיתקע בגלל הפחד לאבד לקוח.

אבל במובן מסוים, אחד הדברים הטובים ביותר שעסק יכול לעשות לעצמו הוא להעלות מחירים. כמובן לא בצורה עיוורת ובלי הצדקה, אבל כשזה נעשה נכון נוצרת לולאת משוב חיובית. מחיר גבוה יותר משדר ללקוח: אני מקצועי, אני יודע מה אני עושה, ואני לא מתבייש בערך שאני נותן.`
  },
  {
    title: 'דירות על הנייר - איך בודקים מחיר?',
    author: 'מולי פשדמיסקי',
    role: 'יועץ נדל"ן ומנחה מקצועי',
    content: `כדי להבין מחיר אמיתי של דירה מקבלן צריך קודם להבין שאין באמת "מחיר למ"ר" אחד. יש שיטות שונות לחשב, וכל שינוי קטן בשיטה משנה את התוצאה.

הדרך הנפוצה ביותר להציג מחיר נמוך למ"ר היא להכניס לחישוב גם מרפסות, מחסנים ולעיתים עוד הצמדות שונות. לדוגמה: דירה של 100 מטר בנוי עם 20 מטר מרפסת. הרבה פעמים יחשבו את המרפסת כחצי שטח, כלומר כאילו מדובר בעוד 10 מטר "שווי ערך". ואז במקום לחלק את מחיר הדירה ב-100 מטר, מחלקים ב-110 וככה פתאום המחיר למ"ר נראה זול יותר. 
השוואה נכונה היא לא לפרויקט חדש אחר, אלא לדירות שנמכרו בפועל בשוק היד השנייה בדירות יחסית חדשות באותו אזור.`
  },
  {
    title: 'הסיכון בדרייברים והסעות פיראטיות',
    author: 'מיכה שולם',
    role: 'יועץ עסקי ובעלים של חברת אופקט',
    content: `ביום שישי האחרון, בכביש 1 בדרך בין בני ברק לירושלים התרחשה תאונה קשה שגבתה את חייו של תינוק קטנטן. אני רוצה לדבר על הנהג של הרכב, ודווקא מהזווית הכלכלית שלו. 

נהג הרכב היה "דרייב" - נהג שעובד בשחור להסעת נוסעים בניגוד גמור לחוק. מעטים יודעים, אבל לנוסעי הרכב של הדרייבר, כולל לנהג עצמו, אין ביטוח! וגם אם הוא יספר לכם שכן ויציג פוליסה - היא מתבטלת רטרואקטיבית מהרגע ששולם כסף עבור הנסיעה. 

מדובר בהתחייבויות ענק של מאות אלפי שקלים בליסינג על רכבי פאר כדי לעמוד בתחרות, בריבית רצחנית, שגוררת נהיגה מטורפת במהירות מופרזת כדי להספיק עוד נסיעה ולכסות את החובות.`
  },
  {
    title: 'קצפת או לחם מיובש? הרמוניה זוגית בכלכלת הבית',
    author: 'אבישי ויינגולד',
    role: 'מאמן מומחה לכלכלת הבית והרמוניה זוגית',
    content: `דייג מתחיל ישב לו במזח והמתין נואשות לדגים מהזריחה ועד חצות היום ושום דג לא עלה לו בחכתו. הציץ בקערה של חבירו ורואה שהיא מלאה בדגים! שאל אותו: "איך זה אתה הצלחת לדוג ואני לא?" השיב לו: "מה שמת כפיתיון?" אמר לו: "עוגת קצפת!". אמר לו חברו: "זו הסיבה, היית צריך לשים לחם מיובש!".

אבל איפה ההיגיון? הרי עוגת קצפת הרבה יותר טעימה מלחם מיובש?
אכן, בני אדם מעדיפים קצפת, אך הדגים מעדיפים לחם מיובש! 
הוא הדין בענייננו: כאשר אנחנו מנסים לשכנע את בן/בת הזוג עם טיעונים שמדברים אלינו בלבד, אנחנו מפספסים כי בן הזוג לא חש את ההיגיון שלנו. עלינו להיכנס לראש של הצד השני ולהשתמש בטיעונים שמעניינים אותו.`
  }
];

function App() {
  // Theme Management
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('app_theme');
    if (savedTheme) return savedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Clear any old stored URL to ensure it always uses the new hardcoded one
  useEffect(() => {
    localStorage.removeItem('gdrive_apps_script_url');
  }, []);
  
  // App States (Entire tree is loaded in categories)
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Loading & UI States
  const [loading, setLoading] = useState(false);
  const [showHelpAlert, setShowHelpAlert] = useState(false);
  
  // Modal Previews
  const [previewFile, setPreviewFile] = useState(null);
  const [activeMockArticleIndex, setActiveMockArticleIndex] = useState(0);

  // Apply Theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('app_theme', theme);
  }, [theme]);

  // Load all categories and files at startup
  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      try {
        const fetchedData = await fetchAllData();
        setCategories(fetchedData);
        if (fetchedData && fetchedData.length > 0) {
          setActiveCategory(fetchedData[0]);
          
          // Check if it's using the fallback mock data
          const isMockData = fetchedData[0]?.id?.startsWith('cat-');
          if (isMockData) {
            setShowHelpAlert(true);
          } else {
            setShowHelpAlert(false);
          }
        }
      } catch (err) {
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, []);



  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Get all files from active category
  const activeFiles = activeCategory ? activeCategory.files : [];

  // Filter files based on search query
  const filteredFiles = activeFiles.filter(file => {
    const query = searchQuery.toLowerCase();
    return (
      file.name.toLowerCase().includes(query) ||
      (file.description && file.description.toLowerCase().includes(query)) ||
      (file.author && file.author.toLowerCase().includes(query))
    );
  });

  // Calculate total files
  const totalFilesCount = categories.reduce((acc, cat) => acc + (cat.files ? cat.files.length : 0), 0);

  // Helper to determine if we are showing mock details
  const isMockFile = previewFile && previewFile.id.startsWith('mock-');

  return (
    <div className="app-wrapper">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="header-brand">
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="44" height="44" rx="12" fill="#0c6c44"/>
              <path d="M12 28V24C12 20.6863 14.6863 18 18 18H26C29.3137 18 32 20.6863 32 24V28" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              <circle cx="22" cy="18" r="4" fill="white"/>
              <rect x="20" y="24" width="4" height="12" rx="2" fill="#fbbf24"/>
              <rect x="14" y="26" width="4" height="10" rx="2" fill="white"/>
              <rect x="26" y="28" width="4" height="8" rx="2" fill="white"/>
            </svg>
            <div className="header-title-wrapper">
              <span className="brand-name">טיפים לכלכלה נכונה</span>
              <span className="brand-subtitle">הקהילה החרדית הגדולה לחסכון והתנהלות כלכלית</span>
            </div>
          </div>
          
          <div className="header-actions">
            <button className="theme-toggle" onClick={toggleTheme} title="שינוי מצב עיצוב">
              {theme === 'light' ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="app-container">
        
        {/* Help Alert */}
        {showHelpAlert && (
          <div className="glass-card animate-fade-in" style={{ padding: '16px 24px', background: 'rgba(251, 191, 36, 0.1)', border: '1px solid rgba(251, 191, 36, 0.4)', borderRadius: '12px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '20px' }}>⚠️</span>
            <p style={{ fontSize: '14px', color: 'var(--text-primary)', margin: 0 }}>
              <strong>החיבור בוצע:</strong> ה-Apps Script פועל, אך התיקייה בדרייב ריקה או שאין בה הרשאות שיתוף פומביות. האתר מציג כעת <strong>נתוני דמה פרימיום</strong> (המגזין שלכם גליון 53). ברגע שתעלו קבצים פומביים לדרייב – הם יופיעו כאן אוטומטית!
            </p>
          </div>
        )}

        {/* Hero Section */}
        <section className="hero-section glass-card animate-fade-in">
          <span className="hero-tag">מרכז הקבצים והמדריכים הרשמי</span>
          <h1 className="hero-title">עושים סדר בכסף שלכם</h1>
          <p className="hero-subtitle">
            כל הטיפים, המדריכים המקצועיים וגליונות המייל השבועיים של קבוצת "טיפים לכלכלה נכונה" מרוכזים ונגישים במקום אחד יפהפה ומאובטח.
          </p>
          
          <div className="search-container">
            <div className="search-input-wrapper">
              <input 
                type="text" 
                className="search-input"
                placeholder="חפש גליונות, מדריכים, טיפים או כותבים..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
          </div>
        </section>

        {/* Stats Banner */}
        <section className="stats-banner">
          <div className="stat-card glass-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <svg className="stat-icon" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            <span className="stat-number">{loading ? '...' : activeFiles.length}</span>
            <span className="stat-label">קבצים בקטגוריה הנוכחית</span>
          </div>
          
          <div className="stat-card glass-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <svg className="stat-icon" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
            </svg>
            <span className="stat-number">{loading ? '...' : categories.length}</span>
            <span className="stat-label">קטגוריות ידע פתוחות</span>
          </div>
          
          <div className="stat-card glass-card animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <svg className="stat-icon" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <span className="stat-number">{loading ? '...' : totalFilesCount}</span>
            <span className="stat-label">סה"כ קבצים במאגר</span>
          </div>
        </section>

        {/* Main Content Area */}
        <section className="main-content-layout">
          
          {/* Sidebar */}
          <aside className="sidebar-panel">
            <h3 className="sidebar-title">קטגוריות</h3>
            <ul className="category-list">
              {loading ? (
                Array(3).fill(0).map((_, i) => (
                  <li key={i} className="skeleton category-item" style={{ height: '50px' }} />
                ))
              ) : (
                categories.map(cat => (
                  <li key={cat.id}>
                    <button 
                      className={`category-item ${activeCategory?.id === cat.id ? 'active' : ''}`}
                      onClick={() => setActiveCategory(cat)}
                    >
                      <span>{cat.name}</span>
                      <span className="category-count">{cat.files ? cat.files.length : 0} קבצים</span>
                    </button>
                  </li>
                ))
              )}
            </ul>
          </aside>
          
          {/* Files Grid area */}
          <div className="files-display-area">
            <div className="files-header">
              <h2 className="category-heading">{activeCategory ? activeCategory.name : 'בטעינה...'}</h2>
              <span className="results-count">
                {searchQuery ? `נמצאו ${filteredFiles.length} תוצאות חיפוש` : `מציג ${filteredFiles.length} קבצים`}
              </span>
            </div>

            <div className="files-scroll-container">
              <div className="files-grid">
              {loading ? (
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="glass-card file-card skeleton">
                    <div className="skeleton-preview skeleton" />
                    <div style={{ padding: '24px' }}>
                      <div className="skeleton-text skeleton" style={{ width: '80%' }} />
                      <div className="skeleton-text skeleton" style={{ width: '90%' }} />
                      <div className="skeleton-text skeleton" style={{ width: '50%', marginTop: '20px' }} />
                    </div>
                  </div>
                ))
              ) : filteredFiles.length === 0 ? (
                <div className="empty-view glass-card">
                  <span className="empty-icon">🔍</span>
                  <h3 className="empty-title">לא נמצאו קבצים</h3>
                  <p className="empty-desc">לא הצלחנו למצוא קבצים שתואמים את הגדרות החיפוש שלך או שאין קבצים בתיקייה זו.</p>
                </div>
              ) : (
                filteredFiles.map(file => (
                  <article key={file.id} className="glass-card file-card animate-fade-in">
                    <div className="file-preview">
                      {file.thumbnailLink ? (
                        <img 
                          src={file.thumbnailLink} 
                          alt={file.name} 
                          className="file-thumbnail" 
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="file-icon-placeholder">
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                          </svg>
                        </div>
                      )}
                      <span className="file-type-badge">PDF</span>
                    </div>

                    <div className="file-info">
                      <div className="file-meta-top">
                        <span className="file-author">מאת: {file.author}</span>
                        <time>{new Date(file.modifiedTime).toLocaleDateString('he-IL')}</time>
                      </div>
                      
                      <h3 className="file-title" title={file.name}>{file.name}</h3>
                      <p className="file-description">{file.description}</p>
                      
                      <div className="file-footer">
                        <span className="file-size">{formatBytes(file.size)}</span>
                        <div className="file-actions">
                          <button 
                            onClick={() => setPreviewFile(file)}
                            className="btn-icon-only"
                            title="צפייה פנימית באתר"
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                              <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                          </button>
                          
                          {file.webContentLink && file.webContentLink !== '#' ? (
                            <a 
                              href={file.webContentLink} 
                              className="btn-card-primary"
                              title="הורדת קובץ"
                            >
                              <span>הורדה</span>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="7 10 12 15 17 10"></polyline>
                                <line x1="12" y1="15" x2="12" y2="3"></line>
                              </svg>
                            </a>
                          ) : (
                            <button 
                              className="btn-card-primary" 
                              onClick={() => alert('קבצי דמה אינם ניתנים להורדה אמיתית. בעת העלאת קבצים אמיתיים לדרייב, כפתור זה יוריד אותם מיידית!')}
                            >
                              <span>הורדה</span>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="7 10 12 15 17 10"></polyline>
                                <line x1="12" y1="15" x2="12" y2="3"></line>
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
            </div>
          </div>
        </section>

        {/* CTA Area */}
        <section className="community-cta">
          <div className="cta-card glass-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="cta-icon-wrapper">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                <line x1="12" y1="18" x2="12.01" y2="18"></line>
              </svg>
            </div>
            <div className="cta-info">
              <h3 className="cta-title">המערכת הטלפונית החדשה</h3>
              <p className="cta-description">
                מערכת קולית מתקדמת המקריאה באופן אוטומטי כל עדכון או טיפ שמתפרסם בקבוצה. ניתן גם להירשם לקבלת צינתוק על כל הודעה חדשה.
              </p>
              <div className="phone-number">1700-111-212</div>
              <span className="brand-subtitle">* הרשמה לקבלת צינתוק בשלוחה 4</span>
            </div>
          </div>
          
          <div className="cta-card glass-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="cta-icon-wrapper">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </div>
            <div className="cta-info">
              <h3 className="cta-title">הצטרפו לרשימת התפוצה</h3>
              <p className="cta-description">
                רוצים לקבל את הגליונות השבועיים והמדריכים המיוחדים ישירות לתיבת המייל שלכם? השאירו פרטים ותישארו מעודכנים.
              </p>
              <a href="mailto:05202020a@gmail.com?subject=בקשת הצטרפות לרשימת התפוצה של טיפים לכלכלה נכונה" className="btn-accent" style={{ alignSelf: 'flex-start' }}>
                <span>הצטרפו במייל</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </a>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-content">
          <svg width="34" height="34" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="44" height="44" rx="12" fill="#0c6c44" opacity="0.6"/>
            <path d="M12 28V24C12 20.6863 14.6863 18 18 18H26C29.3137 18 32 20.6863 32 24V28" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="22" cy="18" r="4" fill="white"/>
            <rect x="20" y="24" width="4" height="12" rx="2" fill="#fbbf24"/>
          </svg>
          <p className="footer-text">
            © {new Date().getFullYear()} טיפים לכלכלה נכונה. כל הזכויות שמורות. <br/>
            המידע מוגש כעזר ואינו מהווה תחליף לייעוץ פיננסי מקצועי המותאם אישית.
          </p>
        </div>
      </footer>



      {/* PDF / File Preview Modal */}
      {previewFile && (
        <div className="modal-overlay" style={{ backdropFilter: 'blur(12px)', zIndex: 1100 }}>
          <div className="modal-content glass-card animate-fade-in" style={{ maxWidth: '90%', width: '1000px', height: '85vh', display: 'flex', flexDirection: 'column', padding: '24px' }}>
            <button className="modal-close" style={{ top: '16px', left: '16px' }} onClick={() => setPreviewFile(null)}>✕</button>
            
            <div className="preview-header" style={{ marginBottom: '16px', paddingLeft: '40px' }}>
              <h2 className="modal-title" style={{ margin: 0, fontSize: '20px' }}>{previewFile.name}</h2>
              <span className="brand-subtitle" style={{ fontSize: '13px' }}>מאת: {previewFile.author}</span>
            </div>

            {/* Content Container */}
            <div className="preview-body" style={{ flexGrow: 1, position: 'relative', overflow: 'hidden', background: 'var(--bg)', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
              {isMockFile ? (
                /* Beautiful interactive OCR mock reader */
                <div className="mock-reader-layout" style={{ height: '100%', display: 'grid', gridTemplateColumns: '260px 1fr', overflow: 'hidden' }}>
                  {/* Articles Sidebar */}
                  <div className="reader-sidebar" style={{ background: 'var(--card-bg)', borderLeft: '1px solid var(--card-border)', padding: '16px', overflowY: 'auto' }}>
                    <h4 style={{ fontSize: '14px', marginBottom: '12px', color: 'var(--text-primary)', borderBottom: '1px solid var(--card-border)', paddingBottom: '8px' }}>מאמרים בגליון</h4>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {MOCK_ARTICLES.map((art, idx) => (
                        <li key={idx}>
                          <button 
                            onClick={() => setActiveMockArticleIndex(idx)}
                            style={{
                              width: '100%',
                              padding: '10px 12px',
                              textAlign: 'right',
                              background: activeMockArticleIndex === idx ? 'var(--primary)' : 'transparent',
                              color: activeMockArticleIndex === idx ? '#white' : 'var(--text-primary)',
                              border: 'none',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              fontSize: '13px',
                              fontWeight: '600',
                              transition: 'all 0.2s'
                            }}
                          >
                            <div style={{ color: activeMockArticleIndex === idx ? '#fff' : 'var(--text-primary)' }}>{art.title}</div>
                            <span style={{ fontSize: '11px', color: activeMockArticleIndex === idx ? 'rgba(255,255,255,0.7)' : 'var(--text-secondary)' }}>מאת: {art.author}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Article content view */}
                  <div className="reader-content-body" style={{ padding: '32px', overflowY: 'auto', textAlign: 'right' }}>
                    <div style={{ maxWidth: '650px', margin: '0 auto' }}>
                      <span className="hero-tag" style={{ fontSize: '12px', marginBottom: '8px' }}>{MOCK_ARTICLES[activeMockArticleIndex].role}</span>
                      <h3 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '4px', color: 'var(--text-primary)' }}>
                        {MOCK_ARTICLES[activeMockArticleIndex].title}
                      </h3>
                      <h4 style={{ fontSize: '15px', color: 'var(--primary)', marginBottom: '24px', fontWeight: '700' }}>
                        מאת: {MOCK_ARTICLES[activeMockArticleIndex].author}
                      </h4>
                      <p style={{ fontSize: '16px', lineHeight: '1.8', color: 'var(--text-secondary)', whiteSpace: 'pre-line' }}>
                        {MOCK_ARTICLES[activeMockArticleIndex].content}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                /* Google Drive real iframe PDF preview with touch and desktop scroll wrapper */
                <div className="iframe-scroll-wrapper" style={{ width: '100%', height: '100%', overflow: 'auto', WebkitOverflowScrolling: 'touch' }}>
                  <iframe 
                    src={`https://drive.google.com/file/d/${previewFile.id}/preview`} 
                    width="100%" 
                    height="100%" 
                    style={{ border: 'none', display: 'block' }}
                    scrolling="yes"
                    allow="autoplay"
                    title="תצוגה מקדימה"
                  />
                </div>
              )}
            </div>
            
            <div className="preview-footer" style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="file-size" style={{ fontSize: '13px' }}>גודל הקובץ: {formatBytes(previewFile.size)}</span>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn-secondary" onClick={() => setPreviewFile(null)}>סגור</button>
                {previewFile.webViewLink && previewFile.webViewLink !== '#' && (
                  <a 
                    href={previewFile.webViewLink} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn-secondary" 
                    style={{ padding: '8px 20px', borderRadius: '8px', fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    title="פתח במסך מלא בכרטיסייה חדשה"
                  >
                    <span>פתח במסך מלא</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                  </a>
                )}
                {previewFile.webContentLink && previewFile.webContentLink !== '#' && (
                  <a href={previewFile.webContentLink} className="btn-primary" style={{ padding: '8px 20px', borderRadius: '8px', fontSize: '14px' }}>הורד קובץ</a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
