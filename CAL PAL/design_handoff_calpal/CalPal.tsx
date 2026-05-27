/**
 * Cal·Pal — Home page component
 * ──────────────────────────────────────────────────────────────────────────
 * Variation 3 (Skandinavisk modernism): editorial, magazine-like.
 * Huge serif typography, restrained palette, asymmetric grid.
 *
 * Usage:
 *   import './tokens.css';
 *   import { CalPal } from './CalPal';
 *   <CalPal data={pageData} settings={settings} />
 *
 * The component is structural — it reads colors / spacing / type from the
 * CSS variables defined in tokens.css. Wrap it (or the page) in an element
 * with `data-season` and `data-density` attributes to switch palettes.
 *
 *   <div data-season="var" data-density="regular">
 *     <CalPal data={...} settings={...} />
 *   </div>
 *
 * Designed at 1480 px content width on a max ~1600 px viewport. The layout
 * uses CSS Grid with a fixed sidebar (320 px) and a flexible calendar
 * column. For < 960 px viewports, collapse to a single column (sidebar
 * after calendar) — this isn't implemented in the prototype but is the
 * intended responsive behavior.
 */

import React from 'react';
import type {
  CalPalPageData, CalPalSettings, DayCell as DayCellType, PollenReading,
} from './types';

// ────────────────────────────────────────────────────────────────────────────
// PUBLIC
// ────────────────────────────────────────────────────────────────────────────

export interface CalPalProps {
  data: CalPalPageData;
  settings: CalPalSettings;
}

export function CalPal({ data, settings }: CalPalProps) {
  return (
    <div
      data-season={settings.season}
      data-density={settings.density}
      style={{
        minHeight: '100vh',
        background: 'var(--cp-bg)',
        color: 'var(--cp-ink)',
        fontFamily: 'var(--cp-font-sans)',
      }}
    >
      <TopStrip today={data.today} />

      <div style={{ padding: '0 var(--cp-pad-x)' }}>
        {settings.masthead !== 'none' && (
          <Masthead season={settings.season} compact={settings.masthead === 'compact'} />
        )}

        {settings.showStats && <TodayStats today={data.today} seasonLabel={data.seasonLabel} />}

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 320px',
          gap: 76,
          padding: '48px 0 32px',
        }}>
          <main>
            <CalendarHeader monthName={data.month.monthName} seasonPoem={data.seasonPoem} />
            <CalendarGrid month={data.month} showWeeks={settings.showWeeks} />
            <MonthEssayQuote quote={data.quote} />
          </main>

          <Sidebar data={data} />
        </div>

        <Footer />
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ────────────────────────────────────────────────────────────────────────────

function Star({ size = 12, color = 'var(--cp-ink)' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" style={{ display: 'inline-block' }}>
      <path d="M6 0 L7 5 L12 6 L7 7 L6 12 L5 7 L0 6 L5 5 Z" fill={color}/>
    </svg>
  );
}

/** Slim header strip with date + nav. Lives above the masthead. */
function TopStrip({ today }: { today: CalPalPageData['today'] }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '18px var(--cp-pad-x)', borderBottom: 'var(--cp-border-hair)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <Star size={14}/>
        <span style={{
          fontSize: 'var(--cp-fs-meta)', letterSpacing: 'var(--cp-tracking-wider)',
          textTransform: 'uppercase', color: 'var(--cp-ink-2)',
        }}>
          {today.weekday} {today.date} {today.monthName} {today.year} &nbsp;·&nbsp; v. {today.week} &nbsp;·&nbsp; Stockholm 13°
        </span>
      </div>
      <nav style={{
        display: 'flex', gap: 28, fontSize: 'var(--cp-fs-small)',
        letterSpacing: 'var(--cp-tracking-wide)', textTransform: 'uppercase',
        color: 'var(--cp-ink-2)',
      }}>
        <a href="/" style={{ color: 'var(--cp-ink)', borderBottom: '1.5px solid var(--cp-ink)', paddingBottom: 2, textDecoration: 'none' }}>Idag</a>
        <a href="/raknare" style={{ color: 'inherit', textDecoration: 'none' }}>Räknare</a>
        <a href="/klamdagar" style={{ color: 'inherit', textDecoration: 'none' }}>Klämdagar</a>
        <a href="/arkiv" style={{ color: 'inherit', textDecoration: 'none' }}>Arkiv</a>
      </nav>
    </div>
  );
}

