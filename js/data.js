'use strict';

// =============================================
// FOOTBALL TEAMS
// =============================================
const FOOTBALL_TEAMS = [
  // === TIER 1 — Элита ===
  {
    id: 'real_madrid', name: 'Реал Мадрид', shortName: 'РМА',
    color: '#FEBE10', bgColor: '#FFF8E1', emoji: '👑',
    attack: 92, defense: 88, midfield: 90,
    form: ['W','W','W','W','D'], winPct: 78, scored: 2.6, conceded: 0.7,
    players: [
      { id:'courtois',    name:'Т. Куртуа',      posCode:'GK', pos:'Вратарь',      num:1,  shot:48, speed:62, dribble:58, pass:88, key:true },
      { id:'carvajal',    name:'Д. Карвахаль',   posCode:'RB', pos:'Защитник',     num:2,  shot:72, speed:82, dribble:76, pass:80 },
      { id:'militao',     name:'Е. Милитао',     posCode:'CB', pos:'Защитник',     num:3,  shot:60, speed:78, dribble:68, pass:75 },
      { id:'rudiger',     name:'А. Рюдигер',     posCode:'CB', pos:'Защитник',     num:22, shot:62, speed:75, dribble:65, pass:72 },
      { id:'mendy_r',     name:'Ф. Мендис',      posCode:'LB', pos:'Защитник',     num:23, shot:65, speed:84, dribble:74, pass:78 },
      { id:'tchouameni',  name:'А. Чуамени',     posCode:'DM', pos:'Полузащитник', num:18, shot:70, speed:78, dribble:76, pass:82 },
      { id:'modric',      name:'Л. Модрич',      posCode:'CM', pos:'Полузащитник', num:10, shot:76, speed:74, dribble:88, pass:92 },
      { id:'bellingham',  name:'Дж. Беллингем',  posCode:'AM', pos:'Полузащитник', num:5,  shot:86, speed:82, dribble:88, pass:90, key:true },
      { id:'rodrygo',     name:'Р. Родриго',     posCode:'RW', pos:'Нападающий',   num:11, shot:84, speed:90, dribble:90, pass:82 },
      { id:'mbappe',      name:'К. Мбаппе',      posCode:'ST', pos:'Нападающий',   num:9,  shot:94, speed:97, dribble:92, pass:80, key:true },
      { id:'vinicius',    name:'Виниций',         posCode:'LW', pos:'Нападающий',   num:7,  shot:86, speed:95, dribble:94, pass:78 },
      { id:'valverde',    name:'Ф. Валверде',    posCode:'CM', pos:'Полузащитник', num:15, shot:80, speed:86, dribble:82, pass:84 },
      { id:'camavinga',   name:'Э. Камавинга',   posCode:'CM', pos:'Полузащитник', num:12, shot:72, speed:84, dribble:84, pass:80 },
      { id:'lunin',       name:'А. Лунин',       posCode:'GK', pos:'Вратарь',      num:13, shot:42, speed:58, dribble:50, pass:80 },
    ],
  },
  {
    id: 'man_city', name: 'Манчестер Сити', shortName: 'МСИ',
    color: '#6CABDD', bgColor: '#E3F2FD', emoji: '🦅',
    attack: 90, defense: 87, midfield: 92,
    form: ['W','W','D','W','W'], winPct: 75, scored: 2.5, conceded: 0.8,
    players: [
      { id:'ederson',     name:'Эдерсон',         posCode:'GK', pos:'Вратарь',      num:31, shot:46, speed:64, dribble:60, pass:90, key:true },
      { id:'walker',      name:'К. Уокер',         posCode:'RB', pos:'Защитник',     num:2,  shot:68, speed:88, dribble:72, pass:76 },
      { id:'akanji',      name:'М. Аканджи',       posCode:'CB', pos:'Защитник',     num:25, shot:60, speed:76, dribble:66, pass:74 },
      { id:'dias',        name:'Р. Диаш',          posCode:'CB', pos:'Защитник',     num:3,  shot:62, speed:76, dribble:68, pass:76 },
      { id:'gvardiol',    name:'И. Гвардиол',      posCode:'LB', pos:'Защитник',     num:24, shot:68, speed:82, dribble:74, pass:78 },
      { id:'kovacic_mc',  name:'М. Ковачич',       posCode:'DM', pos:'Полузащитник', num:8,  shot:74, speed:78, dribble:84, pass:86 },
      { id:'de_bruyne',   name:'К. Де Брёйне',    posCode:'CM', pos:'Полузащитник', num:17, shot:88, speed:76, dribble:86, pass:96, key:true },
      { id:'foden',       name:'Ф. Фоден',         posCode:'AM', pos:'Полузащитник', num:47, shot:86, speed:86, dribble:90, pass:88 },
      { id:'bernardo',    name:'Б. Силва',         posCode:'RW', pos:'Нападающий',   num:20, shot:80, speed:80, dribble:88, pass:86 },
      { id:'haaland',     name:'Э. Холанд',        posCode:'ST', pos:'Нападающий',   num:9,  shot:95, speed:89, dribble:80, pass:72, key:true },
      { id:'doku',        name:'Дж. Докку',        posCode:'LW', pos:'Нападающий',   num:11, shot:78, speed:96, dribble:90, pass:74 },
      { id:'grealish',    name:'Дж. Грилиш',      posCode:'LW', pos:'Нападающий',   num:10, shot:78, speed:80, dribble:88, pass:80 },
      { id:'nunez_mc',    name:'М. Нуньес',        posCode:'ST', pos:'Нападающий',   num:7,  shot:82, speed:90, dribble:80, pass:72 },
      { id:'ortega',      name:'С. Ортега',        posCode:'GK', pos:'Вратарь',      num:18, shot:40, speed:55, dribble:48, pass:76 },
    ],
  },
  {
    id: 'bayern', name: 'Бавария', shortName: 'БАВ',
    color: '#DC052D', bgColor: '#FFEBEE', emoji: '🔴',
    attack: 89, defense: 86, midfield: 88,
    form: ['W','W','W','D','W'], winPct: 73, scored: 2.8, conceded: 0.9,
    players: [
      { id:'neuer',       name:'М. Нойер',        posCode:'GK', pos:'Вратарь',      num:1,  shot:50, speed:65, dribble:60, pass:86, key:true },
      { id:'mazraoui',    name:'Н. Мазрауи',      posCode:'RB', pos:'Защитник',     num:40, shot:68, speed:82, dribble:76, pass:78 },
      { id:'kim_mj',      name:'Ким Мин-чжэ',     posCode:'CB', pos:'Защитник',     num:3,  shot:60, speed:78, dribble:68, pass:76 },
      { id:'upamecano',   name:'Д. Упамекано',    posCode:'CB', pos:'Защитник',     num:5,  shot:62, speed:80, dribble:70, pass:74 },
      { id:'davies',      name:'А. Дэвис',         posCode:'LB', pos:'Защитник',     num:19, shot:70, speed:92, dribble:80, pass:78 },
      { id:'laimer',      name:'К. Лаймер',        posCode:'DM', pos:'Полузащитник', num:27, shot:72, speed:84, dribble:78, pass:80 },
      { id:'goretzka',    name:'Л. Горецка',       posCode:'CM', pos:'Полузащитник', num:8,  shot:80, speed:80, dribble:80, pass:84 },
      { id:'musiala',     name:'Дж. Мусиала',     posCode:'AM', pos:'Полузащитник', num:42, shot:82, speed:85, dribble:92, pass:88, key:true },
      { id:'olise',       name:'М. Олисе',         posCode:'RW', pos:'Нападающий',   num:39, shot:84, speed:86, dribble:90, pass:82 },
      { id:'kane',        name:'Х. Кейн',          posCode:'ST', pos:'Нападающий',   num:9,  shot:94, speed:80, dribble:82, pass:86, key:true },
      { id:'gnabry',      name:'С. Гнабри',        posCode:'LW', pos:'Нападающий',   num:7,  shot:82, speed:88, dribble:86, pass:78 },
      { id:'sane',        name:'Л. Санэ',          posCode:'RW', pos:'Нападающий',   num:10, shot:84, speed:90, dribble:88, pass:80 },
      { id:'koman',       name:'К. Коман',         posCode:'LW', pos:'Нападающий',   num:11, shot:80, speed:92, dribble:88, pass:78 },
      { id:'peretz',      name:'Д. Перец',         posCode:'GK', pos:'Вратарь',      num:26, shot:38, speed:55, dribble:46, pass:74 },
    ],
  },
  {
    id: 'barcelona', name: 'Барселона', shortName: 'БАР',
    color: '#A50044', bgColor: '#FCE4EC', emoji: '🔵🔴',
    attack: 90, defense: 84, midfield: 89,
    form: ['W','W','W','W','L'], winPct: 72, scored: 2.4, conceded: 0.9,
    players: [
      { id:'pena',        name:'И. Пенья',         posCode:'GK', pos:'Вратарь',      num:13, shot:42, speed:58, dribble:54, pass:82, key:true },
      { id:'kounde',      name:'Ж. Кунде',         posCode:'RB', pos:'Защитник',     num:23, shot:66, speed:84, dribble:76, pass:78 },
      { id:'araujo',      name:'Р. Арауху',        posCode:'CB', pos:'Защитник',     num:4,  shot:62, speed:80, dribble:70, pass:74 },
      { id:'i_martinez',  name:'И. Мартинес',      posCode:'CB', pos:'Защитник',     num:5,  shot:60, speed:74, dribble:66, pass:72 },
      { id:'balde',       name:'А. Бальде',         posCode:'LB', pos:'Защитник',     num:31, shot:66, speed:86, dribble:78, pass:76 },
      { id:'fde_jong',    name:'Ф. Де Йонг',       posCode:'DM', pos:'Полузащитник', num:21, shot:74, speed:78, dribble:86, pass:88 },
      { id:'pedri',       name:'Педри',             posCode:'CM', pos:'Полузащитник', num:8,  shot:76, speed:80, dribble:90, pass:93, key:true },
      { id:'d_olmo',      name:'Д. Олмо',          posCode:'AM', pos:'Полузащитник', num:20, shot:82, speed:80, dribble:88, pass:86 },
      { id:'yamal',       name:'Л. Ямаль',         posCode:'RW', pos:'Нападающий',   num:19, shot:84, speed:93, dribble:94, pass:86, key:true },
      { id:'lewandowski', name:'Р. Левандовски',   posCode:'ST', pos:'Нападающий',   num:9,  shot:92, speed:76, dribble:82, pass:82 },
      { id:'raphinha',    name:'Рафинья',           posCode:'LW', pos:'Нападающий',   num:11, shot:84, speed:88, dribble:88, pass:82 },
      { id:'f_torres',    name:'Ф. Торрес',        posCode:'ST', pos:'Нападающий',   num:7,  shot:82, speed:82, dribble:82, pass:76 },
      { id:'cubarsi',     name:'П. Кюбарси',       posCode:'CB', pos:'Защитник',     num:33, shot:56, speed:74, dribble:68, pass:72 },
      { id:'penas_gk',    name:'Дж. Пеньяс',      posCode:'GK', pos:'Вратарь',      num:26, shot:38, speed:54, dribble:46, pass:74 },
    ],
  },
  {
    id: 'liverpool', name: 'Ливерпуль', shortName: 'ЛИВ',
    color: '#C8102E', bgColor: '#FFEBEE', emoji: '🔴',
    attack: 89, defense: 85, midfield: 87,
    form: ['W','W','D','W','W'], winPct: 71, scored: 2.3, conceded: 0.8,
    players: [
      { id:'alisson',     name:'Алисон',           posCode:'GK', pos:'Вратарь',      num:1,  shot:46, speed:62, dribble:58, pass:87, key:true },
      { id:'bradley',     name:'К. Брэдли',        posCode:'RB', pos:'Защитник',     num:84, shot:68, speed:84, dribble:76, pass:78 },
      { id:'van_dijk',    name:'В. Ван Дейк',      posCode:'CB', pos:'Защитник',     num:4,  shot:72, speed:78, dribble:70, pass:80 },
      { id:'konate',      name:'И. Коате',         posCode:'CB', pos:'Защитник',     num:5,  shot:64, speed:80, dribble:68, pass:74 },
      { id:'robertson',   name:'Э. Робертсон',    posCode:'LB', pos:'Защитник',     num:26, shot:70, speed:84, dribble:78, pass:82 },
      { id:'gravenberch', name:'Р. Грейвенберх',   posCode:'DM', pos:'Полузащитник', num:38, shot:74, speed:80, dribble:82, pass:84 },
      { id:'mac_allister', name:'А. Мак-Аллистер', posCode:'CM', pos:'Полузащитник', num:10, shot:78, speed:79, dribble:84, pass:88, key:true },
      { id:'elliott',     name:'Х. Эллиотт',      posCode:'AM', pos:'Полузащитник', num:19, shot:76, speed:82, dribble:84, pass:82 },
      { id:'salah',       name:'М. Салах',         posCode:'RW', pos:'Нападающий',   num:11, shot:92, speed:90, dribble:90, pass:82, key:true },
      { id:'nunez_lfc',   name:'Д. Нуньес',        posCode:'ST', pos:'Нападающий',   num:9,  shot:86, speed:90, dribble:82, pass:72 },
      { id:'l_diaz',      name:'Л. Диас',          posCode:'LW', pos:'Нападающий',   num:7,  shot:82, speed:88, dribble:88, pass:78 },
      { id:'jota',        name:'Д. Жота',          posCode:'ST', pos:'Нападающий',   num:20, shot:84, speed:82, dribble:84, pass:76 },
      { id:'jones_lfc',   name:'К. Джонс',         posCode:'CM', pos:'Полузащитник', num:17, shot:72, speed:78, dribble:80, pass:82 },
      { id:'kelleher',    name:'К. Келлехер',     posCode:'GK', pos:'Вратарь',      num:62, shot:40, speed:56, dribble:48, pass:76 },
    ],
  },
  // === TIER 2 — Сильные ===
  {
    id: 'psg', name: 'ПСЖ', shortName: 'ПСЖ',
    color: '#004170', bgColor: '#E3F2FD', emoji: '🗼',
    attack: 86, defense: 82, midfield: 84,
    form: ['W','W','D','W','D'], winPct: 68, scored: 2.2, conceded: 1.0,
    players: [
      { id:'donnarumma',  name:'Дж. Доннарумма',  posCode:'GK', pos:'Вратарь',      num:99, shot:44, speed:60, dribble:56, pass:85, key:true },
      { id:'hakimi',      name:'А. Хакими',        posCode:'RB', pos:'Защитник',     num:2,  shot:74, speed:88, dribble:82, pass:80 },
      { id:'marquinhos',  name:'Маркиньос',        posCode:'CB', pos:'Защитник',     num:5,  shot:64, speed:78, dribble:72, pass:78 },
      { id:'pacho',       name:'В. Пачо',          posCode:'CB', pos:'Защитник',     num:28, shot:60, speed:76, dribble:66, pass:72 },
      { id:'n_mendes',    name:'Н. Мендес',        posCode:'LB', pos:'Защитник',     num:27, shot:68, speed:84, dribble:76, pass:78 },
      { id:'fabian',      name:'Ф. Руис',          posCode:'DM', pos:'Полузащитник', num:8,  shot:78, speed:76, dribble:82, pass:88, key:true },
      { id:'zaireemery',  name:'В. Зайрэ-Эмери',  posCode:'CM', pos:'Полузащитник', num:33, shot:74, speed:80, dribble:82, pass:84 },
      { id:'lee_kang',    name:'Ли Ган-ин',        posCode:'AM', pos:'Полузащитник', num:23, shot:80, speed:76, dribble:84, pass:86 },
      { id:'dembele',     name:'У. Дембеле',       posCode:'RW', pos:'Нападающий',   num:10, shot:82, speed:94, dribble:92, pass:80, key:true },
      { id:'g_ramos',     name:'Г. Рамош',         posCode:'ST', pos:'Нападающий',   num:9,  shot:84, speed:80, dribble:78, pass:74 },
      { id:'barcola',     name:'Б. Барколя',       posCode:'LW', pos:'Нападающий',   num:29, shot:80, speed:92, dribble:88, pass:76 },
      { id:'kolo_muani',  name:'К. Коло Муани',   posCode:'ST', pos:'Нападающий',   num:23, shot:82, speed:84, dribble:80, pass:74 },
      { id:'asensio',     name:'М. Асенсьо',       posCode:'AM', pos:'Полузащитник', num:11, shot:82, speed:76, dribble:84, pass:82 },
      { id:'safonov',     name:'М. Сафонов',       posCode:'GK', pos:'Вратарь',      num:16, shot:38, speed:56, dribble:48, pass:76 },
    ],
  },
  {
    id: 'inter', name: 'Интер', shortName: 'ИНТ',
    color: '#009BDB', bgColor: '#E1F5FE', emoji: '⚫🔵',
    attack: 84, defense: 85, midfield: 83,
    form: ['W','D','W','W','D'], winPct: 67, scored: 2.1, conceded: 0.9,
    players: [
      { id:'sommer',      name:'Я. Зоммер',        posCode:'GK', pos:'Вратарь',      num:1,  shot:44, speed:60, dribble:55, pass:84, key:true },
      { id:'darmian',     name:'М. Дармиан',       posCode:'RB', pos:'Защитник',     num:36, shot:64, speed:78, dribble:72, pass:76 },
      { id:'de_vrij',     name:'С. Де Фрей',       posCode:'CB', pos:'Защитник',     num:6,  shot:62, speed:74, dribble:68, pass:76 },
      { id:'bastoni',     name:'А. Бастони',       posCode:'CB', pos:'Защитник',     num:95, shot:66, speed:76, dribble:72, pass:78 },
      { id:'dimarco',     name:'Ф. Димарко',       posCode:'LB', pos:'Защитник',     num:32, shot:72, speed:80, dribble:76, pass:80 },
      { id:'calhanoglu',  name:'Х. Чалханоглу',    posCode:'DM', pos:'Полузащитник', num:20, shot:82, speed:76, dribble:82, pass:88 },
      { id:'barella',     name:'Н. Барелла',       posCode:'CM', pos:'Полузащитник', num:23, shot:80, speed:86, dribble:82, pass:86, key:true },
      { id:'mkhitaryan',  name:'Х. Мхитарян',     posCode:'AM', pos:'Полузащитник', num:22, shot:78, speed:74, dribble:82, pass:86 },
      { id:'dumfries',    name:'Д. Думфрис',       posCode:'RW', pos:'Нападающий',   num:2,  shot:76, speed:86, dribble:78, pass:74 },
      { id:'l_martinez',  name:'Л. Мартинес',      posCode:'ST', pos:'Нападающий',   num:10, shot:88, speed:84, dribble:85, pass:78, key:true },
      { id:'thuram',      name:'М. Тюрам',         posCode:'LW', pos:'Нападающий',   num:8,  shot:82, speed:88, dribble:82, pass:74 },
      { id:'arnautovic',  name:'М. Арнаутович',    posCode:'ST', pos:'Нападающий',   num:9,  shot:82, speed:76, dribble:76, pass:74 },
      { id:'frattesi',    name:'Д. Фраттеши',     posCode:'CM', pos:'Полузащитник', num:16, shot:78, speed:80, dribble:78, pass:80 },
      { id:'audero',      name:'Э. Аудеро',        posCode:'GK', pos:'Вратарь',      num:13, shot:38, speed:54, dribble:46, pass:72 },
    ],
  },
  {
    id: 'arsenal', name: 'Арсенал', shortName: 'АРС',
    color: '#EF0107', bgColor: '#FFEBEE', emoji: '🔴',
    attack: 85, defense: 84, midfield: 86,
    form: ['W','W','W','D','W'], winPct: 70, scored: 2.2, conceded: 0.8,
    players: [
      { id:'raya',        name:'Д. Рая',           posCode:'GK', pos:'Вратарь',      num:22, shot:44, speed:62, dribble:58, pass:88, key:true },
      { id:'b_white',     name:'Б. Уайт',          posCode:'RB', pos:'Защитник',     num:4,  shot:66, speed:82, dribble:74, pass:78 },
      { id:'saliba',      name:'У. Салиба',         posCode:'CB', pos:'Защитник',     num:12, shot:62, speed:80, dribble:70, pass:76 },
      { id:'magalhaes',   name:'Г. Маньяр',        posCode:'CB', pos:'Защитник',     num:6,  shot:60, speed:76, dribble:66, pass:74 },
      { id:'zinchenko',   name:'О. Зинченко',      posCode:'LB', pos:'Защитник',     num:35, shot:66, speed:78, dribble:76, pass:80 },
      { id:'partey',      name:'Т. Партей',         posCode:'DM', pos:'Полузащитник', num:5,  shot:74, speed:78, dribble:78, pass:82 },
      { id:'odegaard',    name:'М. Эдегор',        posCode:'CM', pos:'Полузащитник', num:8,  shot:82, speed:78, dribble:88, pass:92, key:true },
      { id:'rice',        name:'Д. Райс',          posCode:'CM', pos:'Полузащитник', num:41, shot:80, speed:80, dribble:82, pass:84 },
      { id:'saka',        name:'Б. Сака',          posCode:'RW', pos:'Нападающий',   num:7,  shot:86, speed:90, dribble:88, pass:84, key:true },
      { id:'havertz',     name:'К. Хавертс',       posCode:'ST', pos:'Нападающий',   num:29, shot:82, speed:80, dribble:84, pass:82 },
      { id:'martinelli',  name:'Г. Мартинелли',    posCode:'LW', pos:'Нападающий',   num:11, shot:84, speed:88, dribble:86, pass:76 },
      { id:'nketiah',     name:'Э. Нкетиа',        posCode:'ST', pos:'Нападающий',   num:14, shot:80, speed:82, dribble:78, pass:72 },
      { id:'trossard',    name:'Л. Труссар',       posCode:'LW', pos:'Нападающий',   num:19, shot:80, speed:80, dribble:84, pass:80 },
      { id:'ramsdale',    name:'А. Рамсдейл',     posCode:'GK', pos:'Вратарь',      num:1,  shot:40, speed:58, dribble:48, pass:76 },
    ],
  },
  {
    id: 'atletico', name: 'Атлетико Мадрид', shortName: 'АТМ',
    color: '#CB3524', bgColor: '#FFEBEE', emoji: '🔴⚪',
    attack: 80, defense: 86, midfield: 82,
    form: ['W','D','W','D','W'], winPct: 64, scored: 1.8, conceded: 0.7,
    players: [
      { id:'oblak',       name:'Я. Облак',         posCode:'GK', pos:'Вратарь',      num:13, shot:48, speed:60, dribble:56, pass:82, key:true },
      { id:'llorente',    name:'М. Льоренте',      posCode:'RB', pos:'Защитник',     num:14, shot:72, speed:80, dribble:76, pass:78 },
      { id:'jimenez',     name:'Х. Хименес',       posCode:'CB', pos:'Защитник',     num:2,  shot:68, speed:78, dribble:70, pass:76 },
      { id:'le_normand',  name:'Р. Ле Норман',    posCode:'CB', pos:'Защитник',     num:23, shot:60, speed:74, dribble:66, pass:72 },
      { id:'mandava',     name:'Р. Мандава',       posCode:'LB', pos:'Защитник',     num:23, shot:64, speed:80, dribble:72, pass:74 },
      { id:'koke',        name:'Коке',             posCode:'DM', pos:'Полузащитник', num:6,  shot:72, speed:76, dribble:80, pass:86 },
      { id:'de_paul',     name:'Р. Де Пауль',      posCode:'CM', pos:'Полузащитник', num:5,  shot:76, speed:80, dribble:84, pass:86, key:true },
      { id:'barrios',     name:'П. Барриос',       posCode:'CM', pos:'Полузащитник', num:20, shot:70, speed:78, dribble:76, pass:80 },
      { id:'lino',        name:'С. Линью',         posCode:'RW', pos:'Нападающий',   num:16, shot:76, speed:88, dribble:84, pass:74 },
      { id:'griezmann',   name:'А. Гризманн',      posCode:'ST', pos:'Нападающий',   num:7,  shot:86, speed:82, dribble:86, pass:84, key:true },
      { id:'correa',      name:'А. Корреа',        posCode:'LW', pos:'Нападающий',   num:10, shot:78, speed:82, dribble:82, pass:76 },
      { id:'sorloth',     name:'А. Сёрлот',        posCode:'ST', pos:'Нападающий',   num:19, shot:82, speed:78, dribble:74, pass:72 },
      { id:'riquelme_at', name:'А. Рикельме',      posCode:'RW', pos:'Нападающий',   num:22, shot:74, speed:84, dribble:82, pass:76 },
      { id:'moyano_gk',   name:'Х. Моянь',         posCode:'GK', pos:'Вратарь',      num:25, shot:36, speed:54, dribble:44, pass:70 },
    ],
  },
  {
    id: 'dortmund', name: 'Боруссия Дортмунд', shortName: 'БВБ',
    color: '#FDE100', bgColor: '#FFF9C4', emoji: '💛',
    attack: 83, defense: 78, midfield: 81,
    form: ['W','D','W','L','W'], winPct: 62, scored: 2.3, conceded: 1.2,
    players: [
      { id:'kobel',       name:'Г. Кобель',        posCode:'GK', pos:'Вратарь',      num:1,  shot:44, speed:62, dribble:58, pass:84, key:true },
      { id:'ryerson',     name:'Й. Рюерсон',       posCode:'RB', pos:'Защитник',     num:25, shot:66, speed:82, dribble:74, pass:76 },
      { id:'sule',        name:'Н. Зюле',          posCode:'CB', pos:'Защитник',     num:4,  shot:62, speed:76, dribble:68, pass:74 },
      { id:'schlotterbeck',name:'Н. Шлоттербек',  posCode:'CB', pos:'Защитник',     num:15, shot:64, speed:78, dribble:70, pass:74 },
      { id:'bensebaini',  name:'Р. Бенсебайни',   posCode:'LB', pos:'Защитник',     num:13, shot:68, speed:82, dribble:74, pass:76 },
      { id:'can',         name:'Э. Кан',           posCode:'DM', pos:'Полузащитник', num:23, shot:74, speed:78, dribble:76, pass:80 },
      { id:'sabitzer',    name:'М. Сабитцер',      posCode:'CM', pos:'Полузащитник', num:16, shot:78, speed:80, dribble:80, pass:82 },
      { id:'brandt',      name:'Ю. Брандт',        posCode:'AM', pos:'Полузащитник', num:19, shot:80, speed:78, dribble:84, pass:88, key:true },
      { id:'sancho',      name:'Дж. Санчо',        posCode:'RW', pos:'Нападающий',   num:10, shot:82, speed:88, dribble:90, pass:82, key:true },
      { id:'fullkrug',    name:'Н. Фюлькруг',     posCode:'ST', pos:'Нападающий',   num:14, shot:86, speed:76, dribble:74, pass:74 },
      { id:'adeyemi',     name:'К. Адейеми',       posCode:'LW', pos:'Нападающий',   num:27, shot:80, speed:92, dribble:84, pass:72 },
      { id:'guirassy',    name:'С. Гирасси',       posCode:'ST', pos:'Нападающий',   num:7,  shot:88, speed:80, dribble:78, pass:70 },
      { id:'nmecha',      name:'Ф. Нмеча',         posCode:'AM', pos:'Полузащитник', num:8,  shot:78, speed:80, dribble:82, pass:78 },
      { id:'meyer_dor',   name:'А. Мейер',         posCode:'GK', pos:'Вратарь',      num:35, shot:36, speed:54, dribble:44, pass:72 },
    ],
  },
  // === TIER 3 — Хорошие ===
  {
    id: 'juventus', name: 'Ювентус', shortName: 'ЮВЕ',
    color: '#000000', bgColor: '#F5F5F5', emoji: '⚪⚫',
    attack: 78, defense: 80, midfield: 77,
    form: ['W','D','D','W','L'], winPct: 58, scored: 1.8, conceded: 1.0,
    players: [
      { id:'di_gregorio',  name:'М. Ди Грегорио',  posCode:'GK', pos:'Вратарь',      num:36, shot:42, speed:60, dribble:55, pass:82, key:true },
      { id:'danilo',       name:'Данило',           posCode:'RB', pos:'Защитник',     num:2,  shot:64, speed:78, dribble:72, pass:76 },
      { id:'bremer',       name:'Г. Бремер',        posCode:'CB', pos:'Защитник',     num:3,  shot:60, speed:76, dribble:66, pass:72 },
      { id:'gatti',        name:'Ф. Гатти',         posCode:'CB', pos:'Защитник',     num:15, shot:62, speed:74, dribble:64, pass:70 },
      { id:'cambiaso',     name:'А. Камбьясо',      posCode:'LB', pos:'Защитник',     num:27, shot:66, speed:82, dribble:76, pass:78 },
      { id:'locatelli',    name:'М. Локателли',     posCode:'DM', pos:'Полузащитник', num:5,  shot:74, speed:76, dribble:80, pass:86, key:true },
      { id:'fagioli',      name:'Н. Фаджоли',      posCode:'CM', pos:'Полузащитник', num:30, shot:72, speed:74, dribble:80, pass:84 },
      { id:'koopmeiners',  name:'Т. Купмайнерс',    posCode:'AM', pos:'Полузащитник', num:8,  shot:80, speed:78, dribble:82, pass:86 },
      { id:'conceicao_j',  name:'Ф. Консейсао',     posCode:'RW', pos:'Нападающий',   num:11, shot:80, speed:88, dribble:86, pass:76 },
      { id:'vlahovic',     name:'Д. Влахович',      posCode:'ST', pos:'Нападающий',   num:9,  shot:86, speed:80, dribble:78, pass:72, key:true },
      { id:'mbangula',     name:'С. Мбангула',      posCode:'LW', pos:'Нападающий',   num:17, shot:76, speed:86, dribble:82, pass:72 },
      { id:'milik',        name:'А. Милик',         posCode:'ST', pos:'Нападающий',   num:14, shot:82, speed:74, dribble:72, pass:70 },
      { id:'yldiz',        name:'К. Йылдыз',        posCode:'AM', pos:'Полузащитник', num:10, shot:78, speed:80, dribble:84, pass:78 },
      { id:'perin',        name:'М. Перин',         posCode:'GK', pos:'Вратарь',      num:23, shot:38, speed:54, dribble:46, pass:74 },
    ],
  },
  {
    id: 'ac_milan', name: 'Милан', shortName: 'МИЛ',
    color: '#FB090B', bgColor: '#FFEBEE', emoji: '🔴⚫',
    attack: 79, defense: 78, midfield: 76,
    form: ['D','W','W','L','W'], winPct: 56, scored: 1.9, conceded: 1.1,
    players: [
      { id:'maignan',      name:'М. Маньян',        posCode:'GK', pos:'Вратарь',      num:16, shot:46, speed:66, dribble:60, pass:86, key:true },
      { id:'emerson',      name:'Эмерсон',          posCode:'RB', pos:'Защитник',     num:22, shot:64, speed:78, dribble:72, pass:74 },
      { id:'tomori',       name:'Ф. Томори',        posCode:'CB', pos:'Защитник',     num:23, shot:62, speed:80, dribble:70, pass:72 },
      { id:'pavlovic',     name:'С. Павлович',      posCode:'CB', pos:'Защитник',     num:31, shot:60, speed:76, dribble:66, pass:72 },
      { id:'hernandez',    name:'Т. Эрнандес',     posCode:'LB', pos:'Защитник',     num:19, shot:72, speed:86, dribble:80, pass:76 },
      { id:'bennacer',     name:'И. Беннасер',      posCode:'DM', pos:'Полузащитник', num:4,  shot:72, speed:78, dribble:80, pass:84 },
      { id:'reijnders',    name:'Т. Рейндерс',     posCode:'CM', pos:'Полузащитник', num:14, shot:76, speed:80, dribble:82, pass:84 },
      { id:'pulisic',      name:'К. Пулишич',       posCode:'AM', pos:'Полузащитник', num:11, shot:80, speed:86, dribble:84, pass:80, key:true },
      { id:'chukwueze',    name:'С. Чуквуэзе',     posCode:'RW', pos:'Нападающий',   num:21, shot:78, speed:88, dribble:84, pass:72 },
      { id:'morata',       name:'А. Мората',        posCode:'ST', pos:'Нападающий',   num:7,  shot:82, speed:78, dribble:78, pass:76 },
      { id:'leao',         name:'Р. Леао',          posCode:'LW', pos:'Нападающий',   num:10, shot:84, speed:92, dribble:90, pass:76, key:true },
      { id:'loftus_ch',    name:'Р. Лофтус-Чик',   posCode:'CM', pos:'Полузащитник', num:8,  shot:78, speed:78, dribble:80, pass:78 },
      { id:'jovic',        name:'Л. Йович',         posCode:'ST', pos:'Нападающий',   num:12, shot:80, speed:76, dribble:76, pass:70 },
      { id:'sportiello',   name:'М. Спортьелло',    posCode:'GK', pos:'Вратарь',      num:57, shot:36, speed:54, dribble:44, pass:72 },
    ],
  },
  {
    id: 'napoli', name: 'Наполи', shortName: 'НАП',
    color: '#12A0D7', bgColor: '#E1F5FE', emoji: '🔵',
    attack: 80, defense: 79, midfield: 78,
    form: ['W','W','D','L','W'], winPct: 60, scored: 2.0, conceded: 1.0,
    players: [
      { id:'meret',        name:'А. Мерет',         posCode:'GK', pos:'Вратарь',      num:1,  shot:40, speed:58, dribble:52, pass:80, key:true },
      { id:'dilorenzo',    name:'Дж. Ди Лоренцо',  posCode:'RB', pos:'Защитник',     num:22, shot:68, speed:80, dribble:74, pass:76 },
      { id:'rrahmani',     name:'А. Ррахмани',     posCode:'CB', pos:'Защитник',     num:13, shot:62, speed:76, dribble:66, pass:72 },
      { id:'juan_jesus',   name:'Хуан Хесус',       posCode:'CB', pos:'Защитник',     num:5,  shot:60, speed:74, dribble:64, pass:70 },
      { id:'olivera',      name:'М. Оливера',       posCode:'LB', pos:'Защитник',     num:17, shot:64, speed:80, dribble:72, pass:74 },
      { id:'lobotka',      name:'С. Лоботка',       posCode:'DM', pos:'Полузащитник', num:68, shot:68, speed:74, dribble:82, pass:90, key:true },
      { id:'anguissa',     name:'А. Ангисса',       posCode:'CM', pos:'Полузащитник', num:99, shot:74, speed:82, dribble:78, pass:80 },
      { id:'zielinski',    name:'П. Зелиньски',     posCode:'AM', pos:'Полузащитник', num:20, shot:80, speed:78, dribble:84, pass:86 },
      { id:'politano',     name:'М. Политано',      posCode:'RW', pos:'Нападающий',   num:21, shot:78, speed:82, dribble:82, pass:76 },
      { id:'osimhen',      name:'В. Осимхен',       posCode:'ST', pos:'Нападающий',   num:9,  shot:88, speed:88, dribble:82, pass:70, key:true },
      { id:'kvaratskhelia', name:'Х. Кварацхелия',  posCode:'LW', pos:'Нападающий',   num:77, shot:82, speed:88, dribble:92, pass:80 },
      { id:'simeone',      name:'Дж. Симеоне',     posCode:'ST', pos:'Нападающий',   num:18, shot:78, speed:78, dribble:72, pass:68 },
      { id:'raspadori',    name:'Дж. Распадори',   posCode:'AM', pos:'Полузащитник', num:81, shot:80, speed:78, dribble:80, pass:78 },
      { id:'contini',      name:'К. Контини',      posCode:'GK', pos:'Вратарь',      num:24, shot:36, speed:52, dribble:44, pass:70 },
    ],
  },
  {
    id: 'chelsea', name: 'Челси', shortName: 'ЧЕЛ',
    color: '#034694', bgColor: '#E3F2FD', emoji: '🔵',
    attack: 78, defense: 76, midfield: 79,
    form: ['D','W','L','W','D'], winPct: 55, scored: 1.8, conceded: 1.2,
    players: [
      { id:'jorgensen',    name:'Ф. Йоргенсен',     posCode:'GK', pos:'Вратарь',      num:1,  shot:40, speed:58, dribble:54, pass:81, key:true },
      { id:'reece_james',  name:'Р. Джеймс',        posCode:'RB', pos:'Защитник',     num:24, shot:72, speed:82, dribble:78, pass:80 },
      { id:'chalobah',     name:'Т. Чалобах',       posCode:'CB', pos:'Защитник',     num:14, shot:60, speed:76, dribble:66, pass:72 },
      { id:'colwill',      name:'Л. Колвилл',       posCode:'CB', pos:'Защитник',     num:26, shot:58, speed:74, dribble:66, pass:70 },
      { id:'chilwell',     name:'Б. Чилвелл',       posCode:'LB', pos:'Защитник',     num:21, shot:68, speed:80, dribble:74, pass:76 },
      { id:'caicedo',      name:'М. Кайседо',       posCode:'DM', pos:'Полузащитник', num:25, shot:72, speed:82, dribble:78, pass:80 },
      { id:'palmer',       name:'К. Палмер',        posCode:'AM', pos:'Полузащитник', num:20, shot:84, speed:82, dribble:86, pass:86, key:true },
      { id:'fernandez',    name:'Э. Фернандес',     posCode:'CM', pos:'Полузащитник', num:8,  shot:76, speed:76, dribble:80, pass:84 },
      { id:'madueke',      name:'Н. Мадуеке',       posCode:'RW', pos:'Нападающий',   num:36, shot:78, speed:88, dribble:84, pass:74 },
      { id:'jackson',      name:'Н. Джексон',       posCode:'ST', pos:'Нападающий',   num:15, shot:82, speed:86, dribble:80, pass:74, key:true },
      { id:'nkunku_ch',    name:'К. Нкунку',        posCode:'LW', pos:'Нападающий',   num:18, shot:84, speed:84, dribble:86, pass:80 },
      { id:'mudryk',       name:'М. Мудрик',        posCode:'LW', pos:'Нападающий',   num:10, shot:78, speed:90, dribble:84, pass:72 },
      { id:'veiga',        name:'Р. Вейга',         posCode:'CM', pos:'Полузащитник', num:42, shot:76, speed:76, dribble:80, pass:82 },
      { id:'sanchez_ch',   name:'Р. Санчес',        posCode:'GK', pos:'Вратарь',      num:27, shot:38, speed:56, dribble:48, pass:76 },
    ],
  },
  {
    id: 'benfica', name: 'Бенфика', shortName: 'БЕН',
    color: '#FF0000', bgColor: '#FFEBEE', emoji: '🦅',
    attack: 77, defense: 75, midfield: 76,
    form: ['W','W','D','W','L'], winPct: 62, scored: 2.1, conceded: 1.2,
    players: [
      { id:'trubin',       name:'А. Трубин',        posCode:'GK', pos:'Вратарь',      num:42, shot:42, speed:60, dribble:55, pass:83, key:true },
      { id:'bah',          name:'А. Ба',            posCode:'RB', pos:'Защитник',     num:4,  shot:64, speed:80, dribble:72, pass:74 },
      { id:'otamendi',     name:'Н. Отаменди',      posCode:'CB', pos:'Защитник',     num:30, shot:62, speed:74, dribble:66, pass:72 },
      { id:'antonio_s',    name:'А. Силва',         posCode:'CB', pos:'Защитник',     num:2,  shot:60, speed:74, dribble:64, pass:70 },
      { id:'carreras',     name:'А. Каррерас',      posCode:'LB', pos:'Защитник',     num:41, shot:62, speed:78, dribble:70, pass:72 },
      { id:'florentino',   name:'Ф. Луиш',          posCode:'DM', pos:'Полузащитник', num:14, shot:68, speed:76, dribble:78, pass:82 },
      { id:'kokcu',        name:'О. Кокчу',         posCode:'CM', pos:'Полузащитник', num:8,  shot:74, speed:78, dribble:80, pass:86, key:true },
      { id:'aursnes',      name:'Ф. Оурснес',       posCode:'AM', pos:'Полузащитник', num:18, shot:72, speed:78, dribble:76, pass:80 },
      { id:'diogo_gon',    name:'Д. Гонсалвес',    posCode:'RW', pos:'Нападающий',   num:19, shot:78, speed:84, dribble:80, pass:74 },
      { id:'rafa_silva',   name:'Р. Силва',         posCode:'LW', pos:'Нападающий',   num:27, shot:82, speed:84, dribble:82, pass:76, key:true },
      { id:'cabral',       name:'А. Кабрал',        posCode:'ST', pos:'Нападающий',   num:9,  shot:82, speed:78, dribble:74, pass:70 },
      { id:'akturkoglu',   name:'К. Актюркоглу',   posCode:'RW', pos:'Нападающий',   num:11, shot:78, speed:86, dribble:82, pass:72 },
      { id:'di_maria',     name:'А. Ди Мария',     posCode:'LW', pos:'Нападающий',   num:11, shot:80, speed:78, dribble:82, pass:84 },
      { id:'varela_gk',    name:'О. Варела',        posCode:'GK', pos:'Вратарь',      num:12, shot:36, speed:52, dribble:44, pass:72 },
    ],
  },
  // === TIER 4 — Конкурентные ===
  {
    id: 'porto', name: 'Порту', shortName: 'ПОР',
    color: '#003893', bgColor: '#E3F2FD', emoji: '🔵⚪',
    attack: 74, defense: 73, midfield: 72,
    form: ['W','D','L','W','D'], winPct: 56, scored: 1.8, conceded: 1.2,
    players: [
      { id:'diogo_costa',  name:'Д. Коста',         posCode:'GK', pos:'Вратарь',      num:99, shot:44, speed:62, dribble:58, pass:84, key:true },
      { id:'joao_mario',   name:'Д. Марио',         posCode:'RB', pos:'Защитник',     num:6,  shot:64, speed:76, dribble:70, pass:72 },
      { id:'pepe',         name:'Пепе',             posCode:'CB', pos:'Защитник',     num:3,  shot:62, speed:72, dribble:64, pass:74 },
      { id:'marcano',      name:'И. Маркано',       posCode:'CB', pos:'Защитник',     num:4,  shot:58, speed:70, dribble:62, pass:70 },
      { id:'zaidu',        name:'Зайду',            posCode:'LB', pos:'Защитник',     num:35, shot:62, speed:80, dribble:70, pass:72 },
      { id:'grujic',       name:'М. Грюич',         posCode:'DM', pos:'Полузащитник', num:22, shot:70, speed:74, dribble:74, pass:78 },
      { id:'galeno',       name:'Галено',           posCode:'LW', pos:'Нападающий',   num:11, shot:80, speed:86, dribble:84, pass:76, key:true },
      { id:'veron',        name:'Р. Верон',         posCode:'CM', pos:'Полузащитник', num:19, shot:72, speed:78, dribble:78, pass:80 },
      { id:'pepe_m',       name:'Пепе М.',          posCode:'RW', pos:'Нападающий',   num:72, shot:78, speed:86, dribble:80, pass:72 },
      { id:'evanilson',    name:'Э. Эванилсон',     posCode:'ST', pos:'Нападающий',   num:9,  shot:84, speed:82, dribble:80, pass:70, key:true },
      { id:'s_conceicao',  name:'С. Консейсао',     posCode:'RW', pos:'Нападающий',   num:10, shot:78, speed:82, dribble:80, pass:74 },
      { id:'rodrigues_p',  name:'А. Родригес',      posCode:'LW', pos:'Нападающий',   num:7,  shot:76, speed:80, dribble:76, pass:74 },
      { id:'namaso',       name:'Д. Намасо',        posCode:'RW', pos:'Нападающий',   num:26, shot:74, speed:84, dribble:78, pass:70 },
      { id:'costa_gk2',    name:'Р. Коста',         posCode:'GK', pos:'Вратарь',      num:1,  shot:36, speed:52, dribble:44, pass:70 },
    ],
  },
  {
    id: 'ajax', name: 'Аякс', shortName: 'АЯК',
    color: '#D2122E', bgColor: '#FFEBEE', emoji: '🔴⚪',
    attack: 72, defense: 70, midfield: 74,
    form: ['D','W','L','D','W'], winPct: 52, scored: 1.7, conceded: 1.3,
    players: [
      { id:'pasveer',      name:'Р. Пасфер',        posCode:'GK', pos:'Вратарь',      num:22, shot:38, speed:55, dribble:50, pass:78, key:true },
      { id:'rensch',       name:'Д. Ренш',          posCode:'RB', pos:'Защитник',     num:2,  shot:62, speed:78, dribble:70, pass:72 },
      { id:'sutalo',       name:'И. Шутало',        posCode:'CB', pos:'Защитник',     num:14, shot:58, speed:76, dribble:64, pass:70 },
      { id:'hato',         name:'Дж. Хато',         posCode:'CB', pos:'Защитник',     num:6,  shot:56, speed:74, dribble:66, pass:70 },
      { id:'baas',         name:'М. Баас',          posCode:'LB', pos:'Защитник',     num:3,  shot:60, speed:76, dribble:68, pass:70 },
      { id:'henderson',    name:'Дж. Хендерсон',   posCode:'DM', pos:'Полузащитник', num:4,  shot:68, speed:72, dribble:72, pass:80 },
      { id:'k_taylor',     name:'К. Тейлор',        posCode:'CM', pos:'Полузащитник', num:8,  shot:72, speed:80, dribble:82, pass:84, key:true },
      { id:'fitz_jim',     name:'К. Фитц-Джим',    posCode:'AM', pos:'Полузащитник', num:21, shot:74, speed:80, dribble:82, pass:82 },
      { id:'hlynsson',     name:'М. Хлюнссон',     posCode:'RW', pos:'Нападающий',   num:7,  shot:74, speed:82, dribble:78, pass:72 },
      { id:'brobbey',      name:'Б. Броббей',       posCode:'ST', pos:'Нападающий',   num:9,  shot:80, speed:84, dribble:78, pass:68, key:true },
      { id:'berghuis',     name:'С. Бергхёйс',     posCode:'LW', pos:'Нападающий',   num:23, shot:78, speed:78, dribble:80, pass:78 },
      { id:'traoré_a',     name:'Б. Траоре',        posCode:'RW', pos:'Нападающий',   num:10, shot:76, speed:84, dribble:80, pass:72 },
      { id:'akpom',        name:'Ч. Акпом',         posCode:'ST', pos:'Нападающий',   num:20, shot:78, speed:78, dribble:74, pass:68 },
      { id:'gorter',       name:'Й. Гортер',        posCode:'GK', pos:'Вратарь',      num:1,  shot:34, speed:52, dribble:42, pass:70 },
    ],
  },
  {
    id: 'tottenham', name: 'Тоттенхэм', shortName: 'ТОТ',
    color: '#132257', bgColor: '#E8EAF6', emoji: '⚪',
    attack: 76, defense: 72, midfield: 75,
    form: ['L','W','D','W','L'], winPct: 50, scored: 1.9, conceded: 1.4,
    players: [
      { id:'vicario',      name:'Г. Викарио',       posCode:'GK', pos:'Вратарь',      num:1,  shot:40, speed:60, dribble:55, pass:82, key:true },
      { id:'porro',        name:'П. Порро',         posCode:'RB', pos:'Защитник',     num:23, shot:68, speed:82, dribble:76, pass:76 },
      { id:'romero',       name:'К. Ромеро',        posCode:'CB', pos:'Защитник',     num:17, shot:64, speed:80, dribble:70, pass:74 },
      { id:'van_de_ven',   name:'М. Ван де Вен',   posCode:'CB', pos:'Защитник',     num:37, shot:60, speed:82, dribble:68, pass:72 },
      { id:'udogie',       name:'Д. Удожи',         posCode:'LB', pos:'Защитник',     num:38, shot:64, speed:84, dribble:74, pass:74 },
      { id:'bissouma',     name:'И. Биссума',       posCode:'DM', pos:'Полузащитник', num:29, shot:70, speed:78, dribble:76, pass:78 },
      { id:'maddison',     name:'Дж. Мэддисон',    posCode:'AM', pos:'Полузащитник', num:10, shot:82, speed:76, dribble:84, pass:86, key:true },
      { id:'sarr_spurs',   name:'П. Сарр',          posCode:'CM', pos:'Полузащитник', num:26, shot:74, speed:80, dribble:78, pass:80 },
      { id:'kulusevski',   name:'Д. Кулусевски',    posCode:'RW', pos:'Нападающий',   num:21, shot:80, speed:84, dribble:82, pass:78 },
      { id:'son',          name:'Х. Сон',           posCode:'LW', pos:'Нападающий',   num:7,  shot:88, speed:88, dribble:86, pass:80, key:true },
      { id:'richarlison',  name:'Ришарлисон',       posCode:'ST', pos:'Нападающий',   num:9,  shot:82, speed:82, dribble:78, pass:72 },
      { id:'solanke',      name:'Д. Соланке',       posCode:'ST', pos:'Нападающий',   num:19, shot:78, speed:74, dribble:72, pass:70 },
      { id:'bentancur',    name:'Р. Бентанкур',    posCode:'CM', pos:'Полузащитник', num:30, shot:72, speed:76, dribble:78, pass:80 },
      { id:'whiteman_gk',  name:'Б. Уайтман',       posCode:'GK', pos:'Вратарь',      num:13, shot:34, speed:52, dribble:42, pass:70 },
    ],
  },
  {
    id: 'leipzig', name: 'РБ Лейпциг', shortName: 'ЛЕЙ',
    color: '#DD0741', bgColor: '#FCE4EC', emoji: '🔴⚪',
    attack: 75, defense: 74, midfield: 73,
    form: ['W','L','W','D','L'], winPct: 54, scored: 1.9, conceded: 1.3,
    players: [
      { id:'gulacsi',      name:'П. Гулачи',        posCode:'GK', pos:'Вратарь',      num:1,  shot:40, speed:58, dribble:52, pass:80, key:true },
      { id:'simakan',      name:'М. Симакан',       posCode:'RB', pos:'Защитник',     num:2,  shot:62, speed:80, dribble:70, pass:72 },
      { id:'orban',        name:'В. Орбан',         posCode:'CB', pos:'Защитник',     num:4,  shot:60, speed:76, dribble:66, pass:72 },
      { id:'lukeba',       name:'К. Лукеба',        posCode:'CB', pos:'Защитник',     num:19, shot:60, speed:78, dribble:66, pass:72 },
      { id:'raum',         name:'Д. Раум',          posCode:'LB', pos:'Защитник',     num:3,  shot:66, speed:82, dribble:74, pass:76 },
      { id:'kampl',        name:'К. Кампл',         posCode:'DM', pos:'Полузащитник', num:44, shot:68, speed:74, dribble:76, pass:80 },
      { id:'x_simons',     name:'Кс. Симонс',       posCode:'AM', pos:'Полузащитник', num:20, shot:82, speed:84, dribble:86, pass:84, key:true },
      { id:'schlager',     name:'К. Шлагер',        posCode:'CM', pos:'Полузащитник', num:23, shot:70, speed:76, dribble:74, pass:78 },
      { id:'baumgartner',  name:'К. Баумгартнер',  posCode:'RW', pos:'Нападающий',   num:18, shot:76, speed:80, dribble:80, pass:78 },
      { id:'openda',       name:'Л. Опенда',        posCode:'ST', pos:'Нападающий',   num:11, shot:82, speed:90, dribble:82, pass:72, key:true },
      { id:'sesko',        name:'Б. Шеско',         posCode:'ST', pos:'Нападающий',   num:30, shot:84, speed:82, dribble:78, pass:68 },
      { id:'nusa',         name:'Г. Нуса',          posCode:'LW', pos:'Нападающий',   num:17, shot:76, speed:88, dribble:82, pass:72 },
      { id:'henrichs',     name:'Б. Хенрихс',      posCode:'RB', pos:'Защитник',     num:6,  shot:64, speed:80, dribble:72, pass:74 },
      { id:'blaswich',     name:'О. Блазвих',      posCode:'GK', pos:'Вратарь',      num:38, shot:36, speed:52, dribble:44, pass:72 },
    ],
  },
  {
    id: 'marseille', name: 'Марсель', shortName: 'МАР',
    color: '#2FAEE0', bgColor: '#E1F5FE', emoji: '⚪🔵',
    attack: 73, defense: 71, midfield: 72,
    form: ['D','L','W','L','W'], winPct: 48, scored: 1.6, conceded: 1.4,
    players: [
      { id:'pau_lopez',    name:'П. Лопес',         posCode:'GK', pos:'Вратарь',      num:16, shot:40, speed:58, dribble:52, pass:80, key:true },
      { id:'clauss',       name:'Дж. Клосс',        posCode:'RB', pos:'Защитник',     num:20, shot:64, speed:80, dribble:72, pass:74 },
      { id:'mbemba',       name:'Ш. Мбемба',        posCode:'CB', pos:'Защитник',     num:99, shot:60, speed:74, dribble:64, pass:70 },
      { id:'balerdi',      name:'Л. Балерди',       posCode:'CB', pos:'Защитник',     num:6,  shot:58, speed:72, dribble:62, pass:70 },
      { id:'lodi',         name:'Р. Лоди',          posCode:'LB', pos:'Защитник',     num:3,  shot:62, speed:78, dribble:70, pass:72 },
      { id:'kondogbia',    name:'Ж. Кондогбиа',    posCode:'DM', pos:'Полузащитник', num:24, shot:68, speed:74, dribble:72, pass:76 },
      { id:'veretout',     name:'Дж. Верету',      posCode:'CM', pos:'Полузащитник', num:8,  shot:72, speed:74, dribble:76, pass:80 },
      { id:'under',        name:'Дж. Ундер',        posCode:'RW', pos:'Нападающий',   num:18, shot:78, speed:84, dribble:82, pass:78, key:true },
      { id:'sarr_om',      name:'И. Сарр',          posCode:'LW', pos:'Нападающий',   num:9,  shot:78, speed:88, dribble:80, pass:74 },
      { id:'aubameyang',   name:'П.-Э. Обамеянг',   posCode:'ST', pos:'Нападающий',   num:10, shot:84, speed:86, dribble:80, pass:72, key:true },
      { id:'harit',        name:'А. Харит',         posCode:'AM', pos:'Полузащитник', num:22, shot:76, speed:78, dribble:82, pass:80 },
      { id:'sanchez_om',   name:'А. Санчес',        posCode:'ST', pos:'Нападающий',   num:11, shot:78, speed:76, dribble:74, pass:70 },
      { id:'vitinha_om',   name:'Витинья',          posCode:'LW', pos:'Нападающий',   num:7,  shot:76, speed:84, dribble:80, pass:74 },
      { id:'ruben_m',      name:'Р. Блажевич',      posCode:'GK', pos:'Вратарь',      num:30, shot:34, speed:52, dribble:42, pass:68 },
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
// CS2 TEAMS (12 teams)
// =============================================
const CS2_TEAMS = [
  // --- TIER 1 ---
  {
    id: 'nova_force',
    name: 'Nova Force',
    shortName: 'NF',
    color: '#FF6B35',
    bgColor: '#1C0800',
    emoji: '💥',
    rifle: 92, awp: 89, utility: 86, defense: 83,
    form: ['W','W','W','W','L'],
    winPct: 73, scored: 16.3, conceded: 11.4,
    players: [
      { name: 'К. Ноябрев', pos: 'entry',   rating: 91, kast: 76, adr: 94, hs: 58 },
      { name: 'Д. Файлов',  pos: 'awper',   rating: 88, kast: 72, adr: 82, hs: 32 },
    ],
  },
  {
    id: 'cyber_kings',
    name: 'Cyber Kings',
    shortName: 'CK',
    color: '#00C8FF',
    bgColor: '#001018',
    emoji: '👑',
    rifle: 90, awp: 86, utility: 88, defense: 85,
    form: ['W','W','W','L','W'],
    winPct: 70, scored: 16.1, conceded: 12.1,
    players: [
      { name: 'М. Сигнал',  pos: 'igl',     rating: 86, kast: 78, adr: 80, hs: 44 },
      { name: 'Е. Прицел',  pos: 'awper',   rating: 89, kast: 71, adr: 84, hs: 29 },
    ],
  },
  {
    id: 'iron_pact',
    name: 'Iron Pact',
    shortName: 'IP',
    color: '#FF9500',
    bgColor: '#0F0800',
    emoji: '⚙️',
    rifle: 86, awp: 84, utility: 82, defense: 88,
    form: ['W','W','L','W','W'],
    winPct: 66, scored: 15.8, conceded: 12.7,
    players: [
      { name: 'А. Клин',    pos: 'rifler',  rating: 85, kast: 75, adr: 88, hs: 52 },
      { name: 'С. Броня',   pos: 'support', rating: 81, kast: 79, adr: 74, hs: 41 },
    ],
  },
  // --- TIER 2 ---
  {
    id: 'ghost_protocol',
    name: 'Ghost Protocol',
    shortName: 'GP',
    color: '#CE82FF',
    bgColor: '#0A0010',
    emoji: '👻',
    rifle: 82, awp: 80, utility: 84, defense: 79,
    form: ['W','W','L','W','L'],
    winPct: 61, scored: 15.4, conceded: 13.3,
    players: [
      { name: 'В. Фантом',  pos: 'lurker',  rating: 83, kast: 70, adr: 86, hs: 54 },
      { name: 'Н. Дымов',   pos: 'support', rating: 79, kast: 76, adr: 72, hs: 39 },
    ],
  },
  {
    id: 'zero_hour',
    name: 'Zero Hour',
    shortName: 'ZH',
    color: '#FF3B30',
    bgColor: '#150000',
    emoji: '⏰',
    rifle: 79, awp: 82, utility: 76, defense: 75,
    form: ['W','L','W','W','L'],
    winPct: 58, scored: 15.1, conceded: 13.6,
    players: [
      { name: 'Г. Ноль',    pos: 'awper',   rating: 84, kast: 69, adr: 80, hs: 28 },
      { name: 'Л. Рывок',   pos: 'entry',   rating: 78, kast: 72, adr: 90, hs: 62 },
    ],
  },
  {
    id: 'pixel_storm',
    name: 'Pixel Storm',
    shortName: 'PS',
    color: '#30D158',
    bgColor: '#001008',
    emoji: '⚡',
    rifle: 76, awp: 73, utility: 80, defense: 77,
    form: ['W','L','W','L','W'],
    winPct: 54, scored: 14.8, conceded: 13.9,
    players: [
      { name: 'Р. Вихрев',  pos: 'igl',     rating: 78, kast: 77, adr: 76, hs: 46 },
      { name: 'И. Пиксель', pos: 'rifler',  rating: 80, kast: 73, adr: 84, hs: 55 },
    ],
  },
  // --- TIER 3 ---
  {
    id: 'circuit_breakers',
    name: 'Circuit Breakers',
    shortName: 'CB',
    color: '#FFD60A',
    bgColor: '#100A00',
    emoji: '🔌',
    rifle: 72, awp: 70, utility: 74, defense: 71,
    form: ['L','W','W','L','L'],
    winPct: 48, scored: 14.2, conceded: 14.5,
    players: [
      { name: 'П. Ток',     pos: 'rifler',  rating: 74, kast: 68, adr: 78, hs: 49 },
      { name: 'О. Схема',   pos: 'support', rating: 70, kast: 72, adr: 68, hs: 37 },
    ],
  },
  {
    id: 'neon_vortex',
    name: 'Neon Vortex',
    shortName: 'NV',
    color: '#5E5CE6',
    bgColor: '#030018',
    emoji: '🌀',
    rifle: 70, awp: 68, utility: 71, defense: 67,
    form: ['L','L','W','W','L'],
    winPct: 44, scored: 13.8, conceded: 14.8,
    players: [
      { name: 'Т. Вихрь',   pos: 'lurker',  rating: 72, kast: 66, adr: 80, hs: 56 },
      { name: 'Ф. Неон',    pos: 'entry',   rating: 69, kast: 69, adr: 82, hs: 60 },
    ],
  },
  {
    id: 'rapid_squad',
    name: 'Rapid Squad',
    shortName: 'RS',
    color: '#64D2FF',
    bgColor: '#001018',
    emoji: '🚀',
    rifle: 67, awp: 65, utility: 68, defense: 64,
    form: ['W','L','L','L','W'],
    winPct: 40, scored: 13.4, conceded: 15.2,
    players: [
      { name: 'Е. Спринт',  pos: 'entry',   rating: 70, kast: 65, adr: 84, hs: 58 },
      { name: 'А. Порыв',   pos: 'rifler',  rating: 66, kast: 67, adr: 76, hs: 48 },
    ],
  },
  // --- TIER 4 ---
  {
    id: 'static_noise',
    name: 'Static Noise',
    shortName: 'SN',
    color: '#8E8E93',
    bgColor: '#0A0A0F',
    emoji: '📡',
    rifle: 63, awp: 60, utility: 62, defense: 61,
    form: ['L','L','L','W','L'],
    winPct: 34, scored: 12.8, conceded: 15.7,
    players: [
      { name: 'М. Шум',     pos: 'support', rating: 65, kast: 63, adr: 68, hs: 40 },
      { name: 'В. Помеха',  pos: 'rifler',  rating: 62, kast: 61, adr: 72, hs: 45 },
    ],
  },
  {
    id: 'rookie_ops',
    name: 'Rookie Ops',
    shortName: 'RO',
    color: '#FF453A',
    bgColor: '#150000',
    emoji: '🎮',
    rifle: 58, awp: 55, utility: 58, defense: 57,
    form: ['L','L','L','W','L'],
    winPct: 28, scored: 12.2, conceded: 16.1,
    players: [
      { name: 'Н. Новичок', pos: 'entry',   rating: 60, kast: 58, adr: 70, hs: 44 },
      { name: 'Б. Учёба',   pos: 'igl',     rating: 57, kast: 62, adr: 62, hs: 36 },
    ],
  },
  {
    id: 'last_boot',
    name: 'Last Boot',
    shortName: 'LB',
    color: '#636366',
    bgColor: '#080808',
    emoji: '💾',
    rifle: 54, awp: 51, utility: 54, defense: 53,
    form: ['L','L','L','L','W'],
    winPct: 22, scored: 11.5, conceded: 16.6,
    players: [
      { name: 'С. Лаг',     pos: 'rifler',  rating: 55, kast: 56, adr: 64, hs: 41 },
      { name: 'Д. Краш',    pos: 'support', rating: 52, kast: 58, adr: 58, hs: 33 },
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
  CS2_TEAMS.forEach(t => {
    t.formScore = formScore(t.form);
    t.rating = Math.round(
      t.rifle   * 0.30 +
      t.awp     * 0.25 +
      t.utility * 0.20 +
      t.defense * 0.15 +
      t.formScore * 0.10
    );
  });
})();

// =============================================
// CS2 LEVELS (12 levels)
// =============================================
const CS2_LEVELS = [
  // --- EASY ---
  { num: 1,  teamA: 'nova_force',       teamB: 'last_boot',        events: 5, winThreshold: 4, map: 'mirage' },
  { num: 2,  teamA: 'cyber_kings',      teamB: 'rookie_ops',       events: 5, winThreshold: 4, map: 'dust2' },
  { num: 3,  teamA: 'iron_pact',        teamB: 'static_noise',     events: 5, winThreshold: 4, map: 'inferno' },
  // --- MEDIUM ---
  { num: 4,  teamA: 'nova_force',       teamB: 'neon_vortex',      events: 6, winThreshold: 6, map: 'ancient' },
  { num: 5,  teamA: 'cyber_kings',      teamB: 'rapid_squad',      events: 6, winThreshold: 6, map: 'nuke' },
  { num: 6,  teamA: 'iron_pact',        teamB: 'circuit_breakers', events: 6, winThreshold: 6, map: 'overpass' },
  // --- HARD ---
  { num: 7,  teamA: 'ghost_protocol',   teamB: 'pixel_storm',      events: 7, winThreshold: 6, map: 'vertigo' },
  { num: 8,  teamA: 'zero_hour',        teamB: 'iron_pact',        events: 7, winThreshold: 6, map: 'mirage' },
  { num: 9,  teamA: 'nova_force',       teamB: 'ghost_protocol',   events: 7, winThreshold: 6, map: 'dust2' },
  // --- EXPERT ---
  { num: 10, teamA: 'nova_force',       teamB: 'cyber_kings',      events: 8, winThreshold: 8, map: 'inferno' },
  { num: 11, teamA: 'iron_pact',        teamB: 'ghost_protocol',   events: 8, winThreshold: 8, map: 'nuke' },
  { num: 12, teamA: 'zero_hour',        teamB: 'cyber_kings',      events: 8, winThreshold: 8, map: 'ancient' },
];

// =============================================
// FOOTBALL LEVELS (12 levels)
// =============================================
const FOOTBALL_LEVELS = [
  // --- EASY (большая разница в силе) ---
  { num: 1,  teamA: 'real_madrid',  teamB: 'marseille',   events: 5, winThreshold: 4 },
  { num: 2,  teamA: 'man_city',     teamB: 'ajax',        events: 5, winThreshold: 4 },
  { num: 3,  teamA: 'bayern',       teamB: 'tottenham',   events: 5, winThreshold: 4 },
  // --- MEDIUM (средняя разница) ---
  { num: 4,  teamA: 'barcelona',    teamB: 'napoli',      events: 6, winThreshold: 6 },
  { num: 5,  teamA: 'liverpool',    teamB: 'ac_milan',    events: 6, winThreshold: 6 },
  { num: 6,  teamA: 'psg',          teamB: 'porto',       events: 6, winThreshold: 6 },
  // --- HARD (близкие по силе) ---
  { num: 7,  teamA: 'real_madrid',  teamB: 'bayern',      events: 7, winThreshold: 6 },
  { num: 8,  teamA: 'arsenal',      teamB: 'juventus',    events: 7, winThreshold: 6 },
  { num: 9,  teamA: 'atletico',     teamB: 'inter',       events: 7, winThreshold: 6 },
  // --- EXPERT (топ-дерби) ---
  { num: 10, teamA: 'real_madrid',  teamB: 'barcelona',   events: 8, winThreshold: 8 },
  { num: 11, teamA: 'man_city',     teamB: 'liverpool',   events: 8, winThreshold: 8 },
  { num: 12, teamA: 'bayern',       teamB: 'dortmund',    events: 8, winThreshold: 8 },
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
    icon: '🎯',
    iconClass: 'esports',
    teams: CS2_TEAMS,
    levels: CS2_LEVELS,
    unlockScore: 0,
    unlockSection: null,
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
