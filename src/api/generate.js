// src/api/generate.js

export async function generateImage(poseImage, prompt) {
  const response = await fetch("/api/predictions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      version: "0304f7f774ba7341ef754231f794b1ba3d129e3c46af3022241325ae0c50fb99",
      input: {
        image: poseImage,
        prompt: `same person, full body, wearing ${prompt}, front view, studio lighting, clean white background, high quality, sharp focus, realistic`,
        a_prompt: "best quality, extremely detailed",
        n_prompt: "different person, face change, body change, deformed, ugly, bad anatomy, blurry, low quality, extra limbs",
        
        // 에러 메시지에 따라 타입을 정확히 맞춤
        num_samples: "1",          // String 타입 요구
        image_resolution: "512",   // String 타입 요구
        detect_resolution: 512,    // Integer 타입 요구
        ddim_steps: 20,           // Integer 타입 요구
        scale: 7,                 // Number 타입 요구
        seed: 42                  // Integer 타입 요구
      }
    })
  });

  const prediction = await response.json();

  // 429 에러(Too Many Requests) 처리
  if (response.status === 429) {
    throw new Error("요청이 너무 많습니다. 잠시 후 다시 시도해주세요.");
  }

  if (response.status !== 201) {
    throw new Error(prediction.detail || "API 요청 실패");
  }

  let result = prediction;
  const pollUrl = `/api/predictions/${prediction.id}`;

  while (result.status !== "succeeded" && result.status !== "failed") {
    await new Promise(resolve => setTimeout(resolve, 2500)); // 폴링 간격을 2.5초로 약간 늘림
    const pollResponse = await fetch(pollUrl);
    result = await pollResponse.json();
    console.log("AI 피팅 진행 상황:", result.status);
  }

  if (result.status === "failed") {
    throw new Error("이미지 생성에 실패했습니다.");
  }

  // 결과물 중 실제 합성 이미지(두 번째) 반환
  if (result.output && result.output.length > 1) {
    return result.output[1];
  }
  return result.output ? result.output[0] : null;
}