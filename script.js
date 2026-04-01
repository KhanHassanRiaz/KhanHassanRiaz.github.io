const PROQUIZ_DETAILS_PAGE = "proquiz-simulator.html";
const PRO_TYPING_MASTER_DETAILS_PAGE = "pro-typing-master.html";
const PRO_TYPING_ASSISTANT_DETAILS_PAGE = "protyping-assistant.html";
const THEME_STORAGE_KEY = "khandevs-theme";
const RELEASES_CONFIG = {
  "proquiz-simulator": {
    apiUrl:
      "https://api.github.com/repos/KhanHassanRiaz/ProQuiz-Simulator-updater/releases/latest",
    pageUrl:
      "https://github.com/KhanHassanRiaz/ProQuiz-Simulator-updater/releases/latest",
    fallbackName: "proquiz-latest",
  },
  "pro-typing-master": {
    apiUrl:
      "https://api.github.com/repos/KhanHassanRiaz/ProTyping-Master/releases/latest",
    pageUrl: "https://github.com/KhanHassanRiaz/ProTyping-Master/releases/latest",
    fallbackName: "protyping-master-latest",
    },
    "protyping-assistant": {
      apiUrl: "https://api.github.com/repos/KhanHassanRiaz/ProTyping-Assistant/releases/latest",
      pageUrl: "https://github.com/KhanHassanRiaz/ProTyping-Assistant/releases/latest",
      fallbackName: "protyping-assistant-latest",
    },
};
const SOFTWARE_CATALOG = [
  {
    id: "proquiz-simulator",
    name: "ProQuiz Simulator",
    description:
      "A complete digital testing academy for PPSC, FPSC, NTS, and other competitive exams.",
    categories: ["windows", "android"],
    keywords: [
      "proquiz",
      "pro quiz",
      "quiz",
      "mcq",
      "exam",
      "ppsc",
      "fpsc",
      "nts",
      "academy",
      "practice",
    ],
    logo: "icon.png",
    url: PROQUIZ_DETAILS_PAGE,
    status: "available",
    featured: true,
  },
  {
    id: "pro-typing-assistant",
    name: "Pro Typing Assistant",
    description:
      "Accessible spelling suggestions, voice typing support, and custom dictionaries.",
    categories: ["windows"],
    keywords: [
      "typing",
      "assistant",
      "spelling",
      "spell check",
      "voice typing",
      "dictionary",
      "pro typing",
      "education",
    ],
    logo: "icon_pta.ico",
    url: PRO_TYPING_ASSISTANT_DETAILS_PAGE,
    status: "available",
    featured: false,
  },
  {
    id: "pro-typing-master",
    name: "Pro Typing Master",
    description:
      "Accessible WPM practice and typing speed improvement with text-to-speech support.",
    categories: ["windows"],
    keywords: [
      "typing",
      "master",
      "wpm",
      "speed",
      "practice",
      "tts",
      "text to speech",
      "pro typing",
    ],
    logo: "logo_ptm.png",
    url: PRO_TYPING_MASTER_DETAILS_PAGE,
    status: "available",
    featured: false,
  },
];

async function sortTrendingSoftwareByPopularity() {
  const trendingContainer = document.querySelector("#trending");
  if (!trendingContainer) return;
  const cards = Array.from(trendingContainer.querySelectorAll(".software-card[data-product-id]"));
  if (cards.length === 0) return;
  const CACHE_KEY = "khandevs-trending-counts";
  let cache = {};
  try {
    cache = JSON.parse(sessionStorage.getItem(CACHE_KEY)) || {};
  } catch (e) {}
  const getDownloadCount = async (productId) => {
    if (cache[productId] !== undefined) return cache[productId];
    const config = RELEASES_CONFIG[productId];
    if (!config || !config.apiUrl) return 0;
    try {
      const resp = await fetch(config.apiUrl, { headers: { Accept: "application/vnd.github+json" } });
      if (!resp.ok) return 0;
      const data = await resp.json();
      if (!data.assets || !Array.isArray(data.assets)) return 0;
      const count = data.assets.reduce((sum, asset) => sum + (asset.download_count || 0), 0);
      cache[productId] = count;
      return count;
    } catch {
      return 0;
    }
  };
  const results = await Promise.all(
    cards.map(async (card) => {
      const pid = card.getAttribute("data-product-id");
      const count = await getDownloadCount(pid);
      return { card, count };
    })
  );
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (e) {}
  results.sort((a, b) => b.count - a.count);
  results.forEach(res => trendingContainer.appendChild(res.card));
}

