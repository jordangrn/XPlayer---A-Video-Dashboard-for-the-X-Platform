require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const NodeCache = require('node-cache');

const app = express();
const PORT = process.env.PORT || 5001;

// Cache for 24 hours to avoid hitting rate limits
const cache = new NodeCache({ stdTTL: 86400 });

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));
app.use(express.json());

// X API Configuration
const TWITTER_API_BASE = 'https://api.twitter.com/2';
const BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;

// Helper function to make X API requests
async function fetchFromTwitterAPI(endpoint, params = {}) {
  try {
    const response = await axios.get(`${TWITTER_API_BASE}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${BEARER_TOKEN}`,
      },
      params,
    });
    return response.data;
  } catch (error) {
    console.error('Twitter API Error:', error.response?.data || error.message);
    throw error;
  }
}

// Curated fallback data for when API limits are reached or for demo purposes
const curatedVideos = {
  normalVideos: [
    {
      id: 'demo_1',
      title: 'Joe Rogan Experience #2087 - Elon Musk',
      channel: 'PowerfulJRE',
      duration: '2:45:30',
      thumbnailUrl: 'https://via.placeholder.com/640x360/1a1a1a/ffffff?text=Joe+Rogan+Experience',
      avatarUrl: 'https://via.placeholder.com/150/ff0000/ffffff?text=JRE',
      views: 3200000,
      likes: 125000,
      isCurated: true
    },
    {
      id: 'demo_2',
      title: 'GTA 6 - Official Trailer Breakdown & Analysis',
      channel: 'IGN',
      duration: '12:45',
      thumbnailUrl: 'https://via.placeholder.com/640x360/8B0000/ffffff?text=GTA+6+Trailer',
      avatarUrl: 'https://via.placeholder.com/150/FF4500/ffffff?text=IGN',
      views: 1890000,
      likes: 78000,
      isCurated: true
    },
    {
      id: 'demo_3',
      title: 'MICHAEL - Official Trailer (2025) Michael Jackson Biopic',
      channel: 'Lionsgate Movies',
      duration: '2:34',
      thumbnailUrl: 'https://via.placeholder.com/640x360/FFD700/000000?text=MICHAEL+Trailer',
      avatarUrl: 'https://via.placeholder.com/150/4169E1/ffffff?text=LG',
      views: 5670000,
      likes: 234000,
      isCurated: true
    },
    {
      id: 'demo_4',
      title: 'NFL Week 10 Highlights: Chiefs vs Bills | 2024 Season',
      channel: 'NFL',
      duration: '15:22',
      thumbnailUrl: 'https://via.placeholder.com/640x360/013369/ffffff?text=NFL+Highlights',
      avatarUrl: 'https://via.placeholder.com/150/D50A0A/ffffff?text=NFL',
      views: 2450000,
      likes: 95000,
      isCurated: true
    },
    {
      id: 'demo_5',
      title: 'This 24 Year Old is $85,000 in Debt | Financial Audit',
      channel: 'Caleb Hammer',
      duration: '1:24:15',
      thumbnailUrl: 'https://via.placeholder.com/640x360/2F4F4F/ffffff?text=Financial+Audit',
      avatarUrl: 'https://via.placeholder.com/150/20B2AA/ffffff?text=CH',
      views: 892000,
      likes: 34000,
      isCurated: true
    },
    {
      id: 'demo_6',
      title: 'Build a Modern Portfolio Website with React & Tailwind CSS',
      channel: 'Web Dev Simplified',
      duration: '45:18',
      thumbnailUrl: 'https://via.placeholder.com/640x360/38BDF8/000000?text=Web+Dev+Tutorial',
      avatarUrl: 'https://via.placeholder.com/150/06B6D4/ffffff?text=WDS',
      views: 456000,
      likes: 28000,
      isCurated: true
    },
  ],
  micros: [
    {
      id: 'micro_1',
      title: 'Quick Tech Tip',
      channel: 'TechShorts',
      duration: '0:45',
      thumbnailUrl: 'https://via.placeholder.com/360x640/4A5568/ffffff?text=Tech+Tip',
      avatarUrl: 'https://via.placeholder.com/150/10B981/ffffff?text=TS',
      views: 45000,
      likes: 1200,
      isCurated: true
    },
    {
      id: 'micro_2',
      title: 'Funny Gaming Moment',
      channel: 'GameClips',
      duration: '0:30',
      thumbnailUrl: 'https://via.placeholder.com/360x640/7C3AED/ffffff?text=Gaming',
      avatarUrl: 'https://via.placeholder.com/150/A855F7/ffffff?text=GC',
      views: 78000,
      likes: 3400,
      isCurated: true
    },
    {
      id: 'micro_3',
      title: 'Life Hack',
      channel: 'DailyHacks',
      duration: '0:55',
      thumbnailUrl: 'https://via.placeholder.com/360x640/F59E0B/000000?text=Life+Hack',
      avatarUrl: 'https://via.placeholder.com/150/FBBF24/000000?text=DH',
      views: 92000,
      likes: 4100,
      isCurated: true
    },
    {
      id: 'micro_4',
      title: 'Pet Trick',
      channel: 'PetVids',
      duration: '0:38',
      thumbnailUrl: 'https://via.placeholder.com/360x640/EC4899/ffffff?text=Pet+Trick',
      avatarUrl: 'https://via.placeholder.com/150/F472B6/ffffff?text=PV',
      views: 156000,
      likes: 7800,
      isCurated: true
    },
    {
      id: 'micro_5',
      title: 'Cooking Tip',
      channel: 'QuickChef',
      duration: '0:42',
      thumbnailUrl: 'https://via.placeholder.com/360x640/EF4444/ffffff?text=Cooking',
      avatarUrl: 'https://via.placeholder.com/150/F87171/ffffff?text=QC',
      views: 34000,
      likes: 1500,
      isCurated: true
    },
  ]
};

