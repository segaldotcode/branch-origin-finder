# Branch Origin Finder

## Why this exists

Git does not store the parent branch of a branch. When a developer creates `feature/payment-refactor`, Git never records whether it came from `main`, `develop` or `release/2.1`. This tool infers the most likely parent branch from the commit history instead of guessing.

It is not a tutorial project. It solves a real developer tooling problem, using merge-base analysis, reflog inspection and upstream tracking to produce a confidence score, not an absolute answer. Git does not guarantee ground truth here, so the tool never claims to.

## Features

- CLI command `branch-origin <branch-name>` with a confidence score
- `--all` flag to analyze every branch in the repository
- `--json` flag for structured output
- Merge-base analysis against candidate branches (`main`, `develop`, `release/*`)
- Reflog inspection for local `checkout` entries (local only)
- Upstream tracking via `branch.<name>.merge`
- Optional web interface with branch graph visualization and confidence breakdown

Example output:

```text
Branch: feature/payment-refactor

Likely source branch : develop (92%)
Branch point          : commit 8af32cd
Reasons                :
  Nearest common ancestor found
  Fewer divergent commits than main
  Reflog checkout entry found
```

## Tech stack

- Next.js (App Router)
- Node.js / CLI core
- simple-git / native git shell execution
- Tailwind CSS + Shadcn UI (web interface)
- next-themes (dark/light mode)
- cuelume (interaction sounds)
- pnpm

## Screenshots / Demo GIF

Coming soon.

## How to reuse

Coming soon.

## Architecture

Coming soon.
