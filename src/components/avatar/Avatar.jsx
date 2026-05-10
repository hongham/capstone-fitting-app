import { useGLTF } from '@react-three/drei'
import { useEffect } from 'react'
import { applyMetrics } from './applyMetrics'

/**
 * Avatar
 * - GLB 파일을 로드하고 신체지수에 따라 본을 변형
 *
 * TODO (1주차):
 *   1. public/avatars/ 에 male.glb, female.glb 다운로드
 *   2. 아래 GLB_PATH를 실제 파일 경로로 변경
 *   3. 본 구조 console.log로 확인 후 boneMap.js 업데이트
 */
const GLB_PATH = '/avatars/male.glb'  // 임시 경로

export default function Avatar({ metrics, pose }) {
  const { scene } = useGLTF(GLB_PATH)

  // 본 구조 디버깅 (1주차 - 한 번 실행해서 본 이름 확인)
  useEffect(() => {
    if (!scene) return
    console.log('=== Avatar bones ===')
    scene.traverse((obj) => {
      if (obj.isBone) {
        console.log(`Bone: ${obj.name}`)
      }
    })
  }, [scene])

  // 신체지수 적용
  useEffect(() => {
    if (scene && metrics) {
      applyMetrics(scene, metrics)
    }
  }, [scene, metrics])

  // 포즈 적용 (2주차에 구현)
  useEffect(() => {
    // TODO: useAnimations 사용하여 포즈 적용
    // 자세한 코드는 가이드 9.3 참고
  }, [pose])

  return <primitive object={scene} />
}

// 미리 로딩으로 성능 향상
useGLTF.preload(GLB_PATH)
