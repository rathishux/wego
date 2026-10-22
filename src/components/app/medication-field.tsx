import * as React from "react";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MEDICATION_OPTIONS } from "@/lib/types";

const KNOWN_MEDICATIONS = MEDICATION_OPTIONS.filter((opt) => opt !== "Other") as readonly string[];

interface MedicationFieldProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
}

export function MedicationField({ value, onChange, id = "medication-select" }: MedicationFieldProps) {
  const [customMedication, setCustomMedication] = React.useState(
    () => value !== "" && !KNOWN_MEDICATIONS.includes(value),
  );

  const selectValue = customMedication ? "Other" : value ? value : undefined;

  function handleSelect(next: string) {
    if (next !== "Other") {
      setCustomMedication(false);
      onChange(next);
      return;
    }
    setCustomMedication(true);
    if (KNOWN_MEDICATIONS.includes(value)) onChange("");
  }

  return (
    <div className="space-y-1.5">
      <Select value={selectValue} onValueChange={handleSelect}>
        <SelectTrigger id={id} className="w-full">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          {MEDICATION_OPTIONS.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectValue === "Other" && (
        <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="Enter medication name" />
      )}
    </div>
  );
}
