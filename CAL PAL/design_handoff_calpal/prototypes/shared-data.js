// Cal·Pal — shared data for all variations
// All content reflects the user's existing site (calpal.ekeron.com).

window.CalPal = (function () {
  const NAMEDAYS_MAY = [
    'Valborg', 'Filip, Filippa', 'John, Jack', 'Monika, Mona', 'Gotthard, Erhard',
    'Marit, Rita', 'Carina, Carita', 'Åke', 'Reidar, Reidun', 'Esbjörn, Styrbjörn',
    'Märta, Märit', 'Charlotta, Lotta', 'Linnea, Linn', 'Halvard, Halvar', 'Sofia, Sonja',
    'Ronald, Ronny', 'Rebecka, Ruben', 'Erik', 'Maj, Majken', 'Karolina, Carola',
    'Konstantin, Conny', 'Hemming, Henning', 'Desideria, Desirée', 'Ivan, Vanja', 'Urban',
    'Vilhelmina, Vilma', 'Beda, Blenda', 'Ingeborg, Borghild', 'Yvonne, Jeanette', 'Vera, Veronika',
    'Petronella, Pernilla'
  ];

  const buildMay2026 = () => {
    const days = [];
    [27, 28, 29, 30].forEach((d, i) => days.push({
      day: d, month: 'prev', name: ['Engelbrekt', 'Ture, Tyra', 'Tyko', 'Mariana'][i],
    }));
    for (let d = 1; d <= 31; d++) days.push({ day: d, month: 'may', name: NAMEDAYS_MAY[d - 1] });
    ['Gun, Gunnel', 'Rutger, Roger', 'Ingemar, Gudmar', 'Solbritt, Solveig', 'Bo', 'Gustav, Gösta', 'Robert, Robin']
      .forEach((n, i) => days.push({ day: i + 1, month: 'next', name: n }));
    days.forEach((d, i) => { d.weekday = i % 7; d.weekend = d.weekday >= 5; });
    const may = (d) => days.find(x => x.month === 'may' && x.day === d);
    may(1).holiday = 'Valborg / Första maj';
    may(1).dots = 3;
    may(14).holiday = 'Kristi himmelsfärd';
    may(15).klam = true;
    may(24).holiday = 'Pingstdagen';
    may(6).klam = true;
    return days;
  };

  const WEEKS = [18, 19, 20, 21, 22, 23];

  const SEASONS = {
    vinter: { sv: 'Vinter', poem: 'Sankt Knut visar julen ut.' },
    var:    { sv: 'Vår',    poem: 'När göken gal i grön skog blir sommaren fager.' },
    sommar: { sv: 'Sommar', poem: 'Solens vagn rullar lågt över Norden.' },
    host:   { sv: 'Höst',   poem: 'Mikaeli vänder bladen — och hjärtat med.' },
  };

  const POLLEN = [
    { name: 'Björk',          level: 4 },
    { name: 'Gräs',           level: 3 },
    { name: 'Ek',             level: 2 },
    { name: 'Sälg och viden', level: 1 },
  ];

  const SASONG = [
    { label: 'Svamp',  value: 4,  color: '#b94e30' },
    { label: 'Bär',    value: 7,  color: '#7a2a2a' },
    { label: 'Jakt',   value: 18, color: '#3a4a2a' },
    { label: 'Pollen', value: 92, color: '#c9a83a' },
    { label: 'Fågel',  value: 25, color: '#3a6a8a' },
  ];

  const QUOTE_MAY = {
    text: 'Maj är blommornas koningadrottning. Hennes första dag kallas Valborg — då tändas vårdkasarna och vintern jagas på flykt. Är man månsk, glömmer man icke björklöfvet på Sankt Erik.',
    source: 'Almanach utgifven av Vetenskaps-Akademien, 1855',
  };

  const BONDEPRAKTIKAN = {
    5: 'Kall maj ger fyllda lador.',
    1: 'Tjock dimma i januari — våt sommar.',
    4: 'Aprilväder vill ej tro sig själv.',
    7: 'Regnar det på Sankt Olof, regnar det i fjorton dygn.',
    10: 'Sankt Mikael drar fåglarna söderut.',
  };

  const DAGENS_ORD = { word: 'duktig', def: 'Skicklig. Tidigare också: dugande till hårt arbete.' };

  const TODAY = {
    weekday: 'Onsdag', date: 27, monthName: 'maj', year: 2026,
    namnsdag: ['Beda', 'Blenda'],
    week: 22, dayOfYear: 147, daysLeft: 218,
    sunrise: '03:52', sunset: '21:39',
    moonPhase: 'Växande halvmåne', moonLit: 87,
    dayLength: '17 tim 47 min', dayDelta: '+3 min 00 s',
  };

  return { days: buildMay2026(), WEEKS, SEASONS, POLLEN, SASONG, QUOTE_MAY, BONDEPRAKTIKAN, DAGENS_ORD, TODAY, NAMEDAYS_MAY };
})();
