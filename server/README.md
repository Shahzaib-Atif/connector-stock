# Connector-Stock — Server

This folder contains the NestJS server for the Connector-Stock project. The application is built with NestJS and uses Prisma in a DB-first (introspect) workflow: the canonical schema is the production database and this repository only pulls (introspects) the schema — it must never push schema changes to the DB.

## Project setup

Install dependencies:

```bash
npm install
```

Create a `.env` file at the project root with your `DATABASE_URL`. Example:

```env
# .env
DATABASE_URL="postgresql://user:password@host:5432/dbname"
```

Prisma schema is located at `prisma/schema.prisma` and is owned by the database. Do not manually edit it unless you know what you are doing.

## Prisma — DB-first workflow (pull-only)

This repository follows a DB-first workflow. Use Prisma's introspection to sync the local `schema.prisma` from the database. Do NOT use `prisma db push` or run migrations from this repo.

- Pull the schema from the database (introspect):

```bash
npx prisma db pull --schema=prisma/schema.prisma
```

- After pulling, regenerate the Prisma Client:

```bash
npx prisma generate
```

Notes and best practices:
- `prisma db pull` updates `prisma/schema.prisma` to match the current database structure.
- Avoid `prisma db push`, `prisma migrate dev`, or creating migrations here — those commands can overwrite or alter the production DB schema. If you need schema changes, coordinate with your DBA or the team that manages the central DB and apply changes from the authoritative source.
- If you must inspect the schema without changing files, run `npx prisma db pull --print` to print the introspected schema.

## Run the server

- Development (watch mode):

```bash
npm run start:dev
```

- Production:

```bash
npm run build
npm run start:prod
```

## Where to look in this repo

- API controllers: `src/controllers`
- Services: `src/services`
- Repositories: `src/repository`
- Prisma schema: `prisma/schema.prisma`

## Resources

- NestJS docs: https://docs.nestjs.com
- Prisma introspection docs: https://www.prisma.io/docs/concepts/components/introspection
