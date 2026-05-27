// Cal·Pal — TypeScript types for the home page
// ────────────────────────────────────────────────────────────────────────────

export type Season = 'vinter' | 'var' | 'sommar' | 'host';
export type Density = 'compact' | 'regular' | 'comfy';
export type MastheadStyle = 'big' | 'compact' | 'none';

export interface DayCell {
  day: number;                          // 1–31
  month: 'prev' | 'current' | 'next';   // for opacity/dim
  name: string;                         // namnsdag — e.g. "Beda, Blenda"
  weekday: 0 | 1 | 2 | 3 | 4 | 5 | 6;   // 0=Mon, 6=Sun
  weekend: boolean;
  holiday?: string;                     // e.g. "Kristi himmelsfärd"
  klam?: boolean;                       // klämdag
  isToday?: boolean;
}

export interface PollenReading {
  name: string;                         // 'Björk', 'Gräs', 'Ek', 'Sälg och viden'
  level: 0 | 1 | 2 | 3 | 4;             // 0=ingen, 4=extrem
}

export interface TodayInfo {
  weekday: string;                      // 'Onsdag'
  date: number;                         // 27
  monthName: string;                    // 'maj'
  year: number;                         // 2026
  namnsdag: string[];                   // ['Beda', 'Blenda']
  week: number;                         // 22
  dayOfYear: number;                    // 147
  daysLeft: number;                     // 218
  sunrise: string;                      // '03:52'
  sunset: string;                       // '21:39'
  moonPhase: string;                    // 'Växande halvmåne'
  moonLit: number;                      // 0–100
  dayLength: string;                    // '17 tim 47 min' or '17:47'
  dayDelta: string;                     // '+3 min 00 s'
}

export interface MonthData {
  monthName: string;                    // 'maj'
  monthIndex: number;                   // 4 (zero-based)
  year: number;                         // 2026
  weeks: number[];                      // [18, 19, 20, 21, 22, 23]
  days: DayCell[];                      // 42 cells (6 weeks × 7 days)
}

export interface QuoteData {
  text: string;
  source: string;                       // 'Almanach utgifven av Vetenskaps-Akademien, 1855'
  highlightWords?: string[];            // words to italicize in accent color
}

export interface CalPalPageData {
  today: TodayInfo;
  month: MonthData;
  pollen: PollenReading[];
  pollenLocation: string;               // 'Stockholm'
  bondepraktikan: string;               // "Kall maj ger fyllda lador."
  dagensOrd: { word: string; def: string };
  quote: QuoteData;
  seasonLabel: string;                  // 'Blomstertid', 'Skördetid', etc.
  seasonPoem: string;                   // short description for the month
}

export interface CalPalSettings {
  season: Season;
  density: Density;
  masthead: MastheadStyle;
  showWeeks: boolean;
  showStats: boolean;
}
