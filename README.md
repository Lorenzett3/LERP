# LERP

ERP de portfólio inspirado em arquitetura SAP para operações de varejo. O projeto usa Angular no frontend, NestJS no backend e uma base preparada para evoluir para PostgreSQL com TypeORM.

## Módulos

- Autenticação: login demonstrativo, perfis e autorizações no estilo ERP.
- Painel: KPIs executivos, fluxo SD em gráfico por etapas, análises por canal/categoria/estoque, indicadores operacionais e alertas roláveis com ação de verificação.
- Produtos: cadastro mestre de materiais, categorias, preço, estoque e ações de visualizar, editar e deletar.
- Pedidos: pedidos de venda com criação, edição, exclusão e fluxo de status.
- Estoque: movimentos MM de entrada, saída e ajuste.

## Interface

- Navegação responsiva para desktop, tablet e celular.
- Grids operacionais com pesquisa por "contém" ou "igual", paginação automática e ações por linha.
- Dashboard organizado em linhas operacionais: KPIs, saúde de estoque, vendas por canal, valor por categoria, fluxo SD, indicadores SD/MM e listas finais de alertas/documentos.
- Interface padronizada em português brasileiro, com rótulos traduzidos para status, canais, movimentos e ações operacionais.
- Cards no mobile para substituir tabelas largas.
- Snackbars de sucesso e erro no canto inferior direito.
- Dialogs de criação, visualização e edição para materiais, pedidos e movimentos.

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
