'use strict';

// =============================================
// YANDEX GAMES SDK WRAPPER
// Falls back to localStorage when SDK unavailable
// =============================================
const SDK = {
  ysdk: null,
  player: null,
  _adUsedThisLevel: false,

  async init() {
    try {
      // eslint-disable-next-line no-undef
      this.ysdk = await YaGames.init();
      this.player = await this.ysdk.getPlayer({ scopes: false });
      console.log('[SDK] Yandex Games initialized');
    } catch (e) {
      console.warn('[SDK] Yandex Games not available, using localStorage fallback');
      this.ysdk = null;
      this.player = null;
    }
  },

  isYandex() {
    return this.ysdk !== null;
  },

  // --- SAVE / LOAD ---
  async save(data) {
    if (this.player) {
      try {
        await this.player.setData(data, true);
      } catch (e) {
        console.warn('[SDK] Save failed, fallback to localStorage', e);
        localStorage.setItem('matchpredictor_save', JSON.stringify(data));
      }
    } else {
      localStorage.setItem('matchpredictor_save', JSON.stringify(data));
    }
  },

  async load() {
    if (this.player) {
      try {
        const data = await this.player.getData();
        return Object.keys(data).length ? data : null;
      } catch (e) {
        console.warn('[SDK] Load failed, fallback to localStorage', e);
      }
    }
    const raw = localStorage.getItem('matchpredictor_save');
    return raw ? JSON.parse(raw) : null;
  },

  async saveStats(stats) {
    if (this.player) {
      try { await this.player.setStats(stats); } catch (e) { /* ignore */ }
    }
  },

  // --- LEADERBOARD ---
  async submitScore(value) {
    if (!this.ysdk) return;
    try {
      const lb = await this.ysdk.getLeaderboards();
      await lb.setLeaderboardScore('totalScore', value);
    } catch (e) { /* ignore */ }
  },

  // --- ADS ---
  _adUsed: {},

  canShowRewardedAd(key) {
    return !this._adUsed[key];
  },

  markAdUsed(key) {
    this._adUsed[key] = true;
  },

  resetAdUsed(key) {
    delete this._adUsed[key];
  },

  showRewardedAd(onRewarded, onError) {
    if (this.ysdk) {
      this.ysdk.adv.showRewardedVideo({
        callbacks: {
          onRewarded: () => { onRewarded && onRewarded(); },
          onError:    (e) => { console.warn('[SDK] Rewarded ad error', e); onError && onError(); },
          onClose:    () => {},
        },
      });
    } else {
      // Simulate: in dev mode just grant reward
      console.log('[SDK] Rewarded Ad simulated');
      setTimeout(() => onRewarded && onRewarded(), 300);
    }
  },

  showInterstitialAd(onClose) {
    if (this.ysdk) {
      this.ysdk.adv.showFullscreenAdv({
        callbacks: {
          onClose: () => { onClose && onClose(); },
          onError: (e) => { console.warn('[SDK] Interstitial error', e); onClose && onClose(); },
        },
      });
    } else {
      console.log('[SDK] Interstitial Ad simulated');
      setTimeout(() => onClose && onClose(), 300);
    }
  },

  // --- ENVIRONMENT ---
  getLang() {
    try {
      return this.ysdk.environment.i18n.lang || 'ru';
    } catch (_) { return 'ru'; }
  },

  notifyLoaded() {
    try {
      this.ysdk.features.LoadingAPI.ready();
    } catch (_) { /* ignore in dev */ }
  },
};
