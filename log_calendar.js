var dayLabels = { 8: '5월 8일', 12: '5월 12일' };
var today = new Date().getDate();

function selectDay(day) {
  // 선택 상태 업데이트
  document.querySelectorAll('.cal-day[data-day]').forEach(function (el) {
    el.classList.remove('cal-day--selected');
  });
  var target = document.querySelector('.cal-day[data-day="' + day + '"]');
  if (target) target.classList.add('cal-day--selected');

  // 카드 필터링
  var cards = document.querySelectorAll('.log-card');
  var count = 0;
  cards.forEach(function (card) {
    if (parseInt(card.dataset.day) === day) {
      card.style.display = '';
      count++;
    } else {
      card.style.display = 'none';
    }
  });

  // 빈 상태 / 카드 영역 토글
  var empty = document.getElementById('log-empty');
  var sectionLog = document.querySelector('.section-log');
  if (count === 0) {
    empty.style.display = 'block';
    sectionLog.style.display = 'none';
  } else {
    empty.style.display = 'none';
    sectionLog.style.display = '';
  }

  // 디바이더 타이틀 업데이트
  var label = dayLabels[day] || ('5월 ' + day + '일');
  var countText = count > 0 ? ' (' + count + ')' : '';
  document.querySelector('.divider-title').textContent = label + '의 기록' + countText;
}

/* 이벤트 위임: cal-day 클릭 */
document.querySelector('.cal-grid').addEventListener('click', function (e) {
  var cell = e.target.closest('.cal-day[data-day]');
  if (cell) selectDay(parseInt(cell.dataset.day));
});

// 초기 상태: 오늘 날짜 선택 (기록 없으면 빈 상태)
selectDay(today);
