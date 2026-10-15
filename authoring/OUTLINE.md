# 집필 기준 — 가람 원자력 1·2호기 이야기 (45강 + 기출 6편)

이 문서는 docs/ 의 모든 레슨이 따르는 정본이다. 레슨을 쓰기 전에 끝까지 읽는다.

## 1. 학습 설계 원칙 (근거 연구)

| 원칙 | 레슨에서 지킬 것 |
|---|---|
| Elaboration Theory (Reigeluth) | 01~03강이 전체 축소판(epitome). 이후 각 강은 그 그림의 한 칸을 확대한다. 장 첫 강은 "지금 지도의 어디인가"를 한 줄로 짚는다. |
| 4C/ID (van Merriënboer) | 용어는 그 일이 생기는 장면에서 처음 등장한다(just-in-time). 용어 목록을 먼저 나열하지 않는다. |
| 서사 > 설명문 (Mar et al., 2021) | 하나의 가상 현장이 시간 순서로 진행된다. 각 강은 앞 강의 결과로 시작해 다음 강의 사건으로 끝난다. |
| 정의 + 다문맥 반복 (어휘 습득 연구) | 처음 나올 때 정의 박스로 명시적 정의를 준다. 이후 강에서 같은 용어를 다른 상황으로 다시 쓴다(재정의하지 않고 **굵게** 표시). |
| Worked example → fading | 계산은 처음엔 전 과정, 뒤로 갈수록 한 단계씩 비운다. |
| Self-explanation (Chi) | 각 강에 "먼저 생각해 보기" 1~2개. 답은 접어 둔다. |
| Retrieval + spacing (Dunlosky) | 각 강 끝 확인 문제 5개 = 이번 강 3 + 이전 강 2(3~10강 전). 요약 박스 금지. |

## 2. 금지 사항

- **선배·사수가 말로 용어를 설명하는 장면 금지.** 용어는 문서·화면·현장 사물이 등장하고 본문(서술자)이 정의한다. 사람은 역할(공정 담당, 품질 검사원, 발주처 감독 등)로만 등장하고 짧은 업무 발화만 한다.
- 요약 박스, "정리하면" 문단 금지.
- 확실하지 않은 규격 조항 번호·허용오차·수치를 지어내지 않는다. 확실하지 않으면 "프로젝트 시방서·절차서로 정한다"라고 쓴다.
- 실제 회사·사업과 혼동되는 서술 금지. 이야기 속 현장은 가상이다. 실제 사례는 "실제로는" 문단에서 출처가 확실한 것만 쓴다.
- 이모지 남용 금지(❓ 하나만 허용).

## 3. 이야기 설정 (스토리 바이블)

- **현장**: 가람 원자력 1·2호기 (가상). 한국형 가압경수로 APR1400형 2기. 바닷가 부지.
- **당사**: 주설비공사 시공사 (실제 국내 원전에서는 현대건설 같은 시공사가 맡는 자리).
- **발주처**: 이야기에서는 "발주처". 실제 국내 원전 발주처는 한국수력원자력(한수원)이라고 01강에서 한 번 밝힌다.
- **종합설계(A/E)**: 이야기에서는 "설계사". 실제는 한국전력기술 같은 회사.
- **주기기 공급사**: 원자로·증기발생기 등 (실제는 두산에너빌리티 같은 회사).
- **규제기관**: 원자력안전위원회(원안위), 한국원자력안전기술원(KINS) — 실제 기관명 사용 가능.
- **독자 위치**: 토목 신입 공사기사. 서술은 3인칭 현재형: "신입 기사의 메일함에 Transmittal 이 도착한다."
- **가상 일정 (1호기 기준, 착공 = M0)**: M0 주설비 착공 → M3 원자로건물 굴착·암반 검측 → M6 First Concrete(원자로건물 기초 매트 최초 타설) → M14 격납건물 라이너플레이트(CLP) 설치 → M24 돔 인양 → M30 원자로 용기 설치 → M44 냉각재계통 상온수압시험(CHT) → M48 고온기능시험(HFT) → M54 연료장전 → M60 상업운전. 레슨에서 "가상 일정"임을 밝힌다.
- **번호 체계** (모든 강에서 같은 형식):
  - Activity ID: `U1-RB-FDN-1030` (호기-건물-구역-번호). 건물: RB 원자로건물, AB 보조건물, TB 터빈건물, CB 복합건물, IS 취수구조물.
  - 문서번호: `GR1-RB-C-DWG-1203 Rev.2` (현장-건물-분야(C 토목, M 기계, E 전기)-종류-번호).
  - RFI: `RFI-C-0047`, NCR: `NCR-C-0112`, 검측요청: `IR-C-0583`, Transmittal: `TR-0921`.
