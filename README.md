# SUPERINSTANCE — a twist engine

**Six substrates, one law: layers + deliberate offset → interference → emergence.**

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
│  SETL    subsets of an n-set, twist = A ↦ A △ K     │
│          → the twist law in B_n, registry S live    │
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
physics demo: *the word builds the group.* The nouns are the cheapest line of code in the
system and they move the most physics — measured on identical agents in
`tests/sim.test.js` (murmuration 0.606 / pack 0.561 / kennel containment /
parliament ring). See
[A Pack Thinks Like Dogs](https://github.com/SuperInstance/AI-Writings/blob/main/philosophy/a-pack-thinks-like-dogs.md)
and its measured sequel,
[Word-Calling](https://github.com/SuperInstance/AI-Writings/blob/main/philosophy/word-calling.md).

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

## SETL — the same twist, in the Boolean lattice

The substrate is **B_n**: all subsets of an n-set under inclusion — 2^n
vertices, the cover graph is the n-dimensional hypercube. *n* is tunable
4–8 for viewability. The state is **one vertex** A ⊆ [n], exactly as PERM's
state is one arrangement.

Fix the **offset subset K ⊆ [n]**. The twist is one global operation, applied
to every vertex at once — no new atoms, a new relation:

> **τ_K : A ↦ A △ K** (symmetric difference with the fixed subset K)

- **K = {i}** is a single-bit flip — a cover relation of B_n, a generator of
the cube's edges (PERM's Coxeter σ_i, ported to subsets).
- **K = [n]** is complementation: a fixed-point-free involution and order
  anti-automorphism, rank r ↦ n−r.

The commensuration meter is TWIST's, honest the same way:

> **registry R = |A ∩ K| / |K|** — the fraction of the offset already present —
> **ledger S = 1 − R**, and the emergent quantity is the rank displacement
> **|A △ K| − |A| = |K| − 2|A ∩ K| = |K|·(2S − 1)**.

Commensuration = A absorbs K entirely (S = 0); incommensurate = disjoint
(S = 1). The displacement the twist induces is a linear readout of the same
meter — interference measured, not asserted.

The ledger (one definition, no dead meters): rank **|A|**; per-rank subset
counts **C(n, r)** with the **Sperner antichain** — the widest rank
C(n, ⌊n/2⌋), Sperner 1928 — rendered distinctly as the magic-window analog;
complement pairs **2^(n−1)** (derived: a fixed-point-free involution on 2^n
vertices); the **Dedekind number trace** M(n) for the current *n*, cited from
table only (2, 3, 6, 20, 168, 7581, 7828352, 2414682040998,
56130437228687557907788 for n = 0…8 — OEIS A000372; M(8) after Wiedemann
1991) and never computed past what the view handles. Turn on **WALK** and
random single-bit flips drive the rank as the **Ehrenfest urn** (Ehrenfest &
Ehrenfest 1907): the classic convergence to the binomial, mean **n/2**,
variance **n/4**, drawn live against the amber theory lines, stationary
occupancy C(n,r)/2^n. The view is the **Hasse diagram** at n ≤ 5 (current
vertex and its twist image highlighted, middle rank banded) and a
**ranked-bar** fallback at n ≥ 6.

- *References: Sperner, "Ein Satz über Untermengen einer endlichen Menge"
  (1928); Dedekind (1897) / OEIS A000372; Ehrenfest & Ehrenfest,
  Physikalische Zeitschrift 8:311–314 (1907). The companion note
  `SHIPPED-THE-FIFTH-SUBSTRATE.md` records the witnessed fifth instance of
  this law — Scrapcraft — where the offset is a child's tile program.*

## Why these six together

Each substrate is the same theorem wearing different clothes:

| Mode | Layers | Offset | Emergent quantity | Ledger |
|---|---|---|---|---|
| TWIST | two lattices | rotation in space | supercell registry | S = 1 − R, λ |
| FLOCK | identical agents | a collective noun | group behavior | polarization |
| CHIRP | identical emitters | phase twist in time | the beam | contacts |
| QUILT | identical oscillators | tempo twist in time | fabric topology | b1 |
| PERM | n wires | a twist is a cycle | arrangement statistics | \|π\|, cycles, LIS, parity |
| SETL | subsets of an n-set | a fixed subset K | rank displacement | S = 1 − \|A∩K\|/\|K\|, Sperner, Dedekind |

The fleet's thesis, stated elsewhere as *the cell is the universal substrate*,
here in its pure physics form: **interference is the cheapest computation there
is, and a deliberate offset is the cheapest program.**

## Running

Static files, no build, no dependencies:

```bash
python3 -m http.server 8000   # or just open index.html
```

Deep-link a mode with `?mode=twist|flock|chirp|quilt|perm|setl`.

## Files

- `index.html` — shell: canvas, masthead tabs, the rail (ledger), footer controls
- `app.js` — the six substrates + mode manager (~1250 lines, dependency-free)
- `styles.css` — the dark-sea palette (ink `#0a1a24`, phosphor `#46e0c0`, amber `#f7a026`)
- `tests/` — `dom-stub.js` + `sim.test.js`: 130 deterministic checks (mulberry32-seeded)
  across all six modes; `npm test` / `node tests/sim.test.js`, `--explore` prints observed values
- `playtest.py` — headless-Chromium pass over every tab (metrics, sliders, screenshots)
- `.github/workflows/ci.yml` — node sim suite + Playwright playtest on every push

## License

MIT. Built by the fleet, for the captain.