function updateGreeting() {
  const greetingEl = document.getElementById("greeting-text");
  if (!greetingEl) return;

  const hour = new Date().getHours();
  let greeting = "Good Night";

  if (hour >= 5 && hour < 12) greeting = "Good Morning";
  if (hour >= 12 && hour < 17) greeting = "Good Afternoon";
  if (hour >= 17) greeting = "Good Evening";

  greetingEl.textContent = `${greeting}, welcome to KhanDevs.`;
}

function applyTheme(theme) {
  const safeTheme = theme === "dark" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", safeTheme);
  localStorage.setItem(THEME_STORAGE_KEY, safeTheme);

  const toggleButton = document.getElementById("theme-toggle");
  const label = document.getElementById("theme-toggle-label");
  if (!toggleButton || !label) return;

  const darkActive = safeTheme === "dark";
  toggleButton.setAttribute("aria-pressed", String(darkActive));
  label.textContent = darkActive ? "Light Mode" : "Dark Mode";

  const themeStatus = document.getElementById("theme-status");
  if (themeStatus) {
    themeStatus.textContent = darkActive
      ? "Currently in dark mode."
      : "Currently in light mode.";
  }
}

function initThemeToggle() {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(savedTheme || (prefersDark ? "dark" : "light"));

  const toggleButton = document.getElementById("theme-toggle");
  if (!toggleButton) return;

  toggleButton.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") || "light";
    applyTheme(current === "dark" ? "light" : "dark");
  });
}

function initMobileMenu() {
  const navToggle = document.querySelector("[data-nav-toggle]");
  const navPanel = document.querySelector("[data-nav-panel]");
  if (!navToggle || !navPanel) return;

  const closeMenu = () => {
    navPanel.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  };

  navToggle.addEventListener("click", () => {
    const currentlyOpen = navPanel.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(currentlyOpen));
  });

  navPanel.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 980) closeMenu();
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 980) closeMenu();
  });
}

