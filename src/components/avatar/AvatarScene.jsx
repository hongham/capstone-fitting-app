import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Suspense, forwardRef, useRef, useImperativeHandle } from 'react'
import Avatar from './Avatar'
import CaptureController from './CaptureController'

const AvatarScene = forwardRef(({ metrics, pose }, ref) => {
  const captureRef = useRef()

  useImperativeHandle(ref, () => ({
    capture: () => {
      return captureRef.current?.capture();
    },
  }))

  return (
    <Canvas
      camera={{ position: [0, 1.5, 2.5], fov: 50 }}
      gl={{ 
        preserveDrawingBuffer: true, 
        antialias: true 
      }}
      className="w-full h-full"
    >
      {/* 배경을 흰색으로 두어 인물 실루엣을 명확히 함 */}
      <color attach="background" args={['#ffffff']} />

      {/* 부드러운 조명으로 모델링의 거친 단면을 보완 */}
      <ambientLight intensity={1.2} /> 
      <directionalLight position={[5, 5, 5]} intensity={1.5} />
      <directionalLight position={[-5, 3, 2]} intensity={0.8} />

      <Suspense fallback={null}>
        {metrics && <Avatar metrics={metrics} pose={pose} />}
      </Suspense>

      <OrbitControls target={[0, 1, 0]} enableDamping={true} />

      <CaptureController ref={captureRef} />
    </Canvas>
  )
})

AvatarScene.displayName = 'AvatarScene'
export default AvatarScene