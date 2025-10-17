// js/main.js
document.addEventListener('DOMContentLoaded', () => {
  const GAMES_JSON = 'data/gxmes.json'; // adjust path if your file is in another folder

  // DOM refs
  const searchInput = document.getElementById('search');
  const gamesGrid = document.getElementById('games-grid');

  const featuredDay = document.getElementById('featured-day');
  const featuredFav = document.getElementById('featured-fav');
  const featuredMost = document.getElementById('featured-most');

  const popup = document.getElementById('game-popup');
  const popupOverlay = document.getElementById('popup-overlay');
  const iframe = document.getElementById('game-iframe');
  const closeBtn = document.getElementById('close-popup');

  let games = []; // loaded list

  async function loadGames() {
    try {
      const res = await fetch(GAMES_JSON, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      games = await res.json();
      if (!Array.isArray(games)) throw new Error('games JSON is not an array');

      // initial rendering
      renderFeatured(games);
      renderGrid(games);
    } catch (err) {
      console.error('Error loading games.json:', err);
    }
  }

  function renderFeatured(list) {
    if (!Array.isArray(list) || list.length === 0) return;

    // Game of the Day (deterministic)
    const today = new Date();
    const seed = `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`;
    const index = Math.abs(seed.split('').reduce((a,c)=>a + c.charCodeAt(0), 0)) % list.length;
    const gameOfDay = list[index];

    // Owner's favorite (first with favorite:true or fallback to index 0)
    const favorite = list.find(g => g.favorite) || list[0];

    // Most liked (choose highest likes; if none, fallback to gameOfDay or second)
    const mostLiked = (list.slice().sort((a,b) => (b.likes||0) - (a.likes||0))[0]) || list[0];

    fillFeaturedCard(featuredDay, gameOfDay);
    fillFeaturedCard(featuredFav, favorite);
    fillFeaturedCard(featuredMost, mostLiked);
  }

  // Accepts HTML element for card and game object
  function fillFeaturedCard(cardEl, game) {
    if (!cardEl || !game) return;

    // find the inner elements (structure based on index.html update)
    const thumbImg = cardEl.querySelector('.game-thumb img');
    const titleEl = cardEl.querySelector('.game-overlay .game-title');

    // set thumbnail (use fallback if missing)
    const thumb = game.thumbnail || 'thumbnails/thumbnail_default.jpg';
    if (thumbImg) thumbImg.src = thumb;

    // set title text
    if (titleEl) titleEl.textContent = game.name || 'Unknown Game';

    // store file and name on dataset for click handler
    cardEl.dataset.file = game.file || '';
    cardEl.dataset.name = game.name || '';

    // click -> open popup player
    cardEl.onclick = () => openPopup(game);
    // keyboard accessible
    cardEl.onkeydown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openPopup(game);
      }
    };
  }

  function renderGrid(list) {
    if (!gamesGrid) return;
    gamesGrid.innerHTML = '';
    const container = gamesGrid;

    list.forEach(g => {
      const tile = document.createElement('div');
      tile.className = 'game-tile';
      tile.title = g.name || '';
      tile.style.cursor = 'pointer';

      // thumbnail area
      const thumbDiv = document.createElement('div');
      thumbDiv.style.height = '100%';
      thumbDiv.style.backgroundImage = `url("${(g.thumbnail || 'thumbnails/thumbnail_default.jpg')}")`;
      thumbDiv.style.backgroundSize = 'cover';
      thumbDiv.style.backgroundPosition = 'center';
      tile.appendChild(thumbDiv);

      tile.addEventListener('click', () => openPopup(g));
      container.appendChild(tile);
    });
  }

  // Open popup with game object
  function openPopup(game) {
    if (!game || !game.file) {
      console.warn('Game has no file to open:', game);
      return;
    }

    // set iframe src (use full path as in your JSON)
    iframe.src = game.file;

    // show popup
    popup.classList.add('active');
    popup.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // lock background scroll
  }

  function closePopup() {
    popup.classList.remove('active');
    popup.setAttribute('aria-hidden', 'true');

    // clear iframe to stop audio and free resources
    iframe.src = '';
    document.body.style.overflow = '';
  }

  // close handlers
  if (closeBtn) closeBtn.addEventListener('click', closePopup);
  if (popupOverlay) popupOverlay.addEventListener('click', closePopup);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && popup.classList.contains('active')) closePopup();
  });

  // Search
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const q = (searchInput.value || '').trim().toLowerCase();
      const filtered = games.filter(g => (g.name || '').toLowerCase().includes(q));
      renderGrid(filtered);
    });
  }

  // initial load
  loadGames();
});
