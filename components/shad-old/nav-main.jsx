"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function NavMain({ items, isCollapsed }) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState({});
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  const toggleSection = (title) => {
    setOpen((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <div className="space-y-2 pt-4">
      {items.map((item) => {
        if (!item.items) {
          // Item tanpa submenu
          return (
            <Link
              key={item.title}
              href={item.url}
              className={cn(
                "hover:bg-accent hover:text-accent-foreground flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm",
                mounted && pathname === item.url && "bg-accent text-accent-foreground",
                isCollapsed ? "justify-center px-2 py-2" : "gap-2 px-3 py-2"
              )}
            >
              {item.icon && <item.icon className="h-4 w-4" />}
              {!isCollapsed && <span>{item.title}</span>}
            </Link>
          );
        }

        // Jika ada submenu:
        if (isCollapsed) {
          // === Mode COLLAPSED: tampilkan popover saat hover ===
          return (
            <Popover key={item.title}>
              <PopoverTrigger asChild>
                <button
                  className={cn(
                    "hover:bg-accent hover:text-accent-foreground flex w-full items-center justify-center gap-2 rounded-md px-3 py-2 text-sm"
                  )}
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                </button>
              </PopoverTrigger>
              <PopoverContent side="right" align="start" className="w-48 p-2">
                <div className="flex flex-col space-y-1">
                  {item.items.map((sub) => (
                    <Link
                      key={sub.title}
                      href={sub.url}
                      className={cn(
                        "hover:bg-accent hover:text-accent-foreground rounded-md px-2 py-1.5 text-sm",
                        pathname === sub.url && "bg-accent text-accent-foreground"
                      )}
                    >
                      {sub.title}
                    </Link>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          );
        }

        // === Mode EXPANDED: gunakan collapsible normal ===
        return (
          <Collapsible
            key={item.title}
            open={open[item.title]}
            onOpenChange={() => toggleSection(item.title)}
          >
            <div
              className={cn(
                "hover:text-accent-foreground flex items-center justify-between rounded-md px-3 py-2 text-sm",
                mounted && pathname === item.url && "bg-accent text-accent-foreground"
              )}
            >
              <Link href={item.url || "#"} className="flex flex-1 items-center gap-2">
                {item.icon && <item.icon className="h-4 w-4" />}
                <span>{item.title}</span>
              </Link>
              <CollapsibleTrigger asChild>
                <button className="ml-2">
                  <ChevronDown
                    className={cn("h-4 w-4 transition-transform", open[item.title] && "rotate-180")}
                  />
                </button>
              </CollapsibleTrigger>
            </div>

            <CollapsibleContent className="pl-6">
              <div className="flex flex-col space-y-1">
                {item.items.map((sub) => (
                  <Link
                    key={sub.title}
                    href={sub.url}
                    className={cn(
                      "hover:bg-accent hover:text-accent-foreground rounded-md px-3 py-1.5 text-sm",
                      pathname === sub.url && "bg-accent text-accent-foreground"
                    )}
                  >
                    {sub.title}
                  </Link>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        );
      })}
    </div>
  );
}