function initSmoothScrolling() {
  const links = document.querySelectorAll(".nav-list a[href^='#']");
  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function initActiveNavLinks() {
  const navLinks = Array.from(document.querySelectorAll(".nav-list a[href^='#']"));
  if (!navLinks.length) return;

  const mappedLinks = navLinks
    .map((link) => {
      const href = link.getAttribute("href");
      if (!href) return null;
      const section = document.querySelector(href);
      if (!section) return null;
      return { link, section };
    })
    .filter(Boolean);

  if (!mappedLinks.length) return;

  const setActive = (activeLink) => {
    mappedLinks.forEach(({ link }) => {
      const isActive = link === activeLink;
      link.classList.toggle("is-active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  const hash = window.location.hash;
  if (hash) {
    const matched = mappedLinks.find(({ link }) => link.getAttribute("href") === hash);
    if (matched) setActive(matched.link);
  } else {
    setActive(mappedLinks[0].link);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;

      const matched = mappedLinks.find(({ section }) => section === visible.target);
      if (matched) setActive(matched.link);
    },
    {
      threshold: [0.3, 0.45, 0.6],
      rootMargin: "-25% 0px -55% 0px",
    }
  );

  mappedLinks.forEach(({ section }) => observer.observe(section));
}

function selectPreferredAsset(assets) {
  if (!Array.isArray(assets)) return null;

  const exeAsset = assets.find((asset) => /\.exe$/i.test(asset.name || ""));
  if (exeAsset) return exeAsset;

  const zipAsset = assets.find((asset) => /\.zip$/i.test(asset.name || ""));
  if (zipAsset) return zipAsset;

  return null;
}

async function wireLatestRelease(productId) {
  const releaseConfig = RELEASES_CONFIG[productId];
  if (!releaseConfig) return;

  const windowsButtons = document.querySelectorAll(
    `[data-release-download='${productId}'][data-platform='windows']`
  );
  const statusEls = document.querySelectorAll(
    `[data-release-status='${productId}']`
  );

  if (!windowsButtons.length && !statusEls.length) return;

  try {
    const response = await fetch(releaseConfig.apiUrl, {
      headers: {
        Accept: "application/vnd.github+json",
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API request failed with status ${response.status}`);
    }

    const latestRelease = await response.json();
    const preferredAsset = selectPreferredAsset(latestRelease.assets);

    if (preferredAsset && preferredAsset.browser_download_url) {
      windowsButtons.forEach((button) => {
        button.href = preferredAsset.browser_download_url;
        button.setAttribute(
          "download",
          preferredAsset.name || releaseConfig.fallbackName
        );
        button.removeAttribute("aria-disabled");
      });

      statusEls.forEach((statusEl) => {
        statusEl.textContent = "";
        statusEl.classList.add("is-hidden");
        statusEl.classList.add("ok");
        statusEl.classList.remove("error");
      });
      return;
    }

    windowsButtons.forEach((button) => {
      button.href = releaseConfig.pageUrl;
      button.removeAttribute("download");
    });

    statusEls.forEach((statusEl) => {
      statusEl.textContent =
        "Latest release found, but no .exe or .zip asset is available yet.";
      statusEl.classList.remove("is-hidden");
      statusEl.classList.add("error");
      statusEl.classList.remove("ok");
    });
  } catch (error) {
    const isRateLimited = String(error.message).includes("403");

    windowsButtons.forEach((button) => {
      button.href = releaseConfig.pageUrl;
      button.removeAttribute("download");
    });

    statusEls.forEach((statusEl) => {
      statusEl.textContent = isRateLimited
        ? "GitHub API rate limit reached. Using releases page as fallback."
        : "Unable to fetch the latest release now. Using releases page as fallback.";
      statusEl.classList.remove("is-hidden");
      statusEl.classList.add("error");
      statusEl.classList.remove("ok");
    });
  }
}

function wireLatestReleases() {
  Object.keys(RELEASES_CONFIG).forEach((productId) => {
    wireLatestRelease(productId);
  });
}

function normalizeSearchText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeCompactSearchText(value) {
  return normalizeSearchText(value).replace(/[\s-]+/g, "");
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function calculateMatchScore(query, software) {
  if (!query) return 10;

  const normalizedName = normalizeSearchText(software.name);
  const normalizedDesc = normalizeSearchText(software.description);
  const keywords = software.keywords.map((word) => normalizeSearchText(word));
  const compactQuery = normalizeCompactSearchText(query);
  const compactName = normalizeCompactSearchText(software.name);
  const compactDesc = normalizeCompactSearchText(software.description);
  const compactKeywords = software.keywords.map((word) =>
    normalizeCompactSearchText(word)
  );

  let score = 0;
  if (normalizedName === query) score += 120;
  if (normalizedName.startsWith(query)) score += 90;
  if (normalizedName.includes(query)) score += 60;

  if (compactQuery) {
    if (compactName === compactQuery) score += 110;
    if (compactName.startsWith(compactQuery)) score += 80;
    if (compactName.includes(compactQuery)) score += 50;
  }

  keywords.forEach((keyword) => {
    if (keyword === query) score += 80;
    else if (keyword.startsWith(query)) score += 50;
    else if (keyword.includes(query)) score += 25;
  });

  if (compactQuery) {
    compactKeywords.forEach((keyword) => {
      if (keyword === compactQuery) score += 70;
      else if (keyword.startsWith(compactQuery)) score += 40;
      else if (keyword.includes(compactQuery)) score += 20;
    });
  }

  if (normalizedDesc.includes(query)) score += 15;
  if (compactQuery && compactDesc.includes(compactQuery)) score += 10;
  return score;
}

function filterSoftware(query, category) {
  const normalizedQuery = normalizeSearchText(query);
  const normalizedCategory = normalizeSearchText(category || "all");

  const categoryFiltered = SOFTWARE_CATALOG.filter((software) => {
    if (normalizedCategory === "all") return true;
    return software.categories.includes(normalizedCategory);
  });

  const scored = categoryFiltered
    .map((software) => ({
      software,
      score: calculateMatchScore(normalizedQuery, software),
    }))
    .filter((item) => item.score > 0);

  return scored
    .sort((left, right) => {
      if (right.score !== left.score) return right.score - left.score;
      if (right.software.featured !== left.software.featured) {
        return Number(right.software.featured) - Number(left.software.featured);
      }
      return left.software.name.localeCompare(right.software.name);
    })
    .map((item) => item.software);
}

function buildProductsSearchUrl(query, category) {
  const params = new URLSearchParams();
  const normalizedQuery = String(query || "").trim();
  const normalizedCategory = normalizeSearchText(category || "all");

  if (normalizedQuery) {
    params.set("q", normalizedQuery);
  }

  if (normalizedCategory && normalizedCategory !== "all") {
    params.set("category", normalizedCategory);
  }

  const queryString = params.toString();
  return `products.html${queryString ? `?${queryString}` : ""}`;
}

function isProductsPage() {
  const path = window.location.pathname.toLowerCase();
  return path.endsWith("/products.html") || path.endsWith("products.html");
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function renderSearchResults(form, results, query, category) {
  const container = form.parentElement?.querySelector("[data-search-results]");
  const countEl = form.parentElement?.querySelector("[data-results-count]");
  const list = form.parentElement?.querySelector("[data-results-list]");
  const feedback = form.parentElement?.querySelector("[data-search-feedback]");
  if (!container || !countEl || !list || !feedback) return;

  if (!results.length) {
    const activeCategory = normalizeSearchText(category || "all");
    const hasActiveFilters = Boolean(normalizeSearchText(query)) || activeCategory !== "all";

    if (!hasActiveFilters) {
      container.hidden = true;
      countEl.textContent = "";
      list.innerHTML = "";
      feedback.textContent = "Type a keyword or choose a category to find software.";
    } else {
      container.hidden = false;
      countEl.textContent = "0 result(s) found.";
      list.innerHTML = `
        <div class="search-empty-state" role="region" aria-label="No search results">
          <p class="search-empty-icon" aria-hidden="true">SR</p>
          <p class="search-empty-text">
            No matching software found. Please try a different keyword or category.
          </p>
        </div>
      `;
      feedback.textContent = "";
    }
    return;
  }

  const html = results
    .map((software, index) => {
      const categories = software.categories.map((item) => item.toUpperCase()).join(", ");
      const safeName = escapeHtml(software.name);
      const safeDescription = escapeHtml(software.description);
      const logoHtml = software.logo
        ? `<img class="result-logo" src="${escapeHtml(software.logo)}" alt="${safeName} logo" />`
        : `<div class="result-logo-placeholder" aria-hidden="true"></div>`;
      const enterClass = prefersReducedMotion() ? "" : "is-entering";
      const delayStyle = prefersReducedMotion() ? "" : ` style="animation-delay:${index * 70}ms"`;

      if (software.status === "coming-soon") {
        return `
          <article class="result-item ${enterClass}" aria-label="${safeName}"${delayStyle}>
            ${logoHtml}
            <div class="result-copy">
              <h4 class="result-heading">${safeName} <span class="coming-soon-badge">Coming Soon</span></h4>
              <p class="result-desc">${safeDescription}</p>
              <p class="result-meta">Available for: ${categories}</p>
            </div>
          </article>
        `;
      }

      return `
        <article class="result-item ${enterClass}" aria-label="${safeName}"${delayStyle}>
          ${logoHtml}
          <div class="result-copy">
            <h4 class="result-heading"><a href="${escapeHtml(software.url)}">${safeName}</a></h4>
            <p class="result-desc">${safeDescription}</p>
            <p class="result-meta">Available for: ${categories}</p>
          </div>
        </article>
      `;
    })
    .join("");

  list.innerHTML = html;
  container.hidden = false;
  countEl.textContent = `${results.length} result(s) found.`;
  feedback.textContent = "";
}

function initScrollReveal() {
  if (prefersReducedMotion()) return;

  const sections = document.querySelectorAll("main .section");
  if (!sections.length) return;

  sections.forEach((section) => section.classList.add("reveal-ready"));

  if (!("IntersectionObserver" in window)) {
    sections.forEach((section) => section.classList.add("reveal-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("reveal-visible");
        currentObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -12% 0px",
    }
  );

  sections.forEach((section) => observer.observe(section));
}

function initButtonRipples() {
  if (prefersReducedMotion()) return;

  const buttons = document.querySelectorAll(
    ".primary-cta, .search-btn, .download-btn, .community-btn, .share-btn"
  );
  if (!buttons.length) return;

  buttons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const rect = button.getBoundingClientRect();
      const ripple = document.createElement("span");
      const size = Math.max(rect.width, rect.height) * 1.7;
      const left = event.clientX - rect.left - size / 2;
      const top = event.clientY - rect.top - size / 2;

      ripple.className = "ripple-dot";
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      ripple.style.left = `${left}px`;
      ripple.style.top = `${top}px`;

      button.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
    });
  });
}

function initSoftwareSearch() {
  const forms = document.querySelectorAll("[data-search-form]");
  if (!forms.length) return;

  forms.forEach((form) => {
    const queryInput = form.querySelector("input[name='software-query']");
    const categoryInput = form.querySelector("select[name='software-category']");
    if (!queryInput || !categoryInput) return;

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const query = queryInput.value;
      const category = categoryInput.value;
      const targetUrl = buildProductsSearchUrl(query, category);
      const resolvedTarget = new URL(targetUrl, window.location.href);

      if (window.location.href === resolvedTarget.href) {
        window.location.reload();
        return;
      }

      window.location.href = targetUrl;
    });

    if (!isProductsPage()) return;

    const params = new URLSearchParams(window.location.search);
    const initialQuery = params.get("q") || "";
    const initialCategory = normalizeSearchText(params.get("category") || "all");

    queryInput.value = initialQuery;
    if (["all", "windows", "android"].includes(initialCategory)) {
      categoryInput.value = initialCategory;
    } else {
      categoryInput.value = "all";
    }

    const hasActiveSearch = Boolean(normalizeSearchText(initialQuery)) || categoryInput.value !== "all";
    const featuredSection = document.getElementById("products-list");

    if (!hasActiveSearch) {
      if (featuredSection) featuredSection.hidden = false;
      return;
    }

    const results = filterSoftware(initialQuery, categoryInput.value);
    renderSearchResults(form, results, initialQuery, categoryInput.value);
    if (featuredSection) featuredSection.hidden = true;
  });
}

async function initPageShare() {
  const shareButton = document.querySelector("[data-share-page]");
  const feedback = document.querySelector("[data-share-feedback]");
  if (!shareButton) return;

  const getSharePayload = () => ({
    title: document.title,
    text: "Check out ProQuiz Simulator for accessible exam preparation.",
    url: window.location.href,
  });

  const setFeedback = (message, isError = false) => {
    if (!feedback) return;
    feedback.textContent = message;
    feedback.style.color = isError ? "var(--danger)" : "var(--success)";
  };

  shareButton.addEventListener("click", async () => {
    const payload = getSharePayload();

    if (navigator.share) {
      try {
        await navigator.share(payload);
        setFeedback("Page shared successfully.");
        return;
      } catch (error) {
        if (error && error.name === "AbortError") return;
      }
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(payload.url);
        setFeedback("Page link copied. You can now paste and share it.");
        return;
      } catch (error) {
        setFeedback("Unable to copy automatically. Please copy the URL manually.", true);
        return;
      }
    }

    setFeedback("Sharing is not supported on this browser. Please copy the URL manually.", true);
  });
}

function cleanIndexHtmlFromUrl() {
  try {
    if (!window.history || typeof window.history.replaceState !== "function") return;

    const currentUrl = new URL(window.location.href);

    // Avoid history rewrites in local file previews where this can fail.
    if (currentUrl.protocol === "file:") return;

    if (currentUrl.pathname.endsWith("/index.html")) {
      currentUrl.pathname = currentUrl.pathname.replace(/index\.html$/, "") || "/";
      window.history.replaceState(null, "", currentUrl.toString());
    }
  } catch (error) {
    // Never block page initialization (theme toggle, nav, search, etc.).
  }
}

document.addEventListener("DOMContentLoaded", () => {
  updateGreeting();
  initThemeToggle();
  cleanIndexHtmlFromUrl();
  initMobileMenu();
  initSmoothScrolling();
  initActiveNavLinks();
  initSoftwareSearch();
  initScrollReveal();
  initButtonRipples();
  wireLatestReleases();
  initPageShare();
    sortTrendingSoftwareByPopularity();
});


