import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { INITIAL_PECAS, INITIAL_AERONAVES } from '../data/store'

const STATUS_MAP = {
  EM_PRODUCAO:   { label: 'Em Produção',   cls: 'orange' },
  EM_TRANSPORTE: { label: 'Em Transporte', cls: 'blue'   },
  PRONTA:        { label: 'Pronta',        cls: 'green'  },
}

const EMPTY = { codigo: '', nome: '', tipo: 'NACIONAL', fornecedor: '', aeronaveId: '', status: 'EM_PRODUCAO' }

export default function Pecas() {
  const { isEng } = useAuth()
  const [lista, setLista]     = useState(INITIAL_PECAS)
  const [busca, setBusca]     = useState('')
  const [modal, setModal]     = useState(false)
  const [editando, setEdit]   = useState(null)
  const [form, setForm]       = useState(EMPTY)

  const filtrada = lista.filter(p =>
    p.nome.toLowerCase().includes(busca.toLowerCase()) ||
    p.codigo.toLowerCase().includes(busca.toLowerCase())
  )

  function abrirNovo()  { setEdit(null); setForm(EMPTY); setModal(true) }
  function abrirEditar(p) { setEdit(p.id); setForm({ ...p }); setModal(true) }
  function salvar() {
    if (!form.codigo || !form.nome) return
    if (editando) {
      setLista(l => l.map(p => p.id === editando ? { ...form, id: editando } : p))
    } else {
      setLista(l => [...l, { ...form, id: Date.now(), aeronaveId: Number(form.aeronaveId) }])
    }
    setModal(false)
  }
  function excluir(id) {
    if (window.confirm('Excluir peça?')) setLista(l => l.filter(p => p.id !== id))
  }
  function atualizarStatus(id, status) {
    setLista(l => l.map(p => p.id === id ? { ...p, status } : p))
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Peças</h1>
          <p className="page-sub">{lista.length} peças registradas</p>
        </div>
        {isEng && <button className="btn btn-primary" onClick={abrirNovo}>+ Nova Peça</button>}
      </div>

      <div className="search-bar">
        <input placeholder="Buscar por código ou nome..." value={busca} onChange={e => setBusca(e.target.value)} />
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Código</th><th>Nome</th><th>Tipo</th><th>Fornecedor</th><th>Aeronave</th><th>Status</th><th>Ações</th></tr>
            </thead>
            <tbody>
              {filtrada.map(p => {
                const aero = INITIAL_AERONAVES.find(a => a.id === p.aeronaveId)
                const s = STATUS_MAP[p.status]
                return (
                  <tr key={p.id}>
                    <td><code style={{ fontFamily: 'var(--mono)', color: 'var(--accent)', fontSize: 12 }}>{p.codigo}</code></td>
                    <td>{p.nome}</td>
                    <td><span className={`badge ${p.tipo === 'NACIONAL' ? 'green' : 'blue'}`}>{p.tipo}</span></td>
                    <td style={{ color: 'var(--text2)' }}>{p.fornecedor}</td>
                    <td><code style={{ fontFamily: 'var(--mono)', color: 'var(--text2)', fontSize: 12 }}>{aero?.codigo || '—'}</code></td>
                    <td>
                      <select
                        value={p.status}
                        onChange={e => atualizarStatus(p.id, e.target.value)}
                        style={{ width: 'auto', padding: '3px 8px', fontSize: 12 }}
                      >
                        {Object.entries(STATUS_MAP).map(([k, v]) => (
                          <option key={k} value={k}>{v.label}</option>
                        ))}
                      </select>
                    </td>
                    <td style={{ display: 'flex', gap: 6 }}>
                      {isEng && <button className="btn btn-ghost btn-sm" onClick={() => abrirEditar(p)}>Editar</button>}
                      {isEng && <button className="btn btn-danger btn-sm" onClick={() => excluir(p.id)}>Excluir</button>}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">
              {editando ? 'Editar Peça' : 'Nova Peça'}
              <button className="modal-close" onClick={() => setModal(false)}>×</button>
            </div>
            <div className="form-grid">
              <div><label>Código *</label><input placeholder="P-XXX" value={form.codigo} onChange={e => setForm(f => ({ ...f, codigo: e.target.value }))} /></div>
              <div><label>Nome *</label><input placeholder="ex: Motor CFM56" value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} /></div>
              <div><label>Fornecedor</label><input placeholder="ex: CFM International" value={form.fornecedor} onChange={e => setForm(f => ({ ...f, fornecedor: e.target.value }))} /></div>
              <div>
                <label>Aeronave</label>
                <select value={form.aeronaveId} onChange={e => setForm(f => ({ ...f, aeronaveId: e.target.value }))}>
                  <option value="">— Selecionar —</option>
                  {INITIAL_AERONAVES.map(a => <option key={a.id} value={a.id}>{a.codigo} — {a.modelo}</option>)}
                </select>
              </div>
              <div>
                <label>Tipo</label>
                <select value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))}>
                  <option value="NACIONAL">NACIONAL</option>
                  <option value="IMPORTADA">IMPORTADA</option>
                </select>
              </div>
              <div>
                <label>Status</label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                  {Object.entries(STATUS_MAP).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
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
