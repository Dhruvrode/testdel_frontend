"use client";

import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EditableLabel from "@/app/labels/EditableLabel";

type CountersProps = {
  labelKey: string;
  value: string | number;
  icon: ReactNode;
  subtitle?: string;
};

export default function Counters({
  labelKey,
  value,
  icon,
  subtitle,
}: CountersProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">
          <EditableLabel labelKey={labelKey} />
        </CardTitle>
        {icon}
      </CardHeader>

      <CardContent>
        <div className="text-3xl font-semibold tracking-tight">
          {value}
        </div>

        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
}
