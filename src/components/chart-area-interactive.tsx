import * as React from "react"
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { containers } from "@/data/at21-data"
import { AT21_SECTION_LABELS } from "@/data/at21-data"

const sectionCounts = [
  { section: "not-routed", label: "Not Routed", count: 0, color: "#f59e0b" },
  { section: "do-not-sent", label: "D/O Not Sent", count: 0, color: "#ef4444" },
  { section: "lfd-not-updated", label: "LFD Not Updated", count: 0, color: "#f97316" },
  { section: "not-picked-up", label: "Not Picked Up", count: 0, color: "#8b5cf6" },
  { section: "not-returned", label: "Not Returned", count: 0, color: "#3b82f6" },
  { section: "receiving-pending", label: "Recv Pending", count: 0, color: "#06b6d4" },
]

for (const c of containers) {
  const entry = sectionCounts.find((s) => s.section === c.section)
  if (entry) entry.count++
}

export function ChartAreaInteractive() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Inbound Pipeline — Container Distribution</CardTitle>
        <CardDescription>
          Containers at each stage of the AT21 inbound pipeline (March 25, 2026)
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sectionCounts} margin={{ top: 5, right: 20, left: 0, bottom: 60 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                angle={-35}
                textAnchor="end"
                fontSize={12}
                interval={0}
              />
              <YAxis tickLine={false} axisLine={false} fontSize={12} />
              <Tooltip
                formatter={(value: number) => [`${value} containers`, "Count"]}
                contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {sectionCounts.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
