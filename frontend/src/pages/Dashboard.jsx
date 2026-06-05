import { useAuth } from '../context/AuthContext'
import {
  INITIAL_AERONAVES, INITIAL_PECAS,
  INITIAL_ETAPAS, INITIAL_TESTES
} from '../data/store'
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

  const kpis = [
    { label: 'Aeronaves',  value: INITIAL_AERONAVES.length, sub: 'cadastradas',  color: 'blue' },
    { label: 'Peças',      value: INITIAL_PECAS.length,     sub: 'registradas',  color: 'purple' },
    { label: 'Etapas',     value: INITIAL_ETAPAS.filter(e => e.status === 'EM_ANDAMENTO').length, sub: 'em andamento', color: 'orange' },
    { label: 'Testes',     value: INITIAL_TESTES.filter(t => t.resultado === 'APROVADO').length,  sub: 'aprovados',    color: 'green' },
  ]

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-sub">Bem-vindo, {user.nome} · {user.nivel}</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        {kpis.map(k => (
          <div key={k.label} className={`kpi-card kpi-${k.color}`}>
            <span className="kpi-value">{k.value}</span>
            <span className="kpi-label">{k.label}</span>
            <span className="kpi-sub">{k.sub}</span>
          </div>
        ))}
      </div>

      {/* Tabela aeronaves recentes */}
      <div className="card" style={{ marginTop: 28 }}>
        <h2 className="section-title">Aeronaves em Produção</h2>
        <div className="table-wrap" style={{ marginTop: 14 }}>
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Modelo</th>
                <th>Fabricante</th>
                <th>Tipo</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {INITIAL_AERONAVES.map(a => (
                <tr key={a.id}>
                  <td><code style={{ fontFamily: 'var(--mono)', color: 'var(--accent)', fontSize: 12 }}>{a.codigo}</code></td>
                  <td>{a.modelo}</td>
                  <td>{a.fabricante}</td>
                  <td><span className={`badge ${a.tipo === 'COMERCIAL' ? 'blue' : 'purple'}`}>{a.tipo}</span></td>
                  <td>{STATUS_BADGE[a.status]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Etapas recentes */}
      <div className="card" style={{ marginTop: 20 }}>
        <h2 className="section-title">Etapas Recentes</h2>
        <div className="table-wrap" style={{ marginTop: 14 }}>
          <table>
            <thead>
              <tr>
                <th>Etapa</th>
                <th>Aeronave</th>
                <th>Responsável</th>
                <th>Prazo</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {INITIAL_ETAPAS.slice(0, 5).map(e => {
                const aero = INITIAL_AERONAVES.find(a => a.id === e.aeronaveId)
                return (
                  <tr key={e.id}>
                    <td>{e.nome}</td>
                    <td><code style={{ fontFamily: 'var(--mono)', color: 'var(--accent)', fontSize: 12 }}>{aero?.codigo}</code></td>
                    <td>{e.responsavel || '—'}</td>
                    <td style={{ color: 'var(--text2)', fontSize: 12 }}>{e.prazo}</td>
                    <td>{ETAPA_BADGE[e.status]}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
