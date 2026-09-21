# SETL — design note (Lane AF)

Lane W's `claude/the-fifth-substrate` (merged as PR #3, `SHIPPED-THE-FIFTH-SUBSTRATE.md`)
is sound and stays untouched: it records a *witnessed* fifth instance of the law
(Scrapcraft, the product children play). This lane builds the *physics* fifth
substrate beside the four demos — the twist law in the Boolean lattice B_n —
and references Lane W's note where the two meet.

## The substrate

B_n: all subsets of an n-set under inclusion. 2^n vertices, cover graph = the
n-dimensional hypercube. n tunable 4–8 for viewability.

## The twist law in B_n

Fix the offset subset K ⊆ [n]. The twist is one global operation, applied to
every vertex at once — no new atoms, a new relation:

    τ_K : A ↦ A △ K        (symmetric difference with the fixed subset K)

- Single-bit K={i}: the cover relation itself — a generator of B_n's edges
  (the exact analog of PERM's Coxeter generator σ_i).
- K=[n]: complementation, a fixed-point-free involution and order
  anti-automorphism, rank r ↦ n−r.

Commensuration analog, measured like TWIST instead of asserted:

    registry  R(A) = |A ∩ K| / |K|      (fraction of the offset already present)
    ledger    S(A) = 1 − R(A)            — the same misalignment meter as TWIST

The emergent quantity is the rank displacement the twist induces:

    |A △ K| − |A| = |K| − 2|A ∩ K| = |K|·(2S(A) − 1)

— a linear readout of the same meter. Interference: one offset, every vertex
thrown to a new rank; emergence: the measured displacement.

## The ledger (live, one definition, no dead meters)

- rank |A| of the current subset (the state is ONE vertex, like PERM's arrangement)
- per-rank subset counts C(n, r); Sperner antichain = widest rank C(n, ⌊n/2⌋),
  rendered distinctly (Sperner 1928)
- registry R and S = 1 − R
- rank displacement |K| − 2|A ∩ K|
- complement pairs: 2^(n−1), derived: fixed-point-free involution on 2^n vertices
- Dedekind number trace M(n) from the cited table only (never computed above
  what the view handles): 2, 3, 6, 20, 168, 7581, 7828352, 2414682040998,
  56130437228687557907788 for n = 0..8 (OEIS A000372; M(8): Wiedemann 1991)
- WALK: random single-bit flips = the Ehrenfest urn (Ehrenfest & Ehrenfest
  1907). Rank performs the classic convergence: mean → n/2, variance → n/4,
  measured against the theory lines live.

## The view

- n ≤ 5: Hasse diagram, ranked embedding; current vertex and its twist image
  highlighted; middle rank (Sperner antichain) banded distinctly.
- n ≥ 6: ranked-bar fallback (bars ∝ C(n,r)), current rank and twist-image
  rank marked, widest bar banded.

## Files (mirroring PERM, which lives in app.js)

- `app.js` — the `setl` mode object + MODES registration
- `index.html` — SETL tab
- `tests/sim.test.js` — testSetl (15+ new checks)
- `tests/dom-stub.js` — register the setl tab
- `README.md` — mode table row + SETL section
- `playtest.py` — exercise the SETL tab headlessly
