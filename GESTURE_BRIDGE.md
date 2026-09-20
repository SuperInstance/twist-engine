# The twist, as a gesture — how this engine's law became fleet code

> *Five substrates, one law: layers + deliberate offset → interference →
> emergence. No new atoms — a new angle. The property is in the twist.*

That is this repo's whole thesis, demonstrated five ways on a canvas (TWIST,
FLOCK, CHIRP, QUILT, PERM), each with a live ledger that *measures* the emergent
quantity instead of asserting it. This note records that the same law now runs as
**code** across the SuperInstance fleet — not as another toy, but as a geometric
reading five other repos share.

## The engine already emits a gesture

Each substrate's `metrics()` fires on a clock (~every 140ms) and the QUILT mode
already keeps a running history (`hist.push(b1)`). So each ledger is not just a
number on a rail — over a span of seconds it is a **trajectory** through an
observable space:

| Substrate | The ledger reading, per frame | The space it moves through |
|---|---|---|
| TWIST | `S` (1 − registration), `λ`, `inWindow` | commensuration / registry |
| FLOCK | `pol` (polarization), `meanSpd` | collective order |
| CHIRP | `heading`, contact `r`/`bearing`/`closure` | beamforming geometry |
| QUILT | `V`, `E`, `C`, `b1 = E − V + C` (holes) | cellular topology |
| PERM | `inv` (inversions), `cyc`, `parity` | the symmetric group Sₙ |

Read that stream of readings as a path and it has geometry the instantaneous rail
cannot show:

- **arc length** — how far the toy's physics travels over a span,
- **bending** (curvature) — how often it *changes its mind* about the emergent
  quantity, turning within a plane of the observable space,
- **twist** (torsion) — whether the physics keeps opening *genuinely new
  directions*, or recycles the same plane. `twist_energy(ledger[0:t])` is this
  engine's own law, turned back on its own measurements.

Curvature rearranges what is already there; twist reaches what was not. That is
the difference between a moiré pattern that shimmers in place and one whose
registry locks into a new supercell — the magic window. *The property is in the
twist.*

## Where the law now runs as code

The reading above is implemented, tested, and shipped in five fleet repos. Each
takes an ordered sequence of vectors and exposes the same three orders —
`arc_length`/`heading` (1st), `bending_energy` (2nd, curvature), `twist_energy`
(3rd, torsion) — plus `planarity` (the scale-free inverse of twist):

- **[musician-soul](https://github.com/SuperInstance/musician-soul)** —
  `AbstractionSpline.twist_energy` over a phrase's path through a 32-D feature
  space: a melody opening a new dimension of style.
- **[elephant](https://github.com/SuperInstance/elephant)** —
  `VibeTrajectory.twist_energy` over a room's dial readings: a mood recruiting a
  new dial rather than swinging in one plane.
- **[tensor-midi](https://github.com/SuperInstance/tensor-midi)** —
  `Clip.twistEnergy` over a conversation's SWMIDI events: a dialogue reaching a
  genuinely new axis.
- **[quilt](https://github.com/SuperInstance/quilt)** — `@quilt/core`'s `Gesture`
  over any cell's motion through state space: the neutral primitive, at the
  substrate where the fleet's abstractions compose.
- **[federated-tinyml-vessel](https://github.com/SuperInstance/federated-tinyml-vessel)**
  — `convergence_geometry` over a federated model's per-round parameter
  trajectory: whether FedAvg convergence opens new dimensions or refines one.

A tensor approximates a function. The fleet approximates the *abstraction* — the
shape of the motion between states — and the third order of that shape is the
twist this engine has been demonstrating all along. The toy showed the law; the
crates made it a number you can read off anything that moves.

## If you want the engine to hand its ledger over

The one missing seam is export: `metrics()` renders to a rail but does not emit a
machine-readable series. A small `recordGesture(mode, dtMs)` that pushes each
frame's numeric readings into an array would let any of the readers above consume
this engine's own physics directly — TWIST's `S(θ)` as a curve, QUILT's `b1(t)` as
a topology gesture — closing the loop from law to measurement to shared geometry.
Left as a marked next step, not built here, so this note stays honest about what
ships today: the doc, and the five implementations it points to.