- **역할**: 현장소장, 공사 담당, 공무 담당, 공정 담당(P6 운영), 품질 검사원(QC), 품질보증(QA), 안전 담당, 자재 담당, 설계사 현장 주재원, 발주처 감독, 협력사 반장.
- **툴**: P6(공정), Aconex(문서·RFI·Transmittal), Navisworks(간섭·4D), Revit/Tekla(모델), ERP(자재·원가). 현대건설이 프로젝트에 쓴 기록이 확인된 것: Revit·Navisworks, Autodesk Construction Cloud, Aconex(쿠웨이트 셰이크 자베르 코즈웨이), Tekla(Trimble 공동개발), 자체 SCMP. P6 는 "업계 표준"으로 표기(현대건설 직접 사용 공개자료는 미확인).

## 4. 레슨 파일 형식

파일: `docs/chN/NN.md` (예: `docs/ch1/08.md`). 첫 줄 제목 `# NN. 제목`.

```markdown
# 08. 순서를 잇다

> **지난 장면** 07강에서 기초공사를 Activity 40개로 쪼갰다. (한두 문장)

본문: 장면 → 등장 문서/화면 (표·코드블록으로 재현) → 서술자의 해설.
본문 소제목은 ## 로 2~4개.

::: term 선후행 관계 | Relationship (Logic) | - | 로직
두 작업 중 어느 쪽이 언제 시작하거나 끝날 수 있는지 정한 규칙. (정의 1~3문장)
EN: "FDN-1040 is linked SS+4 to FDN-1030."
:::

<details><summary>❓ 먼저 생각해 보기 — 매입물 설치는 왜 SS+4 일까?</summary>

답 (2~5문장)
</details>

## 실습 (해당 강만)
practice/README.md 의 실습 번호와 할 일 한 줄.

## 다음 장면
다음 강의 사건으로 이어지는 2~3문장 (훅).

## 확인 문제
<details><summary>1. 질문</summary>

답
</details>
(5개: 이번 강 3개 + 이전 강 2개. 이전 강 문제는 질문 끝에 "(05강)" 표기)
```

**정의 박스 규칙**: `::: term 한글명 | English | 약어 | 현장말` — 없는 칸은 `-`. 본문은 정의 1~3문장 + `EN:` 실제 영문 문서에서 쓰이는 예문 한 줄(가능하면 넣는다). 한 강에 3~8개. 같은 용어를 두 번 정의하지 않는다(아래 명세의 "정의"에 배정된 강에서만 정의). 이전 강 용어는 **굵게** 쓰고 재정의하지 않는다.

**분량**: 본문 2,000~3,500자(정의 박스·문제 제외). 표·코드블록 1개 이상 (문서/화면 재현).

**계산**: 숫자가 나오면 식을 끝까지 보인다. 단위를 매 줄에 쓴다.

**마크다운 제약**: 렌더러는 제목, 문단, 목록(-, 1.), 표, 코드블록, 인용(> 한 줄), `<details><summary>…</summary>` 블록(닫는 `</details>` 는 단독 줄), `::: term` 블록, **굵게**, `코드`, https 링크만 지원한다. 이미지·기타 HTML 금지. 인용(>)은 한 줄짜리만. 표 셀 안에 `|` 금지.

## 5. 장 구성과 레슨별 명세

