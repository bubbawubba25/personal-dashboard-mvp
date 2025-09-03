import React from 'react'

export function Tabs({ pages, currentId, onSelect, onRename, onDelete }) {
  return (
    <div className="tabs" style={{margin:'0 0 10px'}}>
      {pages.map(p => (
        <div key={p.id} className={"tab " + (p.id===currentId?'active':'')} onClick={()=>onSelect(p.id)}>
          <span>{p.name}</span>
          <span style={{marginLeft:8, opacity:0.8}}>
            <button className="btn secondary" style={{padding:'4px 8px', marginRight:6}} onClick={(e)=>{e.stopPropagation(); onRename(p.id)}}>Rename</button>
            <button className="btn danger" style={{padding:'4px 8px'}} onClick={(e)=>{e.stopPropagation(); onDelete(p.id)}}>Delete</button>
          </span>
        </div>
      ))}
    </div>
  )
}
