'use strict';

// =============================================
// FOOTBALL TEAMS
// =============================================
const FOOTBALL_TEAMS = [
  {
    id: 'red_eagles',
    name: 'Красные Орлы',
    shortName: 'КО',
    color: '#E53935',
    bgColor: '#FFEBEE',
    emoji: '🦅',
    attack: 88, defense: 82, midfield: 85,
    form: ['W','W','W','W','D'],
    winPct: 68, scored: 2.3, conceded: 0.9,
    players: [
      { name: 'А. Орлов',   pos: 'Нападающий',   shot: 92, speed: 88, dribble: 85, pass: 78 },
      { name: 'М. Крылов',  pos: 'Полузащитник',  shot: 75, speed: 82, dribble: 88, pass: 92 },
    ],
  },
  {
    id: 'blue_wolves',
    name: 'Синие Волки',
    shortName: 'СВ',
    color: '#1565C0',
    bgColor: '#E3F2FD',
    emoji: '🐺',
    attack: 85, defense: 80, midfield: 82,
    form: ['W','W','W','D','W'],
    winPct: 63, scored: 2.1, conceded: 1.0,
    players: [
      { name: 'Д. Волков',  pos: 'Нападающий',   shot: 90, speed: 85, dribble: 82, pass: 76 },
      { name: 'С. Лютый',   pos: 'Защитник',     shot: 60, speed: 78, dribble: 70, pass: 85 },
    ],
  },
  {
    id: 'steel_bulls',
    name: 'Стальные Быки',
    shortName: 'СБ',
    color: '#37474F',
    bgColor: '#ECEFF1',
    emoji: '🐂',
    attack: 80, defense: 78, midfield: 75,
    form: ['W','W','D','W','D'],
    winPct: 58, scored: 1.9, conceded: 1.1,
    players: [
      { name: 'К. Быков',   pos: 'Нападающий',   shot: 85, speed: 80, dribble: 78, pass: 72 },
      { name: 'Р. Сталин',  pos: 'Полузащитник',  shot: 72, speed: 75, dribble: 80, pass: 88 },
    ],
  },
  {
    id: 'green_panthers',
    name: 'Зелёные Пантеры',
    shortName: 'ЗП',
    color: '#2E7D32',
    bgColor: '#E8F5E9',
    emoji: '🐆',
    attack: 75, defense: 72, midfield: 70,
    form: ['W','D','D','W','L'],
    winPct: 52, scored: 1.7, conceded: 1.3,
    players: [
      { name: 'И. Пантеров', pos: 'Нападающий',  shot: 80, speed: 82, dribble: 85, pass: 70 },
      { name: 'Н. Зелёный',  pos: 'Полузащитник', shot: 68, speed: 78, dribble: 75, pass: 82 },
    ],
  },
  {
    id: 'golden_tigers',
    name: 'Золотые Тигры',
    shortName: 'ЗТ',
    color: '#F57F17',
    bgColor: '#FFF8E1',
    emoji: '🐯',
    attack: 73, defense: 70, midfield: 68,
    form: ['D','W','W','D','L'],
    winPct: 49, scored: 1.6, conceded: 1.4,
    players: [
      { name: 'В. Тигров',  pos: 'Нападающий',   shot: 78, speed: 80, dribble: 75, pass: 70 },
      { name: 'П. Золотов', pos: 'Вратарь',       shot: 55, speed: 72, dribble: 60, pass: 75 },
    ],
  },
  {
    id: 'ice_leopards',
    name: 'Ледяные Барсы',
    shortName: 'ЛБ',
    color: '#0277BD',
    bgColor: '#E1F5FE',
    emoji: '🐻‍❄️',
    attack: 70, defense: 75, midfield: 68,
    form: ['W','D','D','W','L'],
    winPct: 50, scored: 1.5, conceded: 1.3,
    players: [
      { name: 'А. Барсов',  pos: 'Защитник',     shot: 62, speed: 75, dribble: 68, pass: 80 },
      { name: 'М. Ледяной', pos: 'Нападающий',   shot: 75, speed: 78, dribble: 72, pass: 68 },
    ],
  },
  {
    id: 'black_bears',
    name: 'Чёрные Медведи',
    shortName: 'ЧМ',
    color: '#212121',
    bgColor: '#F5F5F5',
    emoji: '🐻',
    attack: 68, defense: 70, midfield: 65,
    form: ['D','L','L','W','D'],
    winPct: 44, scored: 1.4, conceded: 1.6,
    players: [
      { name: 'Д. Медведев', pos: 'Нападающий',  shot: 72, speed: 70, dribble: 68, pass: 65 },
      { name: 'С. Чёрный',   pos: 'Полузащитник', shot: 62, speed: 68, dribble: 70, pass: 75 },
    ],
  },
  {
    id: 'white_falcons',
    name: 'Белые Соколы',
    shortName: 'БС',
    color: '#546E7A',
    bgColor: '#F5F5F5',
    emoji: '🦅',
    attack: 65, defense: 68, midfield: 62,
    form: ['L','D','W','W','L'],
    winPct: 41, scored: 1.3, conceded: 1.7,
    players: [
      { name: 'К. Соколов', pos: 'Нападающий',   shot: 70, speed: 75, dribble: 72, pass: 65 },
      { name: 'Р. Белов',   pos: 'Защитник',     shot: 58, speed: 70, dribble: 62, pass: 75 },
    ],
  },
  {
    id: 'purple_dragons',
    name: 'Пурпурные Драконы',
    shortName: 'ПД',
    color: '#6A1B9A',
    bgColor: '#F3E5F5',
    emoji: '🐉',
    attack: 63, defense: 65, midfield: 60,
    form: ['D','L','W','D','L'],
    winPct: 38, scored: 1.2, conceded: 1.7,
    players: [
      { name: 'И. Дракин',    pos: 'Нападающий',  shot: 68, speed: 72, dribble: 70, pass: 62 },
      { name: 'В. Пурпуров',  pos: 'Полузащитник', shot: 60, speed: 68, dribble: 65, pass: 72 },
    ],
  },
  {
    id: 'yellow_foxes',
    name: 'Жёлтые Лисы',
    shortName: 'ЖЛ',
    color: '#F9A825',
    bgColor: '#FFF9C4',
    emoji: '🦊',
    attack: 60, defense: 58, midfield: 62,
    form: ['L','L','L','D','W'],
    winPct: 34, scored: 1.1, conceded: 1.9,
    players: [
      { name: 'А. Лисин',  pos: 'Нападающий',  shot: 65, speed: 70, dribble: 68, pass: 60 },
      { name: 'Н. Рыжков', pos: 'Полузащитник', shot: 58, speed: 65, dribble: 62, pass: 70 },
    ],
  },
  {
    id: 'fire_horses',
    name: 'Огненные Кони',
    shortName: 'ОК',
    color: '#BF360C',
    bgColor: '#FBE9E7',
    emoji: '🐎',
    attack: 58, defense: 55, midfield: 57,
    form: ['L','L','L','D','L'],
    winPct: 28, scored: 1.0, conceded: 2.1,
    players: [
      { name: 'М. Конев', pos: 'Нападающий', shot: 62, speed: 68, dribble: 65, pass: 58 },
      { name: 'Д. Огнёв', pos: 'Защитник',  shot: 52, speed: 62, dribble: 58, pass: 65 },
    ],
  },
  {
    id: 'grey_lynxes',
    name: 'Серые Рыси',
    shortName: 'СР',
    color: '#757575',
    bgColor: '#F5F5F5',
    emoji: '🐱',
    attack: 55, defense: 52, midfield: 54,
    form: ['L','L','L','D','L'],
    winPct: 24, scored: 0.9, conceded: 2.3,
    players: [
      { name: 'К. Рысин', pos: 'Нападающий', shot: 58, speed: 65, dribble: 62, pass: 55 },
      { name: 'С. Серов', pos: 'Вратарь',   shot: 48, speed: 58, dribble: 52, pass: 60 },
    ],
  },
];

