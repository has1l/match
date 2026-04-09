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
├── css/style.css           # все стили
├── assets/img/             # сюда кладём картинки от Gemini
└── js/
    ├── i18n.js             # все строки на русском (объект T)
    ├── data.js             # FOOTBALL_TEAMS[], HOCKEY_TEAMS[], FOOTBALL_LEVELS[], HOCKEY_LEVELS[], SECTIONS{}
    ├── sdk.js              # SDK-обёртка: save/load/ads/leaderboard
    ├── events.js           # спорт-зависимый генератор лайв-событий
    ├── game.js             # состояние игры + логика + сохранения
    ├── ui.js               # рендер всех экранов и навигация
    └── main.js             # инициализация (SDK → loadData → showMenu)
```

**Порядок загрузки скриптов в `index.html` важен:**
`i18n.js → data.js → sdk.js → events.js → game.js → ui.js → main.js`

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
| `T` | `i18n.js` | Все русские строки |
| `FOOTBALL_TEAMS` | `data.js` | Массив 12 футбольных команд |
| `FOOTBALL_LEVELS` | `data.js` | Массив 12 футбольных уровней |
| `HOCKEY_TEAMS` | `data.js` | Массив 12 хоккейных команд |
| `HOCKEY_LEVELS` | `data.js` | Массив 12 хоккейных уровней |
| `SECTIONS` | `data.js` | Конфиг разделов (`football` / `hockey` / `esports`) |
| `SDK` | `sdk.js` | Яндекс SDK wrapper |
| `Events` | `events.js` | Спорт-зависимый генератор событий |
| `Game` | `game.js` | Состояние игры и логика |
| `UI` | `ui.js` | Все экраны и навигация |

### Вспомогательные функции из `data.js`

- `getTeamById(section, id)` — команда по id
- `getLevelData(section, levelNum)` — уровень с заполненными объектами команд

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

- Q1: кто победит? (команда A / ничья / команда B)
- Q2: тотал голов/шайб? (меньше 2.5 / больше 2.5)
- Ошибка в фазе 1 **не отнимает жизнь** — просто не даёт очко
- В хоккее ничья невозможна — `generateMatchResult` возвращает только 'A' или 'B'

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
- Цвет таймера: зелёный (>15) → жёлтый (>7) → красный (≤7)
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

**formScore** (общий для обоих спортов):
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
  // Вычисляется автоматически в data.js:
  formScore: 97,
  rating: 86,
}
```

### Структура уровня

```javascript
{ num: 1, teamA: 'red_eagles', teamB: 'grey_lynxes', events: 5, winThreshold: 4 }
```

### Распределение сложности

**Футбол:**

| Уровни | Событий | winThreshold |
|--------|---------|--------------|
| 1–3 (easy)   | 5 | 4 |
| 4–6 (medium) | 6 | 6 |
| 7–9 (hard)   | 7 | 6 |
| 10–12 (expert)| 8 | 8 |

**Хоккей** — такое же распределение (4 / 6 / 6 / 8).

### Типы событий по видам спорта

**Футбол:** `attack`, `counterattack`, `corner`, `free_kick`, `penalty`, `header`, `long_shot`, `one_on_one`

**Хоккей:** `dangerous_attack`, `shot_on_goal`, `breakaway`, `rebound`, `power_play`, `one_timer`

---

## UI и экраны

### Навигация

- `UI.showScreen(html, push)` — создаёт новый `div.screen`, слайдит предыдущий
- `UI.goBack()` — возвращает предыдущий экран
- `UI._clearAndShow(fn)` — удаляет все экраны и рендерит новый
- `UI.headerHtml({ title, back, lives, streak })` — строит HTML шапки экрана

### Главные функции экранов

```javascript
UI.showMenu()
UI.showSections()
UI.showLevelMap(section)
UI.showPreMatch(section, levelNum)
UI.showProfile()
```

### Основные экраны

- загрузка
- главное меню
- карта разделов
- карта уровней
- предматч
- фаза 1
- баннер старта
- live match
- результат
- профиль

