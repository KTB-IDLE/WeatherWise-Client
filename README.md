# WeatherWise-Client
WeatherWise-Client
## 프로젝트 주요 기능

### 1. 로그인 및 회원가입
- **일반 회원가입**: 이메일, 비밀번호, 닉네임 입력.
  - 비밀번호 확인 및 닉네임 중복 방지 처리.
  - 닉네임은 숫자만 입력 불가 (프론트엔드에서 정규식 검증).
- **카카오 소셜 로그인**: 카카오 계정을 통한 간편 로그인.
- **기술적 구현**:
  - JWT를 사용해 사용자 인증 및 세션 관리.
  - 회원가입 성공 시 모달 팝업으로 UX 향상.
<img width="1512" alt="스크린샷 2024-12-26 오후 11 42 21" src="https://github.com/user-attachments/assets/cad4c574-1216-42b9-beb3-48cbc28a97e7" />
<img width="1352" alt="스크린샷 2024-12-26 오후 11 58 00" src="https://github.com/user-attachments/assets/0b6ae3a6-2153-493b-9d1c-e5a77effe7b0" />

### 2. 사용자 개인 날씨 경험 설문조사
- **사용자 맞춤형 체감 날씨 제공을 위한 데이터 수집**.
- 추위를 잘 타는지, 더위를 잘 타는지 등 설문 결과는 AI 날씨 요약에서 활용.
<img width="1512" alt="스크린샷 2024-12-26 오후 11 42 53" src="https://github.com/user-attachments/assets/74c222df-4d43-4494-9772-5d65185ffbdf" />
<img width="1512" alt="스크린샷 2024-12-26 오후 11 42 56" src="https://github.com/user-attachments/assets/9da023e3-0835-471e-912d-ac2ef1e10107" />
<img width="1512" alt="스크린샷 2024-12-26 오후 11 43 00" src="https://github.com/user-attachments/assets/0b207728-22e1-4cd5-9417-3fba5d7de218" />

### 3. 메인 화면
- **실시간 위치 기반 날씨 제공**:
  - 현재 위치의 온도, 최고/최저 기온, 날씨 상태.
  - 사용자 맞춤형 AI 날씨 요약.
- **기상특보 채팅방**:
  - 기상특보 발생 시 채팅방 생성 및 입장 가능.
- **AI 챗봇**:
  - 오른쪽 하단 챗봇 버튼으로 날씨 관련 대화 가능.
- **위치 변경**:
  - 카카오맵 API를 활용한 위치 변경 기능 제공.
<img width="1512" alt="스크린샷 2024-12-26 오후 11 43 24" src="https://github.com/user-attachments/assets/10ef6fe8-6769-4802-8d04-06ea0840bb5f" />
<img width="1512" alt="스크린샷 2024-12-26 오후 11 44 35" src="https://github.com/user-attachments/assets/c4561e3e-7e13-4a5b-8b4e-7f7f57bc96e7" />
<img width="1512" alt="스크린샷 2024-12-26 오후 11 50 12" src="https://github.com/user-attachments/assets/f98218a9-8cad-4882-9b32-392be5ad92aa" />

### 4. 기상특보 채팅방
- **특징**:
  - 현재 위치에 내려진 기상특보에 따라 채팅방 자동 생성.
  - 실시간 참여자 수 표시.
- **기술적 구현**:
  - STOMP 프로토콜을 사용한 실시간 채팅.
  - JWT를 STOMP 헤더에 포함해 사용자 인증 처리.
<img width="1512" alt="스크린샷 2024-12-26 오후 11 44 50" src="https://github.com/user-attachments/assets/c93b431c-1746-4d6b-88fe-5b0bd2c99d2c" />
<img width="1512" alt="스크린샷 2024-12-26 오후 11 45 09" src="https://github.com/user-attachments/assets/6e05b1f6-cac5-4d0f-9e42-8469e34aeb47" />

