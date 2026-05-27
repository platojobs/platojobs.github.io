const repoGrid = document.querySelector("#repo-grid");
const username = "platojobs";

function formatDate(dateString) {
  const formatter = new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });

  return formatter.format(new Date(dateString));
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderRepos(repos) {
  if (!repos.length) {
    repoGrid.innerHTML = `
      <article class="repo-card repo-card-empty">
        <p>No public repositories found yet.</p>
      </article>
    `;
    return;
  }

  repoGrid.innerHTML = repos
    .map((repo) => {
      const rawDescription = repo.description?.trim();
      const description =
        rawDescription && rawDescription !== repo.name
          ? escapeHtml(rawDescription)
          : "A public project from the platojobs GitHub account.";
      const language = repo.language ? escapeHtml(repo.language) : "Mixed stack";

      return `
        <article class="repo-card">
          <div class="repo-top">
            <a class="repo-name" href="${repo.html_url}" target="_blank" rel="noreferrer">${escapeHtml(repo.name)}</a>
            <a class="repo-link" href="${repo.html_url}" target="_blank" rel="noreferrer">Open</a>
          </div>
          <p class="repo-description">${description}</p>
          <div class="repo-meta">
            <span class="repo-pill">${language}</span>
            <span>★ ${repo.stargazers_count}</span>
            <span>Updated ${formatDate(repo.updated_at)}</span>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderError() {
  repoGrid.innerHTML = `
    <article class="repo-card repo-card-empty">
      <p>Unable to load repositories right now.</p>
      <a class="repo-link" href="https://github.com/${username}" target="_blank" rel="noreferrer">
        Visit the GitHub profile instead
      </a>
    </article>
  `;
}

async function loadRepos() {
  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=6`,
      {
        headers: {
          Accept: "application/vnd.github+json"
        }
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API responded with ${response.status}`);
    }

    const data = await response.json();
    const repos = data
      .filter((repo) => !repo.fork)
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
      .slice(0, 6);

    renderRepos(repos);
  } catch (error) {
    console.error("Failed to load repositories", error);
    renderError();
  }
}

loadRepos();
