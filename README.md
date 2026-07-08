# 맛동네 — 서울 식당 리뷰 PWA

서울 지도에서 식당을 검색하고, 별점과 사진 리뷰를 남기는 웹 앱(PWA)입니다.
완전히 무료로 운영할 수 있는 스택으로 구성했고, 반응이 좋으면 이후 React Native(Expo) 네이티브 앱으로 전환할 수 있습니다.

## 기술 스택

| 영역 | 선택 |
|---|---|
| 프론트엔드 | React + TypeScript + Vite, PWA(`vite-plugin-pwa`) |
| 지도 | 카카오맵 JS SDK (무료 쿼터: 개인 일 20만 건 / 법인 일 30만 건) |
| 백엔드 | Firebase (Auth, Firestore, Storage) — 무료 Spark 요금제 |
| 배포 | Vercel / Netlify / Firebase Hosting 중 아무거나 무료 티어 |

네이버 지도 API는 2025년부터 무료 제공이 종료되고 신규 신청도 막혀 있어 선택지에서 제외했습니다.

## 시작하기 전에 — 계정 준비 (사용자가 직접 해야 하는 단계)

### 1. 카카오맵 JS 키 발급

1. [Kakao Developers](https://developers.kakao.com)에 카카오 계정으로 로그인 → **내 애플리케이션** → **애플리케이션 추가하기**
2. 생성한 앱 → **앱 키**에서 **JavaScript 키** 복사
3. **플랫폼** → **Web 플랫폼 등록**에 사용할 도메인 등록
   - 로컬 개발: `http://localhost:5173`
   - 배포 후: 실제 배포 도메인 (예: `https://your-app.vercel.app`)

### 2. Firebase 프로젝트 생성

1. [Firebase 콘솔](https://console.firebase.google.com)에서 새 프로젝트 생성 (요금제는 기본 **Spark(무료)**)
2. **빌드 → Authentication → 시작하기** → 로그인 방법에서 **이메일/비밀번호**, **Google** 활성화
3. **빌드 → Firestore Database → 데이터베이스 만들기** → 프로덕션 모드로 시작 (지역은 `asia-northeast3`(서울) 추천)
4. **빌드 → Storage → 시작하기** (사진 리뷰 저장용)
5. **프로젝트 설정 → 일반 → 내 앱**에서 웹 앱(`</>`) 추가 → `firebaseConfig` 값 복사

### 3. 환경변수 채우기

```bash
cp .env.example .env.local
```

`.env.local`을 열어 위에서 복사한 카카오 JS 키와 Firebase 설정값을 채워 넣습니다. 이 파일은 git에 커밋되지 않습니다.

## 로컬 개발

```bash
npm install
npm run dev
```

`.env.local` 설정이 없으면 앱이 크래시하는 대신 "설정이 필요합니다" 안내 화면을 보여줍니다.

## Firestore / Storage 보안 규칙 배포

리뷰는 로그인한 사용자만 작성할 수 있고, 본인 리뷰만 수정/삭제할 수 있도록 `firestore.rules`, `storage.rules`에 규칙을 정의해 두었습니다. Firebase CLI로 배포하세요.

```bash
npm install -g firebase-tools
firebase login
firebase use --add   # 방금 만든 프로젝트 선택
firebase deploy --only firestore:rules,storage:rules
```

## 배포 (무료)

PWA이므로 정적 호스팅 아무 곳에나 올리면 됩니다.

- **Vercel**: 저장소 연결 → 빌드 명령 `npm run build`, 출력 디렉터리 `dist` → 환경변수에 `.env.local` 내용 등록
- **Netlify**: 동일하게 `npm run build` / `dist` 설정
- **Firebase Hosting**: 이미 Firebase 프로젝트가 있으니 `firebase init hosting` 후 `firebase deploy`로 한 번에 처리 가능

배포 후에는 카카오 개발자 콘솔의 **Web 플랫폼**에 실제 배포 도메인을 반드시 추가해야 지도가 표시됩니다.

## 데이터 모델

```
restaurants/{kakaoPlaceId}
  name, address, category, lat, lng
  reviewCount, ratingSum, ratingAvg   ← 리뷰 작성 시 트랜잭션으로 갱신 (Cloud Functions 불필요, 무료 플랜에서 동작)

restaurants/{kakaoPlaceId}/reviews/{reviewId}
  userId, userName, rating(1~5), text, photoUrl, createdAt
```

식당은 카카오맵 검색 결과의 장소 ID를 그대로 문서 ID로 사용합니다. 사용자가 지도에서 어떤 식당이든 검색해서 첫 리뷰를 남기면 그 시점에 `restaurants` 문서가 자동 생성됩니다.

## 화면 구성

- `/` — 지도에서 식당 검색, 마커 탭 시 요약 정보 표시
- `/restaurant/:id` — 식당 상세, 별점 평균, 리뷰 목록, 리뷰 작성(로그인 필요)
- `/login`, `/signup` — 이메일/비밀번호 및 구글 로그인

## 전국 확장 계획

현재는 초기 검색 반경(5km)과 기본 지도 중심이 서울시청으로 고정되어 있습니다. 다른 지역으로 확장할 때는 `src/components/KakaoMap.tsx`의 기본 좌표와 `MapPage`의 초기 검색어만 바꾸면 되고, 카카오맵 API 자체는 전국 데이터를 이미 지원하므로 API 교체가 필요 없습니다.
