# LeWallet API

LeWallet is a comprehensive financial management API that helps users track their expenses, manage accounts, and maintain budgets. Built with TypeScript and Express.js, it provides a robust backend solution for personal finance management.

## Features

- 💰 Account Management
- 💹 Budget Tracking
- 💵 Transaction Records
- 🔄 Currency Support
- 📊 Financial Statistics
- 🔐 Secure Authentication

## Tech Stack

- [TypeScript](https://www.typescriptlang.org/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [Winston](https://github.com/winstonjs/winston) for logging
- [Bun](https://bun.sh) v1.1.7 runtime

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [Bun Runtime](https://bun.sh) (v1.1.7 or higher)
- [MongoDB](https://www.mongodb.com/) (local or Atlas)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/lewallet.git
cd lewallet
```

2. Install dependencies:
```bash
bun install
```

3. Configure environment variables:
```bash
cp env.example .env
```

Update 

.env

 with your configuration:
```env
PORT=8080
MONGODB_URL="your_mongodb_connection_string"
JWT_SECRET="your_jwt_secret"
GOOGLE_EMAIL="your_email"
GOOGLE_PASSWORD="your_password"
```

## Running the Application

Development mode with hot reload:
```bash
bun run server
```

Build the project:
```bash
bun run build
```

## API Endpoints

### Account Management
- `GET /v1/api/account` - Get all accounts
- `GET /v1/api/account/:id` - Get specific account
- `POST /v1/api/account` - Create new account
- `PUT /v1/api/account/:id` - Update account
- `DELETE /v1/api/account/:id` - Delete account
- `GET /v1/api/account/:accountId/details` - Get account details with records

### Budget Management
- `GET /v1/api/budget` - Get all budgets
- `GET /v1/api/budget/:id` - Get specific budget
- `POST /v1/api/budget` - Create new budget
- `PUT /v1/api/budget/:id` - Update budget
- `DELETE /v1/api/budget/:id` - Delete budget

### Transaction Records
- `GET /v1/api/record` - Get all records
- `GET /v1/api/record/:id` - Get specific record
- `POST /v1/api/record` - Create new record
- `PUT /v1/api/record/:id` - Update record
- `DELETE /v1/api/record/:id` - Delete record

### Currency Management
- `GET /v1/api/currency` - Get all currencies
- `GET /v1/api/currency/:id` - Get specific currency
- `POST /v1/api/currency` - Create new currency
- `PUT /v1/api/currency/:id` - Update currency
- `DELETE /v1/api/currency/:id` - Delete currency

## Project Structure

```
src/
├── config/          # Configuration files
├── Constants/       # Constant definitions
├── controllers/     # Route controllers
├── middlewares/     # Express middlewares
├── models/         # Mongoose models
├── routes/         # API routes
├── services/       # Business logic
├── utils/          # Utility functions
├── validations/    # Request validation schemas
└── server.ts       # Application entry point
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please create an issue in the repository or contact the maintainers.

## Acknowledgments

- [Bun](https://bun.sh) for the fantastic JavaScript runtime
- [Express.js](https://expressjs.com/) for the web framework
- [MongoDB](https://www.mongodb.com/) for the database

---

This project was created using `bun init` in bun v1.1.7.

