'use strict';

// =============================================
// GAME STATE & LOGIC
// =============================================
const Game = {

  TIMER_SECONDS: 25,
  MAX_LIVES: 3,

  // ---- persistent player data ----
  data: {
    levels: {
      football: {}, // { "1": { best: 8, stars: 2, attempts: 3 }, ... }
      hockey:   {},
      esports:  {},
    },
    totalScore: { football: 0, hockey: 0, esports: 0 },
    winStreak:   0,
    bestStreak:  0,
    dailyBonus:  null,
    achievements: [],
    settings:    { sound: true, lang: 'ru' },
    stats: {
      gamesPlayed:        0,
      gamesWon:           0,
      correctPredictions: 0,
      totalAnswers:       0,
      perfectGames:       0,
      phase1Correct:      0,
      phase1Total:        0,
      fastAnswers:        0,  // answered < 5 sec
    },
  },

  // ---- current match state ----
  match: null,

  // ---- timer ----
  _timerInterval: null,
  _timerCallback: null,

  // =============================================
  // DATA PERSISTENCE
  // =============================================
  async loadData() {
    const saved = await SDK.load();
    if (saved) {
      this.data = this._deepMerge(this._defaultData(), saved);
    }
  },

  async saveData() {
    await SDK.save(this.data);
    await SDK.saveStats({
      totalScore:   this.getTotalScore(),
      winStreak:    this.data.winStreak,
      gamesPlayed:  this.data.stats.gamesPlayed,
    });
    SDK.submitScore(this.getTotalScore());
  },

  _defaultData() {
    return {
      levels: { football: {}, hockey: {}, esports: {} },
      totalScore: { football: 0, hockey: 0, esports: 0 },
      winStreak: 0, bestStreak: 0,
      dailyBonus: null,
      achievements: [],
      settings: { sound: true, lang: 'ru' },
      stats: { gamesPlayed:0, gamesWon:0, correctPredictions:0, totalAnswers:0, perfectGames:0, phase1Correct:0, phase1Total:0, fastAnswers:0 },
    };
  },

  _deepMerge(target, source) {
    const out = { ...target };
    for (const key of Object.keys(source)) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        out[key] = this._deepMerge(target[key] || {}, source[key]);
      } else {
        out[key] = source[key];
      }
    }
    return out;
  },

  // =============================================
  // QUERIES
  // =============================================
  getLevelRecord(section, levelNum) {
    return this.data.levels[section][String(levelNum)] || null;
  },

  getTotalScore() {
    return Object.values(this.data.totalScore).reduce((s, v) => s + v, 0);
  },

  getSectionScore(section) {
    return this.data.totalScore[section] || 0;
  },

  getLevelStars(section, levelNum) {
    const rec = this.getLevelRecord(section, levelNum);
    return rec ? rec.stars : 0;
  },

  isSectionUnlocked(section) {
    const cfg = SECTIONS[section];
    if (!cfg.unlockSection) return true;
    return this.getSectionScore(cfg.unlockSection) >= cfg.unlockScore;
  },

  isLevelUnlocked(section, levelNum) {
    if (levelNum === 1) return true;
    const prev = this.getLevelRecord(section, levelNum - 1);
    return prev && prev.stars >= 1;
  },

  isDailyBonusAvailable() {
    const today = new Date().toISOString().slice(0, 10);
    return this.data.dailyBonus !== today;
  },

  // =============================================
  // MATCH LIFECYCLE
  // =============================================
  startLevel(section, levelNum) {
    const lvl = getLevelData(section, levelNum);
    if (!lvl) return;

    const totalThreshold = lvl.totalThreshold || (section === 'football' ? 2.5 : section === 'hockey' ? 5.5 : 26.5);
    const matchResult = Events.generateMatchResult(section, lvl.teamA, lvl.teamB);
    const goalTotal   = Events.generateGoalTotal(section, lvl.teamA, lvl.teamB, totalThreshold);
    const liveEvents  = Events.generate(section, lvl.teamA, lvl.teamB, lvl.events);

    this.match = {
      section,
      levelNum,
      levelData:  lvl,
      teamA:      lvl.teamA,
      teamB:      lvl.teamB,

      // Pre-determined outcomes (hidden from player)
      matchResult,    // 'A' | 'draw' | 'B'
      goalTotal,      // 'high' | 'low'
      totalThreshold, // e.g. 1.5, 2.5, 3.5
      liveEvents,

      // Scoring
      lives:  this.MAX_LIVES,
      score:  0,

      // Phase 1
      phase1Done: false,
      phase1Score: 0,
      phase1Answers: [], // [{correct: bool}]

      // Phase 2
      phase2Done:  false,
      phase2Score: 0,
      currentEventIdx: 0,

      // Result
      won: false,
      adUsed: false,
    };

    SDK.resetAdUsed('life');
    SDK.resetAdUsed('streak');
  },

  // Phase 1 — player submits prediction
  answerPhase1(questionIdx, playerAnswer) {
    if (!this.match) return null;
    const { match } = this;

    let correctAnswer;
    if (questionIdx === 0) {
      // Who wins? options: 'A', 'draw', 'B'
      correctAnswer = match.matchResult;
    } else {
      // Goals: 'high' | 'low'
      correctAnswer = match.goalTotal;
    }

    const correct = playerAnswer === correctAnswer;
    if (correct) {
      match.score++;
      match.phase1Score++;
    }

    match.phase1Answers.push({ correct, playerAnswer, correctAnswer });
    this.data.stats.phase1Total++;
    if (correct) this.data.stats.phase1Correct++;

    return { correct, correctAnswer };
  },

  finishPhase1() {
    if (this.match) this.match.phase1Done = true;
  },

  /** Вызвать после выбора обоих прогнозов на предматче (без промежуточного UI). */
  commitPhase1FromPicks(q1, q2) {
    if (!this.match) return false;
    this.answerPhase1(0, q1);
    this.answerPhase1(1, q2);
    this.finishPhase1();
    return true;
  },

  // Phase 2 — player answers live event
  answerPhase2(playerAnswer) {
    if (!this.match) return null;
    const { match } = this;
    const event = match.liveEvents[match.currentEventIdx];
    if (!event) return null;

    const correct = playerAnswer === event.correct;

    this.data.stats.totalAnswers++;

    if (correct) {
      match.score++;
      match.phase2Score++;
      this.data.stats.correctPredictions++;
    } else {
      match.lives--;
    }

    const result = {
      correct,
      correctAnswer: event.correct,
      livesLeft: match.lives,
      gameOver: match.lives <= 0,
    };

    match.currentEventIdx++;

    // Check if all events done
    if (match.currentEventIdx >= match.liveEvents.length) {
      match.phase2Done = true;
    }

    return result;
  },

  getCurrentEvent() {
    if (!this.match) return null;
    return this.match.liveEvents[this.match.currentEventIdx] || null;
  },

  // Finish match and compute result
  finishMatch() {
    if (!this.match) return null;
    const { match } = this;

    const won = match.lives > 0 && match.score >= match.levelData.winThreshold;
    match.won = won;

    if (won) {
      const maxScore = 2 + match.liveEvents.length;
      const stars = match.score >= maxScore ? 3 : match.score >= Math.ceil(maxScore * 0.75) ? 2 : 1;
      const rec   = this.getLevelRecord(match.section, match.levelNum);
      const prevBest = rec ? rec.best : 0;
      const isNewBest = match.score > prevBest;

      // Update level record
      this.data.levels[match.section][String(match.levelNum)] = {
        best:     Math.max(prevBest, match.score),
        stars:    Math.max(rec ? rec.stars : 0, stars),
        attempts: (rec ? rec.attempts : 0) + 1,
      };

      // Recalculate section score
      this._recalcSectionScore(match.section);

      // Win streak
      this.data.winStreak++;
      if (this.data.winStreak > this.data.bestStreak) {
        this.data.bestStreak = this.data.winStreak;
      }

      // Stats
      this.data.stats.gamesPlayed++;
      this.data.stats.gamesWon = (this.data.stats.gamesWon || 0) + 1;
      if (stars === 3) this.data.stats.perfectGames++;

      this._checkAchievements();
      this.saveData();

      return { won: true, stars, score: match.score, isNewBest };
    } else {
      // Loss: break win streak
      const prevStreak = this.data.winStreak;
      this.data.winStreak = 0;
      const rec = this.getLevelRecord(match.section, match.levelNum);
      this.data.levels[match.section][String(match.levelNum)] = {
        best:     rec ? rec.best : 0,
        stars:    rec ? rec.stars : 0,
        attempts: (rec ? rec.attempts : 0) + 1,
      };
      this.data.stats.gamesPlayed++;
      this.saveData();

      return { won: false, stars: 0, score: match.score, prevStreak };
    }
  },

  // Add extra life from rewarded ad
  addLife() {
    if (this.match && this.match.lives < this.MAX_LIVES + 1) {
      this.match.lives++;
      this.match.adUsed = true;
      SDK.markAdUsed('life');
    }
  },

  // =============================================
  // SCORE RECALCULATION
  // =============================================
  _recalcSectionScore(section) {
    const levels = this.data.levels[section];
    let total = 0;
    Object.values(levels).forEach(rec => { total += rec.best || 0; });
    this.data.totalScore[section] = total;
  },

  // =============================================
  // TIMER
  // =============================================
  startTimer(onTick, onExpire) {
    this.stopTimer();
    let remaining = this.TIMER_SECONDS;
    onTick(remaining);

    this._timerInterval = setInterval(() => {
      remaining--;
      onTick(remaining);
      if (remaining <= 0) {
        this.stopTimer();
        onExpire && onExpire();
      }
    }, 1000);
  },

  stopTimer() {
    if (this._timerInterval) {
      clearInterval(this._timerInterval);
      this._timerInterval = null;
    }
  },

  // =============================================
  // ACHIEVEMENTS
  // =============================================
  _checkAchievements() {
    const unlock = (id) => {
      if (!this.data.achievements.includes(id)) {
        this.data.achievements.push(id);
        return true;
      }
      return false;
    };

    if (this.data.stats.gamesPlayed >= 1)       unlock('first_win');
    if (this.data.winStreak >= 3)                unlock('streak_3');
    if (this.data.winStreak >= 5)                unlock('streak_5');
    if (this.data.winStreak >= 10)               unlock('streak_10');
    if (this.data.stats.perfectGames >= 1)       unlock('perfect_10');
    if (this.data.totalScore.football >= 80)     unlock('football_80');
    if (this.data.stats.phase1Correct >= 10 &&
        this.data.stats.phase1Total >= 10 &&
        (this.data.stats.phase1Correct / this.data.stats.phase1Total) >= 0.9) {
      unlock('no_miss_phase1');
    }
  },

  // =============================================
  // DAILY BONUS
  // =============================================
  claimDailyBonus() {
    if (!this.isDailyBonusAvailable()) return false;
    const today = new Date().toISOString().slice(0, 10);
    this.data.dailyBonus = today;
    // Bonus: +3 to football total score (simulated win)
    this.data.totalScore.football = Math.min(
      this.data.totalScore.football + 3,
      SECTIONS.football.maxScore
    );
    this.saveData();
    return true;
  },

  // ---- Main menu: derived level / XP (visual progression) ----
  getPlayerXp() {
    const s = this.data.stats;
    const won = s.gamesWon || 0;
    return Math.floor(
      this.getTotalScore() * 35 + s.gamesPlayed * 25 + won * 40 + s.correctPredictions * 2
    );
  },

  getPlayerLevelProgress() {
    const xpPerLevel = 500;
    const xp = this.getPlayerXp();
    const level = Math.max(1, Math.floor(xp / xpPerLevel) + 1);
    const xpInLevel = xp % xpPerLevel;
    return { level, xpInLevel, xpPerLevel };
  },

  getPlayerRankTitle() {
    const lv = this.getPlayerLevelProgress().level;
    if (lv <= 3) return T.menuHub.rankNovice;
    if (lv <= 7) return T.menuHub.rankAmateur;
    if (lv <= 12) return T.menuHub.rankPro;
    return T.menuHub.rankLegend;
  },

  grantMenuAdBonus() {
    this.data.totalScore.football = Math.min(
      this.data.totalScore.football + 5,
      SECTIONS.football.maxScore
    );
    this.saveData();
  },
};
