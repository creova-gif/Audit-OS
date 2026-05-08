import React from "react";
import { Sidebar } from "./sidebar";

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-auto flex flex-col">
        <header className="h-16 border-b bg-card flex items-center px-8 shadow-sm shrink-0">
          <h2 className="font-semibold text-lg text-foreground">Workspace</h2>
        </header>
        <div className="p-8 flex-1 overflow-auto">
          <div className="max-w-6xl mx-auto w-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
