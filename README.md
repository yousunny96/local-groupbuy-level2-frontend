# 동네장터 공동구매 · 프론트엔드 (Next.js)

동네 로컬푸드 마켓의 **농산물 공동구매 신청·취소 화면**입니다. 공동구매를 찾아보고, 박스 수만 정해 신청하고, 마감 전까지 취소할 수 있습니다.
고객 요청과 설계 내용은 [기획서.md](기획서.md)에 있습니다. (Level 2 과제)

- 백엔드 저장소: `local-groupbuy-level2-backend`
- 기술: Next.js · Vercel
- 모든 이름·연락처는 가상 데이터입니다. 결제는 하지 않고 신청만 받습니다.

> ⏳ 백엔드가 무료 서버라서 **처음 열면 목록이 뜨기까지 30초~1분** 걸릴 수 있어요. 한 번 깨어나면 빨라집니다.

## 화면
| 주소 | 설명 |
|---|---|
| `/` | 공동구매 목록 (상품명 검색, 종류·산지·상태 필터) |
| `/group-buys/[id]` | 상세 |
| `/group-buys/[id]/apply` | 신청 → 신청번호 발급 |
| `/cancel` | 신청 취소 (신청번호 + 연락처) |
| `/admin` | 현황 숫자 3개, 가상 데이터 다시 채우기 |
| `/admin/orders` | 신청 목록 (이름·연락처·신청번호 검색) |
| `/admin/group-buys/new` | 공동구매 등록 |

로그인은 없습니다(Level 2). 위쪽 메뉴의 **관리자** 항목이 관리자 화면입니다.

## 내 컴퓨터에서 실행
백엔드를 먼저 켠 뒤:
```bash
npm install
cp .env.example .env.local   # NEXT_PUBLIC_API_URL을 채운다
npm run dev                  # http://localhost:3000
```

## 설정값 (환경변수)
| 이름 | 뜻 | 예시 |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | 백엔드 서버 주소. 끝에 `/`를 붙이지 않습니다 | 내 컴퓨터: `http://localhost:4000` / 배포: `https://서비스이름.onrender.com` |

`NEXT_PUBLIC_`으로 시작하는 값은 브라우저에 그대로 보입니다. 비밀 값은 넣지 마세요.

## Vercel에 올리기
1. Vercel → **Add New → Project** → 이 저장소를 가져옵니다. Framework는 Next.js로 자동 인식됩니다.
2. **Environment Variables**에 `NEXT_PUBLIC_API_URL`을 넣습니다 (Render 백엔드 주소).
3. **Deploy**를 누릅니다. 빌드 명령 등은 기본값 그대로 두면 됩니다.
4. 나온 주소(`https://….vercel.app`)를 백엔드의 `FRONTEND_ORIGIN`에 넣고 백엔드를 다시 배포합니다. 그래야 브라우저가 서버에 접속할 수 있어요.
