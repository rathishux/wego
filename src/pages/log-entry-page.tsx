import * as React from "react";
import { toast } from "sonner";

import { DoseForm } from "@/components/app/forms/dose-form";
import { FoodForm } from "@/components/app/forms/food-form";
import type { PageId } from "@/components/app/nav-items";
import { VitalsPanel } from "@/components/app/vitals-panel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { LogType } from "@/lib/types";

type UiTab = "dose" | "vitals" | "food";

function toUiTab(logType: LogType): UiTab {
  if (logType === "weight" || logType === "glucose") return "vitals";
  return logType;
}

interface LogEntryPageProps {
  initialTab: LogType;
  onNavigate: (page: PageId) => void;
}

export function LogEntryPage({ initialTab, onNavigate }: LogEntryPageProps) {
  const [tab, setTab] = React.useState<UiTab>(toUiTab(initialTab));

  React.useEffect(() => {
    setTab(toUiTab(initialTab));
  }, [initialTab]);

  function handleSaved() {
    toast("Saved — view it on the Progress timeline", {
      action: {
        label: "View progress",
        onClick: () => onNavigate("progress"),
      },
    });
  }

  return (
    <Tabs value={tab} onValueChange={(v) => setTab(v as UiTab)}>
      <TabsList className="mb-6 grid w-full grid-cols-3">
        <TabsTrigger value="dose">Dose</TabsTrigger>
        <TabsTrigger value="vitals">Weight & Glucose</TabsTrigger>
        <TabsTrigger value="food">Food</TabsTrigger>
      </TabsList>
      <TabsContent value="dose">
        <DoseForm onSaved={handleSaved} />
      </TabsContent>
      <TabsContent value="vitals">
        <VitalsPanel onSaved={handleSaved} />
      </TabsContent>
      <TabsContent value="food">
        <FoodForm onSaved={handleSaved} />
      </TabsContent>
    </Tabs>
  );
}
