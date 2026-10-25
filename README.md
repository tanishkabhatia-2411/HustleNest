# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

## Demo authentication and data

HustleNest provides demo student and recruiter sign-in flows. User profiles, jobs, applications, saved jobs, and CVs are stored in the browser's `localStorage`; fresh visitors start signed out. Frontend route guards and account-scoped views are for demonstration only and are not security boundaries.

Do not use this implementation to protect real accounts or sensitive application data. A production deployment requires a backend that authenticates users, authorizes roles and record ownership on every request, and stores passwords using an appropriate password-hashing scheme. Never store plaintext passwords in the browser.
