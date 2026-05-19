import React, { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { Box3, Vector3 } from 'three'
import { useStore } from '../../store'

const TARGET_MODEL_HEIGHT = 3.2

function clamp01(value) {
  return Math.max(0, Math.min(value, 1))
}

export default function Avatar({ url, metrics, pose, gender: genderProp }) {
  const groupRef = useRef()
  const { scene } = useGLTF(url)
  const storeGender = useStore((state) => state.gender)
  const gender = genderProp || storeGender

  const bodyMesh = useMemo(() => {
    let foundMesh = null;
    scene.traverse((node) => {
      if (node.isMesh && node.morphTargetDictionary) foundMesh = node;
    });
    return foundMesh;
  }, [scene])

  // 모델 파일의 원점이 조금 달라도 화면 중앙/바닥에 맞춰 안정적으로 배치한다.
  useLayoutEffect(() => {
    if (!scene || !groupRef.current || !metrics.height) return

    scene.updateMatrixWorld(true)
    const box = new Box3().setFromObject(scene)
    if (box.isEmpty()) return

    const center = box.getCenter(new Vector3())
    const size = box.getSize(new Vector3())
    const baseHeight = gender === 'male' ? 175 : 160
    const heightRatio = metrics.height / baseHeight
    const fitScale = size.y > 0 ? TARGET_MODEL_HEIGHT / size.y : 1
    const widthScale = fitScale * (1 + (heightRatio - 1) * 0.3)
    const heightScale = fitScale * heightRatio

    groupRef.current.scale.set(widthScale, heightScale, widthScale)
    groupRef.current.position.set(
      -center.x * widthScale,
      -box.min.y * heightScale,
      -center.z * widthScale,
    )
  }, [scene, metrics.height, gender])

  // 2. 셰이프키 조절 (어깨 가동 범위 확장)
  useEffect(() => {
    if (!bodyMesh || !metrics) return
    const dict = bodyMesh.morphTargetDictionary
    const influences = bodyMesh.morphTargetInfluences

    Object.keys(dict).forEach((key) => {
      const trimmedKey = key.trim();
      const index = dict[key];

      // 어깨 (기준: 남 45 / 여 38)
      // 분모를 15로 설정하여 45+15=60cm 일 때 최대 벌어짐이 되게 수정
      const baseShoulder = gender === 'male' ? 45 : 38;
      if (trimmedKey === 'shoulder_wide') {
        influences[index] = metrics.shoulder > baseShoulder ? clamp01((metrics.shoulder - baseShoulder) / 15) : 0;
      }
      if (trimmedKey === 'shoulder_narrow') {
        influences[index] = metrics.shoulder < baseShoulder ? clamp01((baseShoulder - metrics.shoulder) / 15) : 0;
      }

      // 가슴/허리/골반 (이 부위들도 변화가 너무 일찍 멈추면 분모 숫자를 더 키우면 됩니다)
      if (trimmedKey === 'chest_large') influences[index] = metrics.chest > 90 ? clamp01((metrics.chest - 90) / 15) : 0;
      if (trimmedKey === 'chest_small') influences[index] = metrics.chest < 85 ? clamp01((85 - metrics.chest) / 15) : 0;
      if (trimmedKey === 'waist_large') influences[index] = metrics.waist > 80 ? clamp01((metrics.waist - 80) / 15) : 0;
      if (trimmedKey === 'waist_small') influences[index] = metrics.waist < 75 ? clamp01((75 - metrics.waist) / 15) : 0;
      if (trimmedKey === 'hip_large') influences[index] = metrics.hip > 95 ? clamp01((metrics.hip - 95) / 15) : 0;
      if (trimmedKey === 'hip_small') influences[index] = metrics.hip < 90 ? clamp01((90 - metrics.hip) / 15) : 0;
    })
  }, [metrics, bodyMesh, gender])

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  )
}

useGLTF.preload('/avatars/female.glb')
useGLTF.preload('/avatars/male.glb')
