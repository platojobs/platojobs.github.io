const state = {
  posts: [],
  filtered: [],
  activeLabel: "All",
  activeSlug: "",
  activeView: "home",
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
  navHome: document.querySelector("#nav-home"),
  navArchive: document.querySelector("#nav-archive"),
  navAbout: document.querySelector("#nav-about"),
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
  homeView: document.querySelector("#home-view"),
  archiveView: document.querySelector("#archive-view"),
  aboutView: document.querySelector("#about-view"),
  archiveShell: document.querySelector("#archive-shell"),
  seoPostLinks: document.querySelector("#seo-post-links"),
  readerShell: document.querySelector("#reader-shell"),
  commentsStatus: document.querySelector("#comments-status"),
  commentsEmpty: document.querySelector("#comments-empty"),
  commentsThread: document.querySelector("#comments-thread"),
  drawer: document.querySelector("#reader-drawer"),
  modalShell: document.querySelector(".modal-shell"),
  drawerOverlay: document.querySelector("#drawer-overlay"),
  drawerClose: document.querySelector("#drawer-close"),
  readingProgressBar: document.querySelector("#reading-progress-bar"),
  readingProgressValue: document.querySelector("#reading-progress-value"),
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
const ISSUE_API_BASE = `https://api.github.com/repos/${COMMENTS_REPO}/issues/`;
const commentCountCache = new Map();
let utterancesWarmPromise = null;
const TRANSLATIONS = {
  zh: {
    locale: "zh-CN",
    site_description: "PlatoJobs 的个人网站，聚合技术写作、阅读笔记、思考记录与生活片段。",
    explore: "探索",
    home: "首页",
    archive: "归档",
    archive_title: "文章归档",
    about: "关于我",
    about_title: "关于我",
    about_lead: "PlatoJobs，记录技术写作、阅读笔记、思考和生活片段。",
    about_focus: "Focus",
    about_focus_title: "我在写什么",
    about_focus_body: "主要围绕 Flutter、Swift、移动开发、工具链、阅读笔记，以及一些日常思考。",
    about_way: "Way",
    about_way_title: "这个网站想做什么",
    about_way_body: "它不是作品集式陈列，而是一个持续更新的个人写作网站，适合慢慢阅读、回看和订阅。",
    about_contact: "Contact",
    about_contact_title: "如何联系我",
    about_contact_body: "你可以通过 GitHub、X，或者页面左侧的两个 Gmail 地址联系我。",
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
    writing_archive: "写作档案",
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
    article_comments: "文章评论",
    copy_link: "复制文章链接",
    link_copied: "文章链接已复制。",
    link_copy_failed: "复制失败，请手动复制地址。",
    show_all: "显示全部",
    show_less: "收起",
    uncategorized: "未分类",
    result_count: (count) => `${count} 篇文章`,
    empty_posts: "没有匹配的文章，换个标签或关键词试试。",
    min_read: (minutes) => `${minutes} 分钟阅读`,
    min_only: (minutes) => `${minutes} 分钟`,
    loading_article: "正在加载文章...",
    loading_article_failed: "文章加载失败。",
    open_issue: "查看原文",
    published: "发布时间",
    updated: "更新时间",
    reading_time: "阅读时长",
    category_tags: "分类与标签",
    comments_thread_hint: "打开文章后，这里会加载对应的评论区。",
    comments_thread_source: () => "评论区已开启，欢迎交流。",
    comments_panel_hint: "这里会加载当前文章的评论区。",
    comments_loading: "评论区加载中...",
    comments_empty_title: "暂无评论",
    comments_empty_body: "还没有人先开口，等你留下第一条想法。",
    related_posts: "相关文章",
    no_related_posts: "更多相关文章还在路上。",
    prev_post: "上一篇",
    next_post: "下一篇",
    loading_posts: "加载中...",
    loading_failed: "加载失败",
    loading_failed_body: "博客数据加载失败，请稍后重试。"
  },
  en: {
    locale: "en-US",
    site_description: "PlatoJobs personal website for technical writing, reading notes, reflections, and life fragments.",
    explore: "Explore",
    home: "Home",
    archive: "Archive",
    archive_title: "Archive",
    about: "About",
    about_title: "About",
    about_lead: "PlatoJobs writes about technical work, reading notes, reflections, and life fragments.",
    about_focus: "Focus",
    about_focus_title: "What I write about",
    about_focus_body: "Mostly Flutter, Swift, mobile engineering, tooling, reading notes, and a few everyday reflections.",
    about_way: "Way",
    about_way_title: "What this website is for",
    about_way_body: "It is not a portfolio shelf. It is a living personal website built for slow reading, revisiting, and subscribing.",
    about_contact: "Contact",
    about_contact_title: "How to reach me",
    about_contact_body: "You can find me through GitHub, X, or the two Gmail addresses in the left rail.",
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
    writing_archive: "Writing Archive",
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
    article_comments: "Comments",
    copy_link: "Copy Link",
    link_copied: "Article link copied.",
    link_copy_failed: "Copy failed. Please copy the URL manually.",
    show_all: "Show all",
    show_less: "Show less",
    uncategorized: "Uncategorized",
    result_count: (count) => `${count} posts`,
    empty_posts: "No matching posts. Try another label or keyword.",
    min_read: (minutes) => `${minutes} min read`,
    min_only: (minutes) => `${minutes} min`,
    loading_article: "Loading article...",
    loading_article_failed: "Failed to load article.",
    open_issue: "View Source",
    published: "Published",
    updated: "Updated",
    reading_time: "Reading Time",
    category_tags: "Category & Tags",
    comments_thread_hint: "Open an article to load its comment section.",
    comments_thread_source: () => "Comments are open for this article.",
    comments_panel_hint: "Comments for the current article will appear here.",
    comments_loading: "Loading comments...",
    comments_empty_title: "No comments yet",
    comments_empty_body: "No one has started the conversation yet. You could be the first.",
    related_posts: "Related Posts",
    no_related_posts: "More related writing is on the way.",
    prev_post: "Previous",
    next_post: "Next",
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

function getQueryView() {
  return new URL(window.location.href).searchParams.get("view") || "";
}

function updateQueryState({
  slug = state.activeSlug,
  locale = state.locale,
  view = state.activeView
} = {}) {
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
  if (view && view !== "home") {
    url.searchParams.set("view", view);
  } else {
    url.searchParams.delete("view");
  }
  window.history.replaceState({}, "", url);
}

function updateLocaleLinks() {
  const url = new URL(window.location.href);
  const makeHref = (locale, view = state.activeView) => {
    const next = new URL(url);
    next.searchParams.set("lang", locale);
    if (view && view !== "home") {
      next.searchParams.set("view", view);
    } else {
      next.searchParams.delete("view");
    }
    return `${next.pathname}${next.search}${next.hash}`;
  };
  elements.langZh?.setAttribute("href", makeHref("zh"));
  elements.langEn?.setAttribute("href", makeHref("en"));
  elements.navHome?.setAttribute("href", makeHref(state.locale, "home"));
  elements.navArchive?.setAttribute("href", makeHref(state.locale, "archive"));
  elements.navAbout?.setAttribute("href", makeHref(state.locale, "about"));
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

function setReadingProgress(progress) {
  const clamped = Math.max(0, Math.min(1, Number.isFinite(progress) ? progress : 0));
  if (elements.readingProgressBar) {
    elements.readingProgressBar.style.transform = `scaleX(${clamped})`;
  }
  if (elements.readingProgressValue) {
    elements.readingProgressValue.textContent = `${Math.round(clamped * 100)}%`;
  }
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
  setReadingProgress(0);
}

function resetComments(message) {
  if (elements.commentsEmpty) {
    elements.commentsEmpty.hidden = true;
  }
  if (elements.commentsThread) {
    elements.commentsThread.innerHTML = "";
  }
  if (elements.commentsStatus) {
    elements.commentsStatus.textContent = message;
  }
}

async function fetchIssueCommentCount(issueNumber) {
  if (commentCountCache.has(issueNumber)) {
    return commentCountCache.get(issueNumber);
  }
  const response = await fetch(`${ISSUE_API_BASE}${issueNumber}`);
  if (!response.ok) {
    throw new Error(`Issue API failed: ${response.status}`);
  }
  const issue = await response.json();
  const count = Number(issue?.comments ?? 0);
  commentCountCache.set(issueNumber, count);
  return count;
}

function warmUtterancesScript() {
  if (utterancesWarmPromise) return utterancesWarmPromise;
  utterancesWarmPromise = new Promise((resolve) => {
    const existing = document.querySelector('script[data-utterances-warm="true"]');
    if (existing) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://utteranc.es/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    script.dataset.utterancesWarm = "true";
    script.style.display = "none";
    script.addEventListener("load", () => resolve(), { once: true });
    script.addEventListener("error", () => resolve(), { once: true });
    document.head.appendChild(script);
  });
  return utterancesWarmPromise;
}

function renderComments(post) {
  if (!elements.commentsThread) return;

  elements.commentsThread.innerHTML = `<div class="comments-loading">${escapeHtml(t("comments_loading"))}</div>`;
  if (elements.commentsStatus) {
    elements.commentsStatus.textContent = t("comments_loading");
  }

  const cleanupPlaceholder = () => {
    elements.commentsThread?.querySelectorAll(".comments-loading").forEach((node) => node.remove());
    if (elements.commentsStatus) {
      elements.commentsStatus.textContent = t("comments_thread_source");
    }
  };

  const hasRenderedComments = () =>
    Boolean(
      elements.commentsThread?.querySelector(".utterances, .utterances-frame, iframe")
    );

  const observer = new MutationObserver(() => {
    if (hasRenderedComments()) {
      cleanupPlaceholder();
      observer.disconnect();
    }
  });
  observer.observe(elements.commentsThread, { childList: true, subtree: true });

  const mountUtterances = () => {
    const script = document.createElement("script");
    script.src = "https://utteranc.es/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    script.setAttribute("repo", COMMENTS_REPO);
    script.setAttribute("issue-number", String(post.number));
    script.setAttribute("theme", "github-dark");
    script.addEventListener("load", () => {
      window.setTimeout(() => {
        if (hasRenderedComments()) {
          cleanupPlaceholder();
        }
      }, 120);
    });
    elements.commentsThread.appendChild(script);
  };

  void warmUtterancesScript().finally(mountUtterances);

  let attempts = 0;
  const timer = window.setInterval(() => {
    attempts += 1;
    if (hasRenderedComments()) {
      cleanupPlaceholder();
      observer.disconnect();
      window.clearInterval(timer);
      return;
    }
    if (attempts >= 40) {
      window.clearInterval(timer);
    }
  }, 250);

  window.setTimeout(() => {
    void fetchIssueCommentCount(post.number)
      .then((count) => {
        if (elements.commentsEmpty) {
          elements.commentsEmpty.hidden = count !== 0;
        }
      })
      .catch(() => {
        if (elements.commentsEmpty) {
          elements.commentsEmpty.hidden = true;
        }
      });
  }, 900);
}

function updateReadingProgressFromScroll() {
  const container = elements.modalShell;
  const article = elements.readerShell?.querySelector(".article-layout");
  if (!container || !article) {
    setReadingProgress(0);
    return;
  }

  const start = article.offsetTop;
  const distance = Math.max(1, article.scrollHeight - container.clientHeight * 0.72);
  const current = container.scrollTop - start;
  setReadingProgress(current / distance);
}

function setArticleActionFeedback(button, message) {
  if (!button) return;
  const original = button.dataset.originalLabel || button.textContent || "";
  if (!button.dataset.originalLabel) {
    button.dataset.originalLabel = original;
  }
  button.textContent = message;
  window.clearTimeout(Number(button.dataset.feedbackTimer || 0));
  const timer = window.setTimeout(() => {
    button.textContent = button.dataset.originalLabel || original;
    button.dataset.feedbackTimer = "";
  }, 1600);
  button.dataset.feedbackTimer = String(timer);
}

async function copyTextWithFallback(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return true;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "absolute";
  textarea.style.left = "-9999px";
  textarea.style.top = "0";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);
  let copied = false;
  try {
    copied = document.execCommand("copy");
  } finally {
    textarea.remove();
  }

  if (copied) {
    return true;
  }

  if (typeof window.prompt === "function") {
    window.prompt(t("copy_link"), text);
  }
  return false;
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

function renderSectionNav() {
  const navMap = {
    home: elements.navHome,
    archive: elements.navArchive,
    about: elements.navAbout
  };

  Object.entries(navMap).forEach(([view, node]) => {
    node?.classList.toggle("is-active", state.activeView === view);
  });
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

function renderMainViews() {
  elements.homeView.hidden = state.activeView !== "home";
  elements.archiveView.hidden = state.activeView !== "archive";
  elements.aboutView.hidden = state.activeView !== "about";
  renderSectionNav();
}

function getPagedPosts() {
  const start = (state.page - 1) * state.pageSize;
  return state.filtered.slice(start, start + state.pageSize);
}

function renderArchive() {
  if (!elements.archiveShell) return;

  const grouped = state.posts.reduce((map, post) => {
    const year = new Date(post.createdAt).getFullYear();
    if (!map.has(year)) {
      map.set(year, []);
    }
    map.get(year).push(post);
    return map;
  }, new Map());

  const years = Array.from(grouped.keys()).sort((a, b) => b - a);

  elements.archiveShell.innerHTML = years
    .map((year) => {
      const posts = grouped.get(year) || [];
      return `
        <section class="archive-group">
          <div class="archive-year">${year}</div>
          <div class="archive-list">
            ${posts
              .map((post) => {
                const category = getCategory(post);
                return `
                  <button class="archive-item" type="button" data-slug="${escapeHtml(post.slug)}">
                    <span class="archive-item-date">${formatDate(post.createdAt)}</span>
                    <span class="archive-item-title">${escapeHtml(post.title)}</span>
                    <span class="archive-item-category" style="${getLabelStyleAttr(category)}">${escapeHtml(category)}</span>
                  </button>
                `;
              })
              .join("")}
          </div>
        </section>
      `;
    })
    .join("");

  elements.archiveShell.querySelectorAll("[data-slug]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeView = "home";
      renderMainViews();
      void openPost(button.dataset.slug);
    });
  });
}

function scoreRelatedPost(source, candidate) {
  if (!source || !candidate || source.slug === candidate.slug) return -1;
  let score = 0;
  if (getCategory(source) === getCategory(candidate)) score += 5;
  const sourceLabels = new Set(source.labels);
  candidate.labels.forEach((label) => {
    if (sourceLabels.has(label)) score += 2;
  });
  const delta =
    Math.abs(new Date(source.createdAt).getTime() - new Date(candidate.createdAt).getTime()) /
    86400000;
  score += Math.max(0, 2 - Math.min(2, delta / 365));
  return score;
}

function getRelatedPosts(post, limit = 4) {
  return state.posts
    .filter((candidate) => candidate.slug !== post.slug)
    .map((candidate) => ({ candidate, score: scoreRelatedPost(post, candidate) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.candidate);
}

function getPrevNextPosts(post) {
  const index = state.posts.findIndex((entry) => entry.slug === post.slug);
  return {
    nextPost: index > 0 ? state.posts[index - 1] : null,
    prevPost: index >= 0 && index < state.posts.length - 1 ? state.posts[index + 1] : null
  };
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

function enhanceArticleMarkup(html) {
  const template = document.createElement("template");
  template.innerHTML = html;
  const root = template.content;

  const leadParagraph = Array.from(root.children).find(
    (node) => node.tagName === "P" && node.textContent.trim().length > 0
  );
  if (leadParagraph) {
    leadParagraph.classList.add("article-lead");
  }

  root.querySelectorAll("table").forEach((table) => {
    if (table.parentElement?.classList.contains("article-table-wrap")) return;
    const wrap = document.createElement("div");
    wrap.className = "article-table-wrap";
    table.parentNode.insertBefore(wrap, table);
    wrap.appendChild(table);
  });

  root.querySelectorAll("img").forEach((img) => {
    const parent = img.parentElement;
    if (
      parent?.tagName === "P" &&
      parent.childNodes.length === 1 &&
      parent.textContent.trim() === ""
    ) {
      const figure = document.createElement("figure");
      figure.className = "article-figure";
      parent.parentNode.insertBefore(figure, parent);
      figure.appendChild(img);
      if (img.alt?.trim()) {
        const caption = document.createElement("figcaption");
        caption.textContent = img.alt.trim();
        figure.appendChild(caption);
      }
      parent.remove();
    }
  });

  root.querySelectorAll("a[href]").forEach((link) => {
    const href = link.getAttribute("href") || "";
    if (/^https?:\/\//i.test(href)) {
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noreferrer");
    }
  });

  return template.innerHTML;
}

function highlightCodeBlocks(root = elements.readerShell) {
  const codeBlocks = root?.querySelectorAll("pre code");
  if (!codeBlocks?.length) return;

  if (window.hljs?.highlightElement) {
    codeBlocks.forEach((block) => {
      if (!block.dataset.highlighted) {
        window.hljs.highlightElement(block);
      }
      const pre = block.parentElement;
      const classMatch = Array.from(block.classList).find((name) => name.startsWith("language-"));
      const explicitLanguage = classMatch ? classMatch.replace("language-", "") : "";
      const detectedLanguage = block.result?.language || explicitLanguage;
      if (pre && detectedLanguage) {
        pre.dataset.language = formatCodeLanguageLabel(detectedLanguage);
      }
    });
    return;
  }

  window.setTimeout(() => highlightCodeBlocks(root), 120);
}

function formatCodeLanguageLabel(language) {
  const normalized = String(language || "")
    .trim()
    .toLowerCase()
    .replaceAll("_", "-");

  const aliases = {
    objectivec: "Objective-C",
    "objective-c": "Objective-C",
    objc: "Objective-C",
    oc: "Objective-C",
    js: "JavaScript",
    javascript: "JavaScript",
    ts: "TypeScript",
    typescript: "TypeScript",
    py: "Python",
    csharp: "C#",
    cs: "C#",
    cpp: "C++",
    "c++": "C++",
    sh: "Shell",
    shell: "Shell",
    bash: "Bash",
    zsh: "Zsh",
    md: "Markdown",
    markdown: "Markdown",
    yml: "YAML",
    yaml: "YAML",
    json: "JSON",
    xml: "XML",
    html: "HTML",
    css: "CSS",
    scss: "SCSS",
    kotlin: "Kotlin",
    swift: "Swift",
    dart: "Dart",
    java: "Java",
    go: "Go",
    rust: "Rust",
    ruby: "Ruby",
    php: "PHP",
    sql: "SQL"
  };

  if (aliases[normalized]) {
    return aliases[normalized];
  }

  return normalized.replace(/(^|-)([a-z])/g, (_, prefix, char) => `${prefix}${char.toUpperCase()}`);
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
  const html = enhanceArticleMarkup(marked.parse(markdown));
  const category = getCategory(post);
  const relatedPosts = getRelatedPosts(post, 4);
  const { prevPost, nextPost } = getPrevNextPosts(post);
  const tags = getTags(post)
    .map(
      (tag) => `<span class="tag-chip" style="${getLabelStyleAttr(tag)}">${escapeHtml(tag)}</span>`
    )
    .join("");

  elements.readerShell.innerHTML = `
    <article class="article-layout">
      <header class="article-hero">
        <div class="article-hero-copy">
          <p class="eyebrow">${formatDate(post.createdAt)}</p>
          <h2 class="article-title">${escapeHtml(post.title)}</h2>
        </div>
        <div class="article-actions">
          <button class="article-link" id="open-article-source" type="button">${escapeHtml(t("open_issue"))}</button>
          <button class="article-link article-link-secondary" id="copy-article-link" type="button">${escapeHtml(t("copy_link"))}</button>
        </div>
      </header>

      <section class="article-meta-panel">
        <div class="article-meta-strip" role="list">
          <div class="meta-group" role="listitem">
            <span class="meta-label">${escapeHtml(t("published"))}</span>
            <strong>${formatDate(post.createdAt)}</strong>
          </div>
          <div class="meta-group" role="listitem">
            <span class="meta-label">${escapeHtml(t("updated"))}</span>
            <strong>${formatDate(post.updatedAt)}</strong>
          </div>
          <div class="meta-group" role="listitem">
            <span class="meta-label">${escapeHtml(t("reading_time"))}</span>
            <strong>${escapeHtml(t("min_only", post.readingTime))}</strong>
          </div>
        </div>
        <div class="meta-group meta-group-wide article-tag-row">
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

      <section class="article-bottom-stack">
        <div class="article-nav-grid">
          ${
            prevPost
              ? `
                <button class="article-nav-card" type="button" data-nav-slug="${escapeHtml(prevPost.slug)}">
                  <span class="article-nav-label">${escapeHtml(t("prev_post"))}</span>
                  <strong>${escapeHtml(prevPost.title)}</strong>
                </button>
              `
              : ""
          }
          ${
            nextPost
              ? `
                <button class="article-nav-card" type="button" data-nav-slug="${escapeHtml(nextPost.slug)}">
                  <span class="article-nav-label">${escapeHtml(t("next_post"))}</span>
                  <strong>${escapeHtml(nextPost.title)}</strong>
                </button>
              `
              : ""
          }
        </div>

        <section class="related-posts">
          <div class="related-posts-head">
            <h3>${escapeHtml(t("related_posts"))}</h3>
          </div>
          ${
            relatedPosts.length
              ? `
                <div class="related-post-list">
                  ${relatedPosts
                    .map((item) => {
                      const itemCategory = getCategory(item);
                      return `
                        <button class="related-post-link" type="button" data-related-slug="${escapeHtml(item.slug)}">
                          <span class="related-post-title">${escapeHtml(item.title)}</span>
                          <span class="related-post-meta">
                            <span class="related-post-kicker">${escapeHtml(itemCategory)}</span>
                            <span class="related-post-arrow" aria-hidden="true">↗</span>
                          </span>
                        </button>
                      `;
                    })
                    .join("")}
                </div>
              `
              : `<p class="related-empty">${escapeHtml(t("no_related_posts"))}</p>`
          }
        </section>
      </section>
    </article>
  `;

  document.querySelector("#open-article-source")?.addEventListener("click", () => {
    window.location.href = post.issueUrl;
  });

  document.querySelector("#copy-article-link")?.addEventListener("click", async () => {
    const copyButton = document.querySelector("#copy-article-link");
    const articleUrl = `${SITE_URL}?post=${encodeURIComponent(post.slug)}&lang=${state.locale}`;
    try {
      const copied = await copyTextWithFallback(articleUrl);
      setArticleActionFeedback(copyButton, copied ? t("link_copied") : t("link_copy_failed"));
    } catch {
      setArticleActionFeedback(copyButton, t("link_copy_failed"));
    }
  });

  document.querySelectorAll("[data-nav-slug]").forEach((button) => {
    button.addEventListener("click", () => {
      void openPost(button.dataset.navSlug);
    });
  });

  document.querySelectorAll("[data-related-slug]").forEach((button) => {
    button.addEventListener("click", () => {
      void openPost(button.dataset.relatedSlug);
    });
  });

  highlightCodeBlocks(elements.readerShell);
  elements.modalShell?.scrollTo({ top: 0, behavior: "auto" });
  updateReadingProgressFromScroll();
}

async function openPost(slug) {
  const post = state.posts.find((item) => item.slug === slug);
  if (!post) return;
  state.activeSlug = slug;
  updateQueryState({ slug, locale: state.locale, view: state.activeView });
  updateSeo(post);
  renderPosts();
  openDrawer();
  renderComments(post);
  await renderArticle(post);
}

function bindControls() {
  elements.navHome?.addEventListener("click", (event) => {
    event.preventDefault();
    state.activeView = "home";
    updateQueryState({ view: "home", slug: state.activeSlug, locale: state.locale });
    renderMainViews();
  });

  elements.navArchive?.addEventListener("click", (event) => {
    event.preventDefault();
    state.activeView = "archive";
    updateQueryState({ view: "archive", slug: state.activeSlug, locale: state.locale });
    renderMainViews();
  });

  elements.navAbout?.addEventListener("click", (event) => {
    event.preventDefault();
    state.activeView = "about";
    updateQueryState({ view: "about", slug: state.activeSlug, locale: state.locale });
    renderMainViews();
  });

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
      const copied = await copyTextWithFallback(FEED_URL);
      if (elements.feedCopyStatus) {
        elements.feedCopyStatus.textContent = copied ? t("subscribe_copied") : t("subscribe_copy_failed");
      }
    } catch {
      const field = elements.feedUrl;
      if (field) {
        field.focus();
        field.select();
        field.setSelectionRange(0, field.value.length);
      }
      if (typeof window.prompt === "function") {
        window.prompt(t("copy_feed"), FEED_URL);
      }
      if (elements.feedCopyStatus) {
        elements.feedCopyStatus.textContent = t("subscribe_copy_failed");
      }
    }
  });

  elements.drawerOverlay.addEventListener("click", closeDrawer);
  elements.drawerClose.addEventListener("click", closeDrawer);
  elements.modalShell?.addEventListener("scroll", updateReadingProgressFromScroll, {
    passive: true
  });
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
  updateQueryState({ slug: state.activeSlug, locale, view: state.activeView });
  renderStaticI18n();
  renderLanguageToggle();
  renderSectionNav();
  renderExpandToggles();
  updateLocaleLinks();
  renderStats();
  renderFilters();
  renderArchive();
  renderMainViews();
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
  const queryView = getQueryView();
  if (queryView === "archive" || queryView === "about" || queryView === "home") {
    state.activeView = queryView;
  }
  startBrandTyping();
  renderStaticI18n();
  renderLanguageToggle();
  renderSectionNav();
  renderExpandToggles();
  elements.resultCount.textContent = t("loading_posts");
  resetComments(t("comments_thread_hint"));
  const response = await fetch("./blog-data/posts.json");
  state.posts = await response.json();
  state.activeSlug = getQuerySlug();
  updateQueryState({ slug: state.activeSlug, locale: state.locale, view: state.activeView });

  renderSeoLinks();
  renderStats();
  renderFilters();
  renderArchive();
  renderMainViews();
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