/** Huge "Cal·Pal" wordmark + edition meta on the right. */
function Masthead({ season, compact }: { season: string; compact: boolean }) {
  const seasonName = ({ vinter: 'vinter', var: 'vår', sommar: 'sommar', host: 'höst' } as any)[season] || season;
  return (
    <div style={{
      padding: compact ? '32px 0 24px' : '52px 0 40px',
      borderBottom: 'var(--cp-border-hair)',
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'flex-end', gap: 32 }}>
        <h1 style={{
          fontFamily: 'var(--cp-font-serif)',
          fontWeight: 'var(--cp-fw-light)',
          fontSize: compact ? 96 : 'var(--cp-fs-display-xl)',
          margin: 0, lineHeight: 'var(--cp-lh-tight)',
          letterSpacing: 'var(--cp-tracking-tight)',
          color: 'var(--cp-ink)',
        }}>
          Cal<span style={{ fontStyle: 'italic', color: 'var(--cp-accent)' }}>·</span>Pal
        </h1>
        <div style={{ textAlign: 'right', paddingBottom: compact ? 6 : 14 }}>
          <div style={{
            fontSize: 'var(--cp-fs-meta)', letterSpacing: 'var(--cp-tracking-widest)',
            textTransform: 'uppercase', color: 'var(--cp-ink-3)',
          }}>
            nummer cxlvii &nbsp;·&nbsp; {seasonName}
          </div>
          <div style={{
            fontFamily: 'var(--cp-font-serif)', fontStyle: 'italic',
            fontSize: 22, color: 'var(--cp-ink-2)', marginTop: 6,
            lineHeight: 1.3, maxWidth: 280,
          }}>
            Den svenska kalendern, &nbsp;med själ
          </div>
        </div>
      </div>
    </div>
  );
}

/** Four-column stat strip below the masthead. */
function TodayStats({ today, seasonLabel }: { today: CalPalPageData['today']; seasonLabel: string }) {
  const cards = [
    { l: 'Idag', big: today.weekday.toLowerCase(), sub: `${today.date} ${today.monthName} · ${seasonLabel.toLowerCase()}`, accent: true, italic: true },
    { l: 'Namnsdag', big: today.namnsdag[0], sub: `· ${today.namnsdag.slice(1).join(', ')}`, accent: false, italic: false },
    { l: 'Dag av året', big: String(today.dayOfYear), sub: 'av 365', accent: false, italic: false },
    { l: 'Dagar kvar', big: String(today.daysLeft), sub: 'till nyår', accent: false, italic: false },
  ];
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr',
      borderBottom: 'var(--cp-border-hair)',
    }}>
      {cards.map((c, i) => (
        <div key={c.l} style={{
          padding: '28px 24px',
          borderLeft: i === 0 ? 'none' : 'var(--cp-border-hair)',
        }}>
          <div style={{
            fontSize: 'var(--cp-fs-eyebrow)', letterSpacing: 'var(--cp-tracking-widest)',
            textTransform: 'uppercase', fontWeight: 'var(--cp-fw-semi)',
            color: c.accent ? 'var(--cp-accent)' : 'var(--cp-ink-3)',
          }}>{c.l}</div>
          <div style={{
            fontFamily: 'var(--cp-font-serif)', fontWeight: 'var(--cp-fw-light)',
            fontStyle: c.italic ? 'italic' : 'normal',
            fontSize: 'var(--cp-fs-display-s)', color: 'var(--cp-ink)',
            lineHeight: 0.95, marginTop: 12, letterSpacing: 'var(--cp-tracking-snug)',
          }}>{c.big}</div>
          <div style={{
            fontSize: 'var(--cp-fs-small)', color: 'var(--cp-ink-2)', marginTop: 6,
            fontFamily: 'var(--cp-font-serif)', fontStyle: 'italic',
          }}>{c.sub}</div>
        </div>
      ))}
    </div>
  );
}

