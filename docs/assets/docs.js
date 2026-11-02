// Client-side search over /docs/manifest.json, plus the video play button.
(function () {
  var q = document.getElementById('q'), box = document.getElementById('results'), items = null, sel = -1;
  function load() {
    if (items) return Promise.resolve(items);
    return fetch('/docs/manifest.json').then(function (r) { return r.json(); }).then(function (m) { return (items = m); }).catch(function () { return (items = []); });
  }
  function score(it, terms) {
    var t = it.title.toLowerCase(), s = (it.summary || '').toLowerCase(), a = it.url.toLowerCase(), n = 0;
    for (var i = 0; i < terms.length; i++) {
      var w = terms[i], hit = 0;
      if (t.indexOf(w) === 0) hit = 6; else if (t.indexOf(w) > -1) hit = 4;
      else if (s.indexOf(w) > -1) hit = 2; else if (a.indexOf(w) > -1) hit = 1;
      if (!hit) return 0;
      n += hit;
    }
    return n;
  }
  function esc(x) { return String(x).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function render() {
    var terms = q.value.toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) { box.hidden = true; return; }
    load().then(function (m) {
      var hits = m.map(function (it) { return [score(it, terms), it]; }).filter(function (p) { return p[0]; })
        .sort(function (a, b) { return b[0] - a[0]; }).slice(0, 8);
      sel = -1;
      box.innerHTML = hits.length ? hits.map(function (p) {
        return '<a href="' + esc(new URL(p[1].url).pathname) + '"><b>' + esc(p[1].title) + '</b><span>' + esc(p[1].summary || '') + '</span></a>';
      }).join('') : '<div class="none">Nothing found. Try fewer words.</div>';
      box.hidden = false;
    });
  }
  if (q) {
    q.addEventListener('input', render);
    q.addEventListener('focus', function () { load(); if (q.value) render(); });
    q.addEventListener('keydown', function (e) {
      var links = box.querySelectorAll('a');
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault(); if (!links.length) return;
        sel = (sel + (e.key === 'ArrowDown' ? 1 : -1) + links.length) % links.length;
        links.forEach(function (l, i) { l.classList.toggle('sel', i === sel); });
      } else if (e.key === 'Enter') { var l = links[Math.max(sel, 0)]; if (l) location.href = l.getAttribute('href'); }
      else if (e.key === 'Escape') { box.hidden = true; q.blur(); }
    });
    document.addEventListener('click', function (e) { if (!e.target.closest('.search')) box.hidden = true; });
    document.addEventListener('keydown', function (e) { if (e.key === '/' && document.activeElement.tagName !== 'INPUT') { e.preventDefault(); q.focus(); } });
  }

  var frame = document.querySelector('.video');
  if (frame) {
    var v = frame.querySelector('video'), cur = frame.querySelector('.cur'), dur = frame.querySelector('.dur');
    var clock = function (s) { return Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0'); };
    v.addEventListener('loadedmetadata', function () { if (isFinite(v.duration)) dur.textContent = clock(v.duration); });
    v.addEventListener('timeupdate', function () { cur.textContent = clock(v.currentTime); });
    v.addEventListener('play', function () { frame.classList.add('playing'); v.controls = true; });
    v.addEventListener('ended', function () { frame.classList.remove('playing'); v.controls = false; });
    frame.addEventListener('click', function (e) { if (e.target === v && v.controls) return; if (v.paused) v.play(); else if (!v.controls) v.pause(); });
  }
})();
