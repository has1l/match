'use strict';

// =============================================
// UI — SCREEN RENDERING & NAVIGATION
// =============================================
const UI = {

  app: null,
  _screenStack: [],

  init() {
    this.app = document.getElementById('app');
  },

  // ---- Screen transitions ----

  showScreen(html, push = true) {
    // Remove previous "prev" screen
    const prevPrev = this.app.querySelector('.screen.prev');
    if (prevPrev) prevPrev.remove();

    // Slide current screen to prev position
    const current = this.app.querySelector('.screen.active');
    if (current && push) {
      current.classList.remove('active');
      current.classList.add('prev');
    } else if (current) {
      current.remove();
    }

    // Create new screen
    const div = document.createElement('div');
    div.className = 'screen';
    div.innerHTML = html;
    this.app.appendChild(div);

    // Trigger transition
    requestAnimationFrame(() => {
      requestAnimationFrame(() => div.classList.add('active'));
    });

    return div;
  },

  goBack() {
    const current = this.app.querySelector('.screen.active');
    const prev    = this.app.querySelector('.screen.prev');

    if (!prev) { this.showMenu(); return; }

    if (current) {
      current.classList.remove('active');
      setTimeout(() => current.remove(), 300);
    }
    prev.classList.remove('prev');
    prev.classList.add('active');
  },

  // ---- Header builder ----

  headerHtml({ title, back = true, lives = null, streak = null } = {}) {
    const backBtn = back ? `<button class="btn-back" id="btn-back">‹</button>` : `<div style="width:40px"></div>`;
    const livesHtml = lives !== null ? `
      <div class="header-lives">
        ${[1,2,3].map(i => `<span class="heart-icon ${i > lives ? 'lost' : ''}"><img src="assets/img/ui/heart_full.png" class="heart-img" alt="❤"></span>`).join('')}
      </div>` : '';
    const streakHtml = streak ? `<span class="streak-badge">🔥 ${streak}</span>` : '';

    return `
      <div class="game-header">
        ${backBtn}
        <div class="header-title">${title || ''}</div>
        ${streakHtml}
        ${livesHtml}
      </div>`;
  },

  afterRender(el, cb) {
    requestAnimationFrame(() => cb(el));
  },

  // ---- Team logo helpers ----
  _imgErr(el) {
    const team = getTeamById(el.dataset.section, el.dataset.id);
    const span = document.createElement('span');
    span.className = 'team-logo-fb';
    span.textContent = team ? team.emoji : '?';
    el.replaceWith(span);
  },

  _teamLogoHtml(section, team) {
    return `<img class="team-logo-img" src="assets/img/teams/${section}/${team.id}.png" alt="${team.name}" data-section="${section}" data-id="${team.id}" onerror="UI._imgErr(this)">`;
  },

  // =============================================
  // LOADING SCREEN
  // =============================================
  showLoading() {
    const div = document.createElement('div');
    div.className = 'screen screen-loading active';
    div.innerHTML = `
      <div class="loading-logo">⚽</div>
      <div class="loading-title">${T.app.name}</div>
      <div class="loading-subtitle">${T.app.tagline}</div>
      <div class="loading-bar-wrap">
        <div class="loading-bar-fill" id="loading-fill"></div>
      </div>`;
    this.app.appendChild(div);

    let pct = 0;
    const interval = setInterval(() => {
      pct += Math.random() * 18;
      const fill = document.getElementById('loading-fill');
      if (fill) fill.style.width = Math.min(pct, 95) + '%';
      if (pct >= 95) clearInterval(interval);
    }, 120);

    return (done) => {
      const fill = document.getElementById('loading-fill');
      if (fill) fill.style.width = '100%';
      clearInterval(interval);
      setTimeout(done, 350);
    };
  },

  // =============================================
  // MAIN MENU
  // =============================================
  _menuHubMockLeaderboard: [
    { name: 'Prof', sub: 'Легенда прогнозов', xp: 2547 },
    { name: 'Кеша', sub: 'Мастер точности', xp: 2195 },
    { name: 'Соня', sub: 'Аналитик', xp: 1980 },
    { name: 'ДимаПро', sub: 'Серия x12', xp: 1755 },
    { name: 'Лига_1', sub: 'Фанат футбола', xp: 1620 },
  ],

  _refreshMenuHubStats(root) {
    const total = Game.getTotalScore();
    const { level, xpInLevel, xpPerLevel } = Game.getPlayerLevelProgress();
    const gp = Game.data.stats.gamesPlayed || 0;
    const gw = Game.data.stats.gamesWon || 0;
    const winPct = gp ? Math.round((gw / gp) * 100) : 0;

    const elPts = root.querySelector('#hub-points-total');
    if (elPts) elPts.textContent = total;
    const pill = root.querySelector('#hub-level-pill');
    if (pill) pill.textContent = T.menuHub.levelShort(level);
    const bar = root.querySelector('#hub-xp-fill');
    if (bar) bar.style.width = `${(xpInLevel / xpPerLevel) * 100}%`;
    const xpTxt = root.querySelector('#hub-xp-text');
    if (xpTxt) xpTxt.textContent = T.menuHub.xpLabel(xpInLevel, xpPerLevel);
    const lvLbl = root.querySelector('#hub-progress-level');
    if (lvLbl) lvLbl.textContent = `${T.menuHub.levelWord} ${level}`;
    const st = root.querySelector('#hub-streak-num');
    if (st) st.textContent = Game.data.winStreak;
    const s1 = root.querySelector('#hub-stat-matches');
    if (s1) s1.textContent = String(gp);
    const s2 = root.querySelector('#hub-stat-winpct');
    if (s2) s2.textContent = `${winPct}%`;
    const s3 = root.querySelector('#hub-stat-beststr');
    if (s3) s3.textContent = String(Game.data.bestStreak);
    const s4 = root.querySelector('#hub-stat-correct');
    if (s4) s4.textContent = String(Game.data.stats.correctPredictions || 0);
  },

  _hubToast(root, text) {
    let t = root.querySelector('.hub-toast');
    if (!t) {
      t = document.createElement('div');
      t.className = 'hub-toast';
      const mount = root.querySelector('.menu-hub-root')
        || root.querySelector('.lvl-foot-root')
        || root.querySelector('.pm2-root')
        || root;
      mount.appendChild(t);
    }
    t.textContent = text;
    t.classList.add('hub-toast--show');
    clearTimeout(this._hubToastTimer);
    this._hubToastTimer = setTimeout(() => t.classList.remove('hub-toast--show'), 2200);
  },

  showMenu() {
    this.app.querySelectorAll('.screen').forEach(s => s.remove());

    const total = Game.getTotalScore();
    const best = Game.data.bestStreak;
    const dailyOk = Game.isDailyBonusAvailable();
    const progress = Game.getPlayerLevelProgress();
    const rankTitle = Game.getPlayerRankTitle();
    const streak = Game.data.winStreak;
    const hockeyNeed = SECTIONS.hockey.unlockScore;
    const hockeyUnlocked = Game.isSectionUnlocked('hockey');
    const esUnlocked = Game.isSectionUnlocked('esports');
    const gp = Game.data.stats.gamesPlayed || 0;
    const gw = Game.data.stats.gamesWon || 0;
    const winPct = gp ? Math.round((gw / gp) * 100) : 0;

    const topRows = this._menuHubMockLeaderboard.map((row, i) => {
      const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : String(i + 1);
      return `
        <div class="hub-lb-row">
          <span class="hub-lb-medal">${medal}</span>
          <div class="hub-lb-avatar">${row.name.slice(0, 1)}</div>
          <div class="hub-lb-meta">
            <div class="hub-lb-name">${row.name}</div>
            <div class="hub-lb-sub">${row.sub}</div>
          </div>
          <div class="hub-lb-xp">${row.xp} XP</div>
        </div>`;
    }).join('');

    const div = document.createElement('div');
    div.className = 'screen screen-menu active';
    div.innerHTML = `
      <div class="menu-hub-root">
        <div class="menu-hub-bg" aria-hidden="true"></div>
        <div class="menu-hub-layout">
          <header class="menu-hub-header">
            <div class="menu-hub-brand">
              <span class="brand-match">${T.menuHub.logoMatch}</span><span class="brand-predictor">${T.menuHub.logoPredictor}</span>
            </div>
            <div class="menu-hub-tools">
              <button type="button" class="hub-icon-btn ${dailyOk ? 'hub-icon-btn--pulse' : ''}" id="hub-btn-gift" title="${dailyOk ? T.menuHub.dailyGift : T.menuHub.dailyDone}">🎁</button>
              <button type="button" class="hub-icon-btn" id="hub-btn-chart" title="${T.menuHub.topPlayers}">📊</button>
              <button type="button" class="hub-icon-btn" id="hub-btn-settings" title="${T.profile.title}">⚙️</button>
            </div>
            <div class="menu-hub-user">
              <div class="hub-avatar" aria-hidden="true">👤</div>
              <div class="hub-user-text">
                <div class="hub-user-name">${T.menuHub.playerName}</div>
                <div class="hub-user-rank">${rankTitle}</div>
              </div>
              <div class="hub-points-wrap">
                <span class="hub-points-icon">⭐</span>
                <span class="hub-points" id="hub-points-total">${total}</span>
              </div>
              <div class="hub-level-pill" id="hub-level-pill">${T.menuHub.levelShort(progress.level)}</div>
            </div>
          </header>

          <aside class="menu-hub-col menu-hub-left">
            <div class="hub-card hub-card-streak">
              <div class="hub-card-label">${T.menuHub.streakTitle}</div>
              <div class="hub-streak-big" id="hub-streak-num">${streak}</div>
              <div class="hub-streak-fires">🔥🔥🔥</div>
            </div>
            <div class="hub-card hub-card-progress">
              <div class="hub-card-label">${T.menuHub.progressTitle}</div>
              <div class="hub-progress-head"><span id="hub-progress-level">${T.menuHub.levelWord} ${progress.level}</span></div>
              <div class="hub-xp-bar">
                <div class="hub-xp-fill" id="hub-xp-fill" style="width:${(progress.xpInLevel / progress.xpPerLevel) * 100}%"></div>
              </div>
              <div class="hub-xp-text" id="hub-xp-text">${T.menuHub.xpLabel(progress.xpInLevel, progress.xpPerLevel)}</div>
              <div class="hub-next-unlock ${hockeyUnlocked ? 'hub-next-unlock--ok' : ''}">
                <span>${hockeyUnlocked ? '✓' : '🔒'}</span>
                <span>${T.menuHub.hockeyUnlockLine(hockeyNeed)}</span>
              </div>
            </div>
            <div class="hub-card hub-card-prompt">
              <div class="hub-hint-bulb">💡</div>
              <div class="hub-card-label">${T.menuHub.hintTitle}</div>
              <button type="button" class="hub-hint-btn" id="hub-btn-hint">${T.menuHub.hintBtn}</button>
            </div>
          </aside>

          <main class="menu-hub-col menu-hub-center">
            <h1 class="hub-hero-title"><span class="hub-hero-bolt">⚡</span> ${T.menuHub.heroTitle}</h1>
            <p class="hub-hero-tag">${T.menuHub.heroTagline}</p>
            <div class="hub-mode-row" id="hub-mode-row">
              <button type="button" class="hub-mode-card hub-mode-card--active hub-mode-card--football" data-section="football">
                <span class="hub-mode-badge hub-mode-badge--ok">${T.menuHub.available}</span>
                <div class="hub-mode-visual hub-mode-visual--ball">⚽</div>
                <div class="hub-mode-name">${SECTIONS.football.name}</div>
                <div class="hub-mode-desc">${T.menuHub.footballSim}</div>
                <div class="hub-mode-league">${T.menuHub.footballLeague(rankTitle)}</div>
              </button>
              <button type="button" class="hub-mode-card hub-mode-card--hockey ${hockeyUnlocked ? 'hub-mode-card--unlocked' : 'hub-mode-card--locked'}" data-section="hockey" ${hockeyUnlocked ? '' : 'disabled'}>
                <span class="hub-mode-badge">${hockeyUnlocked ? T.menuHub.available : hockeyNeed + ' очк.'}</span>
                <div class="hub-mode-visual">🏒</div>
                <div class="hub-mode-name">${SECTIONS.hockey.name}</div>
                <div class="hub-mode-desc">${hockeyUnlocked ? 'Симулятор хоккейных матчей' : T.menuHub.hockeySoon}</div>
              </button>
              <button type="button" class="hub-mode-card hub-mode-card--esports ${esUnlocked ? 'hub-mode-card--unlocked' : 'hub-mode-card--locked'}" data-section="esports" ${esUnlocked ? '' : 'disabled'}>
                <span class="hub-mode-badge">${esUnlocked ? T.menuHub.available : T.menuHub.soon}</span>
                <div class="hub-mode-visual">🎯</div>
                <div class="hub-mode-name">${SECTIONS.esports.name}</div>
                <div class="hub-mode-desc">${esUnlocked ? 'Counter-Strike 2' : T.menuHub.esportsDev}</div>
              </button>
            </div>
            <button type="button" class="hub-cta" id="hub-btn-start"><span>${T.menuHub.startGame}</span><span class="hub-cta-arrow">›</span></button>
          </main>

          <aside class="menu-hub-col menu-hub-right" id="hub-leaderboard">
            <div class="hub-card hub-card-lb">
              <div class="hub-card-title-row">
                <span class="hub-card-label">${T.menuHub.topPlayers}</span>
                <span class="hub-lb-demo">${T.menuHub.leaderboardDemo}</span>
              </div>
              <div class="hub-lb-list">${topRows}</div>
            </div>
            <div class="hub-card hub-card-stats">
              <div class="hub-card-label">${T.menuHub.yourStats}</div>
              <ul class="hub-stat-list">
                <li><span>${T.menuHub.statMatches}</span><strong id="hub-stat-matches">${gp}</strong></li>
                <li><span>${T.menuHub.statWinPct}</span><strong id="hub-stat-winpct">${winPct}%</strong></li>
                <li><span>${T.menuHub.statBestStreak}</span><strong id="hub-stat-beststr">${best}</strong></li>
                <li><span>${T.menuHub.statCorrect}</span><strong id="hub-stat-correct">${Game.data.stats.correctPredictions || 0}</strong></li>
              </ul>
            </div>
            <div class="hub-bottom-nav">
              <button type="button" class="hub-nav-sq" id="hub-btn-rating">${T.menuHub.btnRating}</button>
              <button type="button" class="hub-nav-sq hub-nav-sq--yellow" id="hub-btn-profile">${T.menuHub.btnProfile}</button>
            </div>
          </aside>
        </div>
      </div>`;

    this.app.appendChild(div);

    let selectedSection = 'football';

    const syncModeCards = () => {
      div.querySelectorAll('.hub-mode-card').forEach((el) => {
        const id = el.dataset.section;
        const unlocked = id === 'football' || (id === 'hockey' && hockeyUnlocked) || (id === 'esports' && esUnlocked);
        el.classList.toggle('hub-mode-card--active', unlocked && id === selectedSection);
      });
    };

    div.querySelectorAll('.hub-mode-card').forEach((card) => {
      card.addEventListener('click', () => {
        const id = card.dataset.section;
        if (card.disabled) return;
        if (id === 'football' || (id === 'hockey' && Game.isSectionUnlocked('hockey')) || (id === 'esports' && Game.isSectionUnlocked('esports'))) {
          selectedSection = id;
          syncModeCards();
        }
      });
    });

    div.querySelector('#hub-btn-start').onclick = () => {
      if (!Game.isSectionUnlocked(selectedSection)) {
        selectedSection = 'football';
        syncModeCards();
      }
      const cfg = SECTIONS[selectedSection];
      if (!cfg.levels || cfg.levels.length === 0) {
        this.showSections();
      } else {
        this.showLevelMap(selectedSection);
      }
    };

    div.querySelector('#hub-btn-profile').onclick = () => this.showProfile();
    div.querySelector('#hub-btn-settings').onclick = () => this.showProfile();
    div.querySelector('#hub-btn-rating').onclick = () => {
      document.getElementById('hub-leaderboard').scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    div.querySelector('#hub-btn-chart').onclick = () => {
      document.getElementById('hub-leaderboard').scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    div.querySelector('#hub-btn-gift').onclick = () => {
      const btn = div.querySelector('#hub-btn-gift');
      if (Game.isDailyBonusAvailable()) {
        Game.claimDailyBonus();
        this._refreshMenuHubStats(div);
        btn.classList.remove('hub-icon-btn--pulse');
        btn.title = T.menuHub.dailyDone;
        this._hubToast(div, '+3 ' + T.menu.totalScore.toLowerCase());
      }
    };

    div.querySelector('#hub-btn-hint').onclick = () => {
      if (!SDK.canShowRewardedAd('menu_hint')) {
        this._hubToast(div, T.menuHub.dailyDone);
        return;
      }
      SDK.showRewardedAd(
        () => {
          SDK.markAdUsed('menu_hint');
          Game.grantMenuAdBonus();
          this._refreshMenuHubStats(div);
          this._hubToast(div, T.menuHub.bonusReceived);
        },
        () => {}
      );
    };

    syncModeCards();
  },

  // =============================================
  // SECTION MAP
  // =============================================
  showSections() {
    const sectOrder = ['football', 'hockey', 'esports'];

    const cards = sectOrder.map(id => {
      const cfg = SECTIONS[id];
      const unlocked = Game.isSectionUnlocked(id);
      const score    = Game.getSectionScore(id);
      const lvlsDone = Object.keys(Game.data.levels[id]).length;
      const pct      = Math.round((score / cfg.maxScore) * 100);

      return `
        <div class="section-card ${unlocked ? 'unlocked' : 'locked'}" data-section="${id}">
          <div class="section-icon ${cfg.iconClass}">${cfg.icon}</div>
          <div class="section-info">
            <div class="section-name">${cfg.name}</div>
            <div class="section-desc">${cfg.desc}</div>
            ${unlocked ? `
              <div class="section-progress-bar">
                <div class="section-progress-fill" style="width:${pct}%"></div>
              </div>
              <div class="section-progress-text">${score} / ${cfg.maxScore} очков · ${lvlsDone}/12 уровней</div>
            ` : ''}
          </div>
        </div>`;
    }).join('');

    const screen = this.showScreen(`
      ${this.headerHtml({ title: T.sections.title })}
      <div class="sections-list">${cards}</div>`);

    screen.querySelector('#btn-back').onclick = () => this.goBack();

    screen.querySelectorAll('.section-card.unlocked').forEach(el => {
      el.onclick = () => this.showLevelMap(el.dataset.section);
    });
  },

  // =============================================
  // LEVEL MAP
  // =============================================
  _footballZigzagX(idx) {
    const xs = [180, 268, 92, 268, 92, 210];
    return xs[idx % 6];
  },

  _footballPathSvg(n) {
    const W = 360;
    const pad = 52;
    const innerH = Math.max(420, (n - 1) * 88 + 200);
    const H = pad * 2 + innerH;
    const step = n <= 1 ? 0 : innerH / (n - 1);
    let d = '';
    for (let L = 1; L <= n; L++) {
      const x = this._footballZigzagX(L - 1);
      const y = n <= 1 ? H / 2 : pad + (n - L) * step;
      d += (L === 1 ? 'M' : 'L') + ` ${x} ${y}`;
    }
    return { d, W, H, pad, step, n };
  },

  _defaultFootballSelectedLevel(section, levels) {
    let sel = 1;
    for (const lvl of levels) {
      if (!Game.isLevelUnlocked(section, lvl.num)) break;
      sel = lvl.num;
      const rec = Game.getLevelRecord(section, lvl.num);
      if (!rec || rec.stars < 3) return lvl.num;
    }
    return sel;
  },

  _showFootballLevelMap(section, cfg, levels) {
    const path = this._footballPathSvg(levels.length);
    let selectedLevel = this._defaultFootballSelectedLevel(section, levels);
    const score = Game.getSectionScore(section);
    const totalStars = levels.reduce((s, lvl) => {
      const r = Game.getLevelRecord(section, lvl.num);
      return s + (r ? r.stars : 0);
    }, 0);

    // Difficulty: 1-3 easy, 4-6 mid, 7-9 hard, 10-12 expert
    const diffClass = (num) => num <= 3 ? 'easy' : num <= 6 ? 'mid' : num <= 9 ? 'hard' : 'expert';

    // Tier labels at approximate y% positions (path goes top=hard, bottom=easy)
    const tierLabels = [
      { label: 'ЭКСПЕРТ', yPct: 10, diff: 'expert' },
      { label: 'СЛОЖНО',  yPct: 35, diff: 'hard' },
      { label: 'СРЕДНЕ',  yPct: 58, diff: 'mid' },
      { label: 'ЛЕГКО',   yPct: 83, diff: 'easy' },
    ].map(t => `
      <div class="lvl-tier-label lvl-tier--${t.diff}" style="top:${t.yPct}%">
        ${t.label}
      </div>`).join('');

    const nodesHtml = levels.map((lvl) => {
      const rec = Game.getLevelRecord(section, lvl.num);
      const stars = rec ? rec.stars : 0;
      const unlocked = Game.isLevelUnlocked(section, lvl.num);
      const diff = diffClass(lvl.num);
      const perfect = stars === 3;
      const xPct = (this._footballZigzagX(lvl.num - 1) / path.W) * 100;
      const yPct = path.n <= 1
        ? 50
        : ((path.pad + (levels.length - lvl.num) * path.step) / path.H) * 100;
      const starsRow = [1, 2, 3].map(s =>
        `<span class="lvl-node-star ${s <= stars ? 'on' : 'off'}">★</span>`
      ).join('');
      const inner = unlocked
        ? `<span class="lvl-node-num">${perfect ? '✓' : lvl.num}</span>`
        : `<span class="lvl-node-lock">🔒</span>`;
      return `
        <button type="button"
          class="lvl-node lvl-node--${diff} ${unlocked ? '' : 'lvl-node--locked'} ${perfect ? 'lvl-node--perfect' : ''}"
          data-level="${lvl.num}" data-section="${section}"
          style="left:${xPct}%;top:${yPct}%"
          ${unlocked ? '' : 'disabled'}>
          ${inner}
          <span class="lvl-node-stars">${starsRow}</span>
        </button>`;
    }).join('');

    const sectionClass = section === 'hockey' ? 'lvl-foot-root lvl-foot-root--hockey' : 'lvl-foot-root';
    const headerIcon = section === 'hockey' ? '🏒' : '⚽';
    const pathFill = section === 'hockey' ? 'rgba(92, 190, 255, 0.28)' : 'rgba(88,204,2,0.25)';
    const pathStroke = section === 'hockey' ? 'rgba(233,247,255,0.78)' : 'rgba(255,255,255,0.55)';
    const screen = this.showScreen(`
      <div class="${sectionClass}">
        <div class="lvl-foot-bg" aria-hidden="true"></div>

        <!-- Header -->
        <div class="lvl-foot-header">
          <button class="lvl-foot-header-back" id="lvl-foot-back">‹</button>
          <div class="lvl-foot-header-center">
            <span class="lvl-foot-header-icon">${headerIcon}</span>
            <span class="lvl-foot-header-title">${cfg.name}</span>
          </div>
          <div class="lvl-foot-header-score">
            <span class="lvl-foot-header-pts">${score}</span>
            <span class="lvl-foot-header-max">/ ${cfg.maxScore}</span>
          </div>
        </div>

        <!-- Stars progress -->
        <div class="lvl-foot-starprog">
          ${[...Array(36)].map((_, i) => `<span class="lvl-foot-starprog-dot ${i < totalStars ? 'on' : ''}"></span>`).join('')}
        </div>

        <!-- Map scroll -->
        <div class="lvl-foot-scroll">
          <div class="lvl-foot-canvas" style="aspect-ratio:${path.W} / ${path.H}">
            <svg class="lvl-foot-svg" viewBox="0 0 ${path.W} ${path.H}" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <filter id="pathGlow">
                  <feGaussianBlur stdDeviation="3" result="blur"/>
                  <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
              </defs>
              <path d="${path.d}" fill="none" stroke="${pathFill}" stroke-width="14"
                stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>
              <path class="lvl-foot-path" d="${path.d}" fill="none" stroke="${pathStroke}" stroke-width="2.5"
                stroke-dasharray="8 12" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>
            </svg>
            ${tierLabels}
            ${nodesHtml}
          </div>
        </div>

        <!-- Bottom bar -->
        <div class="lvl-foot-bottom">
          <button type="button" class="lvl-foot-ad" id="lvl-foot-ad">🎬 +❤️ Бонус</button>
          <button type="button" class="lvl-foot-start" id="lvl-foot-start">▶ ИГРАТЬ</button>
        </div>
      </div>`);

    screen.classList.add('screen-levels-football');

    const syncNodes = () => {
      screen.querySelectorAll('.lvl-node').forEach((btn) => {
        const lv = parseInt(btn.dataset.level, 10);
        const unlocked = !btn.disabled;
        btn.classList.toggle('lvl-node--selected', unlocked && lv === selectedLevel);
      });
      const startBtn = screen.querySelector('#lvl-foot-start');
      const canStart = Game.isLevelUnlocked(section, selectedLevel);
      startBtn.disabled = !canStart;
      startBtn.textContent = canStart ? `▶ УРОВЕНЬ ${selectedLevel}` : '🔒 ЗАБЛОКИРОВАНО';
    };

    screen.querySelectorAll('.lvl-node:not(:disabled)').forEach((btn) => {
      btn.onclick = () => {
        selectedLevel = parseInt(btn.dataset.level, 10);
        syncNodes();
      };
    });

    screen.querySelector('#lvl-foot-start').onclick = () => {
      if (Game.isLevelUnlocked(section, selectedLevel)) {
        this.showPreMatch(section, selectedLevel);
      }
    };
    screen.querySelector('#lvl-foot-back').onclick = () => this.goBack();
    screen.querySelector('#lvl-foot-ad').onclick = () => {
      if (!SDK.canShowRewardedAd('level_map_ad')) {
        this._hubToast(screen, T.menuHub.dailyDone);
        return;
      }
      SDK.showRewardedAd(
        () => {
          SDK.markAdUsed('level_map_ad');
          Game.grantMenuAdBonus();
          this._hubToast(screen, T.levels.adBonusToast);
        },
        () => {}
      );
    };

    syncNodes();
  },

  showLevelMap(section) {
    const cfg = SECTIONS[section];
    const score = Game.getSectionScore(section);
    const levels = cfg.levels || [];

    if (levels.length === 0) {
      const screen = this.showScreen(`
        ${this.headerHtml({ title: cfg.name, lives: null })}
        <div class="levels-empty">${T.levels.title}: ${cfg.name}</div>`);
      screen.querySelector('#btn-back').onclick = () => this.goBack();
      return;
    }

    if (section === 'football') {
      this._showFootballLevelMap(section, cfg, levels);
      return;
    }

    if (section === 'hockey') {
      this._showHockeyLevelMap(section, cfg, levels);
      return;
    }

    if (section === 'esports') {
      this._showCS2LevelMap(section, cfg, levels);
      return;
    }

    const nodes = levels.map((lvl, i) => {
      const rec = Game.getLevelRecord(section, lvl.num);
      const stars = rec ? rec.stars : 0;
      const unlocked = Game.isLevelUnlocked(section, lvl.num);
      const available = unlocked && !Game.isLevelUnlocked(section, lvl.num + 1);

      let nodeClass = 'locked';
      let nodeInner = `<span class="level-node-lock">🔒</span>`;

      if (unlocked) {
        if (stars === 3) {
          nodeClass = 'done-perfect';
          nodeInner = `<span class="level-node-check">★</span>`;
        } else if (stars > 0) {
          nodeClass = 'done';
          nodeInner = `<span class="level-node-number">${lvl.num}</span>`;
        } else if (available || Game.isLevelUnlocked(section, lvl.num)) {
          nodeClass = 'available';
          nodeInner = `<span class="level-node-number">${lvl.num}</span>`;
        }
      }

      const starsHtml = [1, 2, 3].map(s =>
        `<span class="level-star ${s <= stars ? 'on' : 'off'}">${s <= stars ? '★' : '☆'}</span>`
      ).join('');

      const connClass = rec && rec.stars >= 1 ? 'done' : '';
      const connector = i > 0 ? `<div class="level-connector ${connClass}"></div>` : '';

      return `
        <div class="level-node-wrap">
          ${connector}
          <div class="level-node ${nodeClass}" data-level="${lvl.num}" data-section="${section}">
            ${nodeInner}
          </div>
          <div class="level-stars">${starsHtml}</div>
        </div>`;
    }).join('');

    const screen = this.showScreen(`
      ${this.headerHtml({ title: cfg.name, lives: null })}
      <div class="levels-header">
        <div class="levels-section-info">
          <div class="levels-section-icon">${cfg.icon}</div>
          <div>
            <div class="levels-section-name">${cfg.name}</div>
            <div class="levels-section-score">${score} / ${cfg.maxScore} очков</div>
          </div>
        </div>
      </div>
      <div class="levels-scroll">
        <div class="levels-path">${nodes}</div>
      </div>`);

    screen.querySelector('#btn-back').onclick = () => this.goBack();

    screen.querySelectorAll('.level-node:not(.locked)').forEach((el) => {
      el.onclick = () => {
        const lvlNum = parseInt(el.dataset.level, 10);
        const sec = el.dataset.section;
        this.showPreMatch(sec, lvlNum);
      };
    });
  },

  _showHockeyLevelMap(section, cfg, levels) {
    const score = Game.getSectionScore(section);
    const totalStars = levels.reduce((s, lvl) => s + (Game.getLevelRecord(section, lvl.num)?.stars || 0), 0);
    const firstUnlocked = levels.find(lvl => Game.isLevelUnlocked(section, lvl.num));
    let selectedLevel = firstUnlocked ? firstUnlocked.num : levels[0].num;
    const zigzagX = (idx) => {
      const xs = [22, 78, 22, 78, 22, 78, 50];
      return xs[idx % xs.length];
    };
    const nodesData = levels.map((lvl, idx) => {
      const top = 72 + idx * 102;
      const left = zigzagX(idx);
      return { lvl, idx, top, left };
    });
    const rinkHeight = Math.max(620, (levels.length - 1) * 102 + 170);
    const pathPoints = nodesData.map((n, i) => `${i === 0 ? 'M' : 'L'} ${n.left} ${n.top}`).join(' ');
    const nodes = nodesData.map(({ lvl, top, left }) => {
      const rec = Game.getLevelRecord(section, lvl.num);
      const stars = rec ? rec.stars : 0;
      const unlocked = Game.isLevelUnlocked(section, lvl.num);
      const starsHtml = [1, 2, 3].map(s => `<span class="hock-node-star ${s <= stars ? 'on' : 'off'}">★</span>`).join('');
      return `
        <button type="button" class="hock-node ${unlocked ? 'hock-node--open' : 'hock-node--locked'} ${stars === 3 ? 'hock-node--perfect' : ''}" data-level="${lvl.num}" data-section="${section}" data-unlocked="${unlocked ? '1' : '0'}" style="top:${top}px;left:${left}%" ${unlocked ? '' : 'disabled'}>
          <span class="hock-node-inner">${unlocked ? (stars === 3 ? '✓' : lvl.num) : '🔒'}</span>
          <span class="hock-node-stars">${starsHtml}</span>
        </button>`;
    }).join('');

    const screen = this.showScreen(`
      <div class="lvl-foot-root lvl-foot-root--hockey">
        <div class="lvl-foot-bg" aria-hidden="true"></div>
        <div class="lvl-foot-header">
          <button class="lvl-foot-header-back" id="lvl-foot-back">‹</button>
          <div class="lvl-foot-header-center">
            <span class="lvl-foot-header-icon">🏒</span>
            <span class="lvl-foot-header-title">${cfg.name}</span>
          </div>
          <div class="lvl-foot-header-score">
            <span class="lvl-foot-header-pts">${score}</span>
            <span class="lvl-foot-header-max">/ ${cfg.maxScore}</span>
          </div>
        </div>
        <div class="lvl-foot-starprog">
          ${[...Array(36)].map((_, i) => `<span class="lvl-foot-starprog-dot ${i < totalStars ? 'on' : ''}"></span>`).join('')}
        </div>
        <div class="hock-map-meta">
          <div class="hock-map-title">ЛЕДОВАЯ ДОРОЖКА</div>
          <div class="hock-map-sub">Выбирай матч по шайбовой трассе</div>
        </div>
        <div class="hock-map-scroll">
          <div class="hock-map-rink" style="height:${rinkHeight}px">
            <svg class="hock-map-path" viewBox="0 0 100 ${rinkHeight}" preserveAspectRatio="none" aria-hidden="true">
              <path d="${pathPoints}" fill="none" stroke="rgba(127,216,255,0.72)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="12 14"/>
              <path d="${pathPoints}" fill="none" stroke="rgba(255,255,255,0.24)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <div class="hock-rink-lines" aria-hidden="true"></div>
            ${nodes}
          </div>
        </div>

        <div class="lvl-foot-bottom">
          <button type="button" class="lvl-foot-ad" id="lvl-foot-ad">🎬 +❤️ Бонус</button>
          <button type="button" class="lvl-foot-start" id="lvl-foot-start">▶ ИГРАТЬ</button>
        </div>
      </div>`);

    const syncNodes = () => {
      screen.querySelectorAll('.hock-node').forEach((btn) => {
        const lv = parseInt(btn.dataset.level, 10);
        const unlocked = btn.dataset.unlocked === '1';
        btn.classList.toggle('hock-node--selected', unlocked && lv === selectedLevel);
      });
      const startBtn = screen.querySelector('#lvl-foot-start');
      const canStart = Game.isLevelUnlocked(section, selectedLevel);
      startBtn.disabled = !canStart;
      startBtn.textContent = canStart ? `▶ УРОВЕНЬ ${selectedLevel}` : '🔒 ЗАБЛОКИРОВАНО';
    };

    screen.querySelectorAll('.hock-node').forEach((btn) => {
      btn.onclick = () => {
        if (btn.dataset.unlocked !== '1') return;
        selectedLevel = parseInt(btn.dataset.level, 10);
        syncNodes();
      };
    });

    screen.querySelector('#lvl-foot-start').onclick = () => {
      if (Game.isLevelUnlocked(section, selectedLevel)) this.showPreMatch(section, selectedLevel);
    };
    screen.querySelector('#lvl-foot-back').onclick = () => this.goBack();
    screen.querySelector('#lvl-foot-ad').onclick = () => {
      if (!SDK.canShowRewardedAd('level_map_ad')) {
        this._hubToast(screen, T.menuHub.dailyDone);
        return;
      }
      SDK.showRewardedAd(() => { SDK.markAdUsed('level_map_ad'); Game.grantMenuAdBonus(); this._hubToast(screen, T.levels.adBonusToast); }, () => {});
    };

    syncNodes();
  },

  _showCS2LevelMap(section, cfg, levels) {
    const score = Game.getSectionScore(section);
    const totalStars = levels.reduce((s, lvl) => s + (Game.getLevelRecord(section, lvl.num)?.stars || 0), 0);
    const firstUnlocked = levels.find(lvl => Game.isLevelUnlocked(section, lvl.num));
    let selectedLevel = firstUnlocked ? firstUnlocked.num : levels[0].num;

    const mapIcons = { mirage: '🏙️', dust2: '🏜️', inferno: '🔥', ancient: '🏛️', nuke: '☢️', overpass: '🌉', vertigo: '🏗️' };
    const zigzagX = (idx) => {
      const xs = [22, 78, 22, 78, 22, 78, 50];
      return xs[idx % xs.length];
    };
    const nodesData = levels.map((lvl, idx) => ({ lvl, idx, top: 72 + idx * 102, left: zigzagX(idx) }));
    const rinkHeight = Math.max(620, (levels.length - 1) * 102 + 170);
    const pathPoints = nodesData.map((n, i) => `${i === 0 ? 'M' : 'L'} ${n.left} ${n.top}`).join(' ');

    const nodes = nodesData.map(({ lvl, top, left }) => {
      const rec = Game.getLevelRecord(section, lvl.num);
      const stars = rec ? rec.stars : 0;
      const unlocked = Game.isLevelUnlocked(section, lvl.num);
      const mapName = (T.cs2.mapNames[lvl.map] || lvl.map).toUpperCase();
      const mapIcon = mapIcons[lvl.map] || '🗺️';
      const starsHtml = [1, 2, 3].map(s => `<span class="cs2-node-star ${s <= stars ? 'on' : ''}">★</span>`).join('');
      return `
        <button type="button" class="cs2-node ${unlocked ? 'cs2-node--open' : 'cs2-node--locked'} ${stars === 3 ? 'cs2-node--perfect' : ''}"
          data-level="${lvl.num}" data-section="${section}" data-unlocked="${unlocked ? '1' : '0'}"
          style="top:${top}px;left:${left}%" ${unlocked ? '' : 'disabled'}>
          <span class="cs2-node-icon">${unlocked ? mapIcon : '🔒'}</span>
          <span class="cs2-node-num">${unlocked ? lvl.num : ''}</span>
          <span class="cs2-node-map">${unlocked ? mapName : ''}</span>
          <span class="cs2-node-stars">${starsHtml}</span>
        </button>`;
    }).join('');

    const screen = this.showScreen(`
      <div class="cs2-map-root">
        <div class="cs2-map-bg" aria-hidden="true"></div>
        <div class="cs2-map-header">
          <button class="cs2-map-back" id="cs2-back">‹</button>
          <div class="cs2-map-header-center">
            <span class="cs2-map-header-icon">🎯</span>
            <span class="cs2-map-header-title">${cfg.name}</span>
          </div>
          <div class="cs2-map-header-score">
            <span class="cs2-map-pts">${score}</span>
            <span class="cs2-map-max">/ ${cfg.maxScore}</span>
          </div>
        </div>
        <div class="cs2-map-starprog">
          ${[...Array(36)].map((_, i) => `<span class="cs2-sp-dot ${i < totalStars ? 'on' : ''}"></span>`).join('')}
        </div>
        <div class="cs2-map-meta">
          <div class="cs2-map-meta-title">${T.cs2.mapBanner}</div>
          <div class="cs2-map-meta-sub">${T.cs2.mapSub}</div>
        </div>
        <div class="cs2-map-scroll">
          <div class="cs2-map-track" style="height:${rinkHeight}px">
            <svg class="cs2-map-path" viewBox="0 0 100 ${rinkHeight}" preserveAspectRatio="none" aria-hidden="true">
              <path d="${pathPoints}" fill="none" stroke="rgba(255,107,53,0.6)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="12 14"/>
              <path d="${pathPoints}" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            ${nodes}
          </div>
        </div>
        <div class="cs2-map-bottom">
          <button type="button" class="cs2-map-ad" id="cs2-ad">🎬 +❤️ Бонус</button>
          <button type="button" class="cs2-map-start" id="cs2-start">▶ ИГРАТЬ</button>
        </div>
      </div>`);

    const syncNodes = () => {
      screen.querySelectorAll('.cs2-node').forEach((btn) => {
        const lv = parseInt(btn.dataset.level, 10);
        const unlocked = btn.dataset.unlocked === '1';
        btn.classList.toggle('cs2-node--selected', unlocked && lv === selectedLevel);
      });
      const startBtn = screen.querySelector('#cs2-start');
      const canStart = Game.isLevelUnlocked(section, selectedLevel);
      startBtn.disabled = !canStart;
      startBtn.textContent = canStart ? `▶ УРОВЕНЬ ${selectedLevel}` : '🔒 ЗАБЛОКИРОВАНО';
    };

    screen.querySelectorAll('.cs2-node').forEach((btn) => {
      btn.onclick = () => {
        if (btn.dataset.unlocked !== '1') return;
        selectedLevel = parseInt(btn.dataset.level, 10);
        syncNodes();
      };
    });

    screen.querySelector('#cs2-start').onclick = () => {
      if (Game.isLevelUnlocked(section, selectedLevel)) this.showPreMatch(section, selectedLevel);
    };
    screen.querySelector('#cs2-back').onclick = () => this.goBack();
    screen.querySelector('#cs2-ad').onclick = () => {
      if (!SDK.canShowRewardedAd('level_map_ad')) {
        this._hubToast(screen, T.menuHub.dailyDone);
        return;
      }
      SDK.showRewardedAd(() => { SDK.markAdUsed('level_map_ad'); Game.grantMenuAdBonus(); this._hubToast(screen, T.levels.adBonusToast); }, () => {});
    };

    syncNodes();
  },

  _getSportPresentation(section) {
    if (section === 'esports') {
      return {
        label: 'CS2',
        icon: '🎯',
        liveTag: 'CS2 LIVE',
        goalText: 'РАУНД!',
        heroBg: 'linear-gradient(135deg,#0a0f1a,#0f1a2e)',
        stats: [
          { label: 'Винтовка', key: 'rifle' },
          { label: 'AWP',      key: 'awp' },
          { label: 'Утилити',  key: 'utility' },
          { label: 'Защита',   key: 'defense' },
          { label: 'Форма',    key: 'formScore' },
        ],
        compareTitle: 'СРАВНЕНИЕ ХАРАКТЕРИСТИК',
        formTitle: 'ПОСЛЕДНИЕ 5 МАТЧЕЙ',
        playersTitle: 'КЛЮЧЕВЫЕ ИГРОКИ',
        q1Title: '🎯 КТО ВЫИГРАЕТ КАРТУ?',
        q1Options: (teamA, teamB) => ([
          { id: 'A', label: teamA.shortName },
          { id: 'B', label: teamB.shortName },
        ]),
        q2Title: '🔢 ТОТАЛ РАУНДОВ',
        q2Options: [
          { id: 'low',  label: 'Меньше 26.5' },
          { id: 'high', label: 'Больше 26.5' },
        ],
        hint: 'Сделай оба прогноза чтобы начать',
        playerStats: (p) => [`⭐${p.rating}`, `🎯${p.hs}%HS`],
        resultWinnerLabel: 'Победитель карты',
        resultTotalLabel: 'Тотал раундов',
      };
    }
    if (section === 'hockey') {
      return {
        label: 'ХОККЕЙ',
        icon: '🏒',
        liveTag: 'HOCKEY LIVE',
        goalText: 'ШАЙБА!',
        heroBg: 'linear-gradient(135deg,#061423,#0c2847)',
        stats: [
          { label: 'Атака',   key: 'attack' },
          { label: 'Защита',  key: 'defense' },
          { label: 'Вратарь', key: 'goalie' },
          { label: 'Темп',    key: 'tempo' },
          { label: 'Форма',   key: 'formScore' },
        ],
        compareTitle: 'СРАВНЕНИЕ ХАРАКТЕРИСТИК',
        formTitle: 'ПОСЛЕДНИЕ 5 МАТЧЕЙ',
        playersTitle: 'КЛЮЧЕВЫЕ ИГРОКИ',
        q1Title: '🏆 КТО ПОБЕДИТ?',
        q1Options: (teamA, teamB) => ([
          { id: 'A', label: teamA.shortName },
          { id: 'B', label: teamB.shortName },
        ]),
        q2Title: '🥅 ТОТАЛ ШАЙБ',
        q2Options: [
          { id: 'low', label: 'Меньше 5.5' },
          { id: 'high', label: 'Больше 5.5' },
        ],
        hint: 'Сделай оба прогноза чтобы начать',
        playerStats: (p) => [`🥅${p.shot}`, `💨${p.speed}`],
        resultWinnerLabel: 'Победитель',
        resultTotalLabel: 'Тотал шайб',
      };
    }
    return {
      label: 'ФУТБОЛ',
      icon: '⚽',
      liveTag: 'MATCH LIVE',
      goalText: 'ГОЛ!',
      heroBg: 'linear-gradient(135deg,#0a1f0a,#1a3a1a)',
      stats: [
        { label: 'Атака',      key: 'attack' },
        { label: 'Защита',     key: 'defense' },
        { label: 'Полузащита', key: 'midfield' },
        { label: 'Форма',      key: 'formScore' },
      ],
      compareTitle: 'СРАВНЕНИЕ ХАРАКТЕРИСТИК',
      formTitle: 'ПОСЛЕДНИЕ 5 МАТЧЕЙ',
      playersTitle: 'КЛЮЧЕВЫЕ ИГРОКИ',
      q1Title: '🏆 КТО ПОБЕДИТ?',
      q1Options: (teamA, teamB) => ([
        { id: 'A',    label: teamA.shortName },
        { id: 'draw', label: 'Ничья' },
        { id: 'B',    label: teamB.shortName },
      ]),
      q2Title: '⚽ ТОТАЛ ГОЛОВ',
      q2Options: [
        { id: 'low', label: 'Меньше 2.5' },
        { id: 'high', label: 'Больше 2.5' },
      ],
      hint: 'Сделай оба прогноза чтобы начать',
      playerStats: (p) => [`⚡${p.shot}`, `🏃${p.speed}`],
      resultWinnerLabel: 'Победитель',
      resultTotalLabel: 'Тотал голов',
    };
  },

  _fmtResultP1Q1(id) {
    const m = Game.match;
    if (!m) return '';
    if (id === 'A') return m.teamA.shortName;
    if (id === 'B') return m.teamB.shortName;
    return T.phase1.q1.draw;
  },

  _fmtResultP1Q2(id) {
    return id === 'high'
      ? `${T.phase1.q2.sqHigh} ${T.phase1.q2.sqHighSub}`
      : `${T.phase1.q2.sqLow} ${T.phase1.q2.sqLowSub}`;
  },

  // =============================================
  // PRE-MATCH
  // =============================================
  showPreMatch(section, levelNum) {
    Game.startLevel(section, levelNum);
    const { teamA, teamB } = Game.match;
    const sport = this._getSportPresentation(section);
    const levelCfg = SECTIONS[section] && SECTIONS[section].levels.find(l => l.num === levelNum);
    const mapLabel = section === 'esports' && levelCfg && levelCfg.map
      ? ` · ${T.cs2.mapNames[levelCfg.map] || levelCfg.map}`
      : '';

    const statBar = (label, a, b) => {
      const total = Math.max(a + b, 1);
      const pctA = Math.round(a / total * 100);
      const pctB = Math.round(b / total * 100);
      const winnerA = a >= b;
      return `
        <div class="pm3-stat-row">
          <span class="pm3-sv pm3-sv--a ${winnerA ? 'pm3-sv--win' : ''}">${a}</span>
          <div class="pm3-bar-track">
            <div class="pm3-bar-side pm3-bar-side--a">
              <div class="pm3-bar-fill" style="width:${pctA}%;background:${teamA.color}"></div>
            </div>
            <div class="pm3-bar-side pm3-bar-side--b">
              <div class="pm3-bar-fill" style="width:${pctB}%;background:${teamB.color}"></div>
            </div>
          </div>
          <span class="pm3-sv pm3-sv--b ${!winnerA ? 'pm3-sv--win' : ''}">${b}</span>
          <span class="pm3-stat-label">${label}</span>
        </div>`;
    };

    const formDots = (form) => form.map(r => {
      const cls = r === 'W' ? 'pm3-dot--w' : r === 'D' ? 'pm3-dot--d' : 'pm3-dot--l';
      return `<span class="pm3-dot ${cls}">${r}</span>`;
    }).join('');

    const playerCard = (p, team) => {
      if (!p) return '';
      return `
        <div class="pm3-player-card">
          <div class="pm3-player-av" style="background:${team.color}">${p.name.split(' ').pop().slice(0,1)}</div>
          <div class="pm3-player-info">
            <div class="pm3-player-name">${p.name}</div>
            <div class="pm3-player-pos">${p.pos}</div>
          </div>
          <div class="pm3-player-stats">
            ${sport.playerStats(p).map(s => `<span>${s}</span>`).join('')}
          </div>
        </div>`;
    };

    const q1Options = sport.q1Options(teamA, teamB);
    const q2Options = sport.q2Options;

    const screen = this.showScreen(`
      <div class="pm3-root pm3-root--${section}">
        <div class="pm3-hero pm3-hero--${section}" style="--ca:${teamA.color};--cb:${teamB.color}">
          <div class="pm3-hero-inner">
            <button type="button" class="pm3-back-btn" id="pm3-back">←</button>
            <div class="pm3-level-tag">УР.${levelNum} · ${sport.label}${mapLabel}</div>
            <div class="pm3-hero-teams">
              <div class="pm3-hero-team pm3-hero-team--a">
                <div class="pm3-hero-emoji">${this._teamLogoHtml(section, teamA)}</div>
                <div class="pm3-hero-name">${teamA.name}</div>
                <div class="pm3-hero-rating">★ ${teamA.rating}</div>
              </div>
              <div class="pm3-hero-vs">
                <div class="pm3-hero-score">0 : 0</div>
                <div class="pm3-hero-vs-label">VS</div>
              </div>
              <div class="pm3-hero-team pm3-hero-team--b">
                <div class="pm3-hero-emoji">${this._teamLogoHtml(section, teamB)}</div>
                <div class="pm3-hero-name">${teamB.name}</div>
                <div class="pm3-hero-rating">★ ${teamB.rating}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="pm3-body">
          <div class="pm3-body-inner">
            <div class="pm3-winpct-row">
              <div class="pm3-winpct-bar" style="--wa:${teamA.winPct}%;--ca:${teamA.color};--cb:${teamB.color}">
                <div class="pm3-winpct-a">${teamA.winPct}%</div>
                <div class="pm3-winpct-sep">Победы</div>
                <div class="pm3-winpct-b">${teamB.winPct}%</div>
              </div>
            </div>

            <div class="pm3-grid">
              <div class="pm3-section">
                <div class="pm3-section-title">${sport.compareTitle}</div>
                ${sport.stats.map(s => statBar(s.label, teamA[s.key], teamB[s.key])).join('')}
              </div>

              <div class="pm3-section">
                <div class="pm3-section-title">${sport.formTitle}</div>
                <div class="pm3-form-row">
                  <span class="pm3-form-emoji">${this._teamLogoHtml(section, teamA)}</span>
                  <div class="pm3-form-dots">${formDots(teamA.form)}</div>
                </div>
                <div class="pm3-form-row">
                  <span class="pm3-form-emoji">${this._teamLogoHtml(section, teamB)}</span>
                  <div class="pm3-form-dots">${formDots(teamB.form)}</div>
                </div>
              </div>

              <div class="pm3-section pm3-section--players">
                <div class="pm3-section-title">${sport.playersTitle}</div>
                <div class="pm3-players-scroll">
                  ${teamA.players.slice(0, 2).map(p => playerCard(p, teamA)).join('')}
                  ${teamB.players.slice(0, 2).map(p => playerCard(p, teamB)).join('')}
                </div>
              </div>

              <div class="pm3-predict-card">
                <div class="pm3-predict-q">
                  <div class="pm3-predict-q-title">${sport.q1Title}</div>
                  <div class="pm3-opts pm3-opts--${q1Options.length}" id="pm3-q1">
                    ${q1Options.map(o => `<button type="button" class="pm3-opt" data-id="${o.id}">${o.label}</button>`).join('')}
                  </div>
                </div>
                <div class="pm3-predict-q">
                  <div class="pm3-predict-q-title">${sport.q2Title}</div>
                  <div class="pm3-opts pm3-opts--${q2Options.length}" id="pm3-q2">
                    ${q2Options.map(o => `<button type="button" class="pm3-opt" data-id="${o.id}">${o.label}</button>`).join('')}
                  </div>
                </div>
                <div class="pm3-predict-hint" id="pm3-hint">${sport.hint}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="pm3-footer">
          <div class="pm3-footer-inner">
            <button type="button" class="pm3-start-btn" id="pm3-start" disabled>▶ НАЧАТЬ МАТЧ</button>
          </div>
        </div>
      </div>`);

    let pickQ1 = null;
    let pickQ2 = null;

    const startBtn = screen.querySelector('#pm3-start');
    const hint     = screen.querySelector('#pm3-hint');

    const syncStart = () => {
      const ready = !!(pickQ1 && pickQ2);
      startBtn.disabled = !ready;
      if (hint) hint.style.opacity = ready ? '0' : '1';
    };

    const bindGroup = (id, which) => {
      screen.querySelector(id).querySelectorAll('.pm3-opt').forEach(btn => {
        btn.onclick = () => {
          screen.querySelector(id).querySelectorAll('.pm3-opt').forEach(b => b.classList.remove('pm3-opt--on'));
          btn.classList.add('pm3-opt--on');
          if (which === 1) pickQ1 = btn.dataset.id;
          else pickQ2 = btn.dataset.id;
          syncStart();
        };
      });
    };

    bindGroup('#pm3-q1', 1);
    bindGroup('#pm3-q2', 2);

    screen.querySelector('#pm3-back').onclick = () => {
      Game.stopTimer();
      Game.match = null;
      this.goBack();
    };

    startBtn.onclick = () => {
      if (!pickQ1 || !pickQ2) return;
      Game.commitPhase1FromPicks(pickQ1, pickQ2);
      this._showMatchStartBanner();
    };

    requestAnimationFrame(() => {
      screen.querySelectorAll('.pm3-bar-fill').forEach(el => {
        const w = el.style.width;
        el.style.width = '0';
        requestAnimationFrame(() => { el.style.width = w; });
      });
    });
  },

  _showMatchStartBanner() {
    this._matchEventLog = [];
    const sport = this._getSportPresentation(Game.match.section);

    this.showScreen(`
      <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;background:${sport.heroBg};padding:32px;">
        <div style="font-size:64px;animation:bounceLogo 0.8s ease-in-out infinite alternate;">${sport.icon}</div>
        <div style="font-size:26px;font-weight:900;color:#fff;letter-spacing:1px;">${T.phase1.matchStart}</div>
        <div style="font-size:13px;font-weight:700;color:rgba(255,255,255,0.6);">${Game.match.teamA.name} vs ${Game.match.teamB.name}</div>
        <div style="display:flex;gap:12px;margin-top:4px;">
          <div style="padding:5px 14px;background:rgba(255,255,255,0.12);border-radius:99px;font-size:11px;font-weight:800;color:#fff;text-transform:uppercase;">${sport.liveTag}</div>
        </div>
      </div>`);

    setTimeout(() => this._startLiveMatch(), 1200);
  },

  // =============================================
  // PHASE 2 — LIVE EVENT (BetBoom style field)
  // =============================================

  // SVG field — HORIZONTAL play (left goal / right goal), viewBox 100×62
  _fieldSVG(section) {
    if (section === 'esports') {
      // CS2 map — top-down simplified view (T left, CT right, two bomb sites)
      return `<svg class="lv-field-svg lv-field-svg--cs2" viewBox="0 0 100 62" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Map floor -->
        <rect x="0" y="0" width="100" height="62" fill="#0d1117"/>
        <!-- Outer border -->
        <rect x="1" y="1" width="98" height="60" rx="2" fill="none" stroke="rgba(255,107,53,0.35)" stroke-width="0.6"/>
        <!-- T Spawn (left) -->
        <rect x="2" y="22" width="18" height="18" rx="1.5" fill="rgba(255,107,53,0.12)" stroke="rgba(255,107,53,0.55)" stroke-width="0.55"/>
        <text x="11" y="32.5" text-anchor="middle" fill="rgba(255,107,53,0.85)" font-size="5" font-weight="bold">T</text>
        <!-- CT Spawn (right) -->
        <rect x="80" y="22" width="18" height="18" rx="1.5" fill="rgba(0,200,255,0.10)" stroke="rgba(0,200,255,0.55)" stroke-width="0.55"/>
        <text x="89" y="32.5" text-anchor="middle" fill="rgba(0,200,255,0.85)" font-size="5" font-weight="bold">CT</text>
        <!-- A Site (top-right) -->
        <rect x="64" y="2" width="20" height="18" rx="1.5" fill="rgba(255,200,0,0.08)" stroke="rgba(255,200,0,0.55)" stroke-width="0.55"/>
        <text x="74" y="13" text-anchor="middle" fill="rgba(255,200,0,0.9)" font-size="6" font-weight="bold">A</text>
        <!-- B Site (bottom-right) -->
        <rect x="64" y="42" width="20" height="18" rx="1.5" fill="rgba(255,200,0,0.08)" stroke="rgba(255,200,0,0.55)" stroke-width="0.55"/>
        <text x="74" y="53" text-anchor="middle" fill="rgba(255,200,0,0.9)" font-size="6" font-weight="bold">B</text>
        <!-- Mid area -->
        <rect x="32" y="26" width="30" height="10" rx="1" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.18)" stroke-width="0.4"/>
        <text x="47" y="32.5" text-anchor="middle" fill="rgba(255,255,255,0.35)" font-size="3.5">MID</text>
        <!-- Connectors T to Mid -->
        <line x1="20" y1="31" x2="32" y2="31" stroke="rgba(255,255,255,0.2)" stroke-width="0.4"/>
        <!-- Mid to CT -->
        <line x1="62" y1="31" x2="80" y2="31" stroke="rgba(255,255,255,0.2)" stroke-width="0.4"/>
        <!-- T to A site path -->
        <line x1="11" y1="22" x2="11" y2="11" stroke="rgba(255,107,53,0.25)" stroke-width="0.4"/>
        <line x1="11" y1="11" x2="64" y2="11" stroke="rgba(255,107,53,0.25)" stroke-width="0.4"/>
        <!-- T to B site path -->
        <line x1="11" y1="40" x2="11" y2="51" stroke="rgba(255,107,53,0.25)" stroke-width="0.4"/>
        <line x1="11" y1="51" x2="64" y2="51" stroke="rgba(255,107,53,0.25)" stroke-width="0.4"/>
        <!-- CT to A site -->
        <line x1="84" y1="22" x2="84" y2="20" stroke="rgba(0,200,255,0.25)" stroke-width="0.4"/>
        <!-- CT to B site -->
        <line x1="84" y1="40" x2="84" y2="42" stroke="rgba(0,200,255,0.25)" stroke-width="0.4"/>
      </svg>`;
    }
    if (section === 'hockey') {
      // Ice rink markings
      return `<svg class="lv-field-svg lv-field-svg--hockey" viewBox="0 0 100 62" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Rink border with rounded corners -->
        <rect x="1" y="1" width="98" height="60" rx="8" fill="none" stroke="rgba(180,220,255,0.6)" stroke-width="0.8"/>
        <!-- Red center line -->
        <line x1="50" y1="1" x2="50" y2="61" stroke="rgba(220,50,50,0.7)" stroke-width="0.9"/>
        <!-- Blue lines (zones) -->
        <line x1="32" y1="1" x2="32" y2="61" stroke="rgba(80,140,255,0.65)" stroke-width="0.8"/>
        <line x1="68" y1="1" x2="68" y2="61" stroke="rgba(80,140,255,0.65)" stroke-width="0.8"/>
        <!-- Center circle -->
        <circle cx="50" cy="31" r="9" fill="none" stroke="rgba(220,50,50,0.5)" stroke-width="0.6"/>
        <circle cx="50" cy="31" r="0.9" fill="rgba(220,50,50,0.8)"/>
        <!-- Left faceoff circles -->
        <circle cx="22" cy="18" r="5.5" fill="none" stroke="rgba(180,220,255,0.4)" stroke-width="0.55"/>
        <circle cx="22" cy="44" r="5.5" fill="none" stroke="rgba(180,220,255,0.4)" stroke-width="0.55"/>
        <!-- Right faceoff circles -->
        <circle cx="78" cy="18" r="5.5" fill="none" stroke="rgba(180,220,255,0.4)" stroke-width="0.55"/>
        <circle cx="78" cy="44" r="5.5" fill="none" stroke="rgba(180,220,255,0.4)" stroke-width="0.55"/>
        <!-- Left goal crease -->
        <rect x="1" y="22" width="10" height="18" rx="2" fill="rgba(80,140,255,0.12)" stroke="rgba(80,140,255,0.5)" stroke-width="0.6"/>
        <!-- Left goal net -->
        <rect x="-1" y="25" width="3" height="12" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.6)" stroke-width="0.6"/>
        <!-- Right goal crease -->
        <rect x="89" y="22" width="10" height="18" rx="2" fill="rgba(80,140,255,0.12)" stroke="rgba(80,140,255,0.5)" stroke-width="0.6"/>
        <!-- Right goal net -->
        <rect x="98" y="25" width="3" height="12" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.6)" stroke-width="0.6"/>
        <!-- Left goal line -->
        <line x1="11" y1="16" x2="11" y2="46" stroke="rgba(220,50,50,0.55)" stroke-width="0.55"/>
        <!-- Right goal line -->
        <line x1="89" y1="16" x2="89" y2="46" stroke="rgba(220,50,50,0.55)" stroke-width="0.55"/>
      </svg>`;
    }
    // Football pitch
    return `<svg class="lv-field-svg" viewBox="0 0 100 62" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Border -->
      <rect x="1" y="1" width="98" height="60" fill="none" stroke="rgba(255,255,255,0.55)" stroke-width="0.7"/>
      <!-- Halfway line -->
      <line x1="50" y1="1" x2="50" y2="61" stroke="rgba(255,255,255,0.45)" stroke-width="0.6"/>
      <!-- Centre circle -->
      <circle cx="50" cy="31" r="9.15" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="0.55"/>
      <circle cx="50" cy="31" r="0.85" fill="rgba(255,255,255,0.7)"/>
      <!-- Left penalty box -->
      <rect x="1" y="16" width="16" height="30" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="0.55"/>
      <!-- Left goal area -->
      <rect x="1" y="23" width="6" height="16" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="0.45"/>
      <!-- Left goal -->
      <rect x="-1" y="26" width="3" height="10" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.55)" stroke-width="0.5"/>
      <!-- Left penalty arc -->
      <path d="M 17 24 A 9 9 0 0 1 17 38" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="0.5"/>
      <!-- Left penalty spot -->
      <circle cx="10" cy="31" r="0.7" fill="rgba(255,255,255,0.6)"/>
      <!-- Right penalty box -->
      <rect x="83" y="16" width="16" height="30" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="0.55"/>
      <!-- Right goal area -->
      <rect x="93" y="23" width="6" height="16" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="0.45"/>
      <!-- Right goal -->
      <rect x="98" y="26" width="3" height="10" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.55)" stroke-width="0.5"/>
      <!-- Right penalty arc -->
      <path d="M 83 24 A 9 9 0 0 0 83 38" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="0.5"/>
      <!-- Right penalty spot -->
      <circle cx="90" cy="31" r="0.7" fill="rgba(255,255,255,0.6)"/>
      <!-- Corner flags -->
      <circle cx="1.5" cy="1.5" r="1" fill="rgba(220,60,60,0.8)"/>
      <circle cx="98.5" cy="1.5" r="1" fill="rgba(220,60,60,0.8)"/>
      <circle cx="1.5" cy="60.5" r="1" fill="rgba(220,60,60,0.8)"/>
      <circle cx="98.5" cy="60.5" r="1" fill="rgba(220,60,60,0.8)"/>
    </svg>`;
  },

  // Build vertical event log HTML
  _renderEvLog() {
    if (!this._matchEventLog || !this._matchEventLog.length) return '';
    const items = this._matchEventLog.slice().reverse().map(e =>
      `<div class="match-evlog-card match-evlog-card--${e.correct ? 'ok' : 'bad'}">
        <div class="match-evlog-min">${e.minute}'</div>
        <div class="match-evlog-body">
          <div class="match-evlog-title">${e.teamName}: ${e.typeName}</div>
          <div class="match-evlog-desc">${e.outcomeLine}</div>
        </div>
      </div>`
    ).join('');
    return `
      <div class="match-evlog-section" id="match-evlog">
        <div class="match-evlog-heading">ЛЕНТА СОБЫТИЙ</div>
        ${items}
      </div>`;
  },

  // =============================================
  // LIVE MATCH SIMULATION — persistent screen
  // =============================================

  _startLiveMatch() {
    const { match } = Game;
    if (!match) return;
    this._matchEventLog = [];
    this._lsState = { phase: 'idle', idleTimer: null, idleIdx: 0, blocked: false };

    const { teamA, teamB, section } = match;
    const sport = this._getSportPresentation(section);

    const screen = this.showScreen(`
      <div class="lv-root lv-root--${section}">
        <div class="lv-topbar">
          <div class="lv-topbar-team">
            <span class="lv-topbar-emoji">${this._teamLogoHtml(section, teamA)}</span>
            <span class="lv-topbar-name">${teamA.shortName}</span>
            <span class="lv-topbar-score" id="lv-score-a">0</span>
          </div>
          <div class="lv-topbar-center">
            <div class="lv-topbar-time" id="lv-time">0'</div>
            <div class="lv-topbar-live"><span class="lv-live-dot"></span>${sport.liveTag}</div>
          </div>
          <div class="lv-topbar-team lv-topbar-team--right">
            <span class="lv-topbar-score" id="lv-score-b">0</span>
            <span class="lv-topbar-name">${teamB.shortName}</span>
            <span class="lv-topbar-emoji">${this._teamLogoHtml(section, teamB)}</span>
          </div>
        </div>

        <div class="lv-stage">
          <div class="lv-field-wrap lv-field-wrap--${section}">
            <div class="lv-field lv-field--${section}" id="lv-field">
              ${this._fieldSVG(section)}
              <div id="lv-idle-players">${this._lvIdlePlayers(teamA, teamB)}</div>
              <div id="lv-event-players"></div>
              <div class="lv-ball lv-ball--${section}" id="lv-ball" style="left:50%;top:50%">${sport.icon}</div>
              <div class="lv-field-card" id="lv-event-card" style="opacity:0;pointer-events:none;"></div>
            </div>
            <div class="lv-timer-track"><div class="lv-timer-fill" id="lv-timer-fill" style="width:100%"></div></div>
          </div>
          <div id="lv-evlog-wrap">${this._renderEvLog()}</div>
        </div>

        <div class="lv-players-bar" id="lv-pbar" style="opacity:0;transition:opacity 0.3s;"></div>

        <div class="lv-question-bar" id="lv-qbar" style="opacity:0;transition:opacity 0.3s;">
          <div class="lv-question-text" id="lv-qtxt"></div>
        </div>

        <div class="lv-answers" id="lv-answers" style="opacity:0;pointer-events:none;transition:opacity 0.3s;">
          <button class="lv-ans lv-ans--yes" id="lv-btn-yes">
            <span class="lv-ans-icon">✓</span>
            <span class="lv-ans-label" id="lv-yes-lbl"></span>
            <span class="lv-ans-sub" id="lv-yes-sub"></span>
          </button>
          <button class="lv-ans lv-ans--no" id="lv-btn-no">
            <span class="lv-ans-icon">✗</span>
            <span class="lv-ans-label" id="lv-no-lbl"></span>
            <span class="lv-ans-sub" id="lv-no-sub"></span>
          </button>
        </div>

        <div class="lv-feedback" id="lv-feedback"></div>

        <div class="lv-inforow">
          <span id="lv-ev-count">0 / ${match.liveEvents.length} · Ур.${match.levelNum}</span>
          <span id="lv-pts">⭐ 0 очков</span>
        </div>
      </div>`);

    this._lsScreen = screen;

    screen.querySelector('#lv-btn-yes').onclick = () => this._handleLiveAnswer('yes');
    screen.querySelector('#lv-btn-no').onclick  = () => this._handleLiveAnswer('no');

    // Kickoff: ball at center, then start idle + first event
    setTimeout(() => {
      this._lvStartIdle();
      setTimeout(() => this._lvTriggerEvent(), 2200);
    }, 300);
  },

  _lvIdlePlayers(teamA, teamB) {
    const section = Game.match && Game.match.section;
    const A = teamA.color;
    const B = teamB.color;
    const dots = section === 'hockey'
      ? [
          // Team A (left side)
          { x: 6,  y: 50, c: A, gk: true },           // вратарь
          { x: 23, y: 37, c: A }, { x: 23, y: 63, c: A }, // защитники
          { x: 44, y: 50, c: A },                       // центр
          { x: 60, y: 34, c: A, fwd: true }, { x: 60, y: 66, c: A, fwd: true }, // нападающие
          // Team B (right side)
          { x: 94, y: 50, c: B, gk: true },
          { x: 77, y: 37, c: B }, { x: 77, y: 63, c: B },
          { x: 56, y: 50, c: B },
          { x: 40, y: 34, c: B, fwd: true }, { x: 40, y: 66, c: B, fwd: true },
        ]
      : [
          { x:4,  y:50, c:A, gk:true  },
          { x:22, y:27, c:A },
          { x:22, y:73, c:A },
          { x:40, y:40, c:A },
          { x:40, y:60, c:A },
          { x:57, y:50, c:A, fwd:true },
          { x:96, y:50, c:B, gk:true  },
          { x:78, y:27, c:B },
          { x:78, y:73, c:B },
          { x:60, y:40, c:B },
          { x:60, y:60, c:B },
        ];
    return dots.map(d => {
      const size = d.gk ? (section === 'hockey' ? 20 : 18) : d.fwd ? 18 : 15;
      return `<div class="lv-idlep" style="left:${d.x}%;top:${d.y}%;background:${d.c};width:${size}px;height:${size}px;margin-left:-${size/2}px;margin-top:-${size/2}px"></div>`;
    }).join('');
  },

  _lvMove(x, y, dur) {
    const ball = this._lsScreen && this._lsScreen.querySelector('#lv-ball');
    if (!ball) return;
    ball.style.transition = `left ${dur}s cubic-bezier(0.25,0.7,0.25,1), top ${dur}s cubic-bezier(0.25,0.7,0.25,1)`;
    ball.style.left = x + '%';
    ball.style.top  = y + '%';
  },

  _lvStartIdle() {
    const st = this._lsState;
    if (!st) return;
    const pos = Events.getIdlePositions(Game.match ? Game.match.section : 'football');
    st.idleTimer = setInterval(() => {
      if (!st || st.phase !== 'idle') return;
      st.idleIdx = (st.idleIdx + 1) % pos.length;
      const p = pos[st.idleIdx];
      this._lvMove(p.x, p.y, 0.85);
    }, 1150);
  },

  _lvStopIdle() {
    const st = this._lsState;
    if (st && st.idleTimer) { clearInterval(st.idleTimer); st.idleTimer = null; }
  },

  _lvTriggerEvent() {
    const st = this._lsState;
    const screen = this._lsScreen;
    if (!st || !screen || st.phase !== 'idle') return;

    const { match } = Game;
    if (!match || match.lives <= 0) { this._showGameOver(screen); return; }
    const event = Game.getCurrentEvent();
    if (!event || match.phase2Done) { this._finishLevel(); return; }

    st.phase = 'pre-event';
    this._lvStopIdle();

    const layout = event.layout || {};
    const bx = layout.ball ? layout.ball.x : 75;
    const by = layout.ball ? layout.ball.y : 50;

    // Update minute
    const timeEl = screen.querySelector('#lv-time');
    if (timeEl) timeEl.textContent = event.minute + "'";

    // Show event players, dim idle players
    const idleP = screen.querySelector('#lv-idle-players');
    if (idleP) idleP.style.opacity = '0.25';
    const evP = screen.querySelector('#lv-event-players');
    if (evP) {
      const attColor = event.attacker.color;
      const defColor = event.defender.color;
      const mk = (pos, cls, color) =>
        `<div class="lv-player lv-player--${cls}" style="left:${pos.x}%;top:${pos.y}%;background:${color}"></div>`;
      evP.innerHTML =
        (layout.gk        ? mk(layout.gk, 'gk', defColor) : '') +
        (layout.defenders||[]).map(p => mk(p, 'def', defColor)).join('') +
        (layout.attacker   ? mk(layout.attacker, 'att', attColor) : '');
    }

    // Move ball to event position
    this._lvMove(bx, by, 0.8);

    // Reveal event UI after ball arrives
    setTimeout(() => {
      st.phase = 'event';
      this._lvShowEventUI(screen, event);
    }, 900);
  },

  _lvShowEventUI(screen, event) {
    const match = Game.match;

    // Event card on field
    const card = screen.querySelector('#lv-event-card');
    if (card) {
      card.innerHTML = `
        <div class="lv-field-card-head">${event.icon} ${event.typeName} · ${event.minute}'</div>
        <div class="lv-field-card-row">
          <span class="lv-fc-name">${match.teamA.shortName}</span>
          <div class="lv-fc-timer">
            <svg viewBox="0 0 32 32">
              <circle cx="16" cy="16" r="13" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="2.5"/>
              <circle cx="16" cy="16" r="13" fill="none" stroke="#FFC800" stroke-width="2.5"
                stroke-dasharray="81.7" stroke-dashoffset="81.7"
                stroke-linecap="round" transform="rotate(-90 16 16)" id="lv-arc-fill"/>
            </svg>
          </div>
          <span class="lv-fc-name">${match.teamB.shortName}</span>
        </div>
        <div class="lv-field-card-player" style="background:${event.attacker.color}">${event.player.name}</div>`;
      card.style.opacity = '1';
      card.style.pointerEvents = 'auto';
    }

    // Player stats
    const pbar = screen.querySelector('#lv-pbar');
    if (pbar) {
      pbar.innerHTML = `
        <div class="lv-pstat lv-pstat--att" style="border-color:${event.attacker.color}55">
          <div class="lv-pstat-av" style="background:${event.attacker.color}">${event.player.name.split(' ').pop()[0]}</div>
          <div class="lv-pstat-info">
            <div class="lv-pstat-name">${event.player.name}</div>
            <div class="lv-pstat-role">${event.player.pos}</div>
          </div>
          <div class="lv-pstat-nums"><span>⚡${event.player.shot}</span><span>🏃${event.player.speed}</span></div>
        </div>
        <div class="lv-pstat-vs">VS</div>
        <div class="lv-pstat">
          <div class="lv-pstat-av lv-pstat-av--def">${event.opp.name.split(' ').pop()[0]}</div>
          <div class="lv-pstat-info">
            <div class="lv-pstat-name">${event.opp.name}</div>
            <div class="lv-pstat-role">${event.opp.pos}</div>
          </div>
          <div class="lv-pstat-nums"><span>🛡${event.opp.stat}</span></div>
        </div>
        <div class="lv-lives" id="lv-lives">${[1,2,3].map(i=>`<span class="lv-heart ${i>match.lives?'lv-heart--lost':''}"><img src="assets/img/ui/heart_full.png" class="lv-heart-img" alt="❤"></span>`).join('')}</div>`;
      pbar.style.opacity = '1';
    }

    // Question
    const qtxt = screen.querySelector('#lv-qtxt');
    if (qtxt) qtxt.textContent = event.title;
    const qbar = screen.querySelector('#lv-qbar');
    if (qbar) qbar.style.opacity = '1';

    // Answer buttons
    const answers = screen.querySelector('#lv-answers');
    if (answers) {
      screen.querySelector('#lv-yes-lbl').textContent = event.yesLabel;
      screen.querySelector('#lv-yes-sub').textContent = event.yesSub;
      screen.querySelector('#lv-no-lbl').textContent  = event.noLabel;
      screen.querySelector('#lv-no-sub').textContent  = event.noSub;
      answers.querySelectorAll('.lv-ans').forEach(b => {
        b.disabled = false;
        b.classList.remove('lv-ans--correct','lv-ans--wrong');
      });
      answers.style.opacity = '1';
      answers.style.pointerEvents = '';
    }

    // Timer arc + bar
    const arcFill = screen.querySelector('#lv-arc-fill');
    const fill    = screen.querySelector('#lv-timer-fill');
    const CIRC    = 81.7;
    if (fill) { fill.style.transition = 'none'; fill.style.width = '100%'; fill.style.background = '#FFC800'; }
    requestAnimationFrame(() => {
      if (fill) fill.style.transition = 'width 1s linear, background 0.3s';
    });

    Game.startTimer(
      (remaining) => {
        const pct = remaining / Game.TIMER_SECONDS;
        const col = remaining > 15 ? '#FFC800' : remaining > 7 ? '#FF9900' : '#FF4B4B';
        if (arcFill) { arcFill.style.strokeDashoffset = CIRC * (1 - pct); arcFill.style.stroke = col; }
        if (fill)    { fill.style.width = (pct * 100) + '%'; fill.style.background = col; }
      },
      () => this._handleLiveAnswer(Math.random() < 0.5 ? 'yes' : 'no', true)
    );
  },

  _handleLiveAnswer(playerAnswer, expired) {
    const st = this._lsState;
    const screen = this._lsScreen;
    if (!st || !screen || st.phase !== 'event' || st.blocked) return;
    st.blocked = true;

    Game.stopTimer();
    const answers = screen.querySelector('#lv-answers');
    if (answers) {
      answers.querySelector('#lv-btn-yes').disabled = true;
      answers.querySelector('#lv-btn-no').disabled  = true;
    }

    const event  = Game.getCurrentEvent();
    const result = Game.answerPhase2(playerAnswer);
    if (!result) return;

    const { correct, correctAnswer, gameOver } = result;

    // Log event
    if (!this._matchEventLog) this._matchEventLog = [];
    if (event) this._matchEventLog.push({
      teamName: event.attacker.name, typeName: event.typeName,
      icon: event.icon, minute: event.minute, correct,
      outcomeLine: Events.getOutcomeLine(event),
    });

    // Highlight buttons
    if (answers) {
      const yBtn = answers.querySelector('#lv-btn-yes');
      const nBtn = answers.querySelector('#lv-btn-no');
      (correctAnswer === 'yes' ? yBtn : nBtn).classList.add('lv-ans--correct');
      if (!correct) (correctAnswer === 'yes' ? nBtn : yBtn).classList.add('lv-ans--wrong');
    }

    // Feedback
    const fbEl = screen.querySelector('#lv-feedback');
    if (fbEl && event) {
      fbEl.textContent = Events.getFeedback(event, correct, playerAnswer);
      fbEl.className = `lv-feedback lv-feedback--${correct ? 'ok' : 'bad'}`;
    }

    // Lives
    const livesEl = screen.querySelector('#lv-lives');
    if (livesEl) livesEl.innerHTML = [1,2,3].map(i =>
      `<span class="lv-heart ${i > Game.match.lives ? 'lv-heart--lost' : ''}"><img src="assets/img/ui/heart_full.png" class="lv-heart-img" alt="❤"></span>`
    ).join('');

    // Goal effects
    const isGoal = correct && correctAnswer === 'yes';
    if (isGoal) {
      const flash = document.createElement('div');
      flash.className = 'lv-goal-flash';
      screen.appendChild(flash);
      setTimeout(() => flash.remove(), 600);
      const msg = document.createElement('div');
      msg.className = 'lv-goal-msg';
      msg.textContent = this._getSportPresentation(Game.match.section).goalText;
      screen.querySelector('#lv-field').appendChild(msg);
      setTimeout(() => msg.remove(), 1400);
    }

    // Update score + pts + log
    const sA = screen.querySelector('#lv-score-a');
    const sB = screen.querySelector('#lv-score-b');
    if (sA && event) sA.textContent = event.scoreA || 0;
    if (sB && event) sB.textContent = event.scoreB || 0;
    const ptsEl = screen.querySelector('#lv-pts');
    if (ptsEl) ptsEl.textContent = `⭐ ${Game.match.score} очков`;
    const evCount = screen.querySelector('#lv-ev-count');
    if (evCount) evCount.textContent = `${Game.match.currentEventIdx} / ${Game.match.liveEvents.length} · Ур.${Game.match.levelNum}`;
    const evlogWrap = screen.querySelector('#lv-evlog-wrap');
    if (evlogWrap) evlogWrap.innerHTML = this._renderEvLog();

    const delay = isGoal ? 1600 : 1100;
    setTimeout(() => {
      if (gameOver) { this._showGameOver(screen); return; }

      // Hide event UI
      const card = screen.querySelector('#lv-event-card');
      if (card) { card.style.opacity = '0'; card.style.pointerEvents = 'none'; }
      const pbar = screen.querySelector('#lv-pbar');
      if (pbar) pbar.style.opacity = '0';
      const qbar = screen.querySelector('#lv-qbar');
      if (qbar) qbar.style.opacity = '0';
      if (answers) { answers.style.opacity = '0'; answers.style.pointerEvents = 'none'; }
      if (fbEl)    { fbEl.textContent = ''; }

      // Restore idle players
      const evP   = screen.querySelector('#lv-event-players');
      const idleP = screen.querySelector('#lv-idle-players');
      if (evP)   evP.innerHTML = '';
      if (idleP) idleP.style.opacity = '1';

      if (Game.match.phase2Done) { this._finishLevel(); return; }

      // Resume — if goal ball goes center, if miss ball goes to defending GK
      st.phase   = 'idle';
      st.blocked = false;
      this._lvMove(isGoal ? 50 : 6, 50, 0.9);

      setTimeout(() => {
        this._lvStartIdle();
        setTimeout(() => this._lvTriggerEvent(), 1800);
      }, 1000);
    }, delay);
  },

  // ---- old stub kept so nothing breaks if called ----
  showPhase2Event() {
    const { match } = Game;
    if (!match) return;

    if (match.lives <= 0) { this._showGameOver(); return; }

    const event = Game.getCurrentEvent();
    if (!event || match.phase2Done) { this._finishLevel(); return; }

    const idx    = match.currentEventIdx;
    const total  = match.liveEvents.length;
    const scoreA = event.scoreA != null ? event.scoreA : 0;
    const scoreB = event.scoreB != null ? event.scoreB : 0;
    const pts    = match.score || 0;
    const layout = event.layout || {};
    const bx     = layout.ball ? layout.ball.x : 50;
    const by     = layout.ball ? layout.ball.y : 50;

    // Previous ball position for animation
    const prev = this._prevBallPos || { x: 50, y: 31 };
    this._prevBallPos = { x: bx, y: by };

    const hearts = [1,2,3].map(i =>
      `<span class="lv-heart ${i > match.lives ? 'lv-heart--lost' : ''}"><img src="assets/img/ui/heart_full.png" class="lv-heart-img" alt="❤"></span>`
    ).join('');

    // Build player dots HTML
    const mkDot = (pos, cls) =>
      `<div class="lv-player lv-player--${cls}" style="left:${pos.x}%;top:${pos.y}%"></div>`;
    const gkDot  = layout.gk        ? mkDot(layout.gk, 'gk')  : '';
    const defDots = (layout.defenders || []).map(p => mkDot(p, 'def')).join('');
    const attDot  = layout.attacker  ? mkDot(layout.attacker, 'att') : '';

    const evlogHtml = this._renderEvLog();

    const screen = this.showScreen(`
      <div class="lv-root">

        <!-- TOP BAR: TeamA score | time/live | score TeamB -->
        <div class="lv-topbar">
          <div class="lv-topbar-team">
            <span class="lv-topbar-emoji">${this._teamLogoHtml(match.section, match.teamA)}</span>
            <span class="lv-topbar-name">${match.teamA.shortName}</span>
            <span class="lv-topbar-score" id="lv-score-a">${scoreA}</span>
          </div>
          <div class="lv-topbar-center">
            <div class="lv-topbar-time" id="lv-time">${event.minute}'</div>
            <div class="lv-topbar-live"><span class="lv-live-dot"></span>LIVE</div>
          </div>
          <div class="lv-topbar-team lv-topbar-team--right">
            <span class="lv-topbar-score" id="lv-score-b">${scoreB}</span>
            <span class="lv-topbar-name">${match.teamB.shortName}</span>
            <span class="lv-topbar-emoji">${this._teamLogoHtml(match.section, match.teamB)}</span>
          </div>
        </div>

        <!-- FIELD -->
        <div class="lv-field-wrap ${match.section === 'hockey' ? 'lv-field-wrap--hockey' : ''}">
          <div class="lv-field" id="lv-field">
            ${this._fieldSVG(match.section)}

            <!-- Players (appear during events) -->
            ${gkDot}${defDots}${attDot}

            <!-- Ball (animated from prev position) -->
            <div class="lv-ball" id="lv-ball" style="left:${prev.x}%;top:${prev.y}%">${match.section === 'hockey' ? '🏒' : '⚽'}</div>

            <!-- Event card overlay (hidden until ball arrives) -->
            <div class="lv-field-card" id="lv-field-card" style="opacity:0;">
              <div class="lv-field-card-head">${event.icon} ${event.typeName} · ${event.minute}'</div>
              <div class="lv-field-card-row">
                <span class="lv-fc-name">${match.teamA.shortName}</span>
                <div class="lv-fc-timer">
                  <svg viewBox="0 0 32 32">
                    <circle cx="16" cy="16" r="13" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="2.5"/>
                    <circle cx="16" cy="16" r="13" fill="none" stroke="#FFC800" stroke-width="2.5"
                      stroke-dasharray="81.7" stroke-dashoffset="81.7"
                      stroke-linecap="round" transform="rotate(-90 16 16)"
                      id="lv-arc-fill"/>
                  </svg>
                </div>
                <span class="lv-fc-name">${match.teamB.shortName}</span>
              </div>
              <div class="lv-field-card-player" style="background:${event.attacker.color}">${event.player.name}</div>
            </div>
          </div>
          <!-- Timer strip -->
          <div class="lv-timer-track"><div class="lv-timer-fill" id="lv-timer-fill"></div></div>
        </div>

        <!-- PLAYER STATS -->
        <div class="lv-players-bar" id="lv-qbar" style="opacity:0;">
          <div class="lv-pstat lv-pstat--att" style="border-color:${event.attacker.color}">
            <div class="lv-pstat-av" style="background:${event.attacker.color}">${event.player.name.split(' ').pop().slice(0,1)}</div>
            <div class="lv-pstat-info">
              <div class="lv-pstat-name">${event.player.name}</div>
              <div class="lv-pstat-role">${event.player.pos}</div>
            </div>
            <div class="lv-pstat-nums">
              <span>⚡${event.player.shot}</span>
              <span>🏃${event.player.speed}</span>
            </div>
          </div>
          <div class="lv-pstat-vs">VS</div>
          <div class="lv-pstat lv-pstat--def">
            <div class="lv-pstat-av lv-pstat-av--def">${event.opp.name.split(' ').pop().slice(0,1)}</div>
            <div class="lv-pstat-info">
              <div class="lv-pstat-name">${event.opp.name}</div>
              <div class="lv-pstat-role">${event.opp.pos}</div>
            </div>
            <div class="lv-pstat-nums">
              <span>🛡${event.opp.stat}</span>
            </div>
          </div>
          <div class="lv-lives" id="lv-lives">${hearts}</div>
        </div>

        <!-- QUESTION -->
        <div class="lv-question-bar" style="opacity:inherit;">
          <div class="lv-question-text" id="lv-question">${event.title}</div>
        </div>

        <!-- ANSWER BUTTONS -->
        <div class="lv-answers" id="lv-answers" style="opacity:0;pointer-events:none;">
          <button class="lv-ans lv-ans--yes" id="lv-btn-yes">
            <span class="lv-ans-icon">✓</span>
            <span class="lv-ans-label">${event.yesLabel}</span>
            <span class="lv-ans-sub">${event.yesSub}</span>
          </button>
          <button class="lv-ans lv-ans--no" id="lv-btn-no">
            <span class="lv-ans-icon">✗</span>
            <span class="lv-ans-label">${event.noLabel}</span>
            <span class="lv-ans-sub">${event.noSub}</span>
          </button>
        </div>

        <!-- FEEDBACK -->
        <div class="lv-feedback" id="lv-feedback"></div>

        <!-- INFO ROW -->
        <div class="lv-inforow">
          <span>${idx + 1} / ${total} событий · Ур.${match.levelNum}</span>
          <span id="lv-pts">⭐ ${pts} очков</span>
        </div>

        <!-- EVENT LOG -->
        ${evlogHtml}

      </div>`);

    // --- Animate ball from prev → event position, then reveal UI ---
    const ball     = screen.querySelector('#lv-ball');
    const card     = screen.querySelector('#lv-field-card');
    const qbar     = screen.querySelector('#lv-qbar');
    const answers  = screen.querySelector('#lv-answers');
    const arcFill  = screen.querySelector('#lv-arc-fill');
    const CIRC     = 81.7;

    const revealUI = () => {
      if (card)    { card.style.transition    = 'opacity 0.3s'; card.style.opacity    = '1'; }
      if (qbar)    { qbar.style.transition    = 'opacity 0.3s'; qbar.style.opacity    = '1'; }
      if (answers) { answers.style.transition = 'opacity 0.3s'; answers.style.opacity = '1'; answers.style.pointerEvents = ''; }
      startTimer();
    };

    // Move ball with transition, then reveal
    requestAnimationFrame(() => {
      if (ball) {
        ball.style.transition = 'left 0.65s cubic-bezier(0.16,1,0.3,1), top 0.65s cubic-bezier(0.16,1,0.3,1)';
        ball.style.left = bx + '%';
        ball.style.top  = by + '%';
      }
      setTimeout(revealUI, 700);
    });

    const startTimer = () => {
      Game.startTimer(
        (remaining) => {
          const pct = remaining / Game.TIMER_SECONDS;
          if (arcFill) {
            arcFill.style.strokeDashoffset = CIRC * (1 - pct);
            const col = remaining > 15 ? '#FFC800' : remaining > 7 ? '#FF9900' : '#FF4B4B';
            arcFill.style.stroke = col;
          }
          const fill = screen.querySelector('#lv-timer-fill');
          if (fill) {
            const col = remaining > 15 ? '#FFC800' : remaining > 7 ? '#FF9900' : '#FF4B4B';
            fill.style.width = (pct * 100) + '%';
            fill.style.background = col;
          }
        },
        () => { this._handlePhase2Answer(screen, Math.random() < 0.5 ? 'yes' : 'no', true); }
      );
    };

    const answer = (val) => {
      Game.stopTimer();
      screen.querySelector('#lv-btn-yes').disabled = true;
      screen.querySelector('#lv-btn-no').disabled  = true;
      this._handlePhase2Answer(screen, val, false);
    };

    screen.querySelector('#lv-btn-yes').onclick = () => answer('yes');
    screen.querySelector('#lv-btn-no').onclick  = () => answer('no');
  },

  _handlePhase2Answer(screen, playerAnswer, expired) {
    // Get the event BEFORE calling answerPhase2 (it advances the index)
    const event  = Game.getCurrentEvent();
    const result = Game.answerPhase2(playerAnswer);
    if (!result) return;

    const { correct, correctAnswer, gameOver } = result;

    // Add to event log
    if (!this._matchEventLog) this._matchEventLog = [];
    if (event) {
      this._matchEventLog.push({
        teamName:    event.attacker.name,
        typeName:    event.typeName,
        icon:        event.icon,
        minute:      event.minute,
        correct,
        outcomeLine: Events.getOutcomeLine(event),
      });
    }

    // Highlight answer buttons
    const yesBtn = screen.querySelector('#lv-btn-yes');
    const noBtn  = screen.querySelector('#lv-btn-no');
    const correctBtn = correctAnswer === 'yes' ? yesBtn : noBtn;
    const wrongBtn   = correctAnswer === 'yes' ? noBtn  : yesBtn;
    if (correctBtn) correctBtn.classList.add('lv-ans--correct');
    if (!correct && wrongBtn) wrongBtn.classList.add('lv-ans--wrong');

    // Feedback text
    const fbEl = screen.querySelector('#lv-feedback');
    if (fbEl && event) {
      fbEl.textContent = Events.getFeedback(event, correct, playerAnswer);
      fbEl.className = `lv-feedback lv-feedback--${correct ? 'ok' : 'bad'}`;
    }

    // Update lives display
    const livesEl = screen.querySelector('#lv-lives');
    if (livesEl) {
      livesEl.innerHTML = [1,2,3].map(i =>
        `<span class="lv-heart ${i > Game.match.lives ? 'lv-heart--lost' : ''}"><img src="assets/img/ui/heart_full.png" class="lv-heart-img" alt="❤"></span>`
      ).join('');
    }

    // Goal flash animation
    if (correct && correctAnswer === 'yes') {
      const flash = document.createElement('div');
      flash.className = 'lv-goal-flash';
      screen.appendChild(flash);
      setTimeout(() => flash.remove(), 600);
    }

    // Update score display
    const scoreA = screen.querySelector('#lv-score-a');
    const scoreB = screen.querySelector('#lv-score-b');
    if (scoreA && event) scoreA.textContent = event.scoreA || 0;
    if (scoreB && event) scoreB.textContent = event.scoreB || 0;

    // Update pts display
    const ptsEl = screen.querySelector('#lv-pts');
    if (ptsEl) ptsEl.textContent = `⭐ ${Game.match.score} очков`;

    const delay = correct ? 900 : 1100;
    setTimeout(() => {
      if (gameOver) {
        this._showGameOver(screen);
      } else if (Game.match.phase2Done) {
        this._finishLevel();
      } else {
        this.showPhase2Event();
      }
    }, delay);
  },

  // =============================================
  // GAME OVER (no lives)
  // =============================================
  _showGameOver(currentScreen) {
    const canWatch = !Game.match.adUsed && SDK.canShowRewardedAd('life');

    const overlay = document.createElement('div');
    overlay.className = 'gameover-overlay';
    overlay.innerHTML = `
      <div class="gameover-icon">💔</div>
      <div class="gameover-title">${T.phase2.gameOver}</div>
      <div class="gameover-desc">${T.phase2.gameOverDesc}</div>
      <div class="gameover-btns">
        ${canWatch ? `<button class="btn btn-yellow btn-icon" id="go-watch">${T.phase2.watchAd}</button>` : ''}
        <button class="btn btn-primary" id="go-retry">${T.phase2.retry}</button>
        <button class="btn btn-secondary" id="go-map">${T.phase2.backMap}</button>
      </div>`;

    const target = currentScreen || this.app.querySelector('.screen.active');
    if (target) target.appendChild(overlay);

    Game.stopTimer();
    Game.finishMatch(); // record the loss

    overlay.querySelector('#go-retry') && (overlay.querySelector('#go-retry').onclick = () => {
      const { section, levelNum } = Game.match;
      this._clearAndShow(() => this.showPreMatch(section, levelNum));
    });

    overlay.querySelector('#go-map') && (overlay.querySelector('#go-map').onclick = () => {
      const section = Game.match.section;
      this._clearAndShow(() => this.showLevelMap(section));
    });

    const watchBtn = overlay.querySelector('#go-watch');
    if (watchBtn) {
      watchBtn.onclick = () => {
        watchBtn.disabled = true;
        watchBtn.textContent = '⏳ Загрузка...';
        SDK.showRewardedAd(
          () => {
            // Rewarded: give +1 life
            Game.addLife();
            overlay.remove();
            this.showPhase2Event();
          },
          () => {
            watchBtn.disabled = false;
            watchBtn.textContent = T.phase2.watchAd;
          }
        );
      };
    }
  },

  // =============================================
  // FINISH LEVEL & RESULT SCREEN
  // =============================================
  _finishLevel() {
    Game.stopTimer();
    const result = Game.finishMatch();
    if (!result) return;

    // Show interstitial ad occasionally (every ~3 games)
    const games = Game.data.stats.gamesPlayed;
    if (games % 3 === 0) {
      SDK.showInterstitialAd(() => this._showResult(result));
    } else {
      this._showResult(result);
    }
  },

  _showResult(result) {
    const { won, stars, score, isNewBest } = result;
    const match     = Game.match;
    const maxEvents = match.liveEvents.length;
    const p1s       = match.phase1Score;
    const p2s       = match.phase2Score;
    const { teamA, teamB, section, levelNum } = match;
    const sport = this._getSportPresentation(section);

    // Final score from last event (or 0:0)
    const lastEvent = match.liveEvents[match.liveEvents.length - 1];
    const finalA = lastEvent ? (lastEvent.scoreA || 0) : 0;
    const finalB = lastEvent ? (lastEvent.scoreB || 0) : 0;

    // Stars HTML — all start off, JS animates them in staggered
    const starsHtml = [1,2,3].map(n =>
      `<span class="rs-star rs-star--off" id="rs-star${n}"><img src="assets/img/ui/star_gold.png" class="rs-star-img" alt="★"></span>`
    ).join('');

    // Phase 1 recap
    const p1ans = match.phase1Answers || [];
    let p1html = '';
    if (p1ans.length >= 2) {
      const mk = (a, label) => `
        <div class="rs-pred-row rs-pred-row--${a.correct ? 'ok' : 'bad'}">
          <span class="rs-pred-icon">${a.correct ? '✓' : '✗'}</span>
          <div class="rs-pred-body">
            <span class="rs-pred-q">${label}</span>
            <span class="rs-pred-ans">Твой: ${a.correct ? 'верно' : 'неверно'}</span>
          </div>
        </div>`;
      p1html = `
        <div class="rs-section">
          <div class="rs-section-title">ПРЕДМАТЧЕВЫЙ ПРОГНОЗ</div>
          ${mk(p1ans[0], sport.resultWinnerLabel)}
          ${mk(p1ans[1], sport.resultTotalLabel)}
        </div>`;
    }

    // Event log
    const logHtml = this._matchEventLog && this._matchEventLog.length ? `
      <div class="rs-section">
        <div class="rs-section-title">КЛЮЧЕВЫЕ МОМЕНТЫ</div>
        ${this._matchEventLog.slice(-4).map(e => `
          <div class="rs-log-row rs-log-row--${e.correct ? 'ok' : 'bad'}">
            <span class="rs-log-min">${e.minute}'</span>
            <div class="rs-log-body">
              <div class="rs-log-title">${e.teamName}: ${e.typeName}</div>
              <div class="rs-log-desc">${e.outcomeLine}</div>
            </div>
            <span class="rs-log-result">${e.correct ? '✓' : '✗'}</span>
          </div>`).join('')}
      </div>` : '';

    const screen = this.showScreen(`
      <div class="rs-root">

        <!-- HERO -->
        <div class="rs-hero" style="--ca:${teamA.color};--cb:${teamB.color}">
          <div class="rs-hero-teams">
            <div class="rs-hero-team">
              <div class="rs-hero-emoji">${this._teamLogoHtml(section, teamA)}</div>
              <div class="rs-hero-name">${teamA.shortName}</div>
            </div>
            <div class="rs-hero-score">
              <div class="rs-score">${finalA} : ${finalB}</div>
              <div class="rs-status ${won ? 'rs-status--win' : 'rs-status--lose'}">${won ? '✦ ПОБЕДА' : '✖ ПОРАЖЕНИЕ'}</div>
            </div>
            <div class="rs-hero-team rs-hero-team--b">
              <div class="rs-hero-emoji">${this._teamLogoHtml(section, teamB)}</div>
              <div class="rs-hero-name">${teamB.shortName}</div>
            </div>
          </div>
        </div>

        <!-- STARS -->
        <div class="rs-stars-wrap">
          <div class="rs-stars">${starsHtml}</div>
          ${isNewBest ? '<div class="rs-new-best">🔥 Новый рекорд!</div>' : ''}
        </div>

        <!-- SCROLLABLE BODY -->
        <div class="rs-body">

          <!-- Score breakdown -->
          <div class="rs-score-card">
            <div class="rs-score-item">
              <div class="rs-score-val">${score}<span class="rs-score-max">/10</span></div>
              <div class="rs-score-lbl">Очков</div>
            </div>
            <div class="rs-score-divider"></div>
            <div class="rs-score-item">
              <div class="rs-score-val">${p1s}<span class="rs-score-max">/2</span></div>
              <div class="rs-score-lbl">Прогноз</div>
            </div>
            <div class="rs-score-divider"></div>
            <div class="rs-score-item">
              <div class="rs-score-val">${p2s}<span class="rs-score-max">/${maxEvents}</span></div>
              <div class="rs-score-lbl">Live</div>
            </div>
            <div class="rs-score-divider"></div>
            <div class="rs-score-item">
              <div class="rs-score-val">${maxEvents > 0 ? Math.round(p2s/maxEvents*100) : 0}<span class="rs-score-max">%</span></div>
              <div class="rs-score-lbl">Точность</div>
            </div>
          </div>

          ${p1html}
          ${logHtml}

          <div style="height:8px"></div>
        </div>

        <!-- FOOTER -->
        <div class="rs-footer">
          ${won ? `<button class="rs-btn rs-btn--next" id="btn-next">Следующий уровень ▶</button>` : ''}
          <div class="rs-footer-row">
            <button class="rs-btn rs-btn--retry" id="btn-retry">↺ Заново</button>
            <button class="rs-btn rs-btn--map"   id="btn-map">Карта</button>
          </div>
        </div>

      </div>`);

    // Animate stars in sequentially
    [1,2,3].forEach((n, i) => {
      const el = screen.querySelector(`#rs-star${n}`);
      if (!el) return;
      if (n <= stars) {
        setTimeout(() => {
          el.classList.remove('rs-star--off');
          el.classList.add('rs-star--on');
        }, 350 + i * 220);
      }
    });

    const nextBtn = screen.querySelector('#btn-next');
    if (nextBtn) {
      const nextNum = levelNum + 1;
      const hasNext = SECTIONS[section].levels.some(l => l.num === nextNum);
      if (!hasNext) nextBtn.style.display = 'none';
      else nextBtn.onclick = () => this._clearAndShow(() => this.showPreMatch(section, nextNum));
    }
    screen.querySelector('#btn-retry').onclick = () =>
      this._clearAndShow(() => this.showPreMatch(section, levelNum));
    screen.querySelector('#btn-map').onclick = () =>
      this._clearAndShow(() => this.showLevelMap(section));
  },

  // =============================================
  // PROFILE SCREEN
  // =============================================
  showProfile() {
    const d = Game.data;
    const achs = Object.entries(T.achievements);
    const totalScore = Game.getTotalScore();

    const accuracy = d.stats.totalAnswers > 0
      ? Math.round(d.stats.correctPredictions / d.stats.totalAnswers * 100)
      : 0;

    // Player tier based on total score
    const tier = totalScore >= 250 ? { label: 'Легенда', icon: '👑', color: '#FFC800' }
               : totalScore >= 150 ? { label: 'Эксперт',  icon: '🏆', color: '#CE82FF' }
               : totalScore >= 50  ? { label: 'Аналитик', icon: '📊', color: '#1CB0F6' }
               :                     { label: 'Новичок',  icon: '⚽', color: '#58CC02' };

    // Section progress bars
    const sections = [
      { id: 'football', icon: '⚽', name: 'Футбол',     color: '#58CC02' },
      { id: 'hockey',   icon: '🏒', name: 'Хоккей',     color: '#1CB0F6' },
      { id: 'esports',  icon: '🎮', name: 'Киберспорт', color: '#CE82FF' },
    ];
    const progCards = sections.map(s => {
      const sc = Game.getSectionScore(s.id);
      const max = SECTIONS[s.id].maxScore || 120;
      const pct = Math.round(sc / max * 100);
      return `
        <div class="prf-prog-card">
          <span class="prf-prog-icon">${s.icon}</span>
          <div class="prf-prog-info">
            <div class="prf-prog-name">${s.name}</div>
            <div class="prf-prog-bar-track">
              <div class="prf-prog-bar-fill" style="width:${pct}%;background:${s.color}"></div>
            </div>
          </div>
          <span class="prf-prog-score" style="color:${s.color}">${sc}<span class="prf-prog-max">/${max}</span></span>
        </div>`;
    }).join('');

    // Achievements
    const achList = achs.map(([id, cfg]) => {
      const earned = d.achievements.includes(id);
      return `
        <div class="prf-ach-item ${earned ? 'prf-ach-item--earned' : 'prf-ach-item--locked'}">
          <span class="prf-ach-icon">${cfg.icon}</span>
          <div class="prf-ach-body">
            <span class="prf-ach-name">${cfg.name}</span>
            <span class="prf-ach-desc">${earned ? cfg.desc : T.profile.locked}</span>
          </div>
          <span class="prf-ach-pts">${earned ? '+' + cfg.pts : '?'}</span>
        </div>`;
    }).join('');

    const earnedCount = d.achievements.length;
    const totalAch = achs.length;

    const screen = this.showScreen(`
      <div class="prf-root">

        <!-- Hero -->
        <div class="prf-hero">
          <button class="prf-back" id="btn-back">‹</button>
          <div class="prf-avatar">${tier.icon}</div>
          <div class="prf-username">Игрок</div>
          <div class="prf-tier-badge" style="color:${tier.color};border-color:${tier.color}40;background:${tier.color}15">
            ${tier.label}
          </div>
        </div>

        <!-- Stats row -->
        <div class="prf-stats-row">
          <div class="prf-stat">
            <span class="prf-stat-val">${d.stats.gamesPlayed}</span>
            <span class="prf-stat-lbl">Матчей</span>
          </div>
          <div class="prf-stat-sep"></div>
          <div class="prf-stat">
            <span class="prf-stat-val">${accuracy}%</span>
            <span class="prf-stat-lbl">Точность</span>
          </div>
          <div class="prf-stat-sep"></div>
          <div class="prf-stat">
            <span class="prf-stat-val">${totalScore}</span>
            <span class="prf-stat-lbl">Очков</span>
          </div>
          <div class="prf-stat-sep"></div>
          <div class="prf-stat">
            <span class="prf-stat-val">${d.stats.perfectGames}</span>
            <span class="prf-stat-lbl">Идеально</span>
          </div>
        </div>

        <div class="prf-body">

          <!-- Streak card -->
          <div class="prf-streak-card">
            <div class="prf-streak-left">
              <span class="prf-streak-fire">🔥</span>
              <div>
                <div class="prf-streak-val">${d.winStreak}</div>
                <div class="prf-streak-lbl">Текущая серия</div>
              </div>
            </div>
            <div class="prf-streak-best">
              <span class="prf-streak-best-val">${d.bestStreak}</span>
              <span class="prf-streak-best-lbl">Рекорд</span>
            </div>
          </div>

          <!-- Section progress -->
          <div class="prf-section-title">ПРОГРЕСС</div>
          <div class="prf-prog-list">${progCards}</div>

          <!-- Achievements -->
          <div class="prf-section-title">
            ДОСТИЖЕНИЯ
            <span class="prf-ach-count">${earnedCount} / ${totalAch}</span>
          </div>
          <div class="prf-ach-list">${achList}</div>

          <div style="height:20px"></div>
        </div>
      </div>`);

    screen.querySelector('#btn-back').onclick = () => this.goBack();
  },

  // =============================================
  // UTILS
  // =============================================
  _clearAndShow(fn) {
    this.app.querySelectorAll('.screen').forEach(s => s.remove());
    fn();
  },
};
