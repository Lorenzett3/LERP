# LERP

ERP de portfolio inspirado em arquitetura SAP/Retail, construido com Angular, TypeScript, NestJS e base preparada para PostgreSQL/TypeORM.

## Modulos

- Authentication: login demo, roles e autorizacoes estilo ERP.
- Products: cadastro mestre de materiais, categorias, preco e estoque.
- Orders: pedidos de venda com workflow operacional.
- Inventory: movimentos MM de entrada, saida e ajuste.
- Dashboard: KPIs, alertas de reposicao e funil de status.

## Como rodar

```bash
npm run backend
npm run frontend
```

Depois acesse `http://localhost:4200`. A API roda em `http://localhost:3000/api`.

Se uma porta ficar presa por um processo antigo, rode:

```bash
npm run stop:ports
```

Ou suba limpando as portas antes:

```bash
npm run backend:clean
npm run frontend:clean
```

## Proximos passos bons para portfolio

- Persistir entidades com PostgreSQL e TypeORM.
- Criar guards reais por role e JWT.
- Adicionar migrations e seeds.
- Colocar Docker Compose para banco e API.
- Escrever testes e2e para fluxos de pedido e estoque.
