(function() {
  var track = document.getElementById('carrosselTrack');
  var dotsContainer = document.getElementById('carrDots');
  var slides = track ? track.querySelectorAll('.carr-slide') : [];
  var total = slides.length;
  var atual = 0;
  var visiveis = 3;

  function getVisiveis() {
    var w = window.innerWidth;
    if (w <= 400) return 1;
    if (w <= 600) return 2;
    return 3;
  }

  function calcularLargura() {
    visiveis = getVisiveis();
    var outer = track.parentElement;
    var gap = 16;
    var largura = (outer.offsetWidth - gap * (visiveis - 1)) / visiveis;
    slides.forEach(function(s) { s.style.width = largura + 'px'; s.style.minWidth = largura + 'px'; });
    return largura;
  }

  function maxIndex() { return Math.max(0, total - visiveis); }

  function moverPara(index) {
    var largura = calcularLargura();
    var gap = 16;
    atual = Math.min(Math.max(index, 0), maxIndex());
    track.style.transform = 'translateX(-' + (atual * (largura + gap)) + 'px)';
    atualizarDots();
  }

  function atualizarDots() {
    var dots = dotsContainer.querySelectorAll('.carr-dot');
    dots.forEach(function(d, i) {
      d.classList.toggle('ativo', i === atual);
    });
  }

  function criarDots() {
    dotsContainer.innerHTML = '';
    var max = maxIndex();
    for (var i = 0; i <= max; i++) {
      var btn = document.createElement('button');
      btn.className = 'carr-dot' + (i === 0 ? ' ativo' : '');
      btn.setAttribute('aria-label', 'Slide ' + (i + 1));
      (function(idx) { btn.addEventListener('click', function() { moverPara(idx); }); })(i);
      dotsContainer.appendChild(btn);
    }
  }

  window.moverCarrossel = function(dir) { moverPara(atual + dir); };

  window.addEventListener('resize', function() {
    calcularLargura();
    criarDots();
    moverPara(0);
  });

  if (track && total > 0) {
    calcularLargura();
    criarDots();
    moverPara(0);
  }
})();
