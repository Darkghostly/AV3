// src/data/store.js  — estado global mock (substitui banco de dados)
import { useState } from 'react'

export const INITIAL_AERONAVES = [
  { id: 1, codigo: 'AC-001', modelo: 'Boeing 737-800', tipo: 'COMERCIAL', fabricante: 'Boeing',    capacidade: 162, alcance: 5765, status: 'EM_PRODUCAO' },
  { id: 2, codigo: 'AC-002', modelo: 'F-16 Fighting Falcon', tipo: 'MILITAR', fabricante: 'Lockheed Martin', capacidade: 1, alcance: 3200, status: 'EM_PRODUCAO' },
  { id: 3, codigo: 'AC-003', modelo: 'Airbus A320 Neo',  tipo: 'COMERCIAL', fabricante: 'Airbus',      capacidade: 180, alcance: 6300, status: 'CONCLUIDA' },
  { id: 4, codigo: 'AC-004', modelo: 'C-130J Super Hercules', tipo: 'MILITAR', fabricante: 'Lockheed Martin', capacidade: 92, alcance: 6852, status: 'PENDENTE' },
]

export const INITIAL_PECAS = [
  { id: 1, codigo: 'P-001', nome: 'Motor CFM56-7B', tipo: 'IMPORTADA', fornecedor: 'CFM International', aeronaveId: 1, status: 'PRONTA' },
  { id: 2, codigo: 'P-002', nome: 'Asa Direita', tipo: 'NACIONAL', fornecedor: 'Aeroparts BR', aeronaveId: 1, status: 'EM_PRODUCAO' },
  { id: 3, codigo: 'P-003', nome: 'Trem de Pouso Principal', tipo: 'IMPORTADA', fornecedor: 'Safran', aeronaveId: 2, status: 'EM_TRANSPORTE' },
  { id: 4, codigo: 'P-004', nome: 'Fuselagem Secao 2', tipo: 'NACIONAL', fornecedor: 'Embraer Parts', aeronaveId: 3, status: 'PRONTA' },
  { id: 5, codigo: 'P-005', nome: 'Avionics Suite', tipo: 'IMPORTADA', fornecedor: 'Honeywell', aeronaveId: 2, status: 'EM_PRODUCAO' },
]

export const INITIAL_ETAPAS = [
  { id: 1, nome: 'Estrutura Base',    aeronaveId: 1, status: 'CONCLUIDA',    prazo: '2025-02-10', responsavel: 'Ana Lima' },
  { id: 2, nome: 'Montagem da Asa',   aeronaveId: 1, status: 'EM_ANDAMENTO', prazo: '2025-04-20', responsavel: 'Carlos Souza' },
  { id: 3, nome: 'Instalacao Motor',  aeronaveId: 1, status: 'PENDENTE',     prazo: '2025-05-30', responsavel: 'Pedro Moraes' },
  { id: 4, nome: 'Pintura Externa',   aeronaveId: 1, status: 'PENDENTE',     prazo: '2025-06-15', responsavel: '' },
  { id: 5, nome: 'Cabine do Piloto',  aeronaveId: 2, status: 'EM_ANDAMENTO', prazo: '2025-04-25', responsavel: 'Ana Lima' },
  { id: 6, nome: 'Sistema Hidraulico',aeronaveId: 3, status: 'CONCLUIDA',    prazo: '2025-01-20', responsavel: 'Carlos Souza' },
]

export const INITIAL_TESTES = [
  { id: 1, codigo: 'T-001', tipo: 'ELETRICO',     aeronaveId: 1, data: '2025-03-15', resultado: 'APROVADO',  responsavel: 'Ana Lima' },
  { id: 2, codigo: 'T-002', tipo: 'HIDRAULICO',    aeronaveId: 2, data: '2025-03-18', resultado: 'REPROVADO', responsavel: 'Carlos Souza' },
  { id: 3, codigo: 'T-003', tipo: 'AERODINAMICO',  aeronaveId: 1, data: '2025-04-02', resultado: 'APROVADO',  responsavel: 'Ana Lima' },
  { id: 4, codigo: 'T-004', tipo: 'HIDRAULICO',    aeronaveId: 3, data: '2025-01-10', resultado: 'APROVADO',  responsavel: 'Pedro Moraes' },
]

export const INITIAL_FUNCIONARIOS = [
  { id: 1, matricula: 'admin', nome: 'Carlos Souza',  email: 'c.souza@aerocode.com',  nivel: 'ADMINISTRADOR' },
  { id: 2, matricula: 'eng01', nome: 'Ana Lima',      email: 'a.lima@aerocode.com',   nivel: 'ENGENHEIRO' },
  { id: 3, matricula: 'op01',  nome: 'Pedro Moraes',  email: 'p.moraes@aerocode.com', nivel: 'OPERADOR' },
]
