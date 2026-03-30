import React, { useEffect, useState, useMemo } from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { Sparkles, ChevronRight, Menu, Globe, X, Search } from 'lucide-react';
import gsap from 'gsap';
import Lenis from 'lenis';
import ARTISTS_RAW from './data/artists.json';
import ARTIST_IMAGES from './data/artistImages';
import ArtistDetail from './pages/ArtistDetail';

// Color by genre
function getGenreColor(genre) {
  if (!genre) return '#888';
  if (genre.includes('印象')) return '#D4AF37';
  if (genre.includes('超现实')) return '#FF4D4D';
  if (genre.includes('现代')) return '#3A8DFF';
  if (genre.includes('当代')) return '#2ECC71';
  if (genre.includes('东方')) return '#C8A96E';
  if (genre.includes('巴洛克') || genre.includes('文艺复兴')) return '#BB86FC';
  if (genre.includes('浪漫') || genre.includes('古典')) return '#F48FB1';
  if (genre.includes('波普')) return '#FF9800';
  if (genre.includes('抽象')) return '#26C6DA';
  if (genre.includes('表现')) return '#EF5350';
  return '#888';
}

function getTagline(name, genre) {
  const templates = [
    `重塑${genre}的视觉疆界`,
    `在色彩中寻找生命的真相`,
    `跨越时空的艺术回响`,
    `捕捉那些转瞬即逝的光影`,
    `人类创造力的极致注脚`
  ];
  return templates[Math.abs(name.length % templates.length)];
}

// Build full artist list
const ALL_ARTISTS = ARTISTS_RAW
  .filter(a => a.name && !isNaN(parseInt(a.day)))
  .map(a => ({
    ...a,
    day: parseInt(a.day),
    genre: (a.genre || '').replace('☐', '').trim() || '其他',
    color: getGenreColor((a.genre || '').replace('☐', '').trim()),
    imageUrl: ARTIST_IMAGES[a.name] || null,
    tagline: getTagline(a.name, (a.genre || '').replace('☐', '').trim()),
    story: `来自${a.country || '未知'}的艺术大师。${a.years ? '生卒：' + a.years + '。' : ''}流派：${(a.genre || '').replace('☐', '').trim()}。其独特风格深刻影响了后世。`
  }))
  .sort((a, b) => a.day - b.day);

// ─── ArtistCard Component ───────────────────────────────────────────
const ArtistCard = ({ artist, onClick }) => {
  const [imgFailed, setImgFailed] = useState(false);
  const showImage = artist.imageUrl && !imgFailed;

  return (
    <div className="artist-card glass" onClick={onClick}>
      <div style={{
        height: 220,
        position: 'relative',
        overflow: 'hidden',
        background: `linear-gradient(145deg, ${artist.color}28 0%, #050505 100%)`
      }}>
        {showImage && (
          <img
            src={artist.imageUrl}
            alt={artist.name}
            onError={() => setImgFailed(true)}
            style={{
              width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: 'center 20%',
              display: 'block',
              transition: 'transform 0.8s ease'
            }}
          />
        )}
        {!showImage && (
          <Globe size={52} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', opacity: 0.1, color: artist.color }} />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 30%, rgba(5,5,5,0.98) 100%)', pointerEvents: 'none' }} />
      </div>

      <div style={{ padding: '1.1rem 1.25rem 1.4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.9rem' }}>
          <span style={{ fontSize: '0.58rem', fontWeight: 800, letterSpacing: '0.28em', color: 'rgba(255,255,255,0.18)' }}>
            {String(artist.day).padStart(3, '0')}
          </span>
          <span style={{
            fontSize: '0.55rem', padding: '0.15rem 0.5rem', borderRadius: 4,
            background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.35)',
            textTransform: 'uppercase', letterSpacing: '0.04em', maxWidth: 120,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
          }}>
            {artist.genre}
          </span>
        </div>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.25rem', letterSpacing: '-0.03em', lineHeight: 1.2 }}>
          {artist.name}
        </h3>
        <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.25)', marginBottom: '1.1rem' }}>
          {artist.country}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.12em', opacity: 0.4 }}>VIEW BIOGRAPHY</span>
          <ChevronRight size={12} color={artist.color} style={{ opacity: 0.7 }} />
        </div>
      </div>
    </div>
  );
};

// ─── Home Page ───────────────────────────────────────────────────────
const BROAD_GENRES = ['ALL', '当代艺术', '东方艺术', '现代主义', '印象派', '后印象派',
  '超现实主义', '文艺复兴', '巴洛克', '浪漫主义', '表现主义', '波普艺术', '抽象主义', '非西方/民族'];

