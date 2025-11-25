# DoxTok Server

Backend server for DoxTok, built with Bun, ElysiaJS, and Drizzle ORM.

## Technology Stack

The project uses a modern and efficient technology stack:

- **Runtime & Package Manager:** [Bun](https://bun.sh/) - A fast all-in-one JavaScript runtime.
- **Web Framework:** [ElysiaJS](https://elysiajs.com/) - A fast, and type-safe web framework for Bun.
- **Database:** [SQLite](https://www.sqlite.org/) - A C-language library that implements a small, fast, self-contained, high-reliability, full-featured, SQL database engine.
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/) - A lightweight and type-safe ORM.
- **AI & LLM Integration:**
  - [LangChain](https://js.langchain.com/) & [LlamaIndex](https://www.llamaindex.ai/) - Frameworks for building LLM applications.
  - [Ollama](https://ollama.com/) - For running local LLMs.
  - [ChromaDB](https://www.trychroma.com/) - Vector database for RAG (Retrieval-Augmented Generation).
- **Language:** [TypeScript](https://www.typescriptlang.org/) - For static type checking.

### Usage Assessment

The technology stack is utilized effectively:

- **Modular Architecture:** The code is well-structured with separate modules for sessions, documents, and chats, promoting maintainability.
- **Type Safety:** Extensive use of TypeScript and Elysia's schema validation (`t.Object`, `t.File`) ensures robust type safety and input validation.
- **Modern ORM:** Drizzle ORM is used correctly for schema definition and migrations with SQLite.
- **Error Handling:** A centralized error handling mechanism in `index.ts` manages validation and runtime errors gracefully.

## Database Schema

The database consists of two main tables defined in `src/lib/drizzle/schema.ts`:

### `Documents`

Stores metadata about uploaded documents.

- `id`: Integer (Primary Key, Auto-increment)
- `sessionId`: Text (Not Null) - Links the document to a user session.
- `referenceName`: Text (Not Null, Unique) - Internal reference name for the file.
- `originalName`: Text (Not Null) - Original filename uploaded by the user.
- `createdAt`: Timestamp (Not Null, Default: Current Time)

### `Chats`

Stores the chat history between the user and the RAG system.

- `id`: Integer (Primary Key, Auto-increment)
- `sessionId`: Text (Not Null) - Links the chat to a user session.
- `question`: Text (Not Null) - The user's query.
- `answer`: Text - The AI's response.
- `createdAt`: Timestamp (Not Null, Default: Current Time)
- `updatedAt`: Timestamp (Not Null, Default: Current Time, Updates on change)

## API Endpoints

The API is structured around three main resources: Sessions, Documents, and Chats.

### Sessions (`/sessions`)

Manage user sessions.

- **GET /**: Retrieve session creation time.
  - _Auth_: Session cookie required.
- **POST /**: Create a new session and upload initial documents.
  - _Body_: `documents` (Files, 1-3 allowed).
  - _Response_: Sets a session cookie.
- **DELETE /**: Delete the current session and all associated files.
  - _Auth_: Session cookie required.

### Documents (`/documents`)

Manage documents within a session.

- **GET /urls**: Get a list of URLs for documents in the current session.
  - _Auth_: Session cookie required.
- **GET /:referenceName**: Download a specific document by its reference name.
  - _Auth_: Session cookie required.
- **POST /**: Add a single document to the existing session.
  - _Body_: `sessionId` (String), `document` (File).
  - _Auth_: Session cookie required.
- **DELETE /:referenceName**: Remove a specific document from the session.
  - _Auth_: Session cookie required.

### Chats (`/chats`)

Interact with the RAG system.

- **GET /**: Retrieve chat history for the current session.
  - _Auth_: Session cookie required.
- **POST /**: Send a question to the AI.
  - _Body_: `question` (String).
  - _Auth_: Session cookie required.
  - _Note_: Prevents concurrent queries for the same session.

## Development

To start the development server:

```bash
bun run dev
```