/** Calendar header: huge italic "maj" + nav + season blurb. */
function CalendarHeader({ monthName, seasonPoem }: { monthName: string; seasonPoem: string }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
      marginBottom: 28,
    }}>
      <div>
        <div style={{
          fontSize: 'var(--cp-fs-meta)', letterSpacing: 'var(--cp-tracking-widest)',
          textTransform: 'uppercase', color: 'var(--cp-ink-3)',
        }}>Månaden</div>
        <h2 style={{
          fontFamily: 'var(--cp-font-serif)', fontWeight: 'var(--cp-fw-light)',
          fontStyle: 'italic', fontSize: 'var(--cp-fs-display-l)',
          margin: '4px 0 0', lineHeight: 0.9, letterSpacing: '-0.03em',
        }}>{monthName}</h2>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{
          fontSize: 'var(--cp-fs-meta)', letterSpacing: 'var(--cp-tracking-wider)',
          textTransform: 'uppercase', color: 'var(--cp-ink-3)', marginBottom: 8,
        }}>← april &nbsp; / &nbsp; juni →</div>
        <div style={{
          fontSize: 'var(--cp-fs-small)', color: 'var(--cp-ink-2)',
          fontFamily: 'var(--cp-font-serif)', fontStyle: 'italic',
          maxWidth: 220, lineHeight: 1.5,
        }}>{seasonPoem}</div>
      </div>
    </div>
  );
}

/** The 6-week month grid. */
function CalendarGrid({ month, showWeeks }: { month: CalPalPageData['month']; showWeeks: boolean }) {
  const wd = ['Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör', 'Sön'];
  const weeks: DayCellType[][] = [];
  for (let w = 0; w < 6; w++) weeks.push(month.days.slice(w * 7, w * 7 + 7));

  const gridTemplateColumns = `${showWeeks ? '28px ' : ''}repeat(7, 1fr)`;

  return (
    <div>
      {/* Weekday header */}
      <div style={{
        display: 'grid', gridTemplateColumns, gap: 12,
        paddingBottom: 8, borderBottom: 'var(--cp-border-strong)',
      }}>
        {showWeeks && <div />}
        {wd.map((w, i) => (
          <div key={i} style={{
            fontSize: 'var(--cp-fs-eyebrow)', fontWeight: 'var(--cp-fw-semi)',
            letterSpacing: '0.24em', textTransform: 'uppercase',
            color: i >= 5 ? 'var(--cp-accent)' : 'var(--cp-ink-2)',
          }}>{w}</div>
        ))}
      </div>

      {weeks.map((row, wi) => (
        <div key={wi} style={{ display: 'grid', gridTemplateColumns, gap: 12 }}>
          {showWeeks && (
            <div style={{
              fontSize: 'var(--cp-fs-eyebrow)', color: 'var(--cp-ink-3)',
              fontWeight: 'var(--cp-fw-semi)', letterSpacing: '0.16em',
              paddingTop: 18, borderTop: 'var(--cp-border-hair)',
            }}>{month.weeks[wi]}</div>
          )}
          {row.map((d, di) => <DayCellView key={di} d={d}/>)}
        </div>
      ))}

      {/* Bottom 1 px ink rule that closes the grid */}
      <div style={{ height: 1, background: 'var(--cp-ink)' }}/>
    </div>
  );
}

