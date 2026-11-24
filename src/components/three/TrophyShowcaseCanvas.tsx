import React, { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { RALLY_MEDIA } from '../../lib/media';
import { RallyTrophyModel } from './RallyTrophyModel';
import { StudioEnvironment } from './StudioEnvironment';
import { detectSoftwareWebGL, detectWebGLSupport, prefersReducedMotion } from './webglUtils';

interface TrophyShowcaseCanvasProps {
  trophyGlbUrl?: string | null;
  heightClass?: string;
  celebration?: boolean;
}

const RotatingTrophyStage: React.FC<{
  trophyGlbUrl?: string | null;
  autoSpin: boolean;
  celebration: boolean;
  isSoftwareGl: boolean;
}> = ({ trophyGlbUrl, autoSpin, celebration, isSoftwareGl }) => {
  const groupRef = useRef<THREE.Group | null>(null);

  useFrame((_, delta) => {
    if (groupRef.current && autoSpin) {
      groupRef.current.rotation.y += delta * (celebration ? 0.42 : 0.24);
    }
  });

  return (
    <>
      <color attach="background" args={['#0F1720']} />
      <StudioEnvironment intensity={0.95} />

      <hemisphereLight args={['#C9DCF0', '#0F1720', 0.4]} />
      <directionalLight
        position={[5, 8, 6]}
        intensity={2.4}
        color="#FFF5E8"
        castShadow={!isSoftwareGl}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0004}
      />
      <spotLight position={[-5, 7, -5]} angle={0.5} penumbra={0.65} intensity={3.2} color="#CFE2FF" />
      <pointLight
        position={[0, 1.5, 1.8]}
        intensity={celebration ? 2.4 : 1.5}
        distance={6}
        color="#A3E635"
      />

      <group ref={groupRef} position={[0, -1.65, 0]}>
        <RallyTrophyModel glbUrl={trophyGlbUrl} scale={0.96} />
      </group>

      {/* Dark Championship Floor Stage */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.66, 0]} receiveShadow>
        <circleGeometry args={[5.5, 64]} />
        <meshStandardMaterial color="#111A23" roughness={0.55} metalness={0.35} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.645, 0]}>
        <ringGeometry args={[1.15, 1.19, 64]} />
        <meshBasicMaterial color="#A3E635" transparent opacity={0.75} side={THREE.DoubleSide} />
      </mesh>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableDamping={!isSoftwareGl}
        dampingFactor={0.06}
        minPolarAngle={Math.PI * 0.26}
        maxPolarAngle={Math.PI * 0.56}
        target={[0, 0.1, 0]}
      />
    </>
  );
};

export const TrophyShowcaseCanvas: React.FC<TrophyShowcaseCanvasProps> = ({
  trophyGlbUrl,
  heightClass = 'h-[440px] sm:h-[520px]',
  celebration = false,
}) => {
  const [webglReady, setWebglReady] = useState<boolean>(() => detectWebGLSupport());
  const isSoftwareGl = useMemo(() => detectSoftwareWebGL(), []);
  const reducedMotion = useMemo(() => prefersReducedMotion(), []);

  if (!webglReady) {
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
    <div className={`relative w-full ${heightClass} overflow-hidden border border-white/10 bg-[#0F1720]`}>
      <Canvas
        shadows={!isSoftwareGl}
        dpr={isSoftwareGl ? 1 : [1, 1.8]}
        camera={{ position: [0, 0.65, 5.25], fov: 38, near: 0.1, far: 50 }}
        gl={{
          antialias: !isSoftwareGl,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
        onCreated={({ gl }) => {
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
        />
      </Canvas>
      <div className="pointer-events-none absolute bottom-4 right-5 text-[11px] tracking-[0.14em] text-[#AAB3BD] uppercase">
        Drag to rotate 360°
      </div>
    </div>
  );
};
