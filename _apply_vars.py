#!/usr/bin/env python3
"""CSS 파일의 하드코딩된 hex 색상값을 CSS 변수로 교체"""
import re, os

BASE = os.path.dirname(os.path.abspath(__file__))

# hex → 변수 매핑 (대소문자 무관하게 처리)
COLOR_MAP = [
    ('#1A1C1E', 'var(--midnight-charcoal)'),
    ('#555555', 'var(--gray-700)'),
    ('#D4A853', 'var(--champagne-gold)'),
    ('#E8941A', 'var(--starline-gold)'),
    ('#8FAF8A', 'var(--dusty-sage)'),
    ('#C4876A', 'var(--muted-terracotta)'),
    ('#F9F9F9', 'var(--bg-gray-50)'),
    ('#FFFFFF', 'var(--pure-white)'),
    ('#F2F2F2', 'var(--gray-100)'),
    ('#D1D1D1', 'var(--border-gray-300)'),
    ('#E8E8E8', 'var(--inactive-gray-200)'),
    ('#999999', 'var(--active-border-gray-500)'),
]

# common.css는 변수 정의 파일이므로 제외
SKIP = {'common.css', '_refactor.py', '_apply_vars.py'}

css_files = [f for f in os.listdir(BASE) if f.endswith('.css') and f not in SKIP]

total_replaced = 0
for fname in sorted(css_files):
    path = os.path.join(BASE, fname)
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    count = 0
    for hex_val, var in COLOR_MAP:
        # 대소문자 무관 교체, #뒤에 hex가 더 이어지지 않는 경우만 (6자리 hex 정확히)
        pattern = re.compile(re.escape(hex_val), re.IGNORECASE)
        new_content, n = pattern.subn(var, content)
        content = new_content
        count += n

    if count > 0:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'✓ {fname:35s} ({count}곳 교체)')
        total_replaced += count
    else:
        print(f'  {fname:35s} (변경 없음)')

print(f'\n총 {total_replaced}곳 교체 완료!')
