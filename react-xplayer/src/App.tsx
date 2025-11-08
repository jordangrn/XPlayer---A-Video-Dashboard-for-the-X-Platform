import React, { useState, useEffect } from 'react';
import './index.css';
import { fetchVideos } from './services/api';

function App() {
  const [activeTab, setActiveTab] = useState('Home');
  const [activeCategory, setActiveCategory] = useState('All');
  const [followedListOpen, setFollowedListOpen] = useState(true);
  const [videos, setVideos] = useState<any[]>([]);
  const [micros, setMicros] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tabs = [
    'Home', 'Micros', 'Live', 'Followed', 'History', 'Playlists', 
    'Your Videos', 'Your Movies & TV', 'Watch Later', 'Liked Videos', 'Downloads', 'Premium'
  ];

  const categories = [
    'All', 'Gaming', 'Music', 'Tech', 'Cooking', 'Travel', 'Fitness', 'Movies', 'News', 'Education', 'Comedy'
  ];

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
  };

  // Fetch videos from backend on component mount
  useEffect(() => {
    async function loadVideos() {
      try {
        setLoading(true);
        const data = await fetchVideos();
        setVideos(data.normalVideos || []);
        setMicros(data.micros || []);
        setError(null);
      } catch (err) {
        console.error('Failed to load videos:', err);
        // Use mock data for UI development - 6 videos (2 rows of 3), 5 micros (1 row)
        setVideos(generateMockVideos(6));
        setMicros(generateMockMicros(5));
        setError(null); // Clear error to show UI
      } finally {
        setLoading(false);
      }
    }
    loadVideos();
  }, []);

  // Mock data generators for UI development
  const generateMockVideos = (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
      id: `video-${i}`,
      title: `Sample Video Title ${i + 1} - This is a longer title to show how it wraps`,
      channel: `Creator ${(i % 10) + 1}`,
      duration: `${Math.floor(Math.random() * 20) + 5}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      thumbnailUrl: `https://picsum.photos/seed/${i}/640/360`,
      avatarUrl: `https://i.pravatar.cc/150?img=${(i % 70) + 1}`
    }));
  };

  const generateMockMicros = (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
      id: `micro-${i}`,
      title: `Micro ${i + 1}`,
      channel: `Creator ${(i % 10) + 1}`,
      duration: `0:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      thumbnailUrl: `https://picsum.photos/seed/micro${i}/360/640`,
      avatarUrl: `https://i.pravatar.cc/150?img=${(i % 70) + 1}`
    }));
  };

  // Videos and micros are now loaded from backend via useEffect

  // Function to render video gallery: 2 rows of 3 videos (16:9), then 1 row of 5 micros (9:16)
  const renderVideoGallery = () => {
    const rows = [];
    
    // Render 2 rows of 3 videos each
    for (let i = 0; i < videos.length; i += 3) {
      const videoRow = videos.slice(i, i + 3).map(video => (
        <div key={video.id} className="xplay-video-card">
          <div className="xplay-video-thumbnail" style={{ 
            backgroundImage: `url(${video.thumbnailUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}>
            <div className="xplay-video-duration">{video.duration}</div>
          </div>
          <div className="xplay-video-info">
            <div className="xplay-video-title">{video.title}</div>
            <div className="xplay-video-channel" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {video.avatarUrl && (
                <img 
                  src={video.avatarUrl} 
                  alt={video.channel}
                  style={{ width: '24px', height: '24px', borderRadius: '50%' }}
                />
              )}
              {video.channel}
            </div>
          </div>
        </div>
      ));
      rows.push(
        <div key={`video-row-${i}`} style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: '20px', 
          marginBottom: '20px' 
        }}>
          {videoRow}
        </div>
      );
    }
    
    // Add 1 row of 5 micros after the videos
    if (micros.length > 0) {
      const microsRow = micros.map(micro => (
        <div key={micro.id} className="xplay-micros-card">
          <div className="xplay-micros-thumbnail" style={{ 
            backgroundImage: `url(${micro.thumbnailUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}>
            <div className="xplay-micros-duration">{micro.duration}</div>
          </div>
          <div className="xplay-micros-info">
            <div className="xplay-micros-title">{micro.title}</div>
            <div className="xplay-micros-channel" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {micro.avatarUrl && (
                <img 
                  src={micro.avatarUrl} 
                  alt={micro.channel}
                  style={{ width: '20px', height: '20px', borderRadius: '50%' }}
                />
              )}
              {micro.channel}
            </div>
          </div>
        </div>
      ));
      rows.push(
        <div key="micros-section" style={{ marginTop: '30px' }}>
          <div className="xplay-section-title">Micros</div>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(5, 1fr)', 
            gap: '15px', 
            marginTop: '15px' 
          }}>
            {microsRow}
          </div>
        </div>
      );
    }
    
    return rows;
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <div style={{ padding: '12px 0 12px 0', marginBottom: '20px', display: 'flex', justifyContent: 'center', width: '100%' }}>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '20px', fontWeight: '700', margin: 0 }}>
            <svg width="24" height="24" viewBox="0 0 1200 1227" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z" fill="white"/>
            </svg>
            Player
          </h1>
        </div>
        <nav className="sidebar-nav">
          <a href="#" className={`sidebar-nav-link ${activeTab === 'Home' ? 'active' : ''}`} onClick={() => handleTabClick('Home')}>
            <span className="sidebar-nav-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </span>
            Home
          </a>
          <a href="#" className={`sidebar-nav-link ${activeTab === 'Micros' ? 'active' : ''}`} onClick={() => handleTabClick('Micros')}>
            <span className="sidebar-nav-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
            </span>
            Micros
          </a>
          <a href="#" className={`sidebar-nav-link ${activeTab === 'Live' ? 'active' : ''}`} onClick={() => handleTabClick('Live')}>
            <span className="sidebar-nav-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="2"></circle><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"></path></svg>
            </span>
            Live
          </a>
          <a href="#" className={`sidebar-nav-link ${activeTab === 'Followed' ? 'active' : ''}`} onClick={() => handleTabClick('Followed')}>
            <span className="sidebar-nav-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></svg>
            </span>
            Followed
          </a>
          <a href="#" className={`sidebar-nav-link ${activeTab === 'History' ? 'active' : ''}`} onClick={() => handleTabClick('History')}>
            <span className="sidebar-nav-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            </span>
            History
          </a>
          <a href="#" className={`sidebar-nav-link ${activeTab === 'Playlists' ? 'active' : ''}`} onClick={() => handleTabClick('Playlists')}>
            <span className="sidebar-nav-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
            </span>
            Playlists
          </a>
          <a href="#" className={`sidebar-nav-link ${activeTab === 'Watch Later' ? 'active' : ''}`} onClick={() => handleTabClick('Watch Later')}>
            <span className="sidebar-nav-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </span>
            Watch Later
          </a>
          <a href="#" className={`sidebar-nav-link ${activeTab === 'Liked Videos' ? 'active' : ''}`} onClick={() => handleTabClick('Liked Videos')}>
            <span className="sidebar-nav-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="none"/></svg>
            </span>
            Liked Videos
          </a>
          <a href="#" className={`sidebar-nav-link ${activeTab === 'Downloads' ? 'active' : ''}`} onClick={() => handleTabClick('Downloads')}>
            <span className="sidebar-nav-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            </span>
            Downloads
          </a>
          <a href="#" className={`sidebar-nav-link ${activeTab === 'Premium' ? 'active' : ''}`} onClick={() => handleTabClick('Premium')}>
            <span className="sidebar-nav-icon">
              <svg width="24" height="24" viewBox="0 0 1200 1227" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z" fill="currentColor"/>
              </svg>
            </span>
            Premium
          </a>
        </nav>
        <div className="xplay-subscriptions-section">
          <div style={{ paddingLeft: '12px', marginBottom: '10px' }}>
            <div 
              style={{ fontSize: '16px', display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
              onClick={() => setFollowedListOpen(!followedListOpen)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></svg>
              Followed
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points={followedListOpen ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}></polyline>
              </svg>
            </div>
          </div>
          <div className={`followed-list-container ${followedListOpen ? 'open' : 'closed'}`}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '12px', alignItems: 'flex-start' }}>
            <a href="#" className="sidebar-nav-link" style={{ display: 'inline-flex' }}>
              <span className="sidebar-nav-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </span>
              Creator One
            </a>
            <a href="#" className="sidebar-nav-link" style={{ display: 'inline-flex' }}>
              <span className="sidebar-nav-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </span>
              Creator Two
            </a>
            <a href="#" className="sidebar-nav-link" style={{ display: 'inline-flex' }}>
              <span className="sidebar-nav-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </span>
              Creator Three
            </a>
            <a href="#" className="sidebar-nav-link" style={{ display: 'inline-flex' }}>
              <span className="sidebar-nav-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </span>
              Creator Four
            </a>
            <a href="#" className="sidebar-nav-link" style={{ display: 'inline-flex' }}>
              <span className="sidebar-nav-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </span>
              Creator Five
            </a>
            <a href="#" className="sidebar-nav-link" style={{ display: 'inline-flex' }}>
              <span className="sidebar-nav-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </span>
              Creator Six
            </a>
            <a href="#" className="sidebar-nav-link" style={{ display: 'inline-flex' }}>
              <span className="sidebar-nav-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </span>
              Creator Seven
            </a>
            <a href="#" className="sidebar-nav-link" style={{ display: 'inline-flex' }}>
              <span className="sidebar-nav-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </span>
              Creator Eight
            </a>
            <a href="#" className="sidebar-nav-link" style={{ display: 'inline-flex' }}>
              <span className="sidebar-nav-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </span>
              Creator Nine
            </a>
            <a href="#" className="sidebar-nav-link" style={{ display: 'inline-flex' }}>
              <span className="sidebar-nav-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </span>
              Creator Ten
            </a>
            </div>
          </div>
        </div>
        <button className="sidebar-button">+</button>
        <div className="sidebar-user">
          <div className="sidebar-user-avatar"></div>
        </div>
      </aside>
      <main className="main-container">
        <div className="content-area">
          <header className="header">
            <div className="search-box">
              <div className="search-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </div>
              <input type="text" className="search-input" placeholder="Explore" />
            </div>
            <div className="header-icon"></div>
          </header>
          <div className="xplay-category-bar">
            {categories.map(category => (
              <div 
                key={category} 
                className={`xplay-category ${activeCategory === category ? 'active' : ''}`} 
                onClick={() => handleCategoryClick(category)}
              >
                {category}
              </div>
            ))}
          </div>
          <div className="xplay-content">
            {loading && (
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                padding: '100px 20px',
                gap: '20px'
              }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  border: '4px solid rgba(255, 255, 255, 0.1)',
                  borderTop: '4px solid #1d9bf0',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                <p style={{ color: '#e7e9ea', fontSize: '18px', fontWeight: '500' }}>Loading videos...</p>
                <style>{`
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `}</style>
              </div>
            )}
            {error && (
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                padding: '100px 20px',
                gap: '15px',
                maxWidth: '500px',
                margin: '0 auto'
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ff6b6b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <p style={{ color: '#ff6b6b', fontSize: '20px', fontWeight: '600', textAlign: 'center' }}>
                  Unable to Load Videos
                </p>
                <p style={{ color: '#71767b', fontSize: '14px', textAlign: 'center', lineHeight: '1.5' }}>
                  {error}
                </p>
                <div style={{ 
                  backgroundColor: 'rgba(29, 155, 240, 0.1)', 
                  border: '1px solid rgba(29, 155, 240, 0.3)',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  marginTop: '10px'
                }}>
                  <p style={{ color: '#1d9bf0', fontSize: '13px', margin: 0 }}>
                    💡 Make sure the backend server is running on <code style={{ 
                      backgroundColor: 'rgba(29, 155, 240, 0.2)', 
                      padding: '2px 6px', 
                      borderRadius: '4px',
                      fontFamily: 'monospace'
                    }}>http://localhost:5000</code>
                  </p>
                </div>
                <button 
                  onClick={() => window.location.reload()} 
                  style={{
                    marginTop: '20px',
                    padding: '10px 24px',
                    backgroundColor: '#1d9bf0',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '20px',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1a8cd8'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#1d9bf0'}
                >
                  Try Again
                </button>
              </div>
            )}
            {!loading && !error && activeTab === 'Home' && (
              <>
                {renderVideoGallery()}
              </>
            )}
            {activeTab === 'Micros' && (
              <div className="xplay-micros-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '15px', margin: '20px 0' }}>
                {micros.map(micro => (
                  <div key={micro.id} className="xplay-micros-card">
                    <div className="xplay-micros-thumbnail" style={{ 
                      backgroundImage: `url(${micro.thumbnailUrl})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}>
                      <div className="xplay-micros-duration">{micro.duration}</div>
                    </div>
                    <div className="xplay-micros-info">
                      <div className="xplay-micros-title">{micro.title}</div>
                      <div className="xplay-micros-channel">{micro.channel}</div>
                    </div>
                  </div>
                ))}
                {micros.map(micro => (
                  <div key={micro.id + '_dup'} className="xplay-micros-card">
                    <div className="xplay-micros-thumbnail" style={{ 
                      backgroundImage: `url(${micro.thumbnailUrl})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}>
                      <div className="xplay-micros-duration">{micro.duration}</div>
                    </div>
                    <div className="xplay-micros-info">
                      <div className="xplay-micros-title">{micro.title}</div>
                      <div className="xplay-micros-channel">{micro.channel}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'Followed' && (
              <div className="xplay-subscriptions-section">
                <div className="xplay-section-title">Your Followed Creators</div>
                <div className="xplay-subscription-grid">
                  <div className="xplay-subscription-card">
                    <div className="xplay-subscription-avatar"></div>
                    <div className="xplay-subscription-name">Creator One</div>
                  </div>
                  <div className="xplay-subscription-card">
                    <div className="xplay-subscription-avatar"></div>
                    <div className="xplay-subscription-name">Creator Two</div>
                  </div>
                  <div className="xplay-subscription-card">
                    <div className="xplay-subscription-avatar"></div>
                    <div className="xplay-subscription-name">Creator Three</div>
                  </div>
                  <div className="xplay-subscription-card">
                    <div className="xplay-subscription-avatar"></div>
                    <div className="xplay-subscription-name">Creator Four</div>
                  </div>
                  <div className="xplay-subscription-card">
                    <div className="xplay-subscription-avatar"></div>
                    <div className="xplay-subscription-name">Creator Five</div>
                  </div>
                  <div className="xplay-subscription-card">
                    <div className="xplay-subscription-avatar"></div>
                    <div className="xplay-subscription-name">Creator Six</div>
                  </div>
                  <div className="xplay-subscription-card">
                    <div className="xplay-subscription-avatar"></div>
                    <div className="xplay-subscription-name">Creator Seven</div>
                  </div>
                  <div className="xplay-subscription-card">
                    <div className="xplay-subscription-avatar"></div>
                    <div className="xplay-subscription-name">Creator Eight</div>
                  </div>
                  <div className="xplay-subscription-card">
                    <div className="xplay-subscription-avatar"></div>
                    <div className="xplay-subscription-name">Creator Nine</div>
                  </div>
                  <div className="xplay-subscription-card">
                    <div className="xplay-subscription-avatar"></div>
                    <div className="xplay-subscription-name">Creator Ten</div>
                  </div>
                </div>
              </div>
            )}
            {activeTab !== 'Home' && activeTab !== 'Micros' && activeTab !== 'Subscriptions' && (
              <div className="xplay-video-grid">
                <div className="xplay-video-card">
                  <div className="xplay-video-thumbnail">
                    <div className="xplay-video-duration">10:23</div>
                  </div>
                  <div className="xplay-video-info">
                    <div className="xplay-video-title">Sample Video 1 for {activeTab}</div>
                    <div className="xplay-video-channel">SampleChannel1</div>
                  </div>
                </div>
                <div className="xplay-video-card">
                  <div className="xplay-video-thumbnail">
                    <div className="xplay-video-duration">8:15</div>
                  </div>
                  <div className="xplay-video-info">
                    <div className="xplay-video-title">Sample Video 2 for {activeTab}</div>
                    <div className="xplay-video-channel">SampleChannel2</div>
                  </div>
                </div>
                <div className="xplay-video-card">
                  <div className="xplay-video-thumbnail">
                    <div className="xplay-video-duration">5:47</div>
                  </div>
                  <div className="xplay-video-info">
                    <div className="xplay-video-title">Sample Video 3 for {activeTab}</div>
                    <div className="xplay-video-channel">SampleChannel3</div>
                  </div>
                </div>
                <div className="xplay-video-card">
                  <div className="xplay-video-thumbnail">
                    <div className="xplay-video-duration">15:02</div>
                  </div>
                  <div className="xplay-video-info">
                    <div className="xplay-video-title">Sample Video 4 for {activeTab}</div>
                    <div className="xplay-video-channel">SampleChannel4</div>
                  </div>
                </div>
                <div className="xplay-video-card">
                  <div className="xplay-video-thumbnail">
                    <div className="xplay-video-duration">7:30</div>
                  </div>
                  <div className="xplay-video-info">
                    <div className="xplay-video-title">Sample Video 5 for {activeTab}</div>
                    <div className="xplay-video-channel">SampleChannel5</div>
                  </div>
                </div>
                <div className="xplay-video-card">
                  <div className="xplay-video-thumbnail">
                    <div className="xplay-video-duration">12:10</div>
                  </div>
                  <div className="xplay-video-info">
                    <div className="xplay-video-title">Sample Video 6 for {activeTab}</div>
                    <div className="xplay-video-channel">SampleChannel6</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
