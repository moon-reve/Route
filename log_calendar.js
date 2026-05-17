/* ── localStorage에서 저장된 항목 읽기 ── */
function getSavedItems() {
  var items = [];
  var keys = Object.keys(localStorage).filter(function (k) {
    return k.startsWith('route_saved_') && !k.includes('_date') && !k.includes('_title') && !k.includes('_type') && !k.includes('_href');
  });
  keys.forEach(function (k) {
    if (localStorage.getItem(k) !== 'true') return;
    var base = k; /* e.g. route_saved_card1 */
    var dateStr = localStorage.getItem(base + '_date'); /* YYYY-MM-DD */
    if (!dateStr) return;
    items.push({
      key:   base,
      date:  dateStr,
      title: localStorage.getItem(base + '_title') || '',
      type:  localStorage.getItem(base + '_type')  || '',
      href:  localStorage.getItem(base + '_href')  || ''
    });
  });
  return items;
}

/* ── 저장 항목을 캘린더 dot으로 표시 ── */
function markSavedDates() {
  var items = getSavedItems();
  var currentYear  = 2026;
  var currentMonth = 5; /* 5월 */

  items.forEach(function (item) {
    var parts = item.date.split('-'); /* ['2026','05','17'] */
    var y = parseInt(parts[0]);
    var m = parseInt(parts[1]);
    var d = parseInt(parts[2]);
    if (y !== currentYear || m !== currentMonth) return;

    var cell = document.querySelector('.cal-day[data-day="' + d + '"]');
    if (!cell) return;

    /* .cal-dots 없으면 생성 */
    var dotsWrap = cell.querySelector('.cal-dots');
    if (!dotsWrap) {
      dotsWrap = document.createElement('div');
      dotsWrap.className = 'cal-dots';
      cell.appendChild(dotsWrap);
    }

    /* 이미 bookmark dot 있으면 중복 추가 방지 */
    if (!dotsWrap.querySelector('.cal-dot--bookmark')) {
      var dot = document.createElement('span');
      dot.className = 'cal-dot cal-dot--bookmark';
      dotsWrap.appendChild(dot);
    }
  });
}

/* ── 날짜 선택 ── */
var dayLabels = { 8: '5월 8일', 12: '5월 12일' };
var today = new Date().getDate();

function selectDay(day) {
  document.querySelectorAll('.cal-day[data-day]').forEach(function (el) {
    el.classList.remove('cal-day--selected');
  });
  var target = document.querySelector('.cal-day[data-day="' + day + '"]');
  if (target) target.classList.add('cal-day--selected');

  var cards = document.querySelectorAll('.log-card');
  var count = 0;

  /* 하드코딩 카드 필터 */
  cards.forEach(function (card) {
    if (parseInt(card.dataset.day) === day) {
      card.classList.remove('is-hidden');
      count++;
    } else {
      card.classList.add('is-hidden');
    }
  });

  /* 저장된 항목 중 해당 날짜 것 */
  var savedItems = getSavedItems().filter(function (item) {
    var d = parseInt(item.date.split('-')[2]);
    return d === day;
  });

  /* 동적 저장 카드 렌더링 */
  var savedSection = document.getElementById('saved-log-cards');
  if (savedSection) savedSection.innerHTML = '';

  savedItems.forEach(function (item) {
    count++;
    if (savedSection) {
      var card = document.createElement('div');
      card.className = 'log-card log-card--saved';
      if (item.href) card.setAttribute('data-href', item.href);
      card.innerHTML =
        '<div class="log-card-top">' +
          '<span class="log-badge badge--bookmark">[저장] ' + item.type + '</span>' +
        '</div>' +
        '<p class="log-title">' + item.title + '</p>';
      savedSection.appendChild(card);
    }
  });

  var empty    = document.getElementById('log-empty');
  var sectionLog = document.querySelector('.section-log');

  if (count === 0) {
    if (empty)      empty.classList.remove('is-hidden');
    if (sectionLog) sectionLog.classList.add('is-hidden');
  } else {
    if (empty)      empty.classList.add('is-hidden');
    if (sectionLog) sectionLog.classList.remove('is-hidden');
  }

  var label     = dayLabels[day] || ('5월 ' + day + '일');
  var countText = count > 0 ? ' (' + count + ')' : '';
  var divTitle  = document.querySelector('.divider-title');
  if (divTitle) divTitle.textContent = label + '의 기록' + countText;
}

/* ── 이벤트 위임: cal-day 클릭 ── */
document.querySelector('.cal-grid').addEventListener('click', function (e) {
  var cell = e.target.closest('.cal-day[data-day]');
  if (cell) selectDay(parseInt(cell.dataset.day));
});

/* ── 초기화 ── */
markSavedDates();
selectDay(today);
