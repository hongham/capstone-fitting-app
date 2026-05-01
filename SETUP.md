# 셋업 가이드 — 처음부터 GitHub 푸시까지

이 문서는 **이 압축 파일을 받은 직후부터** 무엇을 해야 하는지 순서대로 설명합니다.

## 0. 사전 준비

- Node.js 18 이상 설치 (https://nodejs.org)
- Git 설치 (https://git-scm.com)
- GitHub 계정

## 1. 압축 풀고 폴더로 이동

```bash
# 압축 풀기 후 (예: 바탕화면에 압축 풀었다고 가정)
cd ~/Desktop/capstone-fitting-app
```

## 2. 의존성 설치

```bash
npm install
```

3~5분 정도 걸립니다. node_modules 폴더가 생성됩니다.

## 3. 동작 확인

```bash
npm run dev
```

브라우저가 자동으로 열리고 http://localhost:5173 으로 접속됩니다.

이 시점에서는 **아바타 GLB 파일이 없으므로 화면에 아바타가 안 보입니다.** 정상입니다. 콘솔(F12)에 에러가 떠도 일단 OK. 다음 단계에서 GLB를 추가합니다.

종료: 터미널에서 Ctrl+C

## 4. Ready Player Me 아바타 추가

1. https://readyplayer.me 에서 아바타 생성 (가이드 5장 참고)
2. GLB 파일 다운로드
3. `public/avatars/male.glb` 로 저장
4. `npm run dev` 다시 실행 → 아바타 표시 확인

## 5. GitHub 저장소 연결

### 5-1. GitHub에서 빈 저장소 생성

1. github.com 로그인
2. 우상단 + → New repository
3. Repository name: `capstone-fitting-app`
4. **README, .gitignore, license 생성 옵션 모두 체크 해제** (이미 로컬에 있음)
5. Create repository

### 5-2. 로컬에서 Git 초기화 및 연결

```bash
cd ~/Desktop/capstone-fitting-app

# Git 초기화
git init
git branch -M main

# 첫 커밋
git add .
git commit -m "chore: 프로젝트 초기 셋업"

# 원격 저장소 연결 (URL은 GitHub 페이지에서 복사)
git remote add origin https://github.com/너의아이디/capstone-fitting-app.git

# 푸시
git push -u origin main
```

### 5-3. dev 브랜치 만들기

```bash
git checkout -b dev
git push -u origin dev
```

### 5-4. 본인 작업 브랜치 만들기 (A는 feature/avatar)

```bash
git checkout -b feature/avatar
git push -u origin feature/avatar
```

## 6. 팀원 초대 및 보호 설정

### 팀원 초대

GitHub 저장소 → Settings → Collaborators → Add people → 팀원 ID 입력

### main 브랜치 보호

Settings → Branches → Add branch protection rule
- Branch name pattern: `main`
- Require a pull request before merging ✓
- Require approvals: 1

## 7. 팀원도 동일하게 셋업

팀원은 본인 컴퓨터에서:

```bash
git clone https://github.com/너의아이디/capstone-fitting-app.git
cd capstone-fitting-app
npm install

# B는
git checkout dev
git pull
git checkout -b feature/ui
git push -u origin feature/ui

# C는
git checkout dev
git pull
git checkout -b feature/api
git push -u origin feature/api
```

## 8. 일상 작업 흐름

```bash
# 작업 시작 전 - 최신 dev 가져오기
git checkout dev
git pull origin dev

# 본인 브랜치로 이동, dev 변경사항 머지
git checkout feature/avatar
git merge dev

# 작업하기...

# 변경사항 확인
git status
git diff

# 커밋
git add .
git commit -m "feat: 아바타 본 스케일링 구현"

# 푸시
git push origin feature/avatar
```

## 9. 막힐 때

- **`npm install` 에러**: Node 버전 확인 (`node --version` → 18 이상이어야 함)
- **`npm run dev` 에러**: `npm install` 먼저
- **GLB 파일 안 보임**: public/avatars/ 폴더에 파일이 있는지, 이름이 정확한지 확인
- **Git 명령어**: 가이드 PDF 13.6 참고
- **본 이름 불일치**: 가이드 PDF 6.3, 6.4 참고

## 10. 다음 단계

기본 셋업이 끝났으면 가이드 PDF의 4장(R3F 기본 씬)부터 차례로 진행하세요. 코드 파일은 이미 만들어져 있고, 그 안의 TODO 주석을 따라가며 채우면 됩니다.

화이팅!
