import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import gsap from 'gsap';
import * as THREE from 'three';
import { RALLY_MEDIA } from '../../lib/media';
import { RallyTrophyModel } from './RallyTrophyModel';
import { StudioEnvironment } from './StudioEnvironment';
import { detectSoftwareWebGL, detectWebGLSupport, prefersReducedMotion } from './webglUtils';

const _camRight = new THREE.Vector3();
const _camUp = new THREE.Vector3();
const _camForward = new THREE.Vector3();
const _desiredLightPos = new THREE.Vector3();
const _desiredSpotPos = new THREE.Vector3();
const _desiredSpotTarget = new THREE.Vector3();

interface PointerSpotlightState {
  x: number;
  y: number;
  hovered: boolean;
}

interface ViewportPointerState {
  x: number;
  y: number;
  active: boolean;
}

interface TrophyShowcaseCanvasProps {
  trophyGlbUrl?: string | null;
  heightClass?: string;
  celebration?: boolean;
  /** 'hero' renders a seamless transparent interactive 3D trophy directly over the hero arena backdrop */
  variant?: 'stage' | 'hero';
  /** Enables a cinematic shadow-casting SpotLight that tracks mouse movement across the entire viewport */
  trackViewportSpotlight?: boolean;
  /** Optional world-space [x, y, z] position for the 3D trophy plinth base */
  trophyPosition?: [number, number, number];
  /** Enables a subtle GSAP vertical float animation while the user hovers over the trophy container */
  enableHoverFloat?: boolean;
}

