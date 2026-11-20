# Library Management System

A full-featured backend-focused Library Management System built using **Java 21, Spring Boot, Spring Security, Spring Data JPA, and MySQL**.

The application provides REST APIs for managing books, authors, categories, users, borrowing, returns, fines, and reservations. It includes JWT authentication, role-based authorization, validation, pagination, and centralized exception handling.

## Features

### Book Management
- Create, retrieve, update, partially update, and delete books.
- ISBN uniqueness validation.
- Manage book copies and availability.
- Associate books with multiple authors and categories.
- Prevent deletion when borrowing or reservation history exists.

### Author and Category Management
- Create, retrieve, update, and delete authors.
- Create, retrieve, update, and delete categories.
- Associate authors and categories with books.

### Authentication and Authorization
- User registration and login.
- JWT-based authentication.
- BCrypt password hashing.
- Role-based access control:
  - **ADMIN:** Administrative operations and librarian management.
  - **LIBRARIAN:** Library management operations.
  - **MEMBER:** Borrowing, returning, and reservations.
- Public registration always creates MEMBER accounts.
- Only administrators can create librarian accounts.
- Separate HTTP 401 and 403 responses.

### Borrowing and Returns
- Borrow available books.
- Prevent duplicate active borrowing of the same book by a member.
- Automatically calculate due dates (14 days).
- Return borrowed books.
- View personal borrowing history.
- View overdue books.
- Maintain available-copy counts.

### Fine Calculation
- Automatically calculate overdue fines.
- Fine rate: ₹5 per overdue day.
- Include fine amounts in borrowing responses.

### Reservation Management
- Reserve books when no copies are available.
- Prevent duplicate active reservations.
- Cancel waiting reservations.
- FIFO reservation assignment.
- Mark reservations as ready for pickup.
- Fulfil reservations when the member borrows the assigned book.
- View waiting reservation counts (ADMIN/LIBRARIAN).

### Other Features
- DTO-based request and response handling.
- Jakarta Bean Validation.
- Centralized exception handling.
- Pagination and sorting.
- Book search and filtering.
- Layered architecture.

## Tech Stack

| Technology | Purpose |
|---|---|
| Java 21 | Programming language |
| Spring Boot 4.1.2 | Backend framework |
| Spring Web MVC | REST API development |
| Spring Security | Authentication and authorization |
| Spring Data JPA | Database operations |
| Hibernate | ORM |
| MySQL | Relational database |
| JWT (JJWT) | Token-based authentication |
| BCrypt | Password hashing |
| Jakarta Validation | Input validation |
| Gradle | Build and dependency management |
| Lombok | Boilerplate reduction |
| Postman | API testing |

## Project Structure

```text
Librabry-Managment-System/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/library/management/
│   │   │   │   ├── config/
│   │   │   │   ├── controller/
│   │   │   │   ├── dto/
│   │   │   │   ├── entity/
│   │   │   │   ├── exception/
│   │   │   │   ├── repository/
│   │   │   │   └── service/
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   ├── gradle/
│   ├── build.gradle
│   ├── settings.gradle
│   └── gradlew.bat
├── .gitignore
└── readme.md
```

## Application Architecture

The application follows a layered architecture:

```text
Client (Postman / Frontend)
          |
          v
     Controller
          |
          v
       Service
          |
          v
     Repository
          |
          v
        MySQL
```

- **Controller:** Handles HTTP requests and responses.
- **Service:** Contains business logic and application rules.
- **Repository:** Handles database operations using Spring Data JPA.
- **Entity:** Represents database tables.
- **DTO:** Controls data exchanged between client and server.
- **Exception:** Provides centralized error handling.
- **Config:** Contains security and application configuration.

## Getting Started

### Prerequisites

- JDK 21
- MySQL
- Git
- Postman

### 1. Clone the repository

```bash
git clone https://github.com/SaiprasadDash/Librabry-Managment-System.git
```

### 2. Navigate to the backend

```bash
cd Librabry-Managment-System/backend
```

### 3. Create the database

Execute this SQL command in MySQL:

```sql
CREATE DATABASE library_management;
```

Configure your MySQL username and ensure that the database user has the required permissions.

### 4. Configure environment variables

The application requires three environment variables:

- `DB_PASSWORD`: MySQL database password.
- `JWT_SECRET`: Secret used to sign JWT tokens. Use a strong random secret of at least 32 bytes for HS256.
- `ADMIN_PASSWORD`: Initial administrator password.

On **Windows CMD**, configure them in the terminal before starting the application:

