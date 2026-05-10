# A 역할 1주차 체크리스트

A 역할의 1주차 목표는 AI 합성 이전 단계인 3D 포즈 룸의 기본 골격을 완성하는 것입니다.

## 1주차 목표

- React Three Fiber 기반 3D 씬 구성
- Ready Player Me GLB 아바타 로딩
- 카메라, 조명, 바닥, OrbitControls 설정
- 브라우저 콘솔에서 아바타 본 구조 확인
- 신체 정보 입력값을 아바타 스케일링 함수로 전달
- 현재 WebGL 화면을 이미지로 캡처하는 `capture()` 인터페이스 준비

## 구현된 파일

```text
src/App.jsx
src/components/avatar/AvatarScene.jsx
src/components/avatar/Avatar.jsx
src/components/avatar/CaptureController.jsx
src/components/avatar/applyMetrics.js
src/components/avatar/boneMap.js
src/components/avatar/poses.js
src/store/index.js
```

## 아바타 파일 위치

Ready Player Me에서 받은 GLB 파일은 아래 경로에 둡니다.

```text
public/avatars/male.glb
```

현재 `Avatar.jsx`는 `/avatars/male.glb`를 로드하도록 설정되어 있습니다.

## 실행 방법

PowerShell에서 `npm.ps1` 실행 정책 오류가 날 수 있으므로 Windows에서는 아래 명령을 권장합니다.

```bash
npm.cmd install
npm.cmd run dev
```

개발 서버 주소:

```text
http://127.0.0.1:5173/
```

## 확인 절차

1. 화면 중앙에 3D 아바타가 보이는지 확인합니다.
2. 마우스 드래그로 아바타 주변을 회전할 수 있는지 확인합니다.
3. 마우스 휠로 확대와 축소가 되는지 확인합니다.
4. 신체 정보 슬라이더를 움직였을 때 아바타 비율이 변하는지 확인합니다.
5. 브라우저 개발자 도구 콘솔에 `=== Avatar bones ===`와 본 이름들이 출력되는지 확인합니다.
6. 옷 프롬프트를 입력하고 `옷 입혀보기`를 눌렀을 때 현재 캡처 이미지가 갤러리에 추가되는지 확인합니다.

## 1주차 완료 기준

- Vite 기본 화면이 아니라 피팅 앱 레이아웃이 표시됩니다.
- 3D 캔버스가 화면 중앙 영역을 채웁니다.
- `public/avatars/male.glb`가 정상 로드됩니다.
- `AvatarScene`이 외부에서 `ref.current.capture()`로 캡처 결과를 받을 수 있습니다.
- A/B/C 통합을 위해 `metrics`, `pose`, `capture()` 인터페이스가 유지됩니다.

## 다음 단계

- 실제 `male.glb`의 본 이름을 확인한 뒤 `boneMap.js`를 보정합니다.
- 2주차에는 `poses.js`의 포즈 프리셋을 실제 애니메이션 또는 관절 회전 로직과 연결합니다.
- 캡처 품질을 높이기 위해 카메라 거리, 조명, 배경색을 고정값으로 다듬습니다.
