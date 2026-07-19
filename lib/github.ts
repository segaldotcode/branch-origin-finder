const REPO = "segaldotcode/branch-origin-finder";

export async function getRepoStars(): Promise<number | null> {
  try {
    const response = await fetch(`https://api.github.com/repos/${REPO}`, {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as { stargazers_count?: number };
    return typeof data.stargazers_count === "number" ? data.stargazers_count : null;
  } catch {
    return null;
  }
}

export const REPO_URL = `https://github.com/${REPO}`;