빠른 경로(★): 기출을 빨리 풀기 위해 먼저 읽는 22강 — 01 03 04 07 08 09 12 14 15 17 24 29 30 33 34 35 36 38 39 40 41 42.

### 0장. 전체 그림 (ch0)

**01. 5년을 한 장면으로 ★** — 사건: 착공식 날, 현장 사무실 벽의 Level 1 공정표(마일스톤 10개)를 처음 본다. 가상 일정 M0~M60 를 한 줄 그림으로. 결말에 "이 그림의 칸 하나하나가 앞으로 45강" 예고.
정의: EPC, 주설비공사(Main Construction Works), 마일스톤(Milestone), First Concrete(FC), 상업운전(COD), 준공(Completion).
"실제로는": 국내 원전 발주처 한수원, 현대건설 APR1400 시공 실적(신한울 1·2, 바라카 1~4, 새울 1·2), 신한울 3·4 주설비 수주.
→ 다음: 이 일을 누가 하는가.

**02. 누가 무엇을 하는가** — 사건: 첫 주간회의 참석자 명단과 조직도.
정의: 발주처(Owner/Employer), 시공사(Contractor), 협력사(Subcontractor), 설계사(A/E, Architect-Engineer), 주기기(NSSS, Nuclear Steam Supply System), 현장대리인(Site Representative), 공무(Contract & Cost Admin), QA/QC.
→ 다음: 그 사람들이 짓는 건물.

**03. 건물과 계통의 지도 ★** — 사건: 부지 배치도(Plot Plan)를 펼친다. RB/AB/TB/CB/취배수. 1차 계통 vs 2차 계통 한 그림(원자로→증기발생기→터빈→복수기→급수).
정의: 배치도(Plot Plan), 원자로건물/격납건물(Reactor Building / Containment), 보조건물(Auxiliary Building), 터빈건물(Turbine Building), 1차 계통(Primary System), 2차 계통(Secondary System), 안전관련(Safety-related), 내진범주 I(Seismic Category I).
→ 다음: 이 모든 것을 약속한 계약서.

### 1장. 착공 전 — 계약·문서·공정표 (ch1)

**04. 계약서가 정하는 것 ★** — 사건: 공무 담당 책상의 계약서 요약표(계약금액, 준공일, 지체상금 조항).
정의: 계약기간(Contract Period), 준공기한(Completion Date), 지체상금/L/D(Liquidated Damages), 공기연장(EOT, Extension of Time), 실행예산(Execution Budget), 원가율(Cost Ratio), 계약문서 우선순위(Order of Precedence).
→ 다음: 계약서 다음으로 도착하는 수천 장의 도면.

**05. 도면이 도착하다** — 사건: Aconex 로 Transmittal TR-0921 이 도착, 도면 30장 Rev.0 → 일부 Rev.1.
정의: 설계도서(Design Documents), 시방서(Specification), 도면 개정(Revision, Rev), 시공용 발행(IFC, Issued for Construction — IFC 파일형식과 다름 주의), 문서대장(Document Register), 문서 송부(Transmittal), 공통데이터환경(CDE)과 ISO 19650 상태(WIP/Shared/Published/Archived), Aconex.
실습: P5 (미니 Aconex 문서대장).
→ 다음: 도면끼리 안 맞는다.

**06. 묻고 답받기** — 사건: 철근 도면과 매입물 도면이 충돌 → RFI-C-0047. 시공상세도 제출.
정의: RFI(Request for Information), 제출물(Submittal), 시공상세도(Shop Drawing), 승인 코드(Approval Code — 체계는 프로젝트마다 다름), 현장 설계변경 요청(FCR/DCN 등 "프로젝트별 명칭"으로 소개).
실습: P5 (RFI 흐름).
→ 다음: 이제 일정 짜기.

**07. 일을 쪼개다 ★** — 사건: 공정 담당이 P6 에서 원자로건물 기초 WBS 를 만든다.
정의: WBS(Work Breakdown Structure), Activity, Activity ID, 공정표 수준(Level 1~5 Schedule), 원기간(Original Duration), 달력(Calendar), Activity Code, P6(Primavera P6 — 업계 표준).
→ 다음: 쪼갠 일을 이어야 한다.

