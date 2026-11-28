import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import gsap from 'gsap';
import * as THREE from 'three';
import { ArrowRight, Play, SkipForward } from 'lucide-react';
import { RALLY_MEDIA } from '../../lib/media';
import { BadmintonCourtModel } from './BadmintonCourtModel';
import { RallyTrophyModel } from './RallyTrophyModel';
import { ShuttlecockModel } from './ShuttlecockModel';
import { StudioEnvironment } from './StudioEnvironment';
import { detectSoftwareWebGL, detectWebGLSupport, prefersReducedMotion } from './webglUtils';

interface CinematicIntroProps {
  onComplete: () => void;
  trophyGlbUrl?: string | null;
}

interface TimelineState {
  camX: number;
  camY: number;
  camZ: number;
  lookX: number;
  lookY: number;
  lookZ: number;
  fov: number;

  shuttleX: number;
  shuttleY: number;
  shuttleZ: number;
  shuttleRotX: number;
  shuttleRotY: number;
  shuttleRotZ: number;
  shuttleScale: number;
  trailOpacity: number;

  courtY: number;
  courtLineIntensity: number;
  courtLineOpacity: number;
  netScaleY: number;
  ringOpacity: number;

  arenaKeyIntensity: number;
  arenaRimIntensity: number;
  limePointIntensity: number;

  trophyY: number;
  trophyRotY: number;
  trophyScale: number;
  particlesOpacity: number;
}

const SCENE_CHAPTERS = [
  { threshold: 0, label: '01 · Darkness' },
  { threshold: 0.16, label: '02 · The Shuttlecock' },
  { threshold: 0.34, label: '03 · Acceleration' },
  { threshold: 0.48, label: '04 · Arena Illumination' },
  { threshold: 0.64, label: '05 · The RALLY Trophy' },
  { threshold: 0.82, label: '06 · RALLY 2026' },
];

