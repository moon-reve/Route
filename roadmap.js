/* ── 필터 탭 ── */
var FILTER_CONFIG = {
  '인강': {
    color: '#D4A853',
    items: [
      { title: '왕초보를위한 피그마기초입문',                                           week: 'W01', iconType: 'done',     statusLabel: '완료',    statusClass: 'tag--gold' },
      { title: '일러스트레이터보다 100배 쉬운 캐릭터디자인',                            week: 'W02', iconType: 'done',     statusLabel: '완료',    statusClass: 'tag--gold' },
      { title: '3분이면 완성 피그마 아이콘 제작',                                       week: 'W03', iconType: 'done',     statusLabel: '완료',    statusClass: 'tag--gold' },
      { title: '오토레이아웃 활용 카드디자인',                                          week: 'W04', iconType: 'active',   statusLabel: '진행 중', statusClass: 'tag--in-progress' },
      { title: '작업시간 500프로 단축 디자인시스템',                                    week: 'W05', iconType: 'inactive', statusLabel: '예정',    statusClass: 'tag--plan' },
      { title: '시간 단축과 재사용의 끝판왕 컴포넌트와 베리언트',                       week: 'W06', iconType: 'inactive', statusLabel: '예정',    statusClass: 'tag--plan' },
      { title: 'Mobile UI디자인과 오토 레이아웃 실전!',                                week: 'W07', iconType: 'inactive', statusLabel: '예정',    statusClass: 'tag--plan' },
      { title: '코딩없이 인터랙티브 끝장내는 프로토타입제작',                           week: 'W08', iconType: 'inactive', statusLabel: '예정',    statusClass: 'tag--plan' },
      { title: '트렌드완성! 글래스모피즘 UI',                                          week: 'W09', iconType: 'inactive', statusLabel: '예정',    statusClass: 'tag--plan' },
      { title: '디자이너 필수 플러그인 Top10 사용법',                                   week: 'W10', iconType: 'inactive', statusLabel: '예정',    statusClass: 'tag--plan' },
      { title: 'UIUX디자이너 매출 1000억 기업 취업 포트폴리오',                        week: 'W11', iconType: 'inactive', statusLabel: '예정',    statusClass: 'tag--plan' },
      { title: 'UIUX디자이너 에이전시 합격 포트폴리오 (당근마켓앱 팀프로젝트 리뉴얼)', week: 'W12', iconType: 'inactive', statusLabel: '예정',    statusClass: 'tag--plan' },
    ]
  },
  '도서': {
    color: '#47B5A7',
    items: [
      { title: 'UX 심리학',       week: 'W01', iconType: 'done',       statusLabel: '완료',    statusClass: 'tag--gold' },
      { title: '린 UX',           week: 'W02', iconType: 'done',       statusLabel: '완료',    statusClass: 'tag--gold' },
      { title: '린 스타트업',     week: 'W03', iconType: 'unfinished', statusLabel: '미완료',  statusClass: 'tag--unfinished' },
      { title: '인터랙션 디자인', week: 'W04', iconType: 'inactive',   statusLabel: '예정',    statusClass: 'tag--plan' },
      { title: '포트폴리오 전략', week: 'W06', iconType: 'inactive',   statusLabel: '예정',    statusClass: 'tag--plan' },
    ]
  },
  '매거진': {
    color: '#D4849A',
    items: [
      { title: '디자인 트렌드',    week: 'W01', iconType: 'done-sage', statusLabel: '선취득', statusClass: 'tag--sage' },
      { title: 'UX 케이스 스터디', week: 'W05', iconType: 'done-sage', statusLabel: '선취득', statusClass: 'tag--sage' },
    ]
  },
  '프로젝트': {
    color: '#9E90BC',
    items: [
      { title: '포트폴리오 리뉴얼 - 앱 기획', week: 'W03', iconType: 'done',     statusLabel: '완료', statusClass: 'tag--gold' },
      { title: '시장 분석 리포트',             week: 'W04', iconType: 'inactive', statusLabel: '예정', statusClass: 'tag--plan' },
    ]
  }
};

function getIconHTML(iconType) {
  if (iconType === 'unfinished') return '<div class="item-icon item-icon--unfinished"></div>';
  var map = {
    'done':      'images/roadmap_icon_done.svg',
    'done-sage': 'images/roadmap_icon_done_sage.svg',
    'active':    'images/roadmap_icon_active.svg',
    'inactive':  'images/roadmap_icon_inactive.svg',
  };
  return '<img src="' + map[iconType] + '" class="item-icon" alt="">';
}

