 "use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export type LabelUsage = {
  page: string;
  component: string;
};

export type Label = {
  key: string;
  value: string;
  usages: LabelUsage[];
};

type LabelsState = Record<string, Label>;

type LabelsContextType = {
  labels: LabelsState;
  updateLabel: (key: string, value: string) => Promise<void>;
  loading: boolean;
};

const LabelsContext = createContext<LabelsContextType | null>(null);

export function LabelProvider({ children }: { children: React.ReactNode }) {
  const [labels, setLabels] = useState<LabelsState>({});
  const [loading, setLoading] = useState(true);

  // Fetch labels on app start
  useEffect(() => {
    async function fetchLabels() {
      const res = await fetch("/api/labels", {
        cache: "no-store",
      });
      const data: Label[] = await res.json();

      const mapped = Object.fromEntries(data.map((l) => [l.key, l]));
      setLabels(mapped);
      setLoading(false);
    }

    fetchLabels();
  }, []);

  

  // Update label (REAL-TIME + persistence)
  async function updateLabel(key: string, value: string) {
    // optimistic update
    setLabels((prev) => ({
      ...prev,
      [key]: { ...prev[key], value },
    }));

    await fetch(`/api/labels/${key}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value }),
    });
  }

  return (
    <LabelsContext.Provider value={{ labels, updateLabel, loading }}>
      {children}
       <ToastContainer
          position="top-right"
          autoClose={2500}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          theme="light"
        />
    </LabelsContext.Provider>
  );
}

export function useLabels() {
  const ctx = useContext(LabelsContext);
  if (!ctx) throw new Error("useLabels must be used inside LabelsProvider");
  return ctx;
}
