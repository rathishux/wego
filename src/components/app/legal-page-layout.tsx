import { ArrowLeft } from "lucide-react";
import type * as React from "react";

import type { PageId } from "@/components/app/nav-items";
import { Button } from "@/components/ui/button";

interface LegalPageLayoutProps {
  onNavigate: (page: PageId) => void;
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export function LegalPageLayout({ onNavigate, title, lastUpdated, children }: LegalPageLayoutProps) {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
      <Button variant="ghost" size="sm" className="w-fit gap-1.5" onClick={() => onNavigate("settings")}>
        <ArrowLeft className="size-4" /> Back
      </Button>

      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-muted-foreground text-sm">Last updated: {lastUpdated}</p>

      <div className="[&_h2]:mt-2 [&_h2]:text-base [&_h2]:font-semibold [&_p]:text-sm [&_p]:leading-relaxed [&_li]:text-sm [&_li]:leading-relaxed [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-5 flex flex-col gap-3">
        {children}
      </div>
    </div>
  );
}
