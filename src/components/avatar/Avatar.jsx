import React, { useEffect, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { useStore } from '../../store'

export default function Avatar({ url, metrics, pose }) {
  const { scene } = useGLTF(url)
  const gender = useStore((state) => state.gender)

  const bodyMesh = useMemo(() => {
    let foundMesh = null;
    scene.traverse((node) => {
      if (node.isMesh && node.morphTargetDictionary) foundMesh = node;
    });
    return foundMesh;
  }, [scene])

  // 1. 키 조절 (스케일)
  useEffect(() => {
    if (!scene || !metrics.height) return
    const baseHeight = gender === 'male' ? 175 : 160;
    const ratio = metrics.height / baseHeight;
    // Y축(키) 변화를 정직하게 적용
    scene.scale.set(1 + (ratio - 1) * 0.3, ratio, 1 + (ratio - 1) * 0.3);
  }, [metrics.height, scene, gender])

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
        influences[index] = metrics.shoulder > baseShoulder ? Math.min((metrics.shoulder - baseShoulder) / 15, 1) : 0;
      }
      if (trimmedKey === 'shoulder_narrow') {
        influences[index] = metrics.shoulder < baseShoulder ? Math.min((baseShoulder - metrics.shoulder) / 15, 1) : 0;
      }

      // 가슴/허리/골반 (이 부위들도 변화가 너무 일찍 멈추면 분모 숫자를 더 키우면 됩니다)
      if (trimmedKey === 'chest_large') influences[index] = metrics.chest > 90 ? (metrics.chest - 90) / 15 : 0;
      if (trimmedKey === 'chest_small') influences[index] = metrics.chest < 85 ? (85 - metrics.chest) / 15 : 0;
      if (trimmedKey === 'waist_large') influences[index] = metrics.waist > 80 ? (metrics.waist - 80) / 15 : 0;
      if (trimmedKey === 'waist_small') influences[index] = metrics.waist < 75 ? (75 - metrics.waist) / 15 : 0;
      if (trimmedKey === 'hip_large') influences[index] = metrics.hip > 95 ? (metrics.hip - 95) / 15 : 0;
      if (trimmedKey === 'hip_small') influences[index] = metrics.hip < 90 ? (90 - metrics.hip) / 15 : 0;
    })
  }, [metrics, bodyMesh, gender])

  return <primitive object={scene} />
}

useGLTF.preload('/avatars/female.glb')
useGLTF.preload('/avatars/male.glb')