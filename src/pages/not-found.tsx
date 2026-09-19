import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-2xl font-semibold text-foreground">Page not found</h1>
      <p className="text-sm text-muted-foreground">
        That page doesn&rsquo;t exist.
      </p>
      <Link to="/" className="text-accent-text underline underline-offset-4">
        Back to Today&rsquo;s Weather
      </Link>
    </main>
  );
}
