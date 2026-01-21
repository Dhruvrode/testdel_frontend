import {
  BarChart3,
  LayoutDashboard,
} from "lucide-react"

export interface NavItem {
  title: string
  href: string
  icon: React.ElementType
}

export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Customers",
    href: "/customers",
    icon: BarChart3,
  },
]
