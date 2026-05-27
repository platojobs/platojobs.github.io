const state = {
  posts: [],
  filtered: [],
  activeLabel: "All",
  activeSlug: "",
  search: "",
  page: 1,
  pageSize: 8,
  labelsExpanded: false,
  friendsExpanded: false,
  locale: "zh"
};

const elements = {
  brandText: document.querySelector("#brand-text"),
  totalPosts: document.querySelector("#total-posts"),
  labelCount: document.querySelector("#label-count"),
  latestDate: document.querySelector("#latest-date"),
  langZh: document.querySelector("#lang-zh"),
  langEn: document.querySelector("#lang-en"),
  labelFilters: document.querySelector("#label-filters"),
  labelsToggle: document.querySelector("#labels-toggle"),
  friendLinks: document.querySelector("#friend-links"),
  friendsToggle: document.querySelector("#friends-toggle"),
  copyFeedLink: document.querySelector("#copy-feed-link"),
  feedUrl: document.querySelector("#feed-url"),
  feedCopyStatus: document.querySelector("#feed-copy-status"),
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
  articleJsonLd: document.querySelector("#article-jsonld"),
  pageIndicator: document.querySelector("#page-indicator"),
  prevPage: document.querySelector("#prev-page"),
  nextPage: document.querySelector("#next-page"),
  pageSizeSelect: document.querySelector("#page-size-select")
};

const BRAND_WORDS = ["Hello World"];
const SITE_NAME = "PlatoJobs";
const SITE_TITLE = "Hello World | PlatoJobs";
const SITE_DESCRIPTION = "PlatoJobs 的个人网站，聚合技术写作、阅读笔记、思考记录与生活片段。";
const SITE_URL = "https://www.platojobs.com/";
const FEED_URL = `${SITE_URL}feed.xml`;
const COMMENTS_REPO = "platojobs/SFLOG";
const TRANSLATIONS = {
  zh: {
    locale: "zh-CN",
    site_description: "PlatoJobs 的个人网站，聚合技术写作、阅读笔记、思考记录与生活片段。",
    overview: "概览",
    posts: "文章",
    labels: "标签",
    all: "全部",
    latest: "最近",
    search: "搜索",
    search_placeholder: "搜索标题、摘要、标签",
    social: "社交",
    subscribe: "订阅",
    subscribe_note: "通过 RSS 订阅最新更新。",
    open_feed: "打开 RSS",
    copy_feed: "复制订阅链接",
    subscribe_hint: "支持 RSS 阅读器与订阅工具。",
    subscribe_copied: "订阅链接已复制。",
    subscribe_copy_failed: "复制失败，请手动复制订阅地址。",
    friends: "友情链接",
    write_in_public: "公开写作",
    live_reading_space: "在线阅读空间",
    issue_journal: "Issue Journal",
    article_abstract_flow: "文章摘要流",
    write_new_post: "写新文章",
    per_page: "每页",
    prev_page: "上一页",
    next_page: "下一页",
    reading_view: "Reading View",
    focus_mode: "专注模式",
    close: "关闭",
    reader: "Reader",
    reader_empty_title: "选择一篇文章开始阅读。",
    reader_empty_body: "列表只显示摘要，点击后在这里展开完整内容。",
    comments: "评论",
    issue_comments: "Issue 评论",
    show_all: "显示全部",
    show_less: "收起",
    uncategorized: "未分类",
    result_count: (count) => `${count} 篇文章`,
    empty_posts: "没有匹配的文章，换个标签或关键词试试。",
    min_read: (minutes) => `${minutes} 分钟阅读`,
    min_only: (minutes) => `${minutes} 分钟`,
    loading_article: "正在加载文章...",
    loading_article_failed: "文章加载失败。",
    open_issue: "打开 Issue",
    published: "发布时间",
    updated: "更新时间",
    reading_time: "阅读时长",
    category_tags: "分类与标签",
    comments_thread_hint: "打开文章后，这里会加载对应 issue 的评论线程。",
    comments_thread_source: (number) => `当前评论承接自 <a href="#issue-link">GitHub Issue #${number}</a>。`,
    comments_panel_hint: "这里会承接当前文章对应 GitHub issue 的评论线程。",
    loading_posts: "加载中...",
    loading_failed: "加载失败",
    loading_failed_body: "博客数据加载失败，请稍后重试。"
  },
  en: {
    locale: "en-US",
    site_description: "PlatoJobs personal website for technical writing, reading notes, reflections, and life fragments.",
    overview: "Overview",
    posts: "Posts",
    labels: "Labels",
    all: "All",
    latest: "Latest",
    search: "Search",
    search_placeholder: "Search title, excerpt, or labels",
    social: "Social",
    subscribe: "Subscribe",
    subscribe_note: "Follow the latest updates via RSS.",
    open_feed: "Open RSS",
    copy_feed: "Copy feed link",
    subscribe_hint: "Works with RSS readers and subscription tools.",
    subscribe_copied: "Feed link copied.",
    subscribe_copy_failed: "Copy failed. Please copy the feed URL manually.",
    friends: "Friends",
    write_in_public: "Write in public",
    live_reading_space: "Live reading space",
    issue_journal: "Issue Journal",
    article_abstract_flow: "Article Abstract Flow",
    write_new_post: "New Post",
    per_page: "Per page",
    prev_page: "Previous",
    next_page: "Next",
    reading_view: "Reading View",
    focus_mode: "Focus Mode",
    close: "Close",
    reader: "Reader",
    reader_empty_title: "Pick an article to start reading.",
    reader_empty_body: "The list only shows abstracts. Click one to expand the full piece here.",
    comments: "Comments",
    issue_comments: "Issue Comments",
    show_all: "Show all",
    show_less: "Show less",
    uncategorized: "Uncategorized",
    result_count: (count) => `${count} posts`,
    empty_posts: "No matching posts. Try another label or keyword.",
    min_read: (minutes) => `${minutes} min read`,
    min_only: (minutes) => `${minutes} min`,
    loading_article: "Loading article...",
    loading_article_failed: "Failed to load article.",
    open_issue: "Open Issue",
    published: "Published",
    updated: "Updated",
    reading_time: "Reading Time",
    category_tags: "Category & Tags",
    comments_thread_hint: "Open an article to load the matching issue comment thread.",
    comments_thread_source: (number) => `Comments are synced from <a href="#issue-link">GitHub Issue #${number}</a>.`,
    comments_panel_hint: "Comments for the current article will continue in its matching GitHub issue thread.",
    loading_posts: "Loading...",
    loading_failed: "Load failed",
    loading_failed_body: "Failed to load blog data. Please try again later."
  }
};

