import { useState } from 'react'
import { INITIAL_FUNCIONARIOS } from '../data/store'
import { useAuth } from '../context/AuthContext'

const NIVEL_CLS = { ADMINISTRADOR: 'purple', ENGENHEIRO: 'blue', OPERADOR: 'gray' }
const EMPTY = { matricula: '', nome: '', email: '', nivel: 'OPERADOR' }

export default function Funcionarios() {
  const { user } = useAuth()
  const [lista, setLista]   = useState(INITIAL_FUNCIONARIOS)
  const [busca, setBusca]   = useState('')
  const [filtro, setFiltro] = useState('TODOS')
  const [modal, setModal]   = useState(false)
  const [editando, setEdit] = useState(null)
  const [form, setForm]     = useState(EMPTY)

  const filtrado = lista.filter(f => {
    const bk = f.nome.toLowerCase().includes(busca.toLowerCase()) || f.matricula.includes(busca)
    const fk = filtro === 'TODOS' || f.nivel === filtro
    return bk && fk
  })

  function abrirNovo()    { setEdit(null); setForm(EMPTY); setModal(true) }
  function abrirEditar(f) { setEdit(f.id); setForm({ ...f }); setModal(true) }
  function salvar() {
    if (!form.matricula || !form.nome) return
    if (editando) {
      setLista(l => l.map(f => f.id === editando ? { ...form, id: editando } : f))
    } else {
      setLista(l => [...l, { ...form, id: Date.now() }])
    }
    setModal(false)
  }
  function excluir(id) {
    if (user?.id === id) {
      alert('Você não pode excluir a própria conta logada.')
      return
    }
    if (window.confirm('Excluir funcionário?')) setLista(l => l.filter(f => f.id !== id))
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Funcionários</h1>
          <p className="page-sub" style={{ color: 'var(--orange)' }}>⚠ Área restrita — Administrador</p>
        </div>
        <button className="btn btn-primary" onClick={abrirNovo}>+ Novo Funcionário</button>
      </div>

      <div className="search-bar">
        <input placeholder="Buscar por nome ou matrícula..." value={busca} onChange={e => setBusca(e.target.value)} />
        {['TODOS','ADMINISTRADOR','ENGENHEIRO','OPERADOR'].map(f => (
          <button key={f} className={`btn ${filtro === f ? 'btn-primary' : 'btn-ghost'} btn-sm`} onClick={() => setFiltro(f)}>{f}</button>
        ))}
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Matrícula</th><th>Nome</th><th>E-mail</th><th>Nível</th><th>Ações</th></tr>
            </thead>
            <tbody>
              {filtrado.map(f => (
                <tr key={f.id}>
                  <td><code style={{ fontFamily: 'var(--mono)', color: 'var(--accent)', fontSize: 12 }}>{f.matricula}</code></td>
                  <td style={{ fontWeight: 500 }}>{f.nome}</td>
                  <td style={{ color: 'var(--text2)' }}>{f.email}</td>
                  <td><span className={`badge ${NIVEL_CLS[f.nivel]}`}>{f.nivel}</span></td>
                  <td style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => abrirEditar(f)}>Editar</button>
                    <button className="btn btn-danger btn-sm" disabled={user?.id === f.id} onClick={() => excluir(f.id)}>Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">
              {editando ? 'Editar Funcionário' : 'Novo Funcionário'}
              <button className="modal-close" onClick={() => setModal(false)}>×</button>
            </div>
            <div className="form-grid">
              <div><label>Matrícula *</label><input placeholder="ex: eng02" value={form.matricula} onChange={e => setForm(f => ({ ...f, matricula: e.target.value }))} /></div>
              <div><label>Nome *</label><input placeholder="Nome completo" value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} /></div>
              <div className="span2"><label>E-mail</label><input type="email" placeholder="nome@aerocode.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
              <div className="span2">
                <label>Nível de Acesso</label>
                <select value={form.nivel} onChange={e => setForm(f => ({ ...f, nivel: e.target.value }))}>
                  <option value="OPERADOR">OPERADOR</option>
                  <option value="ENGENHEIRO">ENGENHEIRO</option>
                  <option value="ADMINISTRADOR">ADMINISTRADOR</option>
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
