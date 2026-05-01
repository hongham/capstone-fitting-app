# Animations

Mixamo에서 다운로드한 포즈/애니메이션 GLB 파일을 저장하세요.

## 다운로드 방법

1. https://mixamo.com 접속, Adobe 계정 로그인
2. "Upload Character"로 Ready Player Me 아바타 GLB 업로드
3. 원하는 애니메이션 검색 (추천: idle, t-pose, walking, sitting, confident pose)
4. Format: FBX Binary 또는 glTF 선택
5. Skin: With Skin
6. Frames per Second: 30
7. "In Place" 체크 (이동 애니메이션의 경우)
8. Download

## 변환 (FBX → GLB)

Three.js는 GLB가 더 효율적입니다. Blender에서:

1. File → Import → FBX
2. File → Export → glTF 2.0 (.glb)
3. Format: glTF Binary

## 파일 이름 (poses.js와 일치)

- `idle.glb`
- `tpose.glb`
- `walking.glb`
- `sitting.glb`
- `confident.glb`
