# Match Predictor — CLAUDE.md

## Что это

Казуальная HTML5-игра для **Яндекс Игр**. Симулятор спортивных прогнозов в стиле Duolingo.

Дизайн-документ: `MatchPredictor_GDD_v2.docx` в корне проекта.

**Это не азартная игра**: нет реальных денег, ставок и вывода средств.

---

## Стек

- Чистый HTML5 + CSS + JavaScript
- Без фреймворков, без сборщиков, без ES-модулей
- Яндекс Игры SDK с `localStorage` fallback для разработки
- Изображения и текстуры — через Gemini

---

## Структура проекта

```text
match/
├── index.html              # точка входа, подключает все JS
├── CLAUDE.md               # этот файл — документация проекта
├── MatchPredictor_GDD_v2.docx  # дизайн-документ
├── css/
│   └── style.css           # все стили (~6200+ строк)
├── assets/img/
│   ├── bg/                 # фоны: loading, menu, levelmap, prematch
│   ├── events/
│   │   ├── football/       # иконки событий: attack, corner, free_kick, penalty, header, long_shot, one_on_one, counterattack
│   │   └── hockey/         # иконки событий: breakaway, dangerous_attack, one_timer, power_play, rebound, shot_on_goal
│   ├── field/              # football_pitch.png, hockey_rink.png
│   ├── maps/               # CS2 карты: mirage.png (1024x1024), de_mirage_radar.png
│   ├── teams/
│   │   ├── football/       # 12 логотипов команд
│   │   └── hockey/         # 4 логотипа (остальные в процессе)
│   └── ui/                 # heart_full/empty, star_gold/empty, trophy_win, confetti, new_record
└── js/
    ├── i18n.js             # все строки на русском (объект T)
    ├── data.js             # FOOTBALL_TEAMS[], HOCKEY_TEAMS[], CS2_TEAMS[], *_LEVELS[], SECTIONS{}
    ├── sdk.js              # SDK-обёртка: save/load/ads/leaderboard
    ├── events.js           # спорт-зависимый генератор лайв-событий (football, hockey, esports)
    ├── game.js             # состояние игры + логика + сохранения
    ├── cs2sim.js           # CS2 движок симуляции — ИИ-движение игроков по карте Mirage
    ├── ui.js               # рендер всех экранов и навигация (~2300+ строк)
    └── main.js             # инициализация (SDK → loadData → showMenu)
```

**Порядок загрузки скриптов в `index.html` критически важен:**
```
i18n.js → data.js → sdk.js → events.js → game.js → cs2sim.js → ui.js → main.js
```

---

## Ключевые принципы работы

- Не меняй код вне нужного экрана или флоу.
- Для визуальных правок сначала ищи соответствующий экран в `ui.js`, а стили — в `css/style.css`.
- Для игровых данных и баланса используй `data.js`, `events.js` и `game.js`.
- Не добавляй фреймворки, сборку, TypeScript или модули.
- Не усложняй код без необходимости.
- Если что-то уже работает, не переписывай это ради "улучшения".

---

## Архитектура

### Глобальные объекты

| Объект | Файл | Назначение |
|--------|------|------------|
| `T` | `i18n.js` | Все русские строки (меню, события, достижения, CS2 карты/роли) |
| `FOOTBALL_TEAMS` | `data.js` | Массив 12 футбольных команд |
| `FOOTBALL_LEVELS` | `data.js` | Массив 12 футбольных уровней |
| `HOCKEY_TEAMS` | `data.js` | Массив 12 хоккейных команд |
| `HOCKEY_LEVELS` | `data.js` | Массив 12 хоккейных уровней |
| `CS2_TEAMS` | `data.js` | Массив 12 CS2 команд (4 тира) |
| `CS2_LEVELS` | `data.js` | Массив 12 CS2 уровней с привязкой к картам |
| `SECTIONS` | `data.js` | Конфиг разделов (`football` / `hockey` / `esports`) |
| `SDK` | `sdk.js` | Яндекс SDK wrapper |
| `Events` | `events.js` | Спорт-зависимый генератор событий |
| `Game` | `game.js` | Состояние игры и логика |
| `CS2Sim` | `cs2sim.js` | Движок реального времени — движение 10 игроков по карте |
| `UI` | `ui.js` | Все экраны и навигация |

