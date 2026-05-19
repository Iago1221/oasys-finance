# Integração com API Finance (multi-tenant)

## Tenant

O painel resolve o tenant **somente pelo primeiro segmento do host** do front-end (não há tenant em variável de ambiente):

- Front: `https://teste.minhaurlfrontend` → tenant `teste`
- API: `https://teste.urldobackend` (configure `VITE_API_ROOT_DOMAIN=urldobackend`)

Sem subdomínio (`localhost`, IP ou domínio sem prefixo), o app exibe **404**.

Em desenvolvimento local:

- Front: `http://oasys.localhost:5173` (tenant na URL do front)
- API direta: `http://oasys.localhost:8080` (`VITE_API_ROOT_DOMAIN=localhost:8080`, `VITE_API_PROTOCOL=http`)
- O ERP precisa responder nesse host (virtual host / DNS local); o tenant vem do header `Host`

Use `VITE_API_PROTOCOL=http` no `.env` — o ERP local não costuma ter HTTPS.

## Variáveis de ambiente

Copie `.env.example` para `.env.local` e ajuste os valores.

## Autenticação

1. `POST https://{tenant}.{dominio}/api/login` com `{ "login", "password" }`
2. Guarde o token retornado em `sessionStorage`
3. Envie `oasys-token` em todas as requisições `GET/POST` para `/api/finance/*`

## CORS

O back-end deve permitir a origem do front-end (CORS), por tenant, quando front e API estão em portas diferentes (ex.: `:5173` → `:8080`).

## Endpoints consumidos

- Vendas: `vendaResumo`, `vendaFiscal`, `vendaPedidosRecentes`
- Financeiro: `financeiroFluxoMes`, `financeiroContasPagar`, `financeiroContasReceber`, `financeiroMovimentacoesRecentes`
- Estoque: `estoqueDepositos`, `estoqueItensAtivos`, `estoqueMovimentacoesRecentes`, `estoqueProdutosSaldo`
- Config: `configuracao` e POSTs de integração