function t(key, ...args) {
  const locale = TRANSLATIONS[state.locale] || TRANSLATIONS.zh;
  const value = locale[key];
  return typeof value === "function" ? value(...args) : value;
}

function getDateLocale() {
  return TRANSLATIONS[state.locale]?.locale || "zh-CN";
}

function getStoredLocale() {
  try {
    return window.localStorage?.getItem("platojobs-locale") || "";
  } catch {
    return "";
  }
}

function saveStoredLocale(locale) {
  try {
    window.localStorage?.setItem("platojobs-locale", locale);
  } catch {
    // Ignore storage failures in restricted browser contexts.
  }
}

function formatDate(dateString) {
  if (!dateString) return "--";
  return new Intl.DateTimeFormat(getDateLocale(), {
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

function getQueryLocale() {
  return new URL(window.location.href).searchParams.get("lang") || "";
}

function updateQueryState({ slug = state.activeSlug, locale = state.locale } = {}) {
  const url = new URL(window.location.href);
  if (slug) {
    url.searchParams.set("post", slug);
  } else {
    url.searchParams.delete("post");
  }
  if (locale) {
    url.searchParams.set("lang", locale);
  } else {
    url.searchParams.delete("lang");
  }
  window.history.replaceState({}, "", url);
}

function updateLocaleLinks() {
  const url = new URL(window.location.href);
  const makeHref = (locale) => {
    const next = new URL(url);
    next.searchParams.set("lang", locale);
    return `${next.pathname}${next.search}${next.hash}`;
  };
  elements.langZh?.setAttribute("href", makeHref("zh"));
  elements.langEn?.setAttribute("href", makeHref("en"));
}

function setMetaContent(element, value) {
  if (element && value) {
    element.setAttribute("content", value);
  }
}

function getArticleKeywords(post) {
  const keywords = new Set(post.labels.filter((label) => label !== "Top"));
  keywords.add(getCategory(post));
  return Array.from(keywords).filter(Boolean);
}

function updateArticleJsonLd(post) {
  if (!elements.articleJsonLd) return;

  if (!post) {
    elements.articleJsonLd.textContent = "";
    return;
  }

  const jsonld = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    url: `${SITE_URL}?post=${encodeURIComponent(post.slug)}`,
    mainEntityOfPage: `${SITE_URL}?post=${encodeURIComponent(post.slug)}`,
    datePublished: post.createdAt,
    dateModified: post.updatedAt,
    inLanguage: state.locale === "en" ? "en-US" : "zh-CN",
    author: {
      "@type": "Person",
      name: "PlatoJobs",
      url: "https://github.com/platojobs"
    },
    publisher: {
      "@type": "Person",
      name: "PlatoJobs",
      url: "https://github.com/platojobs"
    },
    image: `${SITE_URL}og-card.png?v=20260527-ogpng2`,
    articleSection: getCategory(post),
    keywords: getArticleKeywords(post),
    wordCount: Math.max(1, post.readingTime * 220)
  };

  elements.articleJsonLd.textContent = JSON.stringify(jsonld);
}

function updateSeo(post) {
  const canonical = post ? `${SITE_URL}?post=${encodeURIComponent(post.slug)}` : SITE_URL;
  const title = post ? `${post.title} | ${SITE_NAME}` : SITE_TITLE;
  const description = post ? `${post.excerpt} · ${SITE_NAME}` : t("site_description");

  document.title = title;
  document.documentElement.lang = state.locale === "en" ? "en" : "zh-CN";
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
  updateArticleJsonLd(post);
  updateLocaleLinks();
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
    elements.commentsStatus.innerHTML = t("comments_thread_source", post.number).replace(
      'href="#issue-link"',
      `href="${post.issueUrl}" target="_blank" rel="noreferrer"`
    );
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
  return nonTopLabels[0] || t("uncategorized");
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

function renderStaticI18n() {
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const key = node.getAttribute("data-i18n");
    node.textContent = t(key);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    const key = node.getAttribute("data-i18n-placeholder");
    node.setAttribute("placeholder", t(key));
  });
  elements.drawerClose?.setAttribute(
    "aria-label",
    state.locale === "en" ? "Close reading panel" : "关闭阅读面板"
  );
  if (elements.feedCopyStatus) {
    elements.feedCopyStatus.textContent = t("subscribe_hint");
  }
}

function renderLanguageToggle() {
  elements.langZh?.classList.toggle("is-active", state.locale === "zh");
  elements.langEn?.classList.toggle("is-active", state.locale === "en");
}

function renderExpandToggles() {
  if (elements.friendsToggle) {
    elements.friendsToggle.textContent = state.friendsExpanded ? t("show_less") : t("show_all");
    elements.friendsToggle.setAttribute("aria-expanded", String(state.friendsExpanded));
  }
  if (elements.labelsToggle) {
    elements.labelsToggle.textContent = state.labelsExpanded ? t("show_less") : t("show_all");
    elements.labelsToggle.setAttribute("aria-expanded", String(state.labelsExpanded));
  }
}

function renderFilters() {
  const labels = getAllLabels(state.posts);
  elements.labelFilters.innerHTML = labels
    .map((label) => {
      const active = label === state.activeLabel ? " is-active" : "";
      const labelText = label === "All" ? t("all") : label;
      return `<button type="button" class="label-chip${active}" data-label="${escapeHtml(label)}">${escapeHtml(labelText)}</button>`;
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
  renderExpandToggles();
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
  elements.resultCount.textContent = t("result_count", state.filtered.length);
  renderPagination();

  const pagePosts = getPagedPosts();
  if (!pagePosts.length) {
    elements.postList.innerHTML = `<div class="no-results">${escapeHtml(t("empty_posts"))}</div>`;
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
              <span>${t("min_read", post.readingTime)}</span>
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
  elements.readerShell.innerHTML = `<div class="loading-state">${escapeHtml(t("loading_article"))}</div>`;
  const response = await fetch(`./blog-content/${post.slug}.md`);
  if (!response.ok) {
    elements.readerShell.innerHTML = `<div class="loading-state">${escapeHtml(t("loading_article_failed"))}</div>`;
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
          <a class="article-link" href="${post.issueUrl}" target="_blank" rel="noreferrer">${escapeHtml(t("open_issue"))}</a>
        </div>
      </header>

      <section class="article-meta-panel">
        <div class="meta-group">
          <span class="meta-label">${escapeHtml(t("published"))}</span>
          <strong>${formatDate(post.createdAt)}</strong>
        </div>
        <div class="meta-group">
          <span class="meta-label">${escapeHtml(t("updated"))}</span>
          <strong>${formatDate(post.updatedAt)}</strong>
        </div>
        <div class="meta-group">
          <span class="meta-label">${escapeHtml(t("reading_time"))}</span>
          <strong>${escapeHtml(t("min_only", post.readingTime))}</strong>
        </div>
        <div class="meta-group meta-group-wide">
          <span class="meta-label">${escapeHtml(t("category_tags"))}</span>
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
  updateQueryState({ slug, locale: state.locale });
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
    elements.friendLinks?.classList.toggle("is-collapsed-mobile", !state.friendsExpanded);
    renderExpandToggles();
  });

  elements.labelsToggle?.addEventListener("click", () => {
    state.labelsExpanded = !state.labelsExpanded;
    elements.labelFilters?.classList.toggle("is-collapsed-mobile", !state.labelsExpanded);
    renderExpandToggles();
  });

  elements.langZh?.addEventListener("click", (event) => {
    event.preventDefault();
    void setLocale("zh");
  });
  elements.langEn?.addEventListener("click", (event) => {
    event.preventDefault();
    void setLocale("en");
  });

  elements.copyFeedLink?.addEventListener("click", async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(FEED_URL);
      } else {
        const field = elements.feedUrl;
        if (!field) {
          throw new Error("feed field missing");
        }
        field.focus();
        field.select();
        field.setSelectionRange(0, field.value.length);
        const copied = document.execCommand("copy");
        if (!copied) {
          throw new Error("execCommand copy failed");
        }
      }
      if (elements.feedCopyStatus) {
        elements.feedCopyStatus.textContent = t("subscribe_copied");
      }
    } catch {
      const field = elements.feedUrl;
      if (field) {
        field.focus();
        field.select();
        field.setSelectionRange(0, field.value.length);
      }
      if (elements.feedCopyStatus) {
        elements.feedCopyStatus.textContent = t("subscribe_copy_failed");
      }
    }
  });

  elements.drawerOverlay.addEventListener("click", closeDrawer);
  elements.drawerClose.addEventListener("click", closeDrawer);
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeDrawer();
    }
  });
}

