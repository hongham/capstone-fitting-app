import { PROMPT_LIBRARY } from './promptLibrary'

const cache = new Map();

// [친구 로직] 한글 번역 함수
async function translateToEnglish(text) {
  if (/^[a-zA-Z\s,.\-]+$/.test(text)) return text;
  try {
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=ko|en`
    );
    const data = await res.json();
    return data.responseData.translatedText;
  } catch (err) {
    console.warn("번역 실패, 원문 사용:", text);
    return text;
  }
}

export async function generateImage(poseImage, prompt, options = {}) {
  const { seed = 42 } = options;

  // 1. 번역 적용 (친구 로직)
  const englishPrompt = PROMPT_LIBRARY[prompt] ?? await translateToEnglish(prompt);
  const cacheKey = `${englishPrompt}_${seed}`;

  // 2. 캐시 체크 (친구 로직)
  if (cache.has(cacheKey)) return cache.get(cacheKey);

  // 3. API 호출 (질문자님 & 친구 설정 통합)
  const response = await fetch("/api/predictions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      version: "0304f7f774ba7341ef754231f794b1ba3d129e3c46af3022241325ae0c50fb99",
      input: {
        image: poseImage,
        // 질문자님의 디테일 프롬프트 사용
        prompt: `same person, full body, wearing ${englishPrompt}, front view, studio lighting, clean white background, high quality, sharp focus, realistic`,
        a_prompt: "best quality, extremely detailed, realistic, professional fashion photo",
        n_prompt: "different person, face change, deformed, bad anatomy, blurry, low quality",
        num_samples: "1",
        image_resolution: "512",
        detect_resolution: 512,
        ddim_steps: 20,
        scale: 7,
        seed: seed
      }
    })
  });

  const prediction = await response.json();
  if (response.status !== 201) throw new Error(prediction.detail || "API 호출 실패");

  // 4. 결과 폴링 (질문자님의 2.5초 간격 유지)
  let result = prediction;
  const pollUrl = `/api/predictions/${prediction.id}`;

  while (result.status !== "succeeded" && result.status !== "failed") {
    await new Promise(resolve => setTimeout(resolve, 2500));
    const pollResponse = await fetch(pollUrl);
    result = await pollResponse.json();
  }

  if (result.status === "failed") throw new Error("이미지 생성 실패");

  // 5. 결과 반환 (질문자님이 수정한 result.output[1] 방식 유지)
  const finalImage = (result.output && result.output.length > 1) ? result.output[1] : result.output[0];
  
  cache.set(cacheKey, finalImage);
  return finalImage;
}