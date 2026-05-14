#!/usr/bin/env python3
"""
Route 리팩토링 스크립트
1. CSS 파일에서 공통 스타일 제거
2. HTML 파일에 common.css/js 연결 + nav-root 주입
"""
import re, os

BASE = os.path.dirname(os.path.abspath(__file__))

# ─── 1. CSS 공통 블록 제거 ───────────────────────────────────────────────────

# 제거할 최상위 선택자 (정확히 매칭)
REMOVE_SELECTORS = [
    r'\*,\s*\*::before,\s*\*::after',
    r'body',
    r'\.scroll-area',
    r'\.nav-bar',
    r'\.nav-tab\b',
    r'\.nav-tab\s+img',
    r'\.nav-tab\s+span',
    r'\.nav-tab--active\s+img',
    r'\.nav-tab--active\s+span',
    r'\.nav-center\b',
    r'\.nav-center\s+img',
]

# .screen 제거 (일부 파일은 유지)
SCREEN_OVERRIDE_FILES = {'splash.css', 'roadmap.css'}

# 단일행 규칙 제거
REMOVE_SINGLE_LINES = [
    r'\.scroll-area::-webkit-scrollbar\s*\{[^}]*\}',
    r'\.card-list::-webkit-scrollbar\s*\{[^}]*\}',  # 이미 card-list엔 없지만 안전하게
]

# 제거할 주석 패턴
REMOVE_COMMENT_PATTERNS = [
    r'/\*\s*──\s*Phone frame[^*]*\*/',
    r'/\*\s*──\s*Scroll area[^*]*\*/',
    r'/\*\s*══+\s*\n?\s*NAV BAR[^*]*\*/',
    r'/\*\s*NAV BAR[^*]*\*/',
    r'/\*\s*absolute.*센터.*blur[^*]*\*/',
    r'/\*\s*nav sides[^*]*\*/',
    r'/\*\s*nav tab[^*]*\*/',
    r'/\*\s*중앙 플로팅[^*]*\*/',
]

def remove_block(css, selector_pattern):
    """선택자로 시작하는 CSS 블록 전체 제거"""
    # 주석 포함 블록 찾기
    pat = re.compile(
        r'(?:/\*[^*]*\*+(?:[^/*][^*]*\*+)*/\s*)?' +  # 선택적 앞 주석
        selector_pattern + r'\s*\{[^{}]*(?:\{[^{}]*\}[^{}]*)?\}',
        re.MULTILINE | re.DOTALL
    )
    return pat.sub('', css)

def remove_top_block(css, selector_pattern):
    """선택자가 줄 시작인 블록 제거 (중첩 없는 단순 블록)"""
    pat = re.compile(
        r'^[ \t]*' + selector_pattern + r'[ \t]*\{[^}]*\}[ \t]*\n?',
        re.MULTILINE | re.DOTALL
    )
    return pat.sub('', css)

def strip_css(css, filename):
    """CSS에서 공통 블록 제거"""
    # 단일행 규칙 먼저 제거
    for pat in REMOVE_SINGLE_LINES:
        css = re.sub(pat, '', css)

    # 선택자 블록 제거
    for sel in REMOVE_SELECTORS:
        css = remove_top_block(css, sel)

    # .screen 제거 (오버라이드 파일 제외)
    if filename not in SCREEN_OVERRIDE_FILES:
        css = remove_top_block(css, r'\.screen')

    # 주석 제거
    for pat in REMOVE_COMMENT_PATTERNS:
        css = re.sub(pat, '', css, flags=re.DOTALL)

    # @media 블록에서 nav 관련만 있으면 블록 전체 제거
    def clean_media(m):
        body = m.group(1)
        # nav 관련 선택자만 있는지 확인
        cleaned = remove_top_block(body, r'\.nav-tab\b')
        cleaned = remove_top_block(cleaned, r'\.chip')  # chip은 유지
        if cleaned.strip() == '':
            return ''
        return m.group(0)  # 원본 유지

    # 430px nav-only 미디어쿼리 제거
    css = re.sub(
        r'@media\s*\(max-width:\s*429px\)\s*\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}',
        lambda m: '' if all(
            any(nav in line for nav in ['.nav-tab', '.nav-center', '.nav-bar'])
            for line in m.group(1).strip().splitlines()
            if line.strip() and '{' not in line and '}' not in line and not line.strip().startswith('//')
        ) else m.group(0),
        css, flags=re.DOTALL
    )

    # 연속 빈 줄 정리 (3줄 이상 → 2줄)
    css = re.sub(r'\n{3,}', '\n\n', css)
    return css.strip() + '\n'

