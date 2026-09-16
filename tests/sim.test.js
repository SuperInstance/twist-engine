// Simulation tests for the twist engine.
// Runs the actual app.js under a stubbed DOM with a seeded RNG,
// sweeps the parameter space of all four substrates, and asserts
// physics invariants + emergent behavior. No browser needed.
//
//   node tests/sim.test.js           → assert + report
//   node tests/sim.test.js --explore → print measured values only
//
"use strict";
const path = require("path");
const { buildHarness } = require("./dom-stub");

const EXPLORE = process.argv.includes("--explore");
const APP = path.join(__dirname, "..", "app.js");
const boot = buildHarness(APP, 42, 960, 600);

let pass = 0, fail = 0;
const failures = [];
const observed = {};

function check(name, cond, detail) {
  if (EXPLORE) return;
  if (cond) { pass++; }
  else { fail++; failures.push(name + (detail ? ` :: ${detail}` : "")); }
}
function record(key, v) { observed[key] = v; }
function isFiniteNum(x) { return typeof x === "number" && Number.isFinite(x); }

/* ============================ TWIST ============================ */
function testTwist(boot) {
  boot.setMode("twist");
  boot.pump(10);
  const t = boot.evalJs("twist");
  record("twist.windows", t.windows.length);
  record("twist.S_at_1.06deg", +t.S?.toFixed(4));
  record("twist.lam_over_s", +(t.lam / t.s).toFixed(2));

  check("twist: commensuration teeth found (4..12)", t.windows.length >= 4 && t.windows.length <= 12, `got ${t.windows.length}`);
  check("twist: all windows above threshold", t.windows.every(w => w[1] > 0.10));
  check("twist: S finite in [0,1]", isFiniteNum(t.S) && t.S >= 0 && t.S <= 1, `S=${t.S}`);

  // supercell wavelength identity: lam = s / (2 sin(theta/2))
  boot.evalJs("twist.theta = 1.5");
  boot.pump(2);
  const s = boot.evalJs("twist.s"), lam = boot.evalJs("twist.lam");
  const expect = s / (2 * Math.sin((1.5 * Math.PI) / 360));
  check("twist: lambda identity", Math.abs(lam - expect) < 1e-9, `lam=${lam} expect=${expect}`);

  // the ledger S must equal 1 − alignment (the exact quantity the curve
  // stores in windows[i][1]), and windows are local MINIMA of S:
  // magic angle = partial revival of alignment = dip in disorder.
  const wA = boot.evalJs("twist.windows[2][0]");
  const curveAl = boot.evalJs("twist.windows[2][1]");
  boot.evalJs(`twist.theta = ${wA * 180 / Math.PI}`);
  boot.pump(12); // allow the %6 cache to refresh
  const sWin = boot.evalJs("twist.S");
  check("twist: ledger S reproduces curve (1 − alignment)",
    Math.abs(sWin - (1 - curveAl)) < 0.03,
    `S=${sWin.toFixed(4)} 1−curve=${(1 - curveAl).toFixed(4)}`);
  // comb structure: each tooth (registration max) must read as an S dip
  // against the trough ~0.35° before it. skip tooth 0 — it rides the
  // small-angle background rise (θ→0 = identical lattices).
  const teeth = boot.evalJs("twist.windows.map(w => w[0])");
  for (const i of [2, 3]) {
    const thTooth = teeth[i] * 180 / Math.PI;
    boot.evalJs(`twist.theta = ${thTooth}`);
    boot.pump(12);
    const sTooth = boot.evalJs("twist.S");
    boot.evalJs(`twist.theta = ${thTooth - 0.35}`);
    boot.pump(12);
    const sTrough = boot.evalJs("twist.S");
    check(`twist: tooth ${i} @${thTooth.toFixed(2)}° dips vs trough`,
      sTooth < sTrough - 0.005,
      `tooth S=${sTooth.toFixed(4)} trough S=${sTrough.toFixed(4)}`);
  }

  // resize: lattice must be rebuilt for the new viewport (no stale R0)
  boot.resizeWindow(500, 420);
  boot.pump(4);
  const R0 = boot.evalJs("twist.R0");
  const expectR0 = Math.hypot(500, 420) / 2 + boot.evalJs("twist.s") * 4;
  check("twist: resize rebuilds lattice", Math.abs(R0 - expectR0) < 1,
    `R0=${R0} expect≈${expectR0.toFixed(1)}`);
  const baseLen = boot.evalJs("twist.base.length");
  check("twist: base repopulated after resize", baseLen > 1000, `base=${baseLen}`);
}

