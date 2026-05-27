// Variation 3 — Skandinavisk modernism
// Editorial, magazine-like. Huge typography, restrained palette, asymmetric grid.
// Inspired by Apartamento, Acne paper, Edition magazine.

const SkandinaviskModern = ({ data }) => {
  const C = {
    bg: '#fafaf7',
    paper: '#ffffff',
    ink: '#0e0f0d',
    ink2: '#535551',
    ink3: '#8a8c87',
    rule: '#e6e5df',
    accent: '#c44a2a',     // signal — a brick red, used once or twice
    accentSoft: '#f5e8d8',
  };

  const wd = ['Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör', 'Sön'];

  // A single tiny mark — used in masthead
  const Star = ({ size = 12, color = C.ink }) => (
    <svg width={size} height={size} viewBox="0 0 12 12" style={{ display: 'inline-block' }}>
      <path d="M6 0 L7 5 L12 6 L7 7 L6 12 L5 7 L0 6 L5 5 Z" fill={color}/>
    </svg>
  );

  const DayCell = ({ d, isToday }) => {
    const isPrev = d.month !== 'may';
    const isHoliday = !!d.holiday;
    return (
      <div style={{
        position: 'relative', padding: '14px 0 18px',
        minHeight: 86,
        borderTop: `1px solid ${C.rule}`,
        opacity: isPrev ? 0.32 : 1,
      }}>
        {isToday && (
          <div style={{ position: 'absolute', top: -1, left: 0, right: 0, height: 2, background: C.ink }}/>
        )}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <span style={{
            fontFamily: '"Newsreader", "Cormorant Garamond", serif',
            fontWeight: 300,
            fontSize: isToday ? 44 : 38,
            color: isHoliday ? C.accent : C.ink,
            lineHeight: 0.9, letterSpacing: '-0.02em',
          }}>{d.day}</span>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
            {isHoliday && <span style={{ width: 7, height: 7, borderRadius: 999, background: C.accent }}/>}
            {d.klam && !isToday && <span style={{ fontSize: 9, color: C.ink3, letterSpacing: '0.18em', textTransform: 'uppercase' }}>kläm</span>}
            {isToday && <span style={{ fontSize: 9, color: C.ink, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }}>idag</span>}
          </div>
        </div>
        <div style={{
          marginTop: 8, fontSize: 11, lineHeight: 1.35,
          color: isHoliday ? C.accent : C.ink2,
          letterSpacing: '0.02em',
        }}>{d.name}</div>
        {d.holiday && (
          <div style={{ marginTop: 4, fontSize: 9.5, fontFamily: 'Newsreader, serif', fontStyle: 'italic', color: C.accent, letterSpacing: '0.04em' }}>
            {d.holiday}
          </div>
        )}
      </div>
    );
  };

  const weeks = [];
  for (let w = 0; w < 6; w++) weeks.push(data.days.slice(w * 7, w * 7 + 7));
  const isToday = (d) => d.month === 'may' && d.day === 27;

  return (
    <div style={{
      width: '100%', minHeight: '100%', background: C.bg, color: C.ink,
      fontFamily: '"Inter", "Helvetica Neue", system-ui, sans-serif',
      boxSizing: 'border-box',
    }}>
      {/* Top strip — masthead bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 56px', borderBottom: `1px solid ${C.rule}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Star size={14}/>
          <span style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.ink2 }}>
            Onsdag 27 maj 2026 &nbsp;·&nbsp; v. 22 &nbsp;·&nbsp; Stockholm 13°
          </span>
        </div>
        <nav style={{ display: 'flex', gap: 28, fontSize: 12, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.ink2 }}>
          <span style={{ color: C.ink, borderBottom: `1.5px solid ${C.ink}`, paddingBottom: 2 }}>Idag</span>
          <span>Räknare</span>
          <span>Klämdagar</span>
          <span>Arkiv</span>
        </nav>
      </div>

      <div style={{ padding: '0 56px' }}>
        {/* Big masthead */}
        <div style={{ padding: '48px 0 36px', borderBottom: `1px solid ${C.rule}` }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'flex-end', gap: 32 }}>
            <h1 style={{
              fontFamily: '"Newsreader", "Cormorant Garamond", serif',
              fontWeight: 300, fontSize: 184, margin: 0, lineHeight: 0.84,
              letterSpacing: '-0.04em', color: C.ink,
            }}>
              Cal<span style={{ fontStyle: 'italic', fontWeight: 300, color: C.accent }}>·</span>Pal
            </h1>
            <div style={{ textAlign: 'right', paddingBottom: 14 }}>
              <div style={{ fontSize: 11, letterSpacing: '0.28em', textTransform: 'uppercase', color: C.ink3 }}>nummer cxlvii</div>
              <div style={{ fontFamily: 'Newsreader, serif', fontStyle: 'italic', fontSize: 24, color: C.ink2, marginTop: 6, lineHeight: 1.3, maxWidth: 280 }}>
                Den svenska kalendern, &nbsp;med själ
              </div>
            </div>
          </div>
        </div>

        {/* Today — editorial pull strip */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', borderBottom: `1px solid ${C.rule}` }}>
          {[
            { l: 'Idag', big: '27.05', sub: 'onsdag, blomstertid', accent: true },
            { l: 'Namnsdag', big: 'Beda', sub: '· Blenda' },
            { l: 'Dag av året', big: '147', sub: 'av 365' },
            { l: 'Kvar', big: '218', sub: 'till nyår' },
          ].map((c, i) => (
            <div key={c.l} style={{
              padding: '28px 24px', borderLeft: i === 0 ? 'none' : `1px solid ${C.rule}`,
            }}>
              <div style={{ fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase', color: c.accent ? C.accent : C.ink3, fontWeight: 600 }}>{c.l}</div>
              <div style={{
                fontFamily: 'Newsreader, serif', fontWeight: 300, fontSize: 60,
                color: C.ink, lineHeight: 0.95, marginTop: 12, letterSpacing: '-0.025em',
              }}>{c.big}</div>
              <div style={{ fontSize: 12, color: C.ink2, marginTop: 6, fontFamily: 'Newsreader, serif', fontStyle: 'italic' }}>{c.sub}</div>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 56, padding: '48px 0 24px' }}>
          {/* Calendar */}
          <div>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28 }}>
              <div>
                <div style={{ fontSize: 11, letterSpacing: '0.28em', textTransform: 'uppercase', color: C.ink3 }}>Månaden</div>
                <h2 style={{
                  fontFamily: 'Newsreader, serif', fontWeight: 300, fontStyle: 'italic',
                  fontSize: 108, margin: '4px 0 0', lineHeight: 0.9,
                  letterSpacing: '-0.03em',
                }}>maj</h2>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.ink3, marginBottom: 8 }}>← april &nbsp; / &nbsp; juni →</div>
                <div style={{ fontSize: 12, color: C.ink2, fontFamily: 'Newsreader, serif', fontStyle: 'italic', maxWidth: 220, lineHeight: 1.5 }}>
                  Tre helgdagar, två klämdagar, en kärve namn. Solen står som högst.
                </div>
              </div>
            </div>

            {/* Weekday header */}
            <div style={{ display: 'grid', gridTemplateColumns: '28px repeat(7, 1fr)', gap: 12, paddingBottom: 8, borderBottom: `2px solid ${C.ink}` }}>
              <div></div>
              {wd.map((w, i) => (
                <div key={i} style={{
                  fontSize: 10, fontWeight: 600, letterSpacing: '0.24em',
                  textTransform: 'uppercase', color: i >= 5 ? C.accent : C.ink2,
                }}>{w}</div>
              ))}
            </div>

            {/* Grid rows */}
            <div>
              {weeks.map((row, wi) => (
                <div key={wi} style={{ display: 'grid', gridTemplateColumns: '28px repeat(7, 1fr)', gap: 12 }}>
                  <div style={{
                    fontSize: 10, color: C.ink3, fontWeight: 600, letterSpacing: '0.16em',
                    paddingTop: 18, borderTop: `1px solid ${C.rule}`,
                  }}>{data.WEEKS[wi]}</div>
                  {row.map((d, di) => <DayCell key={di} d={d} isToday={isToday(d)}/>)}
                </div>
              ))}
              <div style={{ height: 1, background: C.ink }}/>
            </div>

            {/* Editorial quote */}
            <div style={{ marginTop: 56, display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 32 }}>
              <div>
                <div style={{ fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase', color: C.accent, fontWeight: 600 }}>Månadens essä</div>
                <div style={{ fontFamily: 'Newsreader, serif', fontStyle: 'italic', fontSize: 20, color: C.ink2, marginTop: 16, lineHeight: 1.4 }}>
                  Ur Kungl. Vetenskaps&shy;akademiens almanach, 1855
                </div>
              </div>
              <p style={{
                fontFamily: 'Newsreader, serif', fontWeight: 300, fontSize: 32, lineHeight: 1.3,
                color: C.ink, margin: 0, letterSpacing: '-0.012em', textWrap: 'pretty',
              }}>
                Maj är blommornas <em style={{ color: C.accent }}>koningadrottning</em>. Hennes första dag kallas Valborg — då tändas vårdkasarna och vintern jagas på flykt.
              </p>
            </div>
          </div>

          {/* Sidebar — minimal cards */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
            {/* Sun & Moon */}
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: C.ink, marginBottom: 14 }}>
                Solhöjd
              </div>
              <svg width="100%" height="92" viewBox="0 0 280 92">
                <line x1="0" y1="78" x2="280" y2="78" stroke={C.ink} strokeWidth="0.7"/>
                <path d="M14 78 Q 140 -10 266 78" stroke={C.ink} strokeWidth="0.5" fill="none"/>
                {(() => {
                  const t = 0.62, x = 14 + 252 * t, y = 78 - Math.sin(t * Math.PI) * 76;
                  return <circle cx={x} cy={y} r="6" fill={C.accent}/>;
                })()}
                <text x="14" y="90" fontSize="10" fill={C.ink2}>03:52</text>
                <text x="266" y="90" fontSize="10" fill={C.ink2} textAnchor="end">21:39</text>
              </svg>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 14, paddingTop: 14, borderTop: `1px solid ${C.rule}` }}>
                <div>
                  <div style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.ink3 }}>Dagsljus</div>
                  <div style={{ fontFamily: 'Newsreader, serif', fontWeight: 300, fontSize: 36, color: C.ink, lineHeight: 1, marginTop: 4 }}>
                    17:47
                  </div>
                </div>
                <div style={{ fontSize: 11, color: C.accent, fontWeight: 600 }}>+3 min 00 s</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 18, paddingTop: 14, borderTop: `1px solid ${C.rule}` }}>
                <svg width="34" height="34" viewBox="0 0 40 40">
                  <circle cx="20" cy="20" r="17" fill="none" stroke={C.ink} strokeWidth="0.7"/>
                  <path d="M20 3 A 17 17 0 0 1 20 37 A 8.5 17 0 0 0 20 3 Z" fill={C.ink}/>
                </svg>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: C.ink, fontWeight: 500 }}>Växande halvmåne</div>
                  <div style={{ fontSize: 11, color: C.ink3 }}>87 % belyst</div>
                </div>
              </div>
            </div>

            {/* Pollen — bar list */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: C.ink }}>Pollen</div>
                <span style={{ fontSize: 10, color: C.ink3, fontStyle: 'italic', fontFamily: 'Newsreader, serif' }}>Stockholm, 27.05</span>
              </div>
              {data.POLLEN.map((p, i) => (
                <div key={p.name} style={{
                  display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'baseline', gap: 8,
                  padding: '10px 0', borderTop: i === 0 ? 'none' : `1px solid ${C.rule}`,
                }}>
                  <div>
                    <div style={{ fontSize: 13, color: C.ink, fontWeight: 500 }}>{p.name}</div>
                    <div style={{ display: 'flex', gap: 2, marginTop: 5 }}>
                      {[1,2,3,4].map(i => (
                        <div key={i} style={{
                          width: 24, height: 3,
                          background: i <= p.level ? C.ink : C.rule,
                        }}/>
                      ))}
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: C.ink2, fontFamily: 'Newsreader, serif', fontStyle: 'italic' }}>
                    {['låg', 'måttlig', 'hög', 'mycket hög', 'extrem'][p.level]}
                  </div>
                </div>
              ))}
            </div>

            {/* Bondepraktikan */}
            <div style={{ padding: '24px 0', borderTop: `2px solid ${C.ink}`, borderBottom: `1px solid ${C.rule}` }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: C.accent }}>Bondepraktikan</div>
              <p style={{ fontFamily: 'Newsreader, serif', fontWeight: 300, fontStyle: 'italic', fontSize: 26, color: C.ink, margin: '12px 0 0', lineHeight: 1.25, letterSpacing: '-0.005em' }}>
                "{data.BONDEPRAKTIKAN[5]}"
              </p>
            </div>

            {/* Dagens ord */}
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: C.ink }}>Dagens svenska ord</div>
              <div style={{
                fontFamily: 'Newsreader, serif', fontWeight: 300, fontStyle: 'italic',
                fontSize: 64, color: C.ink, marginTop: 12, lineHeight: 1, letterSpacing: '-0.025em',
              }}>
                {data.DAGENS_ORD.word}
              </div>
              <div style={{ fontSize: 12, color: C.ink2, marginTop: 10, lineHeight: 1.55, fontFamily: 'Newsreader, serif', fontStyle: 'italic' }}>
                {data.DAGENS_ORD.def}
              </div>
            </div>

            {/* Säsong */}
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: C.ink, marginBottom: 12 }}>Säsong</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <svg width="72" height="72" viewBox="0 0 72 72">
                  <circle cx="36" cy="36" r="32" fill="none" stroke={C.rule} strokeWidth="1"/>
                  {/* progress arc — 147/365 of the year, starting top */}
                  {(() => {
                    const frac = 147 / 365;
                    const ang = frac * 2 * Math.PI - Math.PI / 2;
                    const x = 36 + Math.cos(ang) * 32;
                    const y = 36 + Math.sin(ang) * 32;
                    const large = frac > 0.5 ? 1 : 0;
                    return <path d={`M 36 4 A 32 32 0 ${large} 1 ${x} ${y}`} stroke={C.accent} strokeWidth="2" fill="none"/>;
                  })()}
                  <circle cx="36" cy="36" r="2" fill={C.ink}/>
                </svg>
                <div>
                  <div style={{ fontFamily: 'Newsreader, serif', fontStyle: 'italic', fontSize: 24, color: C.ink, lineHeight: 1 }}>Blomstertid</div>
                  <div style={{ fontSize: 11, color: C.ink3, marginTop: 6, lineHeight: 1.5 }}>
                    Björk- och gräspollen.<br/>Näktergalen sjunger.
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Footer */}
        <div style={{ borderTop: `2px solid ${C.ink}`, padding: '20px 0 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Star size={12}/>
            <span style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.ink2 }}>
              Cal·Pal &nbsp;·&nbsp; Stockholm &nbsp;·&nbsp; MMXXVI
            </span>
          </div>
          <span style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.ink3 }}>
            "Hwarken hast eller hvila — endast tid."
          </span>
        </div>
      </div>
    </div>
  );
};

window.SkandinaviskModern = SkandinaviskModern;
