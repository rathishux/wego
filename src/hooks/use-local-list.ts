import { useCallback, useState } from "react";

import { loadList, saveList } from "@/lib/storage";

export function useLocalList<T extends { id: string }>(key: string) {
  const [list, setList] = useState<T[]>(() => loadList<T>(key));

  const add = useCallback(
    (entry: T) => {
      setList((prev) => {
        const next = [...prev, entry];
        if (!saveList(key, next)) return prev;
        return next;
      });
    },
    [key],
  );

  const remove = useCallback(
    (id: string) => {
      setList((prev) => {
        const next = prev.filter((item) => item.id !== id);
        if (!saveList(key, next)) return prev;
        return next;
      });
    },
    [key],
  );

  const update = useCallback(
    (id: string, patch: Partial<T>) => {
      setList((prev) => {
        const next = prev.map((item) => (item.id === id ? { ...item, ...patch } : item));
        if (!saveList(key, next)) return prev;
        return next;
      });
    },
    [key],
  );

  return { list, add, remove, update };
}
