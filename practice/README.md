# 실습 — 무료 도구로 현장 프로그램 흉내 내기

현장에서 쓰는 P6, Navisworks, Aconex는 유료이고 대부분 Windows 전용이다. 이 실습은 **맥에서 무료로 돌아가는 도구**로 같은 개념을 같은 순서로 조작해 본다. 조작 버튼 이름은 다르지만 화면에서 다루는 것(관계, 래그, 여유, 기준선, 간섭, 문서 개정)은 같다.

| 현업 툴 | 실습 도구 | 실습 |
|---|---|---|
| Primavera P6 | **ProjectLibre** (무료, 간트 차트) + **mini_p6.py** (이 폴더, P6 용어로 계산) | P1 P2 P3 P6 P7 |
| Navisworks | **Blender + Bonsai** (무료 BIM 추가 기능, IfcClash) | P4 |
| Oracle Aconex | **스프레드시트 + CSV 템플릿** (미니 Aconex) | P5 |
| ERP·원가 시트 | **스프레드시트** (Numbers, Google Sheets, Excel 아무거나) | P3 P7 P8 P9 |

## 준비

1. **ProjectLibre** — https://www.projectlibre.com 에서 macOS용을 내려받아 설치한다. 실행이 안 되면 Java 런타임이 필요한 버전일 수 있으니 안내 문구를 따른다.
2. **Blender + Bonsai** — https://www.blender.org 에서 Blender를 설치한다. Blender의 Edit → Preferences → Get Extensions에서 "Bonsai"를 검색해 설치한다. 버전에 따라 메뉴 이름이 조금 다를 수 있다. 설치 안내는 https://bonsaibim.org 를 참고한다.
3. **mini_p6.py** — 맥에 기본으로 있는 Python 3로 돌아간다. 설치할 것이 없다. 터미널에서 이 저장소 폴더(Hyundai_NE)로 이동해 실행한다.

```sh
python3 practice/mini_p6.py --help
```

## mini_p6.py 사용법

P6처럼 Activity 목록(CSV)을 받아 전진·후진계산을 하고 Start, Finish, LS, LF, TF, FF를 출력한다. 7일 달력만 지원한다.

CSV 열: `id,name,od,rd,as,af,preds`

| 열 | 뜻 (P6 열 이름) | 예 |
|---|---|---|
| od | Original Duration (일) | 12 |
| rd | Remaining Duration. 비우면 od | 5 |
| as / af | Actual Start / Actual Finish (MM-DD) | 02-10 |
| preds | 선행. `선행ID:관계±래그`를 `;`로 구분 | `U1-AB-FDN-1020:SS+5;U1-AB-FDN-1010:FS` |

옵션: `--data-date MM-DD` (데이터 데이트, 필수) · `--logic retained` 또는 `--logic override` (진행 중 Activity 계산 옵션) · `--must-finish MM-DD` (프로젝트 준공 제약) · `--finish-by ID=MM-DD` (Activity 제약) · `--numbers` (날짜 대신 일차)

---

## P1 — 관계 걸기 (08강)

1. ProjectLibre에서 새 프로젝트를 만들고 08강 표의 Activity 6개를 이름·기간과 함께 입력한다.
2. 선행 칸에 관계를 건다. MS Project와 같은 형식(예: 앞 행 번호 뒤에 `SS+5d`)을 받는다. 입력이 안 되면 작업을 더블클릭해 작업 정보 창의 선행 작업 탭에서 유형(FS·SS·FF)과 지연(래그)을 고른다.
3. 간트 차트에서 1030과 1040 막대가 겹쳐 그려지는지 본다. SS 관계라서 겹친다.
4. 같은 내용을 mini_p6로 계산해 날짜를 비교한다.

```sh
python3 practice/mini_p6.py practice/data/p1_lesson08.csv --data-date 02-02
```

확인: 1020은 1010이 끝난 다음 날이 아니라 래그 2일이 지난 뒤에 시작한다. 1050은 1040 종료 2일 뒤에 끝난다(FF+2).

## P2 — 주공정과 여유 (09강)

