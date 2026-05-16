// ── 탭별 설정 ──
var TAB_CONFIG = {
  log: {
    titleLabel:   '제목 (필수)',
    titlePH:      '오늘은 어떤 기록을 해볼까요',
    descPH:       '왜 이렇게 했는지, 무엇을 느꼈는지 — 나중에 면접 준비할 때 가장 도움이 될 기록이에요',
    heroCap:      '탭하여 오늘의 항해 순간을 담아보세요',
    heroImg:      'images/log_hero_img.svg',
    showLink:     false,
    showFile:     false,
    showLogDate:  true,
    showDur:      false,
    showReminder: false,
  },
  lecture: {
    titleLabel:   '항로 이름 (필수)',
    titlePH:      '예) 피그마 오토레이아웃 마스터 클래스',
    descPH:       '이 항로에 대해 간단히 설명해 주세요',
    heroCap:      '링크를 입력하면 썸네일이 자동으로 채워져요',
    heroImg:      'images/log_hero_img.svg',
    linkLabel:    '학습할 링크 (선택)',
    showLink:     true,
    showFile:     false,
    showLogDate:  false,
    showDur:      true,
    showReminder: true,
  },
  book: {
    titleLabel:   '타이틀 (필수)',
    titlePH:      '타이틀을 적어주세요',
    descPH:       '이 책에 대해 간단히 설명해 주세요',
    heroCap:      '책 한 권이 나의 항로가 됩니다',
    heroImg:      'images/log_hero_book_img.svg',
    showLink:     false,
    showFile:     false,
    showLogDate:  false,
    showDur:      true,
    showReminder: true,
  },
  project: {
    titleLabel:   '프로젝트 타이틀 (필수)',
    titlePH:      '프로젝트 타이틀을 적어주세요',
    descPH:       '프로젝트의 소개를 간단히 적어주세요',
    heroCap:      '완성이 아닌 과정도 빛나는 궤적입니다',
    heroImg:      'images/log_hero_project_img.svg',
    linkLabel:    '프로젝트 링크 (선택)',
    showLink:     true,
    showFile:     true,
    showLogDate:  false,
    showDur:      true,
    showReminder: true,
  },
};

function selectTab(el, type) {
  document.querySelectorAll('.resource-tab').forEach(function (t) { t.classList.remove('resource-tab--active'); });
  el.classList.add('resource-tab--active');

  var cfg = TAB_CONFIG[type];
  var show = function (v) { return v ? '' : 'none'; };

  document.getElementById('link-group').style.display        = show(cfg.showLink);
  document.getElementById('file-upload-group').style.display = show(cfg.showFile);
  document.getElementById('section-log-date').style.display  = show(cfg.showLogDate);
  document.getElementById('section-duration').style.display  = show(cfg.showDur);
  document.getElementById('section-reminder').style.display  = show(cfg.showReminder);

  document.getElementById('title-label').textContent         = cfg.titleLabel;
  document.getElementById('title-input').placeholder         = cfg.titlePH;
  document.getElementById('desc-input').placeholder          = cfg.descPH;
  document.getElementById('hero-caption').textContent        = cfg.heroCap;
  document.getElementById('hero-caption').style.display      = '';
  document.getElementById('hero-img').src                    = cfg.heroImg;
  if (cfg.linkLabel) document.getElementById('link-label').textContent = cfg.linkLabel;

  resetDates();
  closeCal();
  closeTimePicker();
  document.getElementById('section-reminder').dataset.active = 'true';
}

// 탭 클릭 이벤트 위임
document.querySelector('.resource-tabs').addEventListener('click', function (e) {
  var tab = e.target.closest('.resource-tab');
  if (!tab) return;
  var tabs = document.querySelectorAll('.resource-tab');
  var idx = Array.from(tabs).indexOf(tab);
  var types = ['log', 'lecture', 'book', 'project'];
  if (types[idx] !== undefined) selectTab(tab, types[idx]);
});

// ── 리마인더 토글 ──
function toggleReminder() {
  var section = document.getElementById('section-reminder');
  var isActive = section.dataset.active === 'true';
  section.dataset.active = isActive ? 'false' : 'true';
  if (isActive) closeTimePicker();
}

document.querySelector('.toggle-switch').addEventListener('click', toggleReminder);

// ── 히어로 이미지 업로드 ──
function uploadHeroImage() {
  document.getElementById('hero-file-input').click();
}

document.querySelector('.hero-illustration').addEventListener('click', uploadHeroImage);

function handleHeroImage(event) {
  var file = event.target.files[0];
  if (!file) return;
  var url = URL.createObjectURL(file);
  var img = document.getElementById('hero-img');
  img.src = url;
  img.style.objectFit = 'cover';
  document.getElementById('hero-caption').style.display = 'none';
}

document.getElementById('hero-file-input').addEventListener('change', handleHeroImage);

