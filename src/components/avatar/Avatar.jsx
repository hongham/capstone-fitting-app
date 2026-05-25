// src/components/avatar/Avatar.jsx
import React, { useEffect, useRef } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { useStore } from '../../store'

export default function Avatar() {
  const group = useRef()
  const gender = useStore((state) => state.gender)
  const metrics = useStore((state) => state.metrics)
  const currentPose = useStore((state) => state.currentPose)

  // 정적 자산 경로 지정 (/avatars/)
  const modelUrl = gender === 'female' ? '/avatars/female.glb' : '/avatars/male.glb'
  
  // 💡 [치트키 1] 복사(Clone) 과정에서 꼬이는 문제를 막기 위해 useGLTF 원본 scene을 직접 가져옵니다.
  const { scene, animations } = useGLTF(modelUrl)
  const { actions } = useAnimations(animations, scene)

  // 1. 🛠️ [키 조절 락 완전히 분쇄] 
  // 리액트 useMemo의 캐싱 억까를 우회하기 위해, metrics.height가 바뀔 때마다 
  // 3D 씬의 루트 스케일(Y축)을 강제로 다이렉트 타격하여 늘리고 줄입니다.
  useEffect(() => {
    if (!scene || !metrics.height) return
    
    const baseHeight = gender === 'male' ? 175 : 160
    const ratio = metrics.height / baseHeight
    
    console.log(`📏 [3D 스케일 강제 주입] 기준키: ${baseHeight}cm ➡️ 현재키: ${metrics.height}cm ➡️ 비율: ${ratio}`)
    
    // Y축(키)만 조절하여 실시간으로 메쉬를 늘려버립니다.
    scene.scale.set(1, ratio, 1)
  }, [metrics.height, scene, gender])

  // 2. 셰이프 키 (Morph Targets) 실시간 매핑 로직
  useEffect(() => {
    if (!scene || !metrics) return

    const STANDARD = { shoulder: 45, chest: 95, waist: 85, hip: 95 }

    scene.traverse((child) => {
      if (child.isMesh && child.morphTargetDictionary) {
        const dict = child.morphTargetDictionary

        // 1) 어깨 조절
        if (metrics.shoulder !== undefined) {
          if (metrics.shoulder >= STANDARD.shoulder) {
            const v = Math.min((metrics.shoulder - STANDARD.shoulder) / (60 - STANDARD.shoulder), 1)
            if (dict['shoulder_wide'] !== undefined) child.morphTargetInfluences[dict['shoulder_wide']] = v
            if (dict['shoulder_narrow'] !== undefined) child.morphTargetInfluences[dict['shoulder_narrow']] = 0
          } else {
            const v = Math.min((STANDARD.shoulder - metrics.shoulder) / (STANDARD.shoulder - 30), 1)
            if (dict['shoulder_narrow'] !== undefined) child.morphTargetInfluences[dict['shoulder_narrow']] = v
            if (dict['shoulder_wide'] !== undefined) child.morphTargetInfluences[dict['shoulder_wide']] = 0
          }
        }

        // 2) 가슴 조절
        if (metrics.chest !== undefined) {
          if (metrics.chest >= STANDARD.chest) {
            const v = Math.min((metrics.chest - STANDARD.chest) / (120 - STANDARD.chest), 1)
            if (dict['chest_large'] !== undefined) child.morphTargetInfluences[dict['chest_large']] = v
            if (dict['chest_small'] !== undefined) child.morphTargetInfluences[dict['chest_small']] = 0
          } else {
            const v = Math.min((STANDARD.chest - metrics.chest) / (STANDARD.chest - 70), 1)
            if (dict['chest_small'] !== undefined) child.morphTargetInfluences[dict['chest_small']] = v
            if (dict['chest_large'] !== undefined) child.morphTargetInfluences[dict['chest_large']] = 0
          }
        }

        // 3) 허리 조절
        if (metrics.waist !== undefined) {
          if (metrics.waist >= STANDARD.waist) {
            const v = Math.min((metrics.waist - STANDARD.waist) / (110 - STANDARD.waist), 1)
            if (dict['waist_large'] !== undefined) child.morphTargetInfluences[dict['waist_large']] = v
            if (dict['waist_small'] !== undefined) child.morphTargetInfluences[dict['waist_small']] = 0
          } else {
            const v = Math.min((STANDARD.waist - metrics.waist) / (STANDARD.waist - 60), 1)
            if (dict['waist_small'] !== undefined) child.morphTargetInfluences[dict['waist_small']] = v
            if (dict['waist_large'] !== undefined) child.morphTargetInfluences[dict['waist_large']] = 0
          }
        }

        // 4) 엉덩이 조절
        if (metrics.hip !== undefined) {
          if (metrics.hip >= STANDARD.hip) {
            const v = Math.min((metrics.hip - STANDARD.hip) / (120 - STANDARD.hip), 1)
            if (dict['hip_large'] !== undefined) child.morphTargetInfluences[dict['hip_large']] = v
            if (dict['hip_small'] !== undefined) child.morphTargetInfluences[dict['hip_small']] = 0
          } else {
            const v = Math.min((STANDARD.hip - metrics.hip) / (STANDARD.hip - 70), 1)
            if (dict['hip_small'] !== undefined) child.morphTargetInfluences[dict['hip_small']] = v
            if (dict['hip_large'] !== undefined) child.morphTargetInfluences[dict['hip_large']] = 0
          }
        }
      }
    })
  }, [metrics, scene])

  // 3. 애니메이션 제어
  useEffect(() => {
    if (!actions) return
    Object.values(actions).forEach((action) => action?.fadeOut(0.3))

    if (actions[currentPose]) {
      actions[currentPose].reset().fadeIn(0.3).play()
    } else if (actions['idle']) {
      actions['idle'].reset().fadeIn(0.3).play()
    }
  }, [currentPose, actions])

  // 🛠️ [치트키 2] 슬라이더를 조작할 때마다 Three.js가 렌더링 변화를 강제로 인지하도록 
  // primitive 컴포넌트의 key에 실시간 metrics.height 수치를 락인하여 동적 동기화를 보장합니다.
  return (
    <primitive 
      ref={group}
      key={`${gender}-${metrics.height}`} 
      object={scene} 
    />
  )
}

useGLTF.preload('/avatars/female.glb')
useGLTF.preload('/avatars/male.glb')