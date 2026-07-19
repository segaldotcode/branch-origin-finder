import { Analyzer } from "@/components/git/analyzer";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 space-y-8 px-4 py-10 sm:px-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Branch Origin Finder</h1>
        <p className="text-muted-foreground text-sm">
          Git does not store the parent branch of a branch. Run the CLI locally to infer it from
          merge-base analysis, reflog and upstream tracking, then paste the result below to
          explore it.
        </p>
      </header>

      <div className="bg-muted flex flex-col gap-1 rounded-lg border p-4 font-mono text-xs">
        <span className="text-muted-foreground"># run against the repository you want to analyze</span>
        <span>pnpm branch-origin &lt;branch-name&gt; --json</span>
      </div>

      <Analyzer />
    </main>
  );
}
