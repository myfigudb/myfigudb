<p align="center"><a target="_blank"><img src="https://raw.githubusercontent.com/myfigudb/.github/main/assets/banners/repositories/r_myfigudb_banner.png" alt="MyFiguDB Banner"></a></p>

## About MyFiguDB

This repository (`/myfigudb`) serves as the central hub of the MyFiguDB ecosystem. It contains the primary source code, handling the backend logic, database interactions, and API definitions necessary for the figure collection management platform.

## Coding Standards

To maintain consistency across the codebase, the following conventions are enforced:

* **Variable Naming:** `snake_case`
* **Function Naming:** `camelCase`
* **Class & Interface Naming:** `PascalCase`
* **Class & Interface Naming files:** `camelCase`
* **Database column Naming:** `snake_case`

## Project Structure
This repository adopts a **monorepo** architecture. Separated into `server/` and `client/` directories.
This setup ensures a unified development workflow and separation of concerns.

```text
myfigudb/
├── client/  
├── server/                  
│   ├── prisma/              # Database schema and migrations
│   └── src/
│       ├── config/          # Environment and application configuration
│       ├── controllers/     # Request handlers (input validation/response formatting)
│       ├── docs/            # OpenAPI/Swagger definitions
│       ├── interfaces/      # Zod definitions
│       ├── middlewares/     # Express middlewares (auth, logging, etc.)
│       ├── routes/          # API route definitions
│       ├── services/        # Core logic
│       ├── worker/          # Background job processors
│       ├── app.ts          
│       └── index.ts         
├── docker-compose.yml       # Container orchestration (App, DB, Redis)
└── ...
```

## OpenAPI
We utilize **Zod** as the Single Source of Truth (SSOT) for both runtime request validation and API documentation. Instead of manually maintaining separate YAML files, the OpenAPI specification is generated programmatically from our Zod schemas.

This approach guarantees that:
1.  **Consistency:** The documentation always matches the actual validation logic (e.g., if a field becomes required in the schema, it updates in the docs).
2.  **Type Safety:** TypeScript types are inferred directly from the validation schemas, reducing code duplication.

Schemas are registered in the OpenAPI registry located in `server/src/docs`.
