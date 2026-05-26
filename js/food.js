// ============================================================
// food.js — Mat & tradition på datumet
// ============================================================

import { easterSunday, addDays, ymd, mmdd } from "./utils.js";

const FIXED_FOOD = {
  "01-13": { dish: "Knäckebröd & ostkaka", desc: "Knutsfesten — sista resten av julmaten." },
  "02-02": { dish: "Smörgåstårta", desc: "Kyndelsmäss — ljus mat för Marias renselsedag." },
  "03-04": { dish: "Kanelbulle (vårens premiär)", desc: "Mars-bullen — Hembakningsrådets nya kompletterande datum." },
  "03-25": { dish: "Våffla", desc: "Vårfrudagen → våffeldagen. Etymologisk lek: 'Vårfrudagen' → 'Våffeldagen'." },
  "04-30": { dish: "Sill & potatis, Valborg-tårta", desc: "Valborgssup, vårsill och nyskurna gräslök." },
  "05-29": { dish: "Strömming", desc: "Vårströmming börjar fångas — Stockholms skärgård." },
  "06-23": { dish: "Sill, färskpotatis, jordgubbar", desc: "Klassisk midsommarmeny: 9 sorters sill + dill + snaps." },
  "06-24": { dish: "Midsommarsill & jordgubbstårta", desc: "Färskpotatis med dill, gräddfil, gräslök. Snaps till silen." },
  "08-08": { dish: "Kräftor", desc: "Kräftpremiären — kräftskivor med snaps och små hattar." },
  "08-21": { dish: "Surströmming", desc: "Tredje torsdagen i augusti enligt 1700-tals förordning." },
  "10-04": { dish: "Kanelbulle", desc: "Kanelbullens dag — instiftad 1999 av Hembakningsrådet." },
  "11-06": { dish: "Gustav Adolfsbakelse", desc: "Konditorbakelse med chokladprofil av kungen — sedan 1854 i Göteborg." },
  "11-10": { dish: "Mårtensgås", desc: "Förberedelse — gåsen slaktas inför Mårten på 11 nov." },
  "11-11": { dish: "Stekt gås, svartsoppa, äppelkaka", desc: "Skånsk Mårtensafton — svartsoppa på blod, gås med rödkål." },
  "12-04": { dish: "Glögg", desc: "Adventsglögg-säsongen pågår — mandel, russin, kanel, kardemumma." },
  "12-13": { dish: "Lussekatter & pepparkakor", desc: "Saffran och lussebullar. Glögg med mandel & russin." },
  "12-23": { dish: "Skinka, Janssons frestelse", desc: "Skinkkokningens kväll — doppa i grytan." },
  "12-24": { dish: "Julbord", desc: "Skinka, sill, köttbullar, prinskorv, lutfisk, Jansson, ris à la Malta." },
  "12-25": { dish: "Resterna", desc: "Julafton fortsätter — kall skinka och pickles." },
  "12-31": { dish: "Champagne & semmelmat", desc: "Hummer, varma havet, kalvfilé eller fondue — fest." }
};

export function foodForDate(date) {
  const m = mmdd(date);
  if (FIXED_FOOD[m]) return FIXED_FOOD[m];

  // Beräknade — fettisdagen (semla), påsklunch
  const easter = easterSunday(date.getFullYear());
  if (sameYmd(date, addDays(easter, -47))) {
    return { dish: "Semla", desc: "Fettisdagen — kardemumma, mandelmassa, vispgrädde. Sopsemlan kommer från Adolf Fredriks dödsdag 1771." };
  }
  if (sameYmd(date, easter)) {
    return { dish: "Påsklamm & ägg", desc: "Påskdagen — lamm, sill, ägg, gravlax. Påsklunchen i sin moderna form från 1900-talet." };
  }
  if (sameYmd(date, addDays(easter, -2))) {
    return { dish: "Långfredagens fisk", desc: "Trad. fasta — kokt fisk, ofta torsk eller spätta." };
  }

  return null;
}

function sameYmd(a, b) { return ymd(a) === ymd(b); }
