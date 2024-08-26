# Backend System with WebSocket, PostgreSQL, Redis, and JWT Authentication
This project implements a backend system with WebSocket communication, PostgreSQL for data storage, Redis caching, and JWT-based authentication with role-based access control. The system uses raw SQL queries, stores threat data from Radware's live threat map, and includes unit tests to ensure endpoint functionality.

## Table of Contents
1. [Features](#features)
2. [Requirements](#requirements)
3. [Usage](#usage)
4. [API Documentation](#api-documentation)
4. [Running Tests](#running-tests)


## Features
- WebSocket communication for real-time updates.
- PostgreSQL database for persistent storage.
- Redis caching for improved performance.
- JWT authentication with role-based access control.
- Unit tests using Jest.

## Requirements
- Docker Desktop 4.33.0
- Docker Compose version v2.29.1-desktop.1

## Usage
  This section describes the various `make` commands available for managing the Docker environment and backend application.
  - **build-dev**: Build and start the development environment.
  - **start**: Start all Docker containers.
  - **stop**: Stop all Docker containers.

  ### Example Commands

  - **`build-dev`**:
    - **Description:** Build and start the development environment.
    - **Command:**
      ```bash
      make build-dev
      ```

## API Documentation
### 1. `GET /api/getData`

- **Description:** Fetches data from the backend.
- **Authentication:** Requires a valid JWT token in the `x-access-token` header.
- **Request Body:**

    ```json
    {
        "userId": "1"
    }
    ```

- **Request Example:**

    ```bash
    curl -X GET http://localhost:7878/api/getData \
        -H "Content-Type: application/json" \
        -H "x-access-token: your_jwt_token" \
        -d '{"userId": "1"}'
    ```

- **Response:**
- **200 OK:** Successfully fetched data.
    ```json
    {
    "success": true,
    "statusCode": 200,
    "data": {
        "label": [
            "Russia",
            "Canada",
            "United States"
        ],
        "total": [
            2,
            3,
            94
        ]
    }
    }
    ```
- **403 Forbidden:** Access denied for non-admin users.
    ```json
    {
    "message": "Forbidden: You don't have the required role!"
    }
    ```

### 1. `GET /api/refactoreMe1`

- **Description:** Fetches data from the backend.
- **Authentication:** Requires a valid JWT token in the `x-access-token` header.
- **Request Body:**

    ```json
    {
        "userId": "1"
    }
    ```

- **Request Example:**

    ```bash
    curl -X GET http://localhost:7878/api/refactoreMe1 \
        -H "Content-Type: application/json" \
        -H "x-access-token: your_jwt_token" \
        -d '{"userId": "1"}'
    ```

- **Response:**
- **200 OK:** Successfully fetched data.
    ```json
    {
    "statusCode": 200,
    "success": true,
    "data": [
        "23.2500000000000000",
        "24.8333333333333333",
        "24.7500000000000000",
        "23.8333333333333333",
        "26.2500000000000000",
        "6.0000000000000000",
        "7.0000000000000000",
        "8.0000000000000000",
        "9.0000000000000000",
        "10.0000000000000000"
    ]
    }
    ```
- **403 Forbidden:** Access denied for non-admin users.
    ```json
    {
    "message": "Forbidden: You don't have the required role!"
    }

### 3. `POST /api/refactoreMe2`

- **Description:** Sends data to the server for processing.
- **Authentication:** Requires a valid JWT token in the `x-access-token` header.
- **Request Body:**

    ```json
    {
        "userId": 1,
        "values": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        "id": 1
    }
    ```

- **Request Example:**

    ```bash
    curl -X POST http://localhost:7878/api/refactoreMe2 -H "Content-Type: application/json" -H "x-access-token: your_jwt_token" -d '{"userId":1,"values":[1,2,3,4,5,6,7,8,9,10],"id":1}'
    ```

- **Response:**
- **201 Created:** Data sent successfully.
    ```json
    {
    "message": "Survey sent successfully!",
    "success": true
    }
    ```
- **400 Bad Request:** Invalid request body.
    ```json
    {
    "message": "UserId is required in the body!"
    }
    ```

### WebSocket
- **URL:** `ws://localhost:7878`
- **Description:** Connects to the WebSocket server for real-time communication.
- **Example Usage:**

Use a WebSocket client to connect to `ws://localhost:7878`. You can send and receive messages as per the WebSocket protocol and your application's requirements.

## Running Tests
To run the tests for this application, follow these steps:

- Build the Docker Image and Start the Docker Containers
    ```bash 
    make build-dev
    ```

- Access the Backend Container
    ```bash 
    docker exec -it threatmap-backend sh
    ```

- Run the Tests
    ```bash 
    npm test
    ```

- Review Test Results
Check the output to ensure all tests have passed or identify any issues.
![alt text](<Screenshot 2024-08-26 at 06.56.04.png>)