**08. 순서를 잇다 ★** — 사건: P6 화면 표 (Predecessor, Relationship, Lag).
정의: 선후행 관계(Relationship/Logic), FS·SS·FF·SF, 래그(Lag), 리드(Lead/음수 Lag), 열린 끝(Open End/Dangling), 네트워크 표현(AON/AOA), 더미(Dummy Activity).
자기설명: 매입물 설치는 왜 SS+4 인가.
실습: P1 (ProjectLibre 에 관계 걸기).
→ 다음: 어느 길이 가장 긴가.

**09. 가장 긴 길 ★** — 사건: 기초공사 네트워크 소형 예제(6~8개 Activity)로 전진·후진 계산 전 과정(worked example). 기출 14쪽과 다른 숫자.
정의: 전진계산(Forward Pass), 후진계산(Backward Pass), ES/EF/LS/LF, 총여유(Total Float, TF), 자유여유(Free Float, FF), 주공정(Critical Path), 최장경로(Longest Path), 준주공정(Near-critical), 제약조건(Constraint).
실습: P2.

**10. 사람·장비·돈을 싣다** — 사건: 공정표에 자원·비용 로딩, 기준선 저장.
정의: 자원 배정(Resource Loading), 비용 배정(Cost Loading), S-커브(S-curve), 기준선(Baseline), 계획가치(PV, Planned Value), 자원 평준화(Resource Leveling).
실습: P3.
→ 다음: 짓기 전에 3D 로 지어 본다.

**11. 3D 로 먼저 짓다** — 사건: 주간 BIM 회의, Navisworks 간섭 결과 23건.
정의: BIM, 모델 상세수준(LOD, Level of Development), 간섭검토(Clash Detection), 4D 시뮬레이션(4D, TimeLiner), 통합 모델(Federated Model), IFC 파일(Industry Foundation Classes), Revit/Tekla/Navisworks 역할.
"실제로는": 현대건설 Revit·Navisworks 활용 사례, Tekla(Trimble) 공동개발.
실습: P4 (Bonsai 로 간섭검토).
→ 다음: 품질 계획.

**12. 검사를 미리 약속하다 ★** — 사건: 기초 매트 ITP 표 (단계별 Hold/Witness/Review).
정의: 품질보증계획(QA Program), 10 CFR 50 Appendix B, KEPIC, 검사·시험계획서(ITP), 보류점(Hold Point), 입회점(Witness Point), 검토점(Review Point), 검측요청서(Inspection Request, IR), 품질등급(Quality Class — 프로젝트별 분류).
→ 다음(장 끝): 기출 Q14-1 — 네트워크에서 주공정 찾기.

**Q14-1. 기출 — Y구역의 주공정 (PDF 14쪽 문제1)** (작성: 메인)

### 2장. 자재가 들어온다 (ch2)

**13. 무엇을 얼마나 사나** — 사건: 물량산출서와 자재청구.
정의: 물량산출(Quantity Take-off, MTO), 내역서(BOQ, Bill of Quantities), 자재청구서(MR, Material Requisition), 구매주문(PO, Purchase Order), 벌크 자재(Bulk Material), 태그 자재(Tagged Item), 발주처 지급 자재(Owner-furnished Material).
→ 다음: 공급사를 쫓아간다.

**14. 공급사를 쫓아가다 ★** — 사건: 철근·배관 자재 납기 추적표, 분할 납품(차수).
정의: 납기 독촉(Expediting), 장납기 품목(Long-lead Item), 분할 납품(Partial Delivery / Lot), 공장 검사(Shop Inspection), 출하 전 검사(Source Inspection), 공장 인수시험(FAT).
→ 다음: 자재가 도착한다.

