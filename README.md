# LERP

ERP de portfólio inspirado em arquitetura SAP para operações de varejo. O projeto usa Angular no frontend, NestJS no backend e uma base preparada para evoluir para PostgreSQL com TypeORM.

## Módulos

- Autenticação: login demonstrativo, perfis e autorizações no estilo ERP.
- Painel: KPIs, alertas de reposição e fluxo operacional.
- Produtos: cadastro mestre de materiais, categorias, preço, estoque e ações de visualizar, editar e deletar.
- Pedidos: pedidos de venda com criação, edição, exclusão e fluxo de status.
- Estoque: movimentos MM de entrada, saída e ajuste.

## Como Rodar

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

## Comandos Úteis

```bash
npm run build
npm run test:backend
```

## Próximos Passos

- Persistir entidades com PostgreSQL e TypeORM.
- Criar autenticação JWT e guards reais por perfil.
- Adicionar migrations e seeds.
- Colocar Docker Compose para banco e API.
- Escrever testes e2e para fluxos de pedido e estoque.