### Вспомогательные функции из `data.js`

- `getTeamById(section, id)` — команда по id
- `getLevelData(section, levelNum)` — уровень с заполненными объектами команд

---

## Три вида спорта

Игра поддерживает 3 раздела. Каждый имеет свои данные, формулы, типы событий и UI:

| Раздел | section ID | Команд | Уровней | Ничья | Тотал порог | Движение игроков |
|--------|-----------|--------|---------|-------|-------------|------------------|
| Футбол | `football` | 12 | 12 | Да | 2.5 голов | Статичные точки + мяч |
| Хоккей | `hockey` | 12 | 12 | Нет | 5.5 шайб | Статичные точки + шайба |
| CS2 | `esports` | 12 | 12 | Нет | 26.5 раундов | CS2Sim — движение по waypoints |

---

## Игровой цикл

```text
Загрузка → Главное меню → Карта разделов → Карта уровней →
Предматч → Фаза 1 (2 вопроса) → Баннер старта →
Фаза 2 (5–8 событий) → Экран результата
```

---

## Игровая логика

### Фаза 1 — прогноз

- Q1: кто победит? (команда A / ничья / команда B) — в хоккее и CS2 без ничьей
- Q2: тотал? (футбол: < / > 2.5 голов, хоккей: < / > 5.5 шайб, CS2: < / > 26.5 раундов)
- Ошибка в фазе 1 **не отнимает жизнь** — просто не даёт очко

### Фаза 2 — лайв-события

- 5–8 событий в зависимости от уровня
- Каждый ответ: Да / Нет
- Ошибка = **−1 жизнь**
- Стартовые жизни: 3
- +1 жизнь можно получить за Rewarded Ad, 1 раз за уровень (`SDK.canShowRewardedAd('life')`)
- 0 жизней = поражение

### Очки и звёзды

Победа: `match.lives > 0 && match.score >= levelData.winThreshold`

| Счёт | Звёзды |
|------|--------|
| < winThreshold или 0 жизней | 0 (поражение) |
| ≥ winThreshold, < 8 | 1 ★ |
| ≥ 8 | 2 ★★ |
| 10 | 3 ★★★ |

### Таймер

- 25 секунд на каждый вопрос
- Цвет таймера: жёлтый (>15) → оранжевый (>7) → красный (≤7)
- Если время вышло — выбирается случайный ответ

### Вероятности событий

**Футбол:**
```javascript
// events.js → SPORTS.football.calcRating(team)
rating = attack * 0.35 + defense * 0.30 + midfield * 0.20 + formScore * 0.15

// events.js → SPORTS.football.getProb(atkRating, defRating)
base = 0.3 + (atkRating - defRating) * 0.005
noise = random(-0.1, +0.1)
final = clamp(base + noise, 0.15, 0.85)
```

**Хоккей:**
```javascript
// events.js → SPORTS.hockey.calcRating(team)
rating = attack * 0.32 + defense * 0.24 + goalie * 0.22 + tempo * 0.12 + formScore * 0.10

// events.js → SPORTS.hockey.getProb(atkRating, defRating, type)
bonus = { breakaway: +0.08, rebound: +0.04, power_play: +0.03, ... }
base = 0.31 + (atkRating - defRating) * 0.0045 + bonus[type]
noise = random(-0.08, +0.08)
final = clamp(base + noise, 0.16, 0.82)
```