**15. 현장에 도착하면 ★** — 사건: 인수검사 현장, 손상 자재와 서류 확인.
정의: 인수검사(Receiving Inspection), 재료시험성적서(MTR/CMTR), 적합성 증명(CoC, Certificate of Conformance), 히트 번호(Heat Number), 추적성(Traceability), 위조·부정품(CFSI, Counterfeit, Fraudulent and Suspect Items), 상용품 품질검증(CGID, Commercial Grade Item Dedication).
→ 다음: 보관.

**16. 보관하고 내주다** — 사건: 자재 야적장과 창고, 보관등급 표지, 불출 대장.
정의: 보관등급(Storage Level — 등급별 환경 조건, 구체 기준은 프로젝트 절차서), 보존관리(Preservation), 불출(Material Issue), 재고(Inventory), 보류 표찰(Hold Tag), 격리구역(Quarantine Area).
→ 다음: 모자란다.

**17. 모자랄 때 나누는 법 ★** — 사건: 장마로 입고 지연, 세 공종이 같은 자재를 요구. worked example(기출 15쪽과 다른 숫자): 시간축(월 단위) 그리기, 확정 손실 vs 기대 이익 구분.
정의: 배분 우선순위(Allocation Priority), 확정 손실(Committed Loss) vs 기회(Opportunity), 기대값(Expected Value), 대체 조달(Alternative Sourcing), 타 현장 전용(Inter-site Transfer), 의사결정 기록(Decision Log).
실습: P9 (배분 시간축 스프레드시트).
→ 다음: 자재를 공정표에 넣는다.

**18. 자재와 공정을 잇다** — 사건: 조달 Activity 를 P6 에 넣고 자재 지연이 **총여유**를 먹는 걸 본다. ERP·SCMP 연결.
정의: 조달 Activity(Procurement Activity), 현장 필요일(ROS, Required-on-site Date), 자재 소요계획(MRP), ERP, SCMP(현대건설·이엔지소프트 공동 개발 BIM 기반 자재관리 플랫폼 — 2022 보도).
→ 다음(장 끝): 기출 Q15.

**Q15. 기출 — H자재 3개월치를 세 부서에 (PDF 15쪽)** (작성: 메인)

### 3장. 첫 콘크리트 (ch3)

**19. 땅을 확인하다** — 사건: 원자로건물 굴착 완료, 암반 검측.
정의: 부지정지(Site Grading), 굴착(Excavation), 기초 지반 검측(Foundation Inspection / Rock Mapping), 버림 콘크리트(Lean Concrete / Mud Mat), 측량 기준점(Benchmark), 방수(Waterproofing).
→ 다음: 철근.

**20. 철근을 엮다** — 사건: 기초 매트 대구경 철근 배근 검측.
정의: 배근(Rebar Placement), 피복 두께(Concrete Cover), 겹이음(Lap Splice), 기계적 이음(Mechanical Splice / Coupler), 정착(Anchorage / Development Length), 철근 가공표(Bar Bending Schedule). 현장말(결속선 등)은 표준어와 함께.
→ 다음: 철근 사이의 매입물.

**21. 콘크리트에 묻히는 것들** — 사건: 매입판·앵커볼트 위치 검측, 간섭(11강 결과) 처리.
정의: 매입물(Embedment), 매입판(Embedded Plate), 앵커볼트(Anchor Bolt), 슬리브(Sleeve), 관통부(Penetration), 템플릿(Template), 위치 허용오차(Tolerance — 값은 시방서).
→ 다음: 거푸집과 타설 계획.

**22. 붓기 전의 마지막 확인** — 사건: 타설계획서와 타설 전 점검표(Pour Card), Hold Point 해제 서명.
정의: 거푸집(Formwork, 현장말 형틀·와꾸), 동바리(Shoring), 타설계획서(Pour Plan), 시공이음(Construction Joint), 콜드조인트(Cold Joint), 타설 전 점검표(Pour Card / Pre-placement Checklist).
→ 다음: First Concrete.

