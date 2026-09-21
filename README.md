# Today's Weather

A single-page weather search: type a city, get today's conditions, and keep a
list of what you've looked up. Built for the Techfinity Hub frontend
assessment.

React 18 · TypeScript · Vite · Tailwind CSS v4 · shadcn/ui · TanStack Query ·
Vitest + Testing Library + MSW

## Running it

```bash
npm install
cp .env.example .env.local     # then paste your key into it
npm run dev                    # http://localhost:5173
```

A free API key comes from [openweathermap.org/api](https://openweathermap.org/api).
New keys take a few minutes to activate; until then the service returns 401
and the app says so explicitly.

| Command | Does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Typecheck then production build |
| `npm run lint` | ESLint |
| `npm run test` | Tests, watching |
| `npm run test:run` | Tests, once |