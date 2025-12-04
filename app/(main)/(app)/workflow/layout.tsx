"use client";

import { useEffect } from "react";
import { PanelsTopLeft, Wrench } from "lucide-react";

import { useMenu } from "@/components/sidebar/nav-main";

export default function WorkflowLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setMenu } = useMenu();

  useEffect(() => {
    setMenu(
      {
        navGroups: [
          {
            name: "workflow-id",
            items: [
              {
                title: "overview",
                url: "/workflow/123/overview",
                icon: PanelsTopLeft,
              },
              {
                title: "settings",
                url: "/workflow/123/settings",
                icon: Wrench,
              },
            ],
          },
        ],
      },
      2,
    );
  }, [setMenu]);

  return <>{children}</>;
}
