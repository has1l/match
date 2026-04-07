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
// HOCKEY TEAMS
// =============================================
const HOCKEY_TEAMS = [
  {
    id: 'northern_storm',
    name: 'Северный Шторм',
    shortName: 'СШ',
    color: '#00ACC1',
    bgColor: '#E0F7FA',
    emoji: '🌨️',
    attack: 89, defense: 82, goalie: 86, tempo: 84,
    form: ['W','W','W','D','W'],
    winPct: 71, scored: 4.1, conceded: 2.3,
    players: [
      { name: 'И. Морозов',  pos: 'center',   shot: 92, speed: 85, handling: 88, pass: 84 },
      { name: 'Д. Полярный', pos: 'goalie',   shot: 44, speed: 68, handling: 72, pass: 70 },
    ],
  },
  {
    id: 'ice_dragons',
    name: 'Ледяные Драконы',
    shortName: 'ЛД',
    color: '#5E35B1',
    bgColor: '#EDE7F6',
    emoji: '🐉',
    attack: 86, defense: 81, goalie: 84, tempo: 82,
    form: ['W','W','D','W','W'],
    winPct: 68, scored: 3.8, conceded: 2.4,
    players: [
      { name: 'М. Драганов', pos: 'winger',   shot: 90, speed: 88, handling: 86, pass: 78 },
      { name: 'С. Щитов',   pos: 'defender', shot: 67, speed: 76, handling: 73, pass: 82 },
    ],
  },
  {
    id: 'steel_blades',
    name: 'Стальные Клинки',
    shortName: 'СК',
    color: '#455A64',
    bgColor: '#ECEFF1',
    emoji: '🗡️',
    attack: 82, defense: 84, goalie: 80, tempo: 76,
    form: ['W','D','W','W','D'],
    winPct: 61, scored: 3.3, conceded: 2.6,
    players: [
      { name: 'А. Клинков', pos: 'center',   shot: 86, speed: 80, handling: 82, pass: 79 },
      { name: 'Р. Гранит',  pos: 'defender', shot: 64, speed: 72, handling: 70, pass: 84 },
    ],
  },
  {
    id: 'polar_sharks',
    name: 'Полярные Акулы',
    shortName: 'ПА',
    color: '#0277BD',
    bgColor: '#E1F5FE',
    emoji: '🦈',
    attack: 80, defense: 78, goalie: 81, tempo: 85,
    form: ['W','D','W','L','W'],
    winPct: 58, scored: 3.5, conceded: 2.8,
    players: [
      { name: 'К. Ледов',  pos: 'winger', shot: 87, speed: 90, handling: 80, pass: 74 },
      { name: 'П. Барьер', pos: 'goalie', shot: 41, speed: 66, handling: 75, pass: 72 },
    ],
  },
  {
    id: 'arctic_bears',
    name: 'Арктические Медведи',
    shortName: 'АМ',
    color: '#2E7D32',
    bgColor: '#E8F5E9',
    emoji: '🐻‍❄️',
    attack: 77, defense: 80, goalie: 79, tempo: 73,
    form: ['D','W','W','D','L'],
    winPct: 54, scored: 3.0, conceded: 2.7,
    players: [
      { name: 'Т. Снежин', pos: 'defender', shot: 69, speed: 74, handling: 71, pass: 81 },
      { name: 'Е. Лавин',  pos: 'center',   shot: 83, speed: 79, handling: 78, pass: 77 },
    ],
  },
  {
    id: 'snow_owls',
    name: 'Снежные Совы',
    shortName: 'СС',
    color: '#546E7A',
    bgColor: '#F5F7FA',
    emoji: '🦉',
    attack: 73, defense: 75, goalie: 78, tempo: 72,
    form: ['W','L','D','W','L'],
    winPct: 49, scored: 2.8, conceded: 2.9,
    players: [
      { name: 'Л. Ночной', pos: 'winger', shot: 80, speed: 81, handling: 77, pass: 69 },
      { name: 'Н. Глухов', pos: 'goalie', shot: 38, speed: 65, handling: 78, pass: 71 },
    ],
  },
  {
    id: 'frost_foxes',
    name: 'Морозные Лисы',
    shortName: 'МЛ',
    color: '#FB8C00',
    bgColor: '#FFF3E0',
    emoji: '🦊',
    attack: 71, defense: 69, goalie: 72, tempo: 79,
    form: ['D','L','W','D','L'],
    winPct: 44, scored: 2.6, conceded: 3.1,
    players: [
      { name: 'Ф. Рыжов',  pos: 'winger',   shot: 78, speed: 86, handling: 74, pass: 68 },
      { name: 'О. Бортов', pos: 'defender', shot: 61, speed: 70, handling: 69, pass: 76 },
    ],
  },
  {
    id: 'glacier_wolves',
    name: 'Ледниковые Волки',
    shortName: 'ЛВ',
    color: '#263238',
    bgColor: '#ECEFF1',
    emoji: '🐺',
    attack: 67, defense: 71, goalie: 70, tempo: 68,
    form: ['L','D','L','W','L'],
    winPct: 38, scored: 2.4, conceded: 3.3,
    players: [
      { name: 'В. Холодов', pos: 'center',   shot: 75, speed: 74, handling: 70, pass: 72 },
      { name: 'Г. Рубеж',   pos: 'defender', shot: 58, speed: 68, handling: 66, pass: 74 },
    ],
  },
  {
    id: 'aurora_wings',
    name: 'Аврора Уингз',
    shortName: 'АУ',
    color: '#8E24AA',
    bgColor: '#F3E5F5',
    emoji: '✨',
    attack: 65, defense: 66, goalie: 68, tempo: 74,
    form: ['L','L','D','W','D'],
    winPct: 35, scored: 2.3, conceded: 3.4,
    players: [
      { name: 'Я. Сиянов', pos: 'winger', shot: 73, speed: 82, handling: 76, pass: 67 },
      { name: 'П. Купол',  pos: 'goalie', shot: 36, speed: 64, handling: 74, pass: 69 },
    ],
  },
  {
    id: 'white_comets',
    name: 'Белые Кометы',
    shortName: 'БК',
    color: '#90A4AE',
    bgColor: '#FAFAFA',
    emoji: '☄️',
    attack: 62, defense: 64, goalie: 67, tempo: 70,
    form: ['L','L','D','L','W'],
    winPct: 31, scored: 2.1, conceded: 3.5,
    players: [
      { name: 'С. Орбитин', pos: 'center',   shot: 70, speed: 73, handling: 71, pass: 70 },
      { name: 'Д. Блокин',  pos: 'defender', shot: 56, speed: 67, handling: 64, pass: 73 },
    ],
  },
  {
    id: 'storm_ravens',
    name: 'Штормовые Вороны',
    shortName: 'ШВ',
    color: '#3949AB',
    bgColor: '#E8EAF6',
    emoji: '🪶',
    attack: 60, defense: 62, goalie: 65, tempo: 69,
    form: ['L','D','L','L','D'],
    winPct: 28, scored: 2.0, conceded: 3.6,
    players: [
      { name: 'Г. Крылов', pos: 'winger', shot: 69, speed: 77, handling: 68, pass: 66 },
      { name: 'И. Линия',  pos: 'goalie', shot: 35, speed: 63, handling: 73, pass: 68 },
    ],
  },
  {
    id: 'ice_guard',
    name: 'Ледяная Гвардия',
    shortName: 'ЛГ',
    color: '#00897B',
    bgColor: '#E0F2F1',
    emoji: '🛡️',
    attack: 57, defense: 60, goalie: 63, tempo: 66,
    form: ['L','L','L','D','L'],
    winPct: 24, scored: 1.8, conceded: 3.8,
    players: [
      { name: 'Б. Щитников',  pos: 'defender', shot: 54, speed: 66, handling: 62, pass: 71 },
      { name: 'М. Перчаткин', pos: 'goalie',   shot: 34, speed: 61, handling: 72, pass: 67 },
    ],
  },
];

