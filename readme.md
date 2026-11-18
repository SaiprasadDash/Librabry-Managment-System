# Library Management System

A backend-focused Library Management System built using **Java 21, Spring Boot, Spring Data JPA, and MySQL**. The application provides RESTful APIs for managing books, including CRUD operations, input validation, exception handling, pagination, and sorting.

> **Project Status:** Backend development in progress.

## Features

- **Book Management:** Create, retrieve, update, partially update, and delete books.
- **RESTful APIs:** Structured REST endpoints using Spring Boot.
- **Database Integration:** MySQL database integration using Spring Data JPA and Hibernate.
- **DTO Architecture:** Separate request and response DTOs.
- **Input Validation:** Request validation using Jakarta Bean Validation.
- **Global Exception Handling:** Centralized handling of application exceptions.
- **Pagination:** Retrieve books in configurable pages.
- **Sorting:** Sort records by database fields using Spring Data Pageable.
- **Layered Architecture:** Separation of controllers, services, repositories, entities, and DTOs.

## Tech Stack

| Technology | Purpose |
|---|---|
| Java 21 | Programming language |
| Spring Boot 4.1.2 | Backend framework |
| Spring Web MVC | REST API development |
| Spring Data JPA | Database operations |
| Hibernate | ORM |
| MySQL | Relational database |
| Spring Security | Security foundation |
| Jakarta Validation | Input validation |
| Gradle | Build and dependency management |
| Lombok | Boilerplate reduction |
| Postman | API testing |

## Project Structure