**23. First Concrete** — 사건: M6, 원자로건물 기초 매트 최초 타설. 레미콘 행렬.
정의: 배합설계(Mix Design), 슬럼프(Slump), 공기량(Air Content), 공시체(Test Specimen/Cylinder), 다짐(Consolidation/Vibration), 재료분리(Segregation), 매스콘크리트(Mass Concrete), 수화열(Heat of Hydration), 온도균열(Thermal Crack).
→ 다음: 굳힌 뒤 확인.

**24. 굳히고 확인하다 ★** — 사건: 양생, 7·28일 강도, 거푸집 해체 후 표면 결함 발견(작은 곰보).
정의: 양생(Curing), 압축강도 시험(Compressive Strength Test), 비파괴시험(반발경도·초음파 — Rebound Hammer, UPV), 곰보(Honeycomb), 공극(Void), 박리(Scaling/Delamination), 박락(Spalling), 균열(Crack).
→ 다음: 격납건물.

**25. 격납건물이라는 그릇** — 사건: CLP 모듈 인양, 텐던 덕트, 돔 인양(M24).
정의: 격납건물 라이너플레이트(CLP, Containment Liner Plate), 대형 인양(Heavy Lift), 프리스트레스 텐던(Prestressing Tendon / Post-tensioning), 돔(Dome), 구조건전성시험(SIT), 종합누설률시험(ILRT). (세부 수치 금지, 개념만)
→ 다음: 이 모든 일이 매일 어떻게 돌아가는가.

**26. 현장의 하루** — 사건: 07:00 TBM → 작업허가 → 검측요청 → 작업일보 → 3주 공정회의.
정의: TBM(Tool Box Meeting), 작업허가(PTW, Permit to Work), 위험성평가(Risk Assessment), 작업안전분석(JSA), 작업일보(Daily Report), 3주 상세공정(3-Week Look-ahead), 주간 공정회의(Weekly Progress Meeting).
→ 다음: 진도를 재는 날.

### 4장. 공정이 밀린다 (ch4)

**27. 진도를 재다** — 사건: 월말 P6 업데이트.
정의: 데이터 데이트(Data Date), 실제 시작·종료(Actual Start/Finish), 잔여기간(Remaining Duration), 진도율 유형(Duration / Physical / Units % Complete), 일정 계산(Schedule, F9), 진도 측정 기준(Rules of Credit).
실습: P6.
→ 다음: 순서가 어긋난 실적.

**28. 계획과 실제가 어긋날 때** — 사건: 순서를 어긴 실적, 음수 여유.
정의: 순서 이탈(Out-of-sequence Progress), 유지 논리(Retained Logic), 진도 우선(Progress Override), 음수 여유(Negative Float), 기준선 비교(Variance).
실습: P6.
→ 다음: 누구 책임인가.

**29. 누구의 지연인가 ★** — 사건: 발주처 설계 변경으로 기초 일부 대기, 동시에 당사 장비 고장.
정의: 면책 지연(Excusable Delay), 보상 지연(Compensable Delay), 비면책 지연(Non-excusable Delay), 동시 지연(Concurrent Delay), 지연 영향 분석(TIA, Time Impact Analysis), 프래그넷(Fragnet), 클레임(Claim). (**EOT** 는 04강 용어 재사용)
→ 다음: 시간을 돈으로 산다.

**30. 시간을 돈으로 사다 ★** — 사건: 공정회의에서 촉진 vs 지체상금 비교표. worked example(기출 14쪽과 다른 숫자): 여러 경로가 동시에 줄어야 하는 이유, 공통 Activity 촉진.
정의: 공기 단축(Schedule Compression), 크래싱(Crashing), 패스트트래킹(Fast-tracking), 비용구배(Cost Slope), 촉진비(Acceleration Cost), 공기 회복 계획(Recovery Schedule). 52시간 근무제·야간작업의 안전 위험을 촉진의 제약으로 다룬다.
실습: P7.
→ 다음: 돈의 진도.

**31. 돈의 진도** — 사건: 월 기성 청구, EVM 지표.
정의: 기성(Progress Payment / Interim Payment), 기성 청구서(Payment Application), 획득가치(EV), 실제원가(AC), SPI, CPI, 완료시점 예상원가(EAC), 유보금(Retention).
실습: P8.
→ 다음: 계약을 바꾼다.

