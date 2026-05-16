function selectOption(el) {
  var isSelected = el.classList.contains('option-item--selected');
  // 모든 선택 해제
  document.querySelectorAll('.option-item').forEach(function (item) {
    item.classList.remove('option-item--selected');
    item.querySelector('.option-radio').src = 'images/pre_radio_empty.svg';
  });
  // 이미 선택된 항목 클릭 시 → 선택 취소 (toggle)
  if (!isSelected) {
    el.classList.add('option-item--selected');
    el.querySelector('.option-radio').src = 'images/pre_radio_selected.svg';
  }
}

function toggleTool(card) {
  card.classList.toggle('tool-card--selected');
}

function selectDomain(card) {
  card.classList.toggle('domain-card--selected');
}

document.addEventListener('DOMContentLoaded', function () {
  // option-item 선택
  var optionContainer = document.querySelector('.option-list');
  if (optionContainer) {
    optionContainer.addEventListener('click', function (e) {
      var item = e.target.closest('.option-item');
      if (item) selectOption(item);
    });
  }

  // tool-card 선택
  var toolContainer = document.querySelector('.tool-grid');
  if (toolContainer) {
    toolContainer.addEventListener('click', function (e) {
      var card = e.target.closest('.tool-card');
      if (card) toggleTool(card);
    });
  }

  // domain-card 선택
  var domainContainer = document.querySelector('.domain-grid');
  if (domainContainer) {
    domainContainer.addEventListener('click', function (e) {
      var card = e.target.closest('.domain-card');
      if (card) selectDomain(card);
    });
  }
});
