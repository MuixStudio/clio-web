import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { MenuProvider } from "@/components/sidebar/nav-main";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider className="h-full">
      <MenuProvider>
        <AppSidebar />
        <SidebarInset className="h-full">
          <header className="sticky top-0 z-50 flex h-12 shrink-0 items-center border-b border-border gap-2 transition-width ease-linear bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator className="mr-2 h-4" orientation="vertical" />
            </div>
          </header>
          <div className="flex-1 overflow-hidden h-full">
            <div className="h-full overflow-y-auto p-4 pt-0">{children}</div>
          </div>
        </SidebarInset>
      </MenuProvider>
    </SidebarProvider>
  );
}