// ── 프로젝트 파일 업로드 ──
function handleProjectFile(event) {
  var file = event.target.files[0];
  if (!file) return;
  document.getElementById('file-name-text').textContent = file.name;
  document.getElementById('file-name-text').style.color = 'var(--midnight-charcoal)';
}

document.getElementById('project-file-input').addEventListener('change', handleProjectFile);

document.querySelector('.input-box--file').addEventListener('click', function () {
  document.getElementById('project-file-input').click();
});

// ── 캘린더 ──
var MONTHS = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];
var calTarget = null;
var calYear   = new Date().getFullYear();
var calMonth  = new Date().getMonth();
var startDate = null;
var endDate   = null;
var logDate   = null;
var today     = new Date();

function formatDisplay(y, m, d) {
  return y + '. ' + String(m+1).padStart(2,'0') + '. ' + String(d).padStart(2,'0');
}

function resetDates() {
  startDate = null;
  endDate   = null;
  calYear   = today.getFullYear();
  calMonth  = today.getMonth();
  var startEl = document.getElementById('start-date-text');
  var endEl   = document.getElementById('end-date-text');
  startEl.textContent = '시작일 선택';
  startEl.classList.add('date-placeholder');
  endEl.textContent   = '종료일 선택';
  endEl.classList.add('date-placeholder');
  setLogDateToday();
}

function setLogDateToday() {
  var y = today.getFullYear(), m = today.getMonth(), d = today.getDate();
  logDate = y + '-' + m + '-' + d;
  var el = document.getElementById('log-date-text');
  el.textContent = formatDisplay(y, m, d);
  el.classList.remove('date-placeholder');
}

function openCal(target, anchor) {
  var popup = document.getElementById('cal-popup');
  if (popup.style.display === 'block' && calTarget === target) {
    closeCal();
    return;
  }
  calTarget = target;
  popup.style.display = 'block';
  var rect = anchor.getBoundingClientRect();
  var top  = rect.bottom + 8;
  var left = rect.left;
  if (left + 276 > window.innerWidth) left = window.innerWidth - 284;
  if (top + 260 > window.innerHeight) top = rect.top - 268;
  popup.style.top  = top + 'px';
  popup.style.left = left + 'px';
  renderCal();
}

function closeCal() {
  document.getElementById('cal-popup').style.display = 'none';
}

function moveCal(dir) {
  calMonth += dir;
  if (calMonth > 11) { calMonth = 0;  calYear++; }
  if (calMonth < 0)  { calMonth = 11; calYear--; }
  renderCal();
}

function renderCal() {
  document.getElementById('cal-title').textContent = calYear + '년 ' + MONTHS[calMonth];
  var grid     = document.getElementById('cal-grid');
  grid.innerHTML = '';
  var firstDay = new Date(calYear, calMonth, 1).getDay();
  var lastDay  = new Date(calYear, calMonth + 1, 0).getDate();
  var selKey   = calTarget === 'start' ? startDate :
                 calTarget === 'end'   ? endDate   : logDate;

  var minDate = null;
  if (calTarget === 'end' && startDate) {
    var parts = startDate.split('-').map(Number);
    minDate = new Date(parts[0], parts[1], parts[2]);
  }

  for (var i = 0; i < firstDay; i++) {
    var blank = document.createElement('span');
    blank.className = 'cal-empty';
    grid.appendChild(blank);
  }
  for (var d = 1; d <= lastDay; d++) {
    var btn = document.createElement('button');
    btn.className   = 'cal-day';
    btn.textContent = d;
    var key = calYear + '-' + calMonth + '-' + d;
    if (selKey === key) btn.classList.add('cal-day--selected');
    var thisDate = new Date(calYear, calMonth, d);
    if (minDate && thisDate < minDate) {
      btn.classList.add('cal-day--disabled');
    } else {
      (function(day) {
        btn.onclick = function () { pickDate(day); };
      })(d);
    }
    grid.appendChild(btn);
  }
}

function pickDate(d) {
  var key     = calYear + '-' + calMonth + '-' + d;
  var display = formatDisplay(calYear, calMonth, d);
  if (calTarget === 'start') {
    startDate = key;
    var el = document.getElementById('start-date-text');
    el.textContent = display;
    el.classList.remove('date-placeholder');
  } else if (calTarget === 'end') {
    endDate = key;
    var el = document.getElementById('end-date-text');
    el.textContent = display;
    el.classList.remove('date-placeholder');
  } else {
    logDate = key;
    var el = document.getElementById('log-date-text');
    el.textContent = display;
    el.classList.remove('date-placeholder');
  }
  closeCal();
}

// 날짜 박스 클릭
document.querySelector('#section-log-date .date-box').addEventListener('click', function () {
  openCal('log', this);
});

// 기간 설정 날짜 박스 클릭 (이벤트 위임)
document.querySelector('#section-duration').addEventListener('click', function (e) {
  var box = e.target.closest('.date-box');
  if (!box) return;
  var boxes = this.querySelectorAll('.date-box');
  if (box === boxes[0]) openCal('start', box);
  else if (box === boxes[1]) openCal('end', box);
});