// =============================================
// HOCKEY LEVELS (12 levels)
// =============================================
const HOCKEY_LEVELS = [
  { num: 1,  teamA: 'northern_storm', teamB: 'ice_guard',      events: 5, winThreshold: 4 },
  { num: 2,  teamA: 'ice_dragons',    teamB: 'storm_ravens',   events: 5, winThreshold: 4 },
  { num: 3,  teamA: 'steel_blades',   teamB: 'white_comets',   events: 5, winThreshold: 4 },
  { num: 4,  teamA: 'polar_sharks',   teamB: 'aurora_wings',   events: 6, winThreshold: 6 },
  { num: 5,  teamA: 'arctic_bears',   teamB: 'frost_foxes',    events: 6, winThreshold: 6 },
  { num: 6,  teamA: 'snow_owls',      teamB: 'glacier_wolves', events: 6, winThreshold: 6 },
  { num: 7,  teamA: 'northern_storm', teamB: 'snow_owls',      events: 7, winThreshold: 6 },
  { num: 8,  teamA: 'ice_dragons',    teamB: 'arctic_bears',   events: 7, winThreshold: 6 },
  { num: 9,  teamA: 'steel_blades',   teamB: 'polar_sharks',   events: 7, winThreshold: 6 },
  { num: 10, teamA: 'northern_storm', teamB: 'steel_blades',   events: 8, winThreshold: 8 },
  { num: 11, teamA: 'ice_dragons',    teamB: 'polar_sharks',   events: 8, winThreshold: 8 },
  { num: 12, teamA: 'arctic_bears',   teamB: 'snow_owls',      events: 8, winThreshold: 8 },
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
  HOCKEY_TEAMS.forEach(t => {
    t.formScore = formScore(t.form);
    t.rating = Math.round(
      t.attack    * 0.32 +
      t.defense   * 0.24 +
      t.goalie    * 0.22 +
      t.tempo     * 0.12 +
      t.formScore * 0.10
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
    teams: HOCKEY_TEAMS,
    levels: HOCKEY_LEVELS,
    unlockScore: 0,
    unlockSection: null,
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
