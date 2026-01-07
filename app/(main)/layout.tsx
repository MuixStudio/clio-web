import { SessionProvider } from "@ory/elements-react/client";

import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { MenuProvider } from "@/components/sidebar/nav-main";
import { AppContextProvider } from "@/contexts/app-context";
import { Navbar } from "@/components/navbar/navbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const baseUrl = `${process.env.NEXT_PUBLIC_ORY_SDK_URL}`;

  return (
    <SessionProvider baseUrl={baseUrl}>
      <div className="flex flex-col h-screen">
        <Navbar />
        <div className="flex-1 overflow-auto">
          <div className="h-full">
            <AppContextProvider>
              <SidebarProvider className="h-full">
                <MenuProvider>
                  <AppSidebar />
                  <SidebarInset className="h-full">
                    {/*header*/}
                    <header className="sticky top-0 z-50 flex h-12 shrink-0 items-center border-b border-border gap-2 transition-width ease-linear bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                      <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                          className="mr-2 h-4"
                          orientation="vertical"
                        />
                      </div>
                    </header>
                    {/*main content*/}
                    <div className="h-full overflow-y-auto">
                      {/*inner box*/}
                      <div className="max-w-[1448px] mx-auto p-6">
                        <div className=" w-full">{children}</div>
                      </div>
                    </div>
                  </SidebarInset>
                </MenuProvider>
              </SidebarProvider>
            </AppContextProvider>
          </div>
        </div>
      </div>
    </SessionProvider>
  );
}
