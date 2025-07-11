# Cidade Saúde Digital

Projeto unificado de gestão em saúde pública com backend em **Spring Boot** e frontend em **Vite/React**.

## 📦 Estrutura do Projeto

```
cidade-saude-digital/
├── backend/         → Aplicação Spring Boot
├── frontend/        → Aplicação Vite/React
├── docker-compose.yml
├── .gitignore
├── .env.example
└── README.md
```

---

## 🚀 Como rodar o projeto

### ▶️ Usando Docker (recomendado)

> Certifique-se de ter Docker e Docker Compose instalados.

```bash
docker-compose up --build
```

- Backend: http://localhost:5011
- Frontend: http://localhost:5173
- Banco de dados PostgreSQL: porta 5432

---

### 💻 Rodar manualmente (modo desenvolvedor)

#### Backend (Spring Boot)

```bash
cd backend
./mvnw spring-boot:run
```

#### Frontend (Vite)

```bash
cd frontend
npm install
npm run dev
```

---

## 🔐 Variáveis de Ambiente

Crie um arquivo `.env` na raiz baseado em `.env.example`.

## 📄 Licença

Projeto desenvolvido para fins públicos e educacionais.
