// Build a single-file node harness: DOM stubs + seeded RNG + the real app.js.
// Running everything in one script scope (no vm context) keeps V8's JIT happy —
// the same suite under vm.runInContext runs ~20x slower and OOMs.
"use strict";
const fs = require("fs");

function buildHarness(appJsPath, seed = 42, W0 = 960, H0 = 600) {
  const appSrc = fs.readFileSync(appJsPath, "utf8");
  const prelude = `
"use strict";
// NOTE: app.js declares its own W/H/DPR and initializes them via resize()
// (called at its bottom) — the prelude only supplies the window stub.
function mulberry32(seed) {
  let s = seed | 0;
  return function () {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const _rng = mulberry32(${seed});
const Math = Object.create(globalThis.Math);
Math.random = _rng;

function _makeCtx2d() {
  const store = {};
  return new Proxy(store, {
    get(t, k) {
      if (k === "createImageData")
        return (w, h) => ({ data: new Uint8ClampedArray(w * h * 4), width: w, height: h });
      if (k === "getImageData")
        return (x, y, w, h) => ({ data: new Uint8ClampedArray(w * h * 4) });
      if (k === "measureText") return () => ({ width: 10 });
      if (typeof t[k] !== "undefined") return t[k];
      return () => undefined;
    },
    set(t, k, v) { t[k] = v; return true; },
  });
}
function _makeEl(id) {
  return {
    id, children: [], style: {}, dataset: {}, innerHTML: "", textContent: "",
    clientWidth: 800, clientHeight: 72, width: 0, height: 0,
    classList: { toggle() {}, add() {}, remove() {} },
    appendChild(c) { this.children.push(c); },
    append(...cs) { this.children.push(...cs); },
    querySelectorAll() { return []; },
    addEventListener() {},
    getContext() { return _makeCtx2d(); },
  };
}
const _elements = {};
const _tabs = [];
for (const _m of ["twist", "flock", "chirp", "quilt"]) {
  const _b = _makeEl("tab-" + _m); _b.dataset.mode = _m; _tabs.push(_b);
}
const document = {
  getElementById(id) { return _elements[id] || (_elements[id] = _makeEl(id)); },
  createElement(tag) { return _makeEl(tag + "-" + (_rng() * 1e9 | 0)); },
  querySelectorAll(sel) { return sel === ".tab" ? _tabs : []; },
};
const window = { innerWidth: ${W0}, innerHeight: ${H0}, devicePixelRatio: 1, addEventListener() {} };
const location = { search: "" };
const history = { replaceState() {} };
let _now = 0;
const performance = { now: () => _now };
let _rafQ = [];
function requestAnimationFrame(fn) { _rafQ.push(fn); }
`;
  const tail = `
// ---- harness API ----
let __now = 0;
function pump(frames) {
  for (let i = 0; i < frames; i++) {
    __now += 16.7; _now = __now;
    const q = _rafQ; _rafQ = [];
    for (const fn of q) fn(__now);
  }
}
function resizeWindow(w, h) {
  window.innerWidth = w; window.innerHeight = h;
  resize();
}
module.exports = {
  pump,
  setMode: (m) => setMode(m),
  resizeWindow,
  evalJs: (expr) => eval(expr),
  twist, flock, chirp, quilt, MODES, FICTIONS,
};
`;
  const file = `/tmp/_twist_harness_${seed}.js`;
  fs.writeFileSync(file, prelude + "\n" + appSrc + "\n" + tail);
  return require(file);
}

module.exports = { buildHarness };
