import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, Copy, Globe, Sparkles, Quote } from 'lucide-react';
import gsap from 'gsap';
import ARTIST_BIOS from '../data/bios/index';
import ALL_ARTISTS_RAW from '../data/artists.json';
import ARTIST_IMAGES from '../data/artistImages';

function getGenreColor(genre) {
  if (!genre) return '#888';
  const mapping = {
    '印象': '#D4AF37', '超现实': '#FF4D4D', '现代': '#3A8DFF',
    '当代': '#2ECC71', '东方': '#C8A96E', '巴洛克': '#BB86FC',
    '文艺复兴': '#BB86FC', '浪漫': '#F48FB1', '波普': '#FF9800',
    '表现': '#EF5350'
  };
  for (const key in mapping) {
    if (genre.includes(key)) return mapping[key];
  }
  return '#888';
}

const ArtistDetail = () => {
  const { day } = useParams();
  const navigate = useNavigate();
  const [wikiData, setWikiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const artist = useMemo(() => {
    const raw = ALL_ARTISTS_RAW.find(a => parseInt(a.day) === parseInt(day));
    if (!raw) return null;
    const bio = ARTIST_BIOS[raw.name] || null;
    return {
      ...raw,
      day: parseInt(raw.day),
      color: getGenreColor(raw.genre),
      imageUrl: ARTIST_IMAGES[raw.name] || null,
      bio
    };
  }, [day]);

  useEffect(() => {
    if (!artist || artist.bio?.periods) return;
    const fetchWiki = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://zh.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(artist.name)}`);
        const data = await res.json();
        if (data.extract) setWikiData(data.extract);
      } catch (e) { console.error("Wiki error", e); }
      finally { setLoading(false); }
    };
    fetchWiki();
  }, [artist]);

  useEffect(() => {
    window.scrollTo(0, 0);
    gsap.fromTo('.detail-hero', { opacity: 0 }, { opacity: 1, duration: 1.2 });
    gsap.fromTo('.detail-section', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, delay: 0.3 });
  }, [day]);

  if (!artist) return <div className="p-20 text-center">404 Artist Not Found</div>;

  const handleCopyPrompt = () => {
    const text = `${artist.name} style, artistic interpretation, signature ${artist.genre} elements, ultra high quality.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#050505', color: '#fff', fontFamily: "'Inter', sans-serif" }}>
      
      {/* ── Navbar ─────────────────────────────────────────── */}
      <header className="glass" style={{ position: 'fixed', top: 0, width: '100%', zIndex: 100, padding: '1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700 }}>
          <ArrowLeft size={18} /> BACK TO MUSEUM
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: '0.75rem', opacity: 0.5, letterSpacing: '0.1em' }}>DAY {String(artist.day).padStart(3, '0')}</span>
          <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.1)' }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: artist.color }}>{artist.genre}</span>
        </div>
      </header>

      <div style={{ display: 'flex', minHeight: '100vh', paddingTop: '64px', flexWrap: 'wrap' }}>
        
        {/* Left Side: Rep Work Sticky Column */}
        <section className="detail-hero" style={{ 
          flex: '1 1 500px', position: 'sticky', top: '64px', height: 'calc(100vh - 64px)', overflow: 'hidden',
          background: artist.imageUrl ? `url(${artist.imageUrl}) center top / cover` : `linear-gradient(135deg, ${artist.color}15, #050505)`,
          display: 'flex', alignItems: 'flex-end', padding: '4rem'
        }}>
          {!artist.imageUrl && (
            <Globe size={180} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', opacity: 0.05, color: artist.color }} />
          )}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent, #050505 95%), linear-gradient(to top, #050505, transparent 40%)' }} />
          
          <div style={{ position: 'relative', zIndex: 1, maxWidth: 400 }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.3em', color: artist.color, marginBottom: '1rem' }}>REPRESENTATIVE WORK</div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '0.5rem', fontFamily: "'Outfit', sans-serif" }}>
              {artist.bio?.representativeWorks?.[0] || '大师之作'}
            </h2>
            <p style={{ opacity: 0.4, fontSize: '0.85rem' }}>{artist.name} · {artist.years}</p>
          </div>
        </section>

        {/* Right Side: Content Scroll */}
        <section className="detail-content" style={{ flex: '1 1 600px', padding: '5vw', background: '#050505' }}>
          
          <div className="detail-section" style={{ marginBottom: '6rem' }}>
            <h1 style={{ fontSize: 'clamp(3.5rem, 10vw, 6rem)', fontWeight: 800, letterSpacing: '-0.05em', lineHeight: 0.85, marginBottom: '2rem', fontFamily: "'Outfit', sans-serif" }}>
              {artist.name}
            </h1>
            <div style={{ display: 'flex', gap: 30, alignItems: 'center', opacity: 0.3, fontSize: '1.1rem', fontWeight: 300 }}>
              <span style={{ borderBottom: `2px solid ${artist.color}`, paddingBottom: 4 }}>{artist.country}</span>
              <span>{artist.years}</span>
            </div>
          </div>

          {/* Detailed Periods */}
          {artist.bio?.periods ? (
            <div style={{ position: 'relative', paddingLeft: '2.5rem', marginLeft: '1rem', borderLeft: '2px solid rgba(255,255,255,0.1)' }}>
              {artist.bio.periods.map((period, idx) => (
                <div key={idx} className="detail-section" style={{ marginBottom: '6rem', position: 'relative' }}>
                  {/* Timeline Dot */}
                  <div style={{ position: 'absolute', left: '-3.1rem', top: '0.5rem', width: '1.2rem', height: '1.2rem', borderRadius: '50%', background: '#050505', border: `3px solid ${artist.color}` }} />

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 15, marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.02em', color: '#fff' }}>
                      {period.title}
                    </h3>
                    <span style={{ fontSize: '0.9rem', opacity: 0.4, fontWeight: 700, color: artist.color }}>{period.years}</span>
                  </div>

                  {/* Keywords Chips */}
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '2rem' }}>
                    {period.keywords?.map((k, i) => (
                      <span key={i} style={{ fontSize: '0.65rem', fontWeight: 700, padding: '0.3rem 0.8rem', borderRadius: 6, background: 'rgba(255,255,255,0.05)', color: artist.color, border: `1px solid ${artist.color}33`, letterSpacing: '0.05em' }}>
                        {k.toUpperCase()}
                      </span>
                    ))}
                  </div>

                  {/* Main Content */}
                  <p style={{ fontSize: '1.15rem', lineHeight: 1.9, fontWeight: 300, color: 'rgba(255,255,255,0.75)', marginBottom: '2rem' }}>
                    {period.content}
                  </p>

                  {/* Quote */}
                  {period.quote && (
                    <div style={{ padding: '2rem', borderLeft: `3px solid ${artist.color}`, background: 'rgba(255,255,255,0.02)', borderRadius: '0 12px 12px 0', marginBottom: '2rem', position: 'relative' }}>
                      <Quote size={40} style={{ position: 'absolute', top: 10, right: 20, opacity: 0.05 }} />
                      <p style={{ fontSize: '1.1rem', fontStyle: 'italic', lineHeight: 1.6, color: '#fff' }}>"{period.quote}"</p>
                    </div>
                  )}

                  {/* Works Tags */}
                  {period.works && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, opacity: 0.5, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem', marginTop: '1rem' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.1em' }}>REPRESENTATIVE PIECES:</span>
                      {period.works.map((w, i) => (
                        <span key={i} style={{ fontSize: '0.85rem', fontWeight: 300 }}>{w}{i < period.works.length - 1 ? ' · ' : ''}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
             /* Fallback to simple story if no periods */
             <div className="detail-section" style={{ marginBottom: '6rem' }}>
                <p style={{ fontSize: '1.3rem', lineHeight: 2, fontWeight: 300, color: 'rgba(255,255,255,0.7)' }}>
                  {loading ? "Discovering from history..." : (wikiData || artist.story)}
                </p>
             </div>
          )}

          {/* Legacy Section */}
          <div className="detail-section" style={{ marginBottom: '6rem', padding: '3rem', borderRadius: 24, border: '1px solid rgba(255,255,255,0.05)', background: 'linear-gradient(to bottom right, rgba(255,255,255,0.02), transparent)' }}>
             <h4 style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.2em', opacity: 0.3, marginBottom: '1.5rem' }}>后世影响 LEGACY</h4>
             <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'rgba(255,255,255,0.5)', fontWeight: 300 }}>
               {artist.bio?.legacy || `${artist.name} 作为 ${artist.genre} 领域的重要代表，其探索精神在当今视觉文化中仍具极高的启发性。`}
             </p>
          </div>

          {/* Prompt Tool */}
          <div className="detail-section glass" style={{ padding: '3rem', borderRadius: 24, background: `linear-gradient(135deg, ${artist.color}15, transparent)` }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 800 }}>
                  <Sparkles size={18} color={artist.color} /> NANO PROMPT REFERENCE
                </h4>
                <button 
                  onClick={handleCopyPrompt}
                  style={{ background: artist.color, border: 'none', color: '#000', padding: '0.6rem 1.2rem', borderRadius: 10, fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}
                >
                  <Copy size={13} /> {copied ? 'COPIED!' : 'COPY TOKEN'}
                </button>
             </div>
             <div className="glass" style={{ padding: '1.25rem', borderRadius: 12, background: '#000', fontFamily: 'monospace', fontSize: '0.9rem', color: artist.color, border: `1px solid ${artist.color}22` }}>
               {artist.name} style, {artist.genre} texture, high contrast, artistic interpretation...
             </div>
          </div>

          {/* Page Nav */}
          <nav style={{ marginTop: '8rem', paddingBottom: '10rem', display: 'flex', justifyContent: 'space-between', opacity: 0.4 }}>
             <button onClick={() => navigate(`/artist/${Math.max(1, artist.day - 1)}`)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, fontWeight: 700 }}>
               <ChevronLeft size={20}/> PREVIOUS
             </button>
             <button onClick={() => navigate(`/artist/${Math.min(365, artist.day + 1)}`)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, fontWeight: 700 }}>
               NEXT <ChevronRight size={20}/>
             </button>
          </nav>

        </section>
      </div>
    </div>
  );
};

export default ArtistDetail;
