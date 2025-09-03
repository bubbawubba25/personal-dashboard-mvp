import React, { useEffect, useMemo, useState } from 'react'
import GridLayout from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import { v4 as uuidv4 } from 'uuid'
import { Tabs } from './components/Tabs.jsx'
import { AddWidgetModal } from './components/AddWidgetModal.jsx'
import { TodoWidget } from './components/TodoWidget.jsx'
import { NotesWidget } from './components/NotesWidget.jsx'
import { WidgetFrame } from './components/WidgetFrame.jsx'
import { CalendarWidget } from './components/CalendarWidget.jsx'
import { loadState, saveState } from './lib/storage.js'

const DEFAULT_LAYOUT = [
  // This is empty by default; widgets decide their own positions when added
]

const WIDGET_DEFAULT_SIZES = {
  todo: { w: 4, h: 6 },
  notes: { w: 4, h: 6 },
  calendar: { w: 6, h: 7 },
  iframe: { w: 6, h: 8 }
}

const WidgetChrome = ({ title, onRemove, onEdit, children }) => (
  <div className="card" style={{height:'100%', display:'flex', flexDirection:'column'}}>
    <div className="widget-chrome">
      <div className="widget-title">{title}</div>
      <div style={{display:'flex', gap:8}}>
        {onEdit && <button className="btn secondary" onClick={onEdit}>Edit</button>}
        <button className="btn danger" onClick={onRemove}>Remove</button>
      </div>
    </div>
    <div className="widget-body" style={{flex:1, minHeight:0}}>
      {children}
    </div>
  </div>
)

const WidgetRenderer = ({ widget, onUpdate, onRemove }) => {
  if (widget.type === 'todo') {
    return (
      <WidgetChrome title="To‑Do" onRemove={onRemove}>
        <TodoWidget value={widget.config?.items || []} onChange={(items)=>onUpdate({ ...widget, config: { ...widget.config, items } })} />
      </WidgetChrome>
    )
  }
  if (widget.type === 'notes') {
    return (
      <WidgetChrome title="Notes" onRemove={onRemove}>
        <NotesWidget value={widget.config?.text || ''} onChange={(text)=>onUpdate({ ...widget, config: { ...widget.config, text } })} />
      </WidgetChrome>
    )
  }
  if (widget.type === 'calendar') {
    return (
      <WidgetChrome title="Calendar" onRemove={onRemove}>
        <CalendarWidget />
      </WidgetChrome>
    )
  }
  if (widget.type === 'iframe') {
    const url = widget.config?.url || ''
    const blocked = url && !/^https?:\/\//.test(url)
    return (
      <WidgetChrome title={url ? `Embed: ${url}` : 'Website Embed'} onRemove={onRemove} onEdit={()=>{
        const u = prompt('Paste a URL to embed (must start with http:// or https://):', url || '')
        if (u !== null) onUpdate({ ...widget, config: { ...widget.config, url: u.trim() } })
      }}>
        {!url ? <div>Click Edit to set a URL.</div> :
          blocked ? <div>Invalid URL. Must begin with http(s).</div> :
          <iframe title={url} src={url} style={{border:0, width:'100%', height:'100%'}} sandbox="allow-scripts allow-same-origin allow-forms allow-popups"></iframe>
        }
        <div style={{marginTop:8, fontSize:12, opacity:0.8}}>
          Note: Some sites (like Gmail) block embedding in iframes. If you see a blank area, the site likely disallows embeds.
        </div>
      </WidgetChrome>
    )
  }
  return <div>Unknown widget</div>
}

