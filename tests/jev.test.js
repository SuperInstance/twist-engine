// tests/jev.test.js — pins the cross-language JEV contract on twist-engine.
// Run: node tests/jev.test.js   (standalone; suite entry: npm test runs
// tests/sim.test.js — see add-jev-receipts branch for the combined runner.)
import { fnv1a, ReceiptChain, JevCell } from "../jev-receipts.mjs";

let n = 0, bad = 0;
const ok = (cond, msg) => { n++; if (!cond) { bad++; console.error("FAIL", msg); } };

// 1. Cross-language pin (jev-quilt PR #3): identical in Python and TS.
ok(fnv1a("café Δ 日本語") === 0x024a555471370b18dn, "UTF-8 fnv1a pin");
ok(fnv1a("") === 0xcbf29ce484222325n, "offset basis");
ok(fnv1a("a") !== fnv1a("b"), "distinct");

// 2. Chain: book, verify, tamper-detect.
const c = new ReceiptChain();
c.book("jev.reading", { cell: "twist.S", t: 0, value: 0.02, alarmed: false });
c.book("jev.reading", { cell: "twist.S", t: 1, value: 0.03, alarmed: false });
c.book("jev.alarm", { cell: "twist.S", t: 2, value: 0.41, alarmed: true });
ok(c.entries.length === 3, "3 receipts");
ok(c.verify(), "chain verifies");
c.entries[1].body = c.entries[1].body.replace("0.03", "0.30");
ok(!c.verify(), "tamper breaks chain");

// 3. JevCell on a K-meter stand-in: calm then regime jump at t=20.
const c2 = new ReceiptChain();
const cell = new JevCell("twist.K", { window: 8, floor: 0.08, chain: c2 });
let firstAlarm = null;
for (let t = 0; t < 40; t++) {
  const k = t >= 20 ? 0.6 + 0.01 * (t - 20) : 0.05 + 0.005 * Math.sin(t);
  if (cell.observe(t, k) && firstAlarm === null) firstAlarm = t;
}
ok(firstAlarm === 20, `alarm latency 0 (got ${firstAlarm})`);
ok(cell.alarms.length < 10, `alarms decay after absorption (got ${cell.alarms.length})`);
ok(c2.verify(), "full chain still verifies");

console.log(`${n - bad}/${n} jev checks passed; receipts: ${c2.entries.length}`);
process.exit(bad ? 1 : 0);
