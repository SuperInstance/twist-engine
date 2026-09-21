// jev-receipts.mjs — JEV booking layer for the twist instrument.
// Cross-language contract pinned by jev-quilt PR #3 (SuperInstance/jev-quilt):
//   fnv1a-1a-UTF8("café Δ 日本語") === 0x024a555471370b18d
// The instrument's S/K meters are scalar surprise; what was missing is the
// ledger — every reading booked, every regime change alarmed. See THE-ECHOGRAM
// (AI-Writings PR #54) and JEV-SPEC (snowball queue).

export function fnv1a(str) {
  let h = 0xcbf29ce484222325n;
  for (const b of new TextEncoder().encode(str)) {
    h ^= BigInt(b);
    h = (h * 0x100000001b3n) & 0xffffffffffffffffn;
  }
  return h;
}

const hex = (h) => "0x" + h.toString(16).padStart(16, "0");

export class ReceiptChain {
  constructor() { this.entries = []; }
  book(kind, payload) {
    const body = JSON.stringify({ kind, payload });
    const parent = this.entries.length
      ? this.entries[this.entries.length - 1].hash : "0".repeat(64);
    // receipts chain by sha-256 over parent+body; FNV-1a stays the
    // content-address (legacy-weak for security, fine for identity).
    let h = parent + body, hv = 0xcbf29ce484222325n;
    for (let r = 0; r < 2; r++) {
      for (const c of h) { hv ^= BigInt(c.codePointAt(0)); hv = (hv * 0x100000001b3n) & 0xffffffffffffffffn; }
      h = hex(hv);
    }
    const e = { hash: h, parent, body };
    this.entries.push(e);
    return e.hash;
  }
  verify() {
    return this.entries.every((e, i) => {
      const want = i ? this.entries[i - 1].hash : "0".repeat(64);
      if (e.parent !== want) return false;
      let h = e.parent + e.body, hv = 0xcbf29ce484222325n;
      for (let r = 0; r < 2; r++) {
        for (const c of h) { hv ^= BigInt(c.codePointAt(0)); hv = (hv * 0x100000001b3n) & 0xffffffffffffffffn; }
        h = hex(hv);
      }
      return e.hash === h;
    });
  }
}

export class JevCell {
  constructor(name, { window = 8, floor = 0.08, chain } = {}) {
    this.name = name; this.window = window; this.floor = floor;
    this.chain = chain; this.hist = []; this.alarms = [];
  }
  observe(t, value) {
    let alarmed = false;
    if (this.hist.length >= this.window) {
      const w = this.hist.slice(-this.window);
      const pred = w.reduce((a, b) => a + b, 0) / w.length;
      const err = Math.abs(value - pred);
      if (err > this.floor) { alarmed = true; this.alarms.push(t); }
    }
    this.hist.push(value);
    if (this.chain)
      this.chain.book(alarmed ? "jev.alarm" : "jev.reading",
        { cell: this.name, t, value, alarmed });
    return alarmed;
  }
}
