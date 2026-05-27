// Variation 2 — Naturkalendern
// The site breathes with the season. May = late spring: björk-green,
// pale sky, growing daylight. Organic shapes, soft photographic gradients.

const Naturkalendern = ({ data }) => {
  // Seasonal palette — current default is MAJ / vår
  const C = {
    bg: '#f0f1e8',           // pale birch-paper
    bgSoft: '#e6ead6',
    leaf: '#7a9a4a',         // björklöv
    leafDark: '#3e5a28',
    bloom: '#d97a9a',         // körsbär / hägg-blom highlight
    bark: '#3a2e22',          // dark text
    bark2: '#5a4e3e',
    sky: '#c8d9d9',
    cream: '#faf8ee',
    sunYellow: '#e8b84a',
    accent: '#2d5a3a',
  };

  const wd = ['Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör', 'Sön'];

  // Decorative birch leaf
  const Leaf = ({ size = 28, rot = 0, color = C.leaf, opacity = 1 }) => (
    <svg width={size} height={size} viewBox="0 0 32 32" style={{ transform: `rotate(${rot}deg)`, opacity }}>
      <path d="M16 2 C 24 6, 28 14, 16 30 C 4 14, 8 6, 16 2 Z" fill={color}/>
      <path d="M16 4 L 16 28" stroke={C.cream} strokeWidth="0.5" opacity="0.5"/>
      <path d="M16 10 L 22 14 M 16 14 L 23 18 M 16 18 L 21 22 M 16 22 L 19 25
               M 16 10 L 10 14 M 16 14 L 9 18 M 16 18 L 11 22 M 16 22 L 13 25" stroke={C.cream} strokeWidth="0.4" opacity="0.4"/>
    </svg>
  );

  const PollenBar = ({ p }) => {
    const colors = [C.leaf, C.sunYellow, '#d97a3a', C.bloom];
    return (
      <div style={{ padding: '8px 0', borderBottom: `1px solid rgba(58,46,34,0.08)` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
          <span style={{ fontSize: 14, fontWeight: 500, color: C.bark }}>{p.name}</span>
          <span style={{ fontSize: 11, color: C.bark2, fontFamily: 'Newsreader, serif', fontStyle: 'italic' }}>
            {['Låg', 'Måttlig', 'Hög', 'Mycket hög', 'Extrem'][p.level]}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 3 }}>
          {[1,2,3,4].map(i => (
            <div key={i} style={{
              flex: 1, height: 5, borderRadius: 999,
              background: i <= p.level ? colors[Math.min(i-1, colors.length-1)] : 'rgba(58,46,34,0.08)',
            }}/>
          ))}
        </div>
      </div>
    );
  };

  const DayCell = ({ d, isToday }) => {
    const isPrev = d.month !== 'may';
    const isHoliday = !!d.holiday;
    return (
      <div style={{
        position: 'relative', padding: '12px 12px 14px', minHeight: 92,
        background: isToday ? C.bark : isHoliday ? 'rgba(217,122,154,0.12)' : (d.weekend ? 'rgba(122,154,74,0.05)' : C.cream),
        borderRadius: 14, opacity: isPrev ? 0.4 : 1,
        boxShadow: isToday ? `0 6px 20px rgba(58,46,34,0.18)` : 'none',
        overflow: 'hidden',
      }}>
        {isToday && (
          <div style={{ position: 'absolute', top: -4, right: -4, opacity: 0.18 }}>
            <Leaf size={48} rot={-20} color={C.leaf}/>
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <span style={{
            fontFamily: 'Newsreader, serif', fontWeight: 400,
            fontSize: isToday ? 30 : 26,
            color: isToday ? C.cream : isHoliday ? C.bloom : (d.weekend ? C.leafDark : C.bark),
            lineHeight: 1,
          }}>{d.day}</span>
          {isHoliday && !isToday && <span style={{ width: 6, height: 6, borderRadius: 999, background: C.bloom }}/>}
          {isToday && <span style={{ fontSize: 10, color: C.leaf, letterSpacing: '0.16em', textTransform: 'uppercase' }}>idag</span>}
        </div>
        <div style={{
          marginTop: 8, fontSize: 11.5, lineHeight: 1.3,
          color: isToday ? 'rgba(250,248,238,0.7)' : (isHoliday ? C.bloom : C.bark2),
          fontWeight: 500,
        }}>{d.name}</div>
        {d.holiday && (
          <div style={{ marginTop: 4, fontSize: 10, fontFamily: 'Newsreader, serif', fontStyle: 'italic', color: C.bloom }}>
            {d.holiday}
          </div>
        )}
        {d.klam && !isToday && (
          <div style={{ position: 'absolute', bottom: 8, right: 10, fontSize: 9, color: C.sunYellow, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>kläm</div>
        )}
      </div>
    );
  };

  const weeks = [];
  for (let w = 0; w < 6; w++) weeks.push(data.days.slice(w * 7, w * 7 + 7));
  const isToday = (d) => d.month === 'may' && d.day === 27;

  // Day progress for today (Hour 14:23 of 17:47 daylight) – sun arc position
  const sunPct = 0.62;

  return (
    <div style={{
      width: '100%', minHeight: '100%',
      background: `linear-gradient(180deg, ${C.bgSoft} 0%, ${C.bg} 40%, ${C.cream} 100%)`,
      color: C.bark,
      fontFamily: 'Inter, system-ui, sans-serif',
      position: 'relative', overflow: 'hidden',
      boxSizing: 'border-box',
    }}>
      {/* Floating decorative leaves */}
      <div aria-hidden="true" style={{ position: 'absolute', top: 240, right: -20, opacity: 0.5 }}><Leaf size={130} rot={32} color={C.leaf}/></div>
      <div aria-hidden="true" style={{ position: 'absolute', top: 80, right: 180, opacity: 0.3 }}><Leaf size={70} rot={-15} color={C.leafDark}/></div>
      <div aria-hidden="true" style={{ position: 'absolute', bottom: 240, left: -30, opacity: 0.35 }}><Leaf size={150} rot={-50} color={C.leaf}/></div>
      <div aria-hidden="true" style={{ position: 'absolute', bottom: 600, left: 320, opacity: 0.2 }}><Leaf size={40} rot={80} color={C.bloom}/></div>

      <div style={{ position: 'relative', padding: '32px 46px 46px' }}>
        {/* Header */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 46, height: 46, borderRadius: 14,
              background: `linear-gradient(135deg, ${C.leaf}, ${C.leafDark})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 4px 14px rgba(58,46,34,0.18)`,
            }}>
              <Leaf size={26} color={C.cream}/>
            </div>
            <div>
              <div style={{ fontFamily: 'Newsreader, serif', fontWeight: 500, fontSize: 28, lineHeight: 1, letterSpacing: '-0.01em' }}>
                Cal<span style={{ color: C.leaf }}>·</span>Pal
              </div>
              <div style={{ fontSize: 13, color: C.bark2, marginTop: 3, fontStyle: 'italic', fontFamily: 'Newsreader, serif' }}>
                Den svenska kalendern med själ
              </div>
            </div>
          </div>
          <nav style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {['Idag', 'Räknare', 'Klämdagar'].map((n, i) => (
              <span key={n} style={{
                padding: '9px 16px', borderRadius: 999, fontSize: 13, fontWeight: 500,
                background: i === 0 ? C.bark : 'transparent',
                color: i === 0 ? C.cream : C.bark,
              }}>{n}</span>
            ))}
          </nav>
        </header>

        {/* Seasonal hero band */}
        <div style={{
          padding: '28px 32px',
          borderRadius: 22,
          background: `linear-gradient(120deg, ${C.leafDark} 0%, ${C.leaf} 60%, ${C.sunYellow} 130%)`,
          color: C.cream,
          position: 'relative', overflow: 'hidden',
          marginBottom: 28,
        }}>
          <div aria-hidden="true" style={{ position: 'absolute', right: -20, top: -20, opacity: 0.18 }}>
            <Leaf size={220} rot={20} color={C.cream}/>
          </div>
          <div aria-hidden="true" style={{ position: 'absolute', right: 220, bottom: -40, opacity: 0.15 }}>
            <Leaf size={120} rot={-60} color={C.cream}/>
          </div>
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 32 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, letterSpacing: '0.28em', textTransform: 'uppercase', opacity: 0.75 }}>Säsongen just nu</div>
              <div style={{ fontFamily: 'Newsreader, serif', fontWeight: 400, fontStyle: 'italic', fontSize: 64, lineHeight: 1.05, margin: '8px 0 4px' }}>
                Blomstertid
              </div>
              <div style={{ fontSize: 15, opacity: 0.85, maxWidth: 480, lineHeight: 1.55 }}>
                Björklövet slår ut, näktergalen sjunger, ljuset stannar längre varje dag. Vi är 147 dagar in i året — och dagsljuset växer fortfarande med tre minuter om dygnet.
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'Newsreader, serif', fontSize: 18, fontStyle: 'italic', opacity: 0.85 }}>onsdag</div>
              <div style={{ fontFamily: 'Newsreader, serif', fontWeight: 400, fontSize: 88, lineHeight: 1, letterSpacing: '-0.02em' }}>27</div>
              <div style={{ fontSize: 14, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.85, marginTop: 4 }}>maj 2026</div>
            </div>
          </div>
        </div>

        {/* Main grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 28 }}>
          {/* Calendar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 18 }}>
              <h2 style={{
                fontFamily: 'Newsreader, serif', fontWeight: 400, fontSize: 44, margin: 0,
                color: C.bark, letterSpacing: '-0.015em',
              }}>
                Maj <span style={{ color: C.bark2, fontStyle: 'italic', fontWeight: 300 }}>2026</span>
              </h2>
              <div style={{ display: 'flex', gap: 6 }}>
                <button style={{ width: 38, height: 38, borderRadius: 999, border: `1px solid rgba(58,46,34,0.15)`, background: 'transparent', color: C.bark, cursor: 'pointer' }}>‹</button>
                <button style={{ width: 38, height: 38, borderRadius: 999, border: `1px solid rgba(58,46,34,0.15)`, background: 'transparent', color: C.bark, cursor: 'pointer' }}>›</button>
              </div>
            </div>

            {/* Weekday header */}
            <div style={{ display: 'grid', gridTemplateColumns: '32px repeat(7, 1fr)', gap: 6, marginBottom: 6 }}>
              <div></div>
              {wd.map((w, i) => (
                <div key={i} style={{
                  padding: '6px 0', fontSize: 11, fontWeight: 600,
                  color: i >= 5 ? C.leafDark : C.bark2, letterSpacing: '0.16em', textTransform: 'uppercase',
                  textAlign: 'left', paddingLeft: 12,
                }}>{w}</div>
              ))}
            </div>

            {/* Grid */}
            <div style={{ display: 'grid', gap: 8 }}>
              {weeks.map((row, wi) => (
                <div key={wi} style={{ display: 'grid', gridTemplateColumns: '32px repeat(7, 1fr)', gap: 6 }}>
                  <div style={{
                    display: 'flex', flexDirection: 'column', justifyContent: 'center',
                    fontSize: 11, color: C.bark2, fontFamily: 'Newsreader, serif', fontStyle: 'italic',
                    textAlign: 'right', paddingRight: 6,
                  }}>{data.WEEKS[wi]}</div>
                  {row.map((d, di) => <DayCell key={di} d={d} isToday={isToday(d)}/>)}
                </div>
              ))}
            </div>

            {/* Quote */}
            <div style={{
              marginTop: 32, padding: '28px 32px',
              background: `${C.cream}`, borderRadius: 18,
              border: `1px solid rgba(58,46,34,0.08)`,
              position: 'relative', overflow: 'hidden',
            }}>
              <div aria-hidden="true" style={{ position: 'absolute', right: -16, bottom: -16, opacity: 0.12 }}><Leaf size={120} rot={130} color={C.leaf}/></div>
              <div style={{ fontFamily: 'Newsreader, serif', fontSize: 60, lineHeight: 0.6, color: C.leaf, marginBottom: -8, fontStyle: 'italic' }}>"</div>
              <p style={{ fontFamily: 'Newsreader, serif', fontStyle: 'italic', fontSize: 22, lineHeight: 1.5, color: C.bark, margin: 0, textWrap: 'pretty', position: 'relative' }}>
                Maj är blommornas koningadrottning. Hennes första dag kallas Valborg — då tändas vårdkasarna och vintern jagas på flykt. Är man månsk, glömmer man icke björklöfvet på Sankt Erik.
              </p>
              <div style={{ marginTop: 14, fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.bark2 }}>
                {data.QUOTE_MAY.source}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Today card */}
            <div style={{
              background: C.cream, borderRadius: 18, padding: '20px 22px',
              border: `1px solid rgba(58,46,34,0.08)`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.bark2 }}>Namnsdag i dag</div>
                  <div style={{ fontFamily: 'Newsreader, serif', fontStyle: 'italic', fontSize: 32, color: C.bark, marginTop: 4, lineHeight: 1.1 }}>
                    Beda <span style={{ color: C.leaf }}>·</span> Blenda
                  </div>
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 999, background: C.bark, color: C.cream, letterSpacing: '0.14em' }}>IDAG</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginTop: 18, paddingTop: 16, borderTop: `1px solid rgba(58,46,34,0.08)` }}>
                {[['V.', '22'], ['Dag', '147'], ['Kvar', '218']].map(([l, v]) => (
                  <div key={l}>
                    <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.bark2 }}>{l}</div>
                    <div style={{ fontFamily: 'Newsreader, serif', fontSize: 26, color: C.bark, lineHeight: 1, marginTop: 2 }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sun & Moon */}
            <div style={{ background: C.cream, borderRadius: 18, padding: '20px 22px', border: `1px solid rgba(58,46,34,0.08)` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <div style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.bark2 }}>Sol & måne</div>
                <div style={{ fontSize: 11, color: C.leaf, fontWeight: 600 }}>+3 min</div>
              </div>
              <svg width="100%" height="80" viewBox="0 0 280 80">
                <defs>
                  <linearGradient id="sunfade" x1="0" x2="1">
                    <stop offset="0" stopColor={C.sunYellow} stopOpacity="0.3"/>
                    <stop offset="0.5" stopColor={C.sunYellow} stopOpacity="0.7"/>
                    <stop offset="1" stopColor={C.sunYellow} stopOpacity="0.3"/>
                  </linearGradient>
                </defs>
                <path d="M10 70 Q 140 -5 270 70" stroke="url(#sunfade)" strokeWidth="2" fill="none"/>
                <line x1="10" y1="70" x2="270" y2="70" stroke={C.bark2} strokeWidth="0.5" strokeDasharray="2 3" opacity="0.5"/>
                {(() => {
                  const t = sunPct * Math.PI;
                  const x = 10 + 260 * sunPct;
                  const y = 70 - Math.sin(t) * 70;
                  return <>
                    <circle cx={x} cy={y} r="14" fill={C.sunYellow} opacity="0.3"/>
                    <circle cx={x} cy={y} r="8" fill={C.sunYellow}/>
                  </>;
                })()}
              </svg>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: C.bark2, marginTop: 4 }}>
                <span><strong style={{ color: C.bark, fontWeight: 600 }}>03:52</strong> upp</span>
                <span style={{ fontFamily: 'Newsreader, serif', fontStyle: 'italic' }}>17 tim 47 min</span>
                <span><strong style={{ color: C.bark, fontWeight: 600 }}>21:39</strong> ner</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 14, paddingTop: 14, borderTop: `1px solid rgba(58,46,34,0.08)` }}>
                <svg width="36" height="36" viewBox="0 0 40 40">
                  <circle cx="20" cy="20" r="16" fill={C.bgSoft}/>
                  <path d="M20 4 A 16 16 0 0 1 20 36 A 8 16 0 0 0 20 4 Z" fill={C.bark}/>
                </svg>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: C.bark, fontWeight: 500 }}>Växande halvmåne</div>
                  <div style={{ fontSize: 11, color: C.bark2 }}>87 % belyst</div>
                </div>
              </div>
            </div>

            {/* Pollen */}
            <div style={{ background: C.cream, borderRadius: 18, padding: '18px 22px', border: `1px solid rgba(58,46,34,0.08)` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <div style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.bark2 }}>Pollen i dag</div>
                <span style={{ fontSize: 11, color: C.bark2, fontStyle: 'italic', fontFamily: 'Newsreader, serif' }}>Stockholm</span>
              </div>
              {data.POLLEN.map(p => <PollenBar key={p.name} p={p}/>)}
            </div>

            {/* Bondepraktikan */}
            <div style={{
              background: `linear-gradient(135deg, ${C.leafDark}, ${C.bark})`,
              borderRadius: 18, padding: '22px 24px', color: C.cream, position: 'relative', overflow: 'hidden',
            }}>
              <div aria-hidden="true" style={{ position: 'absolute', right: -16, top: -16, opacity: 0.16 }}><Leaf size={86} rot={40} color={C.cream}/></div>
              <div style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', opacity: 0.75 }}>Bondepraktikan</div>
              <p style={{ fontFamily: 'Newsreader, serif', fontStyle: 'italic', fontSize: 22, margin: '8px 0 0', lineHeight: 1.35 }}>
                "{data.BONDEPRAKTIKAN[5]}"
              </p>
            </div>

            {/* Dagens ord */}
            <div style={{ background: C.cream, borderRadius: 18, padding: '20px 22px', border: `1px solid rgba(58,46,34,0.08)` }}>
              <div style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.bark2 }}>Dagens svenska ord</div>
              <div style={{ fontFamily: 'Newsreader, serif', fontSize: 42, color: C.bark, marginTop: 6, fontStyle: 'italic', letterSpacing: '-0.02em' }}>
                {data.DAGENS_ORD.word}
              </div>
              <div style={{ fontSize: 13, color: C.bark2, marginTop: 4, lineHeight: 1.5 }}>
                {data.DAGENS_ORD.def}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

window.Naturkalendern = Naturkalendern;
