import { useGLTF } from '@react-three/drei'
import { useEffect, useLayoutEffect, useRef } from 'react'
import { Box3, Vector3 } from 'three'
import { applyMetrics } from './applyMetrics'
import { findBone } from './boneMap'
import { getPosePreset } from './poses'

/**
 * Avatar
 * - GLB 파일을 로드하고 신체지수에 따라 본을 변형
 *
 * 1주차 확인:
 *   1. public/avatars/male.glb 파일을 로드한다.
 *   2. 브라우저 콘솔에서 본 구조를 확인한다.
 *   3. 실제 본 이름이 다르면 boneMap.js를 업데이트한다.
 */
const GLB_PATH = '/avatars/male.glb'
const TARGET_HEIGHT = 1.7

export default function Avatar({ metrics, pose }) {
  const groupRef = useRef()
  const poseGroupRef = useRef()
  const initialBoneRotationsRef = useRef(new Map())
  const { scene } = useGLTF(GLB_PATH)

  // GLB 원점과 크기가 제각각일 수 있으므로 화면 중앙에 맞춘다.
  useLayoutEffect(() => {
    if (!scene || !groupRef.current) return

    scene.updateMatrixWorld(true)
    const box = new Box3().setFromObject(scene)
    if (box.isEmpty()) return

    const center = box.getCenter(new Vector3())
    const size = box.getSize(new Vector3())
    const fitScale = size.y > 0 ? TARGET_HEIGHT / size.y : 1

    groupRef.current.scale.setScalar(fitScale)
    groupRef.current.position.set(
      -center.x * fitScale,
      -box.min.y * fitScale,
      -center.z * fitScale,
    )
  }, [scene])

  // 본 구조 디버깅 (1주차 - 한 번 실행해서 본 이름 확인)
  useEffect(() => {
    if (!scene) return
    console.log('=== Avatar bones ===')
    let boneCount = 0
    const initialRotations = new Map()
    scene.traverse((obj) => {
      if (obj.isBone) {
        boneCount += 1
        initialRotations.set(obj, obj.rotation.clone())
        console.log(`Bone: ${obj.name}`)
      }
    })
    initialBoneRotationsRef.current = initialRotations
    if (boneCount === 0) {
      console.warn('No bones found in male.glb. Body scaling and pose animation need a rigged GLB.')
    }
  }, [scene])

  // 신체지수 적용
  useEffect(() => {
    if (scene && metrics) {
      applyMetrics(scene, metrics)
    }
  }, [scene, metrics])

  // 포즈 적용 (2주차에 구현)
  useEffect(() => {
    if (!scene) return

    const preset = getPosePreset(pose)
    const fallback = preset.fallback || {}
    const fallbackRotation = fallback.rotation || [0, 0, 0]
    const fallbackPosition = fallback.position || [0, 0, 0]

    if (poseGroupRef.current) {
      poseGroupRef.current.rotation.set(...fallbackRotation)
      poseGroupRef.current.position.set(...fallbackPosition)
    }

    initialBoneRotationsRef.current.forEach((rotation, bone) => {
      bone.rotation.copy(rotation)
    })

    Object.entries(preset.boneRotations || {}).forEach(([boneKey, rotation]) => {
      const bone = findBone(scene, boneKey)
      if (bone) {
        bone.rotation.set(...rotation)
      }
    })
  }, [scene, pose])

  return (
    <group ref={groupRef}>
      <group ref={poseGroupRef}>
        <primitive object={scene} />
      </group>
    </group>
  )
}

// 미리 로딩으로 성능 향상
useGLTF.preload(GLB_PATH)