const RotatingTrophyStage: React.FC<{
  trophyGlbUrl?: string | null;
  autoSpin: boolean;
  celebration: boolean;
  isSoftwareGl: boolean;
  isHero: boolean;
  trackViewportSpotlight: boolean;
  enableHoverFloat: boolean;
  isContainerHovered: boolean;
  reducedMotion: boolean;
  trophyPosition: [number, number, number];
  isInteractingRef: React.RefObject<boolean>;
  pointerRef: React.RefObject<PointerSpotlightState>;
  viewportPointerRef: React.RefObject<ViewportPointerState>;
}> = ({
  trophyGlbUrl,
  autoSpin,
  celebration,
  isSoftwareGl,
  isHero,
  trackViewportSpotlight,
  enableHoverFloat,
  isContainerHovered,
  reducedMotion,
  trophyPosition,
  isInteractingRef,
  pointerRef,
  viewportPointerRef,
}) => {
  const groupRef = useRef<THREE.Group | null>(null);
  const floatGroupRef = useRef<THREE.Group | null>(null);
  const cursorLightRef = useRef<THREE.PointLight | null>(null);
  const trackingSpotRef = useRef<THREE.SpotLight | null>(null);
  const spotTarget = useMemo(() => new THREE.Object3D(), []);
  const [trophyX, trophyY, trophyZ] = trophyPosition;
  const trophyScale = isHero ? 0.88 : 0.96;
  const trophyCenterY = trophyY + 1.65 * trophyScale;

  useEffect(() => {
    spotTarget.position.set(trophyX, trophyCenterY, trophyZ);
    spotTarget.updateMatrixWorld();
  }, [spotTarget, trophyX, trophyCenterY, trophyZ]);

  useEffect(() => {
    const floatGroup = floatGroupRef.current;
    if (!floatGroup) return;

    gsap.killTweensOf(floatGroup.position);

    if (!enableHoverFloat || reducedMotion) {
      floatGroup.position.y = 0;
      return;
    }

    if (isContainerHovered) {
      const tl = gsap.timeline();
      tl.to(floatGroup.position, {
        y: 0.14,
        duration: 0.55,
        ease: 'power2.out',
      }).to(floatGroup.position, {
        y: 0.06,
        duration: 1.35,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });

      return () => {
        tl.kill();
      };
    }

    const settleTween = gsap.to(floatGroup.position, {
      y: 0,
      duration: 0.65,
      ease: 'power3.out',
    });

    return () => {
      settleTween.kill();
    };
  }, [isContainerHovered, enableHoverFloat, reducedMotion]);

  useFrame(({ camera }, delta) => {
    const dt = Math.min(delta, 0.1);

    if (groupRef.current && autoSpin && !isInteractingRef.current) {
      groupRef.current.rotation.y += dt * (celebration ? 0.42 : isHero ? 0.32 : 0.24);
    }

    _camRight.set(1, 0, 0).applyQuaternion(camera.quaternion).normalize();
    _camUp.set(0, 1, 0).applyQuaternion(camera.quaternion).normalize();
    _camForward.set(0, 0, -1).applyQuaternion(camera.quaternion).normalize();

    // 1. Viewport-tracking cinematic SpotLight casting soft shadows & specular highlights
    const spot = trackingSpotRef.current;
    const vp = viewportPointerRef.current;
    if (spot && vp) {
      const vx = trackViewportSpotlight && vp.active ? vp.x : 0.35;
      const vy = trackViewportSpotlight && vp.active ? vp.y : 0.45;
      const clampedRadial = Math.min(1, vx * vx);
      const spotFrontStandoff = 4.45 - 0.65 * clampedRadial;

      _desiredSpotPos
        .set(trophyX, trophyCenterY, trophyZ)
        .addScaledVector(_camForward, -spotFrontStandoff)
        .addScaledVector(_camRight, vx * 4.2)
        .addScaledVector(_camUp, 1.85 + vy * 2.05);

      _desiredSpotTarget
        .set(trophyX, trophyCenterY, trophyZ)
        .addScaledVector(_camRight, vx * 0.22)
        .addScaledVector(_camUp, vy * 0.32);

      const spotLambda = vp.active ? 5.8 : 2.6;
      spot.position.x = THREE.MathUtils.damp(spot.position.x, _desiredSpotPos.x, spotLambda, dt);
      spot.position.y = THREE.MathUtils.damp(spot.position.y, _desiredSpotPos.y, spotLambda, dt);
      spot.position.z = THREE.MathUtils.damp(spot.position.z, _desiredSpotPos.z, spotLambda, dt);

      spotTarget.position.x = THREE.MathUtils.damp(
        spotTarget.position.x,
        _desiredSpotTarget.x,
        spotLambda,
        dt
      );
      spotTarget.position.y = THREE.MathUtils.damp(
        spotTarget.position.y,
        _desiredSpotTarget.y,
        spotLambda,
        dt
      );
      spotTarget.position.z = THREE.MathUtils.damp(
        spotTarget.position.z,
        _desiredSpotTarget.z,
        spotLambda,
        dt
      );
      spotTarget.updateMatrixWorld();

      const targetSpotIntensity =
        trackViewportSpotlight && vp.active ? (isHero ? 72 : 64) : isHero ? 48 : 42;
      spot.intensity = THREE.MathUtils.damp(spot.intensity, targetSpotIntensity, 4.5, dt);
    }

    // 2. Close-range hover PointLight for fine metallic surface shimmer directly under the cursor
    const light = cursorLightRef.current;
    const pointer = pointerRef.current;
    if (light && pointer) {
      const nx = pointer.hovered ? pointer.x : 0.38;
      const ny = pointer.hovered ? pointer.y : 0.42;
      const radialSq = Math.min(1, nx * nx + ny * ny);
      const frontStandoff = pointer.hovered ? 2.35 - 0.35 * radialSq : 2.55;

      _desiredLightPos
        .set(trophyX, trophyCenterY, trophyZ)
        .addScaledVector(_camForward, -frontStandoff)
        .addScaledVector(_camRight, nx * 2.25)
        .addScaledVector(_camUp, ny * 2.1);

      const posLambda = pointer.hovered ? 7.5 : 3.2;
      light.position.x = THREE.MathUtils.damp(light.position.x, _desiredLightPos.x, posLambda, dt);
      light.position.y = THREE.MathUtils.damp(light.position.y, _desiredLightPos.y, posLambda, dt);
      light.position.z = THREE.MathUtils.damp(light.position.z, _desiredLightPos.z, posLambda, dt);

      const targetIntensity = pointer.hovered ? (isHero ? 8.2 : 7.4) : isHero ? 1.8 : 1.5;
      light.intensity = THREE.MathUtils.damp(light.intensity, targetIntensity, 5.5, dt);
    }
  });

  return (
    <>
      {!isHero && <color attach="background" args={['#0F1720']} />}
      <StudioEnvironment intensity={isHero ? 0.95 : 0.85} />

      <hemisphereLight args={['#D6E6F7', '#0F1720', isHero ? 0.42 : 0.35]} />
      <directionalLight
        position={[5, 8, 6]}
        intensity={isHero ? 1.35 : 1.5}
        color="#FFF5E8"
      />
      <spotLight
        position={[-5, 7, -5]}
        angle={0.5}
        penumbra={0.65}
        intensity={isHero ? 3.2 : 2.8}
        color="#CFE2FF"
      />
      <pointLight
        position={[trophyX, trophyY + 3.0, trophyZ + 1.8]}
        intensity={celebration ? 2.4 : isHero ? 1.6 : 1.4}
        distance={6}
        color="#A3E635"
      />

      {/* Cinematic viewport-tracking SpotLight casting soft shadows and metallic specular highlights */}
      <primitive object={spotTarget} />
      <spotLight
        ref={trackingSpotRef}
        target={spotTarget}
        position={[trophyX + 1.5, trophyCenterY + 2.7, trophyZ + 4.4]}
        angle={0.56}
        penumbra={0.82}
        intensity={isHero ? 48 : 42}
        distance={16}
        decay={2}
        color="#FFFDF8"
        castShadow={!isSoftwareGl}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={1}
        shadow-camera-far={16}
        shadow-camera-fov={44}
        shadow-bias={-0.00035}
        shadow-normalBias={0.025}
        shadow-radius={4}
      />

      {/* Soft dynamic cursor-tracking PointLight to graze and highlight metallic silver surfaces */}
      <pointLight
        ref={cursorLightRef}
        position={[trophyX + 0.9, trophyCenterY + 0.9, trophyZ + 2.4]}
        intensity={isHero ? 1.8 : 1.5}
        distance={8.5}
        decay={2}
        color="#F7FAFF"
      />

      <group ref={groupRef} position={[trophyX, trophyY, trophyZ]}>
        <group ref={floatGroupRef}>
          <RallyTrophyModel glbUrl={trophyGlbUrl} scale={trophyScale} />
        </group>
      </group>

      {isHero ? (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[trophyX, trophyY - 0.005, trophyZ]} receiveShadow>
          <circleGeometry args={[3.4, 48]} />
          <shadowMaterial transparent opacity={0.34} color="#060A0E" />
        </mesh>
      ) : (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[trophyX, trophyY - 0.01, trophyZ]} receiveShadow>
          <circleGeometry args={[5.5, 64]} />
          <meshStandardMaterial color="#111A23" roughness={0.55} metalness={0.35} />
        </mesh>
      )}

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[trophyX, trophyY + 0.01, trophyZ]}>
        <ringGeometry args={[isHero ? 0.98 : 1.04, isHero ? 1.03 : 1.09, 64]} />
        <meshBasicMaterial
          color="#A3E635"
          transparent
          opacity={isHero ? 0.65 : 0.75}
          side={THREE.DoubleSide}
        />
      </mesh>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableDamping={!isSoftwareGl}
        dampingFactor={0.07}
        rotateSpeed={0.85}
        minPolarAngle={isHero ? Math.PI * 0.2 : Math.PI * 0.26}
        maxPolarAngle={isHero ? Math.PI * 0.62 : Math.PI * 0.56}
        target={[trophyX, isHero ? 0.15 : 0.1, trophyZ]}
        onStart={() => {
          if (isInteractingRef.current !== null) {
            isInteractingRef.current = true;
          }
        }}
        onEnd={() => {
          if (isInteractingRef.current !== null) {
            isInteractingRef.current = false;
          }
        }}
      />
    </>
  );
};

