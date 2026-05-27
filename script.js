const state = {
  posts: [],
  filtered: [],
  activeLabel: "All",
  activeSlug: "",
  search: "",
  page: 1,
  pageSize: 8
};

const elements = {
  totalPosts: document.querySelector("#total-posts"),
  labelCount: document.querySelector("#label-count"),
  latestDate: document.querySelector("#latest-date"),
  labelFilters: document.querySelector("#label-filters"),
  searchInput: document.querySelector("#search-input"),
  resultCount: document.querySelector("#result-count"),
  postList: document.querySelector("#post-list"),
  readerShell: document.querySelector("#reader-shell"),
  pageIndicator: document.querySelector("#page-indicator"),
  prevPage: document.querySelector("#prev-page"),
  nextPage: document.querySelector("#next-page"),
  pageSizeSelect: document.querySelector("#page-size-select")
};

function formatDate(dateString) {
  if (!dateString) return "--";
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(new Date(dateString));
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getQuerySlug() {
  return new URL(window.location.href).searchParams.get("post") || "";
}

function updateQuerySlug(slug) {
  const url = new URL(window.location.href);
  if (slug) {
    url.searchParams.set("post", slug);
  } else {
    url.searchParams.delete("post");
  }
  window.history.replaceState({}, "", url);
}

function getCategory(post) {
  const nonTopLabels = post.labels.filter((label) => label !== "Top");
  return nonTopLabels[0] || "Uncategorized";
}

function getTags(post) {
  const labels = post.labels.filter((label) => label !== "Top");
  return labels.slice(1);
}

function getAllLabels(posts) {
  const labels = new Set(["All"]);
  posts.forEach((post) => {
    post.labels.forEach((label) => labels.add(label));
  });
  return Array.from(labels);
}

function applyFilters() {
  const query = state.search.trim().toLowerCase();
  state.filtered = state.posts.filter((post) => {
    const labelMatch = state.activeLabel === "All" || post.labels.includes(state.activeLabel);
    const searchable = [
      post.title,
      post.excerpt,
      getCategory(post),
      post.labels.join(" ")
    ]
      .join(" ")
      .toLowerCase();
    const searchMatch = !query || searchable.includes(query);
    return labelMatch && searchMatch;
  });

  const maxPage = Math.max(1, Math.ceil(state.filtered.length / state.pageSize));
  if (state.page > maxPage) {
    state.page = maxPage;
  }
}

function renderStats() {
  elements.totalPosts.textContent = String(state.posts.length);
  elements.labelCount.textContent = String(getAllLabels(state.posts).length - 1);
  elements.latestDate.textContent = state.posts.length
    ? formatDate(state.posts[0].createdAt)
    : "--";
}

function renderFilters() {
  const labels = getAllLabels(state.posts);
  elements.labelFilters.innerHTML = labels
    .map((label) => {
      const active = label === state.activeLabel ? " is-active" : "";
      return `<button type="button" class="label-chip${active}" data-label="${escapeHtml(label)}">${escapeHtml(label)}</button>`;
    })
    .join("");

  elements.labelFilters.querySelectorAll("[data-label]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeLabel = button.dataset.label;
      state.page = 1;
      applyFilters();
      renderFilters();
      renderPosts();
    });
  });
}

function getPagedPosts() {
  const start = (state.page - 1) * state.pageSize;
  return state.filtered.slice(start, start + state.pageSize);
}

function renderPagination() {
  const totalPages = Math.max(1, Math.ceil(state.filtered.length / state.pageSize));
  elements.pageIndicator.textContent = `${state.page} / ${totalPages}`;
  elements.prevPage.disabled = state.page <= 1;
  elements.nextPage.disabled = state.page >= totalPages;
}

