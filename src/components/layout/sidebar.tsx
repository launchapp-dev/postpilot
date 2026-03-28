"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Calendar,
  BarChart2,
  Link2,
  Megaphone,
  Settings,
  LogOut,
} from "lucide-react";
import { createAuthClient } from "better-auth/react";

const authClient = createAuthClient();

const primaryNav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/posts", label: "Posts", icon: FileText },
  { href: "/calendar", label: "Calendar", icon: Calendar },
  { href: "/analytics", label: "Analytics", icon: BarChart2 },
];

const secondaryNav = [
  { href: "/accounts", label: "Accounts", icon: Link2 },
  { href: "/campaigns", label: "Campaigns", icon: Megaphone },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    await authClient.signOut();
    router.push("/login");
  }

  function NavLink({
    href,
    label,
    icon: Icon,
  }: {
    href: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }) {
    const active = pathname === href || pathname.startsWith(href + "/");
    return (
      <Link
        href={href}
        className={cn(
          "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
          active
            ? "bg-accent text-accent-foreground"
            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        )}
      >
        <Icon className="h-4 w-4 shrink-0" />
        {label}
      </Link>
    );
  }

  return (
    <aside className="flex h-full w-56 shrink-0 flex-col border-r border-border bg-card px-3 py-6">
      <div className="mb-6 px-3">
        <span className="text-lg font-semibold tracking-tight">PostPilot</span>
      </div>

      <nav className="flex flex-col gap-1">
        {primaryNav.map((item) => (
          <NavLink key={item.href} {...item} />
        ))}
      </nav>

      <Separator className="my-4" />

      <nav className="flex flex-col gap-1">
        {secondaryNav.map((item) => (
          <NavLink key={item.href} {...item} />
        ))}
      </nav>

      <div className="mt-auto pt-4">
        <Separator className="mb-4" />
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
