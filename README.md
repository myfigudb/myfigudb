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

This repository adopts a **monorepo** architecture, clearly separated into `client/` and `server/` directories. This setup ensures a unified development workflow while maintaining a strict separation of concerns between the frontend and backend.

### Backend Architecture (`server/`)
#### Module Structure
Each domain or feature within the server is encapsulated into its own module. Instead of sub-folders, the architecture relies on a strict file naming convention within the module's directory. A standard feature module (for example, `figure`) consists of the following files:

* `*.routes.ts`: Defines the API endpoints and routes them to the appropriate controller.
* `*.controller.ts`: Handles incoming HTTP requests and manages the HTTP responses.
* `*.service.ts`: Contains the core business logic and feature implementation.
* `*.repository.ts`: Manages data access, queries, and database interactions.
* `*.dto.ts`: (Data Transfer Objects) Defines the expected data structures and validation rules for payloads.
* `*.docs.ts`: Contains the API documentation configurations for the module's endpoints.

#### Core Module
Alongside the feature-specific modules, there is a traditional `core/` module. This encapsulates the foundational elements of the application, centralizing base configurations, shared utilities, and common abstractions used throughout the entire monolith.


## OpenAPI
We utilize **Zod** as the Single Source of Truth (SSOT) for both runtime request validation and API documentation. Instead of manually maintaining separate YAML files, the OpenAPI specification is generated programmatically from our Zod schemas.

This approach guarantees that:
1.  **Consistency:** The documentation always matches the actual validation logic (e.g., if a field becomes required in the schema, it updates in the docs).
2.  **Type Safety:** TypeScript types are inferred directly from the validation schemas, reducing code duplication.

Schemas are registered in the OpenAPI registry located in each mdoules.
