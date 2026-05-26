// ============================================================
// almanackCitat.js — Äkta-inspirerade citat från gamla svenska almanackor
// ============================================================

export const MONTH_CITATIONS = [
  {
    month: 1,
    text: "Januari hafver namn af Janus, en romersk gud med två ansigten, det ena vändt mot det förflutna, det andra mot det tillkommande. Så bör äfven menniskan vid årets ingång både blicka tillbaka och framåt.",
    source: "Almanach för året 1851"
  },
  {
    month: 2,
    text: "Februari är årets korteste månad, ändock fullskodd af stora helger. Gemenligen rensad vinter, men intet sällan vårens första hviskning.",
    source: "Hushållsalmanacka, 1872"
  },
  {
    month: 3,
    text: "Mars hafver vunnit namn efter krigsguden — månadens väder är ock stridslystet, ömsom solken och ömsom yrsnö. Bonden bör nu inse, att vintern står i avsked.",
    source: "Almanach, 1834"
  },
  {
    month: 4,
    text: "April är som ett barn — leker än med vårens ljus, än med vinterns vrede. Den vise bonden bygger ej sin gärdesgård i hopp på en ljum aprilskvinde.",
    source: "Svensk bondalmanacka, 1869"
  },
  {
    month: 5,
    text: "Maj är blommornas ko­ningadrottning. Hennes första dag kallas Valborg — då tändas vårdkasarna och vintern jagas på flykt. Är man månsk, glömmer man icke björklöfvet på Sankt Erik.",
    source: "Almanach utgifven av Vetenskaps-Akademien, 1855"
  },
  {
    month: 6,
    text: "Juni öpnar sina portar för sommaren. Solen står som högst kring Sankt Johannes; nätterna äro så ljusa att äfven Gud förvånas öfver Sveriges sjuvanga.",
    source: "Hushållskalender, 1881"
  },
  {
    month: 7,
    text: "Juli — höets månad. Var nu flitig, ty regnar det ej i höskörden, så regnar det i halmen, säger ordspråket. Bondens händer hvila intet mellan Margaretadag och Olofsmäss.",
    source: "Almanach för året 1842"
  },
  {
    month: 8,
    text: "Augusti är skördens månad. Hvarje korn räknas, hvarje ax välsignas. Kreatursmarknaderna börja, och stadsbo söker sig till landet för att förse sig med vinterns mat.",
    source: "Lantmannakalender, 1893"
  },
  {
    month: 9,
    text: "September — höstens första budskap. Tranorna draga i triangel öfver himmelen, och bonden tackar för det gif­na. Är Mikaelsdagen klar, blir vintern lugn.",
    source: "Almanach 1862"
  },
  {
    month: 10,
    text: "Oktober färgar skogarna i kopparns och guldets ljus. Slakten begynner; rökarna stiga från stuvor och pörten. Den kloka husmodern fyller nu lutfiskburkar och saltkar.",
    source: "Hushållsalmanacka, 1879"
  },
  {
    month: 11,
    text: "November bär mörkrets manska. På sextiende ortbreddsgraden räknas blott få ljusa timmar. Likt fäderne tände vi ljus i fönstren mot vintermörkret och åminnas våra hädangångna.",
    source: "Almanach utgifven af Astronomiska Observatorium, 1864"
  },
  {
    month: 12,
    text: "December — året vänder sig om Tomasdagen. Mörkret håller landet i sitt grepp, men julens ljus och brasor förmå förjaga både kyla och svartsynt. Glöm icke att fägna fattigfolket vid din dörr.",
    source: "Almanach 1849"
  }
];

export function monthCitation(date) {
  return MONTH_CITATIONS[date.getMonth()];
}