```text
Librabry-Managment-System/
│
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/library/management/
│   │   │   │   ├── config/
│   │   │   │   │   └── SecurityConfig.java
│   │   │   │   │
│   │   │   │   ├── controller/
│   │   │   │   │   ├── BookController.java
│   │   │   │   │   └── HealthController.java
│   │   │   │   │
│   │   │   │   ├── dto/
│   │   │   │   │   ├── BookRequestDTO.java
│   │   │   │   │   ├── BookResponseDTO.java
│   │   │   │   │   └── BookPatchDTO.java
│   │   │   │   │
│   │   │   │   ├── entity/
│   │   │   │   │   └── Book.java
│   │   │   │   │
│   │   │   │   ├── exception/
│   │   │   │   │   ├── DuplicateResourceException.java
│   │   │   │   │   ├── ResourceNotFoundException.java
│   │   │   │   │   └── GlobalExceptionHandler.java
│   │   │   │   │
│   │   │   │   ├── repository/
│   │   │   │   │   └── BookRepository.java
│   │   │   │   │
│   │   │   │   ├── service/
│   │   │   │   │   └── BookService.java
│   │   │   │   │
│   │   │   │   └── LibraryManagementApplication.java
│   │   │   │
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   │
│   │   ├── test/
│   │   ├── build.gradle
│   │   ├── settings.gradle
│   │   ├── gradlew
│   │   └── gradlew.bat
│   │
│   └── .gitignore
│
├── .gitignore
└── README.md
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

**Controller Layer:** Handles HTTP requests and responses.

**Service Layer:** Contains business logic and application rules.

**Repository Layer:** Communicates with the database using Spring Data JPA.

**Entity Layer:** Represents database tables.

**DTO Layer:** Controls the data exchanged between the client and server.

**Exception Layer:** Handles application errors centrally.

## Getting Started

### Prerequisites

Install the following before running the application:

- Java Development Kit (JDK) 21
- MySQL
- Git
- Postman (for API testing)

### 1. Clone the repository

```bash
git clone https://github.com/SaiprasadDash/Librabry-Managment-System.git
```

### 2. Navigate to the backend

```bash
cd Librabry-Managment-System/backend
```

### 3. Create the database

Open MySQL and execute:

```sql
CREATE DATABASE library_management;
```

Create a dedicated database user or configure an existing MySQL user with the necessary permissions.

### 4. Configure environment variables

The application reads the database password from the `DB_PASSWORD` environment variable.

On Windows PowerShell:

```powershell
$env:DB_PASSWORD="your_database_password"
```

On Linux/macOS:

```bash
export DB_PASSWORD="your_database_password"
```

Make sure the username and database connection URL in `application.properties` match your MySQL configuration.

### 5. Run the application

On Windows:

```powershell
.\gradlew.bat bootRun
```

On Linux/macOS:

```bash
./gradlew bootRun
```

The backend runs at:

```text
http://localhost:8081
```

Hibernate currently manages the database schema using the configured JPA settings.

## API Documentation

Base URL:

```text
http://localhost:8081/api
```

### Book APIs

| HTTP Method | Endpoint | Description |
|---|---|---|
| POST | `/books` | Add a new book |
| GET | `/books` | Retrieve all books |
| GET | `/books/{id}` | Retrieve a book by ID |
| PUT | `/books/{id}` | Update an entire book |
| PATCH | `/books/{id}` | Partially update a book |
| DELETE | `/books/{id}` | Delete a book |
| GET | `/books/page` | Retrieve books with pagination and sorting |

### Add a Book

**POST** `/api/books`

Request body:

```json
{
  "title": "Clean Code",
  "isbn": "9780132350884",
  "description": "A handbook of agile software craftsmanship",
  "publisher": "Prentice Hall",
  "publishedYear": 2008,
  "totalCopies": 10
}
```

### Retrieve All Books

**GET** `/api/books`

### Retrieve Book by ID

**GET** `/api/books/1`

### Update a Book

**PUT** `/api/books/1`

PUT replaces the book's editable details using the supplied request data.

### Partially Update a Book

**PATCH** `/api/books/1`

Example:

```json
{
  "title": "Clean Code - Updated Edition"
}
```

### Delete a Book

**DELETE** `/api/books/1`

### Pagination

**GET** `/api/books/page?page=0&size=5`

### Sorting

Sort by title in ascending order:

```text
GET /api/books/page?page=0&size=5&sort=title,asc
```

Sort by publication year in descending order:

```text
GET /api/books/page?page=0&size=5&sort=publishedYear,desc
```

The paginated response includes:

- `content`
- `totalElements`
- `totalPages`
- `size`
- `number`
- `first`
- `last`

## Error Handling

The application uses centralized exception handling through `@RestControllerAdvice`.

| HTTP Status | Description |
|---|---|
| 400 Bad Request | Invalid request data |
| 404 Not Found | Requested book does not exist |
| 409 Conflict | Duplicate ISBN |
| 500 Internal Server Error | Unexpected server error |

Validation errors include field-specific messages to help identify invalid request data.

## Current Development Status

- [x] Spring Boot project setup
- [x] MySQL database integration
- [x] Book entity and repository
- [x] Layered backend architecture
- [x] Book CRUD operations
- [x] Request and response DTOs
- [x] Input validation
- [x] Global exception handling
- [x] Pagination
- [x] Sorting support
- [ ] Book search and filtering
- [ ] Author and category management
- [ ] User registration and login
- [ ] JWT authentication and role-based authorization
- [ ] Book borrowing and returning
- [ ] Fine calculation and reservation management
- [ ] Automated unit and integration testing
- [ ] Swagger / OpenAPI documentation
- [ ] React frontend
- [ ] Docker and deployment

## Future Improvements

The planned direction is to evolve this application into a complete library management platform with:

- Role-based access for administrators, librarians, and students.
- Secure authentication using JWT.
- Book borrowing and return workflows.
- Automatic due-date and fine calculations.
- Advanced search, filtering, and sorting.
- Transaction management and concurrency handling.
- API documentation and automated testing.
- Containerization and CI/CD integration.

## Contributing

Contributions, suggestions, and feedback are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Push the branch.
5. Open a Pull Request.

## Author

**Sai Prasad Dash**

- GitHub: [@SaiprasadDash](https://github.com/SaiprasadDash)

---

*This project is actively under development as a practical exploration of backend engineering and enterprise application development.*