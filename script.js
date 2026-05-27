const state = {
  posts: [],
  filtered: [],
  activeLabel: "All",
  search: "",
  activeSlug: ""
};

const elements = {
  totalPosts: document.querySelector("#total-posts"),
  latestDate: document.querySelector("#latest-date"),
  labelCount: document.querySelector("#label-count"),
  resultCount: document.querySelector("#result-count"),
  labelFilters: document.querySelector("#label-filters"),
  postList: document.querySelector("#post-list"),
  readerShell: document.querySelector("#reader-shell"),
  searchInput: document.querySelector("#search-input")
};

function formatDate(dateString) {
  if (!dateString) return "Unknown";
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(new Date(dateString));
}

function getQuerySlug() {
  const url = new URL(window.location.href);
  return url.searchParams.get("post") || "";
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

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
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
    const labelMatch =
      state.activeLabel === "All" || post.labels.includes(state.activeLabel);
    const searchTarget = [post.title, post.excerpt, post.labels.join(" ")]
      .join(" ")
      .toLowerCase();
    const searchMatch = !query || searchTarget.includes(query);
    return labelMatch && searchMatch;
  });
}

function renderHeaderStats() {
  elements.totalPosts.textContent = String(state.posts.length);
  elements.latestDate.textContent = state.posts.length
    ? formatDate(state.posts[0].createdAt)
    : "--";
  elements.labelCount.textContent = String(getAllLabels(state.posts).length - 1);
}

function renderFilters() {
  const labels = getAllLabels(state.posts);
  elements.labelFilters.innerHTML = labels
    .map((label) => {
      const activeClass = label === state.activeLabel ? " is-active" : "";
      return `<button class="label-chip${activeClass}" data-label="${escapeHtml(label)}">${escapeHtml(label)}</button>`;
    })
    .join("");

  elements.labelFilters.querySelectorAll("[data-label]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeLabel = button.dataset.label;
      applyFilters();
      renderFilters();
      renderPosts();
    });
  });
}

function renderPosts() {
  elements.resultCount.textContent = `${state.filtered.length} 篇文章`;

  if (!state.filtered.length) {
    elements.postList.innerHTML = `<div class="no-results">没有匹配的文章，试试换个标签或关键词。</div>`;
    return;
  }

  elements.postList.innerHTML = state.filtered
    .map((post) => {
      const activeClass = post.slug === state.activeSlug ? " is-active" : "";
      const labels = post.labels
        .slice(0, 3)
        .map((label) => `<span class="label-chip">${escapeHtml(label)}</span>`)
        .join("");

      return `
        <article class="post-item${activeClass}" data-slug="${escapeHtml(post.slug)}">
          <p class="section-kicker">#${post.number}</p>
          <h3>${escapeHtml(post.title)}</h3>
          <p class="post-excerpt">${escapeHtml(post.excerpt)}</p>
          <div class="post-meta">
            <span>${formatDate(post.createdAt)}</span>
            <span>${post.readingTime} min read</span>
          </div>
          <div class="post-labels">${labels}</div>
        </article>
      `;
    })
    .join("");

  elements.postList.querySelectorAll("[data-slug]").forEach((card) => {
    card.addEventListener("click", () => {
      const { slug } = card.dataset;
      openPost(slug);
    });
  });
}

async function renderArticle(post) {
  elements.readerShell.innerHTML = `<div class="article-loading">正在加载文章...</div>`;

  const response = await fetch(`./blog-content/${post.slug}.md`);
  if (!response.ok) {
    elements.readerShell.innerHTML = `<div class="article-loading">文章加载失败。</div>`;
    return;
  }

  const markdown = await response.text();
  const html = marked.parse(markdown);
  const labels = post.labels
    .map((label) => `<span class="label-chip">${escapeHtml(label)}</span>`)
    .join("");

  elements.readerShell.innerHTML = `
    <header class="article-header">
      <div>
        <p class="section-kicker">Issue #${post.number}</p>
        <h2>${escapeHtml(post.title)}</h2>
        <p class="article-meta">
          发布于 ${formatDate(post.createdAt)} · 更新于 ${formatDate(post.updatedAt)} · ${post.readingTime} min read
        </p>
      </div>
      <div class="article-actions">
        <a href="${post.issueUrl}" target="_blank" rel="noreferrer">查看原 Issue</a>
      </div>
    </header>
    <div class="article-labels">${labels}</div>
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

async function boot() {
  const response = await fetch("./blog-data/posts.json");
  state.posts = await response.json();
  state.activeSlug = getQuerySlug() || "";
  renderHeaderStats();
  renderFilters();

  elements.searchInput.addEventListener("input", (event) => {
    state.search = event.target.value;
    applyFilters();
    renderPosts();
  });

  applyFilters();
  renderPosts();

  const initialPost =
    state.posts.find((post) => post.slug === state.activeSlug) ||
    state.filtered[0] ||
    state.posts[0];

  if (initialPost) {
    await openPost(initialPost.slug);
  }
}

boot().catch(() => {
  elements.resultCount.textContent = "加载失败";
  elements.postList.innerHTML = `<div class="no-results">博客数据加载失败，请稍后再试。</div>`;
});
