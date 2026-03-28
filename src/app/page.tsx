import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-4xl font-bold">PostPilot</h1>
      <p className="text-muted-foreground text-lg">AI-native social media automation</p>
      <div className="flex gap-4">
        <Link
          href="/login"
          className="rounded-md bg-primary px-6 py-2 text-primary-foreground hover:opacity-90"
        >
          Sign in
        </Link>
        <Link
          href="/signup"
          className="rounded-md border border-border px-6 py-2 hover:bg-accent"
        >
          Sign up
        </Link>
      </div>
    </main>
  );
}
