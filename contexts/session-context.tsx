// "use client";
//
// import React, { createContext } from "react";
// import { SessionContextData, useSession } from "@ory/elements-react/client";
//
// const SessionContext = createContext<SessionContextData | null>(null);
//
// export function TenantProvider({ children }: { children: React.ReactNode }) {
//   const session = useSession();
//
//   if (session?.session.active) {
//   }
//
//   return (
//     <SessionContext.Provider value={session}>
//       {children}
//     </SessionContext.Provider>
//   );
// }
