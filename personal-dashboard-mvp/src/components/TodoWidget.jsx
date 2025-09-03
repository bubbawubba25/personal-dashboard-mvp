import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

export function TodoWidget({ value = [], onChange }) {
  const [items, setItems] = useState(value)

  const addItem = () => {
    const text = prompt('New task:')
    if (!text) return
    const next = [...items, { id: uuidv4(), text, done: false }]
    setItems(next); onChange(next)
  }

  const toggle = (id) => {
    const next = items.map(i => i.id === id ? { ...i, done: !i.done } : i)
    setItems(next); onChange(next)
  }

  const remove = (id) => {
    const next = items.filter(i => i.id !== id)
    setItems(next); onChange(next)
  }

  return (
    <div style={{display:'flex', flexDirection:'column', gap:8, height:'100%'}}>
      <div style={{display:'flex', gap:8}}>
        <button className="btn" onClick={addItem}>+ Add Task</button>
      </div>
      <div style={{overflow:'auto'}}>
        {items.length === 0 && <div>No tasks yet.</div>}
        {items.map(i => (
          <div key={i.id} style={{display:'flex', alignItems:'center', gap:8, padding:'6px 0'}}>
            <input type="checkbox" checked={i.done} onChange={()=>toggle(i.id)} />
            <div style={{textDecoration: i.done ? 'line-through' : 'none'}}>{i.text}</div>
            <div style={{marginLeft:'auto'}}>
              <button className="btn danger" style={{padding:'4px 8px'}} onClick={()=>remove(i.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
