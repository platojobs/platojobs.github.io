const state = {
  posts: [],
  filtered: [],
  activeLabel: "All",
  activeSlug: "",
  search: "",
  page: 1,
  pageSize: 8,
  labelsExpanded: false,
  friendsExpanded: false
};

const elements = {
  brandText: document.querySelector("#brand-text"),
  totalPosts: document.querySelector("#total-posts"),
  labelCount: document.querySelector("#label-count"),
  latestDate: document.querySelector("#latest-date"),
  labelFilters: document.querySelector("#label-filters"),
  labelsToggle: document.querySelector("#labels-toggle"),
  friendLinks: document.querySelector("#friend-links"),
  friendsToggle: document.querySelector("#friends-toggle"),
  searchInput: document.querySelector("#search-input"),
  resultCount: document.querySelector("#result-count"),
  postList: document.querySelector("#post-list"),
  seoPostLinks: document.querySelector("#seo-post-links"),
  readerShell: document.querySelector("#reader-shell"),
  commentsStatus: document.querySelector("#comments-status"),
  commentsThread: document.querySelector("#comments-thread"),
  drawer: document.querySelector("#reader-drawer"),
  modalShell: document.querySelector(".modal-shell"),
  drawerOverlay: document.querySelector("#drawer-overlay"),
  drawerClose: document.querySelector("#drawer-close"),
  canonicalUrl: document.querySelector("#canonical-url"),
  metaDescription: document.querySelector("#meta-description"),
  ogTitle: document.querySelector("#og-title"),
  ogDescription: document.querySelector("#og-description"),
  ogUrl: document.querySelector("#og-url"),
  ogType: document.querySelector("#og-type"),
  twitterTitle: document.querySelector("#twitter-title"),
  twitterDescription: document.querySelector("#twitter-description"),
  pageIndicator: document.querySelector("#page-indicator"),
  prevPage: document.querySelector("#prev-page"),
  nextPage: document.querySelector("#next-page"),
  pageSizeSelect: document.querySelector("#page-size-select")
};

const BRAND_WORDS = ["Hello World"];
const SITE_NAME = "PlatoJobs";
const SITE_TITLE = "Hello World | PlatoJobs";
const SITE_DESCRIPTION = "PlatoJobs 的个人博客，基于 GitHub Issues 写作与沉淀，聚合阅读、思考、技术笔记与生活片段。";
const SITE_URL = "https://www.platojobs.com/";
const COMMENTS_REPO = "platojobs/SFLOG";

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

const labelPalettes = [
  {
    bg: "rgba(29, 155, 240, 0.14)",
    fg: "#8fd0ff",
    border: "rgba(29, 155, 240, 0.28)"
  },
  {
    bg: "rgba(54, 179, 126, 0.14)",
    fg: "#8ce7ba",
    border: "rgba(54, 179, 126, 0.28)"
  },
  {
    bg: "rgba(245, 177, 76, 0.14)",
    fg: "#ffd48b",
    border: "rgba(245, 177, 76, 0.28)"
  },
  {
    bg: "rgba(168, 85, 247, 0.14)",
    fg: "#d7b2ff",
    border: "rgba(168, 85, 247, 0.28)"
  },
  {
    bg: "rgba(244, 114, 182, 0.14)",
    fg: "#ffb7db",
    border: "rgba(244, 114, 182, 0.28)"
  },
  {
    bg: "rgba(20, 184, 166, 0.14)",
    fg: "#8ff3e8",
    border: "rgba(20, 184, 166, 0.28)"
  }
];

function getLabelStyle(label) {
  let hash = 0;
  for (const char of label) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }
  return labelPalettes[hash % labelPalettes.length];
}