const AtmosphericParticles: React.FC<{
  opacityRef: React.RefObject<TimelineState>;
}> = ({ opacityRef }) => {
  const pointsRef = useRef<THREE.Points | null>(null);
  const matRef = useRef<THREE.PointsMaterial | null>(null);

  const geometry = useMemo(() => {
    const count = 160;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 1.4 + Math.random() * 6.5;
      const theta = Math.random() * Math.PI * 2;
      positions[i * 3] = Math.cos(theta) * r;
      positions[i * 3 + 1] = 0.2 + Math.random() * 5.2;
      positions[i * 3 + 2] = Math.sin(theta) * r;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.04;
    }
    if (matRef.current && opacityRef.current) {
      matRef.current.opacity = opacityRef.current.particlesOpacity;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        ref={matRef}
        color="#DCE6F0"
        size={0.042}
        transparent
        opacity={0}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
};

interface IntroSceneProps {
  stateRef: React.RefObject<TimelineState>;
  trophyGlbUrl?: string | null;
  isSoftwareGl: boolean;
}

const IntroScene: React.FC<IntroSceneProps> = ({ stateRef, trophyGlbUrl, isSoftwareGl }) => {
  const { camera, scene } = useThree();
  const shuttleGroupRef = useRef<THREE.Group | null>(null);
  const trailRef = useRef<THREE.Mesh | null>(null);
  const courtGroupRef = useRef<THREE.Group | null>(null);
  const netGroupRef = useRef<THREE.Group | null>(null);
  const ringMatRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const trophyGroupRef = useRef<THREE.Group | null>(null);
  const keyLightRef = useRef<THREE.DirectionalLight | null>(null);
  const rimLightRef = useRef<THREE.SpotLight | null>(null);
  const limePointRef = useRef<THREE.PointLight | null>(null);
  const lookTarget = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    const s = stateRef.current;
    if (!s) return;

    // Camera choreography
    camera.position.set(s.camX, s.camY, s.camZ);
    lookTarget.set(s.lookX, s.lookY, s.lookZ);
    camera.lookAt(lookTarget);

    if (camera instanceof THREE.PerspectiveCamera && Math.abs(camera.fov - s.fov) > 0.01) {
      camera.fov = s.fov;
      camera.updateProjectionMatrix();
    }

    // Shuttlecock kinematics
    if (shuttleGroupRef.current) {
      shuttleGroupRef.current.position.set(s.shuttleX, s.shuttleY, s.shuttleZ);
      shuttleGroupRef.current.rotation.set(s.shuttleRotX, s.shuttleRotY, s.shuttleRotZ);
      shuttleGroupRef.current.scale.setScalar(Math.max(0.0001, s.shuttleScale));
      shuttleGroupRef.current.visible = s.shuttleScale > 0.01;
    }

    if (trailRef.current) {
      const mat = trailRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = s.trailOpacity;
      trailRef.current.visible = s.trailOpacity > 0.01;
    }

    // Badminton court progressive materialization
    if (courtGroupRef.current) {
      courtGroupRef.current.position.y = s.courtY;
      courtGroupRef.current.visible = s.courtY > -2.9;

      // Update court marking line materials cleanly without per-frame React renders
      courtGroupRef.current.traverse((obj) => {
        if (obj instanceof THREE.Mesh && obj.material instanceof THREE.MeshStandardMaterial) {
          if (obj.material.name === 'court-line-mat') {
            obj.material.opacity = s.courtLineOpacity;
            obj.material.emissiveIntensity = s.courtLineIntensity;
          }
        }
      });
    }

    if (netGroupRef.current) {
      netGroupRef.current.scale.y = Math.max(0.001, s.netScaleY);
      netGroupRef.current.visible = s.netScaleY > 0.02;
    }

    if (ringMatRef.current) {
      ringMatRef.current.opacity = s.ringOpacity;
    }

    // RALLY 2026 Trophy rise and majestic slow spin
    if (trophyGroupRef.current) {
      trophyGroupRef.current.position.y = s.trophyY;
      trophyGroupRef.current.rotation.y = s.trophyRotY + delta * 0;
      trophyGroupRef.current.scale.setScalar(Math.max(0.0001, s.trophyScale));
      trophyGroupRef.current.visible = s.trophyScale > 0.01;
    }

    // Arena lights ignite smoothly
    if (keyLightRef.current) {
      keyLightRef.current.intensity = s.arenaKeyIntensity;
    }
    if (rimLightRef.current) {
      rimLightRef.current.intensity = s.arenaRimIntensity;
    }
    if (limePointRef.current) {
      limePointRef.current.intensity = s.limePointIntensity;
    }
  });

  useEffect(() => {
    scene.fog = new THREE.FogExp2('#0B1118', 0.042);
    return () => {
      scene.fog = null;
    };
  }, [scene]);

  return (
    <>
      <color attach="background" args={['#0B1118']} />
      <StudioEnvironment intensity={0.78} />

      {/* Warm/Cool Arena Lighting Rig */}
      <hemisphereLight args={['#B8D0E8', '#0D141C', 0.35]} />
      <directionalLight
        ref={keyLightRef}
        position={[6, 11, 7]}
        intensity={0.4}
        color="#FFF5E6"
        castShadow={!isSoftwareGl}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0005}
        shadow-normalBias={0.02}
      />
      <spotLight
        ref={rimLightRef}
        position={[-6, 9, -7]}
        angle={0.5}
        penumbra={0.7}
        intensity={1.5}
        color="#D9E8FF"
      />
      <pointLight
        ref={limePointRef}
        position={[0, 1.4, 0.8]}
        distance={7}
        intensity={0.4}
        color="#A3E635"
      />

      {/* Element 1: Realistic 3D Badminton Shuttlecock */}
      <group ref={shuttleGroupRef}>
        <ShuttlecockModel scale={1.15} trailRef={trailRef} />
      </group>

      {/* Element 2: Professional Badminton Court */}
      <group ref={courtGroupRef} position={[0, -3, 0]}>
        <BadmintonCourtModel netGroupRef={netGroupRef} ringMaterialRef={ringMatRef} />
      </group>

      {/* Element 3: Original RALLY 2026 Championship Trophy */}
      <group ref={trophyGroupRef} position={[0, -4.2, 0]}>
        <RallyTrophyModel glbUrl={trophyGlbUrl} scale={0.95} />
      </group>

      <AtmosphericParticles opacityRef={stateRef} />
    </>
  );
};

