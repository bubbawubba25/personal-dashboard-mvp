import React from 'react'

export function AddWidgetModal({ onClose, onAdd }) {
  return (
    <div className="modal-backdrop">
      <div className="card modal">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 16px', borderBottom:'1px solid #1f2937'}}>
          <div style={{fontWeight:700}}>Add a Widget</div>
          <button className="btn secondary" onClick={onClose}>Close</button>
        </div>
        <div style={{padding:16, display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:12}}>
          <WidgetTile title="To‑Do" onClick={()=>onAdd('todo')} />
          <WidgetTile title="Notes" onClick={()=>onAdd('notes')} />
          <WidgetTile title="Calendar" onClick={()=>onAdd('calendar')} />
          <WidgetTile title="Website Embed" onClick={()=>onAdd('iframe')} />
        </div>
      </div>
    </div>
  )
}

function WidgetTile({ title, onClick }) {
  return (
    <div className="card" style={{padding:16, display:'flex', flexDirection:'column', gap:8}}>
      <div style={{fontWeight:600}}>{title}</div>
      <div style={{fontSize:14, opacity:0.8}}>
        {title === 'Website Embed' ? 'Paste any http(s) URL (some sites block embedding).' :
         title === 'Calendar' ? 'A simple monthly view.' :
         title === 'To‑Do' ? 'Quick checklist with persistence.' :
         'Rich text notes block.'}
      </div>
      <div style={{marginTop:'auto'}}>
        <button className="btn" onClick={onClick}>Add</button>
      </div>
    </div>
  )
}
