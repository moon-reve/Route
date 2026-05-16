// 카드 리스트 마우스/터치 드래그 스크롤
var cardList = document.querySelector('.card-list');
var isDown = false;
var startX;
var scrollLeft;

cardList.addEventListener('mousedown', function (e) {
  isDown = true;
  cardList.classList.add('is-dragging');
  startX = e.pageX - cardList.offsetLeft;
  scrollLeft = cardList.scrollLeft;
});

cardList.addEventListener('mouseleave', function () {
  isDown = false;
  cardList.classList.remove('is-dragging');
});

cardList.addEventListener('mouseup', function () {
  isDown = false;
  cardList.classList.remove('is-dragging');
});

cardList.addEventListener('mousemove', function (e) {
  if (!isDown) return;
  e.preventDefault();
  var x = e.pageX - cardList.offsetLeft;
  var walk = (x - startX) * 1.5;
  cardList.scrollLeft = scrollLeft - walk;
});

// Read More
var visibleArticleCount = 3;
var currentCat = null;

function applyArticles() {
  var articles = Array.from(document.querySelectorAll('.article-item'));
  var readMoreBtn = document.getElementById('read-more-btn');

  if (!currentCat) {
    articles.forEach(function (item, i) {
      item.style.display = i < visibleArticleCount ? '' : 'none';
    });
    readMoreBtn.style.display = visibleArticleCount < articles.length ? '' : 'none';
  } else {
    articles.forEach(function (item) {
      item.style.display = item.dataset.category === currentCat ? '' : 'none';
    });
    readMoreBtn.style.display = 'none';
  }
}

document.getElementById('read-more-btn').addEventListener('click', function () {
  visibleArticleCount += 2;
  applyArticles();
});

// 카테고리별 색상 (RGB)
var categoryColors = {
  design:    [232, 148, 26 ],
  dev:       [71,  181, 167],
  plan:      [158, 144, 188],
  marketing: [212, 132, 154],
};
var catMap = {
  '전체': null, '디자인': 'design', '개발': 'dev', '기획': 'plan', '마케팅': 'marketing'
};
var chipColorMap = {
  '디자인': [232,148,26], '개발': [71,181,167], '기획': [158,144,188], '마케팅': [212,132,154]
};

// 카드 색상 적용 (더보기 카드 제외)
document.querySelectorAll('.card:not(.card--more)').forEach(function (card) {
  var cat = card.dataset.category || 'design';
  var rgb = categoryColors[cat] || categoryColors.design;
  var r = rgb[0], g = rgb[1], b = rgb[2];
  card.style.border = '1px solid rgba(' + r + ',' + g + ',' + b + ',0.7)';
  var textBox = card.querySelector('.card-text-box');
  if (textBox) textBox.style.background = 'rgba(' + r + ',' + g + ',' + b + ',0.2)';
});

// 필터 함수
function applyFilter(label) {
  var cat = catMap[label];
  var moreCard = document.getElementById('card-more');

  // 아티클 상태 업데이트
  currentCat = cat;
  if (!cat) visibleArticleCount = 3;

  if (!cat) {
    // 전체: 카테고리별 첫 번째 카드만 표시
    var seen = new Set();
    document.querySelectorAll('.card:not(.card-more-btn)').forEach(function (card) {
      var cardCat = card.dataset.category;
      if (!seen.has(cardCat)) {
        card.style.display = '';
        seen.add(cardCat);
      } else {
        card.style.display = 'none';
      }
    });
    if (moreCard) moreCard.style.display = '';
  } else {
    // 특정 카테고리: 해당 카드 전체 + 더보기 숨김
    document.querySelectorAll('.card:not(.card-more-btn)').forEach(function (card) {
      card.style.display = card.dataset.category === cat ? '' : 'none';
    });
    if (moreCard) moreCard.style.display = 'none';
  }

  applyArticles();

  // 섹션 표시 여부
  var anyCard = Array.from(document.querySelectorAll('.card:not(.card-more-btn)')).some(function (c) { return c.style.display !== 'none'; });
  document.querySelector('.section-cards').style.display    = anyCard ? '' : 'none';
  document.querySelector('.section-articles').style.display = '';

  // DOM 업데이트 후 스크롤 초기화
  requestAnimationFrame(function () { cardList.scrollLeft = 0; });
}

// 카드 onclick → data-href 패턴으로 처리 (이벤트 위임)
document.querySelector('.section-cards').addEventListener('click', function (e) {
  var card = e.target.closest('.card[data-href]');
  if (card) location.href = card.dataset.href;
});

// 아티클 onclick → data-href 패턴으로 처리 (이벤트 위임)
document.querySelector('.section-articles').addEventListener('click', function (e) {
  var item = e.target.closest('.article-item[data-href]');
  if (item) location.href = item.dataset.href;
});

// 칩 클릭 이벤트
document.querySelectorAll('.section-chips .chip').forEach(function (chip) {
  chip.addEventListener('click', function () {
    var label = this.textContent.trim();

    document.querySelectorAll('.section-chips .chip').forEach(function (c) {
      c.classList.remove('chip--active');
      c.style.background = '';
      c.style.borderColor = '';
      c.style.color = '';
    });
    this.classList.add('chip--active');
    if (chipColorMap[label]) {
      var rgb = chipColorMap[label];
      this.style.background  = 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
      this.style.borderColor = 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
      this.style.color       = '#fff';
    }

    applyFilter(label);
  });
});

// 초기 전체 탭 적용
applyFilter('전체');