export const CinematicIntro: React.FC<CinematicIntroProps> = ({ onComplete, trophyGlbUrl }) => {
  const [webglReady, setWebglReady] = useState<boolean>(() => detectWebGLSupport());
  const isSoftwareGl = useMemo(() => detectSoftwareWebGL(), []);
  const reducedMotion = useMemo(() => prefersReducedMotion(), []);
  const [forcePlayReduced, setForcePlayReduced] = useState(false);

  const [progress, setProgress] = useState(0);
  const [brandVisible, setBrandVisible] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [exiting, setExiting] = useState(false);

  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const stateRef = useRef<TimelineState>({
    camX: 0,
    camY: 2.3,
    camZ: 4.9,
    lookX: 0,
    lookY: 2.0,
    lookZ: 0,
    fov: 40,

    shuttleX: 0,
    shuttleY: 2.0,
    shuttleZ: 0,
    shuttleRotX: 0.35,
    shuttleRotY: 0,
    shuttleRotZ: 0.25,
    shuttleScale: 0.01,
    trailOpacity: 0,

    courtY: -3.2,
    courtLineIntensity: 0,
    courtLineOpacity: 0,
    netScaleY: 0.001,
    ringOpacity: 0,

    arenaKeyIntensity: 0.2,
    arenaRimIntensity: 1.2,
    limePointIntensity: 0.15,

    trophyY: -4.4,
    trophyRotY: -0.9,
    trophyScale: 0.01,
    particlesOpacity: 0,
  });

  const handleFinish = () => {
    if (exiting) return;
    setIsTransitioning(true);
    setExiting(true);
    timelineRef.current?.kill();
    window.setTimeout(() => {
      onComplete();
    }, 450);
  };

  useEffect(() => {
    if (!webglReady || (reducedMotion && !forcePlayReduced)) {
      return;
    }

    const s = stateRef.current;

    const tl = gsap.timeline({
      onUpdate: () => {
        setProgress(tl.progress());
      },
      onComplete: () => {
        setBrandVisible(true);
      },
    });

    // SCENE 1 (0.0s - 1.5s): DARKNESS — Shuttlecock emerges from shadow with slow rotation
    tl.to(
      s,
      {
        shuttleScale: 1.0,
        shuttleRotY: Math.PI * 0.75,
        arenaKeyIntensity: 0.9,
        arenaRimIntensity: 2.6,
        camZ: 3.4,
        camY: 2.15,
        duration: 1.5,
        ease: 'power2.out',
      },
      0
    );

    // SCENE 2 (1.5s - 3.0s): SHUTTLECOCK — Slow cinematic close-up orbit & reflection showcase
    tl.to(
      s,
      {
        camX: 1.35,
        camY: 2.05,
        camZ: 2.15,
        shuttleRotY: Math.PI * 1.9,
        shuttleRotX: 0.6,
        arenaKeyIntensity: 1.5,
        particlesOpacity: 0.22,
        duration: 1.5,
        ease: 'sine.inOut',
      },
      1.5
    );

    // SCENE 3 (3.0s - 4.3s): ACCELERATION — Shuttlecock streaks across screen with lime-green trail & FOV sweep
    tl.to(
      s,
      {
        shuttleRotZ: Math.PI / 2,
        shuttleRotX: 0.1,
        trailOpacity: 0.85,
        fov: 54,
        duration: 0.45,
        ease: 'power2.in',
      },
      3.0
    )
      .to(
        s,
        {
          shuttleX: -9.5,
          shuttleY: 2.7,
          shuttleZ: -5.5,
          camX: -1.4,
          camY: 4.8,
          camZ: 9.2,
          lookY: 0.4,
          duration: 0.9,
          ease: 'power3.in',
        },
        3.35
      )
      .to(
        s,
        {
          shuttleScale: 0.001,
          trailOpacity: 0,
          fov: 44,
          duration: 0.3,
          ease: 'power2.out',
        },
        4.15
      );

    // SCENE 4 (4.3s - 5.9s): COURT REVEAL — Court materializes, markings illuminate, arena lights ignite
    tl.to(
      s,
      {
        courtY: 0,
        courtLineOpacity: 0.95,
        courtLineIntensity: 0.95,
        netScaleY: 1,
        ringOpacity: 0.85,
        arenaKeyIntensity: 2.6,
        arenaRimIntensity: 3.4,
        camX: 3.6,
        camY: 2.55,
        camZ: 7.4,
        lookX: 0,
        lookY: 1.0,
        lookZ: 0,
        duration: 1.6,
        ease: 'power3.out',
      },
      4.25
    );

    // SCENE 5 (5.85s - 7.85s): ORIGINAL TROPHY REVEAL — Trophy rises from center court, orbiting camera
    tl.to(
      s,
      {
        trophyScale: 1.0,
        trophyY: 0.02,
        trophyRotY: 0.15,
        limePointIntensity: 2.2,
        particlesOpacity: 0.52,
        courtLineIntensity: 0.35,
        duration: 1.35,
        ease: 'power3.out',
      },
      5.8
    ).to(
      s,
      {
        camX: -1.8,
        camY: 2.25,
        camZ: 4.85,
        lookY: 1.82,
        trophyRotY: 0.72,
        duration: 2.1,
        ease: 'sine.inOut',
      },
      6.0
    );

    // SCENE 6 (7.6s - 9.2s): BRAND REVEAL — Final heroic framing as typography resolves
    tl.call(
      () => {
        setBrandVisible(true);
      },
      undefined,
      7.45
    ).to(
      s,
      {
        camX: 0.15,
        camY: 2.1,
        camZ: 5.55,
        lookY: 1.75,
        trophyRotY: 1.25,
        duration: 3.6,
        ease: 'power1.out',
      },
      7.6
    );

    timelineRef.current = tl;

    return () => {
      tl.kill();
    };
  }, [webglReady, reducedMotion, forcePlayReduced]);

  // Fade out all UI text overlays 2 seconds before transitioning to the main homepage
  useEffect(() => {
    if (!brandVisible || !webglReady || (reducedMotion && !forcePlayReduced)) return;

    const fadeOverlaysTimer = window.setTimeout(() => {
      setIsTransitioning(true);
    }, 1800);

    const transitionTimer = window.setTimeout(() => {
      handleFinish();
    }, 3800);

    return () => {
      window.clearTimeout(fadeOverlaysTimer);
      window.clearTimeout(transitionTimer);
    };
  }, [brandVisible, webglReady, reducedMotion, forcePlayReduced]);

  // Graceful Static Fallback (No WebGL or Reduced Motion mode)
  if (!webglReady || (reducedMotion && !forcePlayReduced)) {
    return (
      <div
        className={`fixed inset-0 z-50 flex flex-col justify-between bg-[#101820] transition-opacity duration-500 ${
          exiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <img
          src={RALLY_MEDIA.rallySocialStage}
          alt="RALLY 2026 Championship Stage"
          referrerPolicy="no-referrer"
          className="absolute inset-0 h-full w-full object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#101820] via-[#101820]/60 to-[#101820]/70" />

        <div className="relative z-10 flex items-center justify-between px-6 sm:px-10 pt-6">
          <span className="font-display text-xl font-bold tracking-[0.16em] text-white">
            RALLY <span className="text-[#A3E635]">2026</span>
          </span>
          <button
            type="button"
            onClick={handleFinish}
            className="inline-flex items-center gap-2 border border-white/20 bg-[#101820]/90 px-4 py-2 text-xs font-medium tracking-wider text-white uppercase hover:border-[#A3E635] hover:text-[#A3E635] transition-colors"
          >
            <span>Skip Intro</span>
            <SkipForward className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <p className="text-xs font-medium tracking-[0.26em] text-[#C0C0C0] uppercase">
            Men&apos;s Doubles Championship
          </p>
          <h1 className="mt-4 font-display text-6xl sm:text-8xl font-bold tracking-[0.12em] text-white">
            RALLY 2026
          </h1>
          <p className="mt-3 font-display text-2xl sm:text-3xl tracking-[0.22em] text-[#A3E635]">
            EVERY POINT MATTERS.
          </p>
          <p className="mt-6 text-sm text-[#AAB3BD] max-w-lg mx-auto">
            {reducedMotion
              ? 'Reduced motion preference detected. Enter the championship site directly or preview the 3D opening sequence.'
              : 'Interactive 3D acceleration is unavailable in this browser environment.'}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={handleFinish}
              className="inline-flex items-center gap-2 bg-[#A3E635] px-7 py-3.5 text-xs font-semibold tracking-[0.16em] text-[#101820] uppercase hover:bg-[#b5f24c] transition-colors"
            >
              <span>Enter Championship</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            {reducedMotion && webglReady && (
              <button
                type="button"
                onClick={() => setForcePlayReduced(true)}
                className="inline-flex items-center gap-2 border border-white/20 bg-[#17212B]/90 px-6 py-3.5 text-xs font-semibold tracking-[0.16em] text-white uppercase hover:border-[#A3E635] hover:text-[#A3E635] transition-colors"
              >
                <Play className="h-3.5 w-3.5" />
                <span>Play 3D Intro</span>
              </button>
            )}
          </div>
        </div>

        <div className="relative z-10 px-6 sm:px-10 pb-8 text-center text-xs text-[#AAB3BD]">
          6 Teams · 68 Players · 100-Point Elimination Format
        </div>
      </div>
    );
  }

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#0B1118] overflow-hidden transition-opacity duration-500 ${
        exiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Dedicated WebGL 3D Canvas */}
      <div className="absolute inset-0">
        <Canvas
          shadows={!isSoftwareGl}
          dpr={isSoftwareGl ? 1 : [1, 1.8]}
          camera={{ position: [0, 2.3, 4.9], fov: 40, near: 0.1, far: 100 }}
          gl={{
            antialias: !isSoftwareGl,
            powerPreference: 'high-performance',
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.12,
          }}
          onCreated={({ gl }) => {
            gl.domElement.addEventListener('webglcontextlost', (e) => {
              e.preventDefault();
              setWebglReady(false);
            });
          }}
        >
          <IntroScene
            stateRef={stateRef}
            trophyGlbUrl={trophyGlbUrl}
            isSoftwareGl={isSoftwareGl}
          />
        </Canvas>
      </div>

      {/* Top Bar: Minimal Identity & Skip Intro Control (fades out cleanly during isTransitioning) */}
      <div
        className={`relative z-10 flex items-center justify-between px-5 sm:px-10 pt-6 pointer-events-none transition-opacity duration-700 ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <div className="font-display text-lg font-bold tracking-[0.18em] text-white/90">
          RALLY <span className="text-[#A3E635]">2026</span>
        </div>
        <button
          type="button"
          onClick={handleFinish}
          className={`inline-flex items-center gap-2 border border-white/20 bg-[#101820]/90 px-4 py-2 text-xs font-medium tracking-[0.14em] text-white uppercase hover:border-[#A3E635] hover:text-[#A3E635] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A3E635] ${
            isTransitioning ? 'pointer-events-none' : 'pointer-events-auto'
          }`}
        >
          <span>Skip Intro</span>
          <SkipForward className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Scene 6: Brand Reveal Typography Overlay (fades out 2s before homepage transition) */}
      <div
        className={`pointer-events-none absolute inset-x-0 bottom-16 sm:bottom-20 z-10 px-6 text-center transition-all duration-700 ${
          brandVisible && !isTransitioning
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-6'
        }`}
      >
        <div className="mx-auto max-w-3xl bg-gradient-to-t from-[#0B1118]/90 via-[#0B1118]/55 to-transparent px-6 py-6">
          <p className="text-xs sm:text-sm font-medium tracking-[0.28em] text-[#C0C0C0] uppercase">
            MEN&apos;S DOUBLES CHAMPIONSHIP
          </p>
          <h1 className="mt-2 font-display text-6xl sm:text-8xl font-bold tracking-[0.12em] text-white leading-none">
            RALLY 2026
          </h1>
          <p className="mt-3 font-display text-xl sm:text-3xl tracking-[0.24em] text-[#A3E635]">
            EVERY POINT MATTERS.
          </p>

          <div className={`mt-6 ${brandVisible && !isTransitioning ? 'pointer-events-auto' : 'pointer-events-none'}`}>
            <button
              type="button"
              onClick={handleFinish}
              className="inline-flex items-center gap-2 bg-[#A3E635] px-7 py-3 text-xs font-semibold tracking-[0.16em] text-[#101820] uppercase hover:bg-[#b8f450] transition-colors"
            >
              <span>Enter Championship</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Minimal Progress Bar Only (chapter & percentage texts hidden) */}
      <div
        className={`pointer-events-none absolute inset-x-0 bottom-0 z-10 px-5 sm:px-10 pb-6 transition-opacity duration-700 ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <div className="h-[2px] w-full bg-white/15 overflow-hidden">
          <div
            className="h-full bg-[#A3E635] transition-transform duration-75 origin-left"
            style={{ transform: `scaleX(${Math.max(0.01, progress)})` }}
          />
        </div>
      </div>
    </div>
  );
};
