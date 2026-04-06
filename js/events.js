'use strict';

// =============================================
// EVENTS GENERATOR — Football ball events only
// =============================================
const Events = {

  EVENT_TYPES: [
    'attack', 'counterattack', 'corner', 'free_kick',
    'penalty', 'header', 'long_shot', 'one_on_one',
  ],

  TYPE_META: {
    attack:        { name: 'Острая атака',  icon: '⚡' },
    counterattack: { name: 'Контратака',    icon: '🏃' },
    corner:        { name: 'Угловой',       icon: '🚩' },
    free_kick:     { name: 'Штрафной',      icon: '🎯' },
    penalty:       { name: 'Пенальти',      icon: '🫵' },
    header:        { name: 'Удар головой',  icon: '🦅' },
    long_shot:     { name: 'Удар издали',   icon: '💨' },
    one_on_one:    { name: 'Один на один',  icon: '🔥' },
  },

  ANSWERS: {
    attack:        { yes: 'Да, гол!',     yesSub: 'Ставка на атаку',       no: 'Нет, мимо',      noSub: 'Ставка на защиту' },
    counterattack: { yes: 'Да, гол!',     yesSub: 'Контратака удалась',    no: 'Нет, упущен',    noSub: 'Защита устояла' },
    corner:        { yes: 'Да, гол!',     yesSub: 'Гол с углового',        no: 'Нет, мимо',      noSub: 'Защита выбила' },
    free_kick:     { yes: 'Да, гол!',     yesSub: 'Мяч в сетке',           no: 'Нет, в стенку',  noSub: 'Стенка или мимо' },
    penalty:       { yes: 'Да, гол!',     yesSub: 'Пенальти реализован',   no: 'Нет, мимо',      noSub: 'Вратарь спасает' },
    header:        { yes: 'Да, гол!',     yesSub: 'Удар головой в цель',   no: 'Нет, мимо',      noSub: 'Вратарь или штанга' },
    long_shot:     { yes: 'Да, гол!',     yesSub: 'Дальний удар — гол',    no: 'Нет, мимо',      noSub: 'Мяч летит мимо' },
    one_on_one:    { yes: 'Да, гол!',     yesSub: 'Нападающий не промажет', no: 'Нет, спасёт',   noSub: 'Вратарь выручит' },
  },

  // Horizontal field (100×62 viewBox, y in %, 0=top 100=bottom)
  // Attack goes RIGHT → right penalty spot at x=90, y=50
  FIELD_LAYOUTS: {
    attack: {
      gk:        { x: 96, y: 50 },
      defenders: [{ x: 80, y: 30 }, { x: 80, y: 70 }],
      attacker:  { x: 73, y: 50 },
      ball:      { x: 75, y: 50 },
    },
    counterattack: {
      gk:        { x: 96, y: 50 },
      defenders: [{ x: 70, y: 37 }, { x: 74, y: 63 }],
      attacker:  { x: 62, y: 44 },
      ball:      { x: 64, y: 43 },
    },
    corner: {
      gk:        { x: 96, y: 50 },
      defenders: [{ x: 87, y: 34 }, { x: 89, y: 57 }, { x: 83, y: 46 }],
      attacker:  { x: 98, y: 8 },
      ball:      { x: 99, y: 5 },
    },
    free_kick: {
      gk:        { x: 96, y: 50 },
      defenders: [{ x: 82, y: 43 }, { x: 82, y: 50 }, { x: 82, y: 57 }],
      attacker:  { x: 77, y: 50 },
      ball:      { x: 75, y: 48 },
    },
    penalty: {
      gk:        { x: 96, y: 50 },
      defenders: [],
      attacker:  { x: 86, y: 50 },
      ball:      { x: 90, y: 50 },
    },
    header: {
      gk:        { x: 96, y: 50 },
      defenders: [{ x: 87, y: 36 }, { x: 87, y: 64 }],
      attacker:  { x: 85, y: 33 },
      ball:      { x: 87, y: 25 },
    },
    long_shot: {
      gk:        { x: 96, y: 50 },
      defenders: [{ x: 80, y: 38 }, { x: 80, y: 62 }],
      attacker:  { x: 65, y: 50 },
      ball:      { x: 63, y: 50 },
    },
    one_on_one: {
      gk:        { x: 94, y: 50 },
      defenders: [],
      attacker:  { x: 87, y: 56 },
      ball:      { x: 88, y: 52 },
    },
  },

  // Random idle ball positions (simulate ongoing play between events)
  IDLE_POSITIONS: [
    {x:50,y:50},{x:40,y:40},{x:60,y:60},{x:55,y:35},{x:45,y:65},
    {x:35,y:50},{x:65,y:45},{x:50,y:25},{x:50,y:75},{x:30,y:35},
    {x:70,y:60},{x:60,y:30},{x:40,y:70},
  ],

  GK_NAMES:  ['Е. Савин', 'К. Воронов', 'Р. Стоев', 'Н. Крот', 'М. Белый', 'А. Громов', 'И. Полоз'],
  DEF_NAMES: ['А. Скала', 'С. Камень',  'В. Стена', 'И. Гранит', 'Д. Железо', 'Р. Твёрдый'],

  // ---- helpers ----
  rand(min, max) { return min + Math.random() * (max - min); },
  pick(arr)      { return arr[Math.floor(Math.random() * arr.length)]; },
  clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); },

  calcRating(team) {
    return team.attack * 0.35 + team.defense * 0.30 + team.midfield * 0.20 + team.formScore * 0.15;
  },

  getProb(atkRating, defRating) {
    const base  = 0.3 + (atkRating - defRating) * 0.005;
    const noise = this.rand(-0.1, 0.1);
    return this.clamp(base + noise, 0.15, 0.85);
  },

  // Virtual opponent (GK or defender depending on event type)
  _getOpp(type, defTeam) {
    const isGKEvent = ['penalty', 'one_on_one', 'free_kick', 'long_shot', 'corner', 'header'].includes(type);
    return {
      name:     this.pick(isGKEvent ? this.GK_NAMES : this.DEF_NAMES),
      pos:      isGKEvent ? 'Вратарь' : 'Защитник',
      stat:     Math.round(this.clamp(defTeam.defense + this.rand(-6, 6), 40, 99)),
      statName: 'защита',
    };
  },

  // Pick relevant attacker stat for the event
  _getPlayerStat(player, type) {
    if (type === 'counterattack') return { name: 'скорость', val: player.speed };
    if (type === 'header')        return { name: 'удар',     val: player.shot  };
    return { name: 'удар', val: player.shot };
  },

  // Feedback text shown after an answer
  // Short outcome line for event log
  getOutcomeLine(event) {
    const p = event.player.name;
    const o = event.opp.name;
    if (event.correct === 'yes') {
      const lines = {
        attack:        [`${p} переиграл ${o}.`, `${p} забил гол.`],
        counterattack: [`${p} переиграл ${o}.`, `${p} реализовал контратаку.`],
        corner:        [`${p} забил с углового.`, `Гол после навеса ${p}.`],
        free_kick:     [`${p} пробил стенку.`, `Мяч в сетке от ${p}.`],
        penalty:       [`${p} реализовал пенальти.`, `${o} не угадал угол.`],
        header:        [`${p} забил головой.`, `Точный удар головой ${p}.`],
        long_shot:     [`${p} забил издали.`, `Дальний удар ${p} — гол!`],
        one_on_one:    [`${p} переиграл ${o}.`, `${p} обыграл вратаря.`],
      };
      return this.pick(lines[event.type] || lines.attack);
    } else {
      const lines = {
        attack:        [`${o} отразил удар ${p}.`, `Линия обороны удержала ворота.`],
        counterattack: [`Защита остановила ${p}.`, `${o} перехватил мяч.`],
        corner:        [`${o} выбил мяч из штрафной.`, `Линия обороны и защита удержали ворота.`],
        free_kick:     [`Удар ${p} в стенку.`, `${o} взял мяч.`],
        penalty:       [`${o} отразил пенальти!`, `${p} пробил мимо.`],
        header:        [`${o} забрал мяч.`, `Удар головой мимо.`],
        long_shot:     [`${o} парировал удар.`, `Мяч ${p} пролетел мимо.`],
        one_on_one:    [`${o} спас ворота!`, `${p} не реализовал момент.`],
      };
      return this.pick(lines[event.type] || lines.attack);
    }
  },

  getFeedback(event, correct, playerAnswer) {
    if (correct && playerAnswer === 'yes') {
      const msgs = ['Гол! Отличное предсказание! 🎯', 'Мяч в сетке! Ты угадал!', 'Точный прогноз — атака удалась!'];
      return this.pick(msgs);
    }
    if (correct && playerAnswer === 'no') {
      const msgs = ['Точное решение. Защита устояла!', 'Момент упущен — ты был прав!', 'Правильно! Вратарь взял мяч.'];
      return this.pick(msgs);
    }
    if (!correct && playerAnswer === 'yes') {
      return 'Ошибка! Мяч прошёл мимо. −1 жизнь.';
    }
    return 'Ошибка! Гол засчитан. −1 жизнь.';
  },

  // ---- text templates ----

  _getTitle(type, attackerTeam) {
    const map = {
      attack:        () => `${attackerTeam.name} атакует!`,
      counterattack: () => `${attackerTeam.name} — контратака!`,
      corner:        () => `Угловой у ${attackerTeam.name}`,
      free_kick:     () => `Штрафной для ${attackerTeam.name}`,
      penalty:       () => `Пенальти для ${attackerTeam.name}!`,
      header:        () => `Навес в штрафную!`,
      long_shot:     () => `Дальний удар!`,
      one_on_one:    () => `${attackerTeam.name}: один на один!`,
    };
    return (map[type] || map.attack)();
  },

  _getText(type, attacker, defender, player) {
    const pName = player.name;
    const aName = attacker.name;
    const dName = defender.name;

    const templates = {
      attack: [
        `${player.pos} ${pName} находит пространство и выходит на позицию для удара по воротам ${dName}.`,
        `${pName} обыгрывает защитника и бьёт по воротам!`,
        `Острая передача — ${pName} принимает мяч и готовится к удару!`,
      ],
      counterattack: [
        `${player.pos} ${pName} тащит мяч в быстрой контратаке через центр.`,
        `${aName} разгоняет быстрый выпад, ${pName} врывается на скорости!`,
        `Быстрый перехват — ${pName} мчится к воротам ${dName}!`,
      ],
      corner: [
        `${pName} подаёт с углового в штрафную ${dName}. Суматоха у ворот!`,
        `Угловой для ${aName}! Навес в центр штрафной — игроки борются за мяч.`,
        `${pName} прицеливается перед подачей. Защита ${dName} ждёт.`,
      ],
      free_kick: [
        `${pName} готовится к прямому штрафному в 22 метрах от ворот. Стенка выстроена.`,
        `Стандартное положение для ${aName}! ${pName} берёт разбег.`,
        `Фол на краю штрафной — ${pName} берёт мяч для прямого удара.`,
      ],
      penalty: [
        `${pName} устанавливает мяч на 11-метровой отметке. Все ждут удара.`,
        `Пенальти для ${aName}! ${pName} берёт разбег — вратарь выбирает угол.`,
        `Напряжение зашкаливает — ${pName} выходит на пенальти!`,
      ],
      header: [
        `Навес с фланга в штрафную! ${pName} выпрыгивает за мячом.`,
        `Подача с фланга — ${pName} идёт на мяч головой у дальней штанги!`,
        `${aName} навешивает в штрафную — ${pName} опережает защитника!`,
      ],
      long_shot: [
        `${pName} решается на дальний удар с 28 метров! Вратарь не ждёт такого.`,
        `Неожиданный выстрел — ${pName} пробивает издали по воротам ${dName}.`,
        `${player.pos} ${pName} не ждёт и наносит удар с большой дистанции!`,
      ],
      one_on_one: [
        `${pName} прорвался! Один на один с вратарём — момент решающий.`,
        `Идеальный пас в разрез — ${pName} выскакивает один на один с голкипером!`,
        `${pName} обошёл последнего защитника и мчится к воротам!`,
      ],
    };

    return this.pick(templates[type] || templates.attack);
  },

  // Mirror layout horizontally (when team B attacks left goal)
  _mirrorLayout(layout) {
    const mx = pos => pos ? { x: 100 - pos.x, y: pos.y } : null;
    return {
      gk:        mx(layout.gk),
      defenders: (layout.defenders || []).map(mx),
      attacker:  mx(layout.attacker),
      ball:      mx(layout.ball),
    };
  },

  // ---- main generator ----

  generate(teamA, teamB, count) {
    const rA = this.calcRating(teamA);
    const rB = this.calcRating(teamB);
    const events = [];
    let scoreA = 0, scoreB = 0;
    const minuteStep = Math.floor(90 / count);

    for (let i = 0; i < count; i++) {
      const type = this.pick(this.EVENT_TYPES);
      // Weight attacks by rating — stronger team attacks more often
      const totalR = rA + rB;
      const teamAAttacks = Math.random() < (rA / totalR * 0.6 + 0.2);
      const attacker = teamAAttacks ? teamA : teamB;
      const defender  = teamAAttacks ? teamB : teamA;
      const atkR      = teamAAttacks ? rA : rB;
      const defR      = teamAAttacks ? rB : rA;

      const prob    = this.getProb(atkR, defR);
      const correct = Math.random() < prob ? 'yes' : 'no';
      const player  = this.pick(attacker.players);
      const opp     = this._getOpp(type, defender);
      const minute  = Math.max(1, Math.min(90, (i + 1) * minuteStep + Math.floor(this.rand(-3, 3))));
      const baseLayout = this.FIELD_LAYOUTS[type];
      const layout  = teamAAttacks ? baseLayout : this._mirrorLayout(baseLayout);
      const meta    = this.TYPE_META[type];
      const answers = this.ANSWERS[type];
      const pStat   = this._getPlayerStat(player, type);

      // Update simulated score
      const isGoalEvent = ['attack','counterattack','penalty','header','long_shot','one_on_one','free_kick'].includes(type);
      if (correct === 'yes' && isGoalEvent) {
        if (teamAAttacks) scoreA++; else scoreB++;
      }

      events.push({
        type,
        teamAAttacks,
        typeName:   meta.name,
        icon:       meta.icon,
        attacker,
        defender,
        player,
        opp,
        pStat,
        prob,
        correct,
        minute,
        layout,
        title:      this._getTitle(type, attacker),
        text:       this._getText(type, attacker, defender, player),
        playerLine: `С мячом ${player.name} (${player.pos}, ${pStat.name} ${pStat.val}, скорость ${player.speed})`,
        oppLine:    `Против него ${opp.name} (${opp.pos}, ${opp.statName} ${opp.stat})`,
        yesLabel:   answers.yes,
        yesSub:     answers.yesSub,
        noLabel:    answers.no,
        noSub:      answers.noSub,
        question:   'Результат этого момента?',
        scoreA,
        scoreB,
      });
    }

    return events;
  },

  // ---- Phase 1 ----

  generateMatchResult(teamA, teamB) {
    const rA   = this.calcRating(teamA);
    const rB   = this.calcRating(teamB);
    const diff = rA - rB;
    const pA    = this.clamp(0.33 + diff * 0.006 + this.rand(-0.06, 0.06), 0.15, 0.75);
    const pDraw = this.clamp(0.26 - Math.abs(diff) * 0.003 + this.rand(-0.04, 0.04), 0.10, 0.35);
    const roll  = Math.random();
    if (roll < pA) return 'A';
    if (roll < pA + pDraw) return 'draw';
    return 'B';
  },

  generateGoalTotal(teamA, teamB) {
    const avgAtk = (teamA.attack + teamB.attack) / 2;
    const prob = this.clamp(0.35 + (avgAtk - 70) * 0.008 + this.rand(-0.05, 0.05), 0.20, 0.80);
    return Math.random() < prob ? 'high' : 'low';
  },
};
