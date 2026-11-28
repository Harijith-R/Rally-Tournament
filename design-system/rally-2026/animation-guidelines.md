# RALLY 2026 — Motion, GSAP & 3D Choreography Guidelines

> **System Reference**: Companion to `design-system/rally-2026/MASTER.md` and `tokens.css`  
> **Stack**: Three.js · React Three Fiber · Drei · GSAP · CSS Compositor Transitions  
> **Performance Target**: Locked 60 FPS on GPU-capable devices; graceful software-WebGL pacing and zero-motion static fallbacks everywhere else.

---

## 1. Motion Philosophy & Guardrails

Motion in **RALLY 2026** communicates speed, precision, and architectural weight — inspired by Formula 1 broadcast graphics and luxury automotive unveilings.

### Core Laws
1. **Compositor-Only 2D Animation**: Animate strictly `transform`, `opacity`, and `filter`. Never animate layout-triggering CSS properties (`width`, `height`, `top`, `left`, `padding`, `margin`) on scroll or hover.
2. **Routine Latency Budget (`<= 200ms`)**: Button hovers, navigation underlines, card elevation shifts, and filter tab switches must complete within `150ms–200ms` using `--rally-ease-settle: cubic-bezier(0.16, 1, 0.3, 1)`.
3. **Zero-Latency Content Access**: Never gate primary navigation, search inputs, or data tables behind slow entrance delays. Every page must be immediately interactive.
4. **No Excessive Neon or Arcade Glare**: Illumination pulses and particle trails remain restrained, high-contrast, and editorial.

---

## 2. 2D UI & Editorial Animation Patterns

### 2.1 Micro-Interactions (CSS Transitions)
| Element | Property Animated | Duration | Easing | Visual Outcome |
| :--- | :--- | :--- | :--- | :--- |
| Primary / Secondary Button | `background-color`, `border-color`, `color` | `150ms` | `ease-out` | Instant crisp response |
| Nav Link Underline | `transform: scaleX(0 → 1)` (`origin-left`) | `200ms` | `cubic-bezier(0.16, 1, 0.3, 1)` | Razor-thin `2px` lime draw |
| Team Card Hover | `transform: translateY(0 → -4px)`, `border-color` | `200ms` | `cubic-bezier(0.16, 1, 0.3, 1)` | Controlled architectural lift |
| Team Emblem Hover | `transform: scale(1 → 1.05)` | `200ms` | `cubic-bezier(0.16, 1, 0.3, 1)` | Subtle crest emphasis |
| Action Chevron / Arrow | `transform: translateX(0 → 4px)` | `180ms` | `cubic-bezier(0.16, 1, 0.3, 1)` | Directional affordance |
| Mobile Slide-Out Drawer | `transform: translateX(100% → 0%)`, backdrop `opacity` | `300ms` | `ease-out` | Smooth edge reveal |

### 2.2 GSAP Editorial Reveals & Stat Counters
- **Hero Text Stagger**: `y: 24px → 0`, `opacity: 0 → 1`, `duration: 0.8s`, `stagger: 0.09s`, `ease: "power3.out"`, with `clearProps: "transform,opacity"` on completion so transforms never interfere with sticky or interactive descendants.
- **Tournament Statistics Counters (`06`, `68`, `02`, `100`)**: Triggered once via `IntersectionObserver` (`threshold: 0.35`), tweened with GSAP (`duration: 1.4s`, `ease: "power3.out"`) using `tabular-nums` so columns never jitter horizontally while counting.
- **Scroll Cleanup**: Always scope GSAP animations inside `gsap.context(() => { ... }, containerRef)` and call `ctx.revert()` on unmount.

---

## 3. Signature 3D Opening Sequence (`CinematicIntro`)

### 3.1 Continuous 6-Scene Storyboard (~9.2s + 2.0s Clean Exit Finish)

All three hero subjects — **Shuttlecock**, **BWF Doubles Court**, and **Original RALLY 2026 Trophy** — inhabit one continuous Three.js scene driven by a single GSAP master timeline mutating a ref-backed `TimelineState` read inside `useFrame` (zero React re-renders per frame).

```
0.0s          1.5s          3.0s        4.3s            5.85s             7.6s        9.4s      11.4s
├─────────────┼─────────────┼───────────┼───────────────┼─────────────────┼───────────┼─────────┤
│  SCENE 1    │  SCENE 2    │  SCENE 3  │   SCENE 4     │    SCENE 5      │  SCENE 6  │ CLEAN   │
│  Darkness   │ Shuttlecock │ Accel +   │ Court Reveal  │ Trophy Rise &   │ Brand     │ FINISH  │
│  Emergence  │ Close Orbit │ Lime Trail│ & Arena Lights│ Hero Orbit      │ Reveal    │ 2s Fade │
└─────────────┴─────────────┴───────────┴───────────────┴─────────────────┴───────────┴─────────┘
                                                                          ▲           ▲         ▲
                                                                   brandVisible  isTransitioning Homepage
                                                                                 (overlays fade)  Enter
```

