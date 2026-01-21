"use client"

import { navItems } from "@/components/layout/nav-main"
import Link from "next/link"
import { usePathname } from "next/navigation"
import clsx from "clsx"

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-background">
      <div className="px-4 py-5 text-lg font-semibold">
        Testdel Panel
      </div>

      <nav className="flex-1 space-y-1 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-muted text-foreground font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