**CS2:**
```javascript
// events.js → SPORTS.esports.calcRating(team)
rating = rifle * 0.30 + awp * 0.25 + utility * 0.20 + defense * 0.15 + formScore * 0.10

// events.js → SPORTS.esports.getProb(atkRating, defRating, type)
bonus = { eco_upset: -0.16, clutch: -0.08, force_buy: -0.05, awp_duel: +0.05, site_take: +0.04, bomb_plant: +0.03, ... }
base = 0.32 + (atkRating - defRating) * 0.0048 + bonus[type]
noise = random(-0.08, +0.08)
final = clamp(base + noise, 0.14, 0.82)
```

**CS2 тотал раундов:**
```javascript
// Чем ближе команды — тем больше раундов (инверсия футбола)
diff = Math.abs(calcRating(teamA) - calcRating(teamB))
prob = clamp(0.55 - diff * 0.008 + rand(-0.05, 0.05), 0.20, 0.80)
```

**formScore** (общий для всех спортов):
```javascript
pts = form.reduce((s, r) => s + (r==='W' ? 3 : r==='D' ? 1 : 0), 0)
formScore = Math.round(40 + (pts / 15) * 59)
```

---

## Данные

### Структура футбольной команды

```javascript
{
  id: 'red_eagles',
  name: 'Красные Орлы',
  shortName: 'КО',
  color: '#E53935',
  bgColor: '#FFEBEE',
  emoji: '🦅',
  attack: 88, defense: 82, midfield: 85,
  form: ['W', 'W', 'W', 'W', 'D'],
  winPct: 68, scored: 2.3, conceded: 0.9,
  players: [
    { name: 'А. Орлов', pos: 'Нападающий', shot: 92, speed: 88, dribble: 85, pass: 78 },
    { name: 'М. Крылов', pos: 'Полузащитник', shot: 75, speed: 82, dribble: 88, pass: 92 },
  ],
  // Вычисляется автоматически в data.js:
  formScore: 91,
  rating: 86,
}
```

### Структура хоккейной команды

```javascript
{
  id: 'northern_storm',
  name: 'Северный Шторм',
  shortName: 'СШ',
  color: '#00ACC1',
  bgColor: '#E0F7FA',
  emoji: '🌨️',
  attack: 89, defense: 82, goalie: 86, tempo: 84,  // нет midfield!
  form: ['W', 'W', 'W', 'D', 'W'],
  winPct: 71, scored: 4.1, conceded: 2.3,
  players: [
    { name: 'И. Морозов', pos: 'center', shot: 92, speed: 85, handling: 88, pass: 84 },
    // pos: 'center' | 'winger' | 'defender' | 'goalie'  (английские строки)
    // stat: handling вместо dribble
  ],
  formScore: 97,
  rating: 86,
}
```

### Структура CS2 команды

```javascript
{
  id: 'nova_force',
  name: 'Nova Force',
  shortName: 'NF',
  color: '#FF6B35',
  bgColor: '#1C0800',
  emoji: '💥',
  rifle: 92, awp: 89, utility: 86, defense: 83,  // уникальные статы CS2
  form: ['W', 'W', 'W', 'W', 'L'],
  winPct: 73, scored: 16.3, conceded: 11.4,       // средние раунды за/против
  players: [
    { name: 'К. Ноябрев', pos: 'entry', rating: 91, kast: 76, adr: 94, hs: 58 },
    { name: 'Д. Файлов',  pos: 'awper', rating: 88, kast: 72, adr: 82, hs: 32 },
    // pos: 'igl' | 'awper' | 'entry' | 'support' | 'lurker' | 'rifler'
    // stat: rating (HLTV), kast (%), adr (damage per round), hs (headshot %)
  ],
  formScore: 88,
  rating: 87,
}
```

### 12 CS2 команд (4 тира)

| Тир | Команды | Примерный рейтинг |
|-----|---------|-------------------|
| Tier 1 (элита) | Nova Force, Cyber Kings, Iron Pact | 85–87 |
| Tier 2 (сильные) | Ghost Protocol, Zero Hour, Neon Vortex | 78–82 |
| Tier 3 (средние) | Rapid Squad, Pixel Storm, Circuit Breakers | 73–76 |
| Tier 4 (слабые) | Static Noise, Last Boot, Rookie Ops | 65–71 |

