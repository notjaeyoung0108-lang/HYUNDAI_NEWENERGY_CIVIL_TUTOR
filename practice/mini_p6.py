#!/usr/bin/env python3
"""mini_p6 — P6 용어로 일정을 계산해 보는 학습용 CPM 계산기 (7일 달력).

P6가 없는 맥에서 08·09·27·28강 실습을 하려고 만든 도구다. 실제 P6와 같은
열 이름(Original Duration, Remaining Duration, Actual Start/Finish, ES/EF/LS/LF,
Total Float, Free Float)과 일정 옵션(Retained Logic / Progress Override)을 쓴다.
달력은 7일(휴일 없음)만 지원한다.

CSV 열: id,name,od,rd,as,af,preds
  od    원기간(일). rd 를 비우면 od 를 쓴다.
  as/af 실제 시작·종료 (MM-DD). 비우면 아직 시작/종료 안 함.
  preds 선행 목록. 세미콜론으로 구분, 형식 "선행ID:관계±래그"  예) U1-1010:FS+2;U1-1020:SS+5
        관계를 생략하면 FS, 래그를 생략하면 0.

사용 예
  python3 practice/mini_p6.py practice/data/p2_lesson09.csv --data-date 01-01 --numbers
  python3 practice/mini_p6.py practice/data/p6_lesson27_after.csv --data-date 03-01
  python3 practice/mini_p6.py practice/data/p6_lesson28.csv --data-date 03-01 --logic override --must-finish 03-15
"""
import argparse
import csv
import datetime as dt
import re
import sys

REL = re.compile(r'^\s*([^:]+?)\s*(?::\s*(FS|SS|FF|SF)?\s*([+-]\s*\d+)?\s*d?)?\s*$', re.I)


def parse_preds(text):
    out = []
    for part in filter(None, (p.strip() for p in (text or '').split(';'))):
        m = REL.match(part)
        if not m:
            sys.exit(f'선행 형식 오류: "{part}" (예: U1-1010:SS+5)')
        out.append((m.group(1), (m.group(2) or 'FS').upper(), int((m.group(3) or '0').replace(' ', ''))))
    return out


