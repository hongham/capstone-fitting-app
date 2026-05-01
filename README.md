# Capstone Fitting App

3D 아바타 + AI 이미지 생성 기반 가상 피팅 서비스

## 기술 스택

- **React + Vite** — 프론트엔드 프레임워크
- **React Three Fiber (R3F)** — 3D 렌더링
- **drei** — R3F 헬퍼
- **Replicate API (ControlNet)** — AI 이미지 생성
- **Tailwind CSS** — 스타일링
- **Zustand** — 전역 상태 관리

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.example`을 복사해서 `.env.local`로 이름을 바꾸고, 실제 API 키를 입력한다.

```bash
cp .env.example .env.local
```

> ⚠️ `.env.local`은 절대 커밋하지 말 것. `.gitignore`에 이미 등록돼 있다.

### 3. 개발 서버 실행

```bash
npm run dev
```

http://localhost:5173 에서 확인.

## 폴더 구조

```
src/
├── components/
│   ├── avatar/        # A 담당 (3D 아바타)
│   │   ├── AvatarScene.jsx
│   │   ├── Avatar.jsx
│   │   ├── CaptureController.jsx
│   │   ├── boneMap.js
│   │   ├── applyMetrics.js
│   │   └── poses.js
│   ├── ui/            # B 담당 (UI)
│   │   ├── InputForm.jsx
│   │   ├── PromptPanel.jsx
│   │   └── Gallery.jsx
│   └── shared/        # 공용
├── api/               # C 담당
│   └── generate.js
├── hooks/             # 공용 훅
├── store/             # Zustand 전역 상태
│   └── index.js
├── App.jsx
├── main.jsx
└── index.css
```

## 브랜치 전략

- `main` — 발표용 안정 버전. 직접 push 금지.
- `dev` — 통합 개발 브랜치. 모든 PR이 여기로 머지됨.
- `feature/avatar` — A 작업 브랜치
- `feature/ui` — B 작업 브랜치
- `feature/api` — C 작업 브랜치

## 팀 역할

- **A** — 3D 아바타, 포즈, 캡처, GitHub 관리
- **B** — UI, 갤러리, 화면 흐름
- **C** — AI/API, 통합, 프롬프트 엔지니어링

## 개발 일정

- **1주차** — 환경 세팅 + API 검증
- **2주차** — 모듈별 분담 작업
- **3주차** — 통합
- **4주차** — 마감 및 배포
