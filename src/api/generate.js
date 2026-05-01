/**
 * generateImage
 * - C 담당: ControlNet API 호출하여 옷 입은 이미지 생성
 *
 * @param {string} poseImage - base64 PNG (A 모듈의 capture() 결과)
 * @param {string} prompt - 옷 설명 텍스트 (B의 입력)
 * @param {Object} options - { seed, width, height, ... }
 * @returns {Promise<string>} - 생성된 이미지 URL 또는 base64
 *
 * TODO (C 담당):
 *   1. Vercel Edge Function 구축 (/api/generate)
 *   2. 서버 측에서 Replicate API 호출
 *   3. 시드 고정 / 캐싱 로직
 */
export async function generateImage(poseImage, prompt, options = {}) {
  // TODO: 실제 API 호출 구현
  console.log('generateImage called:', { promptLength: prompt.length, options })

  // 임시: 입력 이미지를 그대로 반환 (개발 중)
  return poseImage

  // 실제 구현 예시:
  // const response = await fetch('/api/generate', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({
  //     image: poseImage,
  //     prompt: prompt,
  //     seed: options.seed || 42,
  //   }),
  // })
  // const data = await response.json()
  // return data.imageUrl
}
