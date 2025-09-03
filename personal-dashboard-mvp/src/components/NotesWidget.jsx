import React, { useEffect, useState } from 'react'

export function NotesWidget({ value = '', onChange }) {
  const [text, setText] = useState(value)

  useEffect(()=>{ onChange(text) }, [text])

  return (
    <textarea
      value={text}
      onChange={(e)=>setText(e.target.value)}
      placeholder="Write notes here..."
      style={{width:'100%', height:'100%', resize:'none', background:'#0b1220', color:'#e2e8f0', border:'1px solid #334155', borderRadius:12, padding:12}}
    />
  )
}
