// Section entrances, lightbox and the hero sequence. Content is fully visible without this script.
(function () {
  var root = document.documentElement;
  root.classList.add('js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Entrances: heading, then text, then picture, staggered. Only what starts below the first screen is prepared.
  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.remove('pre'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    document.querySelectorAll('[data-stagger]').forEach(function (group) {
      Array.prototype.forEach.call(group.querySelectorAll(':scope > *'), function (el, i) {
        el.classList.add('rv'); el.style.setProperty('--i', Math.min(i, 6));
      });
    });
    document.querySelectorAll('.rv').forEach(function (el) {
      if (el.getBoundingClientRect().top > window.innerHeight) { el.classList.add('pre'); io.observe(el); }
    });
    // Anything still hidden after a long wait (a thumbnail, a print) is shown anyway.
    setTimeout(function () { document.querySelectorAll('.rv.pre').forEach(function (el) {
      if (el.getBoundingClientRect().top < window.innerHeight) el.classList.remove('pre');
    }); }, 2500);
  }

  // Lightbox for screenshots.
  var lb = document.getElementById('lb');
  if (lb) {
    var big = lb.querySelector('img');
    document.querySelectorAll('[data-zoom]').forEach(function (img) {
      img.addEventListener('click', function () { big.src = img.currentSrc || img.src; big.alt = img.alt; lb.classList.add('open'); });
    });
    lb.addEventListener('click', function () { lb.classList.remove('open'); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') lb.classList.remove('open'); });
  }

  var y = document.getElementById('yr');
  if (y) y.textContent = new Date().getFullYear();
})();
