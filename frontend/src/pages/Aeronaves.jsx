import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { INITIAL_AERONAVES } from '../data/store'

const STATUS_MAP = {
  EM_PRODUCAO: { label: 'Em Produção', cls: 'orange' },
  CONCLUIDA:   { label: 'Concluída',   cls: 'green'  },
  PENDENTE:    { label: 'Pendente',    cls: 'gray'   },
}

const EMPTY = { codigo: '', modelo: '', tipo: 'COMERCIAL', fabricante: '', capacidade: '', alcance: '', status: 'PENDENTE' }

export default function Aeronaves() {
  const { isEng } = useAuth()
  const [lista, setLista]       = useState(INITIAL_AERONAVES)
  const [busca, setBusca]       = useState('')
  const [filtro, setFiltro]     = useState('TODOS')
  const [modal, setModal]       = useState(false)
  const [editando, setEditando] = useState(null)
  const [form, setForm]         = useState(EMPTY)
  const [selecionado, setSel]   = useState(null)

  const filtrada = lista.filter(a => {
    const ok = filtro === 'TODOS' || a.tipo === filtro
    const bk = a.modelo.toLowerCase().includes(busca.toLowerCase()) ||
               a.codigo.toLowerCase().includes(busca.toLowerCase())
    return ok && bk
  })

  function abrirNovo() {
    setEditando(null); setForm(EMPTY); setModal(true)
  }
  function abrirEditar(a) {
    setEditando(a.id); setForm({ ...a }); setModal(true)
  }
  function salvar() {
    if (!form.codigo || !form.modelo || !form.fabricante) return
    if (editando) {
      setLista(l => l.map(a => a.id === editando ? { ...form, id: editando } : a))
    } else {
      setLista(l => [...l, { ...form, id: Date.now() }])
    }
    setModal(false)
  }
  function excluir(id) {
    if (window.confirm('Excluir aeronave?')) {
      setLista(l => l.filter(a => a.id !== id))
      if (selecionado?.id === id) setSel(null)
    }
  }

  return (
    <div style={{ display: 'flex', gap: 24, height: '100%' }}>
      {/* Lista */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="page-header">
          <div>
            <h1 className="page-title">Aeronaves</h1>
            <p className="page-sub">{lista.length} aeronaves cadastradas</p>
          </div>
          {isEng && (
            <button className="btn btn-primary" onClick={abrirNovo}>+ Nova Aeronave</button>
          )}
        </div>

        <div className="search-bar">
          <input placeholder="Buscar por código ou modelo..." value={busca} onChange={e => setBusca(e.target.value)} />
          {['TODOS','COMERCIAL','MILITAR'].map(f => (
            <button key={f}
              className={`btn ${filtro === f ? 'btn-primary' : 'btn-ghost'} btn-sm`}
              onClick={() => setFiltro(f)}>{f}</button>
          ))}
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Código</th><th>Modelo</th><th>Tipo</th><th>Fabricante</th><th>Status</th>{isEng && <th>Ações</th>}</tr>
              </thead>
              <tbody>
                {filtrada.map(a => {
                  const s = STATUS_MAP[a.status]
                  return (
                    <tr key={a.id} onClick={() => setSel(a)} className={selecionado?.id === a.id ? 'selected' : ''}>
                      <td><code style={{ fontFamily: 'var(--mono)', color: 'var(--accent)', fontSize: 12 }}>{a.codigo}</code></td>
                      <td>{a.modelo}</td>
                      <td><span className={`badge ${a.tipo === 'COMERCIAL' ? 'blue' : 'purple'}`}>{a.tipo}</span></td>
                      <td>{a.fabricante}</td>
                      <td><span className={`badge ${s.cls}`}>{s.label}</span></td>
                      {isEng && (
                        <td onClick={e => e.stopPropagation()} style={{ display: 'flex', gap: 6 }}>
                          <button className="btn btn-ghost btn-sm" onClick={() => abrirEditar(a)}>Editar</button>
                          <button className="btn btn-danger btn-sm" onClick={() => excluir(a.id)}>Excluir</button>
                        </td>
                      )}
                    </tr>
                  )
                })}
                {filtrada.length === 0 && (
                  <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text3)', padding: 32 }}>Nenhuma aeronave encontrada</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Painel de detalhes */}
      {selecionado && (
        <div className="card" style={{ width: 280, minWidth: 280, alignSelf: 'flex-start' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ fontWeight: 600, fontSize: 14 }}>Detalhes</span>
            <button className="modal-close" onClick={() => setSel(null)}>×</button>
          </div>
          {[
            ['Código',     selecionado.codigo],
            ['Modelo',     selecionado.modelo],
            ['Tipo',       selecionado.tipo],
            ['Fabricante', selecionado.fabricante],
            ['Capacidade', selecionado.capacidade + ' pessoas'],
            ['Alcance',    selecionado.alcance + ' km'],
            ['Status',     selecionado.status],
          ].map(([k, v]) => (
            <div key={k} style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 3 }}>{k}</div>
              <div style={{ fontSize: 13, color: 'var(--text)', background: 'var(--surface2)', padding: '6px 10px', borderRadius: 'var(--radius)' }}>{v}</div>
            </div>
          ))}
          {isEng && (
            <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}
              onClick={() => abrirEditar(selecionado)}>Editar Aeronave</button>
          )}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">
              {editando ? 'Editar Aeronave' : 'Nova Aeronave'}
              <button className="modal-close" onClick={() => setModal(false)}>×</button>
            </div>
            <div className="form-grid">
              {[['Código *','codigo','text','AC-XXX'],['Modelo *','modelo','text','ex: Boeing 737'],
                ['Fabricante *','fabricante','text','ex: Boeing'],['Capacidade (pessoas)','capacidade','number',''],
                ['Alcance (km)','alcance','number','']].map(([lb, key, type, ph]) => (
                <div key={key}>
                  <label>{lb}</label>
                  <input type={type} placeholder={ph} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
                </div>
              ))}
              <div>
                <label>Tipo</label>
                <select value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))}>
                  <option value="COMERCIAL">COMERCIAL</option>
                  <option value="MILITAR">MILITAR</option>
                </select>
              </div>
              <div>
                <label>Status</label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                  <option value="PENDENTE">PENDENTE</option>
                  <option value="EM_PRODUCAO">EM PRODUÇÃO</option>
                  <option value="CONCLUIDA">CONCLUÍDA</option>
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
