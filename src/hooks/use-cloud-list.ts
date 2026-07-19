import * as React from "react";

import { useAuth } from "@/hooks/use-auth";
import { getSupabase } from "@/lib/supabase";

type EntryTableType = "dose" | "weight" | "glucose" | "food" | "progress_photo" | "you_post";

interface CloudListResult<T> {
  list: T[];
  add: (entry: T) => void;
  remove: (id: string) => void;
  update: (id: string, patch: Partial<T>) => void;
  loading: boolean;
  error: string | null;
}

export function useCloudList<T extends { id: string; date?: string; createdAt: number }>(
  type: EntryTableType,
): CloudListResult<T> {
  const { user } = useAuth();
  const [list, setList] = React.useState<T[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const reload = React.useCallback(async () => {
    if (!user) {
      setList([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    const supabase = getSupabase();
    const { data, error: fetchError } = await supabase
      .from("entries")
      .select("data")
      .eq("user_id", user.id)
      .eq("type", type);

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setList((data ?? []).map((row) => row.data as T));
    }
    setLoading(false);
  }, [user, type]);

  React.useEffect(() => {
    reload();
  }, [reload]);

  const add = React.useCallback(
    (entry: T) => {
      if (!user) return;
      setList((prev) => [...prev, entry]);
      const supabase = getSupabase();
      supabase
        .from("entries")
        .insert({
          id: entry.id,
          user_id: user.id,
          type,
          created_at: entry.createdAt,
          date: entry.date ?? null,
          data: entry,
        })
        .then(({ error: insertError }) => {
          if (insertError) {
            setError(insertError.message);
            setList((prev) => prev.filter((e) => e.id !== entry.id));
          }
        });
    },
    [user, type],
  );

  const remove = React.useCallback(
    (id: string) => {
      if (!user) return;
      const prev = list;
      setList((p) => p.filter((e) => e.id !== id));
      const supabase = getSupabase();
      supabase
        .from("entries")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id)
        .then(({ error: deleteError }) => {
          if (deleteError) {
            setError(deleteError.message);
            setList(prev);
          }
        });
    },
    [user, list],
  );

  const update = React.useCallback(
    (id: string, patch: Partial<T>) => {
      if (!user) return;
      const prev = list;
      let merged: T | undefined;
      setList((p) =>
        p.map((e) => {
          if (e.id !== id) return e;
          merged = { ...e, ...patch };
          return merged;
        }),
      );
      if (!merged) return;
      const supabase = getSupabase();
      supabase
        .from("entries")
        .update({ data: merged })
        .eq("id", id)
        .eq("user_id", user.id)
        .then(({ error: updateError }) => {
          if (updateError) {
            setError(updateError.message);
            setList(prev);
          }
        });
    },
    [user, list],
  );

  return { list, add, remove, update, loading, error };
}
