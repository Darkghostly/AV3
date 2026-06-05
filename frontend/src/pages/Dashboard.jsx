import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { api } from '../services/api'
import './Dashboard.css'

const STATUS_BADGE = {
  EM_PRODUCAO:  <span className="badge orange">Em Produção</span>,
  CONCLUIDA:    <span className="badge green">Concluída</span>,
  PENDENTE:     <span className="badge gray">Pendente</span>,
}

const ETAPA_BADGE = {
  CONCLUIDA:    <span className="badge green">Concluída</span>,
  EM_ANDAMENTO: <span className="badge orange">Em Andamento</span>,
  PENDENTE:     <span className="badge gray">Pendente</span>,
}

export default function Dashboard() {
  const { user } = useAuth()
  const [aeronaves, setAeronaves] = useState([])
  const [pecas, setPecas] = useState([])
  const [etapas, setEtapas] = useState([])
  const [testes, setTestes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Busca todos os dados em paralelo no Cofre do Backend
    Promise.all([api.getAeronaves(), api.getPecas(), api.getEtapas(), api.getTestes()])
      .then(([a, p, e, t]) => {
        setAeronaves(a || []); setPecas(p || []); setEtapas(e || []); setTestes(t || []);
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div style={{ padding: 40 }}>Acedendo ao cofre de dados...</div>

  const kpis = [
    { label: 'Aeronaves',  value: aeronaves.length, sub: 'cadastradas',  color: 'blue' },
    { label: 'Peças',      value: pecas.length,     sub: 'registradas',  color: 'purple' },
    { label: 'Etapas',     value: etapas.filter(e => e.status === 'EM_ANDAMENTO').length, sub: 'em andamento', color: 'orange' },
    { label: 'Testes',     value: testes.filter(t => t.resultado === 'APROVADO').length,  sub: 'aprovados',    color: 'green' },
  ]

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-sub">Bem-vindo, {user?.nome} · {user?.permissao}</p>
        </div>
      </div>

      <div className="kpi-grid">
        {kpis.map(k => (
          <div key={k.label} className={`kpi-card kpi-${k.color}`}>
            <span className="kpi-value">{k.value}</span>
            <span className="kpi-label">{k.label}</span>
            <span className="kpi-sub">{k.sub}</span>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: 28 }}>
        <h2 className="section-title">Aeronaves em Produção</h2>
        <div className="table-wrap" style={{ marginTop: 14 }}>
          <table>
            <thead>
              <tr><th>Código</th><th>Modelo</th><th>Fabricante</th><th>Tipo</th><th>Status</th></tr>
            </thead>
            <tbody>
              {aeronaves.slice(0, 5).map(a => (
                <tr key={a.id}>
                  <td><code style={{ fontFamily: 'var(--mono)', color: 'var(--accent)', fontSize: 12 }}>{a.codigo}</code></td>
                  <td>{a.modelo}</td>
                  <td>{a.fabricante}</td>
                  <td><span className={`badge ${a.tipo === 'COMERCIAL' ? 'blue' : 'purple'}`}>{a.tipo}</span></td>
                  <td>{STATUS_BADGE[a.status] || STATUS_BADGE['PENDENTE']}</td>
                </tr>
              ))}
              {aeronaves.length === 0 && <tr><td colSpan={5} style={{textAlign: 'center'}}>Nenhuma aeronave cadastrada.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <h2 className="section-title">Etapas Recentes</h2>
        <div className="table-wrap" style={{ marginTop: 14 }}>
          <table>
            <thead>
              <tr><th>Etapa</th><th>Aeronave</th><th>Responsável</th><th>Prazo</th><th>Status</th></tr>
            </thead>
            <tbody>
              {etapas.slice(0, 5).map(e => {
                const aero = aeronaves.find(a => a.id === e.aeronaveId)
                return (
                  <tr key={e.id}>
                    <td>{e.nome}</td>
                    <td><code style={{ fontFamily: 'var(--mono)', color: 'var(--accent)', fontSize: 12 }}>{aero?.codigo || '—'}</code></td>
                    <td>{e.responsavel || '—'}</td>
                    <td style={{ color: 'var(--text2)', fontSize: 12 }}>{e.prazo}</td>
                    <td>{ETAPA_BADGE[e.status] || ETAPA_BADGE['PENDENTE']}</td>
                  </tr>
                )
              })}
              {etapas.length === 0 && <tr><td colSpan={5} style={{textAlign: 'center'}}>Nenhuma etapa registrada.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}