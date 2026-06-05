import { useState, useEffect } from 'react'
import { api } from '../services/api'

export default function Relatorios() {
  const [aeronaves, setAeronaves]   = useState([])
  const [aeronaveId, setAeronaveId] = useState('')
  const [relatorio, setRelatorio]   = useState(null)
  const [loading, setLoading]       = useState(false)

  useEffect(() => {
    api.getAeronaves().then(data => setAeronaves(data || [])).catch(e => console.error(e))
  }, [])

  async function gerar() {
    if (!aeronaveId) return
    setLoading(true)
    try {
      // Como a AV2 não possuía rota de relatório aglutinada, puxamos do banco e cruzamos localmente
      const [todasPecas, todasEtapas, todosTestes] = await Promise.all([
        api.getPecas(), api.getEtapas(), api.getTestes()
      ])
      const aero   = aeronaves.find(a => a.id === aeronaveId)
      const pecas  = (todasPecas || []).filter(p => p.aeronaveId === aeronaveId)
      const etapas = (todasEtapas || []).filter(e => e.aeronaveId === aeronaveId)
      const testes = (todosTestes || []).filter(t => t.aeronaveId === aeronaveId)
      
      setRelatorio({ aero, pecas, etapas, testes, geradoEm: new Date().toLocaleString('pt-BR') })
    } catch (e) {
      alert('Erro ao extrair do Cofre: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  function exportar() {
    if (!relatorio) return
    const { aero, pecas, etapas, testes, geradoEm } = relatorio
    const linhas = [
      '='.repeat(60), 'RELATÓRIO FINAL — SISTEMA AEROCODE', '='.repeat(60),
      `Gerado em: ${geradoEm}`, '',
      '── AERONAVE ──────────────────────────────────────────',
      `Código      : ${aero.codigo}`, `Modelo      : ${aero.modelo}`,
      `Tipo        : ${aero.tipo}`,   `Fabricante  : ${aero.fabricante}`,
      `Status      : ${aero.status}`, '',
      '── ETAPAS ────────────────────────────────────────────',
      ...etapas.map(e => `  [${e.status.padEnd(12)}] ${e.nome} | Responsável: ${e.responsavel || '—'} | Prazo: ${e.prazo}`), '',
      '── PEÇAS ─────────────────────────────────────────────',
      ...pecas.map(p => `  [${p.status.padEnd(14)}] ${p.codigo} — ${p.nome} (${p.tipo}) | ${p.fornecedor}`), '',
      '── TESTES ────────────────────────────────────────────',
      ...testes.map(t => `  [${t.resultado.padEnd(10)}] ${t.codigo} — ${t.tipo} | Data: ${t.data} | Resp: ${t.responsavel}`), '',
      '='.repeat(60), 'FIM DO RELATÓRIO',
    ]
    const blob = new Blob([linhas.join('\n')], { type: 'text/plain;charset=utf-8' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = `relatorio_BD_${aero.codigo}.txt`; a.click()
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
        <h2 className="section-title" style={{ marginBottom: 16 }}>Gerar Relatório Criptografado</h2>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <label>Selecionar Aeronave (Banco de Dados)</label>
            <select value={aeronaveId} onChange={e => { setAeronaveId(e.target.value); setRelatorio(null) }}>
              <option value="">— Selecionar —</option>
              {aeronaves.map(a => <option key={a.id} value={a.id}>{a.codigo} — {a.modelo}</option>)}
            </select>
          </div>
          <button className="btn btn-primary" onClick={gerar} disabled={!aeronaveId || loading}>
            {loading ? 'Extraindo...' : 'Gerar Relatório'}
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 24 }}>
            {[
              ['Modelo', relatorio.aero.modelo], ['Fabricante', relatorio.aero.fabricante],
              ['Tipo', relatorio.aero.tipo], ['Status', relatorio.aero.status],
            ].map(([k, v]) => (
              <div key={k} style={{ background: 'var(--surface2)', borderRadius: 'var(--radius)', padding: '10px 14px' }}>
                <div style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 4 }}>{k}</div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{v}</div>
              </div>
            ))}
          </div>

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