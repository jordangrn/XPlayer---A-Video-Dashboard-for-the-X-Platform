# XPlay 🎬

A modern video player platform for X/Twitter content, featuring a YouTube-like interface with support for both standard videos (16:9) and short-form "Micros" (9:16).

![XPlay Preview](https://via.placeholder.com/1200x600?text=XPlay+Preview)

## Features ✨

- **16:9 Gallery Videos**: Browse popular X videos 5+ minutes in length
- **9:16 Micros**: Discover short-form content under 1 minute
- **Infinite Scroll**: Seamless browsing experience with 3 rows of videos followed by Micros
- **Live X API Integration**: Real-time video data from X/Twitter
- **Modern UI**: Clean, responsive interface inspired by YouTube and X
- **Secure Backend**: API keys never exposed to the frontend

## Tech Stack 🛠️

### Frontend
- React.js with TypeScript
- Custom CSS styling
- Feather Icons
- Responsive design

### Backend
- Node.js + Express
- X/Twitter API v2
- In-memory caching (node-cache)
- CORS enabled

## Project Structure 📁

```
XPlay/
├── react-xplay/          # React frontend application
│   ├── src/
│   │   ├── App.tsx       # Main application component
│   │   ├── index.css     # Global styles
│   │   └── services/
│   │       └── api.js    # Backend API service
│   └── public/
├── server/               # Express backend server
│   ├── index.js          # Server entry point
│   ├── .env              # Environment variables (NOT in git)
│   └── .env.example      # Template for environment variables
├── Icons/                # Feather icon assets
└── README.md
```

## Getting Started 🚀

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- X/Twitter Developer Account with API credentials

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/xplay.git
cd xplay
```

### 2. Set Up Backend

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:

```bash
cp .env.example .env
```

Edit `.env` and add your X/Twitter API credentials:

```env
TWITTER_BEARER_TOKEN=your_bearer_token_here
PORT=5000
NODE_ENV=development
```

**How to get X API credentials:**
1. Go to [X Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Create a project and app
3. Generate a Bearer Token
4. Copy the token to your `.env` file

### 3. Set Up Frontend

```bash
cd ../react-xplay
npm install
```

### 4. Run the Application

**Terminal 1 - Start Backend:**
```bash
cd server
npm start
```

Backend will run on `http://localhost:5000`

**Terminal 2 - Start Frontend:**
```bash
cd react-xplay
npm start
```

Frontend will run on `http://localhost:3000`

### 5. Open in Browser

Navigate to `http://localhost:3000` to see XPlay in action!

## API Endpoints 🔌

### Backend API

- `GET /api/health` - Health check
- `GET /api/videos` - Fetch all videos (normal + micros)
- `GET /api/search/videos?query=tech&maxResults=10` - Search for videos
- `GET /api/tweet/:id` - Get specific tweet by ID

## Configuration ⚙️

### Environment Variables

**Backend (`server/.env`):**
```env
TWITTER_BEARER_TOKEN=your_token_here
TWITTER_API_KEY=your_api_key_here (optional)
TWITTER_API_SECRET=your_api_secret_here (optional)
TWITTER_ACCESS_TOKEN=your_access_token_here (optional)
TWITTER_ACCESS_TOKEN_SECRET=your_access_token_secret_here (optional)
PORT=5000
NODE_ENV=development
```

**Frontend (optional - `react-xplay/.env`):**
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Development 💻

### Running in Development Mode

The project uses hot-reloading for both frontend and backend:

```bash
# Backend with nodemon (auto-restart on changes)
cd server
npm run dev

# Frontend with React hot-reload
cd react-xplay
npm start
```

### Code Structure

- **Frontend**: React components in `react-xplay/src/`
- **Backend**: Express routes in `server/index.js`
- **API Service**: Frontend API calls in `react-xplay/src/services/api.js`

## Deployment 🌐

### Frontend Deployment (Netlify/Vercel/Amplify)

1. Build the React app:
```bash
cd react-xplay
npm run build
```

2. Deploy the `build` folder to your hosting platform
3. Set environment variable: `REACT_APP_API_URL=https://your-backend-url.com/api`

### Backend Deployment (Render/Railway/Fly.io)

1. Push code to GitHub
2. Connect your repository to hosting platform
3. Set environment variables in platform dashboard
4. Deploy!

## Security 🔒

- ✅ API keys stored in `.env` (gitignored)
- ✅ Backend proxy prevents credential exposure
- ✅ CORS configured for frontend access
- ✅ `.env.example` provided for setup guidance

**NEVER commit your `.env` file to GitHub!**

## Contributing 🤝

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License 📄

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments 🙏

- [X/Twitter API](https://developer.twitter.com/) for video data
- [Feather Icons](https://feathericons.com/) for UI icons
- [React](https://reactjs.org/) for the frontend framework
- [Express](https://expressjs.com/) for the backend server

## Roadmap 🗺️

- [ ] User authentication with X OAuth
- [ ] Video playback with X embedded player
- [ ] Advanced filtering (duration, popularity, date)
- [ ] Playlist creation and management
- [ ] Download functionality
- [ ] Dark/Light theme toggle
- [ ] Mobile app (React Native)

## Support 💬

If you have any questions or run into issues, please open an issue on GitHub.

---

**Made with ❤️ for the X community**
