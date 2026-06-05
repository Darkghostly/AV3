import { useState, useEffect } from 'react'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'

const NIVEL_CLS = { ADMINISTRADOR: 'purple', ENGENHEIRO: 'blue', OPERADOR: 'gray' }
// Ajustado para bater com o BD: usuario, permissao e adicionado o campo de senha para criação
const EMPTY = { usuario: '', nome: '', email: '', permissao: 'OPERADOR', senha: '' }

export default function Funcionarios() {
  const { user } = useAuth()
  const [lista, setLista]   = useState([])
  const [busca, setBusca]   = useState('')
  const [filtro, setFiltro] = useState('TODOS')
  const [modal, setModal]   = useState(false)
  const [editando, setEdit] = useState(null)
  const [form, setForm]     = useState(EMPTY)

  useEffect(() => { carregar() }, [])

  async function carregar() {
    try {
      const data = await api.getFuncionarios()
      setLista(data || [])
    } catch(e) { alert(e.message) }
  }

  const filtrado = lista.filter(f => {
    const bk = (f.nome || '').toLowerCase().includes(busca.toLowerCase()) || (f.usuario || '').includes(busca)
    const fk = filtro === 'TODOS' || f.permissao === filtro
    return bk && fk
  })

  function abrirNovo()    { setEdit(null); setForm(EMPTY); setModal(true) }
  function abrirEditar(f) { setEdit(f.id); setForm({ ...f, senha: '' }); setModal(true) }

  async function salvar() {
    if (!form.usuario || !form.nome) return
    try {
      if (editando) {
        await api.updateFuncionario(editando, form)
      } else {
        await api.createFuncionario(form)
      }
      await carregar()
      setModal(false)
    } catch(e) { alert(e.message) }
  }

  async function excluir(id) {
    const funcionario = lista.find(f => f.id === id)
    if (funcionario?.usuario === 'admin') {
      alert('Controle de Acesso: A conta do Super Administrador (admin) não pode ser excluída.')
      return
    }
    if (user?.id === id) {
      alert('Controle de Acesso: Você não pode excluir a própria sessão logada.')
      return
    }
    if (!window.confirm('Excluir funcionário?')) return
    try {
      await api.deleteFuncionario(id)
      setLista(l => l.filter(f => f.id !== id))
    } catch(e) { alert(e.message) }
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
        <input placeholder="Buscar por nome ou usuário..." value={busca} onChange={e => setBusca(e.target.value)} />
        {['TODOS','ADMINISTRADOR','ENGENHEIRO','OPERADOR'].map(f => (
          <button key={f} className={`btn ${filtro === f ? 'btn-primary' : 'btn-ghost'} btn-sm`} onClick={() => setFiltro(f)}>{f}</button>
        ))}
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Usuário</th><th>Nome</th><th>E-mail</th><th>Permissão</th><th>Ações</th></tr>
            </thead>
            <tbody>
              {filtrado.map(f => (
                <tr key={f.id}>
                  <td><code style={{ fontFamily: 'var(--mono)', color: 'var(--accent)', fontSize: 12 }}>{f.usuario}</code></td>
                  <td style={{ fontWeight: 500 }}>{f.nome}</td>
                  <td style={{ color: 'var(--text2)' }}>{f.email || '—'}</td>
                  <td><span className={`badge ${NIVEL_CLS[f.permissao]}`}>{f.permissao}</span></td>
                  <td style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => abrirEditar(f)}>Editar</button>
                    <button className="btn btn-danger btn-sm" disabled={user?.id === f.id || f.usuario === 'admin'} onClick={() => excluir(f.id)}>Excluir</button>
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
              <div><label>Usuário *</label><input placeholder="ex: eng02" value={form.usuario} onChange={e => setForm(f => ({ ...f, usuario: e.target.value }))} /></div>
              <div><label>Nome *</label><input placeholder="Nome completo" value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} /></div>
              <div><label>E-mail</label><input type="email" placeholder="nome@aerocode.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
              <div>
                <label>Permissão</label>
                <select value={form.permissao} onChange={e => setForm(f => ({ ...f, permissao: e.target.value }))}>
                  <option value="OPERADOR">OPERADOR</option>
                  <option value="ENGENHEIRO">ENGENHEIRO</option>
                  <option value="ADMINISTRADOR">ADMINISTRADOR</option>
                </select>
              </div>
              <div className="span2">
                <label>Senha Segura {editando ? '(Deixe em branco para não alterar)' : '*'}</label>
                <input type="password" placeholder="••••••••" value={form.senha} onChange={e => setForm(f => ({ ...f, senha: e.target.value }))} />
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