// 캘린더 이전/다음 버튼
var calNavBtns = document.querySelectorAll('.cal-nav');
calNavBtns[0].addEventListener('click', function () { moveCal(-1); });
calNavBtns[1].addEventListener('click', function () { moveCal(1); });

// ── 드럼 시간 피커 ──
var ITEM_H = 36;

var drumData = {
  ampm: { items: ['오전', '오후'],                                              selIdx: 0 },
  hour: { items: ['1','2','3','4','5','6','7','8','9','10','11','12'],           selIdx: 8 },
  min:  { items: ['00','05','10','15','20','25','30','35','40','45','50','55'],  selIdx: 0 },
};

// 현재 시간으로 초기 인덱스 설정
(function() {
  var now  = new Date();
  var h    = now.getHours();
  var m    = now.getMinutes();
  var isAm = h < 12;
  h = h % 12 || 12;
  var nearestMin = Math.round(m / 5) * 5 % 60;
  drumData.ampm.selIdx = isAm ? 0 : 1;
  drumData.hour.selIdx = h - 1;
  drumData.min.selIdx  = nearestMin / 5;
})();

function buildDrum(key) {
  var d   = drumData[key];
  var col = document.getElementById('drum-' + key);
  col.innerHTML = '';
  d.items.forEach(function (text) {
    var div = document.createElement('div');
    div.className = 'drum-item';
    div.textContent = text;
    col.appendChild(div);
  });
  col.scrollTop = d.selIdx * ITEM_H;
  updateDrumStyle(col, d.selIdx);

  var timer;
  col.addEventListener('scroll', function () {
    var cur = col.scrollTop / ITEM_H;
    updateDrumStyle(col, cur);
    clearTimeout(timer);
    timer = setTimeout(function () {
      var idx = Math.max(0, Math.min(Math.round(col.scrollTop / ITEM_H), d.items.length - 1));
      d.selIdx = idx;
      col.scrollTo({ top: idx * ITEM_H, behavior: 'smooth' });
      updateDrumStyle(col, idx);
    }, 120);
  });
}

function updateDrumStyle(col, cur) {
  col.querySelectorAll('.drum-item').forEach(function (el, i) {
    var dist = Math.abs(i - cur);
    if (dist < 0.5) {
      el.style.fontWeight = '600';
      el.style.fontSize   = '14px';
      el.style.color      = 'var(--midnight-charcoal)';
      el.style.opacity    = '1';
    } else if (dist < 1.5) {
      el.style.fontWeight = '400';
      el.style.fontSize   = '12px';
      el.style.color      = 'rgba(26,28,30,0.35)';
      el.style.opacity    = '1';
    } else {
      el.style.fontWeight = '400';
      el.style.fontSize   = '11px';
      el.style.color      = 'rgba(26,28,30,0.15)';
      el.style.opacity    = '1';
    }
  });
}

function initDrums() {
  buildDrum('ampm'); buildDrum('hour'); buildDrum('min');
}

function openTimePicker(anchor) {
  var popup = document.getElementById('time-popup');
  if (popup.style.display === 'block') { closeTimePicker(); return; }
  closeCal();
  popup.style.display = 'block';
  initDrums();
  var rect   = anchor.getBoundingClientRect();
  var popupH = 165;
  var popupW = 268;
  var top  = rect.top - popupH - 8;
  if (top < 8) top = rect.bottom + 8;
  var left = rect.right - popupW;
  if (left < 8) left = 8;
  popup.style.top  = top + 'px';
  popup.style.left = left + 'px';
}

function closeTimePicker() {
  document.getElementById('time-popup').style.display = 'none';
}

function confirmTime() {
  var ap   = drumData.ampm.items[drumData.ampm.selIdx];
  var hr   = drumData.hour.items[drumData.hour.selIdx];
  var mn   = drumData.min.items[drumData.min.selIdx];
  document.getElementById('reminder-time-display').textContent = ap + ' ' + hr + ':' + mn;
  closeTimePicker();
}

document.querySelector('.reminder-time-row').addEventListener('click', function () {
  openTimePicker(this);
});

document.querySelector('.time-confirm-btn').addEventListener('click', confirmTime);

// 팝업 외부 클릭 시 닫기
document.addEventListener('click', function (e) {
  var cal  = document.getElementById('cal-popup');
  var time = document.getElementById('time-popup');
  if (!cal.contains(e.target) && !e.target.closest('.date-box')) closeCal();
  if (!time.contains(e.target) && !e.target.closest('.reminder-time-row')) closeTimePicker();
});

// 초기화
document.getElementById('link-group').style.display         = 'none';
document.getElementById('file-upload-group').style.display  = 'none';
document.getElementById('section-duration').style.display   = 'none';
document.getElementById('section-reminder').style.display   = 'none';
setLogDateToday();