def main():
    ap = argparse.ArgumentParser(description='P6 용어로 보는 학습용 CPM 계산기 (7일 달력)')
    ap.add_argument('csv')
    ap.add_argument('--data-date', required=True, help='데이터 데이트 MM-DD (첫 계산이면 착수일)')
    ap.add_argument('--year', type=int, default=2026)
    ap.add_argument('--logic', choices=['retained', 'override'], default='retained',
                    help='진행 중 Activity 계산 옵션: Retained Logic(기본) / Progress Override')
    ap.add_argument('--finish-by', action='append', default=[], metavar='ID=MM-DD',
                    help='Activity 에 거는 Finish On or Before 제약 (여러 번 가능)')
    ap.add_argument('--must-finish', metavar='MM-DD',
                    help='프로젝트 Must Finish By 날짜. 없으면 예측 종료일을 프로젝트 늦은 종료로 쓴다')
    ap.add_argument('--numbers', action='store_true', help='날짜 대신 일차(데이터 데이트=0)로 표시')
    args = ap.parse_args()

    def day(mmdd):
        return dt.date(args.year, *map(int, mmdd.split('-'))).toordinal()
    DD = day(args.data_date)

    def show(d, finish=False):
        # 내부는 [시작, 종료) 반개구간. --numbers 는 교재 09강처럼 경계값(ES·EF)을,
        # 날짜 표시는 P6 화면처럼 마지막 작업일(종료 − 1)을 보여준다.
        if args.numbers:
            return str(d - DD)
        return dt.date.fromordinal(d - 1 if finish else d).strftime('%m-%d')

    acts = {}
    with open(args.csv, encoding='utf-8') as f:
        for r in csv.DictReader(f):
            a = {k: (v or '').strip() for k, v in r.items()}
            a['od'] = int(a['od'])
            a['rd'] = int(a['rd']) if a.get('rd') else a['od']
            a['preds'] = parse_preds(a.get('preds'))
            a['status'] = 'done' if a.get('af') else 'prog' if a.get('as') else 'new'
            if a['status'] == 'done':
                a['rd'] = 0
            acts[a['id']] = a
    for a in acts.values():
        missing = [p for p, _, _ in a['preds'] if p not in acts]
        if missing:
            a['preds'] = [x for x in a['preds'] if x[0] in acts]
            print(f'※ {a["id"]}: 목록에 없는 선행 {", ".join(missing)} 는 무시합니다.', file=sys.stderr)

    # 위상 정렬 (순환 관계 검출)
    order, seen = [], set()
    def visit(i, stack=()):
        if i in seen:
            return
        if i in stack:
            sys.exit(f'순환 관계(loop) 발견: {" → ".join(stack + (i,))}')
        for p, _, _ in acts[i]['preds']:
            visit(p, stack + (i,))
        seen.add(i)
        order.append(i)
    for i in acts:
        visit(i)

    def ignored(a, rel):
        # Progress Override: 이미 시작한 Activity 는 선행 관계를 무시한다.
        # Retained Logic: 이미 시작했으므로 시작 쪽 관계(SS)는 끝났고, 나머지는 잔여 작업에 적용한다.
        return a['status'] == 'prog' and (args.logic == 'override' or rel == 'SS')

    # 전진계산 (Forward Pass). RS = 잔여 작업이 시작할 수 있는 날.
    for i in order:
        a = acts[i]
        if a['status'] == 'done':
            a['ES'], a['EF'] = day(a['as']), day(a['af']) + 1
            a['RS'] = a['ES']
            continue
        start = DD
        for p, rel, lag in a['preds']:
            if ignored(a, rel):
                continue
            q = acts[p]
            start = max(start, {'FS': q['EF'] + lag, 'SS': q['ES'] + lag,
                                'FF': q['EF'] + lag - a['rd'], 'SF': q['ES'] + lag - a['rd']}[rel])
        a['RS'] = start
        a['ES'] = day(a['as']) if a['status'] == 'prog' else start
        a['EF'] = start + a['rd']

    # 후진계산 (Backward Pass)
    early_end = max(a['EF'] for a in acts.values())
    end = day(args.must_finish) + 1 if args.must_finish else early_end
    limits = {}
    for item in args.finish_by:
        k, v = item.split('=')
        limits[k.strip()] = day(v.strip()) + 1
    succs = {i: [] for i in acts}
    for i, a in acts.items():
        for p, rel, lag in a['preds']:
            if not ignored(a, rel):
                succs[p].append((i, rel, lag))
    for i in reversed(order):
        a = acts[i]
        if a['status'] == 'done':
            continue
        lf = min(end, limits.get(i, end))
        for s, rel, lag in succs[i]:
            b = acts[s]
            # 이미 시작한 선행에게 시작 쪽 관계(SS·SF)는 지나간 일이라 늦은 날짜를 묶지 않는다.
            if b['status'] == 'done' or (a['status'] == 'prog' and rel in ('SS', 'SF')):
                continue
            lf = min(lf, {'FS': b['LS'] - lag, 'SS': b['LS'] - lag + a['rd'],
                          'FF': b['LF'] - lag, 'SF': b['LF'] - lag + a['rd']}[rel])
        a['LF'], a['LS'] = lf, lf - a['rd']
        a['TF'] = a['LF'] - a['EF']
        ff = min(end, limits.get(i, end)) - a['EF']
        for s, rel, lag in succs[i]:
            b = acts[s]
            if b['status'] == 'done' or (a['status'] == 'prog' and rel in ('SS', 'SF')):
                continue
            ff = min(ff, {'FS': b['RS'] - lag - a['EF'], 'SS': b['RS'] - lag - a['RS'],
                          'FF': b['EF'] - lag - a['EF'], 'SF': b['EF'] - lag - a['RS']}[rel])
        a['FF'] = ff

    print(f'Data Date {args.data_date} · 일정 옵션 {"Retained Logic" if args.logic == "retained" else "Progress Override"} · 7일 달력'
          + (' · 숫자 = 데이터 데이트 기준 경계 일차(09강 표 방식)' if args.numbers else ''))
    print(f'{"Activity ID":<16} {"Name":<12} {"OD":>3} {"RD":>3}  {"Start":>6} {"Finish":>6}  {"LS":>6} {"LF":>6}  {"TF":>4} {"FF":>4}  비고')
    print('-' * 96)
    for i in order:
        a = acts[i]
        name = a['name'][:10]
        if a['status'] == 'done':
            print(f'{i:<16} {name:<12} {a["od"]:>3} {0:>3}  {show(a["ES"]):>6} {show(a["EF"], True):>6}  {"":>6} {"":>6}  {"":>4} {"":>4}  완료 (AS·AF)')
            continue
        note = (f'진행 중 (AS {a["as"]}) ' if a['status'] == 'prog' else '') + ('◀ 주공정' if a['TF'] <= 0 else '')
        print(f'{i:<16} {name:<12} {a["od"]:>3} {a["rd"]:>3}  {show(a["ES"]):>6} {show(a["EF"], True):>6}  {show(a["LS"]):>6} {show(a["LF"], True):>6}  {a["TF"]:>4} {a["FF"]:>4}  {note}')
    print(f'프로젝트 예측 종료: {show(early_end, True)}' + (f' · Must Finish By {args.must_finish}' if args.must_finish else ''))


if __name__ == '__main__':
    main()