```sh
python3 practice/mini_p6.py practice/data/p2_lesson09.csv --data-date 01-01 --numbers
```

1. 출력의 Start(ES)·Finish(EF)·LS·LF·TF·FF가 09강 표와 같은지 한 줄씩 대조한다. `--numbers`는 09강 표처럼 경계 일차로 보여 준다.
2. CSV에서 C의 od를 5 → 11로 바꿔 다시 돌린다. ◀ 주공정 표시가 어디로 옮겨 가는지 본다.
3. ProjectLibre에도 같은 8개를 넣고 주공정 표시 기능(간트 차트 서식의 Critical 표시)을 켜서 같은 막대가 빨갛게 되는지 확인한다.

## P3 — 기준선과 S-커브 (10강)

1. P2 파일에 10강 표의 예산을 Activity별로 적어 둔다.
2. ProjectLibre에서 기준선을 저장한다(Project 메뉴의 Baseline 저장 기능).
3. 스프레드시트에 1~25일 행을 만들고, 각 Activity의 일당 금액을 그 Activity가 진행되는 날에만 넣는다. 일별 합계와 누계 열을 만든다.
4. 누계로 꺾은선 그래프를 그리면 S-커브다. 5일 단위 누계가 10강 표와 같은지 확인한다.

## P4 — 간섭검토 (11강)

예제 모델 두 개가 있다. 보조건물 벽·슬래브·보·매입판(토목)과 급수·배수 배관(기계)이다.

- `practice/data/p4_civil.ifc`
- `practice/data/p4_piping.ifc`

1. Blender에서 Bonsai로 두 IFC를 연다(첫 파일을 열고, 두 번째는 링크나 추가 불러오기로 겹친다).
2. Bonsai의 품질·조정(Quality and Coordination) 영역에서 Clash Detection을 연다. Clash Set을 하나 만들고 Group A에 `p4_civil.ifc`, Group B에 `p4_piping.ifc`를 넣는다.
3. 모드를 **Intersection**(Hard)으로 두고 실행한다. 몇 건이 나오는가?
4. 모드를 **Clearance**, 거리 **0.05 m**(50mm)로 바꿔 다시 실행한다. 새로 나온 건은 무엇인가?
5. 한 건을 골라 "원인 → 조치 → 담당"을 한 줄로 적는다. 예: `FW-0103 × W-3B — 벽에 관통 개구부 없음 → RFI로 설계사에 개구부·슬리브 추가 요청 → 배관 설계 / 토목 설계`.

<details><summary>정답 확인 (먼저 직접 해 본 뒤 펼친다)</summary>

Hard 3건: FW-0103 × 외벽 W-3B(개구부 없는 관통), FW-0104 × 보 B-12(관 상단이 보 하부보다 50mm 높음), DR-0201 × 슬래브 SL-01(바닥 개구부 없음). FW-0102는 개구부 OP-01을 지나므로 간섭이 아니다.

Clearance 50mm: FW-0105 × 보 B-12(이격 30mm)가 새로 나온다. FW-0104도 함께 나오는데, 이미 겹친 Hard 건이 거리 기준에도 걸린 것이다. 실제 회의에서는 Hard와 Clearance를 나눠 세어 중복을 없앤다.
</details>

막히면: Bonsai 버전에 따라 메뉴 위치가 다르다. Bonsai 문서에서 Clash Detection 항목을 찾는다. 두 파일을 Clash Set에 넣는 것까지만 되면 나머지는 실행 버튼 하나다.

## P5 — 미니 Aconex (05·06강)

템플릿 세 개를 스프레드시트로 연다.

- `practice/data/p5_document_register.csv` — 문서대장
- `practice/data/p5_transmittal_log.csv` — Transmittal 기록
- `practice/data/p5_rfi_log.csv` — RFI 기록

**05강**
1. 문서대장에 TR-0921로 받은 도면 30건을 입력한다(번호와 제목은 지어도 된다. 형식은 `GR1-RB-C-DWG-1203`).
2. 그중 4건이 Rev.0 → Rev.1로 바뀌었다고 하고, 옛 개정 행의 Status를 `Archived`, Superseded By를 `Rev.1`로 바꾼다.
3. 필터로 Status = Published만 보이게 한다. 이것이 "지금 현장에서 써도 되는 도면" 목록이다.

