import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei'
import { Suspense, forwardRef, useRef, useImperativeHandle } from 'react'
import Avatar from './Avatar'
import CaptureController from './CaptureController'

const AvatarScene = forwardRef(({ metrics, pose, gender = 'male' }, ref) => {
  const captureRef = useRef()

  // AI 피팅용 사진 캡처 함수
  useImperativeHandle(ref, () => ({
    capture: () => {
      return captureRef.current?.capture();
    },
  }))

  // 일단 테스트를 위해 gender와 상관없이 무조건 고친 'male.glb'를 바라보게 하거나,
  // 여성을 선택해도 male.glb가 뜨도록 임시로 묶어둘 수 있습니다.
  // 여기서는 안전하게 male.glb로 고정해서 테스트하는 것을 추천합니다.
  const modelUrl = '/avatars/male.glb'; 

  return (
    <Canvas
      shadows
      camera={{ 
        // 아바타가 이제 중앙에 있으니 카메라 위치도 정중앙(X=0)에서 바라봅니다.
        position: [0, 1.2, 4.5], // Z축을 2.2로 살짝 당겨서 아바타가 화면에 더 꽉 차게 만듭니다.
        fov: 70
      }}
      gl={{ preserveDrawingBuffer: true, antialias: true }}
      style={{ width: '100%', height: '100%' }}
    >
      {/* AI가 아바타 외곽선을 칼같이 따낼 수 있도록 깔끔한 배경색 설정 */}
      <color attach="background" args={['#f8f9fa']} />
      
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />

      <Suspense fallback={null}>
        {/* [핵심 수정] 아까 2.45 같은 보정값 다 지우고 다시 X축을 '0'으로 만듭니다!
            Y축(-0.9)은 아바타 발바닥을 그리드 바닥에 딱 붙여주는 높이 조절용입니다. */}
        <group position={[0, -0.9, 0]}> 
          {metrics && (
            <Avatar 
              url={modelUrl} 
              metrics={metrics} 
              pose={pose} 
              gender={gender} 
            />
          )}
          {/* 바닥 그림자가 예쁘게 져야 AI가 인물이 붕 떠 있다고 착각하지 않습니다 */}
          <ContactShadows opacity={0.4} scale={10} blur={2} far={4.5} />
        </group>
      </Suspense>

      <Environment preset="city" />

      <OrbitControls 
        // 카메라가 아바타의 가슴/배 주변(Y=1.0)을 정확히 조준하고 회전하게 합니다.
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