import { Analyzer } from "@/components/git/analyzer";
import { CliCommand } from "@/components/git/cli-command";
import { GithubStarButton } from "@/components/github-star-button";
import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { getDictionary } from "@/lib/i18n";
import { getRepoStars } from "@/lib/github";

interface HomeProps {
  searchParams: Promise<{ lang?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const locale = params.lang === "fr" ? "fr" : "en";
  const dict = getDictionary(locale);
  const stars = await getRepoStars();

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 space-y-8 px-4 py-10 sm:px-6">
      <header className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">{dict.title}</h1>
          <p className="text-muted-foreground text-sm">{dict.subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <GithubStarButton stars={stars} />
          <ThemeToggle />
          <LanguageToggle locale={locale} />
        </div>
      </header>

      <div className="flex flex-col gap-1.5">
        <span className="text-muted-foreground text-xs"># {dict.cliHint}</span>
        <CliCommand dict={dict} />
      </div>

      <Analyzer dict={dict} />
    </main>
  );
}
