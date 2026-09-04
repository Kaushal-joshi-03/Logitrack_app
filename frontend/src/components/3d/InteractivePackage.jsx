import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  Float,
  RoundedBox,
  Text,
} from "@react-three/drei";
import { useRef } from "react";

function PackageModel() {
  const group = useRef();

  useFrame((state, delta) => {
  if (!group.current) return;

  // Automatic rotation
  group.current.rotation.y += delta * 0.45;

  // Small mouse interaction
  const targetX = state.pointer.y * 0.25;
  const targetY = state.pointer.x * 0.15;

  group.current.rotation.x +=
    (targetX - group.current.rotation.x) * 0.025;
});

  return (
    <Float
      speed={1.5}
      rotationIntensity={0.08}
      floatIntensity={0.55}
    >
      <group ref={group} rotation={[0, -0.35, 0]}>

        <RoundedBox
          args={[2.5, 2.5, 2.5]}
          radius={0.08}
          smoothness={5}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial
            color="#111111"
            roughness={0.48}
            metalness={0.15}
          />
        </RoundedBox>

        <mesh position={[0, 1.27, 0]}>
          <boxGeometry args={[2.55, 0.08, 0.55]} />

          <meshStandardMaterial
            color="#ef1d2f"
            emissive="#ef1d2f"
            emissiveIntensity={0.25}
          />
        </mesh>

        <Text
          position={[0, 0.15, 1.27]}
          fontSize={0.25}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          LOGITRACK
        </Text>

        <Text
          position={[0, -0.25, 1.27]}
          fontSize={0.12}
          color="#ef1d2f"
          anchorX="center"
          anchorY="middle"
        >
          PKG-10294
        </Text>

        <Text
          position={[0, -0.75, 1.27]}
          fontSize={0.16}
          color="#aaaaaa"
          anchorX="center"
          anchorY="middle"
        >
          ↑ ↑ ↑
        </Text>

      </group>
    </Float>
  );
}

export default function InteractivePackage() {
  return (
    <div className="h-full w-full">
      <Canvas
        camera={{
          position: [4.8, 3.7, 5.5],
          fov: 42,
        }}
      >
        <ambientLight intensity={0.45} />

        <directionalLight
          position={[4, 6, 5]}
          intensity={2}
        />

        <pointLight
          position={[-4, 2, 3]}
          intensity={3}
          color="#ff1f35"
        />

        <pointLight
          position={[3, -1, -3]}
          intensity={1.5}
          color="#ffffff"
        />

        <PackageModel />

        <Environment preset="city" />
      </Canvas>
    </div>
  );
}