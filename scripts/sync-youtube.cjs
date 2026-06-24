const fs = require('fs');
const path = require('path');
const https = require('https');

// Bypassing self-signed certificates locally if NetFree intercepts, but normal in actions
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const CHANNEL_URL = 'https://www.youtube.com/@%D7%9E%D7%A1%D7%95%D7%93%D7%A8%D7%99%D7%9D';
const VIDEOS_JSON_PATH = path.join(__dirname, '../public/videos.json');

// Helper to perform HTTPS GET
function httpGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept-Language': 'he-IL,he;q=0.9,en-US;q=0.8,en;q=0.7'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function main() {
  try {
    const channelId = 'UCJtZRmaAfaCn759sYxLq4Yw';
    console.log(`Using Channel ID: ${channelId}`);
    
    console.log('Fetching channel RSS feed...');
    const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
    const xml = await httpGet(feedUrl);
    
    // Parse XML using regex to avoid external XML parser dependencies in the simple script
    const videoMatches = xml.matchAll(/<entry>[\s\S]*?<yt:videoId>([^<]+)<\/yt:videoId>[\s\S]*?<title>([^<]+)<\/title>[\s\S]*?<published>([^<]+)<\/published>[\s\S]*?<\/entry>/g);
    
    const fetchedVideos = [];
    for (const match of videoMatches) {
      const id = match[1];
      const title = match[2];
      const published = match[3];
      fetchedVideos.push({
        id,
        title: decodeHtmlEntities(title),
        published,
        thumbnail: `https://img.youtube.com/vi/${id}/maxresdefault.jpg`
      });
    }
    
    console.log(`Fetched ${fetchedVideos.length} videos from RSS feed.`);
    
    if (fetchedVideos.length === 0) {
      console.log('No videos found in RSS feed. XML snippet:');
      console.log(xml.slice(0, 1000));
      return;
    }
    
    // Load existing videos
    let existingVideos = [];
    if (fs.existsSync(VIDEOS_JSON_PATH)) {
      try {
        existingVideos = JSON.parse(fs.readFileSync(VIDEOS_JSON_PATH, 'utf8'));
      } catch (e) {
        console.error('Error parsing existing videos.json, starting fresh:', e.message);
      }
    }
    
    // Merge list, keeping unique IDs and sorting by published date descending
    const videoMap = new Map();
    // Add existing videos first
    existingVideos.forEach(v => videoMap.set(v.id, v));
    // Add new/fetched videos (will overwrite existing with updated title/metadata if changed)
    fetchedVideos.forEach(v => videoMap.set(v.id, v));
    
    // Convert back to array and sort by published date descending
    const mergedVideos = Array.from(videoMap.values())
      .sort((a, b) => new Date(b.published) - new Date(a.published));
      
    // Ensure the folder exists
    const dir = path.dirname(VIDEOS_JSON_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(VIDEOS_JSON_PATH, JSON.stringify(mergedVideos, null, 2), 'utf8');
    console.log(`Saved ${mergedVideos.length} total videos to ${VIDEOS_JSON_PATH}`);
    
  } catch (err) {
    console.error('Execution failed:', err.message);
    process.exit(1);
  }
}

// Simple helper to decode common HTML entities in XML titles
function decodeHtmlEntities(str) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
}

main();
