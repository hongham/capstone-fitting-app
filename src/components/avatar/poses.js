/**
 * 포즈 프리셋 목록
 *
 * TODO (2주차):
 *   1. Mixamo에서 각 포즈를 다운로드 (FBX)
 *   2. Blender에서 GLB로 변환
 *   3. public/animations/ 에 저장
 */
export const POSES = [
  { id: 'idle', name: '기본 서기', file: '/animations/idle.glb' },
  { id: 'tpose', name: 'T-포즈', file: '/animations/tpose.glb' },
  { id: 'walking', name: '걷기', file: '/animations/walking.glb' },
  { id: 'sitting', name: '앉기', file: '/animations/sitting.glb' },
  { id: 'confident', name: '자신있게', file: '/animations/confident.glb' },
]
