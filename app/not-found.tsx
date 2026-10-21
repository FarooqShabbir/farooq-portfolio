import { Nav } from "@/components/nav";

export default function NotFound() {
  return (
    <>
      <Nav />
      <main id="main" className="mx-auto flex min-h-[80vh] max-w-[1200px] flex-col items-start justify-center px-4 sm:px-6">
        <p className="font-mono text-[13px] text-ink-subtle">404 · route not found</p>
        <h1 className="display-lg mt-4">This page didn&apos;t make it to production.</h1>
        <a href="/" className="btn btn-primary mt-8">
          Back to the homepage
        </a>
      </main>
    </>
  );
}
