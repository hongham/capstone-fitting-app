import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Suspense, forwardRef, useRef, useImperativeHandle } from 'react'
import Avatar from './Avatar'
import CaptureController from './CaptureController'

const AvatarScene = forwardRef(({ metrics, pose }, ref) => {
  const captureRef = useRef()

  // 캡처 기능 위임
  useImperativeHandle(ref, () => ({
    capture: () => captureRef.current?.capture(),
  }))

  return (
    <Canvas
      camera={{ position: [0, 1.5, 3], fov: 50 }}
      gl={{ 
        preserveDrawingBuffer: true, // 캡처 시 이미지 데이터 보존
        antialias: true 
      }}
      className="w-full h-full"
    >
      {/* 1. 배경을 순수 흰색으로 고정 (AI 인식률 급상승) */}
      <color attach="background" args={['#ffffff']} />

      {/* 2. 조명 강화 (아바타가 선명해야 AI가 옷을 잘 입힘) */}
      <ambientLight intensity={1.5} /> 
      <directionalLight position={[5, 5, 5]} intensity={2.0} />
      <directionalLight position={[-5, 3, 2]} intensity={1.0} />
      <pointLight position={[0, 2, 2]} intensity={1.0} />

      {/* 3. 바닥 제거 (바닥 그림자나 색상이 AI 방해 요소가 될 수 있음) */}

      <Suspense fallback={null}>
        {/* metrics가 있을 때만 아바타 렌더링 */}
        {metrics && <Avatar metrics={metrics} pose={pose} />}
      </Suspense>

      <OrbitControls target={[0, 1, 0]} />

      {/* 캡처 컨트롤러 */}
      <CaptureController ref={captureRef} />
    </Canvas>
  )
})

AvatarScene.displayName = 'AvatarScene'
export default AvatarScene