function renderPosts() {
  elements.resultCount.textContent = `${state.filtered.length} 篇文章`;
  renderPagination();

  const pagePosts = getPagedPosts();
  if (!pagePosts.length) {
    elements.postList.innerHTML = `<div class="no-results">没有匹配的文章，换个标签或关键词试试。</div>`;
    return;
  }

  elements.postList.innerHTML = pagePosts
    .map((post) => {
      const activeClass = post.slug === state.activeSlug ? " is-active" : "";
      const category = getCategory(post);
      const tags = getTags(post)
        .slice(0, 3)
        .map((tag) => `<span class="tag-chip">${escapeHtml(tag)}</span>`)
        .join("");

      return `
        <article class="post-card${activeClass}" data-slug="${escapeHtml(post.slug)}">
          <div class="post-top">
            <span class="post-category">${escapeHtml(category)}</span>
            <span class="post-number">#${post.number}</span>
          </div>
          <h3>${escapeHtml(post.title)}</h3>
          <p class="post-summary">${escapeHtml(post.excerpt)}</p>
          <div class="post-footer">
            <div class="post-meta">
              <span>${formatDate(post.createdAt)}</span>
              <span>${post.readingTime} min read</span>
            </div>
            <div class="post-tags">${tags}</div>
          </div>
        </article>
      `;
    })
    .join("");

  elements.postList.querySelectorAll("[data-slug]").forEach((card) => {
    card.addEventListener("click", () => {
      openPost(card.dataset.slug);
    });
  });
}

async function renderArticle(post) {
  elements.readerShell.innerHTML = `<div class="loading-state">正在加载文章...</div>`;
  const response = await fetch(`./blog-content/${post.slug}.md`);
  if (!response.ok) {
    elements.readerShell.innerHTML = `<div class="loading-state">文章加载失败。</div>`;
    return;
  }

  const markdown = await response.text();
  const html = marked.parse(markdown);
  const category = getCategory(post);
  const tags = getTags(post)
    .map((tag) => `<span class="tag-chip">${escapeHtml(tag)}</span>`)
    .join("");

  elements.readerShell.innerHTML = `
    <div class="article-head">
      <div>
        <p class="eyebrow">Issue #${post.number}</p>
        <h2 class="article-title">${escapeHtml(post.title)}</h2>
        <div class="article-meta">
          <span>Published ${formatDate(post.createdAt)}</span>
          <span>Updated ${formatDate(post.updatedAt)}</span>
          <span>${post.readingTime} min read</span>
        </div>
      </div>
      <a class="article-link" href="${post.issueUrl}" target="_blank" rel="noreferrer">Open Issue</a>
    </div>
    <div class="article-tags">
      <span class="post-category">${escapeHtml(category)}</span>
      ${tags}
    </div>
    <div class="article-body">${html}</div>
  `;
}

async function openPost(slug) {
  const post = state.posts.find((item) => item.slug === slug);
  if (!post) return;
  state.activeSlug = slug;
  updateQuerySlug(slug);
  renderPosts();
  await renderArticle(post);
}

function bindControls() {
  elements.searchInput.addEventListener("input", (event) => {
    state.search = event.target.value;
    state.page = 1;
    applyFilters();
    renderPosts();
  });

  elements.pageSizeSelect.addEventListener("change", (event) => {
    state.pageSize = Number(event.target.value);
    state.page = 1;
    applyFilters();
    renderPosts();
  });

  elements.prevPage.addEventListener("click", () => {
    if (state.page <= 1) return;
    state.page -= 1;
    renderPosts();
  });

  elements.nextPage.addEventListener("click", () => {
    const totalPages = Math.max(1, Math.ceil(state.filtered.length / state.pageSize));
    if (state.page >= totalPages) return;
    state.page += 1;
    renderPosts();
  });
}

async function boot() {
  const response = await fetch("./blog-data/posts.json");
  state.posts = await response.json();
  state.activeSlug = getQuerySlug();

  renderStats();
  renderFilters();
  bindControls();

  applyFilters();
  renderPosts();

  const initialPost =
    state.posts.find((post) => post.slug === state.activeSlug) ||
    getPagedPosts()[0] ||
    state.posts[0];

  if (initialPost) {
    await openPost(initialPost.slug);
  }
}

boot().catch(() => {
  elements.resultCount.textContent = "加载失败";
  elements.postList.innerHTML = `<div class="no-results">博客数据加载失败，请稍后重试。</div>`;
});