| Scene | Time Window | Camera Choreography | Subject & Lighting Action |
| :--- | :--- | :--- | :--- |
| **1 · Darkness** | `0.0s – 1.5s` | Slow dolly in (`z: 4.9 → 3.4`, `fov: 40`) | Pitch-dark arena (`#0B1118`); shuttlecock emerges from shadow with slow natural rotation (`rotY: 0 → 0.75π`); rim light rises softly. |
| **2 · Shuttlecock** | `1.5s – 3.0s` | Intimate orbital close-up (`x: 0 → 1.35`, `z: 3.4 → 2.15`) | 16 sculpted goose feathers and cork base catch warm key + cool rim reflections; subtle dust motes fade in (`opacity: 0.22`). |
| **3 · Acceleration** | `3.0s – 4.3s` | Dynamic FOV widen (`40° → 54° → 44°`) + sweeping chase pull-back | Shuttlecock pitches horizontal and accelerates across frame; subtle `#A3E635` additive slipstream trail peaks (`0.85`) and dissipates. |
| **4 · Court Reveal** | `4.3s – 5.85s` | Sweep down toward court perspective (`x: 3.6, y: 2.55, z: 7.4`) | Dark slate doubles court rises into place; BWF court markings illuminate progressively (`emissiveIntensity: 0 → 0.95`); net unfurls; overhead arena spotlights ignite. |
| **5 · Trophy Reveal** | `5.85s – 7.6s` | Majestic low-angle orbit around center court (`x: 3.6 → -1.8, z: 4.85`) | Original RALLY 2026 sculpted metallic silver trophy rises from center court ring (`y: -4.4 → 0.02`); lime plinth light (`#A3E635`) and atmospheric particles intensify. |
| **6 · Brand Reveal** | `7.6s – 9.4s` | Settles into centered heroic portrait framing (`x: 0.15, y: 2.1, z: 5.55`) | Editorial typography (`MEN'S DOUBLES CHAMPIONSHIP`, `RALLY 2026`, `EVERY POINT MATTERS.`) and `Enter Championship` button resolve smoothly. |
| **7 · Pre-Exit Clean Finish** | `2.0s before exit` | Continued silky slow trophy rotation | `isTransitioning` activates: **all UI overlays** (top bar, title, tagline, CTA, hairline progress bar) fade cleanly to `opacity: 0` over `700ms`, leaving 2 seconds of pure unobstructed 3D trophy cinema before cross-fading into the Homepage. |

### 3.2 Intro Playback & Overlay Restraint Rules
- **Once-Per-Session**: Persist completion in `sessionStorage` (`rally2026_intro_seen`).
- **Always Skippable**: Top-right `Skip Intro` button (`pointer-events-auto`) with solid/translucent `#101820/90` backing (**never** `backdrop-filter` over an active WebGL canvas).
- **Minimal Progress Hairline Only**: Display only a clean `2px` `#A3E635` bottom progress line — **hide** bottom scene chapter text and numeric percentage readouts during playback so the 3D scene remains cinematic and unobstructed.
- **Replay Access**: Available anytime via `Watch Intro` (Navbar) and `Replay 3D Intro` (Homepage Hero & Footer).

---

## 4. Three.js Procedural Craft & PBR Lighting Standards

### 4.1 Composite 3–12+ Part Procedural Models (Zero Default Primitives)
Every 3D hero asset must be constructed as a multi-part `THREE.Group` with distinct silhouette scales, calibrated roughness/metalness contrast (`>= 0.25` roughness separation between adjacent materials), and grounded bottom-center pivots (`y = 0`):

1. **Shuttlecock (`ShuttlecockModel`)**:
   - Hemispherical cork base (`LatheGeometry`, matte leather roughness `0.62`).
   - Dark anthracite collar + razor-thin `#A3E635` accent stripe.
   - 16 individually tilted, overlapping goose feathers (`CylinderGeometry` tapered quills + `ExtrudeGeometry` sculpted vanes with `MeshPhysicalMaterial` sheen).
   - Twin stitched binding rings (`TorusGeometry`) + curved `TubeGeometry` lime slipstream ribbon.
2. **Badminton Court (`BadmintonCourtModel`)**:
   - Regulation BWF doubles ratios (`6.1m × 13.4m`) on dark slate mat (`#182532`, roughness `0.66`) offset `>= 0.015` above arena floor with `polygonOffset` to prevent coplanar Z-fighting.
   - All 12 regulation doubles/singles lines with progressive illumination controls.
   - Metallic net posts, crisp white top tape, and procedural high-DPI `CanvasTexture` square net mesh (`SRGBColorSpace`, max anisotropy, zero external file fetches).
