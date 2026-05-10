// src/api/generate.js

export async function generateImage(poseImage, prompt) {
  // 1. AI가 더 똑똑하게 옷을 입히도록 프롬프트를 보강합니다.
  // 단순히 "T-shirt"라고 보내는 것보다 스타일을 지정해주는 게 결과물이 훨씬 잘 나옵니다.
  const enhancedPrompt = `A high-quality fashion photography of a person wearing ${prompt}, masterpiece, 8k resolution, highly detailed fabric texture, realistic human skin`;
  
  // 뼈대만 나오는 것을 방지하기 위한 '부정 프롬프트' (Negative Prompt)
  const negativePrompt = "skeleton, pose skeleton, wireframe, low quality, blurry, distorted body, bad anatomy, naked, nude";

  // 2. Replicate API에 생성 요청 전송
  const response = await fetch("/api/predictions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      // InstantID / ControlNet 모델 버전
      version: "0304f7f774ba7341ef754231f794b1ba3d129e3c46af3022241325ae0c50fb99",
      input: {
        image: poseImage,
        prompt: enhancedPrompt,
        negative_prompt: negativePrompt,
        image_resolution: "512", // 숫자는 문자열로 전달 (422 에러 방지)
        num_samples: "1",
        instant_id_strength: "0.8",
        subject_fidelity: "0.8",
        // 가끔 모델에 따라 'adapter_type' 등을 요구할 수 있으니 
        // 뼈대만 나온다면 아래 설정을 추가해보는 것도 방법입니다.
      }
    })
  });

  const prediction = await response.json();

  if (response.status !== 201) {
    throw new Error(prediction.detail || "API 요청 실패");
  }

  // 3. 결과 대기 (Polling)
  let result = prediction;
  const pollUrl = `/api/predictions/${prediction.id}`;

  while (result.status !== "succeeded" && result.status !== "failed") {
    await new Promise(resolve => setTimeout(resolve, 2000));
    const pollResponse = await fetch(pollUrl);
    result = await pollResponse.json();
    console.log("AI 피팅 진행 상황:", result.status);
  }

  if (result.status === "failed") {
    throw new Error("이미지 생성에 실패했습니다.");
  }

  // 4. 최종 결과물 URL 반환
  // 결과값이 배열 형태로 오기 때문에 첫 번째 요소를 반환합니다.
  return result.output[0];
}