### 5. 커뮤니티
- **위치 기반 게시글 확인**:
  - 현재 위치 반경 5km 내 게시글 표시.
  - 위치 변경 시 게시글 리스트 업데이트.
- **게시글 작성**:
  - 카카오맵 API로 위치 설정 가능.
  - 제목과 본문 글자 수 제한(20자, 150자)으로 사용자 경험 향상.
- **좋아요/싫어요 버튼**으로 게시글 신뢰도 평가.
<img width="1512" alt="스크린샷 2024-12-26 오후 11 47 57" src="https://github.com/user-attachments/assets/976da74f-4cdb-4611-a99b-7f2cb98bb764" />
<img width="1512" alt="스크린샷 2024-12-26 오후 11 48 51" src="https://github.com/user-attachments/assets/407e8a8b-881a-46d5-8010-7eea6309c2b5" />

### 6. 미션
- **날씨 기반 미션 제공**:
  - 예: "자전거를 타세요", "텀블러를 챙기세요".
  - 아침, 점심, 저녁 시간대별로 최대 3개의 미션 생성 가능.
- **미션 인증**:
  - 사용자가 사진을 첨부하면 AI가 인증 처리.
  - 인증 성공 시 포인트 지급.
<img width="1512" alt="스크린샷 2024-12-26 오후 11 45 49" src="https://github.com/user-attachments/assets/3d6c1555-4238-49f8-9840-5ca1af3537c2" />
<img width="1512" alt="스크린샷 2024-12-26 오후 11 46 28" src="https://github.com/user-attachments/assets/46a58834-0cea-4bd4-aa9f-14eefb78c725" />



<img width="1512" alt="스크린샷 2024-12-26 오후 11 45 28" src="https://github.com/user-attachments/assets/2bcaf1a2-aee9-48f6-80da-cb0bd2240a46" />
<img width="1512" alt="스크린샷 2024-12-26 오후 11 45 34" src="https://github.com/user-attachments/assets/26d16766-6bcd-44b9-bc10-1e04958fcf71" />
<img width="1512" alt="스크린샷 2024-12-26 오후 11 45 41" src="https://github.com/user-attachments/assets/3390cb37-3889-419d-a8c4-103e50e6eddc" />

### 7. 내 정보
- **사용자 정보 관리**:
  - 현재 레벨, 완료한 미션 수, 포인트 확인 가능.
  - 닉네임 중복 방지 및 수정 가능.
- **이벤트**:
  - 진행 중인 이벤트에서 쿠폰 발급.
  - 발급받은 쿠폰 확인 가능.
- **내가 작성한 글 관리**:
  - 작성한 글 리스트 및 삭제 기능 제공
<img width="1512" alt="스크린샷 2024-12-26 오후 11 45 19" src="https://github.com/user-attachments/assets/393e3693-78bf-4e70-ab6e-3a129d2c1660" />
<img width="1512" alt="스크린샷 2024-12-26 오후 11 50 34" src="https://github.com/user-attachments/assets/9ebbd64a-25db-43aa-a9cf-207f899ccaf6" />
<img width="1512" alt="스크린샷 2024-12-26 오후 11 50 49" src="https://github.com/user-attachments/assets/30252e61-c6a0-4870-b68f-69826b1a4bfb" />

### 8. 랭킹
- **포인트 및 레벨 기반 순위 제공**:
  - 사용자별 랭킹 리스트.
  - 내 순위 하이라이트로 UX 향상.
  - 닉네임 검색 기능 제공.
<img width="1512" alt="스크린샷 2024-12-26 오후 11 50 20" src="https://github.com/user-attachments/assets/8fd97fc6-a421-4cd1-b4a5-450ea509e1e6" />


---

## 기술 스택

- **Frontend**:
  - React.js
  - Axios
  - Kakao Map API
- **Backend**:
  - Spring Boot
  - JWT 인증
  - STOMP (WebSocket)
  - MySQL
  - AI 통합
- **AI**:
  - OpenAI API를 활용한 챗봇
  - AI 이미지 분석으로 미션 인증

---