**32. 계약을 바꾸다** — 사건: 발주처가 자재 사양 변경을 요청 — 공기·금액을 같이 협상해야 하는 이유.
정의: 설계변경(Change Order / Variation Order), 변경 요청(Change Request), 물가변동(Escalation), 동시기록(Contemporaneous Records), 서면 통지(Notice) 기한.
→ 다음(장 끝): 기출 Q14-2.

**Q14-2. 기출 — 추가상황 세 가지 (PDF 14쪽 문제2)** (작성: 메인)

### 5장. 품질이 깨질 때 (ch5)

**33. 이상하다고 느낄 때 ★** — 사건: 검측 후 매입판 위치 오류 발견 — 이미 서명한 검측서.
정의: 부적합(Nonconformance), 부적합보고서(NCR), 식별·격리(Identification & Segregation), 작업중지(Stop Work), 보류(Hold).
→ 다음: 처리.

**34. 네 갈래 처리 ★** — 사건: NCR-C-0112 처리 회의.
정의: 그대로 사용(Use-as-is), 보수(Repair), 재작업(Rework), 폐기·반품(Reject), 기술 처분(Disposition — 설계사 승인), 근본원인분석(RCA), 시정조치(Corrective Action, CAR), 재발방지(Preventive Action).
→ 다음: 원전은 왜 다르게 다루나.

**35. 원전이 정직을 요구하는 이유 ★** — 사건: 교육 자료 — 2012~2013년 국내 원전 부품 시험성적서 위조 사건(출처 확실한 범위에서 개념만), 10 CFR Part 21.
정의: 원자력 안전문화(Nuclear Safety Culture), 보고 의무(Reporting Obligation), Part 21 보고(10 CFR Part 21), 품질기록(Quality Record), 기록 위·변조(Falsification), 문제제기 프로그램(ECP, Employee Concerns Program).
→ 다음: 안전.

**36. 중대재해와 의사결정의 순서 ★** — 사건: 안전 지침 강화 공문 — 공기와 충돌.
정의: 중대재해처벌법(Serious Accidents Punishment Act), 중대재해(Serious Accident), 시정명령(Corrective Order), 과징금(Penalty Surcharge), 입찰참가자격 제한(Bid Restriction). 판단 순서(안전 > 법규·품질 > 공기 > 원가 > 기회)를 의사결정 원칙으로 제시(교재의 제안임을 명시).
→ 다음(장 끝): 기출 Q16.

**Q16. 기출 — 서명한 핵심기기의 하자 (PDF 16쪽)** (작성: 메인)

### 6장. 배관과 용접 (ch6)

**37. 배관의 지도** — 사건: 터빈건물 급수배관 아이소 도면. 토목과의 접점(관통부, 매입판, 지지대 기초).
정의: 급수 계통(Feedwater System), 주증기(Main Steam), 아이소메트릭 도면(Isometric Drawing, ISO), 스풀(Spool), 라인 번호(Line Number), 배관 지지대(Pipe Support / Hanger), 용접 지도(Weld Map).
→ 다음: 용접의 규칙.

**38. 용접의 규칙 ★** — 사건: 용접사 자격 대장, WPS 확인.
정의: 용접절차서(WPS), 절차검증기록(PQR), 용접사 자격(WPQ), 맞대기 용접(Butt Weld), 용접 번호(Weld Number), ASME Section IX / KEPIC 용접 자격(개념).
→ 다음: 검사.

**39. 보이지 않는 결함을 찾다 ★** — 사건: RT 판독 결과 불합격 연속.
정의: 비파괴검사(NDE), 방사선투과검사(RT), 초음파(UT), 침투(PT), 자분(MT), 육안(VT), 기공(Porosity), 슬래그 혼입(Slag Inclusion), 용입 불량(Incomplete Penetration), 융합 불량(Lack of Fusion), 불합격률(Reject Rate), 보수 용접(Repair Weld) vs 절단 재용접(Cut-out).
→ 다음: 재작업 계획.

