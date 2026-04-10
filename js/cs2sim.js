'use strict';

// =============================================
// CS2 SIMULATION ENGINE
// Real-time player movement along Mirage walkable paths
// =============================================
const CS2Sim = {

  // ---- Mirage routes (waypoint arrays [x%, y%]) ----
  // Coordinates match mirage.png (1024x1024, contain-fit)
  // T Spawn ≈ (88,48)  CT Spawn ≈ (28,70)
  // B Site  ≈ (14,22)  A Site   ≈ (50,78)
  // Mid     ≈ (48,48)
  routes: {
    // --- T side routes (right → objectives) ---
    t_to_a_ramp:   [[88,48],[84,50],[80,54],[76,58],[72,62],[68,66],[64,70],[60,74],[56,76],[52,78],[50,78]],
    t_to_a_palace: [[88,48],[86,44],[84,40],[82,38],[78,36],[74,38],[70,42],[66,48],[62,54],[58,60],[54,68],[50,74],[48,78]],
    t_to_mid:      [[88,48],[82,48],[76,47],[70,47],[64,47],[58,47],[52,47],[48,48]],
    t_to_b_apps:   [[88,48],[84,44],[80,40],[76,36],[70,32],[64,30],[58,28],[52,26],[46,24],[40,24],[34,22],[28,22],[22,22],[16,22]],
    t_lurk_mid:    [[88,48],[82,48],[76,47],[70,47],[64,47],[60,46]],

    // --- CT side routes (bottom-left → defense positions) ---
    ct_to_a:       [[28,70],[32,72],[36,74],[40,76],[44,78],[48,78],[50,78]],
    ct_to_b:       [[28,70],[26,64],[24,58],[22,50],[20,44],[18,38],[16,32],[14,26],[14,22]],
    ct_to_mid:     [[28,70],[30,64],[32,58],[34,52],[36,48],[40,47],[44,47]],
    ct_window:     [[28,70],[30,64],[32,58],[34,52],[36,48],[38,44],[36,42]],
    ct_hold_b:     [[28,70],[26,64],[24,58],[22,50],[20,44],[18,36]],
  },

  // ---- T-side setups (random pick per round) ----
  tSetups: [
    // A execute (3 ramp/palace, 1 mid, 1 lurk)
    [
      { route: 't_to_a_ramp',   speed: 1.0 },
      { route: 't_to_a_palace', speed: 0.85 },
      { route: 't_to_a_ramp',   speed: 0.75 },
      { route: 't_to_mid',      speed: 0.9 },
      { route: 't_lurk_mid',    speed: 0.6 },
    ],
    // B execute (3 B apps, 1 mid, 1 lurk A)
    [
      { route: 't_to_b_apps',   speed: 1.0 },
      { route: 't_to_b_apps',   speed: 0.8 },
      { route: 't_to_b_apps',   speed: 0.65 },
      { route: 't_to_mid',      speed: 0.9 },
      { route: 't_to_a_ramp',   speed: 0.5 },
    ],
    // Mid default (2 mid, 2 A, 1 B)
    [
      { route: 't_to_mid',      speed: 1.0 },
      { route: 't_to_mid',      speed: 0.85 },
      { route: 't_to_a_palace', speed: 0.8 },
      { route: 't_to_a_ramp',   speed: 0.7 },
      { route: 't_to_b_apps',   speed: 0.75 },
    ],
  ],

  // ---- CT-side setup (standard 2-1-2) ----
  ctSetups: [
    [
      { route: 'ct_to_a',    speed: 1.0 },
      { route: 'ct_to_a',    speed: 0.8 },
      { route: 'ct_to_mid',  speed: 0.9 },
      { route: 'ct_to_b',    speed: 1.0 },
      { route: 'ct_hold_b',  speed: 0.75 },
    ],
    [
      { route: 'ct_to_a',    speed: 0.9 },
      { route: 'ct_window',  speed: 1.0 },
      { route: 'ct_to_mid',  speed: 0.85 },
      { route: 'ct_to_b',    speed: 0.95 },
      { route: 'ct_hold_b',  speed: 0.7 },
    ],
  ],

  // ---- State ----
  _players: [],
  _raf: null,
  _lastTime: 0,
  _active: false,
  _field: null,
  _paused: false,

  // ---- Public API ----

  init(fieldEl, teamA, teamB) {
    this.destroy();
    this._field = fieldEl;
    this._players = [];
    this._active = false;
    this._paused = false;

    const tSetup  = this.tSetups[Math.floor(Math.random() * this.tSetups.length)];
    const ctSetup = this.ctSetups[Math.floor(Math.random() * this.ctSetups.length)];

    // 5 T players
    tSetup.forEach((cfg, i) => {
      const route = this.routes[cfg.route];
      this._players.push({
        id: 't' + i, team: 'T', color: teamA.color,
        x: route[0][0], y: route[0][1],
        route: route, routeIdx: 0, fwd: true,
        speed: cfg.speed * 8,   // base ~8% per second
        el: null,
      });
    });

    // 5 CT players
    ctSetup.forEach((cfg, i) => {
      const route = this.routes[cfg.route];
      this._players.push({
        id: 'ct' + i, team: 'CT', color: teamB.color,
        x: route[0][0], y: route[0][1],
        route: route, routeIdx: 0, fwd: true,
        speed: cfg.speed * 7,   // CT slightly slower (holding)
        el: null,
      });
    });

    this._render();
  },

  start() {
    this._active = true;
    this._paused = false;
    this._lastTime = performance.now();
    this._raf = requestAnimationFrame(t => this._tick(t));
  },

  stop() {
    this._active = false;
    if (this._raf) { cancelAnimationFrame(this._raf); this._raf = null; }
  },

  pause() {
    this._paused = true;
  },

  resume() {
    if (this._paused) {
      this._paused = false;
      this._lastTime = performance.now();
    }
  },

  destroy() {
    this.stop();
    if (this._field) {
      this._field.querySelectorAll('.cs2p').forEach(el => el.remove());
    }
    this._players = [];
    this._field = null;
  },

  dimAll() {
    this._players.forEach(p => { if (p.el) p.el.style.opacity = '0.2'; });
  },

  restoreAll() {
    this._players.forEach(p => { if (p.el) p.el.style.opacity = '1'; });
  },

  /** Pick new random routes for the next "round" */
  newRound(teamAColor, teamBColor) {
    const tSetup  = this.tSetups[Math.floor(Math.random() * this.tSetups.length)];
    const ctSetup = this.ctSetups[Math.floor(Math.random() * this.ctSetups.length)];

    // Reset T players to T spawn with new route
    this._players.forEach((p, i) => {
      if (p.team === 'T' && tSetup[i]) {
        const route = this.routes[tSetup[i].route];
        p.route = route;
        p.routeIdx = 0;
        p.fwd = true;
        p.x = route[0][0];
        p.y = route[0][1];
        p.speed = tSetup[i].speed * 8;
        p.color = teamAColor;
      }
    });

    // Reset CT players to CT spawn with new route
    let ctIdx = 0;
    this._players.forEach(p => {
      if (p.team === 'CT' && ctSetup[ctIdx]) {
        const route = this.routes[ctSetup[ctIdx].route];
        p.route = route;
        p.routeIdx = 0;
        p.fwd = true;
        p.x = route[0][0];
        p.y = route[0][1];
        p.speed = ctSetup[ctIdx].speed * 7;
        p.color = teamBColor;
        ctIdx++;
      }
    });

    // Update visuals
    this._players.forEach(p => {
      if (p.el) {
        p.el.style.left = p.x + '%';
        p.el.style.top  = p.y + '%';
        p.el.style.background = p.color;
      }
    });
  },

  // ---- Internals ----

  _render() {
    if (!this._field) return;
    this._field.querySelectorAll('.cs2p').forEach(el => el.remove());

    this._players.forEach(p => {
      const el = document.createElement('div');
      el.className = 'cs2p cs2p--' + p.team.toLowerCase();
      el.style.left = p.x + '%';
      el.style.top  = p.y + '%';
      el.style.background = p.color;
      this._field.appendChild(el);
      p.el = el;
    });
  },

  _tick(now) {
    if (!this._active) return;

    if (!this._paused) {
      const dt = Math.min((now - this._lastTime) / 1000, 0.1);
      this._players.forEach(p => this._movePlayer(p, dt));
    }
    this._lastTime = now;
    this._raf = requestAnimationFrame(t => this._tick(t));
  },

  _movePlayer(p, dt) {
    if (!p.route || p.route.length < 2) return;

    const nextIdx = p.fwd
      ? Math.min(p.routeIdx + 1, p.route.length - 1)
      : Math.max(p.routeIdx - 1, 0);
    const tx = p.route[nextIdx][0];
    const ty = p.route[nextIdx][1];

    const dx = tx - p.x;
    const dy = ty - p.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 0.4) {
      // Reached waypoint
      p.x = tx;
      p.y = ty;
      p.routeIdx = nextIdx;

      // At end of route — reverse (patrol)
      if (p.fwd && nextIdx >= p.route.length - 1) {
        p.fwd = false;
      } else if (!p.fwd && nextIdx <= 0) {
        p.fwd = true;
      }
    } else {
      // Move toward waypoint
      const step = p.speed * dt;
      const ratio = Math.min(step / dist, 1);
      p.x += dx * ratio;
      p.y += dy * ratio;
    }

    // Update DOM
    if (p.el) {
      p.el.style.left = p.x + '%';
      p.el.style.top  = p.y + '%';
    }
  },
};