### Структура уровня

```javascript
// Футбол/Хоккей:
{ num: 1, teamA: 'red_eagles', teamB: 'grey_lynxes', events: 5, winThreshold: 4 }

// CS2 (дополнительное поле map):
{ num: 1, teamA: 'nova_force', teamB: 'last_boot', events: 5, winThreshold: 4, map: 'mirage' }
```

### Распределение сложности (одинаковое для всех спортов)

| Уровни | Событий | winThreshold |
|--------|---------|--------------|
| 1–3 (easy) | 5 | 4 |
| 4–6 (medium) | 6 | 6 |
| 7–9 (hard) | 7 | 6 |
| 10–12 (expert) | 8 | 8 |

### Типы событий по видам спорта

**Футбол (8 типов):** `attack`, `counterattack`, `corner`, `free_kick`, `penalty`, `header`, `long_shot`, `one_on_one`

**Хоккей (6 типов):** `dangerous_attack`, `shot_on_goal`, `breakaway`, `rebound`, `power_play`, `one_timer`

**CS2 (8 типов):** `pistol_round`, `eco_upset`, `awp_duel`, `entry_frag`, `bomb_plant`, `clutch`, `force_buy`, `site_take`

### CS2 карты

7 карт привязаны к уровням:

| Карта | Emoji в уровне | Уровни |
|-------|---------------|--------|
| Mirage | 🏙️ | 1, 8 |
| Dust 2 | 🏜️ | 2, 9 |
| Inferno | 🔥 | 3, 10 |
| Ancient | 🏛️ | 4, 12 |
| Nuke | ☢️ | 5, 11 |
| Overpass | 🌉 | 6 |
| Vertigo | 🏗️ | 7 |

---

## CS2 Simulation Engine (`cs2sim.js`)

Движок реального времени для визуализации движения 10 игроков по карте Mirage.

### Как работает

- 10 игроков (5 T + 5 CT) движутся по заранее заданным маршрутам (waypoints)
- Маршруты — массивы координат `[x%, y%]` вдоль ходабельных коридоров карты
- Движение на `requestAnimationFrame` с delta-time интерполяцией
- Patrol-поведение: вперёд по маршруту, разворот в конце, обратно
- Каждый "раунд" (между событиями) — случайный выбор новых маршрутов

### Координаты карты Mirage (mirage.png 1024x1024)

```text
T Spawn  ≈ (88%, 48%)   — правый край
CT Spawn ≈ (28%, 70%)   — левый нижний угол
B Site   ≈ (14%, 22%)   — верхний левый угол
A Site   ≈ (50%, 78%)   — нижний центр
Mid      ≈ (48%, 48%)   — центр
```

### Маршруты

**T-side (5 маршрутов):**
- `t_to_a_ramp` — T Spawn → A через рампу (10 waypoints)
- `t_to_a_palace` — T Spawn → A через дворец (13 waypoints)
- `t_to_mid` — T Spawn → Mid (8 waypoints)
- `t_to_b_apps` — T Spawn → B через аппартаменты (14 waypoints)
- `t_lurk_mid` — T Spawn → середина Mid (6 waypoints, lurker)

**CT-side (5 маршрутов):**
- `ct_to_a` — CT Spawn → A Site (7 waypoints)
- `ct_to_b` — CT Spawn → B Site (9 waypoints)
- `ct_to_mid` — CT Spawn → Mid (7 waypoints)
- `ct_window` — CT Spawn → Window room (7 waypoints)
- `ct_hold_b` — CT Spawn → B short hold (6 waypoints)

### Тактические сетапы

**T-side (3 варианта, случайный выбор):**
1. A Execute — 3 игрока A, 1 Mid, 1 lurk
2. B Execute — 3 игрока B, 1 Mid, 1 lurk A
3. Mid Default — 2 Mid, 2 A, 1 B

