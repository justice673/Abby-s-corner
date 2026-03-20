"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { LayoutDashboard, Package, Tags, FileText, ShoppingCart, Menu } from "lucide-react";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { SidebarProfile } from "./SidebarProfile";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/orders", label: "Orders", icon: ShoppingCart },
  { href: "/dashboard/products", label: "Products", icon: Package },
  { href: "/dashboard/categories", label: "Categories", icon: Tags },
  { href: "/dashboard/blog", label: "Blog", icon: FileText },
  { href: "/dashboard/navigation", label: "Navigation", icon: Menu },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) {
      return pathname === href;
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  const user = session?.user || { name: "User", email: "" };
  return (
    <SidebarProvider className="bg-(--brand-light)">
      <Sidebar collapsible="icon" className="bg-white text-(--brand-primary)">
        <SidebarHeader className="group-data-[collapsible=icon]:items-center">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-(--brand-primary) text-xs font-bold text-white">
              AC
            </div>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <span className="text-xs font-semibold tracking-[0.15em] uppercase text-(--brand-primary)/60">
                Abby&apos;s Corner
              </span>
              <span className="text-sm font-semibold text-(--brand-primary)">
                Store dashboard
              </span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href, item.exact);
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    className={
                      active
                        ? "bg-(--brand-primary) text-white hover:bg-(--brand-primary)/90 hover:text-white"
                        : "text-(--brand-primary)/70 hover:bg-(--brand-primary)/5 hover:text-(--brand-primary)"
                    }
                  >
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarProfile
            user={{
              name: user.name || "User",
              email: user.email || "",
              avatar: user.image,
            }}
          />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="bg-(--brand-light) text-(--brand-primary)">
        <header className="flex h-14 items-center justify-between border-b bg-white/95 px-4 text-(--brand-primary) backdrop-blur">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="h-5" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-(--brand-primary)/80">
                    Dashboard
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-black/10 bg-white text-(--brand-primary) hover:bg-black hover:text-white"
            >
              Preview store
            </Button>
          </div>
        </header>
        <main className="flex-1 px-4 py-6">
          <div className="space-y-6">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

