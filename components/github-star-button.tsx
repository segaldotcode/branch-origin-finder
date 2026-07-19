import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { REPO_URL } from "@/lib/github";

function formatStars(count: number): string {
  return count >= 1000 ? `${(count / 1000).toFixed(1)}k` : String(count);
}

export function GithubStarButton({ stars }: { stars: number | null }) {
  return (
    <Button
      variant="outline"
      nativeButton={false}
      data-cuelume-hover
      data-cuelume-press
      data-cuelume-release
      render={<a href={REPO_URL} target="_blank" rel="noopener noreferrer" />}
      aria-label="Star this repository on GitHub"
    >
      <Star className="fill-amber-400 text-amber-400" />
      {stars !== null && <span className="tabular-nums">{formatStars(stars)}</span>}
    </Button>
  );
}
