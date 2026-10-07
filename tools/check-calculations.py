"""Independent arithmetic audit of the supplied PDF model, not engineering approval."""
from math import ceil, isclose
from pathlib import Path

# Event network from visual inspection of PDF page 14.
edges=[('A',1,3,30),('B',1,2,40),('dummy1',2,3,0),('C',3,4,30),('D',3,5,70),('dummy2',4,5,0),('E',2,6,70),('F',5,7,40),('G',6,7,20),('H',7,8,40)]
def schedule(changes=None):
    durations=changes or {}; earliest={1:0}
    for node in range(2,9):
        earliest[node]=max(earliest[a]+durations.get(name,d) for name,a,b,d in edges if b==node)
    return earliest[8]
assert schedule()==190
assert schedule({'C':70,'E':100})==200
assert schedule({'C':70,'E':100,'H':30})==190
assert schedule({'C':70,'E':100,'D':90})==210
assert schedule({'C':70,'E':100,'D':90,'H':20})==190
assert 30*2+100==160 and 90*2==180
assert 11*200+11*10+1000==3310
assert 2000+ceil(110*.04)*(400+10)==4050
assert isclose(2000+110*.04*410,3804)
assert ceil(110/3)==37
assert 2000+110*410+(37-3)*1000==81100
area=900*.15; volume=area*.03
assert isclose(volume,4.05)
repair_days=area/60+3; frp_days=area/90+1
repair=volume*20+200+max(0,repair_days-3)*1000
frp=area*35+300+max(0,frp_days-3)*1000
assert repair==2531 and frp==5025
assert repair+.02*(300+1000)==2557
assert frp+.005*(500+max(0,frp_days+1-3)*1000)==5030
root=Path(__file__).resolve().parents[1]
for ident,values in {'3-01':['190','200','210'],'3-02':['160','180','220'],'3-04':['3,310','4,050','3,804','81,100'],'3-05':['4.05','2,531','5,025','2,557','5,030']}.items():
    text=(root/'docs/ch3-problem'/f'{ident}.md').read_text()
    assert all(value in text for value in values), ident
print('PASS: PDF event network, allocation timeline, welding interpretations, concrete quantity, delay and expected rework costs.')
