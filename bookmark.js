(function () {
  var btn = document.getElementById('btn-bookmark');
  if (!btn) return;

  var key           = btn.dataset.key;
  var ACTIVE_ICON   = 'images/detail_btn_bookmark.svg';
  var INACTIVE_ICON = 'images/mag_btn_bookmark.svg';
  var storageKey    = 'route_saved_' + key;

  /* ── 저장 여부 ── */
  function isSaved() {
    return localStorage.getItem(storageKey) === 'true';
  }

  /* ── 아이콘 상태 반영 ── */
  function setIcon(saved) {
    var img = btn.querySelector('img');
    if (img) img.src = saved ? ACTIVE_ICON : INACTIVE_ICON;
  }

  /* ── 토스트 표시 (2초 후 자동 소멸) ── */
  function showToast(message) {
    var toast = document.getElementById('bookmark-toast');
    if (!toast) return;
    toast.querySelector('.toast-text').textContent = message;
    toast.classList.remove('is-hidden');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(function () {
      toast.classList.add('is-hidden');
    }, 2000);
  }

  /* ── 초기 아이콘 상태 ── */
  setIcon(isSaved());

  /* ── 클릭 토글 ── */
  btn.addEventListener('click', function () {
    var saved = isSaved();
    if (saved) {
      /* 삭제 */
      ['', '_date', '_title', '_type', '_href'].forEach(function (suffix) {
        localStorage.removeItem(storageKey + suffix);
      });
      setIcon(false);
      showToast('로그에서 삭제되었습니다');
    } else {
      /* 저장 — 날짜 + 메타데이터 */
      var date = new Date().toISOString().slice(0, 10); /* YYYY-MM-DD */
      localStorage.setItem(storageKey,          'true');
      localStorage.setItem(storageKey + '_date',  date);
      localStorage.setItem(storageKey + '_title', btn.dataset.title  || '');
      localStorage.setItem(storageKey + '_type',  btn.dataset.type   || '');
      localStorage.setItem(storageKey + '_href',  btn.dataset.href   || '');
      setIcon(true);
      showToast('로그에 저장되었습니다');
    }
  });
})();
