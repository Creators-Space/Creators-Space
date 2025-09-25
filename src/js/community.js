// Community interactions for blog cards: likes/favorites and comments stored locally

(function () {
  const LIKES_KEY = 'cs_blog_likes';
  const FAVS_KEY = 'cs_blog_favorites';
  const COMMENTS_KEY = 'cs_blog_comments';

  function getStore(key) {
    try { return JSON.parse(localStorage.getItem(key) || '{}'); } catch { return {}; }
  }
  function setStore(key, obj) {
    localStorage.setItem(key, JSON.stringify(obj));
  }
  function escapeHtml(text) {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return String(text).replace(/[&<>"']/g, m => map[m]);
  }

  function enhanceBlogCards() {
    const likeStore = getStore(LIKES_KEY);
    const favStore = getStore(FAVS_KEY);
    const commentsStore = getStore(COMMENTS_KEY);

    document.querySelectorAll('.blog-card').forEach((card, idx) => {
      const titleEl = card.querySelector('.blog-title');
      const title = titleEl ? titleEl.textContent.trim() : `post-${idx}`;
      const id = `blog-${title.toLowerCase().replace(/\s+/g, '-')}`;

      // Action bar
      let actions = card.querySelector('.blog-actions');
      if (!actions) {
        actions = document.createElement('div');
        actions.className = 'blog-actions';
        actions.innerHTML = `
          <button class="blog-like" aria-label="Like">
            <span class="icon">❤️</span>
            <span class="count">${Number(likeStore[id] || 0)}</span>
          </button>
          <button class="blog-fav ${favStore[id] ? 'active' : ''}" aria-label="Favorite" title="Toggle favorite">
            <span class="icon">⭐</span>
          </button>
        `;
        const content = card.querySelector('.blog-content') || card;
        content.appendChild(actions);
      }

      // Comments section
      let commentsSection = card.querySelector('.blog-comments');
      if (!commentsSection) {
        commentsSection = document.createElement('div');
        commentsSection.className = 'blog-comments';
        const existing = commentsStore[id] || [];
        commentsSection.innerHTML = `
          <h4>Comments</h4>
          <div class="comments-list">
            ${existing.map(c => `
              <div class=\"comment-item\">
                <div class=\"comment-meta\">${escapeHtml(c.name)} • ${new Date(c.time).toLocaleString()}</div>
                <div class=\"comment-text\">${escapeHtml(c.text)}</div>
              </div>
            `).join('')}
          </div>
          <form class="comment-form">
            <input type="text" name="name" placeholder="Your name" required />
            <input type="text" name="text" placeholder="Add a comment..." required />
            <button type="submit">Post</button>
          </form>
        `;
        const content = card.querySelector('.blog-content') || card;
        content.appendChild(commentsSection);
      }

      // Wire actions
      const likeBtn = actions.querySelector('.blog-like');
      const likeCount = likeBtn.querySelector('.count');
      likeBtn.addEventListener('click', () => {
        const store = getStore(LIKES_KEY);
        const current = Number(store[id] || 0) + 1;
        store[id] = current;
        setStore(LIKES_KEY, store);
        likeCount.textContent = String(current);
      });

      const favBtn = actions.querySelector('.blog-fav');
      favBtn.addEventListener('click', () => {
        const store = getStore(FAVS_KEY);
        if (store[id]) {
          delete store[id];
          favBtn.classList.remove('active');
        } else {
          store[id] = true;
          favBtn.classList.add('active');
        }
        setStore(FAVS_KEY, store);
      });

      const form = commentsSection.querySelector('.comment-form');
      const list = commentsSection.querySelector('.comments-list');
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const fd = new FormData(form);
        const name = (fd.get('name') || '').toString().trim();
        const text = (fd.get('text') || '').toString().trim();
        if (!name || !text) return;
        const store = getStore(COMMENTS_KEY);
        const arr = store[id] || [];
        const entry = { name, text, time: new Date().toISOString() };
        arr.push(entry);
        store[id] = arr;
        setStore(COMMENTS_KEY, store);

        const node = document.createElement('div');
        node.className = 'comment-item';
        node.innerHTML = `
          <div class="comment-meta">${escapeHtml(entry.name)} • ${new Date(entry.time).toLocaleString()}</div>
          <div class="comment-text">${escapeHtml(entry.text)}</div>
        `;
        list.appendChild(node);
        form.reset();
      });
    });
  }

  document.addEventListener('DOMContentLoaded', enhanceBlogCards);
})();


