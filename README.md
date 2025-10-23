# Modern Job Portal

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3-blue?logo=tailwind-css)
![Vite](https://img.shields.io/badge/Vite-4.3-purple?logo=vite)

A sleek, modern job search platform built with React, TypeScript, and Tailwind CSS — designed to help job seekers find opportunities quickly and manage their application journey with ease. Features include advanced filtering, application tracking, interview scheduling, and a seamless user experience powered by Clerk authentication.

---

## 🌐 Live Demo

[🔗 Live Demo](https://yourapp.vercel.app) *(replace with your actual deployed link)*

---

## ✨ Key Features

- 🔐 **Secure Authentication** — User login & management powered by Clerk
- 🔍 **Smart Job Search** — Filter by location, type, category, and skills
- 💼 **Application Tracker** — Save jobs and monitor application status
- 📅 **Interview Scheduler** — Built-in calendar for upcoming interactions
- 🎯 **Personalized Dashboard** — Tailored experience for logged-in users
- 📱 **Fully Responsive** — Smooth experience on any device
- ⚡ **Optimized Performance** — Vite delivers fast dev & production builds
- 🎨 **Modern UI/UX** — Professional look with clean animations

---

## 🛠 Tech Stack

| Layer | Technologies |
|-------|--------------|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS, shadcn/ui |
| State | Redux Toolkit, Redux Persist |
| Routing | React Router v6 |
| Data Fetching | TanStack Query (React Query) |
| Forms | React Hook Form + Zod |
| Auth | Clerk |
| Icons | Lucide React |
| Notifications | Sonner |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm 8+ (or Yarn)

### Installation

```bash
git clone https://github.com/samuelNugusu/job-portal.git
cd job-portal
npm install
npm run dev

📁 Folder Structure
src/
├── components/         
│   ├── ui/             
│   ├── layout/        
│   └── jobs/          
├── pages/             
├── store/             
├── hooks/             
├── lib/               
├── types/             
└── styles/            
assets/
└── screenshots/       # Add your screenshots here

🔧 Environment Variables

Create .env.local in project root:

VITE_CLERK_PUBLISHABLE_KEY=
VITE_CLERK_SECRET_KEY=
VITE_API_URL=

📌 Roadmap

✅ User authentication

✅ Job search & filters

✅ Application tracking

⏳ Employer dashboard

⏳ Real API integration

⏳ Resume upload system

📄 License

MIT License — feel free to explore, learn, and build on top of this project.

🙋‍♂️ Author

Samuel Nugusu
Frontend Developer · React & TypeScript
GitHub: https://github.com/samuelNugusu

LinkedIn: (add your link here)


---

Next steps after you paste this:  

1. Add some **screenshots** in `assets/screenshots/`  
2. Replace the **Live Demo link** when deployed  
3. Commit and push:

```bash
git add README.md assets/screenshots/
git commit -m "add polished README with badges and screenshots"
git push