function renderFilterView(label, config) {
  var doneCount = config.items.filter(function (i) { return i.iconType === 'done' || i.iconType === 'done-sage'; }).length;
  var total     = config.items.length;
  var pct       = Math.round(doneCount / total * 100);
  var inProgress = config.items.filter(function (i) { return i.iconType === 'active'; }).length;
  var unfinished = config.items.filter(function (i) { return i.iconType === 'unfinished'; }).length;
  var planned    = config.items.filter(function (i) { return i.iconType === 'inactive'; }).length;

  var stats = '완료 ' + doneCount;
  if (inProgress) stats += ' · 진행 중 ' + inProgress;
  if (unfinished) stats += ' · 미완료 ' + unfinished;
  if (planned)    stats += ' · 예정 ' + planned;

  document.getElementById('filter-summary').innerHTML =
    '<div class="filter-summary-row">' +
      '<span class="filter-summary-label">' + label + '</span>' +
      '<span class="filter-summary-stats">' + stats + '</span>' +
    '</div>' +
    '<div class="filter-progress-track">' +
      '<div class="filter-progress-fill" style="width:' + pct + '%; background:' + config.color + '"></div>' +
    '</div>';

  document.getElementById('filter-list').innerHTML = config.items.map(function (item) {
    return '<div class="filter-item">' +
      getIconHTML(item.iconType) +
      '<span class="filter-item-title">' + item.title + '</span>' +
      '<span class="filter-week-badge">' + item.week + '</span>' +
      '<span class="tag ' + item.statusClass + '">' + item.statusLabel + '</span>' +
    '</div>';
  }).join('');
}

document.querySelectorAll('.nav-chips .chip').forEach(function (chip) {
  chip.addEventListener('click', function () {
    var label = this.textContent.trim();
    document.querySelectorAll('.nav-chips .chip').forEach(function (c) {
      c.classList.remove('chip--active');
      c.style.background = '';
      c.style.borderColor = '';
      c.style.color = '';
    });
    this.classList.add('chip--active');

    var timeline   = document.getElementById('timeline');
    var filterView = document.getElementById('filter-view');

    if (label === '전체') {
      timeline.classList.remove('is-hidden');
      filterView.classList.add('is-hidden');
    } else {
      var config = FILTER_CONFIG[label];
      if (config) {
        this.style.background  = config.color;
        this.style.borderColor = config.color;
        this.style.color       = '#fff';
        renderFilterView(label, config);
        timeline.classList.add('is-hidden');
        filterView.classList.remove('is-hidden');
      }
    }
  });
});

function toggleCard(card) {
  var closedHeader = card.querySelector('.done-closed-header');
  var openContent  = card.querySelector('.done-open-content');
  var isOpen = !openContent.classList.contains('is-hidden');

  if (isOpen) {
    if (closedHeader) closedHeader.classList.remove('is-hidden');
    openContent.classList.add('is-hidden');
    if (card.classList.contains('card--done-open'))   card.classList.replace('card--done-open',   'card--done-closed');
    if (card.classList.contains('card--active-open')) card.classList.replace('card--active-open', 'card--active-closed');
    if (card.classList.contains('card--plan-open'))   card.classList.replace('card--plan-open',   'card--plan-closed');
  } else {
    if (closedHeader) closedHeader.classList.add('is-hidden');
    openContent.classList.remove('is-hidden');
    if (card.classList.contains('card--done-closed'))   card.classList.replace('card--done-closed',   'card--done-open');
    if (card.classList.contains('card--active-closed')) card.classList.replace('card--active-closed', 'card--active-open');
    if (card.classList.contains('card--plan-closed'))   card.classList.replace('card--plan-closed',   'card--plan-open');
  }
}

/* 이벤트 위임: card-head-row / card-head 클릭 → toggleCard */
document.addEventListener('click', function (e) {
  /* feedback-btn 클릭은 card-head 이벤트 전파 차단 */
  if (e.target.closest('.feedback-btn')) return;
  var trigger = e.target.closest('.card-head-row, .card-head');
  if (trigger) toggleCard(trigger.closest('.card'));
});