function DayCellView({ d }: { d: DayCellType }) {
  const isPrev = d.month !== 'current';
  const isHoliday = !!d.holiday;
  return (
    <div style={{
      position: 'relative',
      padding: 'var(--cp-cal-day-pad, 14px) 0 calc(var(--cp-cal-day-pad, 14px) + 4px)',
      minHeight: 'var(--cp-cal-day-min, 86px)',
      borderTop: d.isToday ? 'var(--cp-border-strong)' : 'var(--cp-border-hair)',
      opacity: isPrev ? 0.32 : 1,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <span style={{
          fontFamily: 'var(--cp-font-serif)',
          fontWeight: 'var(--cp-fw-light)',
          fontSize: d.isToday ? 'var(--cp-fs-day-today)' : 'var(--cp-fs-day)',
          color: isHoliday ? 'var(--cp-accent)' : 'var(--cp-ink)',
          lineHeight: 0.9, letterSpacing: 'var(--cp-tracking-snug)',
        }}>{d.day}</span>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          {isHoliday && !d.isToday && (
            <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--cp-accent)' }}/>
          )}
          {d.klam && !d.isToday && (
            <span style={{ fontSize: 9, color: 'var(--cp-ink-3)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>kläm</span>
          )}
          {d.isToday && (
            <span style={{ fontSize: 9, color: 'var(--cp-ink)', fontWeight: 'var(--cp-fw-bold)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>idag</span>
          )}
        </div>
      </div>
      <div style={{
        marginTop: 8, fontSize: 11, lineHeight: 1.35,
        color: isHoliday ? 'var(--cp-accent)' : 'var(--cp-ink-2)',
        letterSpacing: '0.02em',
      }}>{d.name}</div>
      {d.holiday && (
        <div style={{
          marginTop: 4, fontSize: 9.5, fontFamily: 'var(--cp-font-serif)',
          fontStyle: 'italic', color: 'var(--cp-accent)', letterSpacing: '0.04em',
        }}>{d.holiday}</div>
      )}
    </div>
  );
}

/** Editorial essay quote below the calendar. */
function MonthEssayQuote({ quote }: { quote: CalPalPageData['quote'] }) {
  return (
    <div style={{ marginTop: 56, display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 32 }}>
      <div>
        <div style={{
          fontSize: 'var(--cp-fs-eyebrow)', letterSpacing: 'var(--cp-tracking-widest)',
          textTransform: 'uppercase', color: 'var(--cp-accent)',
          fontWeight: 'var(--cp-fw-semi)',
        }}>Månadens essä</div>
        <div style={{
          fontFamily: 'var(--cp-font-serif)', fontStyle: 'italic',
          fontSize: 20, color: 'var(--cp-ink-2)', marginTop: 16, lineHeight: 1.4,
        }}>{quote.source}</div>
      </div>
      <p style={{
        fontFamily: 'var(--cp-font-serif)', fontWeight: 'var(--cp-fw-light)',
        fontSize: 'var(--cp-fs-h3)', lineHeight: 1.3, color: 'var(--cp-ink)',
        margin: 0, letterSpacing: '-0.012em', textWrap: 'pretty',
      }}>
        {/* In production: split on highlightWords and wrap in <em> with accent. */}
        {quote.text}
      </p>
    </div>
  );
}

/** Sidebar — sun/moon, pollen, bondepraktikan, dagens ord, season. */
function Sidebar({ data }: { data: CalPalPageData }) {
  return (
    <aside style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
      <SidebarSunMoon today={data.today}/>
      <SidebarPollen pollen={data.pollen} location={data.pollenLocation}/>
      <SidebarBondepraktikan text={data.bondepraktikan}/>
      <SidebarDagensOrd ord={data.dagensOrd}/>
      <SidebarSeason label={data.seasonLabel} dayOfYear={data.today.dayOfYear}/>
    </aside>
  );
}

function SectionHeading({ children, accent = false }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <div style={{
      fontSize: 'var(--cp-fs-eyebrow)', fontWeight: 'var(--cp-fw-bold)',
      letterSpacing: 'var(--cp-tracking-widest)', textTransform: 'uppercase',
      color: accent ? 'var(--cp-accent)' : 'var(--cp-ink)',
    }}>{children}</div>
  );
}

function SidebarSunMoon({ today }: { today: CalPalPageData['today'] }) {
  // Approximate sun position 0–1 across the arc — derived from now / day length
  // in production. In the prototype this is a fixed 0.62.
  const sunFrac = 0.62;
  return (
    <div>
      <SectionHeading>Solhöjd</SectionHeading>
      <div style={{ marginTop: 14 }}>
        <svg width="100%" height="92" viewBox="0 0 280 92">
          <line x1="0" y1="78" x2="280" y2="78" stroke="var(--cp-ink)" strokeWidth="0.7"/>
          <path d="M14 78 Q 140 -10 266 78" stroke="var(--cp-ink)" strokeWidth="0.5" fill="none"/>
          {(() => {
            const x = 14 + 252 * sunFrac;
            const y = 78 - Math.sin(sunFrac * Math.PI) * 76;
            return <circle cx={x} cy={y} r="6" fill="var(--cp-accent)"/>;
          })()}
          <text x="14" y="90" fontSize="10" fill="var(--cp-ink-2)">{today.sunrise}</text>
          <text x="266" y="90" fontSize="10" fill="var(--cp-ink-2)" textAnchor="end">{today.sunset}</text>
        </svg>
      </div>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        marginTop: 14, paddingTop: 14, borderTop: 'var(--cp-border-hair)',
      }}>
        <div>
          <div style={{ fontSize: 'var(--cp-fs-eyebrow)', letterSpacing: 'var(--cp-tracking-wider)', textTransform: 'uppercase', color: 'var(--cp-ink-3)' }}>Dagsljus</div>
          <div style={{
            fontFamily: 'var(--cp-font-serif)', fontWeight: 'var(--cp-fw-light)',
            fontSize: 'var(--cp-fs-h2)', color: 'var(--cp-ink)', lineHeight: 1, marginTop: 4,
          }}>{today.dayLength}</div>
        </div>
        <div style={{ fontSize: 'var(--cp-fs-meta)', color: 'var(--cp-accent)', fontWeight: 'var(--cp-fw-semi)' }}>
          {today.dayDelta}
        </div>
      </div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        marginTop: 18, paddingTop: 14, borderTop: 'var(--cp-border-hair)',
      }}>
        <svg width="34" height="34" viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="17" fill="none" stroke="var(--cp-ink)" strokeWidth="0.7"/>
          {/* The crescent shape is a function of moonLit; this is a generic waxing
              half. In production, compute the path from moonLit/phase. */}
          <path d="M20 3 A 17 17 0 0 1 20 37 A 8.5 17 0 0 0 20 3 Z" fill="var(--cp-ink)"/>
        </svg>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: 'var(--cp-ink)', fontWeight: 'var(--cp-fw-medium)' }}>{today.moonPhase}</div>
          <div style={{ fontSize: 11, color: 'var(--cp-ink-3)' }}>{today.moonLit} % belyst</div>
        </div>
      </div>
    </div>
  );
}

