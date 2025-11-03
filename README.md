# 🧾 Desafio Técnico — Integração e Normalização de Pedidos

Este projeto foi desenvolvido em **Node.js com NestJS**, com o objetivo de processar um **arquivo de pedidos legado** e retornar os dados **normalizados em formato JSON**, via API REST.

---

## 🚀 Tecnologias Utilizadas

- **Node.js**
- **NestJS**
- **TypeScript**
- **Multer** (upload de arquivo)
- **Jest** (testes)
- **Class-validator / Class-transformer** (validação de filtros)

---

## 🧠 Arquitetura

O projeto foi dividido em módulos seguindo o padrão **NestJS** e o princípio **SOLID**:
src/
├── orders/
│ ├── dto/
│ │ └── filters.dto.ts
│ ├── orders.controller.ts
│ ├── orders.service.ts
│ └── orders.module.ts
└── main.ts

- **Controller:** endpoints REST (`/upload`, `/orders`)
- **Service:** lógica de negócio (parser, normalização, filtros)
- **DTOs:** validação e tipagem dos parâmetros de filtro

---

## 📡 Endpoints

### 1️⃣ `POST /orders/upload`
Recebe um arquivo `.txt` com os pedidos legados.

**Exemplo de uso:**
POST /orders/upload
Content-Type: multipart/form-data
file: pedidos.txt

**Exemplo de arquivo:**
0000000070                              Palmer Prosacco00000007530000000003     1836.7420210308
0000000075                                  Bobbie Batz00000007980000000002     1578.5720211116
0000000049                               Ken Wintheiser00000005230000000003      586.7420210903
0000000014                                 Clelia Hills00000001460000000001      673.4920211125
0000000057                          Elidia Gulgowski IV00000006200000000000     1417.2520210919
0000000080                                 Tabitha Kuhn00000008770000000003      817.1320210612
0000000023                                  Logan Lynch00000002530000000002      322.1220210523
0000000015                                   Bonny Koss00000001530000000004        80.820210701
0000000017                              Ethan Langworth00000001690000000000      865.1820210409
0000000077                         Mrs. Stephen Trantow00000008440000000005     1288.7720211127


---

### 2️⃣ `GET /orders`
Consulta os pedidos processados.

**Filtros disponíveis:**
- `orderId` → Filtra por ID do pedido
- `dataInicio` e `dataFim` → Intervalo de data de compra (formato `YYYY-MM-DD`)

**Exemplos:**
GET /orders
GET /orders?orderId=123
GET /orders?startDate=2021-01-01&endDate=2021-12-31


---

## 🧩 Exemplo de resposta

```json
[
  {
    "user_id": 70,
    "name": "Palmer Prosacco",
    "orders": [
      {
        "order_id": 753,
        "date": "2021-03-08",
        "total": "4252.53",
        "products": [
            {
                "product_id": 3,
                "value": "1836.74"
            },
            {
                "product_id": 3,
                "value": "1009.54"
            },
            {
                "product_id": 4,
                "value": "618.79"
            },
            {
                "product_id": 3,
                "value": "787.46"
            }
        ]
      }
    ]
  }
]

🧰 Execução
# Instalar dependências
npm install

# Rodar servidor
npm run start:dev

# Rodar testes
npm run test

Servidor disponível em:
👉 http://localhost:3000/orders

💡 Decisões Técnicas

Utilização do NestJS de acordo com o anúncio da vaga.

Parser baseado em substring por colunas fixas conforme solicitado no teste.

Agrupamento feito em memória usando Map para O(1) acesso.

Testes unitários que validam o funcionamento do código conforme esperado.

Foco no simples — nenhuma dependência extra desnecessária.

Persistência em memória conforme solicitado no teste.

🧑‍💻 Autor

Desenvolvido por Fernando Pedro