export const TrophyShowcaseCanvas: React.FC<TrophyShowcaseCanvasProps> = ({
  trophyGlbUrl,
  heightClass = 'h-[440px] sm:h-[520px]',
  celebration = false,
  variant = 'stage',
  trackViewportSpotlight,
  trophyPosition,
  enableHoverFloat = false,
}) => {
  const [webglReady, setWebglReady] = useState<boolean>(() => detectWebGLSupport());
  const [isContainerHovered, setIsContainerHovered] = useState<boolean>(false);
  const isSoftwareGl = useMemo(() => detectSoftwareWebGL(), []);
  const reducedMotion = useMemo(() => prefersReducedMotion(), []);
  const isInteractingRef = useRef<boolean>(false);
  const pointerRef = useRef<PointerSpotlightState>({ x: 0.38, y: 0.42, hovered: false });
  const viewportPointerRef = useRef<ViewportPointerState>({ x: 0.35, y: 0.45, active: false });
  const isHero = variant === 'hero';
  const viewportTrackingEnabled = trackViewportSpotlight ?? isHero;
  const resolvedTrophyPosition: [number, number, number] =
    trophyPosition ?? (isHero ? [0, -1.02, -0.35] : [0, -1.65, 0]);

  useEffect(() => {
    if (!viewportTrackingEnabled) return;

    const handleWindowPointerMove = (e: PointerEvent) => {
      if (window.innerWidth === 0 || window.innerHeight === 0) return;
      const vx = (e.clientX / window.innerWidth) * 2 - 1;
      const vy = -((e.clientY / window.innerHeight) * 2 - 1);
      viewportPointerRef.current.x = Math.max(-1, Math.min(1, vx));
      viewportPointerRef.current.y = Math.max(-1, Math.min(1, vy));
      viewportPointerRef.current.active = true;
    };

    const handleDocumentMouseLeave = () => {
      viewportPointerRef.current.active = false;
    };

    window.addEventListener('pointermove', handleWindowPointerMove, { passive: true });
    document.addEventListener('mouseleave', handleDocumentMouseLeave);
    return () => {
      window.removeEventListener('pointermove', handleWindowPointerMove);
      document.removeEventListener('mouseleave', handleDocumentMouseLeave);
    };
  }, [viewportTrackingEnabled]);

  const handlePointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsContainerHovered(true);
    handlePointerUpdate(e);
  };

  const handlePointerUpdate = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    pointerRef.current.x = Math.max(-1, Math.min(1, x));
    pointerRef.current.y = Math.max(-1, Math.min(1, y));
    pointerRef.current.hovered = true;
  };

  const handlePointerLeave = () => {
    setIsContainerHovered(false);
    pointerRef.current.hovered = false;
  };

  if (!webglReady) {
    if (isHero) {
      return (
        <div className={`relative w-full ${heightClass} overflow-hidden`}>
          <img
            src={RALLY_MEDIA.rallySocialStage}
            alt="RALLY 2026 Official Championship Trophy"
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#101820] via-transparent to-transparent" />
        </div>
      );
    }

    return (
      <div className={`relative w-full ${heightClass} overflow-hidden border border-white/10 bg-[#101820]`}>
        <img
          src={RALLY_MEDIA.rallySocialStage}
          alt="RALLY 2026 Official Championship Trophy Stage"
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#101820] via-transparent to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 text-center">
          <p className="font-display text-xl tracking-[0.16em] text-white uppercase">
            Original RALLY 2026 Championship Trophy
          </p>
          <p className="mt-1 text-xs text-[#AAB3BD]">
            Sculpted metallic silver · Sweeping racket arcs · Shuttlecock crown
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerUpdate}
      onPointerLeave={handlePointerLeave}
      className={`relative w-full ${heightClass} overflow-hidden cursor-grab active:cursor-grabbing select-none ${
        isHero ? 'bg-transparent' : 'border border-white/10 bg-[#0F1720]'
      }`}
      aria-label="Interactive 3D RALLY 2026 Championship Trophy — move cursor to illuminate and drag to rotate"
    >
      <Canvas
        shadows={isSoftwareGl ? false : 'soft'}
        dpr={isSoftwareGl ? 1 : [1, 1.8]}
        camera={{
          position: isHero ? [0, 0.55, 6.2] : [0, 0.65, 5.25],
          fov: 38,
          near: 0.1,
          far: 50,
        }}
        gl={{
          alpha: isHero,
          antialias: !isSoftwareGl,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
        onCreated={({ gl }) => {
          if (isHero) {
            gl.setClearColor(0x000000, 0);
          }
          gl.domElement.addEventListener('webglcontextlost', (e) => {
            e.preventDefault();
            setWebglReady(false);
          });
        }}
      >
        <RotatingTrophyStage
          trophyGlbUrl={trophyGlbUrl}
          autoSpin={!reducedMotion && !isSoftwareGl}
          celebration={celebration}
          isSoftwareGl={isSoftwareGl}
          isHero={isHero}
          trackViewportSpotlight={viewportTrackingEnabled}
          enableHoverFloat={enableHoverFloat}
          isContainerHovered={isContainerHovered}
          reducedMotion={reducedMotion}
          trophyPosition={resolvedTrophyPosition}
          isInteractingRef={isInteractingRef}
          pointerRef={pointerRef}
          viewportPointerRef={viewportPointerRef}
        />
      </Canvas>
      <div
        className={`pointer-events-none absolute text-[11px] tracking-[0.16em] text-[#AAB3BD] uppercase ${
          isHero ? 'bottom-1.5 left-0' : 'bottom-4 right-5'
        }`}
      >
        Drag to rotate 360°
      </div>
    </div>
  );
};
