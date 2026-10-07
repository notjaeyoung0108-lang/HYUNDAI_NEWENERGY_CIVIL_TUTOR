# HYUNDAI NEW ENERGY CIVIL TUTOR

현대건설 뉴에너지 토목 면접을 위한 개인 학습 앱. 현대건설 공식 서비스나 공식 정답집이 아니다. 기존 `Lotte_IM`의 화면 스타일·문서 구조·Markdown 렌더러·교재 빌더를 재사용하고 학습 내용과 저장 공간은 별도로 구성했다.

## 실행

배포 주소: https://notjaeyoung0108-lang.github.io/HYUNDAI_NEWENERGY_CIVIL_TUTOR/#course

`index.html`을 브라우저에서 열면 된다. 서버·로그인·API·설치 없이 작동한다. 첫 화면은 `#course`다. 원하면 이 폴더에서 `python3 -m http.server 8080`을 실행하고 `http://localhost:8080`으로 접속할 수 있다. 파일 주소와 HTTP 주소의 학습 기록은 서로 공유되지 않는다.

## 학습

- `docs/ch1-flow`: 기본 Flow 8개 — 공정, 비용, 자재, 부적합, 변경, 발표.
- `docs/ch2-normal`: 정상 순서 7개 — 기초, 콘크리트, 단면재생, 탄소섬유, 자재, 배관 접점, 인계.
- `docs/ch3-problem`: PDF 14~18쪽 NewEnergy 5문항 — 조건, 계산, 직무별 대응, 누락 정보, 오답과 발표 예시.
- 기출 PT: 원문 페이지 보기, 준비·발표·질의응답 타이머, 답안 자동저장, 접힌 해설, 자기점검.
- 핵심 암기: 회상 카드 16개와 자기평가. Space로 질문·답변 전환.
- 기록: 읽기 진도, 답안·체크, JSON 내보내기, 확인 후 초기화. 자동 채점·기기간 동기화·JSON 가져오기는 제공하지 않는다.

## 원문과 해석

사용자 제공 `이벤트_기출문제.pdf`의 PDF 페이지 번호 기준이다. 원문 파일명은 macOS에서 자모 분리로 저장되어 있다. `reference/page-14.png`~`page-18.png`는 해당 페이지를 직접 렌더한 이미지이며 `source-extract.txt`는 추출 텍스트다. 도표·표는 이미지를 기준으로 확인했다.

기출에 주어진 금액·규제·벌칙은 시나리오 조건이며 실제 법률 또는 현장 기준으로 일반화하지 않는다. 문제에 불명확한 조건은 해설에서 별도 가정으로 표시했다. 특히 15쪽 C부서의 1개월 납기와 2개월 작업기간, 17쪽 합금안의 신규 용접량과 예상 보수량을 분리했다. 배관 문항도 NewEnergy 전체 5문항 대비를 위해 포함했다.

기술 원리 참고는 `reference/검증범위.md`에 기록했다. 개별 원전의 품질등급·설계·검사 절차에 대한 승인 문서가 아니다. 현재 범위는 제공된 NewEnergy 기출 대비이며 수소·해상풍력 등 모든 에너지 분야의 종합 교재는 아니다.

## 수정과 검증

Markdown 원문 수정 후 웹 데이터를 다시 만든다.

```sh
node tools/build-course.js
node --check app.js
python3 tools/check-calculations.py
python3 tools/browser-qa.py
```

브라우저 검증은 Python Playwright와 macOS의 Google Chrome을 사용한다. `tools/author-course.py`는 최초 집필용 생성기이며 다시 실행하면 챕터 1·2의 수동 수정을 덮어쓰므로 일반 편집 후에는 실행하지 않는다.

배포 가능한 정적 파일은 `index.html`, `style.css`, `hyundai.css`, `app.js`, `data/`, `reference/`다. GitHub Pages는 main 브랜치의 루트에서 배포한다. 기존 롯데 프로젝트와 기록은 변경하지 않았다.
