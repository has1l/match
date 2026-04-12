'use strict';

// =============================================
// EVENTS GENERATOR — sport-aware live moments
// =============================================
const Events = {
  SPORTS: {
    football: {
      matchMinutes: 90,
      eventTypes: [
        'attack', 'counterattack', 'corner', 'free_kick',
        'penalty', 'header', 'long_shot', 'one_on_one',
      ],
      typeMeta: {
        attack:        { name: 'Острая атака',    icon: '<img src="assets/img/events/football/attack.png"        class="ev-icon-img" alt="⚡">' },
        counterattack: { name: 'Контратака',      icon: '<img src="assets/img/events/football/counterattack.png" class="ev-icon-img" alt="🏃">' },
        corner:        { name: 'Угловой',         icon: '<img src="assets/img/events/football/corner.png"        class="ev-icon-img" alt="🚩">' },
        free_kick:     { name: 'Штрафной',        icon: '<img src="assets/img/events/football/free_kick.png"     class="ev-icon-img" alt="🎯">' },
        penalty:       { name: 'Пенальти',        icon: '<img src="assets/img/events/football/penalty.png"       class="ev-icon-img" alt="🥵">' },
        header:        { name: 'Удар головой',    icon: '<img src="assets/img/events/football/header.png"        class="ev-icon-img" alt="🦅">' },
        long_shot:     { name: 'Удар издали',     icon: '<img src="assets/img/events/football/long_shot.png"     class="ev-icon-img" alt="💨">' },
        one_on_one:    { name: 'Один на один',    icon: '<img src="assets/img/events/football/one_on_one.png"    class="ev-icon-img" alt="🔥">' },
      },
      answers: {
        attack:        { yes: 'Да, гол!', yesSub: 'Атака пройдёт', no: 'Нет, мимо', noSub: 'Защита выстоит' },
        counterattack: { yes: 'Да, гол!', yesSub: 'Контратака сработает', no: 'Нет, упустят', noSub: 'Оборона успеет' },
        corner:        { yes: 'Да, гол!', yesSub: 'Подача завершится ударом', no: 'Нет, вынесут', noSub: 'Защита снимет мяч' },
        free_kick:     { yes: 'Да, гол!', yesSub: 'Стандарт зайдёт', no: 'Нет, стенка', noSub: 'Момент сорвут' },
        penalty:       { yes: 'Да, гол!', yesSub: 'Пенальти реализуют', no: 'Нет, сейв', noSub: 'Вратарь потащит' },
        header:        { yes: 'Да, гол!', yesSub: 'Замкнёт подачу', no: 'Нет, мимо', noSub: 'Защита накроет' },
        long_shot:     { yes: 'Да, гол!', yesSub: 'Дальний залетит', no: 'Нет, сейв', noSub: 'Вратарь справится' },
        one_on_one:    { yes: 'Да, гол!', yesSub: 'Нападающий решит эпизод', no: 'Нет, сейв', noSub: 'Голкипер спасёт' },
      },
      fieldLayouts: {
        attack: {
          gk: { x: 96, y: 50 },
          defenders: [{ x: 80, y: 30 }, { x: 80, y: 70 }],
          attacker: { x: 73, y: 50 },
          ball: { x: 75, y: 50 },
        },
        counterattack: {
          gk: { x: 96, y: 50 },
          defenders: [{ x: 70, y: 37 }, { x: 74, y: 63 }],
          attacker: { x: 62, y: 44 },
          ball: { x: 64, y: 43 },
        },
        corner: {
          gk: { x: 96, y: 50 },
          defenders: [{ x: 87, y: 34 }, { x: 89, y: 57 }, { x: 83, y: 46 }],
          attacker: { x: 98, y: 8 },
          ball: { x: 99, y: 5 },
        },
        free_kick: {
          gk: { x: 96, y: 50 },
          defenders: [{ x: 82, y: 43 }, { x: 82, y: 50 }, { x: 82, y: 57 }],
          attacker: { x: 77, y: 50 },
          ball: { x: 75, y: 48 },
        },
        penalty: {
          gk: { x: 96, y: 50 },
          defenders: [],
          attacker: { x: 86, y: 50 },
          ball: { x: 90, y: 50 },
        },
        header: {
          gk: { x: 96, y: 50 },
          defenders: [{ x: 87, y: 36 }, { x: 87, y: 64 }],
          attacker: { x: 85, y: 33 },
          ball: { x: 87, y: 25 },
        },
        long_shot: {
          gk: { x: 96, y: 50 },
          defenders: [{ x: 80, y: 38 }, { x: 80, y: 62 }],
          attacker: { x: 65, y: 50 },
          ball: { x: 63, y: 50 },
        },
        one_on_one: {
          gk: { x: 94, y: 50 },
          defenders: [],
          attacker: { x: 87, y: 56 },
          ball: { x: 88, y: 52 },
        },
      },
      idlePositions: [
        { x: 50, y: 50 }, { x: 40, y: 40 }, { x: 60, y: 60 }, { x: 55, y: 35 }, { x: 45, y: 65 },
        { x: 35, y: 50 }, { x: 65, y: 45 }, { x: 50, y: 25 }, { x: 50, y: 75 }, { x: 30, y: 35 },
        { x: 70, y: 60 }, { x: 60, y: 30 }, { x: 40, y: 70 },
      ],
      calcRating(team) {
        return team.attack * 0.35 + team.defense * 0.30 + team.midfield * 0.20 + team.formScore * 0.15;
      },
      getProb(atkRating, defRating) {
        const base = 0.3 + (atkRating - defRating) * 0.005;
        return Events.clamp(base + Events.rand(-0.1, 0.1), 0.15, 0.85);
      },
      getOpp(type, defTeam) {
        const isGKEvent = ['penalty', 'one_on_one', 'free_kick', 'long_shot', 'corner', 'header'].includes(type);
        if (isGKEvent) {
          const gk = defTeam.players.find(p => p.posCode === 'GK') || defTeam.players[0];
          return { id: gk.id, name: gk.name, pos: gk.pos, stat: Math.round(Events.clamp(defTeam.defense + Events.rand(-6, 6), 40, 99)), statName: 'защита' };
        }
        const defPool = defTeam.players.filter(p => ['CB','RB','LB','DM'].includes(p.posCode));
        const def = defPool.length ? Events.pick(defPool) : defTeam.players[2];
        return { id: def.id, name: def.name, pos: def.pos, stat: Math.round(Events.clamp(defTeam.defense + Events.rand(-6, 6), 40, 99)), statName: 'защита' };
      },
      getPlayerStat(player, type) {
        if (type === 'counterattack') return { name: 'скорость', val: player.speed };
        return { name: 'удар', val: player.shot };
      },
      getOutcomeLine(event) {
        const p = event.player.name;
        const o = event.opp.name;
        if (event.correct === 'yes') {
          const lines = {
            attack: [`${p} переиграл ${o}.`, `${p} забил гол.`],
            counterattack: [`${p} реализовал контратаку.`, `${p} убежал и пробил точно.`],
            corner: [`${p} замкнул подачу.`, `Гол после углового.`],
            free_kick: [`${p} пробил стенку.`, `Мяч оказался в сетке.`],
            penalty: [`${p} реализовал пенальти.`, `${o} не угадал угол.`],
            header: [`${p} забил головой.`, `${p} выиграл верх.`],
            long_shot: [`${p} попал издали.`, `Дальний удар принёс гол.`],
            one_on_one: [`${p} обыграл ${o}.`, `${p} реализовал выход один в один.`],
          };
          return Events.pick(lines[event.type] || lines.attack);
        }
        const lines = {
          attack: [`${o} остановил атаку.`, `${p} не пробил оборону.`],
          counterattack: [`Защита успела вернуться.`, `${o} сорвал выпад.`],
          corner: [`Защита выбила мяч.`, `${o} снял подачу.`],
          free_kick: [`Удар пришёлся в стенку.`, `${o} прочитал момент.`],
          penalty: [`${o} взял пенальти!`, `${p} не забил с точки.`],
          header: [`Мяч ушёл мимо.`, `${o} не дал пробить чисто.`],
          long_shot: [`${o} парировал дальний удар.`, `Попытка ${p} не прошла.`],
          one_on_one: [`${o} спас ворота!`, `${p} не реализовал шанс.`],
        };
        return Events.pick(lines[event.type] || lines.attack);
      },
      getFeedback(correct, playerAnswer) {
        if (correct && playerAnswer === 'yes') {
          return Events.pick(['Гол! Отличное чтение эпизода.', 'Мяч в сетке. Прогноз точный.', 'Атака завершилась именно так.']);
        }
        if (correct && playerAnswer === 'no') {
          return Events.pick(['Верно. Защита устояла.', 'Точный прогноз — момента не хватило.', 'Правильно, гола не было.']);
        }
        if (!correct && playerAnswer === 'yes') return 'Ошибка! Атака не завершилась голом. −1 жизнь.';
        return 'Ошибка! Момент завершился голом. −1 жизнь.';
      },
      getTitle(type, attackerTeam) {
        const map = {
          attack: () => `${attackerTeam.name} атакует!`,
          counterattack: () => `${attackerTeam.name} — контратака!`,
          corner: () => `Угловой у ${attackerTeam.name}`,
          free_kick: () => `Штрафной для ${attackerTeam.name}`,
          penalty: () => `Пенальти для ${attackerTeam.name}!`,
          header: () => `Навес в штрафную!`,
          long_shot: () => `Дальний удар!`,
          one_on_one: () => `${attackerTeam.name}: один на один!`,
        };
        return (map[type] || map.attack)();
      },
      getText(type, attacker, defender, player) {
        const p = player.name;
        const d = defender.name;
        const templates = {
          attack: [
            `${player.pos} ${p} находит пространство и выходит на удар по воротам ${d}.`,
            `${p} получает мяч между линиями и готовит решающий удар.`,
          ],
          counterattack: [
            `${attacker.name} вылетает в контратаку, ${p} ускоряется к воротам.`,
            `${p} ловит оборону ${defender.name} на свободном коридоре.`,
          ],
          corner: [
            `${p} подаёт в штрафную ${d}. Внутри площадки суматоха.`,
            `Угловой для ${attacker.name}, ${p} ищет подачей партнёра.`,
          ],
          free_kick: [
            `${p} готовится к прямому штрафному у ворот ${d}.`,
            `Стандартная ситуация для ${attacker.name}, ${p} ставит мяч на удар.`,
          ],
          penalty: [
            `${p} подходит к точке. Весь стадион ждёт удара.`,
            `${attacker.name} получает пенальти, ${p} берёт паузу перед разбегом.`,
          ],
          header: [
            `Подача идёт в штрафную, ${p} прыгает на мяч.`,
            `${p} выигрывает верх в штрафной ${d}.`,
          ],
          long_shot: [
            `${p} решается на удар издали по воротам ${d}.`,
            `Неожиданный выстрел из второй линии от ${p}.`,
          ],
          one_on_one: [
            `${p} выскакивает один на один с ${d}.`,
            `Разрезающая передача выводит ${p} на чистый момент.`,
          ],
        };
        return Events.pick(templates[type] || templates.attack);
      },
      generateMatchResult(teamA, teamB) {
        const rA = this.calcRating(teamA);
        const rB = this.calcRating(teamB);
        const diff = rA - rB;
        const pA = Events.clamp(0.33 + diff * 0.006 + Events.rand(-0.06, 0.06), 0.15, 0.75);
        const pDraw = Events.clamp(0.26 - Math.abs(diff) * 0.003 + Events.rand(-0.04, 0.04), 0.10, 0.35);
        const roll = Math.random();
        if (roll < pA) return 'A';
        if (roll < pA + pDraw) return 'draw';
        return 'B';
      },
      generateGoalTotal(teamA, teamB, threshold) {
        const avgAtk = (teamA.attack + teamB.attack) / 2;
        // Lower threshold → easier to go 'high'; adjust base probability accordingly
        const thresholdBias = (2.5 - (threshold || 2.5)) * 0.08;
        const prob = Events.clamp(0.35 + thresholdBias + (avgAtk - 70) * 0.008 + Events.rand(-0.05, 0.05), 0.20, 0.80);
        return Math.random() < prob ? 'high' : 'low';
      },
      isScoringEvent(type) {
        return ['attack', 'counterattack', 'penalty', 'header', 'long_shot', 'one_on_one', 'free_kick'].includes(type);
      },
    },
    hockey: {
      matchMinutes: 60,
      eventTypes: [
        'dangerous_attack', 'shot_on_goal', 'breakaway', 'rebound', 'power_play', 'one_timer',
      ],
      typeMeta: {
        dangerous_attack: { name: 'Опасная атака',  icon: '<img src="assets/img/events/hockey/dangerous_attack.png" class="ev-icon-img" alt="🏒">' },
        shot_on_goal:     { name: 'Бросок в створ', icon: '<img src="assets/img/events/hockey/shot_on_goal.png"     class="ev-icon-img" alt="🎯">' },
        breakaway:        { name: 'Выход 1 на 1',   icon: '<img src="assets/img/events/hockey/breakaway.png"        class="ev-icon-img" alt="⚡">' },
        rebound:          { name: 'Добивание',       icon: '<img src="assets/img/events/hockey/rebound.png"          class="ev-icon-img" alt="🥅">' },
        power_play:       { name: 'Большинство',     icon: '<img src="assets/img/events/hockey/power_play.png"       class="ev-icon-img" alt="➕">' },
        one_timer:        { name: 'One-timer',       icon: '<img src="assets/img/events/hockey/one_timer.png"        class="ev-icon-img" alt="💥">' },
      },
      answers: {
        dangerous_attack: { yes: 'Да, шайба!', yesSub: 'Атака зайдёт', no: 'Нет, сейв', noSub: 'Оборона справится' },
        shot_on_goal:     { yes: 'Да, шайба!', yesSub: 'Бросок зайдёт', no: 'Нет, сейв', noSub: 'Вратарь потащит' },
        breakaway:        { yes: 'Да, шайба!', yesSub: 'Выход 1 на 1 зайдёт', no: 'Нет, сейв', noSub: 'Голкипер выиграет дуэль' },
        rebound:          { yes: 'Да, шайба!', yesSub: 'Добивание пройдёт', no: 'Нет, накроют', noSub: 'Пятак закроют' },
        power_play:       { yes: 'Да, шайба!', yesSub: 'Большинство сработает', no: 'Нет, выстоят', noSub: 'Меньшинство выдержит' },
        one_timer:        { yes: 'Да, шайба!', yesSub: 'Бросок в касание зайдёт', no: 'Нет, мимо', noSub: 'Момент уйдёт' },
      },
      fieldLayouts: {
        dangerous_attack: {
          gk: { x: 95, y: 50 },
          defenders: [{ x: 82, y: 40 }, { x: 82, y: 60 }],
          attacker: { x: 72, y: 50 },
          ball: { x: 75, y: 52 },
        },
        shot_on_goal: {
          gk: { x: 95, y: 50 },
          defenders: [{ x: 84, y: 46 }],
          attacker: { x: 77, y: 48 },
          ball: { x: 79, y: 49 },
        },
        breakaway: {
          gk: { x: 94, y: 50 },
          defenders: [],
          attacker: { x: 85, y: 56 },
          ball: { x: 86, y: 55 },
        },
        rebound: {
          gk: { x: 95, y: 50 },
          defenders: [{ x: 88, y: 44 }, { x: 88, y: 58 }],
          attacker: { x: 89, y: 52 },
          ball: { x: 91, y: 54 },
        },
        power_play: {
          gk: { x: 95, y: 50 },
          defenders: [{ x: 81, y: 37 }, { x: 81, y: 63 }, { x: 87, y: 50 }],
          attacker: { x: 74, y: 50 },
          ball: { x: 76, y: 48 },
        },
        one_timer: {
          gk: { x: 95, y: 50 },
          defenders: [{ x: 86, y: 41 }, { x: 86, y: 60 }],
          attacker: { x: 80, y: 36 },
          ball: { x: 83, y: 40 },
        },
      },
      idlePositions: [
        { x: 50, y: 50 }, { x: 44, y: 40 }, { x: 58, y: 58 }, { x: 61, y: 33 }, { x: 39, y: 67 },
        { x: 30, y: 48 }, { x: 69, y: 45 }, { x: 50, y: 22 }, { x: 51, y: 77 }, { x: 35, y: 31 },
        { x: 74, y: 58 }, { x: 63, y: 27 }, { x: 42, y: 73 },
      ],
      calcRating(team) {
        return team.attack * 0.32 + team.defense * 0.24 + team.goalie * 0.22 + team.tempo * 0.12 + team.formScore * 0.10;
      },
      getProb(atkRating, defRating, type) {
        const bonus = {
          dangerous_attack: 0.00,
          shot_on_goal: -0.02,
          breakaway: 0.08,
          rebound: 0.04,
          power_play: 0.03,
          one_timer: 0.01,
        };
        const base = 0.31 + (atkRating - defRating) * 0.0045 + (bonus[type] || 0);
        return Events.clamp(base + Events.rand(-0.08, 0.08), 0.16, 0.82);
      },
      getOpp(type, defTeam) {
        const isGoalie = ['shot_on_goal', 'breakaway', 'rebound', 'one_timer'].includes(type);
        const baseStat = isGoalie ? defTeam.goalie : defTeam.defense;
        if (isGoalie) {
          const gk = defTeam.players.find(p => p.pos === 'goalie') || defTeam.players[0];
          return { name: gk.name, pos: 'Вратарь', stat: Math.round(Events.clamp(baseStat + Events.rand(-6, 6), 40, 99)), statName: 'save' };
        }
        const defPool = defTeam.players.filter(p => p.pos === 'defender');
        const def = defPool.length ? Events.pick(defPool) : defTeam.players[1];
        return { name: def.name, pos: 'Защитник', stat: Math.round(Events.clamp(baseStat + Events.rand(-6, 6), 40, 99)), statName: 'defense' };
      },
      getPlayerStat(player, type) {
        if (type === 'breakaway') return { name: 'скорость', val: player.speed };
        return { name: 'бросок', val: player.shot };
      },
      getOutcomeLine(event) {
        const p = event.player.name;
        const o = event.opp.name;
        if (event.correct === 'yes') {
          const lines = {
            dangerous_attack: [`${p} завершил атаку шайбой.`, `${p} продавил пятак и забил.`],
            shot_on_goal: [`${p} прошил ${o}.`, `Бросок ${p} стал шайбой.`],
            breakaway: [`${p} реализовал выход 1 на 1.`, `${p} переиграл ${o}.`],
            rebound: [`${p} первым оказался на добивании.`, `Шайба после отскока оказалась в воротах.`],
            power_play: [`${event.attacker.name} реализовал большинство.`, `${p} замкнул розыгрыш.`],
            one_timer: [`${p} попал в касание.`, `One-timer от ${p} прошёл точно.`],
          };
          return Events.pick(lines[event.type] || lines.dangerous_attack);
        }
        const lines = {
          dangerous_attack: [`Оборона сняла момент.`, `${o} помог закрыть слот.`],
          shot_on_goal: [`${o} сделал сэйв.`, `Вратарь потащил бросок ${p}.`],
          breakaway: [`${o} выиграл дуэль.`, `${p} не реализовал выход.`],
          rebound: [`Шайбу накрыли на пятаке.`, `${o} не дал добить.`],
          power_play: [`Меньшинство выстояло.`, `${o} прочитал розыгрыш.`],
          one_timer: [`Бросок ушёл мимо.`, `${o} успел сместиться под бросок.`],
        };
        return Events.pick(lines[event.type] || lines.shot_on_goal);
      },
      getFeedback(correct, playerAnswer) {
        if (correct && playerAnswer === 'yes') {
          return Events.pick(['Шайба! Ты точно прочитал эпизод.', 'Есть гол в хоккейном моменте.', 'Точный прогноз — взятие ворот.']);
        }
        if (correct && playerAnswer === 'no') {
          return Events.pick(['Верно. Вратарь или защита закрыли эпизод.', 'Точный прогноз — без шайбы.', 'Правильно, оборона справилась.']);
        }
        if (!correct && playerAnswer === 'yes') return 'Ошибка! Взятия ворот не было. −1 жизнь.';
        return 'Ошибка! Момент завершился шайбой. −1 жизнь.';
      },
      getTitle(type, attackerTeam) {
        const map = {
          dangerous_attack: () => `${attackerTeam.name} врывается в зону!`,
          shot_on_goal: () => `Бросок в створ от ${attackerTeam.name}`,
          breakaway: () => `${attackerTeam.name}: выход 1 на 1!`,
          rebound: () => `Шанс на добивание!`,
          power_play: () => `${attackerTeam.name} играет в большинстве`,
          one_timer: () => `Момент под бросок в касание!`,
        };
        return (map[type] || map.dangerous_attack)();
      },
      getText(type, attacker, defender, player) {
        const p = player.name;
        const d = defender.name;
        const templates = {
          dangerous_attack: [
            `${attacker.name} закрепился в зоне, ${p} выезжает на бросковую позицию у ворот ${d}.`,
            `${p} получает шайбу в полукруге и ищет щель у ворот ${d}.`,
          ],
          shot_on_goal: [
            `${p} наносит плотный бросок из круга вбрасывания по воротам ${d}.`,
            `${attacker.name} довёл шайбу до броска, ${p} заряжает в створ.`,
          ],
          breakaway: [
            `${p} убегает один на один с ${d}. Момент решающий.`,
            `Разрезающий пас выводит ${p} на чистый выход к воротам.`,
          ],
          rebound: [
            `${p} оказывается первым на отскоке перед воротами ${d}.`,
            `После первого броска шайба остаётся на пятаке — ${p} идёт на добивание.`,
          ],
          power_play: [
            `${attacker.name} катает большинство, ${p} ждёт передачу под бросок.`,
            `Пятёрка ${attacker.name} растягивает оборону ${defender.name} в большинстве.`,
          ],
          one_timer: [
            `${p} подставляет клюшку под передачу и бьёт в касание.`,
            `Передача проходит через слот, ${p} готовит one-timer.`,
          ],
        };
        return Events.pick(templates[type] || templates.dangerous_attack);
      },
      generateMatchResult(teamA, teamB) {
        const rA = this.calcRating(teamA);
        const rB = this.calcRating(teamB);
        const diff = rA - rB;
        const pA = Events.clamp(0.5 + diff * 0.006 + Events.rand(-0.05, 0.05), 0.18, 0.82);
        return Math.random() < pA ? 'A' : 'B';
      },
      generateGoalTotal(teamA, teamB, threshold) {
        const avgAtk = (teamA.attack + teamB.attack) / 2;
        const avgTempo = (teamA.tempo + teamB.tempo) / 2;
        const thresholdBias = (5.5 - (threshold || 5.5)) * 0.06;
        const prob = Events.clamp(0.42 + thresholdBias + (avgAtk - 70) * 0.006 + (avgTempo - 70) * 0.005 + Events.rand(-0.05, 0.05), 0.24, 0.82);
        return Math.random() < prob ? 'high' : 'low';
      },
      isScoringEvent(type) {
        return ['dangerous_attack', 'shot_on_goal', 'breakaway', 'rebound', 'power_play', 'one_timer'].includes(type);
      },
    },
    esports: {
      matchMinutes: 30,
      eventTypes: [
        'pistol_round', 'eco_upset', 'awp_duel', 'entry_frag',
        'bomb_plant', 'clutch', 'force_buy', 'site_take',
      ],
      typeMeta: {
        pistol_round: { name: 'Пистолетный раунд', icon: '🔫' },
        eco_upset:    { name: 'Эко-раунд',          icon: '💸' },
        awp_duel:     { name: 'AWP дуэль',           icon: '🎯' },
        entry_frag:   { name: 'Entry фраг',          icon: '🚪' },
        bomb_plant:   { name: 'Закладка бомбы',      icon: '💣' },
        clutch:       { name: 'Клатч 1vX',           icon: '😤' },
        force_buy:    { name: 'Force buy',           icon: '⚡' },
        site_take:    { name: 'Захват сайта',         icon: '🏁' },
      },
      answers: {
        pistol_round: { yes: 'Да, выиграют!',   yesSub: 'Пистолетный раунд за ними', no: 'Нет, проиграют', noSub: 'Противник сильнее' },
        eco_upset:    { yes: 'Да, upset!',       yesSub: 'Эко-раунд на удивление',    no: 'Нет, не выйдет', noSub: 'Пистолеты не хватит' },
        awp_duel:     { yes: 'Да, AWPер убьёт!', yesSub: 'Снайпер точнее',           no: 'Нет, переиграют', noSub: 'Рифл выиграет дуэль' },
        entry_frag:   { yes: 'Да, войдут!',      yesSub: 'Entry зачистит угол',       no: 'Нет, не зайдут',  noSub: 'CT держит позицию' },
        bomb_plant:   { yes: 'Да, посадят!',      yesSub: 'Успеют заложить бомбу',    no: 'Нет, не успеют',  noSub: 'CT закроет позицию' },
        clutch:       { yes: 'Да, клатч!',        yesSub: 'Выиграет в меньшинстве',   no: 'Нет, проиграет',  noSub: 'Численное превосходство' },
        force_buy:    { yes: 'Да, выиграют!',     yesSub: 'Force buy сработает',      no: 'Нет, сольют',     noSub: 'Оружия не хватит' },
        site_take:    { yes: 'Да, захватят!',     yesSub: 'Сайт будет за ними',       no: 'Нет, отстоят',    noSub: 'CT выдержит атаку' },
      },
      // Coordinates based on mirage.png (1024x1024):
      // T spawn: right ~x88 y48 | CT spawn: left-bottom ~x28 y70
      // B site: top-left ~x14 y22 | A site: bottom-center ~x50 y77 | Mid: ~x47 y48
      fieldLayouts: {
        pistol_round: {
          // Both sides meet in mid at round start
          gk:        { x: 38, y: 58 },
          defenders: [{ x: 44, y: 52 }, { x: 32, y: 55 }],
          attacker:  { x: 66, y: 50 },
          ball:      { x: 64, y: 50 },
        },
        eco_upset: {
          // T pushing B apps with pistols
          gk:        { x: 18, y: 24 },
          defenders: [{ x: 22, y: 20 }],
          attacker:  { x: 36, y: 30 },
          ball:      { x: 34, y: 29 },
        },
        awp_duel: {
          // Mid sightline — T top mid vs CT window
          gk:        { x: 32, y: 46 },
          defenders: [],
          attacker:  { x: 66, y: 47 },
          ball:      { x: 64, y: 47 },
        },
        entry_frag: {
          // T entry fragging B short
          gk:        { x: 16, y: 22 },
          defenders: [{ x: 20, y: 18 }],
          attacker:  { x: 28, y: 26 },
          ball:      { x: 27, y: 25 },
        },
        bomb_plant: {
          // T planting at A site
          gk:        { x: 42, y: 74 },
          defenders: [{ x: 38, y: 78 }],
          attacker:  { x: 50, y: 77 },
          ball:      { x: 50, y: 77 },
        },
        clutch: {
          // Post-plant 1vX on A site
          gk:        { x: 44, y: 73 },
          defenders: [{ x: 40, y: 77 }, { x: 48, y: 72 }],
          attacker:  { x: 52, y: 76 },
          ball:      { x: 51, y: 76 },
        },
        force_buy: {
          // T force buy — mid window push
          gk:        { x: 36, y: 48 },
          defenders: [{ x: 30, y: 52 }],
          attacker:  { x: 58, y: 47 },
          ball:      { x: 56, y: 47 },
        },
        site_take: {
          // Full B execute
          gk:        { x: 12, y: 22 },
          defenders: [{ x: 16, y: 18 }, { x: 18, y: 28 }],
          attacker:  { x: 22, y: 24 },
          ball:      { x: 21, y: 23 },
        },
      },
      idlePositions: [
        // T side / T spawn area
        { x: 88, y: 48 }, { x: 78, y: 50 }, { x: 70, y: 54 },
        // Mid
        { x: 58, y: 46 }, { x: 47, y: 48 }, { x: 36, y: 50 },
        // B side
        { x: 26, y: 30 }, { x: 16, y: 22 },
        // A side
        { x: 60, y: 64 }, { x: 50, y: 77 },
        // CT spawn area
        { x: 28, y: 70 }, { x: 38, y: 66 }, { x: 44, y: 74 },
      ],
      ctNames: ['А. Кирпич', 'С. Щит', 'В. Стена', 'И. Форт', 'Д. Бункер'],
      tNames:  ['Г. Буря', 'Р. Штурм', 'Т. Пробой', 'Ф. Рывок', 'Н. Клин'],
      calcRating(team) {
        return team.rifle * 0.30 + team.awp * 0.25 + team.utility * 0.20 + team.defense * 0.15 + team.formScore * 0.10;
      },
      getProb(atkRating, defRating, type) {
        const bonus = {
          pistol_round: -0.02,
          eco_upset:    -0.16,
          awp_duel:      0.05,
          entry_frag:    0.02,
          bomb_plant:    0.03,
          clutch:       -0.08,
          force_buy:    -0.05,
          site_take:     0.04,
        };
        const base = 0.32 + (atkRating - defRating) * 0.0048 + (bonus[type] || 0);
        return Events.clamp(base + Events.rand(-0.08, 0.08), 0.14, 0.82);
      },
      getOpp(type, defTeam) {
        const isCT = ['entry_frag', 'bomb_plant', 'site_take', 'clutch'].includes(type);
        const names = isCT ? this.ctNames : this.tNames;
        const baseStat = isCT ? defTeam.defense : defTeam.rifle;
        return {
          name: Events.pick(names),
          pos: isCT ? 'CT' : 'CT',
          stat: Math.round(Events.clamp(baseStat + Events.rand(-6, 6), 40, 99)),
          statName: 'защита',
        };
      },
      getPlayerStat(player, type) {
        if (type === 'awp_duel') return { name: 'AWP', val: Math.round(80 + (player.rating - 60) * 0.4) };
        if (type === 'clutch')   return { name: 'KAST', val: player.kast };
        return { name: 'рейтинг', val: player.rating };
      },
      getOutcomeLine(event) {
        const p = event.player.name;
        const o = event.opp.name;
        if (event.correct === 'yes') {
          const lines = {
            pistol_round: [`${p} выиграл пистолетный раунд.`, `${event.attacker.name} взяли пистолет.`],
            eco_upset:    [`Эко-раунд — неожиданный upset от ${p}!`, `${p} выиграл раунд с пистолетом.`],
            awp_duel:     [`${p} снял противника точным выстрелом.`, `AWPер ${p} выиграл дуэль.`],
            entry_frag:   [`${p} вошёл первым и зачистил угол.`, `${p} открыл сайт для команды.`],
            bomb_plant:   [`${p} успел заложить бомбу.`, `Бомба посажена — ${event.attacker.name} в плюсе.`],
            clutch:       [`${p} вытащил клатч!`, `Один против всех — ${p} справился.`],
            force_buy:    [`Force buy ${event.attacker.name} сработал!`, `${p} выиграл раунд с SMG.`],
            site_take:    [`${event.attacker.name} захватили сайт.`, `${p} провёл идеальный заход.`],
          };
          return Events.pick(lines[event.type] || lines.entry_frag);
        }
        const lines = {
          pistol_round: [`${o} удержал позицию.`, `CT выиграл пистолетный раунд.`],
          eco_upset:    [`${o} зачистил эко-раунд.`, `Rifles оказались сильнее.`],
          awp_duel:     [`${o} переиграл AWPера.`, `${p} промахнулся.`],
          entry_frag:   [`${o} держит угол.`, `${p} не прошёл вход.`],
          bomb_plant:   [`${o} не дал заложить бомбу.`, `CT закрыл позицию вовремя.`],
          clutch:       [`${o} не дал вытащить клатч.`, `Численное превосходство решило.`],
          force_buy:    [`${o} сдержал force buy.`, `Rifles оказались сильнее SMG.`],
          site_take:    [`${o} отстоял сайт.`, `CT выдержал штурм.`],
        };
        return Events.pick(lines[event.type] || lines.entry_frag);
      },
      getFeedback(correct, playerAnswer) {
        if (correct && playerAnswer === 'yes') {
          return Events.pick(['Верно! Раунд за атакой.', 'Точный прогноз — T side взяли раунд.', 'Отлично прочитал эпизод.']);
        }
        if (correct && playerAnswer === 'no') {
          return Events.pick(['Верно. CT устояли.', 'Точный прогноз — CT выдержали.', 'Правильно, атака не прошла.']);
        }
        if (!correct && playerAnswer === 'yes') return 'Ошибка! Атака не прошла. −1 жизнь.';
        return 'Ошибка! Раунд взяли атакующие. −1 жизнь.';
      },
      getTitle(type, attackerTeam) {
        const map = {
          pistol_round: () => `${attackerTeam.name}: пистолетный раунд!`,
          eco_upset:    () => `${attackerTeam.name} идут на эко`,
          awp_duel:     () => `AWP дуэль — ${attackerTeam.name}`,
          entry_frag:   () => `${attackerTeam.name} врываются!`,
          bomb_plant:   () => `${attackerTeam.name} закладывают бомбу`,
          clutch:       () => `Клатч для ${attackerTeam.name}!`,
          force_buy:    () => `${attackerTeam.name}: force buy!`,
          site_take:    () => `${attackerTeam.name} идут на сайт!`,
        };
        return (map[type] || map.entry_frag)();
      },
      getText(type, attacker, defender, player) {
        const p = player.name;
        const d = defender.name;
        const templates = {
          pistol_round: [
            `${attacker.name} начинают раунд с пистолетами, ${p} ищет открытие.`,
            `${p} выходит с Glock/USP на коротком расстоянии.`,
          ],
          eco_upset: [
            `${p} берёт пистолет против rifles — один шанс сделать upset.`,
            `${attacker.name} экономят, но ${p} готов пойти ва-банк.`,
          ],
          awp_duel: [
            `${p} встаёт с AWP в длинном коридоре против ${d}.`,
            `AWPер ${attacker.name} держит пик — ${p} ждёт движения.`,
          ],
          entry_frag: [
            `${p} первым врывается в угол ${d}.`,
            `${attacker.name} заходят через дым, ${p} идёт первым.`,
          ],
          bomb_plant: [
            `${p} пробегает к точке закладки под огнём ${d}.`,
            `${attacker.name} вышли на сайт, ${p} ставит бомбу.`,
          ],
          clutch: [
            `${p} остался один против нескольких из ${d}.`,
            `Клатч-ситуация — ${p} должен разобраться со всеми.`,
          ],
          force_buy: [
            `${attacker.name} покупают MP9/UMP, ${p} атакует с SMG.`,
            `${p} идёт агрессивно с force buy против rifles ${d}.`,
          ],
          site_take: [
            `${attacker.name} исполняют execute на сайт, ${p} ведёт заход.`,
            `Гранаты летят, ${p} врывается первым через дым на сайт ${d}.`,
          ],
        };
        return Events.pick(templates[type] || templates.entry_frag);
      },
      generateMatchResult(teamA, teamB) {
        const rA = this.calcRating(teamA);
        const rB = this.calcRating(teamB);
        const diff = rA - rB;
        const pA = Events.clamp(0.5 + diff * 0.006 + Events.rand(-0.05, 0.05), 0.15, 0.85);
        return Math.random() < pA ? 'A' : 'B';
      },
      generateGoalTotal(teamA, teamB) {
        const diff = Math.abs(this.calcRating(teamA) - this.calcRating(teamB));
        const prob = Events.clamp(0.55 - diff * 0.008 + Events.rand(-0.05, 0.05), 0.20, 0.80);
        return Math.random() < prob ? 'high' : 'low';
      },
      isScoringEvent(type) {
        return ['pistol_round', 'eco_upset', 'awp_duel', 'entry_frag', 'bomb_plant', 'clutch', 'force_buy', 'site_take'].includes(type);
      },
    },
  },

  rand(min, max) { return min + Math.random() * (max - min); },
  pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; },
  clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); },

  _profile(section) {
    return this.SPORTS[section] || this.SPORTS.football;
  },

  getIdlePositions(section) {
    return this._profile(section).idlePositions;
  },

  calcRating(team, section = 'football') {
    return this._profile(section).calcRating(team);
  },

  // Pick an appropriate attacker by event type — never picks GK
  _pickAttacker(section, type, team) {
    const all = team.players;
    if (section === 'football') {
      // corner / free_kick — midfielders or wingers
      if (type === 'corner' || type === 'free_kick') {
        const pool = all.filter(p => ['CM','AM','RW','LW','DM'].includes(p.posCode));
        if (pool.length) return this.pick(pool);
      }
      // penalty / one_on_one / attack — forwards first, fallback mid
      if (type === 'penalty' || type === 'one_on_one' || type === 'attack') {
        const pool = all.filter(p => ['ST','LW','RW','AM'].includes(p.posCode));
        if (pool.length) return this.pick(pool);
      }
      // counterattack — fast players (forwards + wide mids)
      if (type === 'counterattack') {
        const pool = all.filter(p => ['ST','LW','RW'].includes(p.posCode));
        if (pool.length) return this.pick(pool);
      }
      // header — forwards + defenders who attack corners
      if (type === 'header') {
        const pool = all.filter(p => ['ST','CB','AM','CM'].includes(p.posCode));
        if (pool.length) return this.pick(pool);
      }
      // long_shot — midfielders
      if (type === 'long_shot') {
        const pool = all.filter(p => ['CM','AM','DM','LW','RW'].includes(p.posCode));
        if (pool.length) return this.pick(pool);
      }
      // default football: anyone except GK
      const pool = all.filter(p => p.posCode !== 'GK');
      return pool.length ? this.pick(pool) : all[0];
    }
    if (section === 'hockey') {
      // goalie never attacks
      const pool = all.filter(p => p.pos !== 'goalie');
      return pool.length ? this.pick(pool) : all[0];
    }
    // esports / other — no GK concept, pick anyone
    return this.pick(all);
  },

  _mirrorLayout(layout) {
    const mx = (pos) => pos ? { x: 100 - pos.x, y: pos.y } : null;
    return {
      gk: mx(layout.gk),
      defenders: (layout.defenders || []).map(mx),
      attacker: mx(layout.attacker),
      ball: mx(layout.ball),
    };
  },

  getOutcomeLine(event) {
    return this._profile(event.section).getOutcomeLine(event);
  },

  getFeedback(event, correct, playerAnswer) {
    return this._profile(event.section).getFeedback(correct, playerAnswer);
  },

  generate(section, teamA, teamB, count) {
    const profile = this._profile(section);
    const rA = profile.calcRating(teamA);
    const rB = profile.calcRating(teamB);
    const events = [];
    let scoreA = 0;
    let scoreB = 0;
    const minuteStep = Math.max(1, Math.floor(profile.matchMinutes / count));

    for (let i = 0; i < count; i++) {
      const type = this.pick(profile.eventTypes);
      const totalR = rA + rB;
      const teamAAttacks = Math.random() < (rA / totalR * 0.6 + 0.2);
      const attacker = teamAAttacks ? teamA : teamB;
      const defender = teamAAttacks ? teamB : teamA;
      const atkR = teamAAttacks ? rA : rB;
      const defR = teamAAttacks ? rB : rA;

      const prob = profile.getProb(atkR, defR, type);
      const correct = Math.random() < prob ? 'yes' : 'no';
      const player = this._pickAttacker(section, type, attacker);
      const opp = profile.getOpp(type, defender);
      const minute = Math.max(1, Math.min(profile.matchMinutes, (i + 1) * minuteStep + Math.floor(this.rand(-2, 3))));
      const baseLayout = profile.fieldLayouts[type];
      const layout = teamAAttacks ? baseLayout : this._mirrorLayout(baseLayout);
      const meta = profile.typeMeta[type];
      const answers = profile.answers[type];
      const pStat = profile.getPlayerStat(player, type);

      if (correct === 'yes' && profile.isScoringEvent(type)) {
        if (teamAAttacks) scoreA++;
        else scoreB++;
      }

      events.push({
        section,
        type,
        teamAAttacks,
        typeName: meta.name,
        icon: meta.icon,
        attacker,
        defender,
        player,
        opp,
        pStat,
        prob,
        correct,
        minute,
        layout,
        title: profile.getTitle(type, attacker),
        text: profile.getText(type, attacker, defender, player),
        playerLine: section === 'esports'
          ? `Играет ${player.name} (${player.pos}, ${pStat.name} ${pStat.val}, ADR ${player.adr})`
          : `${section === 'hockey' ? 'С шайбой' : 'С мячом'} ${player.name} (${player.pos}, ${pStat.name} ${pStat.val}, скорость ${player.speed})`,
        oppLine: `Против него ${opp.name} (${opp.pos}, ${opp.statName} ${opp.stat})`,
        yesLabel: answers.yes,
        yesSub: answers.yesSub,
        noLabel: answers.no,
        noSub: answers.noSub,
        question: 'Чем закончится этот момент?',
        scoreA,
        scoreB,
      });
    }

    return events;
  },

  generateMatchResult(section, teamA, teamB) {
    return this._profile(section).generateMatchResult(teamA, teamB);
  },

  generateGoalTotal(section, teamA, teamB, threshold) {
    return this._profile(section).generateGoalTotal(teamA, teamB, threshold);
  },
};
