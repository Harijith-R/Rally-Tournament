import React, { useMemo } from 'react';
import * as THREE from 'three';

interface ShuttlecockModelProps {
  scale?: number;
  trailOpacity?: number;
  trailRef?: React.RefObject<THREE.Mesh | null>;
}

const FEATHER_COUNT = 16;

export const ShuttlecockModel: React.FC<ShuttlecockModelProps> = ({
  scale = 1,
  trailOpacity = 0,
  trailRef,
}) => {
  const {
    corkGeo,
    featherVaneGeo,
    quillGeo,
    bandGeo,
    ringLowerGeo,
    ringUpperGeo,
    trailGeo,
    feathers,
  } = useMemo(() => {
    // 1. Hemispherical cork base profile via LatheGeometry
    const corkPoints: THREE.Vector2[] = [];
    const domeSteps = 14;
    const radius = 0.24;
    for (let i = 0; i <= domeSteps; i++) {
      const t = i / domeSteps;
      const angle = (t * Math.PI) / 2;
      corkPoints.push(new THREE.Vector2(Math.sin(angle) * radius, (1 - Math.cos(angle)) * radius));
    }
    corkPoints.push(new THREE.Vector2(radius * 0.96, radius + 0.16));
    corkPoints.push(new THREE.Vector2(radius * 0.88, radius + 0.2));
    corkPoints.push(new THREE.Vector2(0, radius + 0.2));
    const cork = new THREE.LatheGeometry(corkPoints, 32);

    // 2. Custom sculpted goose feather vane shape
    const vaneShape = new THREE.Shape();
    vaneShape.moveTo(0, 0.34);
    vaneShape.quadraticCurveTo(0.085, 0.56, 0.098, 0.92);
    vaneShape.quadraticCurveTo(0.072, 1.07, 0.015, 1.11);
    vaneShape.quadraticCurveTo(-0.045, 1.07, -0.072, 0.92);
    vaneShape.quadraticCurveTo(-0.058, 0.56, 0, 0.34);

    const vane = new THREE.ExtrudeGeometry(vaneShape, {
      depth: 0.008,
      bevelEnabled: false,
      curveSegments: 8,
    });
    vane.translate(0, 0, -0.004);

    // 3. Tapered feather quill/stem
    const quill = new THREE.CylinderGeometry(0.007, 0.012, 1.06, 6);
    quill.translate(0, 0.53, 0);

    // 4. Cork collar accent band
    const band = new THREE.CylinderGeometry(radius * 0.985, radius * 1.005, 0.065, 32, 1, true);

    // 5. Twin braided binding rings around feather stems
    const rLower = new THREE.TorusGeometry(0.285, 0.011, 8, 36);
    const rUpper = new THREE.TorusGeometry(0.375, 0.01, 8, 36);

    // 6. Aerodynamic lime-green slipstream trail ribbon (extends behind feathers along +Y)
    const trailCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 1.0, 0),
      new THREE.Vector3(0.06, 2.2, 0.04),
      new THREE.Vector3(-0.04, 3.8, -0.03),
      new THREE.Vector3(0, 5.8, 0),
    ]);
    const trail = new THREE.TubeGeometry(trailCurve, 28, 0.045, 8, false);

    // Precompute radial transforms for 16 overlapping goose feathers
    const featherList = Array.from({ length: FEATHER_COUNT }, (_, idx) => {
      const theta = (idx / FEATHER_COUNT) * Math.PI * 2;
      return { idx, theta };
    });

    return {
      corkGeo: cork,
      featherVaneGeo: vane,
      quillGeo: quill,
      bandGeo: band,
      ringLowerGeo: rLower,
      ringUpperGeo: rUpper,
      trailGeo: trail,
      feathers: featherList,
    };
  }, []);

  // Materials with realistic roughness separation
  const materials = useMemo(() => {
    return {
      cork: new THREE.MeshStandardMaterial({
        color: '#F4F2EC',
        roughness: 0.62,
        metalness: 0.04,
      }),
      collarDark: new THREE.MeshStandardMaterial({
        color: '#141D26',
        roughness: 0.35,
        metalness: 0.45,
        side: THREE.DoubleSide,
      }),
      collarLime: new THREE.MeshStandardMaterial({
        color: '#A3E635',
        emissive: '#A3E635',
        emissiveIntensity: 0.65,
        roughness: 0.25,
        metalness: 0.3,
        side: THREE.DoubleSide,
      }),
      feather: new THREE.MeshPhysicalMaterial({
        color: '#F8FAFC',
        roughness: 0.42,
        metalness: 0.02,
        sheen: 0.65,
        sheenRoughness: 0.55,
        sheenColor: new THREE.Color('#DCE6F0'),
        side: THREE.DoubleSide,
      }),
      quill: new THREE.MeshStandardMaterial({
        color: '#E6E2D5',
        roughness: 0.55,
        metalness: 0.05,
      }),
      thread: new THREE.MeshStandardMaterial({
        color: '#C9D2DC',
        roughness: 0.72,
        metalness: 0.1,
      }),
      trail: new THREE.MeshBasicMaterial({
        color: '#A3E635',
        transparent: true,
        opacity: trailOpacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    };
  }, [trailOpacity]);

  return (
    <group scale={scale}>
      {/* Center geometry around cork/skirt balance point */}
      <group position={[0, -0.58, 0]}>
        {/* Cork Base */}
        <mesh geometry={corkGeo} material={materials.cork} castShadow receiveShadow />

        {/* Collar Band + Subtle Championship Lime Stripe */}
        <mesh geometry={bandGeo} material={materials.collarDark} position={[0, 0.34, 0]} />
        <mesh
          geometry={bandGeo}
          material={materials.collarLime}
          position={[0, 0.378, 0]}
          scale={[1.005, 0.22, 1.005]}
        />

        {/* Binding Rings */}
        <mesh
          geometry={ringLowerGeo}
          material={materials.thread}
          position={[0, 0.56, 0]}
          rotation={[Math.PI / 2, 0, 0]}
        />
        <mesh
          geometry={ringUpperGeo}
          material={materials.thread}
          position={[0, 0.78, 0]}
          rotation={[Math.PI / 2, 0, 0]}
        />

        {/* 16 Overlapping Goose Feathers */}
        {feathers.map(({ idx, theta }) => (
          <group key={idx} rotation={[0, theta, 0]}>
            <group position={[0.19, 0.35, 0]} rotation={[0, 0.16, -0.35]}>
              <mesh geometry={quillGeo} material={materials.quill} castShadow />
              <mesh
                geometry={featherVaneGeo}
                material={materials.feather}
                rotation={[0, Math.PI / 2, 0]}
                castShadow
              />
            </group>
          </group>
        ))}

        {/* Dynamic Lime Slipstream Trail (controlled during Acceleration scene) */}
        <mesh ref={trailRef} geometry={trailGeo} material={materials.trail} />
      </group>
    </group>
  );
};
