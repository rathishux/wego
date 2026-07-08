import * as React from "react";
import { toast } from "sonner";

import { DoseForm } from "@/components/app/forms/dose-form";
import { FoodForm } from "@/components/app/forms/food-form";
import { GlucoseForm } from "@/components/app/forms/glucose-form";
import { WeightForm } from "@/components/app/forms/weight-form";
import type { PageId } from "@/components/app/nav-items";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { LogType } from "@/lib/types";

interface LogEntryPageProps {
  initialTab: LogType;
  onNavigate: (page: PageId) => void;
}

export function LogEntryPage({ initialTab, onNavigate }: LogEntryPageProps) {
  const [tab, setTab] = React.useState<LogType>(initialTab);

  React.useEffect(() => {
    setTab(initialTab);
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
    <Tabs value={tab} onValueChange={(v) => setTab(v as LogType)}>
      <TabsList className="mb-6 grid w-full grid-cols-4">
        <TabsTrigger value="dose">Dose</TabsTrigger>
        <TabsTrigger value="weight">Weight</TabsTrigger>
        <TabsTrigger value="glucose">Glucose</TabsTrigger>
        <TabsTrigger value="food">Food</TabsTrigger>
      </TabsList>
      <TabsContent value="dose">
        <DoseForm onSaved={handleSaved} />
      </TabsContent>
      <TabsContent value="weight">
        <WeightForm onSaved={handleSaved} />
      </TabsContent>
      <TabsContent value="glucose">
        <GlucoseForm onSaved={handleSaved} />
      </TabsContent>
      <TabsContent value="food">
        <FoodForm onSaved={handleSaved} />
      </TabsContent>
    </Tabs>
  );
}
