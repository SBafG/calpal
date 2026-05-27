// Variation 1 — Almanackan 1855
const Almanackan = ({ data }) => {
  const C = {
    parchment: '#f1e7d0', ink: '#1a1a1a', sepia: '#5a3a1a',
    oxblood: '#7a1a1a', rule: '#8a6a3a', ruleSoft: 'rgba(90,60,30,0.25)',
  };
  const wd = ['Mån.', 'Tisd.', 'Onsd.', 'Torsd.', 'Fred.', 'Lörd.', 'Sönd.'];

  const Rosette = ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <path d="M12 2 L13.5 9.5 L21 11 L13.5 12.5 L12 20 L10.5 12.5 L3 11 L10.5 9.5 Z" fill={C.sepia}/>
      <circle cx="12" cy="11" r="1.6" fill={C.parchment}/>
    </svg>
  );

  const Fleuron = () => (
    <svg width="160" height="14" viewBox="0 0 160 14" style={{ display: 'block' }}>
      <line x1="0" y1="7" x2="68" y2="7" stroke={C.rule} strokeWidth="0.6"/>
      <line x1="92" y1="7" x2="160" y2="7" stroke={C.rule} strokeWidth="0.6"/>
      <path d="M80 1 L82 6 L87 7 L82 8 L80 13 L78 8 L73 7 L78 6 Z" fill={C.sepia}/>
    </svg>
  );

  const PollenRow = ({ p }) => (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '7px 0', borderBottom: `0.5px solid ${C.ruleSoft}` }}>
      <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 18, color: C.ink }}>{p.name}</span>
      <span style={{ display: 'flex', gap: 4 }}>
        {[1, 2, 3, 4].map(i => (
          <span key={i} style={{
            width: 9, height: 9, borderRadius: 999,
            background: i <= p.level ? C.oxblood : 'transparent',
            border: `0.7px solid ${C.oxblood}`,
          }}/>
        ))}
      </span>
    </div>
  );

  const DayCell = ({ d, isToday }) => {
    const isPrev = d.month === 'prev' || d.month === 'next';
    const isHoliday = !!d.holiday;
    const dim = isPrev ? 0.32 : 1;
    return (
      <div style={{
        position: 'relative', padding: '8px 9px 10px', minHeight: 82, opacity: dim,
        borderRight: `0.5px solid ${C.ruleSoft}`, borderBottom: `0.5px solid ${C.ruleSoft}`,
        background: isToday ? '#e8d8b0' : isHoliday ? 'rgba(122,26,26,0.06)' : 'transparent',
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <span style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: isToday ? 30 : 26, fontWeight: isToday ? 600 : 500,
            color: isHoliday ? C.oxblood : (d.weekend ? C.oxblood : C.ink), lineHeight: 1,
          }}>{d.day}</span>
          {isToday && <span style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: 11, color: C.oxblood, letterSpacing: '0.1em' }}>idag</span>}
          {d.klam && !isToday && <span style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: 10, color: C.sepia, letterSpacing: '0.08em' }}>kläm</span>}
        </div>
        <div style={{
          marginTop: 6, fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic',
          fontSize: 13, lineHeight: 1.25, color: isHoliday ? C.oxblood : C.sepia,
        }}>{d.name}</div>
        {d.holiday && (
          <div style={{ marginTop: 4, fontFamily: 'Cormorant Garamond, serif', fontSize: 9.5, color: C.oxblood, textTransform: 'uppercase', letterSpacing: '0.14em' }}>
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
      width: '100%', minHeight: '100%', background: C.parchment,
      backgroundImage: `radial-gradient(circle at 20% 30%, rgba(0,0,0,0.02), transparent 50%),
                        radial-gradient(circle at 80% 70%, rgba(90,60,30,0.04), transparent 50%),
                        repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(90,60,30,0.012) 2px, rgba(90,60,30,0.012) 3px)`,
      color: C.ink, fontFamily: 'Cormorant Garamond, serif',
      padding: '38px 46px 46px', boxSizing: 'border-box',
    }}>
      {/* Masthead */}
      <div style={{ borderBottom: `2.5px double ${C.sepia}`, paddingBottom: 16, marginBottom: 6 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: '0.32em', textTransform: 'uppercase', color: C.sepia }}>
              Almanach för året <span style={{ fontStyle: 'italic', letterSpacing: '0.1em', textTransform: 'none' }}>MMXXVI</span> · Utgifven af Cal·Pal
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 6 }}>
              <Rosette size={22}/>
              <h1 style={{ fontWeight: 500, fontSize: 60, lineHeight: 1, margin: 0, color: C.ink }}>
                Cal<span style={{ color: C.oxblood, padding: '0 6px' }}>·</span>Pal
              </h1>
              <Rosette size={22}/>
              <div style={{ fontStyle: 'italic', fontSize: 22, color: C.sepia, marginLeft: 8 }}>
                Den swenska kalendern med själ
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 24, fontStyle: 'italic', fontSize: 19, color: C.sepia }}>
            <span style={{ borderBottom: `1px solid ${C.sepia}` }}>idag</span>
            <span>räknare</span>
            <span>klämdagar</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontStyle: 'italic', fontSize: 13, color: C.sepia, padding: '10px 0 22px', borderBottom: `0.5px solid ${C.ruleSoft}` }}>
        <span>Stockholm, onsdagen den 27 maj anno domini 2026</span>
        <span>Pris &nbsp;·&nbsp; gratis för folket</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 38, marginTop: 26 }}>
        <div>
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{ fontSize: 12, letterSpacing: '0.32em', textTransform: 'uppercase', color: C.sepia }}>Femte månaden</div>
            <h2 style={{ fontWeight: 500, fontStyle: 'italic', fontSize: 68, margin: '4px 0 6px', color: C.ink, lineHeight: 1 }}>Maius — Maj</h2>
            <div style={{ fontSize: 13, fontStyle: 'italic', color: C.sepia }}>
              Tre och trettio dagar · Solen i Tjuren och Twillingarne
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 14 }}><Fleuron /></div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '38px repeat(7, 1fr)', borderTop: `1.5px solid ${C.sepia}`, borderBottom: `0.5px solid ${C.rule}`, background: 'rgba(90,60,30,0.04)' }}>
            <div style={{ padding: '9px 6px', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.sepia, textAlign: 'right' }}>v.</div>
            {wd.map((w, i) => (
              <div key={i} style={{
                padding: '9px 9px', fontStyle: 'italic', fontSize: 15,
                color: i >= 5 ? C.oxblood : C.sepia, letterSpacing: '0.06em',
                borderLeft: `0.5px solid ${C.ruleSoft}`,
              }}>{w}</div>
            ))}
          </div>

          <div style={{ borderLeft: `0.5px solid ${C.ruleSoft}`, borderBottom: `1.5px solid ${C.sepia}` }}>
            {weeks.map((row, wi) => (
              <div key={wi} style={{ display: 'grid', gridTemplateColumns: '38px repeat(7, 1fr)' }}>
                <div style={{
                  padding: '9px 6px 0', fontStyle: 'italic', fontSize: 14, color: C.sepia,
                  textAlign: 'right', borderRight: `0.5px solid ${C.ruleSoft}`,
                  borderBottom: `0.5px solid ${C.ruleSoft}`, background: 'rgba(90,60,30,0.03)',
                }}>{data.WEEKS[wi]}</div>
                {row.map((d, di) => <DayCell key={di} d={d} isToday={isToday(d)}/>)}
              </div>
            ))}
          </div>

          <div style={{ marginTop: 32, padding: '24px 30px', background: 'rgba(90,60,30,0.06)', borderLeft: `3px double ${C.sepia}`, borderRight: `3px double ${C.sepia}` }}>
            <p style={{ fontStyle: 'italic', fontSize: 22, lineHeight: 1.45, color: C.ink, margin: 0, textWrap: 'pretty' }}>
              <span style={{ float: 'left', fontSize: 64, lineHeight: 0.85, marginRight: 8, marginTop: 4, color: C.oxblood, fontStyle: 'normal' }}>M</span>
              aj är blommornas koningadrottning. Hennes första dag kallas Valborg — då tändas vårdkasarna och vintern jagas på flykt. Är man månsk, glömmer man icke björklöfvet på Sankt Erik.
            </p>
            <div style={{ marginTop: 12, fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.sepia }}>
              {data.QUOTE_MAY.source}
            </div>
          </div>
        </div>

        <aside style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div style={{ borderTop: `1.5px solid ${C.sepia}`, borderBottom: `1.5px solid ${C.sepia}`, padding: '14px 2px' }}>
            <div style={{ fontSize: 11, letterSpacing: '0.32em', textTransform: 'uppercase', color: C.sepia, display: 'flex', justifyContent: 'space-between' }}>
              <span>Onsdag</span><span style={{ color: C.oxblood }}>i dag</span>
            </div>
            <div style={{ fontSize: 84, lineHeight: 0.95, fontWeight: 500, color: C.ink, marginTop: 6 }}>
              27 <span style={{ fontStyle: 'italic', fontSize: 36, color: C.sepia }}>maj</span>
            </div>
            <div style={{ marginTop: 10, fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.sepia }}>Namnsdag</div>
            <div style={{ fontStyle: 'italic', fontSize: 28, color: C.oxblood, marginTop: 2 }}>
              Beda &nbsp;·&nbsp; Blenda
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 16, paddingTop: 12, borderTop: `0.5px solid ${C.ruleSoft}` }}>
              {[['v.', '22'], ['dag', '147'], ['qvar', '218']].map(([l, v]) => (
                <div key={l}>
                  <div style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.sepia }}>{l}</div>
                  <div style={{ fontSize: 28, color: C.ink, lineHeight: 1 }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, letterSpacing: '0.32em', textTransform: 'uppercase', color: C.sepia, paddingBottom: 8, borderBottom: `0.5px solid ${C.rule}` }}>
              Sol och måne
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, marginTop: 14 }}>
              <svg width="120" height="74" viewBox="0 0 120 74">
                <path d="M5 68 Q 60 -8 115 68" stroke={C.sepia} strokeWidth="0.6" fill="none" strokeDasharray="2 2"/>
                <line x1="5" y1="68" x2="115" y2="68" stroke={C.sepia} strokeWidth="0.6"/>
                <circle cx="60" cy="10" r="11" fill="none" stroke={C.oxblood} strokeWidth="0.8"/>
                {Array.from({ length: 12 }).map((_, i) => {
                  const a = (i * 30) * Math.PI / 180;
                  return <line key={i} x1={60 + Math.cos(a) * 13} y1={10 + Math.sin(a) * 13} x2={60 + Math.cos(a) * 17} y2={10 + Math.sin(a) * 17} stroke={C.oxblood} strokeWidth="0.6"/>;
                })}
              </svg>
              <div style={{ flex: 1, fontSize: 14, color: C.ink, lineHeight: 1.6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><em style={{ color: C.sepia }}>Upgång</em><span>03:52</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><em style={{ color: C.sepia }}>Nedgång</em><span>21:39</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><em style={{ color: C.sepia }}>Dagsljus</em><span>17 t. 47 m.</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: C.oxblood }}><em>Tillväxt</em><span>+3 m.</span></div>
              </div>
            </div>
            <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 14, paddingTop: 12, borderTop: `0.5px solid ${C.ruleSoft}` }}>
              <svg width="44" height="44" viewBox="0 0 44 44">
                <circle cx="22" cy="22" r="18" fill="none" stroke={C.sepia} strokeWidth="0.6"/>
                <path d="M22 4 A 18 18 0 0 1 22 40 A 9 18 0 0 0 22 4 Z" fill={C.ink}/>
              </svg>
              <div>
                <div style={{ fontStyle: 'italic', fontSize: 18, color: C.ink }}>Wäxande halfmåne</div>
                <div style={{ fontSize: 11, color: C.sepia, letterSpacing: '0.1em' }}>87 % belyst</div>
              </div>
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, letterSpacing: '0.32em', textTransform: 'uppercase', color: C.sepia, display: 'flex', justifyContent: 'space-between', paddingBottom: 8, borderBottom: `0.5px solid ${C.rule}` }}>
              <span>Pollen i dag</span><span style={{ fontStyle: 'italic', textTransform: 'none', letterSpacing: 0 }}>Stockholm</span>
            </div>
            <div style={{ marginTop: 4 }}>
              {data.POLLEN.map(p => <PollenRow key={p.name} p={p}/>)}
            </div>
          </div>

          <div style={{ background: 'rgba(122,26,26,0.05)', border: `0.5px solid ${C.ruleSoft}`, padding: '16px 18px' }}>
            <div style={{ fontSize: 11, letterSpacing: '0.32em', textTransform: 'uppercase', color: C.oxblood }}>Bondepraktikan</div>
            <p style={{ fontStyle: 'italic', fontSize: 22, color: C.ink, margin: '8px 0 0', lineHeight: 1.3 }}>
              "{data.BONDEPRAKTIKAN[5]}"
            </p>
          </div>

          <div>
            <div style={{ fontSize: 11, letterSpacing: '0.32em', textTransform: 'uppercase', color: C.sepia, paddingBottom: 8, borderBottom: `0.5px solid ${C.rule}` }}>
              Dagens swenska ord
            </div>
            <div style={{ fontSize: 42, color: C.ink, marginTop: 10, fontStyle: 'italic' }}>
              {data.DAGENS_ORD.word}
            </div>
            <div style={{ fontSize: 13, color: C.sepia, marginTop: 4, fontStyle: 'italic' }}>
              {data.DAGENS_ORD.def}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, letterSpacing: '0.32em', textTransform: 'uppercase', color: C.sepia, paddingBottom: 10, borderBottom: `0.5px solid ${C.rule}` }}>Årshjulet</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 12 }}>
              <svg width="104" height="104" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="44" fill="none" stroke={C.sepia} strokeWidth="0.6"/>
                <circle cx="50" cy="50" r="34" fill="none" stroke={C.sepia} strokeWidth="0.4" strokeDasharray="1 3"/>
                {Array.from({ length: 12 }).map((_, i) => {
                  const a = (i * 30 - 90) * Math.PI / 180;
                  return <line key={i} x1={50 + Math.cos(a) * 38} y1={50 + Math.sin(a) * 38} x2={50 + Math.cos(a) * 44} y2={50 + Math.sin(a) * 44} stroke={C.sepia} strokeWidth="0.6"/>;
                })}
                {(() => { const a = (4 * 30 - 90 + 15) * Math.PI / 180; return (
                  <line x1="50" y1="50" x2={50 + Math.cos(a) * 40} y2={50 + Math.sin(a) * 40} stroke={C.oxblood} strokeWidth="1.2"/>
                );})()}
                <circle cx="50" cy="50" r="2" fill={C.oxblood}/>
                <text x="50" y="9" textAnchor="middle" fontSize="6" fill={C.sepia}>JAN</text>
                <text x="91" y="52" textAnchor="middle" fontSize="6" fill={C.sepia}>APR</text>
                <text x="50" y="96" textAnchor="middle" fontSize="6" fill={C.sepia}>JUL</text>
                <text x="9" y="52" textAnchor="middle" fontSize="6" fill={C.sepia}>OKT</text>
              </svg>
              <div style={{ flex: 1 }}>
                <div style={{ fontStyle: 'italic', fontSize: 18, color: C.ink }}>Blomstertid</div>
                <div style={{ fontSize: 12, color: C.sepia, marginTop: 4, lineHeight: 1.4 }}>
                  Björkpollen och gräspollen råda. Foglar bygga bo. Solen står högst.
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 36 }}><Fleuron /></div>
      <div style={{ textAlign: 'center', marginTop: 10, fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.sepia }}>
        Tryckt af Cal·Pal &nbsp;·&nbsp; Stockholm anno MMXXVI
      </div>
    </div>
  );
};

window.Almanackan = Almanackan;
