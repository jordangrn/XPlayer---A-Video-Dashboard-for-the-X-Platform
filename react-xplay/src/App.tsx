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
        setError('Failed to load videos. Please check if the backend server is running.');
      } finally {
        setLoading(false);
      }
    }
    loadVideos();
  }, []);

  // Videos and micros are now loaded from backend via useEffect

  // Function to render video gallery with micros every 3 rows
  const renderVideoGallery = () => {
    const rows = [];
    for (let i = 0; i < videos.length; i += 18) {
      // Add 3 rows of normal videos (18 videos total - 3 rows of 6)
      const videoChunk = videos.slice(i, i + 18);
      for (let j = 0; j < videoChunk.length; j += 6) {
        const videoRow = videoChunk.slice(j, j + 6).map(video => (
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
        rows.push(<div key={`video-row-${i + j}`} className="xplay-video-grid">{videoRow}</div>);
      }
      
      // Add micros after every 3 rows of normal videos (every 18 videos)
      if (i + 18 < videos.length || i + 18 >= videos.length) {
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
          <div key={`micros-section-${i}`}>
            <div className="xplay-section-title">Micros</div>
            <div className="xplay-micros-row">{microsRow}</div>
          </div>
        );
      }
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
              <div style={{ textAlign: 'center', padding: '50px', color: '#fff' }}>
                <p>Loading videos...</p>
              </div>
            )}
            {error && (
              <div style={{ textAlign: 'center', padding: '50px', color: '#ff6b6b' }}>
                <p>{error}</p>
                <p style={{ fontSize: '14px', marginTop: '10px' }}>Make sure the backend server is running on http://localhost:5000</p>
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