/* ============================ FLOCK ============================ */
function testFlock(boot) {
  boot.resizeWindow(960, 600); // restore viewport after the twist resize probe
  const results = {};
  for (const fiction of ["murmuration", "pack", "kennel", "parliament"]) {
    boot.setMode("flock");
    boot.evalJs(`flock.fiction = "${fiction}"`);
    boot.pump(60); // settle after re-init
    // murmuration: longer sample — pol oscillates as the band turns;
    // the claim is the flock repeatedly locks heading between turns.
    boot.pump(fiction === "murmuration" ? 1200 : 600);
    const r = boot.evalJs(`(() => {
      const F = FICTIONS["${fiction}"];
      const B = flock.birds;
      let sumR = 0, maxD = 0, cx = 0, cy = 0, nan = 0, vmaxSeen = 0;
      for (const b of B) {
        if (!isFinite(b.x + b.y + b.vx + b.vy)) nan++;
        cx += b.x / B.length; cy += b.y / B.length;
      }
      for (const b of B) {
        const d = Math.hypot(b.x - W/2, b.y - H/2);
        sumR += d; if (d > maxD) maxD = d;
        const v = Math.hypot(b.vx, b.vy); if (v > vmaxSeen) vmaxSeen = v;
      }
      const hist = flock.polHist.slice(-200);
      const meanPol = hist.reduce((a, x) => a + x, 0) / hist.length;
      const maxPol = hist.reduce((a, x) => Math.max(a, x), 0);
      return { n: B.length, nan, meanPol, maxPol, meanR: sumR / B.length, maxD, meanSpd: flock.meanSpd, vmaxSeen, penR: Math.min(W,H)*0.26, ringR: Math.min(W,H)*0.3, vmax: F.vmax };
    })()`);
    results[fiction] = r;
    record(`flock.${fiction}`, {
      pol: +r.meanPol.toFixed(3), meanR: +r.meanR.toFixed(1),
      maxD: +r.maxD.toFixed(1), spd: +r.meanSpd.toFixed(2),
    });

    check(`flock/${fiction}: no NaN positions`, r.nan === 0);
    check(`flock/${fiction}: bird count 100+`, r.n >= 100, `n=${r.n}`);
    check(`flock/${fiction}: speed bounded by vmax`, r.vmaxSeen <= r.vmax + 1e-6,
      `vmax=${r.vmax} seen=${r.vmaxSeen.toFixed(3)}`);

    if (fiction === "murmuration") {
      check("flock/murmuration: coherent flight (mean pol > 0.45, max > 0.6)",
        r.meanPol > 0.45 && r.maxPol > 0.6,
        `meanPol=${r.meanPol.toFixed(3)} maxPol=${r.maxPol.toFixed(3)}`);
      check("flock/murmuration: roams the field (meanR > 250)", r.meanR > 250, `meanR=${r.meanR.toFixed(1)}`);
    }
    if (fiction === "pack") {
      check("flock/pack: pursuit speed > 1.8", r.meanSpd > 1.8, `spd=${r.meanSpd.toFixed(2)}`);
    }
    if (fiction === "kennel") {
      check("flock/kennel: containment", r.maxD <= r.penR + 24,
        `maxD=${r.maxD.toFixed(1)} penR=${r.penR}`);
      check("flock/kennel: lethargy (spd < 1.0)", r.meanSpd < 1.0, `spd=${r.meanSpd.toFixed(2)}`);
    }
    if (fiction === "parliament") {
      const relErr = Math.abs(r.meanR - r.ringR) / r.ringR;
      check("flock/parliament: ring formation (±15%)", relErr < 0.15,
        `meanR=${r.meanR.toFixed(1)} ringR=${r.ringR} relErr=${relErr.toFixed(3)}`);
    }
  }
  check("flock: pack polarizes above kennel",
    results.pack.meanPol > results.kennel.meanPol,
    `pack=${results.pack.meanPol.toFixed(3)} kennel=${results.kennel.meanPol.toFixed(3)}`);
  check("flock: pack outruns kennel",
    results.pack.meanSpd > results.kennel.meanSpd,
    `pack=${results.pack.meanSpd.toFixed(2)} kennel=${results.kennel.meanSpd.toFixed(2)}`);
  check("flock: parliament disperses (ring > kennel radius)",
    results.parliament.meanR > results.kennel.meanR,
    `parl=${results.parliament.meanR.toFixed(1)} kennel=${results.kennel.meanR.toFixed(1)}`);
}

