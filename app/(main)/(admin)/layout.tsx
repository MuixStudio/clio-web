"use client";

import { useEffect } from "react";
import { House, Workflow } from "lucide-react";

import { useMenu } from "@/components/sidebar/nav-main";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { setMenu } = useMenu();

  useEffect(() => {
    setMenu(
      {
        navGroups: [
          {
            name: "Admin",
            items: [
              {
                title: "admin",
                url: "/admin",
                icon: House,
              },
              {
                title: "workflows",
                url: "/workflows",
                icon: Workflow,
              },
            ],
          },
          {
            name: "Admin",
            items: [
              {
                title: "admin",
                url: "/admin",
                icon: House,
              },
              {
                title: "workflows",
                url: "/workflows",
                icon: Workflow,
              },
            ],
          },
        ],
      },
      1,
    );
  }, [setMenu]);

  return <>{children}</>;
}
