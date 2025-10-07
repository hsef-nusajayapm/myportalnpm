"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

export function NavMain({ items }) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState({});
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const toggleSection = (title) => {
    setOpen((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <div className="space-y-2 pt-4">
      {items.map((item) =>
        item.items ? (
          <Collapsible
            key={item.title}
            open={open[item.title]}
            onOpenChange={() => toggleSection(item.title)}
          >
            <CollapsibleTrigger className="hover:bg-accent hover:text-accent-foreground flex w-full items-center justify-between rounded-md px-3 py-2 text-sm">
              <div className="flex items-center gap-2">
                {item.icon && <item.icon className="h-4 w-4" />}
                {/* hide text if sidebar collapsed */}
                <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
              </div>
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform group-data-[collapsible=icon]:hidden",
                  open[item.title] && "rotate-180"
                )}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-6">
              <div className="flex flex-col space-y-1">
                {item.items.map((sub) => (
                  <Link
                    key={sub.title}
                    href={sub.url}
                    className={cn(
                      "hover:bg-accent hover:text-accent-foreground rounded-md px-3 py-1.5 text-sm group-data-[collapsible=icon]:hidden",
                      mounted && pathname === sub.url && "bg-accent text-accent-foreground"
                    )}
                  >
                    {sub.title}
                  </Link>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        ) : (
          <Link
            key={item.title}
            href={item.url}
            className={cn(
              "hover:bg-accent hover:text-accent-foreground flex items-center gap-2 rounded-md px-3 py-2 text-sm",
              mounted && pathname === item.url && "bg-accent text-accent-foreground"
            )}
          >
            {item.icon && <item.icon className="h-4 w-4" />}
            {/* hide text if sidebar collapsed */}
            <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
          </Link>
        )
      )}
    </div>
  );
}