function getLabelStyleAttr(label) {
  const palette = getLabelStyle(label);
  return `--pill-bg:${palette.bg};--pill-fg:${palette.fg};--pill-border:${palette.border};`;
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

function setMetaContent(element, value) {
  if (element && value) {
    element.setAttribute("content", value);
  }
}

function updateSeo(post) {
  const canonical = post ? `${SITE_URL}?post=${encodeURIComponent(post.slug)}` : SITE_URL;
  const title = post ? `${post.title} | ${SITE_NAME}` : SITE_TITLE;
  const description = post ? `${post.excerpt} · ${SITE_NAME}` : SITE_DESCRIPTION;

  document.title = title;
  if (elements.canonicalUrl) {
    elements.canonicalUrl.setAttribute("href", canonical);
  }
  setMetaContent(elements.metaDescription, description);
  setMetaContent(elements.ogTitle, title);
  setMetaContent(elements.ogDescription, description);
  setMetaContent(elements.ogUrl, canonical);
  setMetaContent(elements.ogType, post ? "article" : "website");
  setMetaContent(elements.twitterTitle, title);
  setMetaContent(elements.twitterDescription, description);
}

function openDrawer() {
  elements.drawerOverlay.hidden = false;
  elements.drawer.classList.add("is-open");
  elements.drawer.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  document.body.style.overflow = "hidden";
  elements.modalShell?.scrollTo({ top: 0, behavior: "auto" });
}

function closeDrawer() {
  elements.drawer.classList.remove("is-open");
  elements.drawer.setAttribute("aria-hidden", "true");
  elements.drawerOverlay.hidden = true;
  document.body.classList.remove("modal-open");
  document.body.style.overflow = "";
}

function resetComments(message) {
  if (elements.commentsThread) {
    elements.commentsThread.innerHTML = "";
  }
  if (elements.commentsStatus) {
    elements.commentsStatus.textContent = message;
  }
}

function renderComments(post) {
  if (!elements.commentsThread) return;

  elements.commentsThread.innerHTML = "";
  if (elements.commentsStatus) {
    elements.commentsStatus.innerHTML = `
      当前评论承接自 <a href="${post.issueUrl}" target="_blank" rel="noreferrer">GitHub Issue #${post.number}</a>。
    `;
  }

  const script = document.createElement("script");
  script.src = "https://utteranc.es/client.js";
  script.async = true;
  script.crossOrigin = "anonymous";
  script.setAttribute("repo", COMMENTS_REPO);
  script.setAttribute("issue-number", String(post.number));
  script.setAttribute("theme", "github-dark");
  script.setAttribute("loading", "lazy");
  elements.commentsThread.appendChild(script);
}

function startBrandTyping() {
  if (!elements.brandText) return;

  let wordIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const tick = () => {
    const currentWord = BRAND_WORDS[wordIndex];

    if (deleting) {
      charIndex = Math.max(0, charIndex - 1);
    } else {
      charIndex = Math.min(currentWord.length, charIndex + 1);
    }

    elements.brandText.textContent = currentWord.slice(0, charIndex);

    let delay = deleting ? 55 : 95;

    if (!deleting && charIndex === currentWord.length) {
      delay = 1350;
      deleting = true;
    } else if (deleting && charIndex === 0) {
      deleting = false;
      wordIndex = (wordIndex + 1) % BRAND_WORDS.length;
      delay = 260;
    }

    window.setTimeout(tick, delay);
  };

  elements.brandText.textContent = "";
  window.setTimeout(tick, 280);
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

  elements.labelFilters.classList.toggle("is-collapsed-mobile", !state.labelsExpanded);
  if (elements.labelsToggle) {
    elements.labelsToggle.setAttribute("aria-expanded", String(state.labelsExpanded));
    elements.labelsToggle.textContent = state.labelsExpanded ? "Show less" : "Show all";
  }
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

function renderSeoLinks() {
  if (!elements.seoPostLinks) return;
  elements.seoPostLinks.innerHTML = state.posts
    .map(
      (post) =>
        `<a href="./?post=${encodeURIComponent(post.slug)}">${escapeHtml(post.title)}</a>`
    )
    .join("");
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
        .map(
          (tag) =>
            `<span class="tag-chip" style="${getLabelStyleAttr(tag)}">${escapeHtml(tag)}</span>`
        )
        .join("");

      return `
        <article class="post-card${activeClass}" data-slug="${escapeHtml(post.slug)}">
          <div class="post-top">
            <span class="post-category" style="${getLabelStyleAttr(category)}">${escapeHtml(category)}</span>
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
  elements.modalShell?.scrollTo({ top: 0, behavior: "auto" });
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
    .map(
      (tag) => `<span class="tag-chip" style="${getLabelStyleAttr(tag)}">${escapeHtml(tag)}</span>`
    )
    .join("");

  elements.readerShell.innerHTML = `
    <article class="article-layout">
      <header class="article-hero">
        <div class="article-hero-copy">
          <p class="eyebrow">Issue #${post.number}</p>
          <h2 class="article-title">${escapeHtml(post.title)}</h2>
          <p class="article-subtitle">${escapeHtml(post.excerpt)}</p>
        </div>
        <div class="article-actions">
          <a class="article-link" href="${post.issueUrl}" target="_blank" rel="noreferrer">Open Issue</a>
        </div>
      </header>

      <section class="article-meta-panel">
        <div class="meta-group">
          <span class="meta-label">Published</span>
          <strong>${formatDate(post.createdAt)}</strong>
        </div>
        <div class="meta-group">
          <span class="meta-label">Updated</span>
          <strong>${formatDate(post.updatedAt)}</strong>
        </div>
        <div class="meta-group">
          <span class="meta-label">Reading Time</span>
          <strong>${post.readingTime} min</strong>
        </div>
        <div class="meta-group meta-group-wide">
          <span class="meta-label">Category & Tags</span>
          <div class="article-tags">
            <span class="post-category" style="${getLabelStyleAttr(category)}">${escapeHtml(category)}</span>
            ${tags}
          </div>
        </div>
      </section>

      <section class="article-content-card">
        <div class="article-body">${html}</div>
      </section>
    </article>
  `;

  elements.modalShell?.scrollTo({ top: 0, behavior: "auto" });
  renderComments(post);
}

async function openPost(slug) {
  const post = state.posts.find((item) => item.slug === slug);
  if (!post) return;
  state.activeSlug = slug;
  updateQuerySlug(slug);
  updateSeo(post);
  renderPosts();
  openDrawer();
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

  elements.friendsToggle?.addEventListener("click", () => {
    state.friendsExpanded = !state.friendsExpanded;
    elements.friendsToggle.setAttribute("aria-expanded", String(state.friendsExpanded));
    elements.friendsToggle.textContent = state.friendsExpanded ? "Show less" : "Show all";
    elements.friendLinks?.classList.toggle("is-collapsed-mobile", !state.friendsExpanded);
  });

  elements.labelsToggle?.addEventListener("click", () => {
    state.labelsExpanded = !state.labelsExpanded;
    elements.labelsToggle.setAttribute("aria-expanded", String(state.labelsExpanded));
    elements.labelsToggle.textContent = state.labelsExpanded ? "Show less" : "Show all";
    elements.labelFilters?.classList.toggle("is-collapsed-mobile", !state.labelsExpanded);
  });

  elements.drawerOverlay.addEventListener("click", closeDrawer);
  elements.drawerClose.addEventListener("click", closeDrawer);
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeDrawer();
    }
  });
}

async function boot() {
  startBrandTyping();
  resetComments("打开文章后，这里会加载对应 issue 的评论线程。");
  const response = await fetch("./blog-data/posts.json");
  state.posts = await response.json();
  state.activeSlug = getQuerySlug();

  renderSeoLinks();
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
    if (state.activeSlug) {
      elements.modalShell?.scrollTo({ top: 0, behavior: "auto" });
      await openPost(initialPost.slug);
    } else {
      updateSeo();
      await renderArticle(initialPost);
    }
  } else {
    updateSeo();
  }
}

boot().catch(() => {
  elements.resultCount.textContent = "加载失败";
  elements.postList.innerHTML = `<div class="no-results">博客数据加载失败，请稍后重试。</div>`;
});
