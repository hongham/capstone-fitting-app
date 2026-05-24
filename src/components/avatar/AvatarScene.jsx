import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei'
import { Suspense, forwardRef, useRef, useImperativeHandle } from 'react'
// 💡 [중요] 반드시 분리된 파일인 Avatar 컴포넌트를 정확히 임포트해야 합니다.
import Avatar from './Avatar'
import CaptureController from './CaptureController'

const AvatarScene = forwardRef((props, ref) => {
  const captureRef = useRef()

  // AI 피팅용 사진 캡처 함수 동기화
  useImperativeHandle(ref, () => ({
    capture: () => {
      return captureRef.current?.capture();
    },
  }))

  return (
    <Canvas
      shadows
      camera={{ 
        // 💡 뚱뚱한 체형 조절 시 프레임 잘림을 방지하는 전신 구도 마지노선 고정
        position: [0, 1.0, 3.6], 
        fov: 55
      }}
      gl={{ preserveDrawingBuffer: true, antialias: true }}
      style={{ width: '100%', height: '100%' }}
    >
      {/* 흰색 옷 피팅 시 배경 빛이 번지는 억까를 막기 위해 배경 톤다운 */}
      <color attach="background" args={['#a0a0a0']} />
      
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />

      <Suspense fallback={null}>
        <group position={[0, -0.9, 0]}> 
          {/* 🛠️ [여기가 정답 위치]
            Avatar 컴포넌트가 <Canvas> 내부에 안전하게 들어가 있어야 
            useGLTF나 셰이프 키 연동 훅들이 오류 없이 작동합니다.
          */}
          <Avatar />
          
          <ContactShadows opacity={0.4} scale={10} blur={2} far={4.5} />
        </group>
      </Suspense>

      <Environment preset="city" />

      <OrbitControls 
        target={[0, 1.0, 0]} 
        enableDamping={true}
        minDistance={1.2}
        maxDistance={4}
      />

      <CaptureController ref={captureRef} />
    </Canvas>
  )
})

AvatarScene.displayName = 'AvatarScene'
export default AvatarScene