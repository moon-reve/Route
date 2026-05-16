document.addEventListener('DOMContentLoaded', function () {
  var openBtn = document.getElementById('open-modal');
  var overlay = document.getElementById('overlay');
  var modal   = document.getElementById('modal');

  if (!openBtn || !overlay || !modal) return;

  function openModal() {
    overlay.classList.add('active');
    modal.classList.add('active');
  }

  function closeModal() {
    overlay.classList.remove('active');
    modal.classList.remove('active');
  }

  openBtn.addEventListener('click', openModal);
  overlay.addEventListener('click', closeModal);
});
