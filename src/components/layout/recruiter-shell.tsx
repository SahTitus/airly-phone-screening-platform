"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BriefcaseBusiness, Menu, Plus, UserRound } from "lucide-react";
import { useState } from "react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { routes } from "@/config/routes";
import { cn } from "@/utils/cn";
import { BrandMark } from "./brand-mark";

const navItems = [
  { label: "Jobs", href: routes.jobs(), icon: BriefcaseBusiness },
  { label: "Create", href: routes.createScreening(), icon: Plus },
] as const;

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active =
          item.href === routes.jobs()
            ? pathname === item.href || /^\/jobs\/[^/]+/.test(pathname)
            : pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex h-12 items-center gap-3 rounded-lg px-4 text-[14px] font-medium transition-colors",
              active
                ? "bg-brand-primary-soft text-brand-primary"
                : "text-text-secondary hover:bg-bg-muted hover:text-text-primary",
            )}
          >
            <Icon className="h-5 w-5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function RecruiterShell({ children }: { children: ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg-page text-text-primary">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-59 border-r border-border-default bg-bg-surface px-5 py-7 lg:flex lg:flex-col">
        <BrandMark className="mb-14" />
        <SidebarNav />
        <div className="mt-auto rounded-lg border border-border-default bg-bg-subtle p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-primary text-sm font-semibold text-white">
              SR
            </div>
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold text-text-primary">
                Sarah Reed
              </p>
              <p className="text-[12px] text-text-muted">Recruiter</p>
            </div>
          </div>
        </div>
      </aside>

      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border-default bg-bg-surface px-3 sm:px-4 lg:hidden">
        <BrandMark />
        <Dialog open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <DialogTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              aria-label="Open menu"
              className="h-9 w-9 p-0"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent side="left" className="border-r border-border-default">
            <DialogHeader>
              <DialogTitle className="sr-only">Recruiter menu</DialogTitle>
              <BrandMark />
            </DialogHeader>
            <SidebarNav onNavigate={() => setMobileMenuOpen(false)} />
            <div className="mt-8 flex items-center gap-3 rounded-lg border border-border-default bg-bg-subtle p-4">
              <UserRound className="h-5 w-5 text-brand-primary" />
              <div>
                <p className="text-[13px] font-semibold text-text-primary">
                  Sarah Reed
                </p>
                <p className="text-[12px] text-text-muted">Recruiter</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </header>

      <main className="px-3 py-6 sm:px-4 lg:ml-59 lg:px-6 lg:py-8">
        <div className="mx-auto max-w-300">{children}</div>
      </main>
    </div>
  );
}
