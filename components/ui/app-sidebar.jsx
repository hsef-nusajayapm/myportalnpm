"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bot, SquareTerminal } from "lucide-react";

import { NavMain } from "@/components/shad-old/nav-main";
import { NavUser } from "@/components/shad-old/nav-user";
import { TeamSwitcher } from "@/components/shad-old/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

export function AppSidebar(props) {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem("isLoggedIn");
    const email = sessionStorage.getItem("userEmail");

    if (!isLoggedIn || !email) {
      router.push("/");
      return;
    }

    setUser({
      name: email.split("@")[0],
      email,
      avatar: "",
    });
  }, [router]);

  const handleLogout = () => {
    sessionStorage.clear();
    router.push("/");
  };

  const navMain = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: SquareTerminal,
      isActive: true,
      items: [
        { title: "Data Forecast", url: "/dashboard/dataforecast" },
        { title: "Table Data", url: "/dashboard/datatable" },
      ],
    },
    {
      title: "Forms",
      icon: Bot,
      items: [
        { title: "Mine Permit & SIMPER", url: "/dashboard/mine-permit" },
        { title: "Commissioning", url: "/dashboard/commissioning" },
        { title: "Visitor & Temporary Work", url: "/dashboard/visitor" },
        { title: "Escort", url: "/dashboard/escort" },
      ],
    },
  ];

  const teams = [
    {
      name: "PORTAL NPM",
      logo: "/img/cricleNPM-01.svg",
      plan: "Entreprise",
    },
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      {/* Header */}
      <SidebarHeader>
        <TeamSwitcher teams={teams} />
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>

      {/* Footer: User Info */}
      <SidebarFooter>{user && <NavUser user={user} onLogout={handleLogout} />}</SidebarFooter>

      {/* Rail untuk mode collapse */}
      <SidebarRail />
    </Sidebar>
  );
}
