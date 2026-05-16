function toggleTask(item) {
  var icon = item.querySelector('.task-icon');
  var isDone = icon.src.includes('task_done');
  icon.src = isDone
    ? 'images/feedback_icon_task_todo.svg'
    : 'images/feedback_icon_task_done.svg';
  item.classList.toggle('checklist-item--done', !isDone);
}

/* 이벤트 위임: checklist-item 클릭 */
document.querySelector('.checklist').addEventListener('click', function (e) {
  var item = e.target.closest('.checklist-item');
  if (item) toggleTask(item);
});

function toggleModal(e) {
  e.stopPropagation();
  var modal = document.getElementById('profileModal');
  modal.classList.toggle('is-open');
}

document.getElementById('chatBtn').addEventListener('click', toggleModal);

document.addEventListener('click', function () {
  document.getElementById('profileModal').classList.remove('is-open');
});
