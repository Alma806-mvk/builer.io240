// Deep Search Backend API (TypeScript)
// ------------------------------------
// 1. Place this file in your backend project root.
// 2. Install dependencies: npm install express axios dotenv cors
// 3. Create a .env file with:
//    GOOGLE_API_KEY=your_google_api_key
//    GOOGLE_CSE_ID=your_custom_search_engine_id
// 4. Run: npx ts-node deep-search-backend.ts
// 5. Deploy to Vercel/Heroku/Render as needed.

const express = require('express');
const cors = require('cors');
import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());

// Types
interface SearchResult {
  title: string;
  url: string;
  filetype: string;
  size?: number;
  contentType?: string;
  snippet?: string;
}

// Helper: determine if extension is an image type
const IMAGE_EXTENSIONS = [
  'png', 'jpg', 'jpeg', 'svg', 'gif', 'bmp', 'webp'
];

// Helper: clean extension (remove leading dot)
function cleanExt(ext: string) {
  return ext.replace(/^\./, '').toLowerCase();
}

// Helper: Validate a direct download link
async function validateDirectDownload(url: string, ext: string): Promise<{ valid: boolean; size?: number; contentType?: string }> {
  try {
    const resp = await axios.head(url, { timeout: 8000, maxRedirects: 3 });
    const contentType = resp.headers['content-type'] || '';
    const contentLength = parseInt(resp.headers['content-length'] || '0', 10);
    // Check file extension, content-type, and reasonable size
    if (
      url.toLowerCase().endsWith(ext.toLowerCase()) &&
      contentLength > 10 * 1024 && // >10KB
      (!contentType || contentType.includes(ext.replace('.', '')) || contentType.startsWith('application/') || contentType.startsWith('video/') || contentType.startsWith('audio/'))
    ) {
      return { valid: true, size: contentLength, contentType };
    }
    return { valid: false };
  } catch {
    return { valid: false };
  }
}

// Enhanced Google file search
async function googleFileSearch(query: string, ext: string) {
  const cleanedExt = cleanExt(ext);
  const isImage = IMAGE_EXTENSIONS.includes(cleanedExt);
  const params: any = {
    key: process.env.GOOGLE_API_KEY,
    cx: process.env.GOOGLE_CSE_ID,
    q: query,
    num: 10,
  };
  if (isImage) {
    params.searchType = 'image';
  } else if (cleanedExt) {
    params.q += ` filetype:${cleanedExt}`;
  }
  const url = 'https://www.googleapis.com/customsearch/v1';
  const { data } = await axios.get(url, { params });
  if (!data.items) return [];
  // Filter results to match extension
  return data.items.filter((item: any) => {
    if (isImage) {
      // For images, check file format or link extension
      const link = item.link || '';
      const format = (item.fileFormat || '').toLowerCase();
      return (
        link.toLowerCase().endsWith('.' + cleanedExt) ||
        format.includes(cleanedExt)
      );
    } else if (cleanedExt) {
      // For other types, check link extension
      return (item.link || '').toLowerCase().endsWith('.' + cleanedExt);
    }
    return true;
  }).map((item: any) => ({
    title: item.title,
    url: item.link,
    filetype: cleanedExt,
    snippet: item.snippet,
    contentType: item.mime || item.fileFormat || '',
    size: undefined, // Optionally, fetch HEAD for size
  }));
}

// Main endpoint
app.get('/api/deep-search', async (req: any, res: any) => {
  const query = (req.query.query as string) || '';
  const ext = (req.query.ext as string) || '';
  if (!query || !ext) return res.status(400).json({ error: 'Missing query or ext' });
  try {
    const googleResults = await googleFileSearch(query, ext);
    console.log('Google returned:', googleResults.length, 'results');
    console.log(googleResults);
    const validated: SearchResult[] = [];
    for (const result of googleResults) {
      const check = await validateDirectDownload(result.url, ext);
      if (check.valid) {
        validated.push({ ...result, size: check.size, contentType: check.contentType });
      }
    }
    console.log('Validated results:', validated.length);
    res.json({ results: validated });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Search failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Deep Search API running on port ${PORT}`);
}); 