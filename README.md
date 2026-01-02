# flexi_decision_backend

Express + Knex backend scaffold for FlexiDecision. Provides auth (register/login), boards, feedback, roadmap APIs, migrations with soft-delete support.

Quickstart:
1. Copy .env.example to .env and set DATABASE_URL
2. npm install
3. npx knex --knexfile ./knexfile.ts migrate:latest
4. npm run dev
