import React, { Suspense, useEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface RallyTrophyModelProps {
  /** Optional path to a Blender-generated GLB model to replace the procedural trophy later */
  glbUrl?: string | null;
  scale?: number;
  position?: [number, number, number];
}

function createEngravingTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    // Dark brushed metallic charcoal plate
    ctx.fillStyle = '#18222D';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Fine horizontal brushed grain
    ctx.strokeStyle = 'rgba(255,255,255,0.035)';
    ctx.lineWidth = 1;
    for (let y = 0; y < canvas.height; y += 3) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Crisp silver border lines
    ctx.fillStyle = '#C0C0C0';
    ctx.fillRect(0, 18, canvas.width, 4);
    ctx.fillRect(0, canvas.height - 22, canvas.width, 4);

    // Subtle lime hairline center accent
    ctx.fillStyle = '#A3E635';
    ctx.fillRect(canvas.width * 0.36, 174, canvas.width * 0.28, 3);

    // Engraved RALLY 2026 title
    ctx.fillStyle = '#F1F5F9';
    ctx.font = '700 84px Oswald, Impact, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('RALLY 2026', canvas.width / 2, 108);

    // Engraved tagline
    ctx.fillStyle = '#C0C0C0';
    ctx.font = '600 24px Inter, sans-serif';
    ctx.fillText('EVERY POINT MATTERS.', canvas.width / 2, 206);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

const GlbTrophyAdapter: React.FC<{ url: string }> = ({ url }) => {
  const gltf = useGLTF(url);
  return <primitive object={gltf.scene} />;
};

class TrophyModelBoundary extends React.Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { fallback: React.ReactNode; children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

const ProceduralRallyTrophy: React.FC = () => {
  const engravingTexture = useMemo(() => createEngravingTexture(), []);

  useEffect(() => {
    return () => {
      engravingTexture.dispose();
    };
  }, [engravingTexture]);

  const geometries = useMemo(() => {
    // 1. Stepped circular obsidian-steel base via LatheGeometry (sits flush at y = 0)
    const baseProfile = [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(0.95, 0),
      new THREE.Vector2(0.95, 0.12),
      new THREE.Vector2(0.86, 0.16),
      new THREE.Vector2(0.84, 0.56),
      new THREE.Vector2(0.76, 0.62),
      new THREE.Vector2(0.72, 0.68),
      new THREE.Vector2(0, 0.68),
    ];
    const basePlinth = new THREE.LatheGeometry(baseProfile, 64);

    // 2. Curved front-facing metallic nameplate arc
    const plaque = new THREE.CylinderGeometry(
      0.858,
      0.866,
      0.34,
      36,
      1,
      true,
      -Math.PI * 0.34,
      Math.PI * 0.68
    );

    // 3. Recessed lime-green light collar inset on upper plinth
    const limeRing = new THREE.TorusGeometry(0.77, 0.018, 12, 64);

    // 4. Sculpted fluted silver pedestal stem (LatheGeometry)
    const stemProfile = [
      new THREE.Vector2(0.46, 0.68),
      new THREE.Vector2(0.42, 0.78),
      new THREE.Vector2(0.24, 1.08),
      new THREE.Vector2(0.16, 1.48),
      new THREE.Vector2(0.19, 1.82),
      new THREE.Vector2(0.32, 2.08),
      new THREE.Vector2(0.26, 2.18),
      new THREE.Vector2(0, 2.18),
    ];
    const stem = new THREE.LatheGeometry(stemProfile, 48);

    // 5. Two elegant sweeping structures inspired by badminton rackets
    const createRacketArc = (mirror: number) => {
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(mirror * 0.17, 1.05, 0),
        new THREE.Vector3(mirror * 0.52, 1.52, mirror * 0.14),
        new THREE.Vector3(mirror * 0.94, 2.22, mirror * 0.08),
        new THREE.Vector3(mirror * 0.78, 3.02, -mirror * 0.06),
        new THREE.Vector3(mirror * 0.34, 3.36, -mirror * 0.04),
        new THREE.Vector3(mirror * 0.12, 3.16, 0),
        new THREE.Vector3(mirror * 0.28, 2.52, mirror * 0.06),
        new THREE.Vector3(mirror * 0.19, 1.82, 0),
      ]);
      return new THREE.TubeGeometry(curve, 72, 0.052, 16, false);
    };
    const arcLeft = createRacketArc(-1);
    const arcRight = createRacketArc(1);

    // Secondary delicate inner silver contour line echoing racket frame
    const createInnerArc = (mirror: number) => {
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(mirror * 0.34, 1.82, mirror * 0.04),
        new THREE.Vector3(mirror * 0.74, 2.34, mirror * 0.06),
        new THREE.Vector3(mirror * 0.64, 2.86, -mirror * 0.04),
        new THREE.Vector3(mirror * 0.34, 3.12, -mirror * 0.02),
      ]);
      return new THREE.TubeGeometry(curve, 44, 0.018, 10, false);
    };
    const innerArcLeft = createInnerArc(-1);
    const innerArcRight = createInnerArc(1);

    // 6. Shuttlecock-inspired crown blades (12 flared architectural metallic petals)
    const bladeShape = new THREE.Shape();
    bladeShape.moveTo(0, 0);
    bladeShape.quadraticCurveTo(0.08, 0.25, 0.065, 0.68);
    bladeShape.lineTo(0, 0.84);
    bladeShape.lineTo(-0.065, 0.68);
    bladeShape.quadraticCurveTo(-0.08, 0.25, 0, 0);

    const crownBlade = new THREE.ExtrudeGeometry(bladeShape, {
      depth: 0.022,
      bevelEnabled: true,
      bevelThickness: 0.008,
      bevelSize: 0.008,
      bevelSegments: 2,
    });
    crownBlade.translate(0, 0, -0.011);

    // Crown collar ring
    const crownCollar = new THREE.TorusGeometry(0.24, 0.028, 12, 48);

    // Crown luminous accent halo
    const crownLimeHalo = new THREE.TorusGeometry(0.27, 0.011, 10, 48);

    // Central polished championship sphere jewel (representing shuttlecock cork)
    const crownCore = new THREE.SphereGeometry(0.21, 32, 32);

    return {
      basePlinth,
      plaque,
      limeRing,
      stem,
      arcLeft,
      arcRight,
      innerArcLeft,
      innerArcRight,
      crownBlade,
      crownCollar,
      crownLimeHalo,
      crownCore,
    };
  }, []);

  const materials = useMemo(() => {
    return {
      obsidianBase: new THREE.MeshPhysicalMaterial({
        color: '#17212B',
        metalness: 0.72,
        roughness: 0.34,
        clearcoat: 0.45,
        clearcoatRoughness: 0.22,
      }),
      silverPolished: new THREE.MeshPhysicalMaterial({
        color: '#E5EAF0',
        metalness: 0.96,
        roughness: 0.14,
        clearcoat: 0.8,
        clearcoatRoughness: 0.1,
      }),
      silverBrushed: new THREE.MeshPhysicalMaterial({
        color: '#C8D0DA',
        metalness: 0.92,
        roughness: 0.26,
        anisotropy: 0.65,
      }),
      limeAccent: new THREE.MeshStandardMaterial({
        color: '#A3E635',
        emissive: '#A3E635',
        emissiveIntensity: 1.55,
        roughness: 0.2,
        metalness: 0.1,
      }),
      plaqueMat: new THREE.MeshStandardMaterial({
        map: engravingTexture,
        metalness: 0.55,
        roughness: 0.32,
      }),
    };
  }, [engravingTexture]);

  const crownBladeAngles = useMemo(
    () => Array.from({ length: 12 }, (_, idx) => (idx / 12) * Math.PI * 2),
    []
  );

  return (
    <group>
      {/* Circular Premium Base */}
      <mesh geometry={geometries.basePlinth} material={materials.obsidianBase} castShadow receiveShadow />

      {/* Base Lower Metallic Rim Trim */}
      <mesh position={[0, 0.125, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.935, 0.014, 10, 64]} />
        <primitive object={materials.silverBrushed} attach="material" />
      </mesh>

      {/* Engraved RALLY 2026 Front Nameplate */}
      <mesh geometry={geometries.plaque} material={materials.plaqueMat} position={[0, 0.36, 0]} />

      {/* Subtle Lime-Green Plinth Illumination Ring */}
      <mesh
        geometry={geometries.limeRing}
        material={materials.limeAccent}
        position={[0, 0.635, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      />

      {/* Sculpted Metallic Silver Stem */}
      <mesh geometry={geometries.stem} material={materials.silverPolished} castShadow receiveShadow />

      {/* Two Sweeping Racket-Inspired Sculptural Arcs */}
      <mesh geometry={geometries.arcLeft} material={materials.silverPolished} castShadow />
      <mesh geometry={geometries.arcRight} material={materials.silverPolished} castShadow />
      <mesh geometry={geometries.innerArcLeft} material={materials.silverBrushed} />
      <mesh geometry={geometries.innerArcRight} material={materials.silverBrushed} />

      {/* Shuttlecock-Inspired Metallic Crown */}
      <group position={[0, 2.26, 0]}>
        <mesh
          geometry={geometries.crownCollar}
          material={materials.silverBrushed}
          rotation={[Math.PI / 2, 0, 0]}
        />
        <mesh
          geometry={geometries.crownLimeHalo}
          material={materials.limeAccent}
          position={[0, 0.1, 0]}
          rotation={[Math.PI / 2, 0, 0]}
        />
        <mesh
          geometry={geometries.crownCore}
          material={materials.silverPolished}
          position={[0, 0.16, 0]}
          castShadow
        />

        {/* 12 Flared Metallic Shuttlecock Crown Blades */}
        {crownBladeAngles.map((theta, idx) => (
          <group key={idx} rotation={[0, theta, 0]}>
            <group position={[0.16, 0.14, 0]} rotation={[0, 0.18, -0.34]}>
              <mesh
                geometry={geometries.crownBlade}
                material={idx % 2 === 0 ? materials.silverPolished : materials.silverBrushed}
                rotation={[0, Math.PI / 2, 0]}
                castShadow
              />
            </group>
          </group>
        ))}
      </group>
    </group>
  );
};

export const RallyTrophyModel: React.FC<RallyTrophyModelProps> = ({
  glbUrl,
  scale = 1,
  position = [0, 0, 0],
}) => {
  return (
    <group position={position} scale={scale}>
      {glbUrl ? (
        <TrophyModelBoundary fallback={<ProceduralRallyTrophy />}>
          <Suspense fallback={<ProceduralRallyTrophy />}>
            <GlbTrophyAdapter url={glbUrl} />
          </Suspense>
        </TrophyModelBoundary>
      ) : (
        <ProceduralRallyTrophy />
      )}
    </group>
  );
};
