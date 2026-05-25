// src/components/avatar/AvatarScene.jsx
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei'
import { Suspense, forwardRef, useRef, useImperativeHandle } from 'react'
import { useStore } from '../../store' // 🛠️ 전역 metrics를 실시간 구독하기 위해 Zustand 스토어 임포트
import Avatar from './Avatar'
import CaptureController from './CaptureController'

const AvatarScene = forwardRef((props, ref) => {
  const captureRef = useRef()
  
  // 🛠️ [핵심 버그 수정] Zustand 스토어에서 최신 metrics 상태를 실시간으로 리스닝합니다!
  // 슬라이더를 조작하는 순간 이 컴포넌트가 최신 수치를 감지하여 <Avatar />를 움직이게 만듭니다.
  const { metrics } = useStore()

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
        // 💡 체형 조절 시 프레임 잘림을 방지하는 전신 구도 고정
        position: [0, 1.0, 3.6], 
        fov: 35
      }}
      gl={{ preserveDrawingBuffer: true, antialias: true }}
      style={{ width: '100%', height: '100%' }}
    >
      {/* 🛠️ [배경색 복구] 칙칙한 회색빛(#a0a0a0)을 걷어내고, 미니멀하고 화사한 원본 스튜디오 배경색(#f3f4f6)으로 롤백! */}
      <color attach="background" args={['#f3f4f6']} />
      
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />

      <Suspense fallback={null}>
        <group position={[0, -0.9, 0]}> 
          {/* 🛠️ [실시간 연동] <Avatar /> 컴포넌트에 최신 metrics 상태값을 다이렉트로 주입합니다.
              이제 키(height) 슬라이더를 밀면 아바타가 실시간으로 슥슥 반응하여 움직입니다! */}
          <Avatar metrics={metrics} />
          
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