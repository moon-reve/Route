/* ── localStorage에서 저장된 항목 읽기 ── */
function getSavedItems() {
  var items = [];
  var keys = Object.keys(localStorage).filter(function (k) {
    return k.startsWith('route_saved_') &&
           !k.includes('_date') && !k.includes('_title') &&
           !k.includes('_type') && !k.includes('_href');
  });
  keys.forEach(function (k) {
    if (localStorage.getItem(k) !== 'true') return;
    var base    = k;
    var dateStr = localStorage.getItem(base + '_date');
    if (!dateStr) return;
    items.push({
      key:   base,
      date:  dateStr,
      title: localStorage.getItem(base + '_title') || '',
      type:  localStorage.getItem(base + '_type')  || '',
      href:  localStorage.getItem(base + '_href')  || ''
    });
  });
  /* 최신순 정렬 */
  items.sort(function (a, b) { return b.date.localeCompare(a.date); });
  return items;
}

/* ── 날짜 포맷: YYYY-MM-DD → YYYY. MM. DD ── */
function formatDate(dateStr) {
  var p = dateStr.split('-');
  return p[0] + '. ' + p[1] + '. ' + p[2];
}

/* ── 배지 클래스 (아티클/매거진 모두 동일) ── */
function badgeClass() {
  return 'badge--blue';
}

/* ── 피드에 저장 항목 렌더링 ── */
function renderSavedItems() {
  var items    = getSavedItems();
  var articles = document.querySelector('.articles');
  if (!articles || items.length === 0) return;

  /* 구분선 헤더 */
  var header = document.createElement('div');
  header.className = 'saved-section-header';
  header.innerHTML = '<span class="saved-section-label">저장된 항목 (' + items.length + ')</span>';
  articles.insertBefore(header, articles.firstChild);

  /* 항목 카드 */
  items.forEach(function (item, i) {
    var el = document.createElement('div');
    el.className = 'article article--saved';
    el.setAttribute('data-href', item.href);
    el.innerHTML =
      '<div class="article-meta">' +
        '<span class="article-date">' + formatDate(item.date) + '</span>' +
        '<span class="article-badge ' + badgeClass(item.type) + '">[저장] ' + item.type + '</span>' +
      '</div>' +
      '<p class="article-text">' + item.title + '</p>';
    /* 구분선 뒤에 순서대로 삽입 */
    articles.insertBefore(el, articles.children[i + 1]);
  });

  /* 기록 개수 업데이트 */
  var countEl = document.querySelector('.filter-count');
  if (countEl) {
    var base = parseInt(countEl.textContent) || 42;
    countEl.textContent = '총 ' + (base + items.length) + '개의 기록';
  }
}

renderSavedItems();
