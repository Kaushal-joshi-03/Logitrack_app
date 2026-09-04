import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox, Text } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

const CHECKPOINTS = [
  { cam: [0, 1.8, 5.0], look: [0, 0.2, 0] },
  { cam: [1.5, 1.6, 4.2], look: [1.0, 0.2, 0] },
  { cam: [3.5, 1.8, 3.8], look: [3.0, 0.2, 0] },
  { cam: [5.5, 2.0, 3.5], look: [5.0, 0.2, 0] },
  { cam: [7.5, 1.7, 3.8], look: [7.0, 0.2, 0] },
  { cam: [9.5, 1.8, 4.0], look: [9.0, 0.2, 0] },
];

// The route now starts further to the left of the world origin so the
// truck begins loading above the hero CTA button instead of dead-center
// under the crosshair the camera first looks at.
const ROUTE_POINTS = [
  [-3.2, 0, 0],
  [0, 0, 0],
  [3.0, 0, 0],
  [6.5, 0, 0],
  [10.0, 0, 0],
  [13.5, 0, 0],
];

function catmull(points) {
  return new THREE.CatmullRomCurve3(
    points.map((p) => new THREE.Vector3(...p)),
    false,
    "catmullrom",
    0.5
  );
}

function sampleCheckpoints(t, key) {
  const n = CHECKPOINTS.length;
  const scaled = Math.min(0.999, Math.max(0, t)) * (n - 1);
  const i = Math.floor(scaled);
  const f = scaled - i;
  const a = CHECKPOINTS[i][key];
  const b = CHECKPOINTS[Math.min(i + 1, n - 1)][key];
  return [
    a[0] + (b[0] - a[0]) * f,
    a[1] + (b[1] - a[1]) * f,
    a[2] + (b[2] - a[2]) * f,
  ];
}

function CameraRig({ progressRef, reducedMotion }) {
  const targetPos = useRef(new THREE.Vector3(...CHECKPOINTS[0].cam));
  const targetLook = useRef(new THREE.Vector3(...CHECKPOINTS[0].look));
  const currentLook = useRef(new THREE.Vector3(...CHECKPOINTS[0].look));

  useFrame(({ camera, pointer }, delta) => {
    const t = progressRef.current || 0;
    const camXYZ = sampleCheckpoints(t, "cam");
    const lookXYZ = sampleCheckpoints(t, "look");
    targetPos.current.set(...camXYZ);
    targetLook.current.set(...lookXYZ);

    const px = reducedMotion ? 0 : pointer.x * 0.25;
    const py = reducedMotion ? 0 : pointer.y * 0.15;

    const smoothing = reducedMotion ? 1 : Math.min(1, delta * 1.5);
    camera.position.lerp(
      new THREE.Vector3(
        targetPos.current.x + px,
        targetPos.current.y + py,
        targetPos.current.z
      ),
      smoothing
    );
    currentLook.current.lerp(targetLook.current, smoothing);
    camera.lookAt(currentLook.current);
  });

  return null;
}

function FlatRoad({ curve }) {
  const roadGeometry = useMemo(() => {
    const points = curve.getPoints(100);
    const maxWidth = 1.4;
    const minWidth = 0.35;
    const vertices = [];
    const indices = [];
    const uvs = [];

    points.forEach((p, i) => {
      // Taper the road so it's narrow where it starts and where it ends,
      // and widens naturally through the middle of the journey — like a
      // real road narrowing into the distance instead of a constant-width
      // ribbon.
      const tNorm = i / (points.length - 1);
      const taper = Math.sin(Math.PI * tNorm); // 0 at both ends, 1 at the middle
      const halfWidth = (minWidth + (maxWidth - minWidth) * taper) / 2;

      vertices.push(p.x, p.y - 0.44, p.z - halfWidth);
      vertices.push(p.x, p.y - 0.44, p.z + halfWidth);

      uvs.push(0, i / points.length);
      uvs.push(1, i / points.length);

      if (i < points.length - 1) {
        const base = i * 2;
        indices.push(base, base + 1, base + 2);
        indices.push(base + 1, base + 3, base + 2);
      }
    });

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geom.setIndex(indices);
    geom.computeVertexNormals();
    return geom;
  }, [curve]);

  return (
    <mesh geometry={roadGeometry} receiveShadow>
      <meshStandardMaterial color="#1a1c23" roughness={0.9} metalness={0.1} side={THREE.DoubleSide} />
    </mesh>
  );
}

