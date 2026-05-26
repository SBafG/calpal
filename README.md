# CalPal

> Den svenska kalendern med själ.

CalPal är en visuell svensk almanacka som vill mer än vanliga kalendersajter — utöver det vanliga (helgdagar, namnsdagar, temadagar) samlar den astronomi, säsong, historia, kultur, tradition, kuriosa och personliga räknare på ett ställe.

Allt är ren HTML/CSS/JS utan beroenden eller backend. Push till GitHub, aktivera Pages, klar.

## Funktioner

### Grund
- Månadskalender med ISO-veckonummer (måndag som veckostart)
- Helgdagar (röda dagar) inkl. rörliga (påsk, midsommar, alla helgons dag)
- Svenska namnsdagar — alla 365 dagar
- Temadagar (kanelbullen, semla, Mors dag, Fars dag, Valborg…)
- Flaggdagar (officiella + kungafamiljens dagar)

### Hjärt-features
- **Dagsljus-barometer** — visualiserar dagens ljus och hur det förändras dag för dag (sekunder mot igår)
- **Säsongshjulet** — cirkulär årsvisualisering av svamp, bär, jakt, pollen, fågelflytt
- **Tidsmaskinen** — "På denna dag i historien" (svenska & världsliga händelser)
- **Bondepraktikan** — gamla svenska väderspomar per namnsdag/säsong
- **Klämdags-radar** — automatisk identifiering av klämdagar + semesterstrategier
- **Almanack-citat** — ett poetiskt citat per månad från svenska 1800-tals almanackor
- **Hjärtslagsräknare** — ange din födelsedag och se hjärtslag, dagar levt, nästa milstolpe
- **Dagens svenska ord** — bortglömda och gammalsvenska ord roterande per dag

### Övrigt innehåll
- Astronomi — månfas, soluppgång, solnedgång, dagsljus
- Mat & tradition — vad svenskar äter på datumet
- Kultur — Nobeldag, Eurovision, Vasaloppet
- Praktiskt — lönedag, klockomställning, deklaration

## Köra lokalt

Inga beroenden, ingen build. Bara öppna `index.html` i din webbläsare — eller serva mappen lokalt om din webbläsare blockerar ES-moduler från file://

```bash
# Med Python 3
python -m http.server 8000

# Eller med Node
npx serve .
```

## Deploya till GitHub Pages

1. Skapa ett nytt publikt repo på GitHub (t.ex. `calpal`).
2. Initiera och pusha:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<ditt-användarnamn>/calpal.git
   git push -u origin main
   ```
3. Gå till repo → **Settings → Pages**.
4. Under **Source**, välj `main` branch + `/ (root)`.
5. Spara. Inom någon minut är sidan tillgänglig på:
   ```
   https://<ditt-användarnamn>.github.io/calpal/
   ```

## Struktur

```
calpal/
├── index.html
├── README.md
├── css/
│   └── style.css
└── js/
    ├── main.js              — entry point
    ├── calendar.js          — månadsvy
    ├── dayDetail.js         — detaljvy för vald dag
    ├── modal.js             — räknar-/klämdag-/om-modaler
    │
    ├── astronomy.js         — månfas, sol
    ├── daylightBarometer.js — widget: dagsljus
    ├── seasonWheel.js       — widget: säsongshjul
    │
    ├── holidays.js          — helgdagar (påsk-algoritm)
    ├── namedays.js          — namnsdagar
    ├── themedays.js         — temadagar + beräknade
    ├── seasonal.js          — säsongsdata
    ├── history.js           — på denna dag
    ├── bondepraktikan.js    — väderspomar
    ├── food.js              — mat & tradition
    ├── culture.js           — kultur & nöje
    ├── practical.js         — lönedag, klockomställning
    ├── wordOfDay.js         — gammalsvenska ord
    ├── almanackCitat.js     — månadens citat
    ├── squeezeDays.js       — klämdags-detektor
    ├── counters.js          — räknare, hjärtslag
    └── utils.js             — datum-helpers, påsk-algoritm
```

## Tangentbord

| Tangent | Funktion |
|---|---|
| `←` | Föregående månad |
| `→` | Nästa månad |
| `T` | Hoppa till idag |
| `Esc` | Stäng dialog |

## Bygg vidare

Datafilerna är medvetet enkla JS-moduler så att de kan utökas direkt utan verktyg. Lägg till en historisk händelse i `js/history.js`, en väderspomar i `js/bondepraktikan.js`, eller ett bortglömt ord i `js/wordOfDay.js`.

## Licens

MIT — använd, ändra och dela fritt.

---

Byggd i Sverige, för svenskar och alla som älskar svenska almanackatraditioner.
