# Branch Origin Finder

## Why this exists

Git does not store the parent branch of a branch. When a developer creates `feature/payment-refactor`, Git never records whether it came from `main`, `develop` or `release/2.1`. This tool infers the most likely parent branch from the commit history instead of guessing.

It is not a tutorial project. It solves a real developer tooling problem, using merge-base analysis, reflog inspection and upstream tracking to produce a confidence score, not an absolute answer. Git does not guarantee ground truth here, so the tool never claims to.

## Features

- CLI command `branch-origin <branch-name>` with a confidence score, defaulting to the current branch when none is given
- `--all` flag to analyze every local branch against the others in one pass
- `--json` flag for structured output
- `-C <path>` flag to run against a repository other than the current directory
- Merge-base analysis, ranked by recency in the commit graph (not just by commit date, which can tie or be rewritten by a rebase)
- Reflog inspection for local `checkout` entries and branch creation records (local only)
- Upstream tracking via `branch.<name>.merge`
- A topology check that rules out a candidate when the target branch is provably older than it, instead of reporting a confident but nonsensical match
- Web interface: paste a `--json` result to visualize the branch graph, confidence score and reasons, no server-side git access involved
- French/English language toggle
- Light/dark theme toggle (with interaction sounds)

Example output:

```text
Branch: feature/payment-refactor

Likely source branch : develop (95%)
Branch point         : commit 4d0acce
Reasons              :
  Reflog checkout entry found from develop
  Nearest common ancestor found, more recent than other candidates
  Fewer divergent commits than main
```

## Tech stack

- Next.js (App Router)
- Node.js / CLI core (`commander`, `simple-git`)
- Tailwind CSS + Shadcn UI (web interface)
- next-themes (dark/light mode)
- cuelume (interaction sounds)
- pnpm

## Screenshots / Demo GIF

Light mode:

![Web interface in light mode](public/assets/screen-light-mode.png)

Dark mode:

![Web interface in dark mode](public/assets/screen-dark-mode.png)

Pasting a CLI result, exploring the confidence breakdown, and toggling theme/language:

![Demo of pasting a result, the branch graph, and the theme/language toggles](public/assets/demo.gif)

## How to reuse

1. Clone the repo and install dependencies: `pnpm install`
2. Run the CLI against any local repository: `pnpm branch-origin <branch-name> -C /path/to/repo`, or `--json` for structured output
3. Run `pnpm branch-origin --all -C /path/to/repo` to check every branch at once
4. Start the web interface with `pnpm dev`, then paste a `--json` result (or click "Load example") to visualize it

## Architecture

- `lib/git/infer-origin.ts` is the entry point of the analysis: it resolves candidate branches, gathers signals for each, and scores them
- `lib/git/merge-base.ts`, `lib/git/reflog.ts` and `lib/git/upstream.ts` each read one independent signal from the repository (merge-base and divergence, reflog checkout entries, upstream tracking config)
- `lib/git/ancestry.ts` ranks merge-base commits by actual position in the commit graph rather than trusting commit timestamps alone; it shells out directly with `child_process` because `simple-git`'s `raw()` does not reliably surface a non-zero exit code when a command like `merge-base --is-ancestor` produces no stderr output
- `lib/git/confidence.ts` turns the gathered signals into a weighted score and a list of reasons, and filters out candidates the commit graph proves cannot be the source
- `bin/branch-origin.ts` is the CLI entry point (`commander`), calling the same `lib/git` core used by the web interface
- `lib/git/types.ts` defines `ConfidenceReason` as a `code` plus structured `params`, so both the English CLI output and the localized web UI can render the same reason from the same data
- `lib/git/validate.ts` is a small runtime type guard for JSON pasted into the web interface, so malformed input fails with a readable error instead of a crash
- `components/git/` holds the web interface: `json-input-form.tsx` (paste + parse), `origin-result-card.tsx` (score, reasons, candidate breakdown) and `branch-graph.tsx` (the divergence diagram)
- `lib/i18n/` holds `en.json`/`fr.json` dictionaries; `localizeReason()` re-renders a `ConfidenceReason` in the active locale
