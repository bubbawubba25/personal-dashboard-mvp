// js/main.js
document.addEventListener('DOMContentLoaded', () => {
  const gamesUrl = 'data/gxmes.json'; // update path if needed

  const searchInput = document.getElementById('search');
  const gamesGrid = document.getElementById('games-grid');

  const featuredDay = document.getElementById('featured-day');
  const featuredFav = document.getElementById('featured-fav');
  const featuredMost = document.getElementById('featured-most');

  const popup = document.getElementById('game-popup');
  const popupOverlay = document.getElementById('popup-overlay');
  const iframe = document.getElementById('game-iframe');
  const closeBtn = document.getElementById('close-popup');

  let games = [];

  async function loadGames() {
    try {
      const res = await fetch(gamesUrl);
      games = await res.json();
      renderFeatured(games);
      renderGrid(games);
    } catch (err) {
      console.error('Failed to load games.json', err);
    }
  }

  function renderFeatured(list) {
    if(!list || list.length === 0) return;

    // Game of the Day (deterministic by date)
    const today = new Date();
    const seed = `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`;
    const idx = Math.abs(seed.split('').reduce((a,c)=>a + c.charCodeAt(0), 0)) % list.length;
    const gameOfDay = list[idx];
    fillFeaturedCard(featuredDay, gameOfDay);

    // Owner's favorite: look for favorite:true else fallback to first
    const favorite = list.find(g => g.favorite) || list[0];
    fillFeaturedCard(featuredFav, favorite);

    // Most liked: expecting a "likes" number; else fallback to second entry
    const mostLiked = [...list].sort((a,b) => (b.likes||0) - (a.likes||0))[0] || list[1] || list[0];
    fillFeaturedCard(featuredMost, mostLiked);
  }

  function fillFeaturedCard(cardEl, game) {
    if(!cardEl || !game) return;
    const thumb = cardEl.querySelector('.thumb');
    const title = cardEl.querySelector('.title');

    thumb.style.backgroundImage = `url("${game.thumbnail || 'images/thumbnails/thumbnail_default.jpg'}")`;
    title.textContent = game.name;
    cardEl.dataset.file = game.file;
    cardEl.dataset.name = game.name;
  }

  function renderGrid(list) {
    if(!gamesGrid) return;
    gamesGrid.innerHTML = '';
    list.forEach(g => {
      const el = document.createElement('div');
      el.className = 'game-tile';
      el.innerHTML = `
        <div style="height:100%; background-image:url('${g.thumbnail || "images/thumbnails/thumbnail_default.jpg"}'); background-size:cover; background-position:center;"></div>
      `;
      el.title = g.name;
      el.addEventListener('click', () => openPopup(g));
      gamesGrid.appendChild(el);
    });
  }

  // open popup with game file path
  function openPopup(game) {
    if(!game || !game.file) return;
    iframe.src = game.file;
    popup.classList.add('active');
    popup.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // lock background scroll
  }

  function closePopup() {
    popup.classList.remove('active');
    popup.setAttribute('aria-hidden', 'true');
    // clear iframe to stop audio/etc
    iframe.src = '';
    document.body.style.overflow = '';
  }

  // event delegation: featured cards click
  [featuredDay, featuredFav, featuredMost].forEach(card => {
    if(!card) return;
    card.addEventListener('click', () => {
      const file = card.dataset.file;
      const name = card.dataset.name;
      const game = games.find(g => g.file === file);
      openPopup(game || { file, name });
    });
    // keyboard accessible
    card.addEventListener('keypress', (e) => {
      if(e.key === 'Enter' || e.key === ' ') { card.click(); }
    });
  });

  // close handlers
  closeBtn.addEventListener('click', closePopup);
  popupOverlay.addEventListener('click', closePopup);
  window.addEventListener('keydown', (e) => {
    if(e.key === 'Escape' && popup.classList.contains('active')) closePopup();
  });

  // search
  searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim().toLowerCase();
    const filtered = games.filter(g => g.name.toLowerCase().includes(q));
    renderGrid(filtered);
  });

  // initial load
  loadGames();
});
