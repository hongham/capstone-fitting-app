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

export async function generateImage(poseImage, prompt, gender = 'male') {
  // App.jsx로부터 유실 없이 전달받은 최신 실시간 한글 문자열 연동
  console.log(`🚀 [백엔드 확정 고정] 체형 맞춤 피팅 가동 - 성별: ${gender} | 입력:`, prompt);

  // 1. 번역 실행
  const englishPrompt = PROMPT_LIBRARY[prompt] ?? await translateToEnglish(prompt);

  // 유저의 입력값에 흰색 계열이 포함되어 있는지 체크
  const isWhiteRequested = 
    prompt.toLowerCase().includes('white') || 
    prompt.includes('흰색') || 
    prompt.includes('하얀') || 
    englishPrompt.toLowerCase().includes('white');

  // 긍정 프롬프트 성별 분기
  const isFemale = gender === 'female' || gender === '여성';
  const genderKeyword = isFemale ? 'photorealistic woman, feminine body shape' : 'photorealistic man, musculine body shape';

  // 기본 부정 프롬프트 세팅 (기괴한 나시티 및 신체 파손 방지)
  let negativePrompt = "multi-person, two people, twin, duplicate, clone, overlapping bodies, mutated, deformed, distorted, disfigured, changed silhouette, grossly proportions, poorly drawn face, bad anatomy, extra limbs, fused fingers, blurry, real human face, photo of real woman, real person";
  negativePrompt += ", tank top, shirtless, cutoff shirt, tight leggings, martial arts pants, traditional clothing, ragged hem";

  if (isFemale) {
    negativePrompt += ", photo of real man, male, masculine, beard";
  } else {
    negativePrompt += ", photo of real woman, female, feminine, breasts";
  }

  if (!isWhiteRequested) {
    negativePrompt += ", white clothing, white shirt, plain white clothes, light gray clothing";
  }

  // 🛠️ [의상별 가중치 & 텍스처 정밀 매핑 제어 장치]
  let currentControlWeight = 1.70; // 기본 상의는 아바타 외곽선 강력 고정
  let currentScale = 4.5;          // AI 상상력 억제 락값 기본 세팅
  let sleeveKeyword = "normal clothing sleeves, long sleeves";
  let pantsKeyword = "long pants length covering ankles";

  const lowerPrompt = prompt.toLowerCase();
  const lowerEnglish = englishPrompt.toLowerCase();

  // 1) 외투 (자켓, 코트) 판별
  const isOuterwear = 
    lowerPrompt.includes('자켓') || lowerPrompt.includes('코트') || 
    lowerEnglish.includes('jacket') || lowerEnglish.includes('coat');

  // 2) 반바지 판별
  const isShorts = lowerPrompt.includes('반바지') || lowerEnglish.includes('shorts');

  // 3) 슬랙스 정장 핏 판별
  const isSlacks = lowerPrompt.includes('슬랙스') || lowerEnglish.includes('slacks');

  if (isOuterwear) {
    currentControlWeight = 1.30; // 외투 레이어 볼륨 분리 감쇠값 고정
    currentScale = 5.0; 
    sleeveKeyword = "fashionable outerwear coat sleeves, layered jacket style";
  }

  if (isShorts) {
    currentControlWeight = Math.min(currentControlWeight, 1.35);
    pantsKeyword = "stylish modern summer shorts, exposed lower legs and calves";
  } else {
    negativePrompt += ", cropped pants, short trousers";
  }

  if (isSlacks) {
    pantsKeyword = "formal elegant suit slacks, sharp front crease line, clean tailored straight fit, no drawstrings, premium suit fabric";
    negativePrompt += ", sweatpants, jogging pants, jogger cuffs, sporty sweat pants, track pants, casual cords";
  }

  // 최종 조합 프롬프트 파이프라인
  const finalPrompt = `highly detailed studio fashion photography of a ${genderKeyword}, 
  full outfit style based on: (${englishPrompt}:1.4), 
  consisting of an upper body garment and a matching lower body trousers, 
  perfectly fitted to their adjusted body shape, following body contour seamlessly, 
  clear clothing separation, ${pantsKeyword}, ${sleeveKeyword},
  studio lighting, realistic clothing texture, premium fabric quality`;

  // 2. AI API 요청 (Replicate API 호환 구조)
  const response = await fetch("/api/predictions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      version: "0304f7f774ba7341ef754231f794b1ba3d129e3c46af3022241325ae0c50fb99",
      input: {
        image: poseImage,
        prompt: finalPrompt,
        a_prompt: "best quality, professional catalog fashion photo, extremely detailed fabric texture, 8k resolution, precise clothing fit, realistic texture",
        n_prompt: negativePrompt,
        num_samples: "1",
        
        // 🛠️ 지재헌님이 처음에 가장 안정적으로 뽑아내셨던 512 해상도로 강제 다운그레이드 복구
        image_resolution: "512",
        detect_resolution: 512,
        ddim_steps: 25, 
        
        controlnet_weight: currentControlWeight, 
        scale: currentScale, 
        seed: 42 // 🛠️ 42번 원본 시드로 완전 락인(Lock-in) 고정
      }
    })
  });

  const prediction = await response.json();
  if (response.status !== 201) throw new Error(prediction.detail || "API 에러");

  // 3. Result 폴링 (2.5초 간격)
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