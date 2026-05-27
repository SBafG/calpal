// ============================================================
// wordOfDay.js — Dagens svenska ord (gammalsvenska / bortglömt)
// ============================================================

import { hashStr } from "./utils.js";

export const SWEDISH_WORDS = [
  {
    word: "kura skymning",
    def: "Att i tystnad sitta tillsammans och se kvällen mörkna — utan elektriskt ljus.",
    example: "På söndagskvällen kurar vi skymning vid det öppna fönstret och hör trastens kvällssång.",
    related: ["skymning", "kura", "stunden", "gryning"]
  },
  {
    word: "tjyvkika",
    def: "Att smygtitta, oftast i en bok eller på något man inte borde se.",
    example: "Lillebror försökte tjyvkika i julklappspaketen.",
    related: ["spana", "snoka", "pejla", "tjyvläsa"]
  },
  {
    word: "klabb",
    def: "En större bit kluven ved.",
    example: "Han kastade ett klabb björk i braskaminen.",
    related: ["vedklabb", "splint", "stubbe", "brasved"]
  },
  {
    word: "tvist",
    def: "Garn eller tråd. Även: bråk.",
    example: "Mormor satt med sitt tvistgarn och nystade.",
    related: ["garn", "tråd", "spinneri", "konflikt"]
  },
  {
    word: "lagom",
    def: "Det berömda svenska 'precis rätt' — varken för mycket eller för lite.",
    example: "Maten var precis lagom kryddad.",
    related: ["passligt", "tillräckligt", "balanserat", "moderat"]
  },
  {
    word: "snålblåst",
    def: "En vass, isande vind som tränger igenom kläderna.",
    example: "Mars-snålblåsten gjorde att även den varmaste tröjan kändes tunn.",
    related: ["blåst", "kåra", "ostan", "biting"]
  },
  {
    word: "jämställdsint",
    def: "Likgiltigt sinnelag, varken glad eller sur."
  },
  {
    word: "fika",
    def: "Kaffe (eller te) med tilltugg — en svensk institution.",
    example: "Vi tar en fika kring tio.",
    related: ["kaffepaus", "rast", "kaffekalas"]
  },
  {
    word: "kura",
    def: "Att sitta hopkrupen och tyst, ofta i mörker eller kyla.",
    example: "Katten kurade ihop sig på fönsterbrädet i solskenet.",
    related: ["krypa ihop", "huka", "trycka"]
  },
  {
    word: "duktig",
    def: "Skicklig. Tidigare också: dugande till hårt arbete.",
    example: "Hon är duktig på att laga gröt, sa mormor godkännande.",
    related: ["skicklig", "kompetent", "förtjänt"]
  },
  { word: "öma", def: "Att känna ömhet eller medkänsla." },
  { word: "harkrank", def: "En större mygga som dyker upp på sommaren. 'Pappa långben' i folkmun." },
  { word: "fjälster", def: "Tarmen som korv stoppas i." },
  { word: "knytkalas", def: "Fest där varje gäst tar med sig något — bidra till bordet." },
  { word: "mängelisar", def: "Snabbt skiftande vind på sjön (sjörobotterminologi)." },
  { word: "övermage", def: "Bortom mage — för djärvt eller fräckt." },
  { word: "fjåp", def: "En tafatt eller pinsam person; ngn som är 'tjafsig'." },
  { word: "påkommen", def: "Att bli upptäckt med något — fast i en olämplig handling." },
  { word: "härbärge", def: "Tillfälligt logi, vandrarhem. Från medeltiden." },
  { word: "barnsöl", def: "Festen vid ett barns dop — historisk svensk tradition." },
  { word: "gnabb", def: "Lättsamt bråk, kivande." },
  { word: "hyfs", def: "Gott uppförande, takt och ton." },
  { word: "jämmerdal", def: "Eländets dal — bibliskt uttryck för den jordiska tillvaron." },
  { word: "krets", def: "En grupp människor; även: kretslopp." },
  { word: "luren", def: "Telefonluren — eller 'i luren'." },
  { word: "morgontidig", def: "Som stiger upp tidigt; tidig på morgonen." },
  { word: "vådaeld", def: "Eldsvåda av misstag — gammalt försäkringsbegrepp." },
  { word: "lekamen", def: "Kropp — religiöst eller högtidligt språkbruk." },
  { word: "spjäll", def: "Lucka som reglerar luftdraget i en eldstad eller skorsten." },
  { word: "yrhätta", def: "En vild, energisk flicka — gammaldags benämning." },
  { word: "viker", def: "Liten avgränsad vik eller bukt; även: vikare (säl)." },
  { word: "bråta", def: "Hyggesrester — grenar och kvistar efter avverkning." },
  { word: "kämpe", def: "Krigare; även: föregångare, hjälte." },
  { word: "lopa", def: "Springa snabbt (om djur)." },
  { word: "rasthage", def: "Inhägnat område för rast och bete." },
  { word: "tussla", def: "Trassla, råka i oreda." },
  { word: "evighetsmaskin", def: "Något som aldrig stannar — perpetuum mobile." },
  { word: "skvaller", def: "Prat om andra — Sveriges mest älskade fritidssyssla." },
  { word: "ärtsoppa", def: "Torsdagslunchens symbol — gul, klassisk, med pannkaka." },
  { word: "spöksill", def: "Ett misslyckat företag — efter sillen som inte kommer." },
  { word: "torsk", def: "Fisken — eller 'gå på torsken' = att misslyckas." },
  { word: "rämna", def: "Spricka, ge vika." },
  { word: "smutsbarn", def: "Föräldralöst eller försummat barn — gammaldags." },
  { word: "spaning", def: "Att leta efter — modernt: söka efter brottslingar." },
  { word: "skogsmulle", def: "Mulle — Friluftsfrämjandets skogsfigur från 1957." },
  { word: "höstrusk", def: "Det typiska novemberregnet med vind." },
  { word: "vrång", def: "Tvärvigd, motsträvig." },
  { word: "kuse", def: "Tjock häst — även: trög, tröttsam person." },
  { word: "morgontup", def: "Litet morgonbad — vinterdopp." },
  { word: "skyldig", def: "Har en skuld — eller är ansvarig." },
  { word: "trolovning", def: "Förlovning — gammaldags eller juridisk term." },
  { word: "snopen", def: "Besviken, dum i mun — något man trott men inte fick." },
  { word: "fnatt", def: "Halvtokig — 'helt fnatt' = helt galen." },
  { word: "knöl", def: "Klumpig sak eller person; även: ojämnhet." },
  { word: "smussel", def: "Hemlighetsmakeri av lite tvivelaktig karaktär." },
  { word: "bråte", def: "Skräp, oordnade högar av saker." },
  { word: "förstugukvist", def: "Verandan; lilla farstun utanför ytterdörren." },
  { word: "lillgammal", def: "Om barn som beter sig som vuxna." },
  { word: "lytt", def: "Skadad eller bristfällig — gammaldags." },
  { word: "raljera", def: "Skämta lite syrligt eller ironiskt." },
  { word: "halvdager", def: "Skymning eller gryning — det dämpade ljuset." },
  { word: "stövelknekt", def: "Liten anordning för att dra av sig stövlar." },
  { word: "kvasse", def: "En slug, listig person." },
  { word: "djupryggad", def: "Med kraftig rygg; vanligt om bondhästar." },
  { word: "håva in", def: "Tjäna mycket pengar." },
  { word: "rospigg", def: "Person från Roslagen." },
  { word: "skojfrisk", def: "Glad, full av upptåg." },
  { word: "kollra bort", def: "Förlora kontroll, tappa fattningen." },
  { word: "tussa", def: "Hetsa, egga (om hund mot något)." },
  { word: "söndagsmål", def: "Den extra fina söndagsmiddagen." },
  { word: "klonk", def: "Hörbara ljudet av något tjockt som faller i vatten." },
  { word: "smatra", def: "Brakande regn mot fönsterruta." },
  { word: "skälva", def: "Darra av kyla eller rädsla." },
  { word: "sutta", def: "Ha suttit — talspråkligt." },
  { word: "trasselsudd", def: "En oreda, något helt rörigt." },
  { word: "Tvättomgång", def: "En batch tvätt — svensk vardag." },
  { word: "förfrusen", def: "Mycket kall, frusen genom." },
  { word: "skubba", def: "Skynda, springa iväg." }
];

export function wordForDate(date) {
  const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  const idx = hashStr(key) % SWEDISH_WORDS.length;
  return SWEDISH_WORDS[idx];
}