```cmd
set DB_PASSWORD=your_mysql_password
set JWT_SECRET=your_long_random_secret_at_least_32_characters
set ADMIN_PASSWORD=your_strong_admin_password
```

These values are examples. Use your own secure values and never commit actual secrets to GitHub.

The initial administrator account uses:

```text
Email: admin@gmail.com
Password: Value configured in ADMIN_PASSWORD
```

The administrator initializer creates this account only if it does not already exist.

On PowerShell, use `$env:VARIABLE_NAME="value"` instead of the CMD `set` syntax.

### 5. Run the application

On Windows:

```cmd
gradlew.bat bootRun
```

On Linux/macOS:

```bash
./gradlew bootRun
```

The backend runs at:

```text
http://localhost:8081
```

**Note:** CMD environment variables set using `set` apply only to that terminal session. Configure them again when opening a new terminal.

## API Overview

Base URL:

```text
http://localhost:8081/api
```

| Module | Base endpoint | Description |
|---|---|---|
| Authentication | `/auth` | Registration and login |
| Books | `/books` | Book management |
| Authors | `/authors` | Author management |
| Categories | `/categories` | Category management |
| Users | `/users` | Librarian account creation |
| Borrowings | `/borrowings` | Borrowing, returning, and history |
| Reservations | `/reservations` | Reservation management |

### Authentication APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register a MEMBER |
| POST | `/auth/login` | Login and receive JWT |

### Book APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/books` | Create a book |
| GET | `/books` | Retrieve books |
| GET | `/books/{id}` | Retrieve a book |
| PUT | `/books/{id}` | Update a book |
| PATCH | `/books/{id}` | Partially update a book |
| DELETE | `/books/{id}` | Delete a book |
| GET | `/books/page` | Paginated and sorted books |

### Borrowing APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/borrowings/{bookId}` | Borrow a book |
| PUT | `/borrowings/{borrowId}/return` | Return a book |
| GET | `/borrowings/my` | View personal borrowing history |
| GET | `/borrowings/my/overdue` | View personal overdue books |
| GET | `/borrowings/overdue` | View all overdue books (staff) |

### Reservation APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/reservations/{bookId}` | Reserve a book |
| GET | `/reservations/my` | View personal reservations |
| PUT | `/reservations/{reservationId}/cancel` | Cancel a reservation |
| GET | `/reservations/book/{bookId}/count` | View waiting count (staff) |

### Librarian Management API

| Method | Endpoint | Description |
|---|---|---|
| POST | `/users/librarians` | Create a librarian (ADMIN only) |

All protected endpoints require a valid JWT in the Authorization header:

```text
Authorization: Bearer YOUR_JWT_TOKEN
```

Access is controlled by the user's assigned role.

## Error Handling

The application uses centralized exception handling through `@RestControllerAdvice` and Spring Security handlers.

| HTTP Status | Description |
|---|---|
| 400 | Bad request or validation failure |
| 401 | Authentication required or invalid |
| 403 | Authenticated user lacks permission |
| 404 | Resource not found |
| 409 | Business rule conflict |
| 500 | Unexpected server error |

Unexpected server errors are logged while a generic message is returned to the client.

## Development Status

- [x] Spring Boot project setup
- [x] MySQL database integration
- [x] Layered backend architecture
- [x] Book CRUD operations
- [x] Author and category management
- [x] DTOs and input validation
- [x] Global exception handling
- [x] Pagination, sorting, and search
- [x] JWT authentication
- [x] Role-based authorization
- [x] BCrypt password hashing
- [x] Borrowing and returning
- [x] Overdue tracking
- [x] Fine calculation
- [x] Reservation management
- [x] FIFO reservation assignment
- [x] Safe book deletion checks
- [x] Postman API testing
- [ ] React frontend
- [ ] AI-powered book recommendations
- [ ] Semantic book search
- [ ] RAG-based library assistant

## Future Improvements

- React-based frontend for different user roles.
- AI-powered personalized book recommendations.
- Semantic search using vector embeddings.
- RAG-based library assistant for catalog questions.
- Fine payment tracking.
- Improved concurrency handling for borrowing and reservations.
- Database migration management.
- Expanded automated unit and integration testing.

## Contributing

Suggestions and contributions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Push the branch.
5. Open a Pull Request.

## Author

**Sai Prasad Dash**

GitHub: [@SaiprasadDash](https://github.com/SaiprasadDash)

---

*Built as a practical project to explore backend engineering, REST API development, database management, and secure application design.*
