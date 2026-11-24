import React, { useEffect, useMemo } from 'react';
import * as THREE from 'three';

interface BadmintonCourtModelProps {
  linesMaterialRef?: React.RefObject<THREE.MeshStandardMaterial | null>;
  netGroupRef?: React.RefObject<THREE.Group | null>;
  ringMaterialRef?: React.RefObject<THREE.MeshBasicMaterial | null>;
}

// BWF Doubles Court Proportions: 6.1m wide (X) x 13.4m long (Z)
const COURT_W = 6.1;
const COURT_L = 13.4;
const SINGLES_W = 5.18;
const SHORT_SERVICE = 1.98;
const LONG_SERVICE_DOUBLES = COURT_L / 2 - 0.76; // 5.94 from center
const LINE_W = 0.055;

function createNetTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Crisp woven dark mesh grid
    ctx.strokeStyle = 'rgba(210, 220, 232, 0.42)';
    ctx.lineWidth = 1.6;
    const step = 12;
    for (let x = 0; x <= canvas.width; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 1);
  tex.anisotropy = 8;
  return tex;
}

export const BadmintonCourtModel: React.FC<BadmintonCourtModelProps> = ({
  linesMaterialRef,
  netGroupRef,
  ringMaterialRef,
}) => {
  const netTexture = useMemo(() => createNetTexture(), []);

  useEffect(() => {
    return () => {
      netTexture.dispose();
    };
  }, [netTexture]);

  const courtLines = useMemo(() => {
    const halfW = COURT_W / 2;
    const halfL = COURT_L / 2;
    const halfSinglesW = SINGLES_W / 2;
    const serviceLength = halfL - SHORT_SERVICE;

    return [
      // Outer doubles sidelines
      { pos: [-halfW, 0.03, 0] as [number, number, number], size: [LINE_W, COURT_L + LINE_W] as [number, number] },
      { pos: [halfW, 0.03, 0] as [number, number, number], size: [LINE_W, COURT_L + LINE_W] as [number, number] },
      // Inner singles sidelines
      { pos: [-halfSinglesW, 0.03, 0] as [number, number, number], size: [LINE_W, COURT_L] as [number, number] },
      { pos: [halfSinglesW, 0.03, 0] as [number, number, number], size: [LINE_W, COURT_L] as [number, number] },
      // Outer baselines
      { pos: [0, 0.03, -halfL] as [number, number, number], size: [COURT_W + LINE_W, LINE_W] as [number, number] },
      { pos: [0, 0.03, halfL] as [number, number, number], size: [COURT_W + LINE_W, LINE_W] as [number, number] },
      // Doubles long service lines
      { pos: [0, 0.03, -LONG_SERVICE_DOUBLES] as [number, number, number], size: [COURT_W, LINE_W] as [number, number] },
      { pos: [0, 0.03, LONG_SERVICE_DOUBLES] as [number, number, number], size: [COURT_W, LINE_W] as [number, number] },
      // Short service lines
      { pos: [0, 0.03, -SHORT_SERVICE] as [number, number, number], size: [COURT_W, LINE_W] as [number, number] },
      { pos: [0, 0.03, SHORT_SERVICE] as [number, number, number], size: [COURT_W, LINE_W] as [number, number] },
      // Center service lines (both halves)
      {
        pos: [0, 0.03, -(SHORT_SERVICE + serviceLength / 2)] as [number, number, number],
        size: [LINE_W, serviceLength] as [number, number],
      },
      {
        pos: [0, 0.03, SHORT_SERVICE + serviceLength / 2] as [number, number, number],
        size: [LINE_W, serviceLength] as [number, number],
      },
    ];
  }, []);

  return (
    <group>
      {/* Expansive dark arena floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[52, 52]} />
        <meshStandardMaterial color="#0A1016" roughness={0.82} metalness={0.14} />
      </mesh>

      {/* Tournament Court Mat Surround */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[COURT_W + 2.4, COURT_L + 2.6]} />
        <meshStandardMaterial color="#121C26" roughness={0.72} metalness={0.1} />
      </mesh>

      {/* Playable Inner Court Surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]} receiveShadow>
        <planeGeometry args={[COURT_W, COURT_L]} />
        <meshStandardMaterial color="#182532" roughness={0.66} metalness={0.08} />
      </mesh>

      {/* Progressive-Illumination Court Markings */}
      <group>
        {courtLines.map((line, i) => (
          <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={line.pos}>
            <planeGeometry args={line.size} />
            <meshStandardMaterial
              ref={i === 0 ? linesMaterialRef : undefined}
              color="#FFFFFF"
              emissive="#D9F99D"
              emissiveIntensity={0.45}
              roughness={0.35}
              transparent
              opacity={0.92}
              polygonOffset
              polygonOffsetFactor={-1}
              polygonOffsetUnits={-1}
              name="court-line-mat"
            />
          </mesh>
        ))}
      </group>

      {/* Subtle Lime-Green Center Championship Plinth Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.035, 0]}>
        <ringGeometry args={[1.08, 1.13, 64]} />
        <meshBasicMaterial
          ref={ringMaterialRef}
          color="#A3E635"
          transparent
          opacity={0.7}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Regulation Center Net Assembly */}
      <group ref={netGroupRef}>
        {/* Left & Right Metallic Net Posts */}
        {[-COURT_W / 2 - 0.08, COURT_W / 2 + 0.08].map((xPos, idx) => (
          <group key={idx} position={[xPos, 0, 0]}>
            <mesh position={[0, 0.78, 0]} castShadow>
              <cylinderGeometry args={[0.028, 0.032, 1.56, 16]} />
              <meshStandardMaterial color="#B8C2CC" metalness={0.88} roughness={0.22} />
            </mesh>
            <mesh position={[0, 0.05, 0]} castShadow>
              <boxGeometry args={[0.18, 0.1, 0.28]} />
              <meshStandardMaterial color="#1B2632" metalness={0.5} roughness={0.45} />
            </mesh>
          </group>
        ))}

        {/* Crisp White Net Top Tape */}
        <mesh position={[0, 1.52, 0]} castShadow>
          <boxGeometry args={[COURT_W + 0.16, 0.07, 0.018]} />
          <meshStandardMaterial color="#F8FAFC" roughness={0.45} metalness={0.05} />
        </mesh>

        {/* Woven Transparent Net Mesh */}
        <mesh position={[0, 1.13, 0]}>
          <planeGeometry args={[COURT_W + 0.12, 0.72]} />
          <meshStandardMaterial
            map={netTexture}
            transparent
            opacity={0.78}
            roughness={0.6}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      </group>
    </group>
  );
};
