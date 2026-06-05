import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { INITIAL_ETAPAS, INITIAL_AERONAVES } from '../data/store'
import './Etapas.css'

const COLS = [
  { key: 'PENDENTE',     label: 'Pendente',      cls: 'gray'   },
  { key: 'EM_ANDAMENTO', label: 'Em Andamento',  cls: 'orange' },
  { key: 'CONCLUIDA',    label: 'Concluída',     cls: 'green'  },
]

const EMPTY = { nome: '', aeronaveId: '', prazo: '', responsavel: '', status: 'PENDENTE' }

export default function Etapas() {
  const { isEng } = useAuth()
  const [etapas, setEtapas] = useState(INITIAL_ETAPAS)
  const [modal, setModal]   = useState(false)
  const [editando, setEdit] = useState(null)
  const [form, setForm]     = useState(EMPTY)

  function abrirNovo()    { setEdit(null); setForm(EMPTY); setModal(true) }
  function abrirEditar(e) { setEdit(e.id); setForm({ ...e }); setModal(true) }

  function salvar() {
    if (!form.nome || !form.aeronaveId) return
    if (editando) {
      setEtapas(l => l.map(e => e.id === editando ? { ...form, id: editando, aeronaveId: Number(form.aeronaveId) } : e))
    } else {
      setEtapas(l => [...l, { ...form, id: Date.now(), aeronaveId: Number(form.aeronaveId) }])
    }
    setModal(false)
  }

  function avancar(etapa) {
    const ordem = ['PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDA']
    const idx = ordem.indexOf(etapa.status)
    if (idx < 2) {
      // verifica dependência: todas as etapas da mesma aeronave anteriores à atual devem estar concluídas
      const anteriores = etapas.filter(e => e.aeronaveId === etapa.aeronaveId && e.id < etapa.id)
      const bloqueado  = anteriores.some(e => e.status !== 'CONCLUIDA')
      if (bloqueado && etapa.status === 'PENDENTE') {
        alert('Etapa bloqueada: a etapa anterior ainda não foi concluída.')
        return
      }
      setEtapas(l => l.map(e => e.id === etapa.id ? { ...e, status: ordem[idx + 1] } : e))
    }
  }

  function excluir(id) {
    if (window.confirm('Excluir etapa?')) setEtapas(l => l.filter(e => e.id !== id))
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Etapas de Produção</h1>
          <p className="page-sub">Kanban — {etapas.length} etapas no total</p>
        </div>
        {isEng && <button className="btn btn-primary" onClick={abrirNovo}>+ Nova Etapa</button>}
      </div>

      <div className="kanban-board">
        {COLS.map(col => {
          const cards = etapas.filter(e => e.status === col.key)
          return (
            <div key={col.key} className="kanban-col">
              <div className={`kanban-col-header badge-${col.cls}`}>
                <span>{col.label}</span>
                <span className="kanban-count">{cards.length}</span>
              </div>
              <div className="kanban-cards">
                {cards.map(e => {
                  const aero = INITIAL_AERONAVES.find(a => a.id === e.aeronaveId)
                  return (
                    <div key={e.id} className="kanban-card">
                      <div className={`kanban-card-bar bar-${col.cls}`} />
                      <div className="kanban-card-body">
                        <div className="kanban-card-title">{e.nome}</div>
                        <div className="kanban-card-meta">
                          <span>✈ {aero?.codigo || '—'}</span>
                          {e.responsavel && <span>◉ {e.responsavel}</span>}
                          {e.prazo && <span>📅 {e.prazo}</span>}
                        </div>
                        <div className="kanban-card-actions">
                          {isEng && col.key !== 'CONCLUIDA' && (
                            <button className="btn btn-ghost btn-sm" onClick={() => avancar(e)}>
                              {col.key === 'PENDENTE' ? 'Iniciar →' : 'Concluir →'}
                            </button>
                          )}
                          {isEng && (
                            <>
                              <button className="btn btn-ghost btn-sm" onClick={() => abrirEditar(e)}>Editar</button>
                              <button className="btn btn-danger btn-sm" onClick={() => excluir(e.id)}>✕</button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
                {cards.length === 0 && (
                  <div className="kanban-empty">Nenhuma etapa</div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">
              {editando ? 'Editar Etapa' : 'Nova Etapa'}
              <button className="modal-close" onClick={() => setModal(false)}>×</button>
            </div>
            <div className="form-grid">
              <div className="span2"><label>Nome da Etapa *</label><input placeholder="ex: Montagem da Asa" value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} /></div>
              <div>
                <label>Aeronave *</label>
                <select value={form.aeronaveId} onChange={e => setForm(f => ({ ...f, aeronaveId: e.target.value }))}>
                  <option value="">— Selecionar —</option>
                  {INITIAL_AERONAVES.map(a => <option key={a.id} value={a.id}>{a.codigo} — {a.modelo}</option>)}
                </select>
              </div>
              <div><label>Prazo</label><input type="date" value={form.prazo} onChange={e => setForm(f => ({ ...f, prazo: e.target.value }))} /></div>
              <div><label>Responsável</label><input placeholder="Nome do engenheiro" value={form.responsavel} onChange={e => setForm(f => ({ ...f, responsavel: e.target.value }))} /></div>
              <div>
                <label>Status</label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                  <option value="PENDENTE">Pendente</option>
                  <option value="EM_ANDAMENTO">Em Andamento</option>
                  <option value="CONCLUIDA">Concluída</option>
                </select>
              </div>
            </div>
            <div className="form-actions">
              <button className="btn btn-ghost" onClick={() => setModal(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={salvar}>Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