# CSS 파일 처리 (partial 파일 제외)
SKIP_CSS = {'common.css', 'pre_step2.css', 'pre_step5.css'}

css_files = [f for f in os.listdir(BASE) if f.endswith('.css') and f not in SKIP_CSS]
for fname in sorted(css_files):
    path = os.path.join(BASE, fname)
    with open(path, 'r', encoding='utf-8') as f:
        original = f.read()
    cleaned = strip_css(original, fname)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(cleaned)
    removed = len(original) - len(cleaned)
    print(f'✓ {fname:35s} (-{removed:4d} chars)')

# ─── 2. HTML 파일 업데이트 ────────────────────────────────────────────────────

# 페이지별 data-page 매핑 (nav 있는 페이지만)
PAGE_DATA = {
    'home.html':           'home',
    'roadmap.html':        'route',
    'daily_mission.html':  '',      # 활성 탭 없음
    'detail_card1.html':   '',
    'detail_magazine1.html': '',
    'expert_detail.html':  '',
    'feedback_detail.html': '',
    'log_calendar.html':   'log',
    'log_feed.html':       'log',
    'log_project.html':    'log',
    'my_page.html':        'my',
}

# nav 없는 페이지 (common.js 불필요)
NO_NAV_PAGES = {
    'index.html', 'splash.html', 'login.html',
    'onboarding1.html', 'onboarding2.html', 'onboarding3.html',
    'pre_step1.html', 'pre_step2.html', 'pre_step3.html',
    'pre_step4.html', 'pre_step5.html',
    'pre_loading.html', 'pre_complete.html', 'log_write.html',
}

# nav HTML 패턴 (여러 줄)
NAV_BLOCK_PAT = re.compile(
    r'[ \t]*<!-- 네비게이션 바 -->\s*\n\s*<nav class="nav-bar">.*?</nav>',
    re.DOTALL
)
NAV_BLOCK_PAT2 = re.compile(
    r'[ \t]*<nav class="nav-bar">.*?</nav>',
    re.DOTALL
)

html_files = [f for f in os.listdir(BASE) if f.endswith('.html')]
for fname in sorted(html_files):
    path = os.path.join(BASE, fname)
    with open(path, 'r', encoding='utf-8') as f:
        html = f.read()

    has_nav = fname in PAGE_DATA
    needs_common_js = has_nav  # nav 있는 페이지만 common.js 필요

    # ① common.css 링크 추가 (페이지 CSS 링크 바로 앞)
    if 'common.css' not in html:
        html = re.sub(
            r'(<link rel="stylesheet" href="(?!common))',
            r'<link rel="stylesheet" href="common.css">\n  \1',
            html, count=1
        )

    # ② data-page 속성 추가
    if has_nav and 'data-page' not in html:
        page_val = PAGE_DATA[fname]
        html = html.replace('<body>', f'<body data-page="{page_val}">', 1)

    # ③ nav HTML → nav-root 교체
    if has_nav:
        replaced = NAV_BLOCK_PAT.sub('\n    <div id="nav-root"></div>', html)
        if replaced == html:
            replaced = NAV_BLOCK_PAT2.sub('<div id="nav-root"></div>', html)
        html = replaced

    # ④ common.js 추가 (</body> 직전)
    if needs_common_js and 'common.js' not in html:
        html = html.replace('</body>', '  <script src="common.js"></script>\n</body>', 1)

    with open(path, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f'✓ {fname}')

print('\n🎉 리팩토링 완료!')
