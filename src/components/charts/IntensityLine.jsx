import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

/* Split out of EmotionModule so recharts loads on demand, not at first paint. */
export default function IntensityLine({ data }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: -18 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#efebe3" />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
        <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} />
        <Tooltip />
        <Line type="monotone" dataKey="intensity" stroke="#dca6d6" strokeWidth={3} dot={{ r: 5, fill: '#dca6d6' }} />
      </LineChart>
    </ResponsiveContainer>
  )
}