const Home = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState('week');

  const filteredArtists = useMemo(() => {
    const q = search.toLowerCase();
    return ALL_ARTISTS.filter(a => {
      const matchSearch = !q ||
        a.name.toLowerCase().includes(q) ||
        (a.country && a.country.toLowerCase().includes(q)) ||
        a.genre.toLowerCase().includes(q);
      const matchFilter = filter === 'ALL' || a.genre.includes(filter);
      return matchSearch && matchFilter;
    });
  }, [search, filter]);

  const weekGroups = useMemo(() => {
    const groups = {};
    filteredArtists.forEach(a => {
      const week = Math.ceil(a.day / 7);
      if (!groups[week]) groups[week] = [];
      groups[week].push(a);
    });
    return Object.entries(groups).map(([week, artists]) => ({
      week: parseInt(week),
      label: `第 ${week} 周`,
      range: `Day ${(parseInt(week) - 1) * 7 + 1}–${Math.min(parseInt(week) * 7, 365)}`,
      artists
    }));
  }, [filteredArtists]);

  useEffect(() => {
    gsap.fromTo('.artist-card',
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.35, stagger: 0.012, ease: 'power3.out' }
    );
  }, [filter, search, viewMode]);

  return (
    <>
      <nav className="navbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg, #D4AF37, #FF4D4D)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={15} color="#000" />
          </div>
          <span style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.04em', fontFamily: "'Outfit', sans-serif" }}>365 ARTIST MUSEUM</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="glass" style={{ display: 'flex', borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
            {[{ key: 'grid', label: '网格' }, { key: 'week', label: '按周' }].map(v => (
              <button key={v.key} onClick={() => setViewMode(v.key)} style={{
                padding: '0.35rem 0.9rem', border: 'none', cursor: 'pointer',
                fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.04em',
                background: viewMode === v.key ? '#D4AF37' : 'transparent',
                color: viewMode === v.key ? '#000' : 'rgba(255,255,255,0.5)',
                transition: 'all 0.2s ease'
              }}>{v.label}</button>
            ))}
          </div>
          <div className="glass" style={{ display: 'flex', alignItems: 'center', padding: '0.35rem 0.9rem', borderRadius: 10, gap: 6 }}>
            <Search size={13} color="rgba(255,255,255,0.35)" />
            <input
              type="text"
              placeholder="搜索艺术家或流派..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ background: 'none', border: 'none', color: '#fff', outline: 'none', fontSize: '0.8rem', width: 140 }}
            />
          </div>
          <button className="glass" style={{ width: 38, height: 38, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', color: '#fff' }}>
            <Menu size={18} />
          </button>
        </div>
      </nav>

      <header className="hero text-center">
        <div className="hero-glow" />
        <h1 className="gradient-text" style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)', fontWeight: 800, lineHeight: 0.95, marginBottom: '1rem', fontFamily: "'Outfit', sans-serif" }}>
          {filter === 'ALL' ? 'GLOBAL CATALOG' : filter.toUpperCase()}
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem' }}>
          共 {ALL_ARTISTS.length} 位大师 · 显示 {filteredArtists.length} 位
        </p>
      </header>

      <div className="container scroller" style={{ display: 'flex', gap: 8, marginBottom: '3rem', overflowX: 'auto', paddingBottom: 8 }}>
        {BROAD_GENRES.map(g => (
          <button key={g} onClick={() => setFilter(g)} style={{
            padding: '0.45rem 1.1rem', borderRadius: 99, fontSize: '0.72rem',
            fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap',
            background: filter === g ? '#D4AF37' : 'rgba(255,255,255,0.06)',
            color: filter === g ? '#000' : '#fff',
            border: `1px solid ${filter === g ? '#D4AF37' : 'rgba(255,255,255,0.1)'}`,
            transition: 'all 0.25s ease', letterSpacing: '0.04em'
          }}>
            {g}
          </button>
        ))}
      </div>

      <main className="container" style={{ paddingBottom: '8rem' }}>
        {viewMode === 'grid' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
            {filteredArtists.map(artist => (
              <ArtistCard key={artist.day} artist={artist} onClick={() => navigate(`/artist/${artist.day}`)} />
            ))}
          </div>
        ) : (
          weekGroups.map(({ week, label, range, artists }) => (
            <div key={week} style={{ marginBottom: '4rem' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.05em', color: '#fff' }}>{label}</h2>
                <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)', fontWeight: 600, letterSpacing: '0.1em' }}>{range} · {artists.length} 位</span>
                <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.04)' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1.5rem' }}>
                {artists.map(artist => (
                  <ArtistCard key={artist.day} artist={artist} onClick={() => navigate(`/artist/${artist.day}`)} />
                ))}
              </div>
            </div>
          ))
        )}
        {filteredArtists.length === 0 && (
          <div style={{ textAlign: 'center', padding: '6rem 2rem', opacity: 0.3 }}>
            <p style={{ fontSize: '1.1rem' }}>NO ARTISTS FOUND IN THIS GALAXY...</p>
          </div>
        )}
      </main>

      <footer style={{ padding: '4rem 2rem', borderTop: '1px solid rgba(255,255,255,0.04)', textAlign: 'center' }}>
        <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1.4rem', letterSpacing: '-0.05em', opacity: 0.4 }}>ANTIGRAVITY ART LAB</div>
      </footer>
    </>
  );
};

// ─── App Component ───────────────────────────────────────────────────
const App = () => {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.08 });
    const raf = t => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#050505', color: '#fff', fontFamily: "'Inter', sans-serif" }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/artist/:day" element={<ArtistDetail />} />
      </Routes>
    </div>
  );
};

export default App;