function SidebarPollen({ pollen, location }: { pollen: PollenReading[]; location: string }) {
  const labels = ['ingen', 'låg', 'måttlig', 'hög', 'mycket hög'];
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
        <SectionHeading>Pollen</SectionHeading>
        <span style={{ fontSize: 10, color: 'var(--cp-ink-3)', fontStyle: 'italic', fontFamily: 'var(--cp-font-serif)' }}>
          {location}
        </span>
      </div>
      {pollen.map((p, i) => (
        <div key={p.name} style={{
          display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'baseline', gap: 8,
          padding: '10px 0', borderTop: i === 0 ? 'none' : 'var(--cp-border-hair)',
        }}>
          <div>
            <div style={{ fontSize: 13, color: 'var(--cp-ink)', fontWeight: 'var(--cp-fw-medium)' }}>{p.name}</div>
            <div style={{ display: 'flex', gap: 2, marginTop: 5 }}>
              {[1, 2, 3, 4].map(i => (
                <div key={i} style={{
                  width: 24, height: 3,
                  background: i <= p.level ? 'var(--cp-ink)' : 'var(--cp-rule)',
                }}/>
              ))}
            </div>
          </div>
          <div style={{ fontSize: 'var(--cp-fs-meta)', color: 'var(--cp-ink-2)', fontFamily: 'var(--cp-font-serif)', fontStyle: 'italic' }}>
            {labels[p.level]}
          </div>
        </div>
      ))}
    </div>
  );
}

