// 캐시 저장소
const cache = new Map();

export async function generateImage(poseImage, prompt, options = {}) {
  const { seed = 42 } = options;

  // 캐시 키 생성 (프롬프트 + 시드 조합)
  const cacheKey = `${prompt}_${seed}`;

  // 캐시에 있으면 바로 반환
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
        prompt: `a mannequin wearing ${prompt}, pure white background, full body, front view, studio lighting, photorealistic, high quality`,
        num_samples: "1",
        image_resolution: "512",
        ddim_steps: 30,
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

  // 결과 캐시에 저장
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

    if (data.status === "succeeded") return data.output[0];
    if (data.status === "failed") throw new Error("이미지 생성 실패");

    await new Promise(r => setTimeout(r, 10000));
  }
}