// API Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'XPlayer API Server is running',
    timestamp: new Date().toISOString()
  });
});

// Clear cache and force refresh (manual refresh only)
app.post('/api/refresh', (req, res) => {
  cache.flushAll();
  console.log('Cache cleared - next request will fetch fresh data');
  res.json({ 
    message: 'Cache cleared successfully. Refresh the page to load new videos.',
    timestamp: new Date().toISOString()
  });
});

// Popular X accounts known for video content
const POPULAR_VIDEO_ACCOUNTS = [
  'IGN',             // Gaming
  'joerogan',        // Joe Rogan
  'NFL',             // NFL
  'CalebHammer',     // Caleb Hammer
  'MrBeast'          // MrBeast
];

// Helper function to filter videos by duration
function filterVideosByDuration(tweets, minDuration = null, maxDuration = null) {
  if (!tweets || !tweets.data) return [];
  
  const filtered = [];
  
  for (const tweet of tweets.data) {
    if (!tweet.attachments?.media_keys) continue;
    
    // Find media with duration
    const media = tweets.includes?.media?.find(m => 
      tweet.attachments.media_keys.includes(m.media_key) && m.duration_ms
    );
    
    if (!media || !media.duration_ms) continue;
    
    const durationSeconds = media.duration_ms / 1000;
    
    // Check duration constraints
    if (minDuration && durationSeconds < minDuration) continue;
    if (maxDuration && durationSeconds > maxDuration) continue;
    
    // Find author info
    const author = tweets.includes?.users?.find(u => u.id === tweet.author_id);
    
    filtered.push({
      id: tweet.id,
      title: tweet.text.substring(0, 100), // First 100 chars as title
      channel: author?.name || author?.username || 'Unknown',
      username: author?.username || '',
      avatarUrl: author?.profile_image_url || 'https://via.placeholder.com/48x48',
      duration: formatDuration(durationSeconds),
      durationSeconds: durationSeconds,
      thumbnailUrl: media.preview_image_url || 'https://via.placeholder.com/720x404',
      videoUrl: media.url,
      views: tweet.public_metrics?.impression_count || 0,
      likes: tweet.public_metrics?.like_count || 0,
      retweets: tweet.public_metrics?.retweet_count || 0,
      createdAt: tweet.created_at,
      isLive: false
    });
  }
  
  return filtered;
}