async function setLocale(locale) {
  if (state.locale === locale) return;
  state.locale = locale;
  saveStoredLocale(locale);
  updateQueryState({ slug: state.activeSlug, locale });
  renderStaticI18n();
  renderLanguageToggle();
  renderExpandToggles();
  updateLocaleLinks();
  renderStats();
  renderFilters();
  renderPosts();
  updateSeo(state.posts.find((post) => post.slug === state.activeSlug));
  if (state.activeSlug) {
    const activePost = state.posts.find((post) => post.slug === state.activeSlug);
    if (activePost) {
      await renderArticle(activePost);
    }
  } else {
    resetComments(t("comments_thread_hint"));
  }
}

window.switchPlatoLocale = (locale) => {
  void setLocale(locale);
};

async function boot() {
  const queryLocale = getQueryLocale();
  const savedLocale = getStoredLocale();
  if (queryLocale === "en" || queryLocale === "zh") {
    state.locale = queryLocale;
  } else if (savedLocale === "en" || savedLocale === "zh") {
    state.locale = savedLocale;
  } else if ((navigator.language || "").toLowerCase().startsWith("en")) {
    state.locale = "en";
  }
  startBrandTyping();
  renderStaticI18n();
  renderLanguageToggle();
  renderExpandToggles();
  elements.resultCount.textContent = t("loading_posts");
  resetComments(t("comments_thread_hint"));
  const response = await fetch("./blog-data/posts.json");
  state.posts = await response.json();
  state.activeSlug = getQuerySlug();
  updateQueryState({ slug: state.activeSlug, locale: state.locale });

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
  elements.resultCount.textContent = t("loading_failed");
  elements.postList.innerHTML = `<div class="no-results">${escapeHtml(t("loading_failed_body"))}</div>`;
});
