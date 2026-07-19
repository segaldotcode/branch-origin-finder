import { Analyzer } from "@/components/git/analyzer";
import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { getDictionary } from "@/lib/i18n";

interface HomeProps {
  searchParams: Promise<{ lang?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const locale = params.lang === "fr" ? "fr" : "en";
  const dict = getDictionary(locale);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 space-y-8 px-4 py-10 sm:px-6">
      <header className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">{dict.title}</h1>
          <p className="text-muted-foreground text-sm">{dict.subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LanguageToggle locale={locale} />
        </div>
      </header>

      <div className="bg-muted flex flex-col gap-1 rounded-lg border p-4 font-mono text-xs">
        <span className="text-muted-foreground"># {dict.cliHint}</span>
        <span>pnpm branch-origin &lt;branch-name&gt; --json</span>
      </div>

      <Analyzer dict={dict} />
    </main>
  );
}
