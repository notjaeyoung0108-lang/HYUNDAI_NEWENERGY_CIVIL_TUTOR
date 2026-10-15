#!/usr/bin/env python3
"""Authoring only: build the two IFC models for practice P4 (clash detection in Bonsai).

Needs ifcopenshell (pip install ifcopenshell). Writes
  practice/data/p4_civil.ifc   — 보조건물 일부: 바닥 슬래브, 벽 W-3B(관통 개구부 1개), 보 B-12, 매입판 2개
  practice/data/p4_piping.ifc  — 급수배관 4라인, 배수관 1라인
Planted on purpose (civil vs piping):
  Hard 3      — FW-0103 이 개구부 없는 벽 통과 / FW-0104 가 보 B-12 하부를 50mm 침범 / DR-0201 이 슬래브를 개구부 없이 관통
  Clearance 1 — FW-0105 상단과 보 B-12 하부 사이 30mm (BIM 수행계획서 검토 기준 50mm 미만)
  정상 1      — FW-0102 는 벽 개구부 OP-01 중앙을 통과 → 간섭 아님
"""
from pathlib import Path
import numpy as np
import ifcopenshell
import ifcopenshell.api as api

OUT = Path(__file__).resolve().parents[1] / 'practice' / 'data'
# Rotation that sends the profile's local Z (extrusion direction) to the world axis.
AXIS = {
    'z': np.eye(3),
    'x': np.array([[0, 0, 1], [0, 1, 0], [-1, 0, 0]]),
    'y': np.array([[1, 0, 0], [0, 0, 1], [0, -1, 0]]),
}


def setup(project_name):
    f = ifcopenshell.file(schema='IFC4')
    project = api.run('root.create_entity', f, ifc_class='IfcProject', name=project_name)
    api.run('unit.assign_unit', f, length={'is_metric': True, 'raw': 'METERS'})
    ctx = api.run('context.add_context', f, context_type='Model')
    body = api.run('context.add_context', f, context_type='Model', context_identifier='Body', target_view='MODEL_VIEW', parent=ctx)
    site = api.run('root.create_entity', f, ifc_class='IfcSite', name='가람 원자력 1·2호기 (가상)')
    bldg = api.run('root.create_entity', f, ifc_class='IfcBuilding', name='U1 보조건물 (AB)')
    storey = api.run('root.create_entity', f, ifc_class='IfcBuildingStorey', name='EL 100.0')
    api.run('aggregate.assign_object', f, relating_object=project, products=[site])
    api.run('aggregate.assign_object', f, relating_object=site, products=[bldg])
    api.run('aggregate.assign_object', f, relating_object=bldg, products=[storey])
    return f, body, storey


def matrix(origin, axis='z'):
    m = np.eye(4)
    m[:3, :3] = AXIS[axis]
    m[:3, 3] = origin
    return m


def box(f, body, storey, cls, name, origin, size, desc=''):
    """Axis-aligned box from corner `origin` with size (lx, ly, lz) in metres."""
    el = api.run('root.create_entity', f, ifc_class=cls, name=name)
    el.Description = desc or None
    lx, ly, lz = size
    rep = api.run('geometry.add_wall_representation', f, context=body, length=lx, height=lz, thickness=ly)
    api.run('geometry.assign_representation', f, product=el, representation=rep)
    api.run('geometry.edit_object_placement', f, product=el, matrix=matrix(origin))
    if cls != 'IfcOpeningElement':
        api.run('spatial.assign_container', f, relating_structure=storey, products=[el])
    return el


def pipe(f, body, storey, name, start, axis, length, dia, desc):
    el = api.run('root.create_entity', f, ifc_class='IfcPipeSegment', name=name)
    el.Description = desc
    profile = f.create_entity('IfcCircleProfileDef', ProfileType='AREA', ProfileName=f'Ø{round(dia * 1000)}', Radius=dia / 2)
    rep = api.run('geometry.add_profile_representation', f, context=body, profile=profile, depth=length)
    api.run('geometry.assign_representation', f, product=el, representation=rep)
    api.run('geometry.edit_object_placement', f, product=el, matrix=matrix(start, axis))
    api.run('spatial.assign_container', f, relating_structure=storey, products=[el])
    return el


def civil():
    f, body, st = setup('P4 토목 모델 — GR1-AB-C (가상)')
    box(f, body, st, 'IfcSlab', 'SL-01 바닥 슬래브 t=1000', (0, -6, -1), (12, 7, 1), '보조건물 바닥 슬래브, 상면 EL ±0.000')
    wall = box(f, body, st, 'IfcWall', 'W-3B 외벽 t=1000', (0, 0, 0), (12, 1, 6), '보조건물 외벽 W-3B')
    # 관통 개구부 OP-01: x 2.5~3.5, z 1.5~2.5 — Ø300 FW-0102 용, 사방 350mm 여유
    op = box(f, body, st, 'IfcOpeningElement', 'OP-01 관통 개구부 1000×1000', (2.5, -0.1, 1.5), (1.0, 1.2, 1.0))
    api.run('feature.add_feature', f, feature=op, element=wall)
    box(f, body, st, 'IfcBeam', 'B-12 보 600×800', (0, -6, 4.2), (12, 0.6, 0.8), '보 하부 EL +4.200, 상부 +5.000')
    box(f, body, st, 'IfcPlate', 'EP-2214-03 매입판 400×400×25', (9.3, -0.025, 1.3), (0.4, 0.025, 0.4), '벽 W-3B 실내면 매입판')
    box(f, body, st, 'IfcPlate', 'EP-2214-04 매입판 400×400×25', (10.3, -0.025, 1.3), (0.4, 0.025, 0.4), '벽 W-3B 실내면 매입판')
    f.write(str(OUT / 'p4_civil.ifc'))


def piping():
    f, body, st = setup('P4 배관 모델 — GR1-TB-M (가상)')
    # 벽 W-3B(y 0~1)를 Y방향으로 지나는 급수배관 두 개, 관 중심 EL +2.000
    pipe(f, body, st, 'FW-0102 급수 Ø300', (3.0, -3.0, 2.0), 'y', 6.0, 0.3, '개구부 OP-01 중앙 통과 — 정상')
    pipe(f, body, st, 'FW-0103 급수 Ø300', (7.0, -3.0, 2.0), 'y', 6.0, 0.3, '개구부 없는 벽 통과')
    # 보 B-12 (y −6.0~−5.4, 하부 EL +4.200) 아래를 X방향으로 지나는 배관 두 개
    pipe(f, body, st, 'FW-0104 급수 Ø300', (0.5, -5.85, 4.1), 'x', 11.0, 0.3, '관 상단 EL +4.250')
    pipe(f, body, st, 'FW-0105 급수 Ø200', (0.5, -5.55, 4.07), 'x', 11.0, 0.2, '관 상단 EL +4.170')
    # 슬래브(EL −1.000~±0.000)를 수직으로 지나는 배수관
    pipe(f, body, st, 'DR-0201 배수 Ø150', (6.0, -3.0, -1.5), 'z', 3.0, 0.15, '바닥 배수 수직관')
    f.write(str(OUT / 'p4_piping.ifc'))


if __name__ == '__main__':
    OUT.mkdir(parents=True, exist_ok=True)
    civil()
    piping()
    print('wrote', OUT / 'p4_civil.ifc', 'and', OUT / 'p4_piping.ifc')