// =============================================
// COMPUTE DERIVED TEAM STATS
// =============================================
(function computeTeamStats() {
  const formScore = (form) => {
    const pts = form.reduce((s, r) => s + (r === 'W' ? 3 : r === 'D' ? 1 : 0), 0);
    return Math.round(40 + (pts / 15) * 59);
  };
  FOOTBALL_TEAMS.forEach(t => {
    t.formScore = formScore(t.form);
    t.rating = Math.round(
      t.attack   * 0.35 +
      t.defense  * 0.30 +
      t.midfield * 0.20 +
      t.formScore* 0.15
    );
  });
})();

// =============================================
// FOOTBALL LEVELS (12 levels)
// =============================================
const FOOTBALL_LEVELS = [
  // --- EASY (diff 25+) ---
  { num: 1, teamA: 'red_eagles',    teamB: 'grey_lynxes',   events: 5, winThreshold: 4 },
  { num: 2, teamA: 'blue_wolves',   teamB: 'fire_horses',   events: 5, winThreshold: 4 },
  { num: 3, teamA: 'steel_bulls',   teamB: 'yellow_foxes',  events: 5, winThreshold: 4 },
  // --- MEDIUM (diff 10-20) ---
  { num: 4, teamA: 'red_eagles',    teamB: 'golden_tigers', events: 6, winThreshold: 6 },
  { num: 5, teamA: 'blue_wolves',   teamB: 'ice_leopards',  events: 6, winThreshold: 6 },
  { num: 6, teamA: 'steel_bulls',   teamB: 'black_bears',   events: 6, winThreshold: 6 },
  // --- HARD (diff 5-12) ---
  { num: 7, teamA: 'red_eagles',    teamB: 'steel_bulls',   events: 7, winThreshold: 6 },
  { num: 8, teamA: 'blue_wolves',   teamB: 'green_panthers',events: 7, winThreshold: 6 },
  { num: 9, teamA: 'green_panthers',teamB: 'ice_leopards',  events: 7, winThreshold: 6 },
  // --- EXPERT (diff 0-5) ---
  { num: 10, teamA: 'red_eagles',   teamB: 'blue_wolves',   events: 8, winThreshold: 8 },
  { num: 11, teamA: 'steel_bulls',  teamB: 'green_panthers',events: 8, winThreshold: 8 },
  { num: 12, teamA: 'golden_tigers',teamB: 'ice_leopards',  events: 8, winThreshold: 8 },
];