**40. 재작업을 계획하다 ★** — 사건: 처리능력(개소/일) 계산 worked example(기출과 다른 숫자), 여유공기와 L/D, 근본원인 후보(용접사·재료·환경·절차). 발주처 제안에 "조건"이 붙을 때 보는 관점.
정의: 처리능력(Throughput/Capacity), 시운전 일정(Commissioning Schedule), 수의계약(Sole-source / Negotiated Contract). 계통 인계(System Turnover)는 43강에서 정의 — 여기선 이름만.
→ 다음(장 끝): 기출 Q17.

**Q17. 기출 — 급수배관 RT 불합격 11% (PDF 17쪽)** (작성: 메인)

### 7장. 보수와 보강 (ch7)

**41. 열화를 진단하다 ★** — 사건: 보조건물 외벽 조사 결과도.
정의: 열화(Deterioration), 상태 조사(Condition Survey), 손상 깊이(Damage Depth), 보수(Repair) vs 보강(Strengthening), 단면복구(Patch Repair / Section Restoration), 폴리머 모르타르(Polymer-modified Mortar), 바탕처리(Surface Preparation, 치핑 Chipping), 철근 방청(Rebar Corrosion Protection).
→ 다음: 보강 공법 고르기.

**42. 공법을 고르다 ★** — 사건: 기술팀의 탄소섬유 보강 제안서, 공법 비교표 작성법(worked example, 기출과 다른 숫자).
정의: 섬유보강폴리머(FRP/CFRP), 부착(Bond) — 건전한 바탕 필수, 외부부착 보강(Externally Bonded Reinforcement), 유지관리성(Maintainability), 생애주기비용(LCC), 공법 비교표(Option Study). 참고: ACI 440.2 (FRP 보강 지침) — 기준명만.
→ 다음(장 끝): 기출 Q18.

**Q18. 기출 — 보조건물 외벽 보수 (PDF 18쪽)** (작성: 메인)

### 8장. 시운전과 인계 (ch8)

**43. 공사를 계통으로 넘기다** — 사건: Turnover package 와 Punch list.
정의: 계통(System)·하위계통(Subsystem), 계통 경계(System Boundary), 기계적 완료(MC, Mechanical Completion), 미결 사항 목록(Punch List, A/B/C 등급), 계통 인계(System Turnover), 인계 패키지(Turnover Package).
→ 다음: 시험.

**44. 시험으로 증명하다** — 사건: CHT·HFT·연료장전.
정의: 시운전 전 시험(Pre-operational Test), 상온수압시험(CHT, Cold Hydrostatic Test), 고온기능시험(HFT, Hot Functional Test), 연료장전(Fuel Load), 운영허가(Operating License). 미국식: ITAAC(Inspections, Tests, Analyses, and Acceptance Criteria) — 보글 3·4호기 AP1000 예.
→ 다음: 끝.

**45. 다시 전체 그림으로** — 사건: 상업운전 날, 01강의 Level 1 공정표로 돌아간다. 각 마일스톤 뒤에 어떤 문서·검사·결정이 있었나를 묻는 재회상 질문 위주(요약 금지). 다음 무대: AP1000(코즐로두이), SMR-300(팰리세이즈, Holtec), 원전 해체(인디언포인트) — 무엇이 달라지는가(모듈 공법, 영어 문서, NQA-1).
정의: 모듈 공법(Modular Construction), 구조 모듈(Structural Module), 강판 콘크리트(SC, Steel-plate Concrete), NQA-1, SMR(Small Modular Reactor), 해체(Decommissioning).

## 6. 실습 번호 (practice/README.md 에서 정의)

P1 관계 걸기(08) · P2 주공정과 여유(09) · P3 기준선(10) · P4 간섭검토 Bonsai(11) · P5 미니 Aconex 문서대장·Transmittal·RFI(05·06) · P6 진도 업데이트(27·28) · P7 촉진 비교(30) · P8 기성·EVM 시트(31) · P9 자재 배분 시간축(17)
