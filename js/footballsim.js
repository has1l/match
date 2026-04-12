'use strict';

// =============================================
// FOOTBALL SIMULATION ENGINE
// Steering-behavior AI: arrive + inertia + event-driven targets
// =============================================
const FootballSim = {

  // ---- Speeds (% field per second) ----
  MAX_SPD: 16,       // top speed outfield
  GK_SPD:  5,
  BALL_SPD: 62,      // pass speed
  HOLD_MIN: 0.38,
  HOLD_MAX: 0.90,
  SLOW_DIST: 7,      // arrive-deceleration radius (%)
  MAX_ACC_FACTOR: 5, // max_acc = spd * factor → reach top speed in ~0.2s

  // ---- Formation: Team A attacks left → right ----
  _F: [
    { r:'GK', x:4,  y:50, s:5  },
    { r:'RB', x:17, y:18, s:14 },
    { r:'CB', x:17, y:37, s:12 },
    { r:'CB', x:17, y:63, s:12 },
    { r:'LB', x:17, y:82, s:14 },
    { r:'DM', x:31, y:50, s:14 },
    { r:'CM', x:38, y:30, s:16 },
    { r:'AM', x:38, y:70, s:16 },
    { r:'RW', x:50, y:16, s:17 },
    { r:'ST', x:50, y:50, s:16 },
    { r:'LW', x:50, y:84, s:17 },
  ],

  // ---- Idle pass chains (formation indices 0-10) ----
  _PAT: [
    [2,5,6,9],   [4,7,10,9],  [1,6,8,9],  [5,6,9],
    [3,5,7,10],  [5,8,9],     [4,5,6],    [2,3,5,6],
    [6,9],       [5,7,9],     [1,5,8],    [4,5,7],
  ],

  // ---- Build-up chains per event type ----
  _BU: {
    attack:        [5, 9],
    counterattack: [10, 9],
    penalty:       [6, 9],
    one_on_one:    [8, 9],
    corner:        [6, 8],
    free_kick:     [5, 6],
    header:        [7, 10],
    long_shot:     [5, 6],
  },

  // ---- Runtime state ----
  _pl: [],
  _bx: 50, _by: 50,
  _btx: 50, _bty: 50,
  _bSX: 50, _bSY: 50,
  _bMoving: false,
  _bOwner: -1,
  _bTT: 0, _bTE: 0,
  _chain: [], _cIdx: 0,
  _holdT: 0, _holdDur: 0.6,
  _possA: true,
  _state: 'IDLE',
  _onDone: null,
  _wanderTimer: 0,
  _raf: null, _lastT: 0,
  _active: false, _field: null,

  // ---- PUBLIC API ----

  init(fieldEl, teamA, teamB) {
    this.destroy();
    this._field = fieldEl;
    this._pl = [];
    this._bx = 50; this._by = 50;
    this._bMoving = false; this._bOwner = -1; this._bTE = 0;
    this._state = 'IDLE'; this._possA = true;
    this._chain = []; this._cIdx = 0;
    this._holdT = 0; this._holdDur = 0.5;
    this._wanderTimer = 0;

    this._F.forEach((f, i) => {
      const isGK = f.r === 'GK';
      const bx   = 100 - f.x;
      const sz   = isGK ? 18 : (f.r === 'ST' ? 17 : 14);

      this._pl.push({
        i: i, team: 'A', role: f.r, color: teamA.color,
        fx: f.x, fy: f.y,
        x: f.x, y: f.y, tx: f.x, ty: f.y,
        vx: 0, vy: 0, maxSpd: f.s,
        sz, hasBall: false, el: null,
      });
      this._pl.push({
        i: i + 11, team: 'B', role: f.r, color: teamB.color,
        fx: bx, fy: f.y,
        x: bx, y: f.y, tx: bx, ty: f.y,
        vx: 0, vy: 0, maxSpd: f.s,
        sz, hasBall: false, el: null,
      });
    });

    this._renderPlayers();
    this._startChain(true);
  },

  start() {
    this._active = true;
    this._lastT = performance.now();
    this._raf = requestAnimationFrame(t => this._tick(t));
  },

  stop() {
    this._active = false;
    if (this._raf) { cancelAnimationFrame(this._raf); this._raf = null; }
  },

  pause() { this._state = 'PAUSED'; },

  resume() {
    if (this._state === 'PAUSED') {
      this._state = 'IDLE';
      this._lastT = performance.now();
    }
  },

  destroy() {
    this.stop();
    if (this._field) this._field.querySelectorAll('.fbp').forEach(el => el.remove());
    this._pl = []; this._field = null; this._onDone = null;
  },

  dimAll()     { this._pl.forEach(p => { if (p.el) p.el.style.opacity = '0.18'; }); },
  restoreAll() { this._pl.forEach(p => { if (p.el) p.el.style.opacity = '1'; }); },

  dimAllExceptEvent() {
    this._pl.forEach(p => {
      if (!p.el) return;
      const isAtt = p === this._eventAttacker;
      const isDef = this._eventDefenders && this._eventDefenders.some(d => d.p === p);
      const isEvGk = p.role === 'GK' && p.team !== this._eventAttacker.team;
      if (!isAtt && !isDef && !isEvGk) {
        p.el.style.opacity = '0.18';
      } else {
        p.el.style.opacity = '1';
      }
    });
  },

  buildUpTo(event, onDone) {
    this._bMoving = false;
    this._pl.forEach(p => { p.hasBall = false; p.vx = 0; p.vy = 0; });
    
    this._state = 'BUILDUP_RUN';
    this._onDone = onDone;
    this._currEvent = event;

    const teamAAttacks = event.teamAAttacks;
    const offAtt = teamAAttacks ? 0 : 11;

    // Pick attacker based on BU hints or ST
    const rawAtt = this._BU[event.type] || [5, 9];
    const attackerPIdx = this._pl.findIndex(p => p.i === rawAtt[rawAtt.length - 1] + offAtt);
    const attackerP = this._pl[attackerPIdx] || this._pl[offAtt + 9]; 

    // Defenders
    const numDefs = (event.layout.defenders || []).length;
    const defRoles = ['CB', 'CB', 'DM', 'LB', 'RB'];
    this._eventDefenders = [];
    for(let i=0; i<numDefs; i++) {
        let p = this._pl.find(p => p.team === (teamAAttacks?'B':'A') && p.role === defRoles[i]);
        if (p) this._eventDefenders.push({ p: p, layout: event.layout.defenders[i] });
    }

    const currOwner = this._bOwner >= 0 ? this._bOwner : this._pl.findIndex(p => p.team === (teamAAttacks?'A':'B'));
    this._eventAttacker = attackerP;

    if (currOwner !== attackerPIdx) {
        this._chain = [attackerPIdx];
        this._cIdx = 0;
        this._passBall(currOwner, attackerPIdx);
    } else {
        this._giveBall(attackerPIdx); 
    }
  },

  newRound(isGoal, teamAAttacked) {
    this._pl.forEach(p => {
      p.x = p.fx; p.y = p.fy;
      p.tx = p.fx; p.ty = p.fy;
      p.vx = 0; p.vy = 0;
      p.hasBall = false;
      if (p.el) {
        p.el.style.left = p.x + '%';
        p.el.style.top  = p.y + '%';
        p.el.style.opacity = '1';
      }
    });

    this._possA = !teamAAttacked;
    this._bMoving = false; this._bOwner = -1; this._bTE = 0;

    if (isGoal) {
      this._bx = 50; this._by = 50;
    } else {
      const gkI = teamAAttacked ? 11 : 0;
      const gk  = this._pl.find(p => p.i === gkI);
      if (gk) { this._bx = gk.x; this._by = gk.y; }
    }

    const ballEl = this._field && this._field.querySelector('#lv-ball');
    if (ballEl) {
      ballEl.style.transition = 'none';
      ballEl.style.left = this._bx + '%';
      ballEl.style.top  = this._by + '%';
    }

    this._state = 'IDLE';
    this._startChain(this._possA);

    if (!this._active) {
      this._active = true;
      this._lastT = performance.now();
      this._raf = requestAnimationFrame(t => this._tick(t));
    }
  },

  // ---- Internal ----

  _renderPlayers() {
    if (!this._field) return;
    this._field.querySelectorAll('.fbp').forEach(el => el.remove());
    this._pl.forEach(p => {
      const el = document.createElement('div');
      el.className = 'fbp';
      el.style.cssText = `left:${p.x}%;top:${p.y}%;background:${p.color};width:${p.sz}px;height:${p.sz}px;margin-left:-${p.sz/2}px;margin-top:-${p.sz/2}px`;
      this._field.appendChild(el);
      p.el = el;
    });
  },

  _startChain(possA) {
    if (possA !== undefined) this._possA = possA;
    const off = this._possA ? 0 : 11;
    const raw = this._PAT[Math.floor(Math.random() * this._PAT.length)];
    this._chain = raw
      .map(ri => this._pl.findIndex(p => p.i === ri + off))
      .filter(x => x >= 0);
    this._cIdx = 0;
    this._holdT = 0;
    this._holdDur = this.HOLD_MIN + Math.random() * (this.HOLD_MAX - this.HOLD_MIN);
    if (this._chain.length > 0) this._giveBall(this._chain[0]);
  },

  _giveBall(plIdx) {
    this._pl.forEach(p => p.hasBall = false);
    if (plIdx < 0 || plIdx >= this._pl.length) return;
    const p = this._pl[plIdx];
    p.hasBall = true;
    this._bOwner = plIdx;
    this._bMoving = false;
    this._bx = p.x; this._by = p.y;

  },

  _passBall(fromIdx, toIdx) {
    if (toIdx < 0 || toIdx >= this._pl.length) return;
    const from = this._pl[fromIdx];
    const to   = this._pl[toIdx];
    from.hasBall = false;
    this._bOwner = -1;
    this._bMoving = true;
    this._bSX = this._bx; this._bSY = this._by;
    this._btx = to.x; this._bty = to.y;
    const d = Math.sqrt((this._btx - this._bx) ** 2 + (this._bty - this._by) ** 2);
    this._bTT = Math.max(0.1, d / this.BALL_SPD);
    this._bTE = 0;

    // Receiver sprints directly to ball destination — aggressive run
    to.tx = this._btx; to.ty = this._bty;

  },

  _tick(now) {
    if (!this._active) { this._raf = null; return; }
    const dt = Math.min((now - this._lastT) / 1000, 0.08);
    this._lastT = now;
    if (this._state !== 'PAUSED') this._update(dt);
    this._raf = requestAnimationFrame(t => this._tick(t));
  },

  _update(dt) {
    // 1. Ball in flight
    if (this._bMoving) {
      if (this._state === 'BUILDUP_RUN') {
        const attackerP = this._pl[this._chain[0]];
        if (attackerP) {
          this._btx = attackerP.x;
          this._bty = attackerP.y;
        }
      }

      const dx = this._btx - this._bx;
      const dy = this._bty - this._by;
      const dist = Math.sqrt(dx*dx + dy*dy);
      
      if (dist > 0) {
        this._bVX = (dx / dist) * this.BALL_SPD;
        this._bVY = (dy / dist) * this.BALL_SPD;
      }

      this._bx += this._bVX * dt;
      this._by += this._bVY * dt;
      
      if (dist < 4) {
        this._bMoving = false;
        const rev = this._chain[this._cIdx];
        if (rev !== undefined) {
          this._giveBall(rev);
        }
      }
    }

    // 2. Hold timer → pass or chain done
    if (!this._bMoving && this._bOwner >= 0 && this._state !== 'BUILDUP_RUN') {
      this._holdT += dt;
      if (this._holdT >= this._holdDur) {
        this._holdT = 0;
        const next = this._cIdx + 1;
        if (next >= this._chain.length) {
          this._possA = !this._possA;
          this._startChain();
        } else {
          const from = this._bOwner;
          this._cIdx = next;
          this._passBall(from, this._chain[this._cIdx]);
        }
      }
    }

    // 3. Ball owner wander — small drift so holder isn't frozen
    if (!this._bMoving && this._bOwner >= 0) {
      this._wanderTimer -= dt;
      if (this._wanderTimer <= 0 && this._state !== 'BUILDUP_RUN') {
        this._wanderTimer = 0.6 + Math.random() * 0.5;
        const ow = this._pl[this._bOwner];
        if (ow && ow.role !== 'GK') {
          const wx = ow.x + (Math.random() - 0.5) * 5;
          const wy = ow.y + (Math.random() - 0.5) * 5;
          ow.tx = Math.max(2, Math.min(98, wx));
          ow.ty = Math.max(5, Math.min(95, wy));
        }
      }
      // Ball sticks to owner
      const ow = this._pl[this._bOwner];
      if (ow) { this._bx = ow.x; this._by = ow.y; }
    }

    // 3.5 Check BUILDUP_RUN completion
    if (this._state === 'BUILDUP_RUN' && this._eventAttacker && this._currEvent) {
      const p = this._eventAttacker;
      const layout = this._currEvent.layout;
      const dx = p.x - layout.attacker.x;
      const dy = p.y - layout.attacker.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      // Give defenders a chance to arrive too
      if (dist < 1.0) {
        this._state = 'PAUSED';
        if (this._onDone) {
          const cb = this._onDone; 
          this._onDone = null;
          setTimeout(cb, 0);
        }
      }
    }

    // 4. Calculate dynamic targets for players without ball
    this._updateTargets();

    // 5. Move all players with arrive steering + inertia
    this._pl.forEach(p => this._steer(p, dt));

    // 5. Update DOM
    const ballEl = this._field && this._field.querySelector('#lv-ball');
    if (ballEl) {
      ballEl.style.transition = 'none';
      ballEl.style.left = this._bx + '%';
      ballEl.style.top  = this._by + '%';
    }
    this._pl.forEach(p => {
      if (p.el) {
        p.el.style.left = p.x + '%';
        p.el.style.top  = p.y + '%';
      }
    });
  },

  _updateTargets() {
    if (this._state === 'BUILDUP_RUN' && this._currEvent) {
        const layout = this._currEvent.layout;
        const attTarget = layout.attacker;
        const isAttackingA = this._possA;
        const ballPos = { x: this._bx, y: this._by };
        
        let pressTop1 = null;
        let pressTop2 = null;
        let d1 = 9999, d2 = 9999;
        this._pl.forEach(q => {
            if (q.team !== this._eventAttacker.team && q.role !== 'GK') {
                const isEvDef = this._eventDefenders.some(ed => ed.p === q);
                if (!isEvDef) {
                    const dist = Math.sqrt((q.x - ballPos.x)**2 + (q.y - ballPos.y)**2);
                    if (dist < d1) { d2 = d1; pressTop2 = pressTop1; d1 = dist; pressTop1 = q; }
                    else if (dist < d2) { d2 = dist; pressTop2 = q; }
                }
            }
        });

        this._pl.forEach(p => {
            if (p === this._eventAttacker) {
                if (this._bMoving) {
                    p.tx = ballPos.x;
                    p.ty = ballPos.y;
                } else {
                    p.tx = attTarget.x;
                    p.ty = attTarget.y;
                }
                return;
            } else if (p.role === 'GK' && p.team !== this._eventAttacker.team) {
                p.tx = layout.gk ? layout.gk.x : p.fx;
                p.ty = layout.gk ? layout.gk.y : p.fy;
                return;
            } else {
                const defEntry = this._eventDefenders.find(d => d.p === p);
                if (defEntry) {
                    p.tx = defEntry.layout.x;
                    p.ty = defEntry.layout.y;
                    return;
                }
            }

            if (p === pressTop1 || p === pressTop2) {
                // Настоящая борьба! Ближайшие защитники набрасываются на нападающего
                p.tx = ballPos.x;
                p.ty = ballPos.y;
                return;
            }

            // Настоящая динамика матча: поддержка атаки и возврат в оборону
            let tx = p.fx;
            let ty = p.fy;

            const isMyTeamAttacking = (p.team === 'A') === isAttackingA;
            const repDir = p.team === 'A' ? 1 : -1;

            if (isMyTeamAttacking) {
                tx += repDir * 14;  // Атакующие игроки агрессивно бегут вперед в штрафную
                if (p.fy < 40) ty -= 4; // Расширяют фронт
                if (p.fy > 60) ty += 4;
            } else {
                tx -= repDir * 18;  // Отстающие защитники отчаянно бегут назад к воротам
                ty = 50 + (ty - 50) * 0.4; // Собираются кучнее в центре
            }

            // Магнетизм мяча - все смотрят на соло-проход
            tx += (ballPos.x - 50) * 0.2;
            ty += (ballPos.y - 50) * 0.4;

            p.tx = Math.max(2, Math.min(98, tx));
            p.ty = Math.max(2, Math.min(98, ty));
        });
        return; // skip normal logic
    }

    const isAttackingA = this._possA;
    const ballPos = { x: this._bx, y: this._by };
    const recvIdx = this._bMoving && this._cIdx < this._chain.length ? this._chain[this._cIdx] : -1;

    // Find top 2 pressers from defending team
    const defTeam = isAttackingA ? 'B' : 'A';
    const defenders = this._pl.filter(p => p.team === defTeam && p.role !== 'GK');
    defenders.sort((a, b) => {
        const da = (a.x - ballPos.x) ** 2 + (a.y - ballPos.y) ** 2;
        const db = (b.x - ballPos.x) ** 2 + (b.y - ballPos.y) ** 2;
        return da - db;
    });
    const pressers = [defenders[0], defenders[1]];

    this._pl.forEach((p, idx) => {
        if (p.hasBall) return;
        if (this._bMoving && idx === recvIdx) return; // receiver is sprinting to ball

        if (p.role === 'GK') {
            p.tx = p.fx;
            const targetY = 50 + (ballPos.y - 50) * 0.5;
            p.ty = Math.max(30, Math.min(70, targetY));
            return;
        }

        let tx = p.fx;
        let ty = p.fy;

        const isMyTeamAttacking = (p.team === 'A') === isAttackingA;
        const repDir = p.team === 'A' ? 1 : -1;

        if (isMyTeamAttacking) {
            tx += repDir * 6; // push forward
            if (p.fy < 40) ty -= 5; // stretch left
            if (p.fy > 60) ty += 5; // stretch right
        } else {
            tx -= repDir * 6; // drop back
            ty = 50 + (ty - 50) * 0.6; // compact
        }

        // Ball magnetism
        tx += (ballPos.x - 50) * 0.2;
        ty += (ballPos.y - 50) * 0.4;

        if (!isMyTeamAttacking && pressers.includes(p)) {
            const targetPressX = this._bMoving ? this._btx : ballPos.x;
            const targetPressY = this._bMoving ? this._bty : ballPos.y;
            tx = p.x + (targetPressX - p.x) * 0.7;
            ty = p.y + (targetPressY - p.y) * 0.7;
        }

        p.tx = Math.max(2, Math.min(98, tx));
        p.ty = Math.max(2, Math.min(98, ty));
    });
  },

  /** Arrive steering: accelerate toward target, decelerate near it */
  _steer(p, dt) {
    if (p.role === 'GK') { p.tx = p.fx; } // GK locked to goal line x

    const dx = p.tx - p.x;
    const dy = p.ty - p.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 0.12) {
      // At target — damp velocity to stop
      p.vx *= 0.75; p.vy *= 0.75;
      p.x = p.tx; p.y = p.ty;
      return;
    }

    // Desired speed: full speed far away, slow to zero at target (arrive)
    const desiredSpd = dist < this.SLOW_DIST
      ? p.maxSpd * (dist / this.SLOW_DIST)
      : p.maxSpd;

    const norm = 1 / dist;
    const desVX = dx * norm * desiredSpd;
    const desVY = dy * norm * desiredSpd;

    // Steering delta toward desired velocity
    const dvx = desVX - p.vx;
    const dvy = desVY - p.vy;
    const dlen = Math.sqrt(dvx * dvx + dvy * dvy);

    if (dlen > 0) {
      const maxAcc = p.maxSpd * this.MAX_ACC_FACTOR * dt;
      const scale  = Math.min(maxAcc, dlen) / dlen;
      p.vx += dvx * scale;
      p.vy += dvy * scale;
    }

    // Hard cap at max speed
    const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
    if (spd > p.maxSpd) {
      const s = p.maxSpd / spd;
      p.vx *= s; p.vy *= s;
    }

    p.x += p.vx * dt;
    p.y += p.vy * dt;
  },
};