function TruckWithMainBox({ curve, progressRef, scale = 0.4 }) {
  const group = useRef();
  const boxRef = useRef();
  const wheels = useRef([]);

  useFrame((_, delta) => {
    if (!group.current) return;
    const t = progressRef.current || 0;

    const loadThreshold = 0.25;

    if (t <= loadThreshold) {
      const startPos = curve.getPointAt(0);
      group.current.position.copy(startPos);
      group.current.rotation.set(0, 0, 0);
      group.current.scale.setScalar(scale);

      if (boxRef.current) {
        const loadProgress = t / loadThreshold;
        const boxLocalStart = new THREE.Vector3(0, 2.2, -0.35);
        const boxLocalEnd = new THREE.Vector3(0, 0.42, -0.35);
        boxRef.current.position.lerpVectors(boxLocalStart, boxLocalEnd, loadProgress);
      }
    } else {
      const travelProgress = (t - loadThreshold) / (1 - loadThreshold);
      const localT = Math.min(0.995, Math.max(0, travelProgress));
      
      const pos = curve.getPointAt(localT);
      const nextPos = curve.getPointAt(Math.min(0.999, localT + 0.02));
      
      group.current.position.lerp(pos, Math.min(1, delta * 6));

      const dx = nextPos.x - pos.x;
      const dz = nextPos.z - pos.z;
      if (Math.abs(dx) > 0.001 || Math.abs(dz) > 0.001) {
        const targetAngle = Math.atan2(dx, dz);
        let currentRotationY = group.current.rotation.y;
        const diff = Math.atan2(Math.sin(targetAngle - currentRotationY), Math.cos(targetAngle - currentRotationY));
        group.current.rotation.y += diff * Math.min(1, delta * 5);
      }

      group.current.rotation.x = 0;
      group.current.rotation.z = 0;

      const edge = Math.min(1, Math.min((1 - t) / 0.08, 1));
      group.current.scale.setScalar(scale * Math.max(0.2, edge));

      if (boxRef.current) {
        boxRef.current.position.set(0, 0.42, -0.35);
      }

      wheels.current.forEach((w) => {
        if (w) w.rotation.x += delta * 14;
      });
    }
  });

  return (
    <group ref={group}>
      {/* Main Brown Box Parcel loaded inside the truck */}
      <group ref={boxRef} position={[0, 2.2, -0.35]}>
        <RoundedBox args={[0.95, 0.85, 1.3]} radius={0.06} smoothness={2} castShadow>
          <meshStandardMaterial color="#b87d4b" roughness={0.7} metalness={0.05} />
        </RoundedBox>
        <mesh position={[0, 0.44, 0]}>
          <boxGeometry args={[0.98, 0.06, 0.2]} />
          <meshStandardMaterial color="#8a5a36" roughness={0.6} />
        </mesh>
      </group>

      {/* Truck Cargo Container with LOGITRACK Branding */}
      <group position={[0, 0.42, -0.35]}>
        <RoundedBox args={[1.0, 0.9, 1.35]} radius={0.06} smoothness={2} castShadow>
          <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.1} />
        </RoundedBox>
        
        <mesh position={[-0.51, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[1.2, 0.5]} />
          <meshStandardMaterial color="#dc2626" roughness={0.2} />
        </mesh>

        <mesh position={[0.51, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[1.2, 0.5]} />
          <meshStandardMaterial color="#dc2626" roughness={0.2} />
        </mesh>

        {/* LOGITRACK branding printed on both container side panels */}
        <Text
          position={[-0.515, 0, 0]}
          rotation={[0, -Math.PI / 2, 0]}
          fontSize={0.16}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.03}
        >
          LOGITRACK
        </Text>

        <Text
          position={[0.515, 0, 0]}
          rotation={[0, Math.PI / 2, 0]}
          fontSize={0.16}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.03}
        >
          LOGITRACK
        </Text>
      </group>

      {/* Truck Cab */}
      <mesh position={[0, 0.2, 0.72]} castShadow>
        <boxGeometry args={[0.85, 0.62, 0.68]} />
        <meshStandardMaterial color="#1e293b" roughness={0.4} metalness={0.3} />
      </mesh>

      {/* Windshield */}
      <mesh position={[0, 0.28, 1.05]}>
        <boxGeometry args={[0.72, 0.32, 0.04]} />
        <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.5} />
      </mesh>

      {/* Chassis */}
      <mesh position={[0, -0.16, -0.1]}>
        <boxGeometry args={[0.8, 0.12, 2.15]} />
        <meshStandardMaterial color="#0f172a" roughness={0.6} />
      </mesh>

      {/* Wheels */}
      {[
        [-0.44, -0.42, 0.68],
        [0.44, -0.42, 0.68],
        [-0.44, -0.42, -0.55],
        [0.44, -0.42, -0.55],
      ].map((p, i) => (
        <mesh
          key={i}
          ref={(el) => (wheels.current[i] = el)}
          position={p}
          rotation={[0, 0, Math.PI / 2]}
          castShadow
        >
          <cylinderGeometry args={[0.2, 0.2, 0.18, 16]} />
          <meshStandardMaterial color="#050505" roughness={0.8} />
        </mesh>
      ))}

      {/* Headlights */}
      {[0.32, -0.32].map((x, i) => (
        <mesh key={i} position={[x, 0.08, 1.07]}>
          <boxGeometry args={[0.12, 0.08, 0.03]} />
          <meshStandardMaterial
            color="#ffeec2"
            emissive="#ffeec2"
            emissiveIntensity={1.3}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function SceneContents({ progressRef, isMobile, reducedMotion }) {
  const routeCurve = useMemo(() => catmull(ROUTE_POINTS), []);

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[4, 6, 5]} intensity={1.5} />
      <pointLight position={[-4, 2, -3]} intensity={2.0} color="#dc2626" />
      <pointLight position={[3, -1, -8]} intensity={1.0} color="#ffffff" />

      <CameraRig progressRef={progressRef} reducedMotion={reducedMotion} />

      {/* Flat Horizontal Road Path */}
      <FlatRoad curve={routeCurve} />

      {/* Truck with Main Brown Box Parcel Loading & Driving Animation */}
      <TruckWithMainBox curve={routeCurve} progressRef={progressRef} scale={0.4} />
    </>
  );
}

export default function ScrollLogisticsScene({
  progressRef,
  isMobile = false,
  reducedMotion = false,
}) {
  return (
    <Canvas
      dpr={isMobile ? [1, 1.3] : [1, 1.8]}
      gl={{ antialias: !isMobile, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: CHECKPOINTS[0].cam, fov: 45 }}
      style={{ pointerEvents: "none" }}
    >
      <Suspense fallback={null}>
        <SceneContents
          progressRef={progressRef}
          isMobile={isMobile}
          reducedMotion={reducedMotion}
        />
      </Suspense>
    </Canvas>
  );
}