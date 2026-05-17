// src/api/generate.js

let PROMPT_LIBRARY = {};
try {
  const lib = require('./promptLibrary');
  PROMPT_LIBRARY = lib.PROMPT_LIBRARY || {};
} catch (e) {
  console.warn("promptLibrary를 찾을 수 없어 기본 번역 API만 사용합니다.");
}

// 번역 함수 (MyMemory API 사용)
async function translateToEnglish(text) {
  if (/^[a-zA-Z\s,.\-]+$/.test(text)) return text;
  try {
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=ko|en`
    );
    const data = await res.json();
    const translated = data.responseData.translatedText;
    console.log("✅ 번역 완료:", text, "->", translated);
    return translated;
  } catch (err) {
    console.warn("❌ 번역 실패, 원본 사용");
    return text;
  }
}

export async function generateImage(poseImage, prompt) {
  console.log("🚀 체형 맞춤 피팅 시작 - 입력:", prompt);

  // 1. 번역 실행
  const englishPrompt = PROMPT_LIBRARY[prompt] ?? await translateToEnglish(prompt);

  // 2. AI API 요청 (질문자님 최적화 설정 통합)
  const response = await fetch("/api/predictions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      version: "0304f7f774ba7341ef754231f794b1ba3d129e3c46af3022241325ae0c50fb99",
      input: {
        image: poseImage,
        // [수정] 체형 고정을 위한 프롬프트 엔지니어링 (완벽 피팅 강조)
        prompt: `a photo of a person wearing ${englishPrompt}, perfectly fitted to their body shape, following body contour, studio lighting, white background, realistic texture, high quality, realistic photography`,
        
        // 긍정 수식어: 실사 느낌 강조
        a_prompt: "best quality, extremely detailed, photo-realistic, soft lighting, professional fashion photography, precise clothing fit",
        
        // [수정] 부정 수식어 보강: 기괴함 방지 치트키 (체형 유지, 인체 왜곡 방지)
        n_prompt: "deformed, distorted, disfigured, changed silhouette, grossly proportions, poorly drawn face, bad anatomy, extra limbs, fused fingers, blurry",
        
        num_samples: "1",
        image_resolution: "512",
        detect_resolution: 512,
        ddim_steps: 25, // 조금 더 정교한 계산을 위해 상향 (20 -> 25)
        
        // [핵심 설정]
        scale: 9,       // [중요] AI의 창의성을 낮추고 보낸 실루엣을 엄격하게 지키게 함 (7 -> 9)
        seed: 42
      }
    })
  });

  const prediction = await response.json();
  if (response.status !== 201) throw new Error(prediction.detail || "API 에러");

  // 3. 결과 폴링 (2.5초 간격)
  let result = prediction;
  const pollUrl = `/api/predictions/${prediction.id}`;

  while (result.status !== "succeeded" && result.status !== "failed") {
    await new Promise(resolve => setTimeout(resolve, 2500));
    const pollResponse = await fetch(pollUrl);
    result = await pollResponse.json();
    console.log("⏳ AI 피팅 상태:", result.status);
  }

  if (result.status === "failed") throw new Error("이미지 생성 실패");

  // 4. 결과 반환 (output[1]이 실제 합성 이미지)
  if (result.output && result.output.length > 1) {
    return result.output[1];
  }
  return result.output ? result.output[0] : null;
}