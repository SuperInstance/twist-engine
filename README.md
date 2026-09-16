# SUPERINSTANCE — a twist engine

**Five substrates, one law: layers + deliberate offset → interference → emergence.**

No new atoms — *a new angle*. The property is in the twist. This is an interactive
canvas toy that demonstrates the law in five substrates, each with a live
ledger measuring the emergent quantity instead of asserting it.

Open `index.html` in a browser. That is the whole install.

```
┌─────────────────────────────────────────────────────┐
│  TWIST   two hex lattices, one rotation             │
│          → moiré superlattice, magic windows        │
│  FLOCK   the same birds under four collective nouns │
│          → the word builds the group                │
│  CHIRP   twelve transducers, a phase twist in time  │
│          → the beam is the interference             │
│  QUILT   a tempo-twisted cell grid                  │
│          → the ledger counts holes: b1 = E − V + C  │
│  PERM    n wires, a twist is a cycle                │
│          → the twist law in S_n, inversions live    │
└─────────────────────────────────────────────────────┘
```

## TWIST — two lattices, one deliberate misalignment

Two identical hex lattices are rotated against each other by an angle θ. Nothing
else changes — no new atoms, no new physics. At most angles the result is a blur.
At specific **magic windows** the registry locks and a supercell appears, with
wavelength λ = s / (2 sin θ/2).

- The ledger and the resonance curve share one instrument: **registration
  R(θ)** = mean gaussian alignment (σ = 0.24·s), measured by spatial hashing,
  and **S = 1 − R**. Computed, never asserted — the curve's windows and the
  live meter read the same quantity (kept honest by `tests/sim.test.js`).
- The detected windows form a **commensuration comb** — evenly spaced teeth
  (~0.75° apart) where the moiré supercell revives. SNAP jumps tooth to tooth.
- Drag horizontally to twist. **SNAP TO NEXT WINDOW** jumps to the next tooth.
- *Reference: twisted bilayer graphene, Jarillo-Herrero group, MIT 2018 —
  superconductivity from rotation, not composition.*

## FLOCK — relational rules only, no world-model anywhere

The same boids (Reynolds 1987 — alignment, cohesion, separation, limited to seven
neighbors) run under four **collective nouns**. Only the rule weights change.
The birds are identical in every mode.

| Noun | ali | coh | sep | Behavior |
|---|---|---|---|---|
| **MURMURATION** | 1.0 | 0.55 | 1.25 | seven neighbors. no plan. no architect. |
| **PACK** | 0.8 | 0.35 | 0.85 | pursuit. perimeter. the alpha question. |
| **KENNEL** | 0.25 | 0.15 | 0.7 | containment. feeding. waiting. (penned) |
| **PARLIAMENT** | 0.9 | 1.3 | 0.6 | the owl that speaks last has watched the longest. (ring) |

The ledger plots **polarization** |mean heading| — the measurable difference a
word makes on identical bodies. This is the operational-fiction thesis as a
physics demo: *the word builds the group.* See
[A Pack Thinks Like Dogs](https://github.com/SuperInstance/AI-Writings/blob/main/philosophy/a-pack-thinks-like-dogs.md).

## CHIRP — resolution bought with bandwidth, position bought with time

Twelve transducers along the bottom emit the same tone, each offset in phase by a
**twist per element**. The interference field is computed on a live grid; a beam
forms where the phases agree. Contacts (the fish) are detected only through the
field — range, bearing, and closure rate from two consecutive pings.

- Sweep the phase twist manually or let AUTO-SWEEP steer the beam.
- *This is how real sonar and phased-array radar work: the antenna never moves;
  only the clock does.*

## QUILT — the pattern is not in any hook

A 24×24 grid of coupled phase oscillators (Kuramoto 1975). Even and odd
sub-lattices run at tempos offset by δ — **a twist in time, not in space**. When a
cell's phase completes a cycle it *snaps*, briefly. The ledger builds the
**co-fire graph**: vertices = recently-snapped cells, edges = snapped neighbors
(including diagonals), components via union-find, and counts the holes:

> **b1 = E − V + C** — the first Betti number, the circuit rank, the number of
> independent loops in the fabric. The ledger counts the holes.

Raise the tempo twist and watch the topology change. STEP BACK zooms out; the
chart tracks b1 over time. The cells are dumb. The holes are real.

## PERM — the same twist, in the symmetric group

*n* wires cross a frame; the arrangement `arr[i]` says which label sits at
position *i*. Two moves generate everything:

- **SWAP σ_i** — the Coxeter generator: swap neighbors at positions *(i, i+1)*.
- **TWIST K** — rotate the first *k* wires by one: exactly the **k-cycle
  (1 2 … k)**, the braid word σ₁σ₂…σₖ₋₁. TWIST's k-block rotation, ported to S_n.

The ledger reads the arrangement live: **inversions** (the Cayley distance |π|),
cycle count, parity, the **longest increasing subsequence**, fixed points,
derangement status — plus **!n**, the exact derangement count. Turn on
**WALK** and random adjacent swaps drive |π| as a random walk toward its
uniform distribution: mean n(n−1)/4, variance n(n−1)(2n+5)/72 — the inversion
CLT, measured against the amber theory line on the chart, live.

- *Reference: Diaconis, **Group Representations in Probability and Statistics*
  (1988) — random walks on S_n as the ur-model for shuffling; the Mahonian
  distribution of inversions converges to a Gaussian as n grows.*

## Why these four together

Each substrate is the same theorem wearing different clothes:

| Mode | Layers | Offset | Emergent quantity | Ledger |
|---|---|---|---|---|
| TWIST | two lattices | rotation in space | supercell registry | S = 1 − R, λ |
| FLOCK | identical agents | a collective noun | group behavior | polarization |
| CHIRP | identical emitters | phase twist in time | the beam | contacts |
| QUILT | identical oscillators | tempo twist in time | fabric topology | b1 |
| PERM | n wires | a twist is a cycle | arrangement statistics | \|π\|, cycles, LIS, parity |

The fleet's thesis, stated elsewhere as *the cell is the universal substrate*,
here in its pure physics form: **interference is the cheapest computation there
is, and a deliberate offset is the cheapest program.**

## Running

Static files, no build, no dependencies:

```bash
python3 -m http.server 8000   # or just open index.html
```

Deep-link a mode with `?mode=twist|flock|chirp|quilt|perm`.

## Files

- `index.html` — shell: canvas, masthead tabs, the rail (ledger), footer controls
- `app.js` — the five substrates + mode manager (~950 lines, dependency-free)
- `styles.css` — the dark-sea palette (ink `#0a1a24`, phosphor `#46e0c0`, amber `#f7a026`)
- `tests/` — `dom-stub.js` + `sim.test.js`: 87 deterministic checks (mulberry32-seeded)
  across all five modes; `npm test` / `node tests/sim.test.js`, `--explore` prints observed values
- `playtest.py` — headless-Chromium pass over every tab (metrics, sliders, screenshots)
- `.github/workflows/ci.yml` — node sim suite + Playwright playtest on every push

## License

MIT. Built by the fleet, for the captain.