function SidebarBondepraktikan({ text }: { text: string }) {
  return (
    <div style={{
      padding: '24px 0',
      borderTop: 'var(--cp-border-strong)',
      borderBottom: 'var(--cp-border-hair)',
    }}>
      <SectionHeading accent>Bondepraktikan</SectionHeading>
      <p style={{
        fontFamily: 'var(--cp-font-serif)', fontWeight: 'var(--cp-fw-light)',
        fontStyle: 'italic', fontSize: 'var(--cp-fs-quote-side)',
        color: 'var(--cp-ink)', margin: '12px 0 0', lineHeight: 1.25,
        letterSpacing: '-0.005em',
      }}>
        "{text}"
      </p>
    </div>
  );
}

function SidebarDagensOrd({ ord }: { ord: { word: string; def: string } }) {
  return (
    <div>
      <SectionHeading>Dagens svenska ord</SectionHeading>
      <div style={{
        fontFamily: 'var(--cp-font-serif)', fontWeight: 'var(--cp-fw-light)',
        fontStyle: 'italic', fontSize: 'var(--cp-fs-display-m)',
        color: 'var(--cp-ink)', marginTop: 12, lineHeight: 1, letterSpacing: '-0.025em',
      }}>{ord.word}</div>
      <div style={{
        fontSize: 12, color: 'var(--cp-ink-2)', marginTop: 10,
        lineHeight: 1.55, fontFamily: 'var(--cp-font-serif)', fontStyle: 'italic',
      }}>{ord.def}</div>
    </div>
  );
}

function SidebarSeason({ label, dayOfYear }: { label: string; dayOfYear: number }) {
  const frac = dayOfYear / 365;
  return (
    <div>
      <SectionHeading>Säsong</SectionHeading>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 12 }}>
        <svg width="72" height="72" viewBox="0 0 72 72">
          <circle cx="36" cy="36" r="32" fill="none" stroke="var(--cp-rule)" strokeWidth="1"/>
          {(() => {
            const ang = frac * 2 * Math.PI - Math.PI / 2;
            const x = 36 + Math.cos(ang) * 32;
            const y = 36 + Math.sin(ang) * 32;
            const large = frac > 0.5 ? 1 : 0;
            return <path d={`M 36 4 A 32 32 0 ${large} 1 ${x} ${y}`} stroke="var(--cp-accent)" strokeWidth="2" fill="none"/>;
          })()}
          <circle cx="36" cy="36" r="2" fill="var(--cp-ink)"/>
        </svg>
        <div>
          <div style={{
            fontFamily: 'var(--cp-font-serif)', fontStyle: 'italic',
            fontSize: 'var(--cp-fs-italic-l)', color: 'var(--cp-ink)', lineHeight: 1,
          }}>{label}</div>
          <div style={{ fontSize: 11, color: 'var(--cp-ink-3)', marginTop: 6, lineHeight: 1.5 }}>
            Björk- och gräspollen.<br/>Näktergalen sjunger.
          </div>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div style={{
      borderTop: 'var(--cp-border-strong)',
      padding: '20px 0 28px',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Star size={12}/>
        <span style={{
          fontSize: 10, letterSpacing: 'var(--cp-tracking-wider)',
          textTransform: 'uppercase', color: 'var(--cp-ink-2)',
        }}>
          Cal·Pal &nbsp;·&nbsp; Stockholm &nbsp;·&nbsp; MMXXVI
        </span>
      </div>
      <span style={{
        fontSize: 10, letterSpacing: 'var(--cp-tracking-wider)',
        textTransform: 'uppercase', color: 'var(--cp-ink-3)',
      }}>
        "Hwarken hast eller hvila — endast tid."
      </span>
    </div>
  );
}
