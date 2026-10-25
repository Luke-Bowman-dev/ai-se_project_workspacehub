# WorkspaceHub

WorkspaceHub is a project in TripleTen's AI Software Engineering program. It is a full-stack MERN application built with TypeScript on both the client and server. It supports multi-tenant organizations, role-based access, projects, tasks, bookings, and per-organization feature flags.

## Live Link

[Live Website](https://ai-se-project-workspacehub-e3sl-git-work-03aa54-luke-bowman-dev.vercel.app/)

## Features Added to Original Repo

- all inline type annotations are changed into reusable defined types.
- task count was added to projects
- added example file with examples of various models for mock data testing
- added Members card to dashboard that lists all members in the org, and their emails and roles
- separated load failures and action failures into two different error states
- added live validation to submission forms
- hidden ui elements from users who lack the necessary role
- added prettier and eslint formatting and a script to automatically check and format code
- added vitest and some test files to test helper functions
- implemented continous integration
- implemented a new Comment feature that allows creating, editing, deleting comments on each task
- reconfigured project to work when deployed via Vercel and MongoDB Atlas

## Starting stack

- React + Vite + TypeScript
- Tailwind CSS
- Node.js + Express + TypeScript
- MongoDB + Mongoose
- JWT authentication
- Context API for client state
- Vercel

## Project Structure

```text
workspacehub/
  client/
  server/
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment examples and fill them in:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Recommended local values:

```env
# server/.env
PORT=5001
MONGODB_URI=mongodb://127.0.0.1:27017/workspacehub
JWT_SECRET=super-secret-jwt-key
CLIENT_ORIGIN=http://localhost:5173
```

```env
# client/.env
VITE_API_URL=http://localhost:5001
```

3. Start MongoDB locally or point `MONGODB_URI` at an existing instance.

4. Seed demo data:

```bash
npm run seed
```

5. Run the server and client in separate terminals:

```bash
npm run dev:server
npm run dev:client
```

## Demo Users

The seed script creates one organization with these users:

- `owner@workspacehub.dev` / `Password123!`
- `admin@workspacehub.dev` / `Password123!`
- `member@workspacehub.dev` / `Password123!`

## Scripts

- `npm run dev:server`
- `npm run dev:client`
- `npm run build`
- `npm run seed`

## Notes

- All protected API responses follow the same JSON envelope:

```json
{
  "success": true,
  "data": {},
  "error": null
}
```

- The booking overlap rule is isolated in the booking service.
- Feature-flag checks are isolated in a reusable middleware/service path.
- Permission logic is centralized in auth and permission helpers.