**CT-side (2 варианта):**
1. Стандарт 2-1-2 (2 A, 1 Mid, 2 B)
2. Вариант с Window

### API

```javascript
CS2Sim.init(fieldEl, teamA, teamB)  // создаёт 10 игроков, рендерит точки
CS2Sim.start()                       // запускает requestAnimationFrame цикл
CS2Sim.stop()                        // останавливает цикл
CS2Sim.pause()                       // пауза движения (для событий)
CS2Sim.resume()                      // продолжение после паузы
CS2Sim.destroy()                     // полная очистка DOM и состояния
CS2Sim.dimAll()                      // затемнить всех (opacity 0.2) при событии
CS2Sim.restoreAll()                  // вернуть opacity 1
CS2Sim.newRound(teamAColor, teamBColor)  // новые маршруты, сброс к spawn
```

### Скорость движения

- T-side: `cfg.speed * 8` (% карты в секунду)
- CT-side: `cfg.speed * 7` (CT чуть медленнее — держат позиции)

### CSS классы

- `.cs2p` — базовый стиль игрока (10px, круг, border, glow)
- `.cs2p--t` — T-side glow (оранжевый)
- `.cs2p--ct` — CT-side glow (синий)

### Интеграция с UI

В `ui.js` CS2Sim вызывается в следующих местах:
- `_startLiveMatch()` → `CS2Sim.init()` + `CS2Sim.start()`
- `_lvIdlePlayers()` → возвращает `''` для esports (CS2Sim сам рендерит)
- `_lvTriggerEvent()` → `CS2Sim.pause()` + `CS2Sim.dimAll()`
- `_handleLiveAnswer()` → `CS2Sim.restoreAll()` + `CS2Sim.newRound()` + `CS2Sim.resume()`
- `_showGameOver()` / `_finishLevel()` → `CS2Sim.destroy()`
- `.lv-ball--esports { display: none }` — мяч скрыт для CS2

---

## UI и экраны

### Навигация

- `UI.showScreen(html, push)` — создаёт новый `div.screen`, слайдит предыдущий
- `UI.goBack()` — возвращает предыдущий экран
- `UI._clearAndShow(fn)` — удаляет все экраны и рендерит новый
- `UI.headerHtml({ title, back, lives, streak })` — строит HTML шапки экрана

### Главные функции экранов

```javascript
UI.showMenu()                        // главное меню
UI.showSections()                    // карта разделов
UI.showLevelMap(section)             // карта уровней (роутит на нужный рендер)
UI.showPreMatch(section, levelNum)   // предматчевый анализ
UI.showProfile()                     // профиль + достижения
```

### Основные экраны

- загрузка
- главное меню (очки, серия, рекорд, XP-прогрессбар, ранг, лидерборд)
- карта разделов (Футбол / Хоккей / CS2)
- карта уровней (свой рендер на каждый спорт)
- предматч (статистика, сравнение команд, ключевые игроки, 2 прогноза)
- фаза 1 (интегрирована в предматч)
- баннер старта матча
- live match (поле/карта + события + ответы Да/Нет + таймер)
- результат (счёт, звёзды, recap фаз 1+2)
- game over (0 жизней, кнопка рекламы за жизнь)
- профиль (статистика + достижения)

### Спорт-зависимый рендер

`_getSportPresentation(section)` возвращает объект с UI-конфигом для каждого спорта:
- `label`, `icon`, `liveTag`, `goalText`
- `stats` (какие характеристики сравнивать)
- `q1Title`, `q1Options`, `q2Title`, `q2Options` (прогнозы фазы 1)
- `playerStats(player)` — какие статы показывать в карточке игрока
- `resultWinnerLabel`, `resultTotalLabel`

---

## Важные экраны и где их менять

### Главное меню

