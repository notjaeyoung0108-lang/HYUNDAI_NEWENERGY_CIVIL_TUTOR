# HYUNDAI NEW ENERGY CIVIL TUTOR

현대건설 뉴에너지 토목 면접과 입사 후 실무 이해를 위한 개인 학습 앱. 현대건설 공식 서비스나 공식 정답집이 아니다.

## 실행

배포 주소: https://notjaeyoung0108-lang.github.io/HYUNDAI_NEWENERGY_CIVIL_TUTOR/#course

`index.html`을 브라우저에서 열면 된다. 서버·로그인·설치가 필요 없다. 원하면 이 폴더에서 `python3 -m http.server 8080`을 실행하고 `http://localhost:8080`으로 접속한다. 파일 주소와 HTTP 주소의 학습 기록은 서로 공유되지 않는다.

## 무엇을 배우나

가상 현장 **가람 원자력 1·2호기**가 착공부터 상업운전까지 지어지는 이야기 45강이다. 각 강은 앞 강의 사건에서 시작해 다음 강의 사건으로 끝난다. 용어는 그 일이 처음 생기는 장면에서 정의 박스(한글·English·약어·현장말·영문 예문)로 한 번 정의되고, 뒤 강에서 다른 상황으로 다시 나온다. 설계 근거(Elaboration Theory, 4C/ID, 서사 메타분석, 어휘 습득, worked example, self-explanation, retrieval·spacing)는 `authoring/OUTLINE.md`에 있다.

| 장 | 내용 | 기출 |
|---|---|---|
| 0 | 전체 그림 — 현장 5년, 조직, 건물·계통 | |
| 1 | 계약·문서(Aconex)·P6 공정표·BIM·ITP | PDF 14쪽 문제1 |
| 2 | 자재 — 구매, 납기, 인수검사, 보관, 배분 | PDF 15쪽 |
| 3 | 첫 콘크리트 — 굴착부터 격납건물, 현장의 하루 | |
| 4 | 공정 지연 — 업데이트, 지연 책임, 촉진, 기성, 설계변경 | PDF 14쪽 문제2 |
| 5 | 품질 — NCR, 처리, 원전의 정직, 중대재해 | PDF 16쪽 |
| 6 | 배관과 용접 — 아이소, WPS, NDE, 재작업 | PDF 17쪽 |
| 7 | 보수와 보강 | PDF 18쪽 |
| 8 | 시운전과 인계, 다음 무대(AP1000·SMR·해체) | |

- **빠른 경로 ★**: 기출을 먼저 풀 수 있는 22강. 교재 화면에서 "빠른 경로 ★와 기출만 보기"로 거른다.
- **기출 PT**: 원문 페이지, 풀기 전 체크, 단계별 힌트, 준비·발표·질의응답 타이머, 답안 자동저장, 접힌 해설, 자기점검.
- **용어 카드**: 읽음으로 표시한 강의 정의 박스가 카드가 된다. 영문을 보고 뜻을 말한 뒤 뒤집는다. 1·3·7·14·30일 간격 반복.
- **용어사전**: 정의 박스 전체 검색. 처음 정의된 강과 다시 나오는 강을 연결한다.
- **기록**: 진도, 빠른 경로, 답안, 카드 단계. JSON 내보내기와 확인 후 초기화.

## 실습

`practice/README.md` — 맥에서 무료로 돌아가는 도구로 현장 프로그램을 흉내 낸다. P6 대신 ProjectLibre와 `practice/mini_p6.py`(P6 용어로 계산하는 학습용 CPM 계산기), Navisworks 대신 Blender + Bonsai 간섭검토(예제 IFC 두 개), Aconex 대신 CSV 템플릿, 원가·기성은 스프레드시트.

## 원문과 해석

사용자 제공 `이벤트_기출문제.pdf`의 PDF 페이지 번호 기준이다. `reference/page-14.png`~`page-18.png`는 해당 페이지를 렌더한 이미지이고 `source-extract.txt`는 추출 텍스트다. 표·그림은 이미지를 기준으로 확인했다. 기출의 금액·규제·벌칙은 시나리오 조건이며 실제 법률·현장 기준으로 일반화하지 않는다. 해석이 갈리는 곳(17쪽 ①의 올림/반올림, 18쪽 소수일)은 해설에 두 해석을 모두 계산했다.

## 수정과 검증

원고는 `docs/chN/NN.md`(레슨)와 `docs/chN/Q*.md`(기출), 순서와 기출 메타데이터는 `docs/course.json`이다. 집필 규칙은 `authoring/OUTLINE.md`를 따른다. 수정 후 웹 데이터를 다시 만든다.

```sh
node tools/build-course.js --strict   # 중복 정의·닫히지 않은 블록이 있으면 실패
node --check app.js
python3 tools/check-calculations.py   # 기출 계산 독립 검산 + 해설 숫자 대조
python3 tools/browser-qa.py           # Python Playwright + macOS Google Chrome
```

`tools/make-practice-ifc.py`는 실습 IFC를 다시 만들 때만 쓴다(ifcopenshell 필요).

배포 가능한 정적 파일은 `index.html`, `style.css`, `hyundai.css`, `app.js`, `data/`, `reference/`다. GitHub Pages는 main 브랜치의 루트에서 배포한다.
