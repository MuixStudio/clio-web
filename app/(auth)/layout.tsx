import "@ory/elements-react/theme/styles.css";
import { Suspense } from "react";

import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";

export default function LoginPage({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto h-screen w-full relative">
      <BackgroundBeamsWithCollision className="md:h-full">
        <Suspense fallback={<div>加载中。。。</div>}>{children}</Suspense>
      </BackgroundBeamsWithCollision>
    </div>
  );
}
