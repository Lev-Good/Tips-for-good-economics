import React, { useState, useEffect } from 'react';
import './App.css';
import { 
  Users, BookOpen, MessageCircle, GraduationCap, 
  Eye, BellOff, ShoppingBag, PieChart, 
  ShoppingCart, Home, Building2, TrendingUp, 
  Briefcase, AlertTriangle, Globe,
  Search, ChevronLeft, Download, Maximize2, Minimize2
} from 'lucide-react';
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

  // Load search index at startup for full-text search
  useEffect(() => {
    const loadSearchIndex = async () => {
      try {
        const baseUrl = import.meta.env.BASE_URL || '/';
        const res = await fetch(baseUrl + 'search-index.json');
        if (res.ok) {
          const indexData = await res.json();
          setSearchIndex(indexData);
          console.log('✅ Successfully loaded full-text search index!');
        }
      } catch (err) {
        console.log('Full-text search index not found (this is normal in development).', err.message);
      }
    };
    loadSearchIndex();
  }, []);

  // Clear any old stored URL to ensure it always uses the new hardcoded one
  useEffect(() => {
    localStorage.removeItem('gdrive_apps_script_url');
  }, []);
  // Search Index state for full-text PDF search
  const [searchIndex, setSearchIndex] = useState([]);

  // App States (Entire tree is loaded in categories)
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [nameSearchQuery, setNameSearchQuery] = useState('');
  const [contentSearchQuery, setContentSearchQuery] = useState('');
  
  // Loading & UI States
  const [loading, setLoading] = useState(false);
  const [showHelpAlert, setShowHelpAlert] = useState(false);
  
  // Selected File for In-App Viewer
  const [selectedFile, setSelectedFile] = useState(null);
  const [activeMockArticleIndex, setActiveMockArticleIndex] = useState(0);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [readerFontSize, setReaderFontSize] = useState(16);

  const handleSelectFile = (file) => {
    setSelectedFile(file);
    setActiveMockArticleIndex(0);
    setIsSidebarCollapsed(true); // Auto collapse sidebar for focused reading
    setReaderFontSize(16); // Reset font size
  };

  const handleBackToHome = () => {
    setSelectedFile(null);
    setIsSidebarCollapsed(false); // Restore sidebar
  };

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
        
        // Load videos from videos.json
        let videoData = [];
        try {
          const baseUrl = import.meta.env.BASE_URL || '/';
          const res = await fetch(baseUrl + 'videos.json');
          if (res.ok) {
            videoData = await res.json();
            console.log(`Loaded ${videoData.length} videos!`);
          }
        } catch (vErr) {
          console.log('No videos.json found yet:', vErr.message);
        }

        let finalCategories = [...fetchedData];
        if (videoData.length > 0) {
          finalCategories.push({
            id: 'cat-videos',
            name: 'סרטוני הקהילה 🎥',
            files: videoData.map(v => ({
              id: v.id,
              name: v.title,
              author: 'קהילת מסודרים',
              modifiedTime: v.published,
              size: 0,
              type: 'video', // Custom type to render YouTube embed
              thumbnailLink: v.thumbnail || `https://img.youtube.com/vi/${v.id}/hqdefault.jpg`,
              description: 'סרטון מתוך ערוץ היוטיוב הרשמי של קבוצת מסודרים.'
            }))
          });
        }

        setCategories(finalCategories);
        if (finalCategories.length > 0) {
          setActiveCategory(finalCategories[0]);
          
          // Check if it's using the fallback mock data
          const isMockData = finalCategories[0]?.id?.startsWith('cat-');
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

  // Filter files in sidebar based on name search query
  const filteredFilesByName = React.useMemo(() => {
    const query = nameSearchQuery.trim().toLowerCase();
    const files = activeCategory ? activeCategory.files : [];
    if (!query) return files;
    return files.filter(file => 
      file.name.toLowerCase().includes(query) ||
      (file.author && file.author.toLowerCase().includes(query)) ||
      (file.description && file.description.toLowerCase().includes(query))
    );
  }, [nameSearchQuery, activeCategory]);

  // Global Full-Text Search inside file contents
  const fullTextSearchResults = React.useMemo(() => {
    const query = contentSearchQuery.trim().toLowerCase();
    if (!query) return [];

    const results = [];
    const matchingIds = new Set();
    const fileHighlights = {};

    if (searchIndex && searchIndex.length > 0) {
      searchIndex.forEach(item => {
        const matchName = (item.name || '').toLowerCase().includes(query);
        const matchDesc = (item.description || '').toLowerCase().includes(query);
        const matchAuthor = (item.author || '').toLowerCase().includes(query);
        const matchText = (item.text || '').toLowerCase().includes(query);

        if (matchName || matchDesc || matchAuthor || matchText) {
          matchingIds.add(item.id);
          
          if (matchText) {
            const textLower = item.text.toLowerCase();
            const idx = textLower.indexOf(query);
            const start = Math.max(0, idx - 60);
            const end = Math.min(item.text.length, idx + query.length + 60);
            fileHighlights[item.id] = '...' + item.text.slice(start, end).trim() + '...';
          } else {
            fileHighlights[item.id] = item.description || '';
          }
        }
      });
    }

    categories.forEach(cat => {
      if (cat.files) {
        cat.files.forEach(file => {
          if (matchingIds.has(file.id)) {
            results.push({
              ...file,
              categoryName: cat.name,
              searchHighlight: fileHighlights[file.id] || file.description || ''
            });
          }
        });
      }
    });

    return results;
  }, [contentSearchQuery, categories, searchIndex]);

  // Helper to highlight a search query word in a snippet
  const highlightSnippet = (text, query) => {
    if (!text || !query) return text || '';
    const escapedQuery = query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`(${escapedQuery})`, 'gi');
    return text.replace(regex, '<mark class="highlight">$1</mark>');
  };

  // Helper to determine if we are showing mock details
  const isMockFile = selectedFile && selectedFile.id.startsWith('mock-');

  return (
    <div className="app-wrapper">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="header-brand" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <img src="logo.svg" alt="לוגו טיפים לכלכלה נכונה" className="header-logo" style={{ height: '54px', width: 'auto', display: 'block' }} />
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
          <div className="glass-card help-alert animate-fade-in">
            <AlertTriangle className="alert-icon" size={24} />
            <p>
              <strong>החיבור בוצע:</strong> ה-Apps Script פועל, אך התיקייה בדרייב ריקה או שאין בה הרשאות שיתוף פומביות. האתר מציג כעת <strong>נתוני דמה פרימיום</strong> (המגזין שלכם גליון 53). ברגע שתעלו קבצים פומביים לדרייב – הם יופיעו כאן אוטומטית!
            </p>
          </div>
        )}

        {/* Compact Hero Section */}
        <section className="hero-section glass-card animate-fade-in compact-hero">
          <span className="hero-tag">קבוצת הטיפים הגדולה במגזר החרדי</span>
          <h1 className="hero-title">ספריית המדריכים והחוברות</h1>
          <p className="hero-subtitle">
            מידע וכלים פרקטיים שישנו את הדרך שבה אתם מנהלים את הכסף שלכם. עיינו במדריכים והחוברות ישירות באתר, או בצעו חיפוש מהיר בתוכן.
          </p>
        </section>

        {/* Integrated Library Layout */}
        <section className={`library-layout ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
          
          {/* Right Sidebar: Books, categories, and name filter */}
          <aside className="library-sidebar glass-card">
            <div className="sidebar-header">
              <h3 className="sidebar-heading">ניווט וחיפוש מדריכים</h3>
              
              {/* Category dropdown select */}
              <div className="category-select-wrapper">
                <label className="sidebar-label">סינון לפי נושא:</label>
                <select 
                  className="category-dropdown-select" 
                  value={activeCategory?.id || ''} 
                  onChange={(e) => {
                    const cat = categories.find(c => c.id === e.target.value);
                    if (cat) setActiveCategory(cat);
                  }}
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name} ({cat.files ? cat.files.length : 0})
                    </option>
                  ))}
                </select>
              </div>

              {/* Search book names */}
              <div className="sidebar-search-box">
                <label className="sidebar-label">חיפוש לפי שם:</label>
                <div className="sidebar-search-input-wrapper">
                  <input 
                    type="text" 
                    className="library-search-input" 
                    placeholder="חפש בשם המדריך..." 
                    value={nameSearchQuery}
                    onChange={(e) => setNameSearchQuery(e.target.value)}
                  />
                  <Search size={16} className="search-icon-small" />
                </div>
              </div>
            </div>

                {/* List of files in active category, filtered by name search */}
            <ul className="library-file-list">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <li key={i} className="skeleton file-item-skeleton" style={{ height: '56px', marginBottom: '8px', borderRadius: '10px' }} />
                ))
              ) : filteredFilesByName.length === 0 ? (
                <div className="sidebar-empty">
                  <Globe size={24} style={{ opacity: 0.5, marginBottom: '8px' }} />
                  <span>לא נמצאו קבצים מתאימים</span>
                </div>
              ) : (
                filteredFilesByName.map(file => (
                  <li key={file.id}>
                    <button 
                      className={`file-list-item ${selectedFile?.id === file.id ? 'active' : ''}`}
                      onClick={() => handleSelectFile(file)}
                    >
                      <div className="file-item-info">
                        <span className="file-item-name">{file.name}</span>
                        <span className="file-item-author">מאת: {file.author}</span>
                      </div>
                      <ChevronLeft size={16} className="file-item-arrow" />
                    </button>
                  </li>
                ))
              )}
            </ul>
          </aside>

          {/* Left Area: Main Workspace (Viewer or Welcome Dashboard) */}
          <div className="library-main-view">
            {selectedFile ? (
              /* Reading Mode: In-App Document Viewer */
              <div className="library-viewer-panel glass-card animate-fade-in">
                <div className="viewer-header">
                  <div className="viewer-title-section">
                    <span className="viewer-category-badge">{activeCategory?.name}</span>
                    <h2 className="viewer-title">{selectedFile.name}</h2>
                    <div className="viewer-meta">
                      <span className="viewer-author">מאת: {selectedFile.author}</span>
                      <span className="viewer-divider">•</span>
                      <span className="viewer-date">{new Date(selectedFile.modifiedTime).toLocaleDateString('he-IL')}</span>
                      <span className="viewer-divider">•</span>
                      <span className="viewer-size">{formatBytes(selectedFile.size)}</span>
                    </div>
                  </div>
                  
                  <div className="viewer-actions">
                    <button className="btn-secondary toggle-sidebar-btn" onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} title={isSidebarCollapsed ? "הצג סרגל צד" : "תצוגה מלאה"}>
                      {isSidebarCollapsed ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                      <span>{isSidebarCollapsed ? "הצג סרגל צד" : "תצוגה מלאה"}</span>
                    </button>
                    <button className="btn-secondary" onClick={handleBackToHome}>
                      <Home size={16} />
                      <span>חזרה למסך הבית</span>
                    </button>
                    {selectedFile.webContentLink && selectedFile.webContentLink !== '#' ? (
                      <a href={selectedFile.webContentLink} className="btn-primary">
                        <Download size={16} />
                        <span>הורדה</span>
                      </a>
                    ) : (
                      <button className="btn-primary" onClick={() => alert('קבצי דמה אינם ניתנים להורדה אמיתית. בעת העלאת קבצים אמיתיים לדרייב, כפתור זה יוריד אותם מיידית!')}>
                        <Download size={16} />
                        <span>הורדה</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Embedded Viewer Content Container */}
                <div className="viewer-body-container">
                  {selectedFile.type === 'video' ? (
                    /* YouTube Embed Player */
                    <div className="iframe-scroll-wrapper" style={{ background: '#000' }}>
                      <iframe 
                        src={`https://www.youtube.com/embed/${selectedFile.id}?autoplay=1&rel=0`} 
                        width="100%" 
                        height="100%" 
                        style={{ border: 'none', display: 'block' }}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={selectedFile.name}
                      />
                    </div>
                  ) : isMockFile ? (
                    /* Beautiful interactive OCR mock reader for local demonstration */
                    <div className="mock-reader-layout">
                      {/* Articles Sidebar */}
                      <div className="reader-sidebar">
                        <h4 className="reader-sidebar-title">מאמרים בגליון</h4>
                        <ul className="reader-articles-list">
                          {MOCK_ARTICLES.map((art, idx) => (
                            <li key={idx}>
                              <button 
                                className={`reader-article-btn ${activeMockArticleIndex === idx ? 'active' : ''}`}
                                onClick={() => setActiveMockArticleIndex(idx)}
                              >
                                <div className="art-sidebar-title">{art.title}</div>
                                <span className="art-sidebar-author">מאת: {art.author}</span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {/* Article content view */}
                      <div className="reader-content-body">
                        {/* Font size control bar */}
                        <div className="reader-font-controls">
                          <span className="font-controls-label">גודל גופן:</span>
                          <button 
                            className="font-btn" 
                            onClick={() => setReaderFontSize(prev => Math.min(26, prev + 2))} 
                            title="הגדל גופן"
                          >
                            A+
                          </button>
                          <button 
                            className="font-btn" 
                            onClick={() => setReaderFontSize(prev => Math.max(12, prev - 2))} 
                            title="הקטן גופן"
                          >
                            A-
                          </button>
                          <button 
                            className="font-btn reset-btn" 
                            onClick={() => setReaderFontSize(16)} 
                            title="איפוס גופן"
                          >
                            איפוס
                          </button>
                        </div>

                        <div className="reader-content-wrapper">
                          <span className="hero-tag article-role">{MOCK_ARTICLES[activeMockArticleIndex].role}</span>
                          <h3 className="article-title">{MOCK_ARTICLES[activeMockArticleIndex].title}</h3>
                          <h4 className="article-author">מאת: {MOCK_ARTICLES[activeMockArticleIndex].author}</h4>
                          <p className="article-paragraph" style={{ fontSize: `${readerFontSize}px` }}>
                            {MOCK_ARTICLES[activeMockArticleIndex].content}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Google Drive real iframe PDF preview */
                    <div className="iframe-scroll-wrapper">
                      <iframe 
                        src={selectedFile.localUrl ? `${import.meta.env.BASE_URL || '/'}${selectedFile.localUrl}` : `https://drive.google.com/file/d/${selectedFile.id}/preview`} 
                        width="100%" 
                        height="100%" 
                        style={{ border: 'none', display: 'block' }}
                        scrolling="yes"
                        allow="autoplay"
                        title="תצוגה מקדימה פנימית"
                      />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Welcome Mode: Interactive Dashboard & Advanced Full-Text Search */
              <div className="library-welcome-dashboard animate-fade-in">
                
                {/* Separate search input for searching inside all files */}
                <div className="fulltext-search-container glass-card">
                  <div className="fulltext-search-header-info">
                    <h3 className="fulltext-search-heading">חיפוש חכם בתוך תוכן כל החוברות והמדריכים</h3>
                    <p className="fulltext-search-subheading">
                      הקלד מילה או ביטוי, והמערכת תבצע סריקת טקסט מלאה (OCR) בתוך כל החוברות והמדריכים של הקהילה!
                    </p>
                  </div>
                  
                  <div className="search-input-wrapper">
                    <input 
                      type="text" 
                      className="search-input"
                      placeholder="הקלד ביטוי לחיפוש (לדוגמה: משכנתא, עסק, מחיר, ריבית, נדלן...)"
                      value={contentSearchQuery}
                      onChange={(e) => setContentSearchQuery(e.target.value)}
                    />
                    <Search className="search-icon" size={20} />
                  </div>

                  {/* Display beautiful full-text search results inside container */}
                  {contentSearchQuery.trim() !== '' && (
                    <div className="fulltext-results-area animate-fade-in">
                      <h4 className="fulltext-results-title">
                        נמצאו {fullTextSearchResults.length} תוצאות עבור "{contentSearchQuery}"
                      </h4>
                      
                      {fullTextSearchResults.length === 0 ? (
                        <div className="fulltext-empty">לא נמצאו התאמות בתוכן הקבצים. נסה מילת חיפוש אחרת.</div>
                      ) : (
                        <div className="fulltext-results-list">
                          {fullTextSearchResults.map(result => (
                            <div key={result.id} className="fulltext-result-card glass-card">
                              <div className="result-card-header">
                                <div className="result-file-details">
                                  <span className="result-file-category">{result.categoryName}</span>
                                  <h5 className="result-file-name">{result.name}</h5>
                                </div>
                                <button 
                                  className="btn-card-primary"
                                  onClick={() => {
                                    handleSelectFile(result);
                                    // Set category active
                                    const cat = categories.find(c => c.name === result.categoryName);
                                    if (cat) setActiveCategory(cat);
                                  }}
                                >
                                  <span>מעבר לקריאת הקובץ</span>
                                  <ChevronLeft size={14} />
                                </button>
                              </div>
                              <p className="result-snippet">
                                <strong>מקטע שנמצא:</strong> <span dangerouslySetInnerHTML={{ __html: highlightSnippet(result.searchHighlight, contentSearchQuery) }} />
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Dashboard Stats */}
                <div className="dashboard-stats-grid">
                  <div className="dashboard-stat-card glass-card">
                    <Users size={28} className="dashboard-stat-icon" />
                    <div>
                      <span className="dashboard-stat-num">8,000+</span>
                      <span className="dashboard-stat-text">חברי קבוצה</span>
                    </div>
                  </div>
                  <div className="dashboard-stat-card glass-card">
                    <BookOpen size={28} className="dashboard-stat-icon" />
                    <div>
                      <span className="dashboard-stat-num">700+</span>
                      <span className="dashboard-stat-text">מדריכים וטיפים</span>
                    </div>
                  </div>
                  <div className="dashboard-stat-card glass-card">
                    <MessageCircle size={28} className="dashboard-stat-icon" />
                    <div>
                      <span className="dashboard-stat-num">2,500+</span>
                      <span className="dashboard-stat-text">פניות שנענו</span>
                    </div>
                  </div>
                </div>

                {/* Grid of All Available Handbooks in Category (as elegant list cards) */}
                <div className="dashboard-guides-section">
                  <h3 className="guides-section-title">כל המדריכים בקטגוריה: {activeCategory?.name}</h3>
                  <div className="dashboard-guides-grid">
                    {filteredFilesByName.length === 0 ? (
                      <div className="empty-view glass-card" style={{ gridColumn: '1 / -1', padding: '40px' }}>
                        <Globe className="empty-icon" size={40} />
                        <h3 className="empty-title">לא נמצאו מדריכים בקטגוריה זו</h3>
                      </div>
                    ) : (
                      filteredFilesByName.map(file => (
                        <div key={file.id} className="dashboard-guide-card glass-card" onClick={() => handleSelectFile(file)}>
                          <div className="guide-card-icon">
                            <BookOpen size={24} />
                          </div>
                          <div className="guide-card-body">
                            <h4 className="guide-card-title">{file.name}</h4>
                            <p className="guide-card-desc">{file.description}</p>
                            <div className="guide-card-footer">
                              <span className="guide-card-author">מאת: {file.author}</span>
                              <span className="guide-card-action">קרא כעת ←</span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Community marketing info */}
                <div className="dashboard-welcome-info glass-card">
                  <h3>ברוכים הבאים לקהילת "טיפים לכלכלה נכונה"</h3>
                  <p>
                    הפלטפורמה המקצועית והמובילה במגזר החרדי לחסכון, השקעות והתנהלות פיננסית נבונה. 
                    בחר מדריך מסרגל הניווט הימני כדי להתחיל לקרוא אותו ישירות בתוך הדפדפן, או השתמש בתיבת החיפוש החכם כדי לאתר מידע ספציפי בתוך תוכן העלונים.
                  </p>
                </div>

                {/* Why Join Us Section */}
                <section className="features-section glass-card" style={{ marginTop: '30px' }}>
                  <div className="section-header">
                    <span className="hero-tag">הערך המוביל שלנו</span>
                    <h2 className="section-title">למה להצטרף לקהילה?</h2>
                  </div>
                  
                  <div className="features-grid-layout">
                    <div className="feature-item-card">
                      <div className="feature-icon-circle">
                        <Eye size={28} strokeWidth={2} />
                      </div>
                      <h3 className="feature-title">בגובה העיניים</h3>
                      <p className="feature-desc">
                        המידע בקבוצה מוגש בצורה רהוטה, ברורה וממוקדת שתשנה את הדרך שבה אתם מנהלים את הכסף שלכם, עם טיפים וכלים פרקטיים שיכולים לחסוך לכם אלפי שקלים בחודש.
                      </p>
                    </div>

                    <div className="feature-item-card">
                      <div className="feature-icon-circle">
                        <BellOff size={28} strokeWidth={2} />
                      </div>
                      <h3 className="feature-title">קבוצה שקטה</h3>
                      <p className="feature-desc">
                        אנחנו עושים הכל כדי לא לעייף את הקוראים בעומס אינפורמציה ומידע מיותר. כל התכנים והעלונים מפורסמים לאחר חשיבה, תכנון ובדיקה קפדנית בלבד.
                      </p>
                    </div>

                    <div className="feature-item-card">
                      <div className="feature-icon-circle">
                        <ShoppingBag size={28} strokeWidth={2} />
                      </div>
                      <h3 className="feature-title">כוח צרכני חזק</h3>
                      <p className="feature-desc">
                        באמצעות כוח הקנייה האיכותי של אלפי חברי הקהילה החרדית, אנו מכוונים ומובילים שורה של מיזמים ייחודיים להוזלת מחירים, עמלות ועלויות של מוצרים פיננסיים וצרכניים.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Topics Covered Section */}
                <section className="topics-section glass-card" style={{ marginTop: '30px' }}>
                  <div className="section-header">
                    <span className="hero-tag">תחומי התוכן והעלונים</span>
                    <h2 className="section-title">מה תגלו בקהילה שיחסוך לכם כסף?</h2>
                  </div>
                  
                  <div className="topics-grid">
                    <div className="topic-card">
                      <PieChart className="topic-icon" size={32} strokeWidth={1.5} />
                      <h4 className="topic-title">ידע כלכלי</h4>
                    </div>
                    
                    <div className="topic-card">
                      <ShoppingCart className="topic-icon" size={32} strokeWidth={1.5} />
                      <h4 className="topic-title">כלכלת משפחה</h4>
                    </div>

                    <div className="topic-card">
                      <Home className="topic-icon" size={32} strokeWidth={1.5} />
                      <h4 className="topic-title">תהליך המשכנתא</h4>
                    </div>

                    <div className="topic-card">
                      <Building2 className="topic-icon" size={32} strokeWidth={1.5} />
                      <h4 className="topic-title">נדל”ן</h4>
                    </div>

                    <div className="topic-card">
                      <TrendingUp className="topic-icon" size={32} strokeWidth={1.5} />
                      <h4 className="topic-title">השקעות</h4>
                    </div>

                    <div className="topic-card">
                      <Briefcase className="topic-icon" size={32} strokeWidth={1.5} />
                      <h4 className="topic-title">שוק ההון</h4>
                    </div>

                    <div className="topic-card">
                      <AlertTriangle className="topic-icon" size={32} strokeWidth={1.5} />
                      <h4 className="topic-title">מניעת הונאות</h4>
                    </div>

                    <div className="topic-card">
                      <Globe className="topic-icon" size={32} strokeWidth={1.5} />
                      <h4 className="topic-title">מידע ברשת</h4>
                    </div>
                  </div>
                </section>

                {/* Community marketing CTAs */}
                <section className="community-cta" style={{ marginTop: '30px', padding: 0 }}>
                  <div className="cta-card glass-card animate-fade-in">
                    <div className="cta-icon-wrapper">
                      <MessageCircle size={28} />
                    </div>
                    <div className="cta-info">
                      <h3 className="cta-title">ערוץ העדכונים והטיפים בצ'אט</h3>
                      <p className="cta-description">
                        רוצים לקרוא את כל הטיפים, המדריכים והעדכונים הכלכליים שלנו בזמן אמת? הצטרפו לערוץ הראשי בצ'אט.
                      </p>
                      <a href="https://mesudarim.chatfree.app/" target="_blank" rel="noopener noreferrer" className="btn-accent">
                        <span>כניסה לערוץ בצ'אט</span>
                      </a>
                    </div>
                  </div>
                  
                  <div className="cta-card glass-card animate-fade-in">
                    <div className="cta-icon-wrapper">
                      <Globe size={28} />
                    </div>
                    <div className="cta-info">
                      <h3 className="cta-title">קבוצות צ'אט (מנויי נטפרי)</h3>
                      <p className="cta-description">
                        רוצים להצטרף לקבוצות דיון וטיפים קטנות וממוקדות בצ'אט הפתוחות לחלוטין גם למנויי נטפרי? שלחו בקשת הצטרפות אישית.
                      </p>
                      <a href="mailto:nisanetzioni@gmail.com?subject=בקשת הצטרפות לקבוצת הטיפים בצ'אט (מנויי נטפרי)" className="btn-primary">
                        <span>שליחת מייל להצטרפות</span>
                      </a>
                    </div>
                  </div>
                </section>

              </div>
            )}
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-content">
          <img src="logo.svg" alt="לוגו טיפים לכלכלה נכונה" className="footer-logo" style={{ height: '40px', width: 'auto', display: 'block', opacity: 0.8 }} />
          <p className="footer-text">
            © {new Date().getFullYear()} טיפים לכלכלה נכונה. כל הזכויות שמורות. <br/>
            המידע מוגש כעזר ואינו מהווה תחליף לייעוץ פיננסי מקצועי המותאם אישית. <br/>
            <span style={{ marginTop: '8px', display: 'block', fontSize: '13px', opacity: 0.9 }}>
              פותח על ידי <a href="https://lev-good.github.io/Good-heart/" target="_blank" rel="noopener noreferrer" className="footer-credit-link">'לב טוב'</a>
            </span>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
