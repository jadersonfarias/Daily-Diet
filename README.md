# API de Gerenciamento de Refeições

Esta API foi desenvolvida para que o usuário possa gerenciar suas refeições de forma simples e prática.

### tecnologias utilizadas

* Node.Js
* Fastify
* knex
* zod
* Typescript


---

## 🧭 Como rodar o projeto

1. **Instale as dependências:**

   ```bash
   npm install

2. **Crie e preencha as variáveis de ambiente no arquivo .env:**
   ```bash
   cp .env.example .env

3. **Rode o projeto:**
   ```bash
    # Copiar código
      npm run dev

## RF (Requisitos Funcionais)
* Deve ser possível criar um usuário.
* Deve ser possível registrar uma refeição feita, com as seguintes informações (as refeições devem ser relacionadas a um usuário):
* Nome
* Descrição
* Data e Hora
* Está dentro ou não da dieta
* Deve ser possível editar uma refeição, podendo alterar todos os dados acima.
* Deve ser possível apagar uma refeição.
* Deve ser possível listar todas as refeições de um usuário.
* Deve ser possível visualizar uma única refeição.
* Deve ser possível recuperar as métricas de um usuário:
* Quantidade total de refeições registradas.
* Quantidade total de refeições dentro da dieta.
* Quantidade total de refeições fora da dieta.
* Melhor sequência por dia de refeições dentro da dieta.

## RN (Regras de Negócio)

* Deve ser possível identificar o usuário entre as requisições.
* O usuário só pode visualizar, editar e apagar as refeições que ele criou.
