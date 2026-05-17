// src/api/generate.js

let PROMPT_LIBRARY = {};
try {
  // 친구가 만든 라이브러리 파일이 있는지 체크
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
  console.log("🚀 이미지 생성 시작 - 입력:", prompt);

  // 1. 번역 실행
  const englishPrompt = PROMPT_LIBRARY[prompt] ?? await translateToEnglish(prompt);

  // 2. AI API 요청
  const response = await fetch("/api/predictions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      version: "0304f7f774ba7341ef754231f794b1ba3d129e3c46af3022241325ae0c50fb99",
      input: {
        image: poseImage,
        // 프롬프트를 자연스럽게 수정 (강박적인 단어 제거)
        prompt: `a realistic photo of a person wearing ${englishPrompt}, stylish look, studio lighting, clean white background, high quality, 8k resolution`,
        
        // 긍정 수식어: 실사 느낌 강조
        a_prompt: "best quality, extremely detailed, photo-realistic, soft lighting, professional fashion photography",
        
        // 부정 수식어: 기괴함 방지 치트키 (손가락, 팔다리 꼬임 방지)
        n_prompt: "deformed, distorted, disfigured, poorly drawn face, bad anatomy, extra limbs, fused fingers, gross proportions, low quality, blurry",
        
        num_samples: "1",
        image_resolution: "512",
        detect_resolution: 512,
        ddim_steps: 20, // 단계를 적당히 유지하여 기괴한 디테일 생성을 방지
        scale: 7,       // [핵심] 7로 조정하여 AI가 모델링의 어색한 부분을 스스로 보정하게 함
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
    console.log("⏳ 상태:", result.status);
  }

  if (result.status === "failed") throw new Error("이미지 생성 실패");

  // 4. 결과 반환 (output[1]이 실제 합성 이미지)
  if (result.output && result.output.length > 1) {
    return result.output[1];
  }
  return result.output ? result.output[0] : null;
}