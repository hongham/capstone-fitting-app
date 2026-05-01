/**
 * 본 이름 매핑
 *
 * Ready Player Me 모델의 표준 본 이름. 다른 모델 사용 시 수정 필요.
 * 본 구조 확인 방법: Avatar 컴포넌트의 console.log 출력 참고.
 */
export const BONE_MAP = {
  hips: 'Hips',
  spine: 'Spine',
  spine1: 'Spine1',
  spine2: 'Spine2',
  chest: 'Spine2',  // 가슴 둘레는 Spine2가 적절
  neck: 'Neck',
  head: 'Head',

  leftShoulder: 'LeftShoulder',
  leftArm: 'LeftArm',
  leftForeArm: 'LeftForeArm',
  rightShoulder: 'RightShoulder',
  rightArm: 'RightArm',
  rightForeArm: 'RightForeArm',

  leftUpLeg: 'LeftUpLeg',
  leftLeg: 'LeftLeg',
  rightUpLeg: 'RightUpLeg',
  rightLeg: 'RightLeg',
}

/**
 * 본 찾기 헬퍼
 * @param {THREE.Object3D} scene
 * @param {string} key - BONE_MAP의 키
 * @returns {THREE.Bone | null}
 */
export function findBone(scene, key) {
  const name = BONE_MAP[key]
  if (!name) return null

  let result = null
  scene.traverse((obj) => {
    if (obj.isBone && obj.name === name) {
      result = obj
    }
  })
  return result
}

/**
 * 디버그용: 모든 본 정보 콘솔 출력
 */
export function debugBones(scene) {
  const bones = []
  scene.traverse((obj) => {
    if (obj.isBone) {
      bones.push({
        name: obj.name,
        position: obj.position.toArray(),
        scale: obj.scale.toArray(),
      })
    }
  })
  console.table(bones)
  return bones
}
