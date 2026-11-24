import React, { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

interface StudioEnvironmentProps {
  intensity?: number;
}

export const StudioEnvironment: React.FC<StudioEnvironmentProps> = ({ intensity = 0.85 }) => {
  const { gl, scene } = useThree();

  useEffect(() => {
    const pmremGenerator = new THREE.PMREMGenerator(gl);
    pmremGenerator.compileEquirectangularShader();

    const roomEnv = new RoomEnvironment();
    const renderTarget = pmremGenerator.fromScene(roomEnv, 0.04);

    scene.environment = renderTarget.texture;
    scene.environmentIntensity = intensity;

    return () => {
      scene.environment = null;
      renderTarget.dispose();
      roomEnv.dispose();
      pmremGenerator.dispose();
    };
  }, [gl, scene, intensity]);

  return null;
};
