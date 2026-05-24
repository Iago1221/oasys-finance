# Integração com API Finance (multi-tenant)

## Tenant

O painel resolve o tenant **somente pelo primeiro segmento do host** do front-end:

- Front: `https://teste.minhaurlfrontend` → tenant `teste`
- API: `https://teste.{BASE_URL}` (ajuste `BASE_URL` em `src/lib/config.ts`)

Sem subdomínio (`localhost`, IP ou domínio sem prefixo), o app exibe **404**.

Em desenvolvimento local:

- Front: `http://oasys.localhost:5173` (tenant na URL do front)
- API: `http://oasys.localhost:8080` com `BASE_URL = 'localhost:8080'` em `src/lib/config.ts`
- O ERP precisa responder nesse host (virtual host / DNS local)

## Configuração da API

Edite a constante `BASE_URL` em `src/lib/config.ts` (host[:porta] do back-end, sem protocolo). O protocolo é `http` em ambiente local e `https` em produção.

## Autenticação

1. `POST https://{tenant}.{BASE_URL}/api/login` com `{ "usuario", "senha" }`
2. Guarde o token retornado em `sessionStorage`
3. Envie `oasys-token` em todas as requisições `GET/POST` para `/api/finance/*` e `/api/app/*`
4. Após o login, consulte o perfil: `GET /api/app/usuario?email={email}` (mesmo header `oasys-token`)
5. Respostas `401` / JWT expirado (`success: false`, `status: 401`) disparam logout automático e redirecionamento para `/login`

## CORS

O back-end deve permitir a origem do front-end (CORS), por tenant, quando front e API estão em portas diferentes (ex.: `:5173` → `:8080`).

## Endpoints consumidos

- Vendas: `vendaResumo`, `vendaFiscal`, `vendaPedidosRecentes`
- Financeiro: `financeiroFluxoMes`, `financeiroContasPagar`, `financeiroContasReceber`, `financeiroMovimentacoesRecentes`
- Estoque: `estoqueDepositos`, `estoqueItensAtivos` (`{ total }`), `estoqueMovimentacoesRecentes`, `estoqueProdutosSaldo` (até 20 itens ativos com menor saldo no depósito, ordenados)
- Config: `configuracao` e POSTs de integração
