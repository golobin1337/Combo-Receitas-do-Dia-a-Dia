(function() {
  var trackOuter = document.querySelector('.carrossel-track-outer');
  var track = document.getElementById('carrosselTrack');
  var dotsContainer = document.getElementById('carrDots');
  if (!track || !trackOuter) return;

  var slidesOriginais = Array.prototype.slice.call(track.querySelectorAll('.carr-slide'));
  var total = slidesOriginais.length;
  if (total === 0) return;

  var MAX_VISIVEIS = 3;
  var AUTOPLAY_MS = 2800;

  // clona os primeiros slides e anexa no final pro loop ficar contínuo, sem corte
  for (var c = 0; c < MAX_VISIVEIS; c++) {
    var clone = slidesOriginais[c % total].cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
  }

  var visiveis = 3;
  var atual = 0;
  var timer = null;

  function getVisiveis() {
    var w = window.innerWidth;
    if (w <= 400) return 1;
    if (w <= 600) return 2;
    return 3;
  }

  function calcularLargura() {
    visiveis = getVisiveis();
    var gap = 16;
    var largura = (trackOuter.offsetWidth - gap * (visiveis - 1)) / visiveis;
    track.querySelectorAll('.carr-slide').forEach(function(s) {
      s.style.width = largura + 'px';
      s.style.minWidth = largura + 'px';
    });
    return largura;
  }

  function irPara(index, instantaneo) {
    var largura = calcularLargura();
    var gap = 16;
    track.style.transition = instantaneo ? 'none' : '';
    track.style.transform = 'translateX(-' + (index * (largura + gap)) + 'px)';
    if (instantaneo) {
      track.offsetHeight; // força reflow antes de reativar a transição
      track.style.transition = '';
    }
    atual = index;
    atualizarDots();
  }

  function atualizarDots() {
    var dots = dotsContainer.querySelectorAll('.carr-dot');
    var ativo = ((atual % total) + total) % total;
    dots.forEach(function(d, i) { d.classList.toggle('ativo', i === ativo); });
  }

  function criarDots() {
    dotsContainer.innerHTML = '';
    for (var i = 0; i < total; i++) {
      var btn = document.createElement('button');
      btn.className = 'carr-dot' + (i === 0 ? ' ativo' : '');
      btn.setAttribute('aria-label', 'Slide ' + (i + 1));
      (function(idx) { btn.addEventListener('click', function() { irParaComReset(idx); }); })(i);
      dotsContainer.appendChild(btn);
    }
  }

  function avancar() {
    var proximo = atual + 1;
    irPara(proximo);
    if (proximo >= total) {
      setTimeout(function() { irPara(0, true); }, 420);
    }
  }

  function voltar() {
    if (atual <= 0) return;
    irPara(atual - 1);
  }

  function irParaComReset(index) {
    irPara(index);
    reiniciarAutoplay();
  }

  function iniciarAutoplay() {
    clearInterval(timer);
    timer = setInterval(avancar, AUTOPLAY_MS);
  }

  window.moverCarrossel = function(dir) {
    if (dir > 0) { avancar(); } else { voltar(); }
    reiniciarAutoplay();
  };

  function reiniciarAutoplay() { iniciarAutoplay(); }

  window.addEventListener('resize', function() {
    irPara(atual, true);
  });

  trackOuter.addEventListener('mouseenter', function() { clearInterval(timer); });
  trackOuter.addEventListener('mouseleave', iniciarAutoplay);

  criarDots();
  irPara(0, true);
  iniciarAutoplay();
})();
