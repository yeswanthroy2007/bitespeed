# BiteSpeed Identity Reconciliation API

## Overview
This is a backend service developed for the **BiteSpeed Identity Reconciliation** assignment. The API is designed to manage and consolidate user identities across multiple contact points (email and phone number). When a user provides contact information, the system identifies whether it belongs to an existing user ("primary contact") or if it should be linked as a "secondary contact" to maintain a single unified identity.

### Key Features:
- **Identity Reconciliation**: Automatically links multiple emails and phone numbers to a single primary identity.
- **Cluster Merging**: Intelligently merges two previously independent primary identities when a new contact links them.
- **RESTful API**: Simple and robust endpoint for identity resolution.

---

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Language**: TypeScript
- **Database Driver**: `pg` (node-postgres)
- **Deployment**: Railway
- **Development Tooling**: `tsx` (TypeScript Execute), `dotenv`

---

## Project Architecture
The project follows a clean, modular architecture:
- **`src/controllers`**: Handles incoming requests and orchestrates the service layer.
- **`src/services`**: Contains the core business logic for identity resolution and reconciliation.
- **`src/queries`**: Encapsulates SQL queries and database interactions.
- **`src/db`**: Database connection pool and configuration.
- **`src/types`**: TypeScript interface definitions for consistency.

---

## Installation Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [PostgreSQL](https://www.postgresql.org/) (v14 or higher)

### Setup
1. **Clone the repository**:
   ```bash
   git clone https://github.com/yeswanthroy2007/bitespeed.git
   cd bitespeed
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Database Configuration**:
   - Create a PostgreSQL database named `bitespeed`.
   - Execute the `schema.sql` file to create the `contacts` table.
   ```bash
   psql -U postgres -d bitespeed -f schema.sql
   ```

4. **Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/bitespeed
   PORT=8080
   NODE_ENV=development
   ```

---

## Running Locally

### Development Mode
Runs the server with hot-reloading using `tsx`:
```bash
npm run dev
```

### Production Build
Build the TypeScript code into JavaScript:
```bash
npm run build
npm start
```

---

## API Endpoint Documentation

### POST `/identify`
Consolidates contact information for a user.

**Request Headers:**
- `Content-Type: application/json`

**Request Body:**
| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `email` | `string` | Optional* | The user's email address |
| `phoneNumber` | `string` | Optional* | The user's phone number |

*\*At least one of `email` or `phoneNumber` must be provided.*

---

## Example Requests & Responses

### Scenario 1: New Contact
**Request:**
```json
{
  "email": "doc@hillvalley.edu",
  "phoneNumber": "123456"
}
```
**Response:**
```json
{
  "contact": {
    "primaryContactId": 2,
    "emails": ["doc@hillvalley.edu"],
    "phoneNumbers": ["123456"],
    "secondaryContactIds": []
  }
}
```

### Scenario 2: Existing Contact (Additional Info)
**Request:**
```json
{
  "email": "doc@hillvalley.edu",
  "phoneNumber": "987654"
}
```
**Response:**
```json
{
  "contact": {
    "primaryContactId": 2,
    "emails": ["doc@hillvalley.edu"],
    "phoneNumbers": ["123456", "987654"],
    "secondaryContactIds": [3]
  }
}
```

---

## Postman Testing Instructions
1. Import a new HTTP Request in Postman.
2. Set the method to **POST**.
3. Set the URL to `https://bitespeed-production-75b3.up.railway.app/identify`.
4. Navigate to the **Body** tab, select **raw**, and set type to **JSON**.
5. Paste any of the example requests above and click **Send**.

---

## Deployment Details
- **Platform**: [Railway](https://railway.app/)
- **Live URL**: [https://bitespeed-production-75b3.up.railway.app](https://bitespeed-production-75b3.up.railway.app)
- **Automatic Deployment**: The project is configured to auto-deploy from the `main` branch on GitHub.

---

## Folder Structure
```text
BiteSpeed/
├── src/
│   ├── controllers/   # Request Handlers
│   ├── services/      # Business Logic
│   ├── queries/       # Database SQL Queries
│   ├── db/            # Connection Pool Setup
│   ├── types/         # TS Interfaces
│   └── utils/         # Formatting Helpers
├── scripts/           # Test & Utility Scripts
├── app.ts             # Express App Config
├── server.ts          # Server Entry Point
├── schema.sql         # SQL Schema Definition
└── tsconfig.json      # TypeScript Config
```

---

## Future Improvements
- **Prisma ORM Implementation**: Migrate from raw `pg` queries to Prisma for better type safety and schema management.
- **Unit Testing**: Implement `Jest` or `Mocha` for service-level testing.
- **Health Monitoring**: Integration with tools like Sentry or New Relic.
- **Rate Limiting**: Add `express-rate-limit` to prevent abuse.

---

## Author
**Venkata Yeswanth Roy**
[GitHub Profile](https://github.com/yeswanthroy2007)
