// ============================================================
// seasonal.js — Svenska säsonger (svamp, bär, jakt, pollen, fågel)
// Datum är ungefärliga och baserade på normalår i mellansverige.
// ============================================================

// Varje post: { id, name, category, start: [m,d], end: [m,d], info }
export const SEASONS = [
  // SVAMP
  { id: "kantarell", name: "Kantarell", category: "svamp", start: [6,15], end: [9,30],
    info: "Sveriges populäraste skogssvamp. Söks i barrskog och blandskog." },
  { id: "trattkantarell", name: "Trattkantarell", category: "svamp", start: [8,15], end: [10,31],
    info: "Sen säsong, växer i kalla mossar och granskog." },
  { id: "karljohan", name: "Karl Johan", category: "svamp", start: [7,15], end: [10,15],
    info: "Stensoppens kung — kallad så efter Carl XIV Johan som älskade den." },
  { id: "smorsopp", name: "Smörsopp", category: "svamp", start: [6,20], end: [10,10],
    info: "Lätt att känna igen på sin gula 'smörhatt'." },

  // BÄR
  { id: "smultron", name: "Smultron", category: "bär", start: [6,15], end: [7,31],
    info: "Det första sommarbäret — växer i hagar och vägkanter." },
  { id: "hallon", name: "Skogshallon", category: "bär", start: [7,1], end: [8,15],
    info: "Söks i hyggen och solbelysta gläntor." },
  { id: "blabar", name: "Blåbär", category: "bär", start: [7,15], end: [9,15],
    info: "Sveriges nationella skogsbär. I norr senare än söder." },
  { id: "lingon", name: "Lingon", category: "bär", start: [8,15], end: [10,15],
    info: "Tål frost — skördas ofta efter första nattfrosten." },
  { id: "hjortron", name: "Hjortron", category: "bär", start: [7,15], end: [8,15],
    info: "'Norrlands guld' — växer i myrar och kärr." },

  // JAKT
  { id: "algjakt-syd", name: "Älgjakt (södra Sverige)", category: "jakt", start: [10,8], end: [10,31],
    info: "Andra måndagen i oktober + framåt. Datum varierar per län." },
  { id: "algjakt-norr", name: "Älgjakt (norra Sverige)", category: "jakt", start: [9,1], end: [9,30],
    info: "Första måndagen i september. Norrland." },
  { id: "harjakt", name: "Harjakt", category: "jakt", start: [9,1], end: [2,28],
    info: "Lång säsong från september till sista februari." },

  // POLLEN
  { id: "hassel", name: "Hassel & al-pollen", category: "pollen", start: [2,15], end: [4,10],
    info: "Första vårpollenet — kan börja redan i februari milda år." },
  { id: "bjork", name: "Björkpollen", category: "pollen", start: [4,15], end: [5,31],
    info: "Sveriges vanligaste allergikällan." },
  { id: "gras", name: "Gräspollen", category: "pollen", start: [5,15], end: [7,31],
    info: "Toppar runt midsommar." },
  { id: "grabo", name: "Gråbopollen", category: "pollen", start: [7,15], end: [9,15],
    info: "Sensommarens allergiplåga." },

  // FÅGEL
  { id: "tranor-ank", name: "Tranornas ankomst", category: "fågel", start: [3,15], end: [4,15],
    info: "Tranorna återvänder söderifrån — Hornborgasjön är klassiska tittarplatsen." },
  { id: "storkar-ank", name: "Storkarnas ankomst", category: "fågel", start: [3,25], end: [4,30],
    info: "Vita storkar återvänder till sina bon i Skåne." },
  { id: "svalor-ank", name: "Svalornas ankomst", category: "fågel", start: [4,15], end: [5,15],
    info: "'En svala gör ingen sommar', men man väntar gärna." },
  { id: "tranor-bort", name: "Tranornas avfärd", category: "fågel", start: [9,15], end: [10,15],
    info: "Höstens stora dragstreck — tusentals mellanlandar i Hornborgasjön." },
  { id: "svalor-bort", name: "Svalornas avfärd", category: "fågel", start: [8,15], end: [9,30],
    info: "Tar hösten med sig — flyger ända till södra Afrika." }
];

const CAT_COLORS = {
  svamp:  "#b0651f",   // kanelbrun (skogsbotten)
  bär:    "#a83248",   // bärrött
  jakt:   "#3d6b3a",   // skogsgrön (tydligt skilt från svampbrun)
  pollen: "#e0a830",   // varm gulguld
  fågel:  "#2f7d8e"    // teal-blå (kallt, klart skilt från resten)
};

export function categoryColor(cat) { return CAT_COLORS[cat] || "#475569"; }

function dateToDayOfYear(m, d) {
  return new Date(2024, m - 1, d).getTime() / 86400000 - new Date(2024,0,1).getTime() / 86400000;
}

export function seasonsActive(date) {
  const doy = (date - new Date(date.getFullYear(),0,1)) / 86400000;
  return SEASONS.filter(s => {
    const start = dateToDayOfYear(s.start[0], s.start[1]);
    const end = dateToDayOfYear(s.end[0], s.end[1]);
    if (start <= end) return doy >= start && doy <= end;
    // Spänner över årsskifte (harjakt)
    return doy >= start || doy <= end;
  });
}
