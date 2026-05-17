(function () {
  var btn = document.getElementById('btn-bookmark');
  if (!btn) return;

  var ACTIVE_ICON   = 'images/detail_btn_bookmark.svg'; /* 활성화: sage 채움 */
  var INACTIVE_ICON = 'images/mag_btn_bookmark.svg';    /* 비활성화: 아웃라인 */
  var storageKey    = 'route_saved_' + btn.dataset.key;

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
      localStorage.removeItem(storageKey);
      localStorage.removeItem(storageKey + '_date');
      setIcon(false);
      showToast('로그에서 삭제되었습니다');
    } else {
      var date = new Date().toISOString().slice(0, 10);
      localStorage.setItem(storageKey, 'true');
      localStorage.setItem(storageKey + '_date', date);
      setIcon(true);
      showToast('로그에 저장되었습니다');
    }
  });
})();