---

## Важные экраны и где их менять

### Главное меню

- Файл: `js/ui.js`
- Ищется по `showMenu()`
- Стили: `css/style.css` блоки `menu-hub-*`

### Карта разделов

- Файл: `js/ui.js`
- Ищется по `showSections()`
- Стили: `css/style.css` блоки `section-*`

### Карта уровней

- Футбол: `_showFootballLevelMap(section, cfg, levels)`
- Хоккей: `_showHockeyLevelMap(section, cfg, levels)`
- Базовая карта: запасной рендер внутри `showLevelMap(section)`

Если задача касается **хоккейной дорожки уровней**, правь именно `_showHockeyLevelMap(...)` и связанные стили `.hock-*` / `.lvl-foot-root--hockey`.
Не трогай live match и pre-match, если пользователь говорит именно про уровни.

### Предматч

- Файл: `js/ui.js`
- Ищется по `showPreMatch(section, levelNum)`
- Стили: `pm3-*`, `pm2-*`, а также общие `prematch-*`

### Live match

- Файл: `js/ui.js`
- Ищется по `_startLiveMatch()` и `_handlePhase2Answer(...)`
- Спорт-зависимая разметка создаётся через `_fieldSVG(section)` и `_getSportPresentation(section)`

### Результат

- Файл: `js/ui.js`
- Ищется по `_showResult(result)`

### Профиль

- Файл: `js/ui.js`
- Ищется по `showProfile()`

---

## CSS-переменные

```css
--green: #58CC02
--red: #FF4B4B
--blue: #1CB0F6
--yellow: #FFC800
--purple: #CE82FF
--text: #3C3C3C
--border: #E5E5E5
```

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
    phase1Correct:      0,   // верных ответов в фазе 1
    phase1Total:        0,   // всего вопросов в фазе 1
    fastAnswers:        0,   // ответов быстрее 5 сек
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

## Текущее состояние MVP

### Готово

- [x] Загрузочный экран
- [x] Главное меню (очки, серия, рекорд, XP-прогрессбар, ранг)
- [x] Карта разделов (Футбол / Хоккей / Киберспорт)
- [x] Карта уровней с zig-zag логикой (футбол)
- [x] Хоккейная карта уровней в хоккейном стиле
- [x] Предматчевый экран со статистикой команд и игроками
- [x] Фаза 1 — Q1 и Q2
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

### Предстоит

- [ ] Изображения команд (Gemini)
- [ ] Киберспорт: полный контент (команды, уровни, события)
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
- Не меняй один и тот же экран в нескольких местах без необходимости.
- Не добавляй лишние абстракции для одной задачи.
- Не оставляй дублирующиеся стили и дублирующийся JS-код.
- Следи, чтобы в `ui.js` не было синтаксических ошибок: один лишний `}` ломает весь сайт.

---

## Частые ошибки, которых нужно избегать

- Править live match вместо карты уровней
- Править pre-match вместо карты уровней
- Ломать порядок загрузки скриптов
- Добавлять новые зависимости
- Переусложнять стили для одной секции
- Оставлять дублирующиеся CSS-правила
- Делать изменение в неправильном экране и думать, что «ничего не поменялось»
- Использовать одну формулу рейтинга для всех спортов — у хоккея она другая

---

## Разработка

Открыть локально: просто открыть `index.html` в браузере.
Сервер не нужен: нет ES-модулей и нет сборки.

Для Яндекс Игр: запаковать в ZIP, где `index.html` лежит в корне, и загрузить в кабинет разработчика.
Размер архива должен быть меньше 100 МБ.

---

## Кратко

Это чистая HTML5-игра. Основные изменения обычно идут в `js/ui.js` и `css/style.css`.
Если задача про хоккейные уровни — не уводи работу в матч и предматч. Смотри на карту уровней и хоккейный рендер.
События и вероятности — спорт-зависимые: у футбола и хоккея разные формулы, типы событий и структуры команд.
