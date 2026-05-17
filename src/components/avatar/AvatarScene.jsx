import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Suspense, forwardRef, useRef, useImperativeHandle } from 'react'
import Avatar from './Avatar'
import CaptureController from './CaptureController'

// gender props 추가
const AvatarScene = forwardRef(({ metrics, pose, gender = 'female' }, ref) => {
  const captureRef = useRef()

  useImperativeHandle(ref, () => ({
    capture: () => {
      return captureRef.current?.capture();
    },
  }))

  const modelUrl = gender === 'male' ? '/avatars/male.glb' : '/avatars/female.glb';

  return (
    <Canvas
      camera={{ position: [0, 1.2, 2.5], fov: 45 }}
      gl={{ preserveDrawingBuffer: true, antialias: true }}
      className="w-full h-full"
    >
      <color attach="background" args={['#ffffff']} />
      <ambientLight intensity={1.5} /> 
      <directionalLight position={[5, 5, 5]} intensity={2.0} />

      <Suspense fallback={null}>
        {/* gender={gender} 를 꼭 적어줘야 합니다! */}
        {metrics && (
          <Avatar 
            url={modelUrl} 
            metrics={metrics} 
            pose={pose} 
            gender={gender} 
          />
        )}
      </Suspense>

      <OrbitControls target={[0, 1, 0]} enableDamping={true} />
      <CaptureController ref={captureRef} />
    </Canvas>
  )
})

AvatarScene.displayName = 'AvatarScene'
export default AvatarScene