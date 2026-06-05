import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { INITIAL_TESTES, INITIAL_AERONAVES } from '../data/store'

const RESULTADO_MAP = {
  APROVADO:  { label: 'Aprovado',  cls: 'green' },
  REPROVADO: { label: 'Reprovado', cls: 'red'   },
}
const TIPOS = ['ELETRICO', 'HIDRAULICO', 'AERODINAMICO']
const EMPTY = { codigo: '', tipo: 'ELETRICO', aeronaveId: '', data: '', resultado: 'APROVADO', responsavel: '' }

export default function Testes() {
  const { isEng } = useAuth()
  const [lista, setLista]   = useState(INITIAL_TESTES)
  const [busca, setBusca]   = useState('')
  const [filtro, setFiltro] = useState('TODOS')
  const [modal, setModal]   = useState(false)
  const [editando, setEdit] = useState(null)
  const [form, setForm]     = useState(EMPTY)

  const filtrado = lista.filter(t => {
    const bk = t.codigo.toLowerCase().includes(busca.toLowerCase()) || t.tipo.includes(busca.toUpperCase())
    const fk = filtro === 'TODOS' || t.tipo === filtro
    return bk && fk
  })

  function abrirNovo()    { setEdit(null); setForm(EMPTY); setModal(true) }
  function abrirEditar(t) { setEdit(t.id); setForm({ ...t }); setModal(true) }
  function salvar() {
    if (!form.codigo || !form.aeronaveId) return
    if (editando) {
      setLista(l => l.map(t => t.id === editando ? { ...form, id: editando, aeronaveId: Number(form.aeronaveId) } : t))
    } else {
      setLista(l => [...l, { ...form, id: Date.now(), aeronaveId: Number(form.aeronaveId) }])
    }
    setModal(false)
  }
  function excluir(id) {
    if (window.confirm('Excluir teste?')) setLista(l => l.filter(t => t.id !== id))
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Testes</h1>
          <p className="page-sub">{lista.length} testes registrados</p>
        </div>
        {isEng && <button className="btn btn-primary" onClick={abrirNovo}>+ Novo Teste</button>}
      </div>

      <div className="search-bar">
        <input placeholder="Buscar por código..." value={busca} onChange={e => setBusca(e.target.value)} />
        {['TODOS', ...TIPOS].map(f => (
          <button key={f} className={`btn ${filtro === f ? 'btn-primary' : 'btn-ghost'} btn-sm`} onClick={() => setFiltro(f)}>
            {f}
          </button>
        ))}
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Código</th><th>Tipo</th><th>Aeronave</th><th>Data</th><th>Responsável</th><th>Resultado</th>{isEng && <th>Ações</th>}</tr>
            </thead>
            <tbody>
              {filtrado.map(t => {
                const aero = INITIAL_AERONAVES.find(a => a.id === t.aeronaveId)
                const res  = RESULTADO_MAP[t.resultado]
                return (
                  <tr key={t.id}>
                    <td><code style={{ fontFamily: 'var(--mono)', color: 'var(--accent)', fontSize: 12 }}>{t.codigo}</code></td>
                    <td><span className="badge gray">{t.tipo}</span></td>
                    <td><code style={{ fontFamily: 'var(--mono)', color: 'var(--text2)', fontSize: 12 }}>{aero?.codigo || '—'}</code></td>
                    <td style={{ color: 'var(--text2)', fontSize: 12 }}>{t.data}</td>
                    <td style={{ color: 'var(--text2)' }}>{t.responsavel}</td>
                    <td><span className={`badge ${res.cls}`}>{res.label}</span></td>
                    {isEng && (
                      <td style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => abrirEditar(t)}>Editar</button>
                        <button className="btn btn-danger btn-sm" onClick={() => excluir(t.id)}>Excluir</button>
                      </td>
                    )}
                  </tr>
                )
              })}
              {filtrado.length === 0 && (
                <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--text3)', padding: 32 }}>Nenhum teste encontrado</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">
              {editando ? 'Editar Teste' : 'Novo Teste'}
              <button className="modal-close" onClick={() => setModal(false)}>×</button>
            </div>
            <div className="form-grid">
              <div><label>Código *</label><input placeholder="T-XXX" value={form.codigo} onChange={e => setForm(f => ({ ...f, codigo: e.target.value }))} /></div>
              <div>
                <label>Tipo</label>
                <select value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))}>
                  {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label>Aeronave *</label>
                <select value={form.aeronaveId} onChange={e => setForm(f => ({ ...f, aeronaveId: e.target.value }))}>
                  <option value="">— Selecionar —</option>
                  {INITIAL_AERONAVES.map(a => <option key={a.id} value={a.id}>{a.codigo} — {a.modelo}</option>)}
                </select>
              </div>
              <div><label>Data</label><input type="date" value={form.data} onChange={e => setForm(f => ({ ...f, data: e.target.value }))} /></div>
              <div><label>Responsável</label><input placeholder="Nome" value={form.responsavel} onChange={e => setForm(f => ({ ...f, responsavel: e.target.value }))} /></div>
              <div>
                <label>Resultado</label>
                <select value={form.resultado} onChange={e => setForm(f => ({ ...f, resultado: e.target.value }))}>
                  <option value="APROVADO">Aprovado</option>
                  <option value="REPROVADO">Reprovado</option>
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