// =============================================
// SECTIONS CONFIG
// =============================================
const SECTIONS = {
  football: {
    id: 'football',
    name: T.sections.football,
    desc: T.sections.footballDesc,
    icon: '⚽',
    iconClass: 'football',
    teams: FOOTBALL_TEAMS,
    levels: FOOTBALL_LEVELS,
    unlockScore: 0,       // always unlocked
    unlockSection: null,
    maxScore: 120,        // 12 levels × 10 pts
  },
  hockey: {
    id: 'hockey',
    name: T.sections.hockey,
    desc: T.sections.hockeyDesc,
    icon: '🏒',
    iconClass: 'hockey',
    teams: [],
    levels: [],
    unlockScore: 80,
    unlockSection: 'football',
    maxScore: 120,
  },
  esports: {
    id: 'esports',
    name: T.sections.esports,
    desc: T.sections.esportsDesc,
    icon: '🎮',
    iconClass: 'esports',
    teams: [],
    levels: [],
    unlockScore: 80,
    unlockSection: 'hockey',
    maxScore: 120,
  },
};

// =============================================
// HELPERS
// =============================================
function getTeamById(section, id) {
  return SECTIONS[section].teams.find(t => t.id === id) || null;
}

function getLevelData(section, levelNum) {
  const lvl = SECTIONS[section].levels.find(l => l.num === levelNum);
  if (!lvl) return null;
  return {
    ...lvl,
    teamA: getTeamById(section, lvl.teamA),
    teamB: getTeamById(section, lvl.teamB),
  };
}