/* ============================ CHIRP ============================ */
function testChirp(boot) {
  boot.setMode("chirp");
  boot.resizeWindow(560, 380); // shrink the field grid; beam physics is scale-free here
  boot.pump(5);
  const contacts = [];
  let seen = 0;
  for (let i = 0; i < 36; i++) {
    boot.pump(50);
    const log = boot.evalJs("chirp.log");
    if (log.length > seen) {
      for (let j = 0; j < log.length - seen; j++) {
        const e = log[j];
        contacts.push({ brg: e.brg, heading: e.h, r: e.r, closure: e.closure });
      }
      seen = log.length;
    }
  }
  record("chirp.contacts", contacts.length);
  check("chirp: contacts detected during auto-sweep", contacts.length >= 2,
    `got ${contacts.length}`);
  for (const c of contacts) {
    let d = Math.abs(c.brg - c.heading) % 360;
    if (d > 180) d = 360 - d;
    check("chirp: contact inside beamwidth", d < 45, `brg=${c.brg.toFixed(1)} heading=${c.heading.toFixed(1)} d=${d.toFixed(1)}`);
  }
  const bad = contacts.filter(c => !(isFiniteNum(c.r) && (c.closure === null || isFiniteNum(c.closure))));
  check("chirp: finite ranges/closures", bad.length === 0);
  check("chirp: heading sweep actually sweeps",
    (() => { let mn = 1e9, mx = -1e9; for (let i = 0; i < 8; i++) { boot.pump(120); const h = boot.evalJs("chirp.heading"); mn = Math.min(mn, h); mx = Math.max(mx, h); } return mx - mn > 40; })());
}