- Файл: `js/ui.js` → `showMenu()`
- Стили: `css/style.css` блоки `menu-hub-*`

### Карта разделов

- Файл: `js/ui.js` → `showSections()`
- Стили: `css/style.css` блоки `section-*`

### Карта уровней

- Футбол: `_showFootballLevelMap(section, cfg, levels)`
- Хоккей: `_showHockeyLevelMap(section, cfg, levels)`
- CS2: `_showCS2LevelMap(section, cfg, levels)` — zigzag с иконками карт, неоновый оранжевый (#FF6B35)
- Стили: `.lvl-foot-*` (футбол), `.hock-*` (хоккей), `.cs2-map-*` / `.cs2-node*` (CS2)

Если задача касается **карты уровней**, правь именно нужный `_show*LevelMap(...)`.
Не трогай live match и pre-match, если пользователь говорит про уровни.

### Предматч

- Файл: `js/ui.js` → `showPreMatch(section, levelNum)`
- CS2: показывает название карты (mapLabel), статы rifle/awp/utility/defense
- Стили: `pm3-*`, `pm2-*`, `prematch-*`

### Live match

- Файл: `js/ui.js` → `_startLiveMatch()` и `_handleLiveAnswer(...)`
- Спорт-зависимая разметка через `_fieldSVG(section)` и `_getSportPresentation(section)`
- CS2: SVG пустой (карта через CSS background), CS2Sim рендерит игроков, мяч скрыт
- Статы игроков в панели: футбол/хоккей = shot + speed, CS2 = rating + ADR

### Результат

- Файл: `js/ui.js` → `_showResult(result)`

### Профиль

- Файл: `js/ui.js` → `showProfile()`

---

## CSS-переменные

```css
--green: #58CC02;
--green-dark: #46A302;
--red: #FF4B4B;
--blue: #1CB0F6;
--yellow: #FFC800;
--purple: #CE82FF;
--orange: #FF9600;
--text: #3C3C3C;
--border: #E5E5E5;
--bg: #F7F7F7;
--white: #FFFFFF;
```

### CSS-блоки по функции

| Блок | Строки (~) | Назначение |
|------|-----------|------------|
| ROOT / RESET | 1–100 | Переменные, сброс, base |
| SCREENS / NAVIGATION | 100–200 | Анимации экранов, slide |
| MENU HUB | 200–600 | Главное меню |
| SECTIONS | 600–800 | Карта разделов |
| FOOTBALL LEVELMAP | 800–1400 | Карта уровней футбол |
| HOCKEY LEVELMAP | 1400–1800 | Карта уровней хоккей |
| CS2 LEVELMAP | 1800–2200 | Карта уровней CS2 |
| PREMATCH | 2200–3200 | Предматчевый экран |
| LIVE MATCH | 3200–4700 | Поле, игроки, мяч, события, таймер |
| RESULT | 4700–5200 | Экран результата |
| GAME OVER | 5200–5400 | Оверлей поражения |
| PROFILE | 5400–5700 | Профиль и достижения |
| RESPONSIVE | 5700–6000 | Адаптив и desktop |
| ESPORTS FIELD | 6180–6230 | CS2 карта в лайв-матче, точки, .cs2p |

---

## SDK

```javascript
SDK.init()
SDK.isYandex()                          // true если работает на Яндекс Играх
SDK.save(data)
SDK.load()
SDK.saveStats({ totalScore, winStreak, gamesPlayed })
SDK.canShowRewardedAd(key)             // проверяет, использована ли реклама под ключом
SDK.markAdUsed(key)                    // помечает рекламу как использованную
SDK.resetAdUsed(key)                   // сбрасывает флаг (вызывается при startLevel)
SDK.showRewardedAd(onReward, onError)
SDK.showInterstitialAd(onClose)
SDK.submitScore(value)
SDK.notifyLoaded()
```

### Dev-режим

Если Яндекс SDK недоступен:
- сохранения идут в `localStorage`
- rewarded ad симулируется `setTimeout(..., 300)`
- interstitial тоже работает как локальная заглушка

---

## Сохранения (`Game.data`)

```javascript
{
  levels: {
    football: { '1': { best: 8, stars: 2, attempts: 3 } },
    hockey:   {},
    esports:  {},
  },
  totalScore: { football: 72, hockey: 0, esports: 0 },
  winStreak:   5,
  bestStreak:  7,
  dailyBonus:  '2026-04-05',
  achievements: ['first_win', 'streak_5'],
  settings:    { sound: true, lang: 'ru' },
  stats: {
    gamesPlayed:        0,
    gamesWon:           0,
    correctPredictions: 0,
    totalAnswers:       0,
    perfectGames:       0,
    phase1Correct:      0,
    phase1Total:        0,
    fastAnswers:        0,
  },
}
```

`Game.saveData()` вызывается автоматически после каждого уровня.

### Ключевые методы Game

```javascript
Game.startLevel(section, levelNum)           // инициализирует match
Game.answerPhase1(questionIdx, playerAnswer) // Q1 или Q2, возвращает { correct, correctAnswer }
Game.commitPhase1FromPicks(q1, q2)           // сразу оба ответа фазы 1
Game.answerPhase2(playerAnswer)              // 'yes'/'no', возвращает { correct, livesLeft, gameOver }
Game.finishMatch()                           // считает итог, обновляет stats
Game.getCurrentEvent()                       // текущее событие фазы 2
Game.addLife()                               // +1 жизнь за rewarded ad
Game.getPlayerXp()                           // суммарный XP для прогрессбара
Game.getPlayerLevelProgress()                // { level, xpInLevel, xpPerLevel }
Game.getPlayerRankTitle()                    // 'Новичок' | 'Любитель' | 'Профи' | 'Легенда'
Game.isDailyBonusAvailable()
Game.claimDailyBonus()
Game.grantMenuAdBonus()                      // +5 очков за рекламу на главном меню
```

---

## i18n (объект T)

Все строки на русском. Ключевые секции:

| Секция | Назначение |
|--------|------------|
| `T.app` | Название и слоган |
| `T.menu` | Навигация |
| `T.menuHub` | Главное меню |
| `T.sections` | Карта разделов |
| `T.cs2` | CS2-специфичное: названия карт, роли, баннер |
| `T.levels` | Карта уровней |
| `T.prematch` | Предматч |
| `T.phase1` | Фаза 1 |
| `T.phase2` | Фаза 2 |
| `T.eventTypes` / `T.eventQuestions` / `T.eventIcons` | Типы событий |
| `T.result` | Экран результата |
| `T.ads` | Рекламные окна |
| `T.achievements` | Достижения (8 штук) |
| `T.profile` | Профиль |

---

## Достижения

| ID | Название | Условие | Очки |
|----|----------|---------|------|
| `first_win` | Первая победа | Пройти первый уровень | 2 |
| `streak_3` | Тройная серия | 3 победы подряд | 3 |
| `streak_5` | Горячая форма | 5 побед подряд | 4 |
| `streak_10` | Неудержимый | 10 побед подряд | 5 |
| `perfect_10` | Идеальный матч | 10 очков за уровень | 5 |
| `football_80` | Футбольный мастер | 80+ очков в Футболе | 5 |
| `no_miss_phase1` | Ясновидящий | Угадать оба прогноза 5 раз | 3 |
| `speed_king` | Скоростной | Ответ быстрее 5 сек 10 раз | 3 |

---

## Текущее состояние MVP

### Готово

- [x] Загрузочный экран
- [x] Главное меню (очки, серия, рекорд, XP-прогрессбар, ранг)
- [x] Карта разделов (Футбол / Хоккей / CS2)
- [x] Карта уровней с zig-zag логикой (футбол)
- [x] Хоккейная карта уровней в хоккейном стиле
- [x] CS2 карта уровней с иконками карт и неоновой темой
- [x] Предматчевый экран со статистикой команд и игроками
- [x] Фаза 1 — Q1 и Q2 (спорт-зависимые)
- [x] Фаза 2 — лайв-события (спорт-зависимые)
- [x] Таймер 25 сек
- [x] Система жизней (3 ❤️)
- [x] Rewarded Ad за жизнь
- [x] Экран результата
- [x] Облачные сохранения + localStorage fallback
- [x] Interstitial реклама (каждые 3 игры)
- [x] Профиль + достижения
- [x] Ежедневный бонус
- [x] Серия побед
- [x] Футбол: 12 команд, 12 уровней, 8 типов событий
- [x] Хоккей: 12 команд, 12 уровней, 6 типов событий
- [x] CS2: 12 команд, 12 уровней, 8 типов событий
- [x] CS2: движок симуляции (CS2Sim) — 10 игроков по waypoints на Mirage
- [x] CS2: карта Mirage как фон лайв-матча

### Предстоит

- [ ] CS2: изображения событий (сейчас emoji, нет PNG иконок как у футбола/хоккея)
- [ ] CS2: карты кроме Mirage (dust2, inferno, ancient, nuke, overpass, vertigo)
- [ ] CS2: маршруты для других карт в cs2sim.js
- [ ] Хоккей: логотипы оставшихся 8 команд
- [ ] Лидерборды на Яндекс Играх
- [ ] Звуковые эффекты
- [ ] Конфетти-анимация на победу

---

## Рабочие правила для изменений

- Сначала открой нужный файл и найди реальную точку изменения.
- Если меняешь визуал — правь `css/style.css` и соответствующий экран в `ui.js`.
- Если меняешь данные — правь `data.js`.
- Если меняешь математику или вероятность — правь `events.js` / `game.js`.
- Если меняешь сохранения или SDK — правь `sdk.js` / `game.js`.
- Если меняешь CS2 движение — правь `cs2sim.js`.
- Не меняй один и тот же экран в нескольких местах без необходимости.
- Не добавляй лишние абстракции для одной задачи.
- Не оставляй дублирующиеся стили и дублирующийся JS-код.
- Следи, чтобы в `ui.js` не было синтаксических ошибок: один лишний `}` ломает весь сайт.

---

## Частые ошибки, которых нужно избегать

- Править live match вместо карты уровней (и наоборот)
- Ломать порядок загрузки скриптов в `index.html`
- Добавлять новые зависимости / фреймворки
- Переусложнять стили для одной секции
- Оставлять дублирующиеся CSS-правила
- Делать изменение в неправильном экране и думать, что «ничего не поменялось»
- Использовать одну формулу рейтинга для всех спортов — у каждого своя
- Вставлять блок `esports` в events.js вне объекта `SPORTS` (был баг — SyntaxError)
- Забыть добавить новый скрипт в `index.html` при создании нового JS-файла
- Показывать `shot`/`speed` для CS2 игроков (у них `rating`/`adr`)

---

## Разработка

Открыть локально: просто открыть `index.html` в браузере.
Сервер не нужен: нет ES-модулей и нет сборки.

Для Яндекс Игр: запаковать в ZIP, где `index.html` лежит в корне, и загрузить в кабинет разработчика.
Размер архива должен быть меньше 100 МБ.

---

## Кратко

Это чистая HTML5-игра с тремя видами спорта. Основные изменения обычно идут в `js/ui.js` и `css/style.css`.

- Если задача про **уровни** — смотри `_show*LevelMap()` и связанные стили.
- Если задача про **лайв-матч** — смотри `_startLiveMatch()`, `_handleLiveAnswer()`.
- Если задача про **CS2 движение** — смотри `cs2sim.js`.
- Если задача про **данные/баланс** — смотри `data.js` и `events.js`.

События и вероятности — спорт-зависимые: у футбола, хоккея и CS2 разные формулы, типы событий и структуры команд.
