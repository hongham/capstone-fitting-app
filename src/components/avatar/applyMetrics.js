import { findBone } from './boneMap'

/**
 * 표준 신체 측정값 (성인 남성 평균 기준)
 */
export const STANDARD_METRICS = {
  height: 175,    // cm
  weight: 70,     // kg
  chest: 92,      // cm
  waist: 80,      // cm
  hip: 95,        // cm
}

/**
 * 신체지수 → 스케일 비율 변환
 */
export function metricsToScale(metrics) {
  return {
    height: metrics.height / STANDARD_METRICS.height,
    chest: metrics.chest / STANDARD_METRICS.chest,
    waist: metrics.waist / STANDARD_METRICS.waist,
    hip: metrics.hip / STANDARD_METRICS.hip,
  }
}

/**
 * 본에 스케일 적용
 *
 * @param {THREE.Object3D} scene - GLB scene 객체
 * @param {Object} metrics - 신체지수
 */
export function applyMetrics(scene, metrics) {
  const scale = metricsToScale(metrics)

  // 키: Hips 본을 전체 스케일
  const hips = findBone(scene, 'hips')
  if (hips) {
    hips.scale.setScalar(scale.height)
  }

  // 가슴: Spine2의 x, z 스케일
  const chest = findBone(scene, 'chest')
  if (chest) {
    chest.scale.x = scale.chest
    chest.scale.z = scale.chest
    // y는 그대로
  }

  // 허리: Spine
  const spine = findBone(scene, 'spine')
  if (spine) {
    spine.scale.x = scale.waist
    spine.scale.z = scale.waist
  }

  // 엉덩이: Hips에 추가 적용 (키 스케일 위에 곱셈)
  if (hips) {
    hips.scale.x *= scale.hip / scale.height
    hips.scale.z *= scale.hip / scale.height
  }
}

/**
 * BMI 기반 체형 분류 (단순화 옵션)
 */
export function getBodyType(metrics) {
  const bmi = metrics.weight / ((metrics.height / 100) ** 2)
  if (bmi < 18.5) return 'slim'
  if (bmi < 23) return 'standard'
  if (bmi < 25) return 'athletic'
  if (bmi < 30) return 'plus'
  return 'large'
}