/* ============================ QUILT ============================ */
function testPerm(boot) {
  boot.resizeWindow(960, 600);
  boot.setMode("perm");
  boot.pump(6);
  const P = () => boot.evalJs("({ n: perm.n, inv: perm.inv, cyc: perm.cyc, lis: perm.lisV, fixed: perm.fixed, deranged: perm.deranged, steps: perm.steps })");

  let r = P();
  check("perm: identity at boot", r.inv === 0 && r.cyc === r.n && r.lis === r.n && r.fixed === r.n && !r.deranged,
    JSON.stringify(r));
  record("perm.boot", r);

  // twist k=3 on identity = 3-cycle (1 2 3): inv 2, cycles n−2, parity even
  boot.evalJs("perm.twistBlock(3)");
  boot.pump(2);
  r = P();
  check("perm: twist k=3 is the 3-cycle (inv 2, cyc n−2, even)",
    r.inv === 2 && r.cyc === r.n - 2 && r.inv % 2 === 0,
    JSON.stringify(r));

  // full twist k=n = one n-cycle: deranged, inv n−1
  boot.evalJs("perm.init(); perm.twistBlock(perm.n)");
  boot.pump(2);
  r = P();
  check("perm: full twist is an n-cycle (deranged, inv n−1, one cycle)",
    r.deranged && r.inv === r.n - 1 && r.cyc === 1,
    JSON.stringify(r));
  record("perm.fullTwist", r);

  // adjacent swap: |π| moves by exactly 1, σ_i is an involution
  boot.evalJs("perm.init(); perm.recompute(); perm.swap(2); perm.recompute(); perm._d1 = perm.inv; perm.swap(2); perm.recompute(); perm._d2 = perm.inv;");
  boot.pump(2);
  check("perm: σ_i then σ_i again returns (inv ±1, involution)",
    boot.evalJs("perm._d1") === 1 && boot.evalJs("perm._d2") === 0,
    `d1=${boot.evalJs("perm._d1")} d2=${boot.evalJs("perm._d2")}`);

  // random adjacent-swap walk: inversion CLT — μ → n(n−1)/4, σ² → n(n−1)(2n+5)/72
  boot.evalJs("perm.init(); perm.walking = true; perm.rate = 60;");
  boot.pump(700); // ~11.7 sim-seconds ≈ 700 swaps
  const stats = boot.evalJs("({ m: perm.walkInv.length, mu: perm.walkInv.reduce((a,x)=>a+x,0)/perm.walkInv.length, steps: perm.steps })");
  const eT = 6 * 5 / 4, vT = 6 * 5 * 17 / 72;
  const invNow = boot.evalJs("perm.inv");
  const maxInv = 6 * 5 / 2;
  check("perm: walk samples ≈ swaps", stats.m >= 650 && stats.m <= 760, `samples=${stats.m}`);
  check("perm: inversion CLT mean (live vs n(n−1)/4=7.5)",
    Math.abs(stats.mu - eT) < 1.2, `μ=${stats.mu.toFixed(2)}`);
  check("perm: inversion bounded in [0, n(n−1)/2]", invNow >= 0 && invNow <= maxInv, `inv=${invNow}`);
  record("perm.walk", { samples: stats.m, mu: +stats.mu.toFixed(2), theoryMean: eT, theoryVar: +vT.toFixed(2) });
  boot.evalJs("perm.walking = false;");

  // subfactorial reference values (derangement counts)
  check("perm: !n reference (!4=9, !6=265)",
    boot.evalJs("subfactorial(4)") === 9 && boot.evalJs("subfactorial(6)") === 265,
    `!4=${boot.evalJs("subfactorial(4)")} !6=${boot.evalJs("subfactorial(6)")}`);

  // LIS of the reversed arrangement is 1
  boot.evalJs("perm.init(); perm.arr.reverse(); perm.recompute();");
  boot.pump(2);
  check("perm: LIS(reverse) = 1, inv = max", boot.evalJs("perm.lisV") === 1 && boot.evalJs("perm.inv") === 15,
    `lis=${boot.evalJs("perm.lisV")} inv=${boot.evalJs("perm.inv")}`);

  boot.evalJs("perm.init()");
  boot.setMode("twist");
}

