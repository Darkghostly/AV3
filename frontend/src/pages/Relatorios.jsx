import { useState } from 'react'
import { INITIAL_AERONAVES, INITIAL_PECAS, INITIAL_ETAPAS, INITIAL_TESTES } from '../data/store'

export default function Relatorios() {
  const [aeronaveId, setAeronaveId] = useState('')
  const [relatorio, setRelatorio]   = useState(null)

  function gerar() {
    if (!aeronaveId) return
    const aero   = INITIAL_AERONAVES.find(a => a.id === Number(aeronaveId))
    const pecas  = INITIAL_PECAS.filter(p => p.aeronaveId === Number(aeronaveId))
    const etapas = INITIAL_ETAPAS.filter(e => e.aeronaveId === Number(aeronaveId))
    const testes = INITIAL_TESTES.filter(t => t.aeronaveId === Number(aeronaveId))
    setRelatorio({ aero, pecas, etapas, testes, geradoEm: new Date().toLocaleString('pt-BR') })
  }

  function exportar() {
    if (!relatorio) return
    const { aero, pecas, etapas, testes, geradoEm } = relatorio
    const linhas = [
      '='.repeat(60),
      'RELATÓRIO FINAL — SISTEMA AEROCODE',
      '='.repeat(60),
      `Gerado em: ${geradoEm}`,
      '',
      '── AERONAVE ──────────────────────────────────────────',
      `Código      : ${aero.codigo}`,
      `Modelo      : ${aero.modelo}`,
      `Tipo        : ${aero.tipo}`,
      `Fabricante  : ${aero.fabricante}`,
      `Capacidade  : ${aero.capacidade} pessoas`,
      `Alcance     : ${aero.alcance} km`,
      `Status      : ${aero.status}`,
      '',
      '── ETAPAS ────────────────────────────────────────────',
      ...etapas.map(e => `  [${e.status.padEnd(12)}] ${e.nome} | Responsável: ${e.responsavel || '—'} | Prazo: ${e.prazo}`),
      '',
      '── PEÇAS ─────────────────────────────────────────────',
      ...pecas.map(p => `  [${p.status.padEnd(14)}] ${p.codigo} — ${p.nome} (${p.tipo}) | ${p.fornecedor}`),
      '',
      '── TESTES ────────────────────────────────────────────',
      ...testes.map(t => `  [${t.resultado.padEnd(10)}] ${t.codigo} — ${t.tipo} | Data: ${t.data} | Resp: ${t.responsavel}`),
      '',
      '='.repeat(60),
      'FIM DO RELATÓRIO',
    ]
    const blob = new Blob([linhas.join('\n')], { type: 'text/plain;charset=utf-8' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = `relatorio_${aero.codigo}.txt`; a.click()
    URL.revokeObjectURL(url)
  }

  const STATUS_CLS = { CONCLUIDA: 'green', EM_ANDAMENTO: 'orange', PENDENTE: 'gray' }
  const RES_CLS    = { APROVADO: 'green', REPROVADO: 'red' }
  const PECA_CLS   = { PRONTA: 'green', EM_PRODUCAO: 'orange', EM_TRANSPORTE: 'blue' }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Relatórios</h1>
          <p className="page-sub" style={{ color: 'var(--orange)' }}>⚠ Área restrita — Administrador</p>
        </div>
      </div>

      <div className="card" style={{ maxWidth: 600, marginBottom: 24 }}>
        <h2 className="section-title" style={{ marginBottom: 16 }}>Gerar Relatório de Aeronave</h2>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <label>Selecionar Aeronave</label>
            <select value={aeronaveId} onChange={e => { setAeronaveId(e.target.value); setRelatorio(null) }}>
              <option value="">— Selecionar —</option>
              {INITIAL_AERONAVES.map(a => (
                <option key={a.id} value={a.id}>{a.codigo} — {a.modelo}</option>
              ))}
            </select>
          </div>
          <button className="btn btn-primary" onClick={gerar} disabled={!aeronaveId}>
            Gerar Relatório
          </button>
        </div>
      </div>

      {relatorio && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h2 className="section-title">
                Relatório — <code style={{ fontFamily: 'var(--mono)', color: 'var(--accent)' }}>{relatorio.aero.codigo}</code>
              </h2>
              <p style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>Gerado em {relatorio.geradoEm}</p>
            </div>
            <button className="btn btn-ghost" onClick={exportar}>⬇ Exportar .txt</button>
          </div>

          {/* Dados da aeronave */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 24 }}>
            {[
              ['Modelo', relatorio.aero.modelo],
              ['Fabricante', relatorio.aero.fabricante],
              ['Tipo', relatorio.aero.tipo],
              ['Capacidade', relatorio.aero.capacidade + ' pessoas'],
              ['Alcance', relatorio.aero.alcance + ' km'],
              ['Status', relatorio.aero.status],
            ].map(([k, v]) => (
              <div key={k} style={{ background: 'var(--surface2)', borderRadius: 'var(--radius)', padding: '10px 14px' }}>
                <div style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 4 }}>{k}</div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{v}</div>
              </div>
            ))}
          </div>

          {/* Etapas */}
          <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Etapas</h3>
          <div className="table-wrap" style={{ marginBottom: 20 }}>
            <table>
              <thead><tr><th>Nome</th><th>Prazo</th><th>Responsável</th><th>Status</th></tr></thead>
              <tbody>
                {relatorio.etapas.length === 0
                  ? <tr><td colSpan={4} style={{ color: 'var(--text3)', textAlign: 'center' }}>Nenhuma etapa</td></tr>
                  : relatorio.etapas.map(e => (
                    <tr key={e.id}>
                      <td>{e.nome}</td>
                      <td style={{ color: 'var(--text2)', fontSize: 12 }}>{e.prazo}</td>
                      <td>{e.responsavel || '—'}</td>
                      <td><span className={`badge ${STATUS_CLS[e.status]}`}>{e.status}</span></td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Pecas */}
          <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Peças</h3>
          <div className="table-wrap" style={{ marginBottom: 20 }}>
            <table>
              <thead><tr><th>Código</th><th>Nome</th><th>Tipo</th><th>Fornecedor</th><th>Status</th></tr></thead>
              <tbody>
                {relatorio.pecas.length === 0
                  ? <tr><td colSpan={5} style={{ color: 'var(--text3)', textAlign: 'center' }}>Nenhuma peça</td></tr>
                  : relatorio.pecas.map(p => (
                    <tr key={p.id}>
                      <td><code style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--accent)' }}>{p.codigo}</code></td>
                      <td>{p.nome}</td>
                      <td><span className={`badge ${p.tipo === 'NACIONAL' ? 'green' : 'blue'}`}>{p.tipo}</span></td>
                      <td style={{ color: 'var(--text2)' }}>{p.fornecedor}</td>
                      <td><span className={`badge ${PECA_CLS[p.status]}`}>{p.status}</span></td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Testes */}
          <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Testes</h3>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Código</th><th>Tipo</th><th>Data</th><th>Responsável</th><th>Resultado</th></tr></thead>
              <tbody>
                {relatorio.testes.length === 0
                  ? <tr><td colSpan={5} style={{ color: 'var(--text3)', textAlign: 'center' }}>Nenhum teste</td></tr>
                  : relatorio.testes.map(t => (
                    <tr key={t.id}>
                      <td><code style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--accent)' }}>{t.codigo}</code></td>
                      <td><span className="badge gray">{t.tipo}</span></td>
                      <td style={{ color: 'var(--text2)', fontSize: 12 }}>{t.data}</td>
                      <td>{t.responsavel}</td>
                      <td><span className={`badge ${RES_CLS[t.resultado]}`}>{t.resultado}</span></td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
