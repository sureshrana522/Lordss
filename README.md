
# LORD’S BESPOKE TAILOR SYSTEM 2025

A premium Tailoring Management System built with React, Vite, and Firebase. Designed for managing orders, workers (karigars), and customer tracking with a Black x Gold luxury theme.

## 🚀 Features

- **Role Based Access:** Admin, Manager, Cutting Master, Tailors, Finishing, Delivery.
- **Order Tracking:** Live status from Booking to Delivery.
- **Wallets & Accounting:** Automated commission calculation for workers.
- **Magic Matrix:** Network marketing style income distribution logic.
- **PWA Ready:** Installable on mobile devices.

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS
- **Icons:** Lucide React
- **Database:** Firebase Firestore (configured in `src/services/firebase.ts`)

## 📂 Folder Structure for GitHub/Vercel

Ensure your files are organized as follows:

```
/
├── public/
│   ├── manifest.json
│   └── sw.js
├── src/
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── services/
│   ├── App.tsx
│   ├── index.tsx
│   └── types.ts
├── index.html
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## ⚡ Deployment (Vercel)

1. Upload this folder to GitHub.
2. Go to Vercel.com -> Add New Project.
3. Select the Repository.
4. **Framework Preset:** Vite
5. **Root Directory:** `./`
6. Click **Deploy**.

## 🔧 Local Development

1. `npm install`
2. `npm run dev`
