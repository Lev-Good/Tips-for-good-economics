const fs = require('fs');
const path = require('path');
const https = require('https');
const pdfParse = require('pdf-parse');

// Ensure that TLS reject unauthorized is set to 0 just in case
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx32lPR8_bJXcAKSe6cJv1bvkNA_dqXlszygzZbL1f8Bslh93wGSgOYEvUQnY9YHq8U/exec';
const documentsDir = path.join(__dirname, '..', 'public', 'documents');
const indexFilePath = path.join(__dirname, '..', 'public', 'search-index.json');
const driveDataFilePath = path.join(__dirname, '..', 'public', 'drive-data.json');

// Ensure directories exist
if (!fs.existsSync(documentsDir)) {
  fs.mkdirSync(documentsDir, { recursive: true });
}

// Helper to make HTTPS GET requests
function httpGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      // Handle redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return httpGet(res.headers.location).then(resolve).catch(reject);
      }
      
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to get URL. Status code: ${res.statusCode}`));
      }

      let data = [];
      res.on('data', (chunk) => { data.push(chunk); });
      res.on('end', () => { resolve(Buffer.concat(data)); });
    }).on('error', (e) => reject(e));
  });
}

// Download a PDF file
async function downloadFile(fileId, downloadUrl, fileName) {
  const filePath = path.join(documentsDir, `${fileId}.pdf`);
  if (fs.existsSync(filePath)) {
    console.log(`  File ${fileName} (${fileId}.pdf) already exists. Skipping download.`);
    return true;
  }

  console.log(`  Downloading ${fileName}...`);
  try {
    const fileBuffer = await httpGet(downloadUrl);
    fs.writeFileSync(filePath, fileBuffer);
    console.log(`  ✅ Downloaded successfully to ${fileId}.pdf`);
    return true;
  } catch (err) {
    console.error(`  ❌ Failed to download ${fileName}:`, err.message);
    return false;
  }
}

// Extract text from a local PDF file
async function extractTextFromPdf(fileId) {
  const filePath = path.join(documentsDir, `${fileId}.pdf`);
  if (!fs.existsSync(filePath)) {
    return '';
  }

  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    // Remove duplicate whitespaces and clean up text
    return data.text.replace(/\s+/g, ' ').trim();
  } catch (err) {
    console.error(`  ⚠️ Failed to extract text from ${fileId}.pdf:`, err.message);
    return '';
  }
}

async function main() {
  console.log('Starting Google Drive sync and index build...');
  
  let categories = [];
  try {
    console.log('Fetching file list from Google Apps Script...');
    const rawJson = await httpGet(APPS_SCRIPT_URL);
    categories = JSON.parse(rawJson.toString());
    console.log(`Loaded ${categories.length} categories.`);
  } catch (err) {
    console.error('❌ Failed to fetch file list from Apps Script:', err.message);
    process.exit(1);
  }

  const searchIndex = [];
  const updatedCategories = [];

  for (const cat of categories) {
    console.log(`\nCategory: ${cat.name} (${cat.files.length} files)`);
    const updatedFiles = [];
    
    for (const file of cat.files) {
      console.log(`File: ${file.name}`);
      
      // Skip folders or weird mimeTypes
      if (file.mimeType && file.mimeType !== 'application/pdf') {
        console.log(`  Skipping non-pdf file type: ${file.mimeType}`);
        continue;
      }

      // Download file to local repo
      // Google drive direct download URL:
      const downloadUrl = `https://drive.google.com/uc?export=download&id=${file.id}`;
      const downloadSuccess = await downloadFile(file.id, downloadUrl, file.name);

      if (downloadSuccess) {
        // Extract text for search indexing
        console.log('  Extracting text...');
        const text = await extractTextFromPdf(file.id);
        
        searchIndex.push({
          id: file.id,
          name: file.name,
          categoryName: cat.name,
          author: file.author,
          description: file.description,
          text: text
        });

        // Add to updated category JSON with local link for instant deployment!
        updatedFiles.push({
          ...file,
          // Point to local document instead of Drive!
          localUrl: `documents/${file.id}.pdf`
        });
      } else {
        // Keep original links if download failed
        updatedFiles.push(file);
      }
    }

    updatedCategories.push({
      ...cat,
      files: updatedFiles
    });
  }

  // Save the updated categories list as static JSON in public folder
  console.log(`\nSaving updated Drive data to ${driveDataFilePath}...`);
  fs.writeFileSync(driveDataFilePath, JSON.stringify(updatedCategories, null, 2), 'utf8');

  // Save the search index
  console.log(`Saving search index (${searchIndex.length} items) to ${indexFilePath}...`);
  fs.writeFileSync(indexFilePath, JSON.stringify(searchIndex), 'utf8');

  console.log('\n🎉 Sync and Index Build Completed Successfully!');
}

main().catch(err => {
  console.error('Fatal error in sync process:', err);
  process.exit(1);
});
