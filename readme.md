Ecostudent 🌱

A location-aware, AI-powered web platform for students to buy, sell, exchange, or donate books, uniforms, and educational items.

🚀 Quick start

Clone, install, and run locally:

git clone https://github.com/<your-org>/ecostudent.git
cd ecostudent

# frontend
cd frontend
npm install
npm run dev    # http://localhost:3000

# backend (new terminal)
cd ../backend
npm install
npm run dev    # http://localhost:8000


Create a .env in both frontend and backend using the example files:

cp .env.example .env


Fill in DB_URL, JWT_SECRET, GOOGLE_MAPS_API_KEY, JAZZCASH_* and EASYPAY_* keys.

🧩 Features (Interactive)

✅ User auth (signup / login / roles)

📚 Item listing: book, uniform, other educational items

🧭 Location-based search & nearby detection

🧠 AI: image categorization & recommendations (TensorFlow / HuggingFace)

💬 Real-time chat & voice (Socket.io)

💳 Secure payments (JazzCash, Easypaisa)

⭐ Ratings & feedback

🔧 Admin panel (moderation, analytics)

🧪 Try the demo (locally interactive)

Open the frontend and use the sample account below:

Email: demo@ecostudent.test
Password: DemoPass123


Or create a new account and list an item. Use the “Nearby” filter to find listings within a radius.

📁 Project structure
/ecostudent
├─ frontend/      # Next.js + Tailwind
├─ backend/       # NestJS + Prisma + PostgreSQL
├─ ai/            # Models + training scripts (TensorFlow / HuggingFace)
├─ infra/         # Deployment scripts, nginx, docker-compose
└─ docs/          # Design docs, SRS, diagrams

🛠️ Scripts & useful commands

From project root:

npm run lint — run linters

npm run test — run tests (frontend/backend)

docker-compose up — run full stack locally with DB & services

prisma migrate dev — apply DB migrations (backend)

👥 Invite collaborators / add a team (hint)

To invite a collaborator:

Go to your repository → Settings → Manage access → Invite a collaborator.

Enter GitHub username/email and send invite.

To add a team (Organization):

Org → Teams → select team → Repositories → Add repository → set permission.

♻️ How to contribute (interactive checklist)

Fork the repo ✅

Create a branch: git checkout -b feat/your-feature ✅

Run tests & lint locally ✅

Open a Pull Request with description and screenshots ✅

Please follow the commit message convention: type(scope): short description (e.g., feat(auth): add refresh token).

🔐 Security & env

Keep secrets in .env. Do not commit API keys or credentials. Use GitHub Secrets for CI/CD.

📦 Deployment

We recommend:

Frontend: Vercel (automatic from main)

Backend: VPS or cloud server (Docker / Docker Compose)

Storage: Google Cloud Storage or S3

DB: Managed PostgreSQL (or Docker Postgres for dev)

📚 Resources & links

Proposal / docs: docs/Proposal.pdf

Figma designs: (link to your Figma project)

API docs: backend/docs/swagger.yaml (auto-generated)

🧾 License

MIT — see LICENSE.

✉️ Contact

Maintainer: Muhammad Bilal Khan
Email: bilalkhan751150@gmail.com
Repo: https://github.com/codecraftbilal/ecostudent