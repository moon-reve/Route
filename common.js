(function () {
  const root = document.getElementById('nav-root');
  if (!root) return;

  const page = document.body.dataset.page || '';

  const tabs = [
    { tab: 'home',  href: 'home',         img: 'images/nav_home.svg',  label: 'Home' },
    { tab: 'route', href: 'roadmap',      img: 'images/nav_route.svg', label: 'Route' },
    { tab: 'log',   href: 'log_calendar', img: 'images/nav_log.svg',   label: 'Log' },
    { tab: 'my',    href: 'my_page',      img: 'images/nav_my.svg',    label: 'My' },
  ];

  const makeTab = (t) =>
    `<a href="${t.href}" class="nav-tab${page === t.tab ? ' nav-tab--active' : ''}">` +
    `<img src="images/${t.img.replace('images/','')}" alt="${t.label}">` +
    `<span>${t.label}</span></a>`;

  root.outerHTML =
    `<nav class="nav-bar">` +
      makeTab(tabs[0]) +
      makeTab(tabs[1]) +
      `<a href="log_write" class="nav-center"><img src="images/nav_center.svg" alt=""></a>` +
      makeTab(tabs[2]) +
      makeTab(tabs[3]) +
    `</nav>`;
})();

/* ── 드래그 스크롤 유틸 ── */
function initDragScroll(selector) {
  document.querySelectorAll(selector).forEach(function (el) {
    var isDown = false, startX, sl;
    el.addEventListener('mousedown', function (e) {
      isDown = true;
      startX = e.pageX - el.offsetLeft;
      sl = el.scrollLeft;
      el.classList.add('is-dragging');
    });
    el.addEventListener('mouseleave', function () { isDown = false; el.classList.remove('is-dragging'); });
    el.addEventListener('mouseup',    function () { isDown = false; el.classList.remove('is-dragging'); });
    el.addEventListener('mousemove',  function (e) {
      if (!isDown) return;
      e.preventDefault();
      el.scrollLeft = sl - (e.pageX - el.offsetLeft - startX) * 1.5;
    });
  });
}

document.addEventListener('DOMContentLoaded', function () {
  // data-href: 클릭 시 페이지 이동
  document.querySelectorAll('[data-href]').forEach(function (el) {
    el.addEventListener('click', function () {
      location.href = this.dataset.href;
    });
  });

  // data-action="back": 뒤로가기
  document.querySelectorAll('[data-action="back"]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      history.back();
    });
  });

  // data-drag-scroll: 드래그 스크롤 자동 초기화
  initDragScroll('[data-drag-scroll]');
});
