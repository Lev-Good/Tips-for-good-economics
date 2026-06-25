import React, { useState, useEffect } from 'react';
import './App.css';
import { 
  Users, BookOpen, MessageCircle, GraduationCap, 
  Eye, BellOff, ShoppingBag, PieChart, 
  ShoppingCart, Home, Building2, TrendingUp, 
  Briefcase, AlertTriangle, Globe,
  Search, ChevronLeft, Download, Maximize2, Minimize2,
  Play, Video, Book, FileText
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
  const [activeTab, setActiveTab] = useState('מדריכים');
  const [nameSearchQuery, setNameSearchQuery] = useState('');
  const [contentSearchQuery, setContentSearchQuery] = useState('');
  
  // Loading & UI States
  const [loading, setLoading] = useState(false);
  const [showHelpAlert, setShowHelpAlert] = useState(false);
  const [isSmartSearchOpen, setIsSmartSearchOpen] = useState(false);
  const [isChatDrawerOpen, setIsChatDrawerOpen] = useState(false);
  
  // Selected File for Overlay Modal
  const [selectedFile, setSelectedFile] = useState(null);
  const [activeMockArticleIndex, setActiveMockArticleIndex] = useState(0);
  const [readerFontSize, setReaderFontSize] = useState(16);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  const handleSelectFile = (file) => {
    setSelectedFile(file);
    setActiveMockArticleIndex(0);
    setReaderFontSize(16); // Reset font size
    setIsPlayingVideo(false); // Reset play state
  };

  const handleCloseModal = () => {
    setSelectedFile(null);
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
        let finalCategories = fetchedData
          .map(cat => ({
            ...cat,
            name: cat.name.trim(),
            files: cat.files.map(file => {
              let cleanedName = file.name;
              if (cleanedName.startsWith('טיפים לכלכלה נכונה חוברת מספר')) {
                cleanedName = cleanedName.replace('טיפים לכלכלה נכונה חוברת מספר', 'חוברת מספר');
              }
              return {
                ...file,
                name: cleanedName
              };
            })
          }))
          .filter(cat => cat.name !== 'סרטונים');

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

        if (videoData.length > 0) {
          finalCategories.push({
            id: 'cat-videos',
            name: 'סרטונים',
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
          // Default to "מדריכים" if found
          const defaultCat = finalCategories.find(c => c.name === 'מדריכים') || finalCategories[0];
          setActiveCategory(defaultCat);
          setActiveTab(defaultCat.name);
          
          // Check if it's using the fallback mock data
          const isMockData = defaultCat?.id?.startsWith('cat-');
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

  // Filter files in explorer based on name search query (strict name search)
  const filteredFilesByName = React.useMemo(() => {
    const query = nameSearchQuery.trim().toLowerCase();
    const files = activeCategory ? activeCategory.files : [];
    if (!query) return files;
    return files.filter(file => 
      file.name.toLowerCase().includes(query)
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
            <button className="btn-secondary chat-drawer-toggle" onClick={() => setIsChatDrawerOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }} title="עדכוני הקהילה בצ'אט">
              <MessageCircle size={16} />
              <span>עדכוני הקהילה בצ'אט</span>
            </button>
            
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

        {/* Tab Navigation */}
        <div className="category-nav-cards">
          {['מדריכים', 'חוברות', 'סרטונים', 'אודות'].map(tabName => {
            let icon = <BookOpen size={28} />;
            let subtitle = "מדריכי עומק וכלים פיננסיים";
            let countText = "";

            if (tabName === 'חוברות') {
              icon = <FileText size={28} />;
              subtitle = "עלונים שבועיים וגליונות טיפים";
              const cat = categories.find(c => c.name === 'חוברות');
              if (cat) countText = `${cat.files ? cat.files.length : 0} פריטים`;
            } else if (tabName === 'סרטונים') {
              icon = <Video size={28} />;
              subtitle = "שיעורים וסרטוני הקהילה";
              const cat = categories.find(c => c.name === 'סרטונים');
              if (cat) countText = `${cat.files ? cat.files.length : 0} פריטים`;
            } else if (tabName === 'מדריכים') {
              const cat = categories.find(c => c.name === 'מדריכים');
              if (cat) countText = `${cat.files ? cat.files.length : 0} פריטים`;
            } else if (tabName === 'אודות') {
              icon = <Users size={28} />;
              subtitle = "מידע על הקהילה והחברים";
              countText = "פרטי הקהילה";
            }

            const isActive = activeTab === tabName;

            return (
              <button 
                key={tabName}
                className={`category-nav-card glass-card ${isActive ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab(tabName);
                  setNameSearchQuery(''); // Clear search on tab switch
                  if (tabName !== 'אודות') {
                    const cat = categories.find(c => c.name === tabName);
                    if (cat) setActiveCategory(cat);
                  } else {
                    setActiveCategory(null);
                  }
                }}
              >
                <div className="category-card-icon-wrapper">
                  {icon}
                </div>
                <div className="category-card-content">
                  <h4 className="category-card-title">{tabName}</h4>
                  <span className="category-card-subtitle">{subtitle}</span>
                  <span className="category-card-count">{countText}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Tab Content Area */}
        {activeTab !== 'אודות' ? (
          /* Files Explorer View */
          <div className="library-welcome-dashboard animate-fade-in" style={{ width: '100%' }}>
            
            {/* Control Bar: Simple Search + Smart Content Search Button */}
            <div className="explorer-control-bar glass-card">
              <div className="search-input-wrapper">
                <input 
                  type="text" 
                  className="search-input"
                  placeholder={`חפש בשם ה${activeTab === 'סרטונים' ? 'סרטון' : 'קובץ'}...`}
                  value={nameSearchQuery}
                  onChange={(e) => setNameSearchQuery(e.target.value)}
                />
                <Search className="search-icon" size={18} />
              </div>
              
              <button className="btn-smart-search" onClick={() => setIsSmartSearchOpen(true)}>
                <Search size={16} className="smart-search-icon-btn" />
                <span>חיפוש חכם בתוכן המאמרים והמדריכים</span>
              </button>
            </div>

            {/* Grid of files/videos in active category */}
            <div className="dashboard-guides-section">
              <h3 className="guides-section-title">
                {activeTab === 'סרטונים' ? 'סרטוני הדרכה ושיעורים' : `כל המדריכים והחוברות בקטגוריה: ${activeTab}`}
              </h3>
              <div className={activeTab === 'סרטונים' ? 'dashboard-videos-grid' : 'dashboard-guides-grid'}>
                {loading ? (
                  Array(6).fill(0).map((_, i) => (
                    <div key={i} className="skeleton guide-card-skeleton glass-card" style={{ height: '180px', borderRadius: '16px' }} />
                  ))
                ) : filteredFilesByName.length === 0 ? (
                  <div className="empty-view glass-card" style={{ gridColumn: '1 / -1', padding: '40px' }}>
                    <Globe className="empty-icon" size={40} />
                    <h3 className="empty-title">לא נמצאו קבצים מתאימים</h3>
                  </div>
                ) : (
                  filteredFilesByName.map(file => {
                    const isVideo = file.type === 'video';
                    
                    if (isVideo) {
                      return (
                        <div key={file.id} className="dashboard-video-card glass-card" onClick={() => handleSelectFile(file)}>
                          <div className="video-card-thumbnail-wrapper">
                            <img src={file.thumbnailLink} alt={file.name} className="video-card-thumbnail" />
                            <div className="video-card-play-overlay">
                              <div className="play-button-circle">
                                <Play size={20} fill="currentColor" />
                              </div>
                            </div>
                          </div>
                          <div className="video-card-body">
                            <h4 className="video-card-title">{file.name}</h4>
                            <div className="video-card-footer">
                              <span className="video-card-date">
                                {new Date(file.modifiedTime).toLocaleDateString('he-IL')}
                              </span>
                              <span className="video-card-action">צפייה בסרטון ←</span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    
                    const isDefaultAuthor = !file.author || file.author === 'מערכת כלכלה נכונה';
                    const isDefaultDesc = !file.description || file.description === 'קובץ מקצועי מתוך קהילת טיפים לכלכלה נכונה.';
                    
                    return (
                      <div key={file.id} className="dashboard-guide-card glass-card" onClick={() => handleSelectFile(file)}>
                        <div className="guide-card-icon">
                          {activeTab === 'חוברות' ? <FileText size={24} /> : <BookOpen size={24} />}
                        </div>
                        <div className="guide-card-body">
                          <h4 className="guide-card-title">{file.name}</h4>
                          {!isDefaultDesc && <p className="guide-card-desc">{file.description}</p>}
                          <div className="guide-card-footer">
                            {!isDefaultAuthor && <span className="guide-card-author">מאת: {file.author}</span>}
                            <span className="guide-card-action">קרא כעת ←</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        ) : (
          /* About the Community View ("אודות") */
          <div className="library-welcome-dashboard animate-fade-in" style={{ width: '100%' }}>
            
            {/* Dashboard Stats */}
            <div className="dashboard-stats-grid" style={{ marginTop: '40px' }}>
              <div className="dashboard-stat-card glass-card">
                <Users size={28} className="dashboard-stat-icon" />
                <div>
                  <span className="dashboard-stat-num">15,000+</span>
                  <span className="dashboard-stat-text">חברי קבוצה</span>
                </div>
              </div>
              <div className="dashboard-stat-card glass-card">
                <BookOpen size={28} className="dashboard-stat-icon" />
                <div>
                  <span className="dashboard-stat-num">70+</span>
                  <span className="dashboard-stat-text">מדריכים וחוברות</span>
                </div>
              </div>
              <div className="dashboard-stat-card glass-card">
                <MessageCircle size={28} className="dashboard-stat-icon" />
                <div>
                  <span className="dashboard-stat-num">3,500+</span>
                  <span className="dashboard-stat-text">פניות שנענו</span>
                </div>
              </div>
              <div className="dashboard-stat-card glass-card">
                <Briefcase size={28} className="dashboard-stat-icon" />
                <div>
                  <span className="dashboard-stat-num">20+</span>
                  <span className="dashboard-stat-text">אנשי מקצוע</span>
                </div>
              </div>
            </div>

                {/* Community marketing info */}
                <div className="dashboard-welcome-info glass-card" style={{ marginTop: '30px' }}>
                  <h3>ברוכים הבאים לקהילת "טיפים לכלכלה נכונה"</h3>
                  <p>
                    הפלטפורמה המקצועית והמובילה במגזר החרדי לחסכון, השקעות והתנהלות פיננסית נבונה. 
                    בחר מדריך מסרגל הניווט הימני או לחץ על לשוניות הניווט למעלה כדי להתחיל לקרוא אותו ישירות בתוך הדפדפן, או השתמש בתיבת החיפוש החכם כדי לאתר מידע ספציפי בתוך תוכן העלונים.
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

      </main>

      {/* 1. Document Viewer Modal (Overlay Preview) */}
      {selectedFile && (
        <div className="modal-overlay animate-fade-in" onClick={handleCloseModal}>
          <div className="modal-container glass-card animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-section">
                <span className="modal-category-badge">{activeCategory?.name || (selectedFile.type === 'video' ? 'סרטונים' : '')}</span>
                <h2 className="modal-title">{selectedFile.name}</h2>
                <div className="modal-meta">
                  {selectedFile.author && selectedFile.author !== 'מערכת כלכלה נכונה' && (
                    <>
                      <span className="modal-author">מאת: {selectedFile.author}</span>
                      <span className="modal-divider">•</span>
                    </>
                  )}
                  <span className="modal-date">{new Date(selectedFile.modifiedTime).toLocaleDateString('he-IL')}</span>
                  {selectedFile.size > 0 && (
                    <>
                      <span className="modal-divider">•</span>
                      <span className="modal-size">{formatBytes(selectedFile.size)}</span>
                    </>
                  )}
                </div>
              </div>
              
              <div className="modal-actions">
                {selectedFile.webContentLink && selectedFile.webContentLink !== '#' ? (
                  <a href={selectedFile.webContentLink} className="btn-primary">
                    <Download size={16} />
                    <span>הורדה</span>
                  </a>
                ) : (
                  selectedFile.type !== 'video' && (
                    <button className="btn-primary" onClick={() => alert('קבצי דמה אינם ניתנים להורדה.')}>
                      <Download size={16} />
                      <span>הורדה</span>
                    </button>
                  )
                )}
                <button className="btn-secondary close-modal-btn" onClick={handleCloseModal}>
                  <span>סגור</span>
                </button>
              </div>
            </div>

            <div className="modal-body-container">
              {selectedFile.type === 'video' ? (
                /* YouTube Player */
                <div className="iframe-scroll-wrapper" style={{ background: '#000', position: 'relative' }}>
                  {isPlayingVideo ? (
                    <iframe 
                      src={`https://www.youtube.com/embed/${selectedFile.id}?autoplay=1&rel=0`} 
                      width="100%" 
                      height="100%" 
                      style={{ border: 'none', display: 'block' }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={selectedFile.name}
                    />
                  ) : (
                    <div className="video-player-preview" onClick={() => setIsPlayingVideo(true)}>
                      <img 
                        src={selectedFile.thumbnailLink} 
                        alt={selectedFile.name} 
                        className="player-preview-thumbnail"
                      />
                      <div className="video-player-preview-overlay">
                        <div className="video-player-play-btn">
                          <Play size={40} fill="currentColor" />
                        </div>
                        <span className="video-player-play-text">לחץ לניגון הסרטון</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : isMockFile ? (
                /* Interactive OCR Mock Reader */
                <div className="mock-reader-layout">
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
                  
                  <div className="reader-content-body">
                    <div className="reader-font-controls">
                      <span className="font-controls-label">גודל גופן:</span>
                      <button className="font-btn" onClick={() => setReaderFontSize(prev => Math.min(26, prev + 2))}>A+</button>
                      <button className="font-btn" onClick={() => setReaderFontSize(prev => Math.max(12, prev - 2))}>A-</button>
                      <button className="font-btn reset-btn" onClick={() => setReaderFontSize(16)}>איפוס</button>
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
        </div>
      )}

      {/* 2. Smart OCR Content Search Modal */}
      {isSmartSearchOpen && (
        <div className="modal-overlay animate-fade-in" onClick={() => setIsSmartSearchOpen(false)}>
          <div className="modal-container search-modal-container glass-card animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-section">
                <h2 className="modal-title">חיפוש חכם בתוך תוכן כל החוברות והמדריכים</h2>
                <p className="modal-subtitle">סריקת טקסט מלאה (OCR) בתוך כל החוברות והמדריכים של הקהילה לאיתור דפים ומידע</p>
              </div>
              <div className="modal-actions">
                <button className="btn-secondary close-modal-btn" onClick={() => setIsSmartSearchOpen(false)}>
                  <span>סגור</span>
                </button>
              </div>
            </div>
            
            <div className="modal-body-container search-modal-body">
              <div className="search-input-wrapper large-search">
                <input 
                  type="text" 
                  className="search-input"
                  placeholder="הקלד ביטוי לחיפוש (לדוגמה: משכנתא, עסק, מחיר, ריבית, נדלן...)"
                  value={contentSearchQuery}
                  onChange={(e) => setContentSearchQuery(e.target.value)}
                  autoFocus
                />
                <Search className="search-icon" size={22} />
              </div>

              {contentSearchQuery.trim() !== '' && (
                <div className="fulltext-results-area animate-fade-in" style={{ marginTop: '20px' }}>
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
                                // Set active tab and category
                                const cat = categories.find(c => c.name === result.categoryName);
                                if (cat) {
                                  setActiveCategory(cat);
                                  setActiveTab(cat.name);
                                }
                                setIsSmartSearchOpen(false); // Close search modal
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
          </div>
        </div>
      )}

      {/* 3. Community Chat updates Side Drawer */}
      {isChatDrawerOpen && (
        <div className="drawer-overlay animate-fade-in" onClick={() => setIsChatDrawerOpen(false)}>
          <div className="drawer-container glass-card" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <div className="drawer-title-section">
                <h3 className="drawer-title">עדכוני הקהילה בצ'אט</h3>
                <span className="drawer-subtitle">הודעות ועדכונים שוטפים מקבוצת מסודרים</span>
              </div>
              <button className="btn-secondary close-drawer-btn" onClick={() => setIsChatDrawerOpen(false)}>
                <span>סגור</span>
              </button>
            </div>
            
            <div className="drawer-body">
              <iframe 
                src="https://mesudarim.chatfree.app/" 
                title="ערוץ העדכונים של הקהילה"
                className="drawer-iframe"
                style={{ width: '100%', height: '100%', border: 'none', borderRadius: '12px' }}
              />
              <div className="drawer-fallback-footer">
                <p>עקב הגדרות סינון אינטרנט (נטפרי/אתרוג וכד'), ייתכן והצ'אט ייחסם להצגה בתוך האתר.</p>
                <a href="https://mesudarim.chatfree.app/" target="_blank" rel="noopener noreferrer" className="btn-accent" style={{ display: 'inline-flex', marginTop: '10px' }}>
                  <span>פתיחת ערוץ הצ'אט בחלון חדש</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

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
