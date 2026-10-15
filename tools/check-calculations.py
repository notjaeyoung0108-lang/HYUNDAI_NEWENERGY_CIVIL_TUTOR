"""Independent arithmetic audit of the PDF 14–18 exam models and the exam pages. Not engineering approval."""
from math import ceil, isclose
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

# PDF 14 — event network read from the page image (② → ③ and ④ → ⑤ are dummies).
EDGES = [('A', 1, 3, 30), ('B', 1, 2, 40), ('d1', 2, 3, 0), ('C', 3, 4, 30), ('D', 3, 5, 70),
         ('d2', 4, 5, 0), ('E', 2, 6, 70), ('F', 5, 7, 40), ('G', 6, 7, 20), ('H', 7, 8, 40)]


def cpm(change=None):
    dur = {n: (change or {}).get(n, d) for n, _, _, d in EDGES}
    early = {1: 0}
    for k in range(2, 9):
        early[k] = max(early[a] + dur[n] for n, a, b, _ in EDGES if b == k)
    late = {8: early[8]}
    for k in range(7, 0, -1):
        late[k] = min(late[b] - dur[n] for n, a, b, _ in EDGES if a == k)
    tf = {n: late[b] - early[a] - dur[n] for n, a, b, _ in EDGES}
    return early[8], tf


def min_crash_days(change, target=190):
    """Fewest crash-days (over B, D, F, G, H) to bring the network down to target."""
    base = {n: x for n, _, _, x in EDGES}
    best = None
    for h in range(21):
        for f in range(21):
            for d in range(21):
                for g in range(11):
                    for b in range(11):
                        c = dict(change)
                        for a, k in (('H', h), ('F', f), ('D', d), ('G', g), ('B', b)):
                            c[a] = c.get(a, base[a]) - k
                        if cpm(c)[0] <= target:
                            days = h + f + d + g + b
                            best = days if best is None else min(best, days)
    return best


T, tf = cpm()
assert T == 190 and tf['A'] == 10 and tf['C'] == 40 and tf['E'] == 20 and tf['G'] == 20
assert all(tf[x] == 0 for x in 'BDFH')
assert cpm({'C': 70})[0] == 190 and cpm({'C': 60})[0] == 190
assert cpm({'E': 100})[0] == 200 and cpm({'D': 90})[0] == 210
both = {'C': 70, 'E': 100}
assert cpm(both)[0] == 200 and cpm(both)[1]['C'] == 10 and cpm({'C': 60, 'E': 100})[1]['C'] == 20
assert cpm({**both, 'D': 90})[0] == 210
assert min_crash_days(both) == 10 and min_crash_days({**both, 'D': 90}) == 20
profit = {  # 억원: base 10, safety −10 common to every option; L/D 1억/day, crash 2억/day
    '①': 10 - 10 - 10, '②': 10 - 10 - 10 * 2, '③': 10 - 10 + 10 - 20, '④': 10 - 10 + 10 - 20 * 2, '⑤': 10 - 10 + 10}
assert profit == {'①': -10, '②': -20, '③': -10, '④': -30, '⑤': 10}


# PDF 15 — 1 month = 30 days; A delay = (3 − x) months at 2억/day; B fine 50억 × 3 months; C penalty 100억.
def q15(a, b, c):
    return (3 - a) * 30 * 2 + (0 if b >= 1 else 150) + (0 if c >= 2 else 100)


assert [q15(2, 1, 0), q15(0, 1, 2), q15(3, 0, 0), q15(1, 1, 1)] == [160, 180, 250, 220]

# PDF 16 — honest: reorder 400 + 2 months acceleration at 100/month; cover-up: 6-month delay, max 3 months acceleration.
assert 400 + 2 * 100 == 600 and 400 + 3 * 100 == 700 and 6 - 3 == 3


# PDF 17 — 만원. ① 11 × 110/100 = 12.1 → 13; ② ceil(n/3); L/D beyond 3 days of float.
def q17(n, unit, material):
    days = ceil(n / 3)
    return n * unit + n * 10 + material + max(0, days - 3) * 1000, days


assert isclose(11 * 110 / 100, 12.1)
assert q17(11, 200, 0) == (3310, 4)
assert q17(13, 400, 2000) == (9330, 5)
assert q17(12, 400, 2000) == (7920, 4)
assert 9330 - 3310 == 6020 and 7920 - 3310 == 4610

# PDF 18 — 만원.
area = 900 * 0.15
vol = area * 0.030
assert isclose(area, 135) and isclose(vol, 4.05)
rd, fd = area / 60 + 3, area / 90 + 1
assert isclose(rd, 5.25) and isclose(fd, 2.5)
repair = vol * 20 + 200 + max(0, rd - 3) * 1000
frp = area * 35 + 300 + max(0, fd - 3) * 1000
assert isclose(repair, 2531) and isclose(frp, 5025)
assert isclose(repair + 0.02 * (300 + 1000), 2557)
assert isclose(frp + 0.005 * (500 + max(0, fd + 1 - 3) * 1000), 5030)
assert isclose(4000 - (vol * 20 + 200), 3719)
assert isclose(area / 120 + 3, 4.125)  # two crews
assert ceil(area / 60) + 3 == 6 and isclose(vol * 20 + 200 + 3000, 3281)

# The exam pages must show the audited numbers.
expect = {
    'ch1/Q14-1': ['190', 'B → (더미 ②→③) → D → F → H'],
    'ch4/Q14-2': ['200', '210', '−10억', '−20억', '−30억', '+10억'],
    'ch2/Q15': ['160억', '180억', '220억', '250억'],
    'ch5/Q16': ['600억', '700억'],
    'ch6/Q17': ['13개', '5일', '3,310', '9,330', '7,920', '6,020', '4,610'],
    'ch7/Q18': ['4.05m³', '5.25일', '2,531', '5,025', '2,557', '5,030', '1.125일'],
}
for page, values in expect.items():
    text = (ROOT / 'docs' / f'{page}.md').read_text(encoding='utf-8')
    missing = [v for v in values if v not in text]
    assert not missing, (page, missing)
print('PASS: PDF 14 network & options, 15 allocation, 16 cost paths, 17 welds/cost, 18 quantities/cost — exam pages agree.')