function testQuilt(boot) {
  const sweeps = [];
  for (const K of [0, 1.1, 3]) {
    for (const delta of [0, 0.06, 0.2, 0.4]) {
      boot.setMode("quilt");
      boot.evalJs(`quilt.K = ${K}; quilt.delta = ${delta};`);
      boot.pump(100);
      boot.pump(300);
      const r = boot.evalJs(`(() => {
        const hist = quilt.hist.slice(-100);
        const meanB1 = hist.reduce((a, x) => a + x, 0) / hist.length;
        let nan = 0; for (let i = 0; i < quilt.phi.length; i++) if (!Number.isFinite(quilt.phi[i])) nan++;
        return { V: quilt.V, E: quilt.E, C: quilt.C, b1: quilt.b1, meanB1, nan, n: quilt.N * quilt.N };
      })()`);
      sweeps.push({ K, delta, ...r });
      record(`quilt.K${K}.d${delta}`, { C: r.C, b1: r.b1, meanB1: +r.meanB1.toFixed(1) });

      check(`quilt K=${K} δ=${delta}: no NaN phases`, r.nan === 0);
      check(`quilt K=${K} δ=${delta}: b1 arithmetic`, r.b1 === Math.max(0, r.E - r.V + r.C),
        `E=${r.E} V=${r.V} C=${r.C} b1=${r.b1}`);
      check(`quilt K=${K} δ=${delta}: C within [1, V]`, r.C >= 1 && r.C <= Math.max(1, r.V),
        `C=${r.C} V=${r.V}`);
    }
  }
  const at = (K, d) => sweeps.find(s => s.K === K && s.delta === d);
  check("quilt: K=3 δ=0 settles into few components (cluster state, 50 s)",
    (() => {
      boot.setMode("quilt"); // fresh random phases
      boot.evalJs("quilt.K = 3; quilt.delta = 0;");
      boot.pump(3000);
      return boot.evalJs("quilt.C") <= 6;
    })(),
    `C=${boot.evalJs("quilt.C")}`);
  check("quilt: coupling weaves more holes (meanB1 K=3 > K=0 at δ=0)",
    at(3, 0).meanB1 > at(1.1, 0).meanB1 && at(1.1, 0).meanB1 > at(0, 0).meanB1,
    `K=0: ${at(0, 0).meanB1.toFixed(1)}  K=1.1: ${at(1.1, 0).meanB1.toFixed(1)}  K=3: ${at(3, 0).meanB1.toFixed(1)}`);
  check("quilt: K=0 partial co-fire occupancy", at(0, 0).V > 150 && at(0, 0).V < 460,
    `V=${at(0, 0).V}`);
  check("quilt: tempo twist raises holes (δ=0.4 > δ=0 at K=1.1)",
    at(1.1, 0.4).meanB1 > at(1.1, 0).meanB1,
    `δ=0.4 meanB1=${at(1.1, 0.4).meanB1.toFixed(1)} vs δ=0 ${at(1.1, 0).meanB1.toFixed(1)}`);
  check("quilt: twist raises holes at every K (endpoints, δ 0 → 0.4)",
    at(0, 0.4).meanB1 > at(0, 0).meanB1 &&
    at(1.1, 0.4).meanB1 > at(1.1, 0).meanB1 &&
    at(3, 0.4).meanB1 > at(3, 0).meanB1,
    [0, 1.1, 3].map(K => `K=${K}: ${at(K, 0).meanB1.toFixed(0)}→${at(K, 0.4).meanB1.toFixed(0)}`).join("  "));
}

/* ============================ run ============================ */
const timed = (label, fn) => {
  const t0 = Date.now();
  fn();
  console.error(`  [sim] ${label} ${((Date.now() - t0) / 1000).toFixed(1)}s`);
};
try {
  timed("twist", () => testTwist(boot));
  timed("flock", () => testFlock(boot));
  timed("chirp", () => testChirp(boot));
  timed("quilt", () => testQuilt(boot));
  timed("perm", () => testPerm(boot));
} catch (e) {
  fail++;
  failures.push("HARNESS EXCEPTION: " + e.stack);
}

if (EXPLORE) {
  console.log(JSON.stringify(observed, null, 2));
} else {
  console.log("— observed —");
  console.log(JSON.stringify(observed, null, 2));
  console.log(`\n${pass} passed, ${fail} failed`);
  if (failures.length) {
    console.log("FAILURES:");
    for (const f of failures) console.log("  ✗ " + f);
    process.exit(1);
  }
  console.log("SIM TESTS PASS");
}