**06강**
1. RFI 기록에서 RFI-C-0047 한 건의 상태가 바뀔 때마다 새 행을 날짜와 함께 남긴다: Open → Answered → DCN 발행 → 시공상세도 제출(Code 2) → 재제출 → Closed.
2. 각 단계에 참조 도면 번호와 개정을 반드시 적는다. 어느 개정을 보고 질문했는지가 빠지면 답변이 무엇을 바꿨는지 추적할 수 없다.

## P6 — 진도 업데이트와 계산 옵션 (27·28강)

```sh
python3 practice/mini_p6.py practice/data/p6_lesson27_before.csv --data-date 02-02
python3 practice/mini_p6.py practice/data/p6_lesson27_after.csv  --data-date 03-01
```

1. before와 after 결과를 나란히 놓고 1060(기초 매트 타설) 종료일이 얼마나 밀렸는지 본다. 두 결과가 27강의 업데이트 전·후 표와 같은지 대조한다.
2. after CSV에서 1020의 rd를 5 → 8로 바꾸면 무엇이 바뀌는가? 바뀌지 않는다면 그 이유를 출력의 TF로 설명한다.

```sh
python3 practice/mini_p6.py practice/data/p6_lesson28.csv --data-date 03-01 --logic retained --must-finish 03-15
python3 practice/mini_p6.py practice/data/p6_lesson28.csv --data-date 03-01 --logic override --must-finish 03-15
```

3. 두 옵션의 3060 종료일과 TF가 28강 본문(Retained Logic 03-18 / −3, Progress Override 03-12 / +3)과 같은지 확인한다.
4. ProjectLibre에는 이 옵션이 없다. 실제 P6에서는 일정 계산(F9) 창의 옵션에서 고른다.

## P7 — 촉진 비교 (30강)

1. 스프레드시트에 30강 표의 Activity별 기간·최대 단축일·비용구배를 넣는다.
2. 경로별 기간 열을 만들고, 하루씩 줄일 때마다 "목표보다 긴 경로들에 모두 걸리는 가장 싼 단축"을 골라 행을 추가한다.
3. 목표 기간에 도달할 때까지 누적 촉진비를 구하고 30강 결과와 대조한다.
4. 지체상금 단가를 2,400만원/일로 바꿔, 어느 날부터 촉진보다 지체상금이 싸지는지 찾는다.

## P8 — 기성과 EVM (31강)

1. 31강의 기성 청구서를 스프레드시트로 옮긴다: 내역 항목, 계약금액, 전회 누계 진도, 금회 진도, 금회 청구, 유보금, 순청구액.
2. EV = Σ(예산 × 진도), SPI = EV/PV, CPI = EV/AC, EAC = BAC/CPI 셀을 만든다.
3. 상부 철근 진도를 50% → 60%로 바꿔 청구액, EV, SPI, CPI, EAC가 어떻게 움직이는지 본다. CPI가 1보다 작을 때 EAC가 계약금액에 가까워진다는 것이 무슨 뜻인지 한 줄로 적는다.

## P9 — 자재 배분 시간축 (17강)

1. 열에 M4~M7, 행에 재고·입고·B·A·C를 만든다.
2. 17강의 안 1·안 2를 각각 넣고, 월말 재고 = 전월 재고 + 입고 − 배분으로 계산한다. 음수가 나오면 빨갛게 표시한다(조건부 서식).
3. 각 안의 확정 손실과 기회의 기대값(확률 × 금액) 셀을 만든다. 확률 셀을 바꿔 가며 두 안의 결론이 뒤집히는 확률(손익분기)을 찾고 17강과 대조한다.
4. 같은 표를 기출 15쪽(Q15) 숫자로 바꿔 본다. 160 / 180 / 220 / 250억원이 나오면 성공이다.

---

이 폴더의 IFC 모델은 `tools/make-practice-ifc.py`로 다시 만들 수 있다(ifcopenshell 필요). 모든 숫자와 이름은 가상 현장 기준이다.