// Helper to format duration in MM:SS
function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Get videos (normal + micros)
app.get('/api/videos', async (req, res) => {
  try {
    const cacheKey = 'videos_all';
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) {
      console.log('Returning cached video data');
      return res.json(cachedData);
    }

    console.log('Fetching fresh video data from X API...');
    
    // Fetch tweets with videos from popular accounts
    const accountQuery = POPULAR_VIDEO_ACCOUNTS.map(acc => `from:${acc}`).join(' OR ');
    const query = `(${accountQuery}) has:videos -is:retweet`;
    
    const tweetsData = await fetchFromTwitterAPI('/tweets/search/recent', {
      query: query,
      max_results: 50, // Fetch 50 to filter down to ~20
      'tweet.fields': 'public_metrics,created_at,author_id,attachments',
      'media.fields': 'duration_ms,preview_image_url,url,variants,type',
      'expansions': 'attachments.media_keys,author_id',
      'user.fields': 'name,username,profile_image_url,verified'
    });

    // Filter videos by duration
    const allVideos = filterVideosByDuration(tweetsData);
    
    // Separate into normal videos (5+ min) and micros (<1 min)
    const normalVideos = allVideos
      .filter(v => v.durationSeconds >= 300) // 5 minutes or more
      .slice(0, 18); // Limit to 18 normal videos (3 rows of 6)
    
    const micros = allVideos
      .filter(v => v.durationSeconds <= 60) // 1 minute or less
      .slice(0, 10); // Limit to 10 micros

    // If we don't have enough videos, supplement with curated data
    const videoData = {
      normalVideos: normalVideos.length > 0 ? normalVideos : curatedVideos.normalVideos,
      micros: micros.length > 0 ? micros : curatedVideos.micros,
      source: normalVideos.length > 0 || micros.length > 0 ? 'live' : 'curated',
      timestamp: new Date().toISOString(),
      stats: {
        totalFetched: allVideos.length,
        normalCount: normalVideos.length,
        microsCount: micros.length
      }
    };

    console.log(`Fetched ${allVideos.length} videos: ${normalVideos.length} normal, ${micros.length} micros`);

    cache.set(cacheKey, videoData);
    res.json(videoData);

  } catch (error) {
    const errorData = error.response?.data || {};
    const statusCode = error.response?.status;
    
    console.error('Error fetching videos from X API:', errorData);
    
    // If rate limited, cache the fallback for 15 minutes to avoid repeated attempts
    if (statusCode === 429) {
      console.log('⚠️  Rate limit hit. Using curated data. Try again in 15 minutes.');
      const fallbackData = {
        normalVideos: curatedVideos.normalVideos,
        micros: curatedVideos.micros,
        source: 'curated_fallback',
        timestamp: new Date().toISOString(),
        error: 'Rate limit reached. Using curated data. API will retry automatically later.',
        rateLimited: true
      };
      
      // Cache fallback for 15 minutes when rate limited
      cache.set('videos_all', fallbackData, 900);
      return res.json(fallbackData);
    }
    
    // For other errors, use curated data without caching
    const fallbackData = {
      normalVideos: curatedVideos.normalVideos,
      micros: curatedVideos.micros,
      source: 'curated_fallback',
      timestamp: new Date().toISOString(),
      error: 'Failed to fetch from X API, using curated data'
    };
    
    res.json(fallbackData);
  }
});

// Search for tweets with videos (for future implementation)
app.get('/api/search/videos', async (req, res) => {
  try {
    const { query, maxResults = 10 } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    const cacheKey = `search_${query}_${maxResults}`;
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) {
      return res.json(cachedData);
    }

    // X API v2 Tweet Search with media fields
    const data = await fetchFromTwitterAPI('/tweets/search/recent', {
      query: `${query} has:videos -is:retweet`,
      max_results: maxResults,
      'tweet.fields': 'public_metrics,created_at,author_id',
      'media.fields': 'duration_ms,preview_image_url,url,variants',
      'expansions': 'attachments.media_keys,author_id',
      'user.fields': 'name,username,profile_image_url'
    });

    cache.set(cacheKey, data);
    res.json(data);

  } catch (error) {
    console.error('Error searching videos:', error);
    res.status(500).json({ 
      error: 'Failed to search videos',
      message: error.message 
    });
  }
});

// Get tweet by ID (for fetching specific video tweets)
app.get('/api/tweet/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const cacheKey = `tweet_${id}`;
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) {
      return res.json(cachedData);
    }

    const data = await fetchFromTwitterAPI(`/tweets/${id}`, {
      'tweet.fields': 'public_metrics,created_at,author_id',
      'media.fields': 'duration_ms,preview_image_url,url,variants',
      'expansions': 'attachments.media_keys,author_id',
      'user.fields': 'name,username,profile_image_url'
    });

    cache.set(cacheKey, data);
    res.json(data);

  } catch (error) {
    console.error('Error fetching tweet:', error);
    res.status(500).json({ 
      error: 'Failed to fetch tweet',
      message: error.message 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 XPlayer API Server running on http://localhost:${PORT}`);
  console.log(`📺 Video endpoint: http://localhost:${PORT}/api/videos`);
  console.log(`🔍 Search endpoint: http://localhost:${PORT}/api/search/videos?query=tech`);
  
  if (!BEARER_TOKEN) {
    console.warn('⚠️  WARNING: TWITTER_BEARER_TOKEN not found in .env file');
    console.warn('   The server will run with curated demo data only.');
    console.warn('   Add your Bearer Token to server/.env to enable live X API integration.');
  } else {
    console.log('✅ Twitter API credentials loaded');
  }
});
