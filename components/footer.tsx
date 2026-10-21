import { profile } from "@/content/profile";
import { BrandMark } from "./nav";

export function Footer() {
  return (
    <footer className="border-t border-hairline">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-6 px-4 py-12 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-3">
          <BrandMark size={24} />
          <div>
            <p className="text-[14px] font-medium">{profile.name}</p>
            <p className="text-[12px] text-ink-tertiary">
              {profile.role} · {profile.roleTag}
            </p>
          </div>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-ink-subtle">
          {["work", "experience", "services", "stack", "about", "contact"].map((id) => (
            <a key={id} href={`#${id}`} className="capitalize transition-colors hover:text-ink">
              {id}
            </a>
          ))}
        </nav>
        <div className="flex flex-col gap-1 text-[12px] text-ink-tertiary sm:items-end">
          <a href={`mailto:${profile.email}`} className="text-ink-subtle transition-colors hover:text-ink">
            {profile.email}
          </a>
          <p>© {new Date().getFullYear()} {profile.name}</p>
        </div>
      </div>
    </footer>
  );
}