export default function App() {
  const [state, setState] = useState(()=> loadState() || {
    pages: [
      { id: uuidv4(), name: 'Main', widgets: [], layout: DEFAULT_LAYOUT }
    ],
    currentPageId: null,
  })

  useEffect(()=>{
    if (!state.currentPageId && state.pages.length) {
      setState(s=> ({ ...s, currentPageId: s.pages[0].id }))
    }
  }, [state.currentPageId, state.pages.length])

  useEffect(()=>{ saveState(state) }, [state])

  const currentPage = useMemo(()=> state.pages.find(p=>p.id === state.currentPageId), [state])

  const [showAdd, setShowAdd] = useState(false)

  const addWidget = (type) => {
    if (!currentPage) return
    const id = uuidv4()
    const { w, h } = WIDGET_DEFAULT_SIZES[type] || { w: 4, h: 4 }
    const next = {
      ...state,
      pages: state.pages.map(p => p.id === currentPage.id ? ({
        ...p,
        widgets: [...p.widgets, { id, type, config: {} }],
        layout: [...p.layout, { i: id, x: 0, y: Infinity, w, h, minW: 2, minH: 3 }]
      }) : p)
    }
    setState(next)
    setShowAdd(false)
  }

  const removeWidget = (id) => {
    if (!currentPage) return
    const next = {
      ...state,
      pages: state.pages.map(p => p.id === currentPage.id ? ({
        ...p,
        widgets: p.widgets.filter(w => w.id !== id),
        layout: p.layout.filter(l => l.i !== id)
      }) : p)
    }
    setState(next)
  }

  const updateWidget = (updated) => {
    if (!currentPage) return
    const next = {
      ...state,
      pages: state.pages.map(p => p.id === currentPage.id ? ({
        ...p,
        widgets: p.widgets.map(w => w.id === updated.id ? updated : w)
      }) : p)
    }
    setState(next)
  }

  const onLayoutChange = (layout) => {
    if (!currentPage) return
    const next = {
      ...state,
      pages: state.pages.map(p => p.id === currentPage.id ? ({ ...p, layout }) : p)
    }
    setState(next)
  }

  const createPage = () => {
    const name = prompt('Name your new page:', `Page ${state.pages.length+1}`)
    if (!name) return
    const page = { id: uuidv4(), name, widgets: [], layout: [] }
    setState(s => ({ ...s, pages: [...s.pages, page], currentPageId: page.id }))
  }

  const renamePage = (id) => {
    const name = prompt('New page name:')
    if (!name) return
    setState(s => ({ ...s, pages: s.pages.map(p => p.id === id ? { ...p, name } : p) }))
  }

  const deletePage = (id) => {
    if (!confirm('Delete this page?')) return
    setState(s => {
      const pages = s.pages.filter(p => p.id != id)
      return { ...s, pages, currentPageId: pages[0]?.id || null }
    })
  }

  return (
    <div style={{display:'flex', flexDirection:'column', height:'100%'}}>
      <header className="card" style={{padding:'14px 16px', margin:'10px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div style={{fontWeight:800, letterSpacing:0.3}}>✨ My Dashboard</div>
        <div className="toolbar">
          <button className="btn" onClick={()=>setShowAdd(true)}>+ Add Widget</button>
          <button className="btn secondary" onClick={createPage}>+ New Page</button>
        </div>
      </header>

      <div style={{padding:'0 10px'}}>
        <Tabs
          pages={state.pages}
          currentId={state.currentPageId}
          onSelect={(id)=> setState(s=> ({ ...s, currentPageId: id }))}
          onRename={renamePage}
          onDelete={deletePage}
        />
      </div>

      <div className="grid-container" style={{flex:1, minHeight:0}}>
        {currentPage && (
          <GridLayout
            className="layout"
            layout={currentPage.layout}
            cols={12}
            rowHeight={30}
            width={window.innerWidth - 20}
            onLayoutChange={onLayoutChange}
            draggableHandle=".widget-chrome"
          >
            {currentPage.widgets.map(w => (
              <div key={w.id} className="rgl-item">
                <WidgetRenderer
                  widget={w}
                  onUpdate={updateWidget}
                  onRemove={()=>removeWidget(w.id)}
                />
              </div>
            ))}
          </GridLayout>
        )}
      </div>

      {showAdd && (
        <AddWidgetModal onClose={()=>setShowAdd(false)} onAdd={addWidget} />
      )}
    </div>
  )
}
