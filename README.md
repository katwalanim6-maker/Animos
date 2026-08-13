# Anim OS

Anim OS is a lightweight personal digital-identity workspace built with HTML, CSS and vanilla JavaScript.

## Features

- Firebase email/password authentication
- Firestore-backed profile and links
- Cloudinary profile image uploads
- AI Anim chat through the separate Anim Core API
- Admin dashboard pages
- Responsive dark UI
- PWA manifest and app icons

## Architecture

```text
GitHub Pages (Animos)
  ├── Authentication → Firebase Auth
  ├── Data → Firestore
  ├── Images → Cloudinary
  └── AI Chat → Anim Core → Gemini
```

## AI backend

The `backend/` directory contains a deployable Node/Express version of the AI API. The production frontend currently calls `https://anim-core.onrender.com/chat` so the Gemini secret remains server-side.

Required backend environment variables:

- `GEMINI_API_KEY`
- `PORT`
- `ALLOWED_ORIGINS`

Never commit a real API key to this repository.

## Firebase

Authentication and Firestore must be enabled in the Firebase project. The deployed `js/firebase.js` file must contain the correct public Firebase configuration for the project.

## Local frontend

Open the repository through a local static server rather than `file://` so ES modules and Firebase requests work correctly.
