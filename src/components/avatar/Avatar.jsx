import React, { useEffect, useMemo } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { useStore } from '../../store'

export default function Avatar() {
  const gender = useStore((state) => state.gender)
  const metrics = useStore((state) => state.metrics)
  const currentPose = useStore((state) => state.currentPose)

  // 정적 자산 경로 지정 (/avatars/)
  const modelUrl = gender === 'female' ? '/avatars/female.glb' : '/avatars/male.glb'
  const { scene, animations } = useGLTF(modelUrl)
  const { actions } = useAnimations(animations, scene)

  // 슬라이더 수치가 바뀔 때마다 3D 씬 캐시 동기화
  const clonedScene = useMemo(() => {
    return scene.clone()
  }, [scene, gender])

  // 1. 키 조절 (스케일) 및 카메라 돌진 방지
  useEffect(() => {
    if (!clonedScene || !metrics.height) return
    const baseHeight = gender === 'male' ? 175 : 160
    const ratio = metrics.height / baseHeight
    // Y축(키)만 조절하여 카메라 침범을 원천 차단합니다.
    clonedScene.scale.set(1, ratio, 1)
  }, [metrics.height, clonedScene, gender])

  // 2. 🛠️ [핵심 수정] 셰이프 키 (Morph Targets) 실시간 매핑 로직
  // 슬라이더의 기준값(예: 45, 95)을 중심으로 커지거나 작아질 때 셰이프 키 가중치(0 ~ 1)를 작동시킵니다.
  useEffect(() => {
    if (!clonedScene || !metrics) return

    // 각 부위별 표준 평균 수치 (이 값을 기준으로 대/소 가중치 계산)
    const STANDARD = { shoulder: 45, chest: 95, waist: 85, hip: 95 }

    clonedScene.traverse((child) => {
      // 3D 모델의 메쉬(Mesh) 중에서 셰이프 키 데이터(morphTargetInfluences)를 가진 녀석을 찾습니다.
      if (child.isMesh && child.morphTargetDictionary) {
        const dict = child.morphTargetDictionary

        // 1) 어깨 조절 (shoulder_wide / shoulder_narrow)
        if (metrics.shoulder) {
          if (metrics.shoulder >= STANDARD.shoulder) {
            // 표준보다 크면 wide 키 작동 (최대 60일 때 가중치 1.0)
            const v = Math.min((metrics.shoulder - STANDARD.shoulder) / (60 - STANDARD.shoulder), 1)
            if (dict['shoulder_wide'] !== undefined) child.morphTargetInfluences[dict['shoulder_wide']] = v
            if (dict['shoulder_narrow'] !== undefined) child.morphTargetInfluences[dict['shoulder_narrow']] = 0
          } else {
            // 표준보다 작으면 narrow 키 작동 (최소 30일 때 가중치 1.0)
            const v = Math.min((STANDARD.shoulder - metrics.shoulder) / (STANDARD.shoulder - 30), 1)
            if (dict['shoulder_narrow'] !== undefined) child.morphTargetInfluences[dict['shoulder_narrow']] = v
            if (dict['shoulder_wide'] !== undefined) child.morphTargetInfluences[dict['shoulder_wide']] = 0
          }
        }

        // 2) 가슴 조절 (chest_large / chest_small)
        if (metrics.chest) {
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

        // 3) 허리 조절 (waist_large / waist_small)
        if (metrics.waist) {
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

        // 4) 엉덩이 조절 (hip_large / hip_small)
        if (metrics.hip) {
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
  }, [metrics, clonedScene])

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

  // 실시간 셰이프 키 갱신용 고유 key 락 바인딩
  return (
    <primitive 
      key={`${gender}-${metrics.height}-${metrics.shoulder}-${metrics.chest}-${metrics.waist}-${metrics.hip}`} 
      object={clonedScene} 
    />
  )
}

useGLTF.preload('/avatars/female.glb')
useGLTF.preload('/avatars/male.glb')