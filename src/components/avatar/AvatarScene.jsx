import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Suspense, forwardRef, useRef, useImperativeHandle } from 'react'
import Avatar from './Avatar'
import CaptureController from './CaptureController'

/**
 * AvatarScene
 *
 * Props:
 *   - metrics: { height, weight, chest, waist, hip }
 *   - pose: string ('idle' | 'tpose' | 'walking' | ...)
 *
 * Ref methods:
 *   - capture(): string (base64 PNG)
 */
const AvatarScene = forwardRef(({ metrics, pose }, ref) => {
  const captureRef = useRef()

  // 외부 ref → 내부 captureRef로 위임
  useImperativeHandle(ref, () => ({
    capture: () => captureRef.current?.capture(),
  }))

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      style={{ width: '100%', height: '100%' }}
      camera={{ position: [0, 1.5, 3], fov: 50 }}
      gl={{ preserveDrawingBuffer: true }}  // 캡처 위해 필수
    >
      <color attach="background" args={['#f3f4f6']} />

      {/* 조명 */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <directionalLight position={[-5, 3, 2]} intensity={0.3} />
      <directionalLight position={[0, 5, -5]} intensity={0.4} />

      {/* 바닥 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#e5e7eb" />
      </mesh>

      {/* 아바타 */}
      <Suspense fallback={null}>
        <Avatar metrics={metrics} pose={pose} />
      </Suspense>

      {/* 마우스 컨트롤 */}
      <OrbitControls target={[0, 1, 0]} enablePan={false} minDistance={1.8} maxDistance={5} />

      {/* 캡처 컨트롤러 (내부 전용) */}
      <CaptureController ref={captureRef} />
    </Canvas>
  )
})

AvatarScene.displayName = 'AvatarScene'

export default AvatarScene
