import { PROMPT_LIBRARY } from './promptLibrary'

const cache = new Map();

async function translateToEnglish(text) {
  if (/^[a-zA-Z\s,.\-]+$/.test(text)) return text;

  try {
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=ko|en`
    );
    const data = await res.json();
    console.log("번역 결과:", data.responseData.translatedText);
    return data.responseData.translatedText;
  } catch (err) {
    console.warn("번역 실패, 원문 사용:", text);
    return text;
  }
}

export async function generateImage(poseImage, prompt, options = {}) {
  const { seed = 42 } = options;

  const englishPrompt = PROMPT_LIBRARY[prompt] ?? await translateToEnglish(prompt);
  console.log("최종 영어 프롬프트:", englishPrompt);

  const cacheKey = `${englishPrompt}_${seed}`;

  if (cache.has(cacheKey)) {
    console.log("캐시 히트:", cacheKey);
    return cache.get(cacheKey);
  }

  const res = await fetch("/api/predictions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      version: "0304f7f774ba7341ef754231f794b1ba3d129e3c46af3022241325ae0c50fb99",
      input: {
        image: poseImage,
        prompt: `a mannequin wearing ${englishPrompt}, pure white background, full body, front view, studio lighting, photorealistic, high quality`,
        num_samples: "1",
        image_resolution: "512",
        ddim_steps: 20,
        scale: 7,
        seed: seed,
        eta: 0,
        a_prompt: "best quality, extremely detailed, realistic, coherent outfit, well-fitted clothing, professional fashion photo",
        n_prompt: "deformed, ugly, blurry, low quality, extra limbs, bad anatomy, watermark, text, cartoon"
      }
    })
  });

  const prediction = await res.json();
  console.log("prediction 전체:", prediction);

  if (!prediction.id) {
    throw new Error("prediction id 없음: " + JSON.stringify(prediction));
  }

  const result = await pollResult(prediction.id);

  cache.set(cacheKey, result);
  console.log("캐시 저장:", cacheKey);

  return result;
}

async function pollResult(id) {
  while (true) {
    const res = await fetch(`/api/predictions/${id}`, {
      headers: { "Content-Type": "application/json" }
    });
    const data = await res.json();

    if (data.status === 429) {
      const waitTime = (data.retry_after ?? 10) * 1000;
      console.log(`Rate limited, ${waitTime/1000}초 대기...`);
      await new Promise(r => setTimeout(r, waitTime));
      continue;
    }

    if (data.status === "succeeded") {
      console.log("output 전체:", data.output)  // ← 여기!
      return data.output[1];
    }
    if (data.status === "failed") throw new Error("이미지 생성 실패");

    await new Promise(r => setTimeout(r, 10000));
  }
}
