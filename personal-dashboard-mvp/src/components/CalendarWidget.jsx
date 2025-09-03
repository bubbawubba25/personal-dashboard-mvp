import React, { useMemo } from 'react'

function buildMonth(year, month) {
  // month is 0-based; returns array of weeks, each week is an array of 7 days or null
  const first = new Date(year, month, 1)
  const last = new Date(year, month + 1, 0)
  const startDay = first.getDay() // 0-6
  const total = last.getDate()
  const days = [...Array(total)].map((_,i)=> new Date(year, month, i+1))
  const padded = [...Array(startDay).fill(null), ...days]
  while (padded.length % 7 !== 0) padded.push(null)
  const weeks = []
  for (let i=0;i<padded.length;i+=7) weeks.push(padded.slice(i,i+7))
  return weeks
}

export function CalendarWidget() {
  const now = new Date()
  const y = now.getFullYear(), m = now.getMonth()
  const weeks = useMemo(()=> buildMonth(y, m), [y, m])

  return (
    <div style={{display:'flex', flexDirection:'column', height:'100%'}}>
      <div style={{display:'flex', justifyContent:'space-between', marginBottom:8}}>
        <div style={{fontWeight:700}}>
          {now.toLocaleString(undefined, { month: 'long' })} {y}
        </div>
        <div>{now.toLocaleDateString()}</div>
      </div>
      <div style={{display:'grid', gridTemplateColumns:'repeat(7, 1fr)', gap:6, fontSize:12, opacity:0.8}}>
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => <div key={d} style={{textAlign:'center'}}>{d}</div>)}
      </div>
      <div style={{display:'grid', gridTemplateColumns:'repeat(7, 1fr)', gap:6, marginTop:6, overflow:'auto'}}>
        {weeks.flat().map((d, idx) => (
          <div key={idx} className="card" style={{padding:8, minHeight:64}}>
            <div style={{opacity:0.8, fontSize:12}}>{d ? d.getDate() : ''}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