3. **Original RALLY 2026 Trophy (`RallyTrophyModel`)**:
   - Stepped circular obsidian-steel plinth (`LatheGeometry`, metalness `0.72`, roughness `0.34`, clearcoat `0.45`) with brushed silver lower rim.
   - Curved front nameplate mapped with high-DPI procedural `CanvasTexture` (`1024×256`, `SRGBColorSpace`) engraved with `RALLY 2026` and `EVERY POINT MATTERS.`.
   - Recessed `#A3E635` architectural light collar tucked into the upper plinth bevel.
   - Fluted metallic silver central chalice stem (`LatheGeometry`, metalness `0.96`, roughness `0.14`, clearcoat `0.80`).
   - Twin sweeping aerodynamic arcs inspired by badminton rackets (`TubeGeometry` along bespoke `CatmullRomCurve3` paths) + secondary inner tension arcs.
   - Shuttlecock-inspired metallic crown: 12 radially flared beveled blades (`ExtrudeGeometry`) surrounding a polished platinum core sphere and subtle lime halo.
   - **Blender GLB Swap Contract**: Accepts an optional `glbUrl?: string | null` prop wrapped in `<Suspense>` + Error Boundary so a compressed Blender `.glb` asset replaces the procedural trophy cleanly without modifying any parent scene.

### 4.2 Studio PBR Lighting, Reflections & Atmosphere
- **Color Pipeline**: `ACESFilmicToneMapping` (`toneMappingExposure: 1.12–1.15`) and `SRGBColorSpace` output.
- **Zero-404 Studio Reflections**: Generate `scene.environment` at mount using `THREE.PMREMGenerator` + `RoomEnvironment` (never fetch external `.hdr` URLs). Dispose both `RoomEnvironment` and the PMREM render target on unmount.
- **3-Point Warm/Cool Rig**:
  - Warm directional key light (`#FFF5E8`, tight orthographic shadow frustum, `shadow.bias = -0.0005`, `shadow.normalBias = 0.02`, disabled on software WebGL).
  - Cool `HemisphereLight` sky/ground fill (`#C9DCF0` / `#0F1720`).
  - Dramatic cool spotlight rim (`#CFE2FF`) separating brushed silver edges from `#0B1118` horizon fog (`FogExp2`).
  - Restrained `#A3E635` close-range point light accentuating the trophy plinth.

---

## 5. Interactive 3D Trophy Placement & Ergonomics

### 5.1 Homepage Hero 3D Trophy (`variant="hero"`)
- **Placement**: Positioned cleanly in the **upper-left hero showcase zone** directly above the `MEN'S DOUBLES CHAMPIONSHIP · SEASON 2026` kicker and `RALLY 2026` display title, with dedicated vertical clearance so the circular trophy plinth and lime floor ring **never overlap or obstruct** the `RALLY 2026` headline.
- **Seamless Integration**: Rendered with WebGL `alpha: true` (`clearColor(0, 0)`) directly over the darkened hero arena backdrop (no boxed dark frame).
- **Interaction**: Full 360° horizontal drag orbit (`OrbitControls` with `enableZoom={false}`, `enablePan={false}`, `enableDamping`, `dampingFactor: 0.07`, `rotateSpeed: 0.85`). Idle slow rotation automatically pauses on pointer down (`onStart`) and resumes gracefully on release (`onEnd`).

### 5.2 Champions Hall 3D Trophy (`variant="stage"`)
- Dedicated full-width `460px–580px` framed championship studio stage with grounded circular floor plinth, lime ring, subtle `Drag to rotate 360°` caption, and elevated celebratory lighting intensity when `tournament.champion.announced === true`.

---

## 6. Performance Guardrails, Reduced Motion & Fallbacks

| Environment Condition | Required Behavior |
| :--- | :--- |
| **Hardware GPU (Desktop / Modern Mobile)** | Full 60 FPS `requestAnimationFrame`, `dpr: [1, 1.8]`, `antialias: true`, soft shadows (`PCFSoftShadowMap`), damped `OrbitControls`. |
| **Software WebGL (`SwiftShader`, `llvmpipe`, `softpipe`, `WARP`)** | Detected via `WEBGL_debug_renderer_info` (never user agent). Same scene geometry & layout; scale rendering cost only (`dpr: 1`, `antialias: false`, `shadows: false`, `enableDamping: false`, `autoSpin: false`). |
| **`prefers-reduced-motion: reduce`** | Bypass continuous auto-play 3D intro by default and show clean static championship brand welcome with direct `Enter Championship` button (plus optional manual `Play 3D Intro` trigger); disable GSAP entrance motion and counter scrub; disable idle trophy spin. |
| **WebGL Unavailable / `webglcontextlost`** | Immediately transition to styled high-resolution photographic championship stage fallback (`rally_social_stage`) with crisp overlay typography — zero blank canvas or broken frames. |
| **Memory & GC Hygiene** | Pre-allocate scratch `THREE.Vector3` outside `useFrame`; dispose all procedural geometries, `CanvasTexture`s, materials, and `PMREMGenerator` targets on unmount. |
