import React from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

/* Split out of Dashboard so recharts loads on demand, not at first paint. */
export default function WeeklyBars({ data }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: -24 }}>
        <XAxis dataKey="name" tick={{ fontSize: 13 }} />
        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
        <Tooltip cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
        <Bar dataKey="count" radius={[8, 8, 0, 0]}>
          {data.map((d, i) => <Cell key={i} fill="#dca6d6" />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
