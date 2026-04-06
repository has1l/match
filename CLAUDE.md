# Match Predictor — CLAUDE.md

## Что это

Казуальная HTML5-игра для **Яндекс Игры**. Симулятор спортивных прогнозов в стиле Duolingo.
Дизайн-документ: `MatchPredictor_GDD_v2.docx` (в корне проекта).

**НЕ азартная игра** — нет реальных денег, ставок и вывода.

---

## Стек

- Чистый HTML5 + CSS + JavaScript (без фреймворков, без сборщиков)
- Яндекс Игры SDK (с localStorage fallback для разработки)
- Изображения/текстуры — генерация через **Gemini**

---

## Структура файлов

```
match/
├── index.html              # точка входа, подключает все JS
├── css/style.css           # все стили (~1500 строк)
├── assets/img/             # сюда кладём картинки от Gemini
└── js/
    ├── i18n.js             # все строки на русском (объект T)
    ├── data.js             # FOOTBALL_TEAMS[], FOOTBALL_LEVELS[], SECTIONS{}
    ├── sdk.js              # SDK обёртка: save/load/ads/leaderboard
    ├── events.js           # Events: генератор лайв-событий и прогнозов
    ├── game.js             # Game: состояние матча, логика, сохранения
    ├── ui.js               # UI: рендер всех экранов, навигация
    └── main.js             # инициализация (SDK → loadData → showMenu)
```

**Порядок загрузки скриптов в index.html важен:**
`i18n.js → data.js → sdk.js → events.js → game.js → ui.js → main.js`

---

## Архитектура

### Глобальные объекты

| Объект | Файл | Назначение |
|--------|------|------------|
| `T` | i18n.js | Все русские строки |
| `FOOTBALL_TEAMS` | data.js | Массив 12 команд |
| `FOOTBALL_LEVELS` | data.js | Массив 12 уровней |
| `SECTIONS` | data.js | Конфиг разделов (football/hockey/esports) |
| `SDK` | sdk.js | Яндекс SDK wrapper |
| `Events` | events.js | Генератор событий |
| `Game` | game.js | Состояние игры + логика |
| `UI` | ui.js | Рендер экранов |

### Вспомогательные функции (data.js)
- `getTeamById(section, id)` — команда по id
- `getLevelData(section, levelNum)` — уровень с заполненными объектами команд

---

## Игровая логика (GDD)

### Поток игры
```
Загрузка → Главное меню → Карта разделов → Карта уровней →
Предматч (статистика) → Фаза 1 (2 вопроса) → Баннер старта →
Фаза 2 (5-8 событий) → Экран результата
```

### Фаза 1 — прогноз (до 2 очков)
- Q1: Кто победит? (команда A / Ничья / команда B)
- Q2: Тотал голов? (меньше 2.5 / больше 2.5)
- Ошибка в фазе 1 **не отнимает жизнь**, просто нет очка

### Фаза 2 — лайв-события (до 8 очков)
- 5-8 событий в зависимости от уровня
- Каждый ответ: Да / Нет
- Ошибка = **−1 жизнь**
- Жизней: 3 (можно получить +1 за Rewarded Ad, 1 раз за уровень)
- 0 жизней = поражение

### Очки и звёзды
| Очки | Звёзды |
|------|--------|
| 0-5  | 0 (поражение, если < порога) |
| 6-7  | 1 ★ |
| 8-9  | 2 ★★ |
| 10   | 3 ★★★ |

Порог победы зависит от уровня: 6 (easy), 7 (medium/hard), 8 (expert)

### Таймер
- 25 секунд на каждый вопрос
- Цвет: зелёный (>15) → жёлтый (>7) → красный (≤7)
- Истёк — случайный ответ

### Вероятности событий
```javascript
// events.js: Events.getProb(attackerRating, defenderRating)
base_prob = 0.3 + (ratingA − ratingB) × 0.005
noise = random(−0.1, +0.1)
final_prob = clamp(base + noise, 0.15, 0.85)

// Рейтинг команды: Events.calcRating(team)
rating = attack×0.35 + defense×0.30 + midfield×0.20 + formScore×0.15
```

---

## Данные (data.js)

