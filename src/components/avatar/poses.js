/**
 * 2주차 포즈 프리셋
 *
 * - rigged GLB: boneRotations 값을 본에 적용한다.
 * - non-rig GLB: fallback 값을 모델 그룹에 적용해서 캡처용 각도 차이를 만든다.
 *
 * 회전값 단위는 radian이다.
 */
export const POSES = [
  {
    id: 'idle',
    name: '기본 서기',
    description: '정면 기본 자세',
    fallback: { rotation: [0, 0, 0], position: [0, 0, 0] },
    boneRotations: {},
  },
  {
    id: 'tpose',
    name: 'T-포즈',
    description: '팔을 좌우로 벌린 본 구조 확인용 자세',
    fallback: { rotation: [0, 0, 0], position: [0, 0, 0] },
    boneRotations: {
      leftArm: [0, 0, Math.PI / 2],
      leftForeArm: [0, 0, 0],
      rightArm: [0, 0, -Math.PI / 2],
      rightForeArm: [0, 0, 0],
    },
  },
  {
    id: 'side',
    name: '측면',
    description: 'AI 입력용 측면 실루엣',
    fallback: { rotation: [0, Math.PI / 2, 0], position: [0, 0, 0] },
    boneRotations: {},
  },
  {
    id: 'walking',
    name: '걷기',
    description: '팔과 다리가 엇갈리는 걷기 느낌',
    fallback: { rotation: [0, -0.3, 0.02], position: [0, 0, 0] },
    boneRotations: {
      leftArm: [0.35, 0, 0.1],
      rightArm: [-0.35, 0, -0.1],
      leftUpLeg: [-0.35, 0, 0],
      leftLeg: [0.35, 0, 0],
      rightUpLeg: [0.3, 0, 0],
      rightLeg: [-0.25, 0, 0],
    },
  },
  {
    id: 'sitting',
    name: '앉기',
    description: '앉은 자세에 가까운 하체 굽힘',
    fallback: { rotation: [-0.08, 0, 0], position: [0, -0.12, 0] },
    boneRotations: {
      spine: [0.12, 0, 0],
      leftUpLeg: [-1.1, 0, 0],
      leftLeg: [1.2, 0, 0],
      rightUpLeg: [-1.1, 0, 0],
      rightLeg: [1.2, 0, 0],
    },
  },
  {
    id: 'confident',
    name: '자신있게',
    description: '상체를 곧게 세운 발표/피팅용 자세',
    fallback: { rotation: [0, 0.18, 0], position: [0, 0, 0] },
    boneRotations: {
      spine: [-0.08, 0, 0],
      leftArm: [0.15, 0, 0.35],
      rightArm: [0.15, 0, -0.35],
    },
  },
]

export const POSE_MAP = Object.fromEntries(POSES.map((pose) => [pose.id, pose]))

export function getPosePreset(poseId) {
  return POSE_MAP[poseId] || POSE_MAP.idle
}
