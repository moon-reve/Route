/* ── 점3개 팝오버 ── */
document.getElementById('btn-menu').addEventListener('click', function (e) {
  e.stopPropagation();
  document.getElementById('menuPopover').classList.toggle('is-open');
});

document.addEventListener('click', function () {
  document.getElementById('menuPopover').classList.remove('is-open');
});

/* ── 편집 모드 ── */
var editMode = false;

function enterEditMode() {
  document.getElementById('menuPopover').classList.remove('is-open');
  editMode = true;
  document.querySelectorAll('.btn-trash').forEach(function (btn) { btn.classList.add('is-visible'); });
  document.getElementById('menuPopoverBtn').textContent = '편집완료';
}

function exitEditMode() {
  document.getElementById('menuPopover').classList.remove('is-open');
  editMode = false;
  document.querySelectorAll('.btn-trash').forEach(function (btn) { btn.classList.remove('is-visible'); });
  document.getElementById('menuPopoverBtn').textContent = '편집';
}

function toggleEditMode() {
  editMode ? exitEditMode() : enterEditMode();
}

document.getElementById('menuPopoverBtn').addEventListener('click', toggleEditMode);

/* ── 삭제 모달 ── */
var targetCardId = null;

function openDeleteModal(cardId) {
  targetCardId = cardId;
  document.getElementById('deleteModal').classList.add('is-open');
}

function closeDeleteModal() {
  targetCardId = null;
  document.getElementById('deleteModal').classList.remove('is-open');
}

function confirmDelete() {
  if (targetCardId) {
    var card = document.getElementById(targetCardId);
    if (card) card.remove();
    targetCardId = null;
  }
  document.getElementById('deleteModal').classList.remove('is-open');
}

/* 이벤트 위임: btn-trash 클릭 → openDeleteModal */
document.querySelector('.daily-container').addEventListener('click', function (e) {
  var btn = e.target.closest('.btn-trash');
  if (btn) openDeleteModal(btn.dataset.cardId);
});

document.querySelector('.modal-btn--gray').addEventListener('click', closeDeleteModal);
document.querySelector('.modal-btn--charcoal').addEventListener('click', confirmDelete);