### Структура команды
```javascript
{
  id: 'red_eagles',
  name: 'Красные Орлы',
  shortName: 'КО',
  color: '#E53935',        // цвет для UI
  bgColor: '#FFEBEE',      // фон карточки
  emoji: '🦅',
  attack: 88, defense: 82, midfield: 85,
  form: ['W','W','W','W','D'],  // последние 5 матчей
  winPct: 68, scored: 2.3, conceded: 0.9,
  players: [
    { name: 'А. Орлов', pos: 'Нападающий', shot: 92, speed: 88, dribble: 85, pass: 78 },
    { name: 'М. Крылов', pos: 'Полузащитник', shot: 75, speed: 82, dribble: 88, pass: 92 },
  ],
  // Вычисляется автоматически при загрузке:
  formScore: 91,   // 40 + (formPts/15)*59
  rating: 86,      // взвешенный рейтинг
}
```

### Структура уровня (FOOTBALL_LEVELS)
```javascript
{ num: 1, teamA: 'red_eagles', teamB: 'grey_lynxes', events: 5, winThreshold: 6 }
```

### Распределение сложности
| Уровни | Разница рейтингов | Событий | Порог |
|--------|------------------|---------|-------|
| 1-3    | 25-35 (легко)    | 5       | 6     |
| 4-6    | 10-15 (средне)   | 6       | 7     |
| 7-9    | 5-12 (сложно)    | 7       | 7     |
| 10-12  | 0-5 (эксперт)    | 8       | 8     |

---

## UI (ui.js)

### Навигация
`UI.showScreen(html, push)` — создаёт новый div.screen, слайдит предыдущий.
`UI.goBack()` — возвращает предыдущий экран.
`UI._clearAndShow(fn)` — удаляет все экраны и рендерит новый (для retry/map).

### Главные функции экранов
```
UI.showMenu()
UI.showSections()
UI.showLevelMap(section)
UI.showPreMatch(section, levelNum)
UI.showPhase1Q1()
UI.showPhase1Q2()
UI.showPhase2Event()
UI.showProfile()
```

### CSS переменные (style.css)
```css
--green: #58CC02   /* основной цвет */
--red: #FF4B4B
--blue: #1CB0F6
--yellow: #FFC800
--purple: #CE82FF
--text: #3C3C3C
--border: #E5E5E5
```

---

## SDK (sdk.js)

```javascript
SDK.init()                    // инициализация (вызывается 1 раз)
SDK.save(data)                // player.setData или localStorage
SDK.load()                    // player.getData или localStorage
SDK.showRewardedAd(onReward, onError)
SDK.showInterstitialAd(onClose)
SDK.submitScore(value)        // лидерборд
SDK.notifyLoaded()            // ysdk.features.LoadingAPI.ready()
```

В dev-режиме (без Яндекс SDK) — все вызовы делают fallback на localStorage,
реклама симулируется (`setTimeout 300ms → reward`).

---

## Сохранения (Game.data)

```javascript
{
  levels: {
    football: { "1": { best: 8, stars: 2, attempts: 3 }, ... },
    hockey: {}, esports: {}
  },
  totalScore: { football: 72, hockey: 0, esports: 0 },
  winStreak: 5, bestStreak: 7,
  dailyBonus: "2026-04-05",
  achievements: ["first_win", "streak_5"],
  settings: { sound: true, lang: 'ru' },
  stats: { gamesPlayed, correctPredictions, totalAnswers, perfectGames, ... }
}
```

`Game.saveData()` вызывается автоматически после каждого уровня.

---

## MVP статус (текущее состояние)

### Готово
- [x] Загрузочный экран
- [x] Главное меню (очки, серия, рекорд)
- [x] Карта разделов (Футбол / Хоккей / Киберспорт)
- [x] Карта уровней (зигзаг, звёзды, блокировка)
- [x] Предматчевый экран (статистика команд, карточки игроков)
- [x] Фаза 1 — Q1 (победитель) и Q2 (тотал)
- [x] Фаза 2 — 8 типов лайв-событий
- [x] Таймер 25 сек с анимацией цвета
- [x] Система жизней (3 ❤️)
- [x] Game Over overlay + Rewarded Ad за жизнь
- [x] Экран результата (звёзды, рекорд)
- [x] Облачные сохранения + localStorage fallback
- [x] Interstitial реклама (каждые 3 игры)
- [x] Профиль + достижения
- [x] Ежедневный бонус
- [x] Серия побед

### Предстоит
- [ ] Изображения команд (Gemini генерация)
- [ ] Хоккей и Киберспорт (команды + события)
- [ ] Лидерборды (требует деплой на Яндекс)
- [ ] Звуковые эффекты
- [ ] Анимация конфетти на победу

---

## Разработка

Открыть локально: просто открыть `index.html` в браузере.
Никакого сервера не нужно — нет ES-модулей, нет сборки.

Для Яндекс Игры: запаковать в ZIP (index.html в корне), загрузить в кабинет разработчика.
Размер архива должен быть < 100 МБ.
