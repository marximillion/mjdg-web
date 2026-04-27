# Platform Project – API Specification & Database Schema

This document extends the system design by defining:

1. Backend API endpoints
2. Database schema structure
3. Data relationships
4. Example request/response formats

The goal is to provide a clear contract between the **frontend (web/mobile)** and the **backend API**.

---

# 1. API Design Principles

The backend exposes a **REST API** that both the web and mobile applications use.

Key principles:

* JSON request/response format
* Token-based authentication
* Stateless API
* Versioned endpoints

Example base path:

```
/api/v1
```

Example:

```
GET /api/v1/files
```

---

# 2. Authentication API

## Login

Authenticates a user and returns an access token.

### Endpoint

```
POST /api/v1/auth/login
```

### Request

```json
{
  "email": "user@email.com",
  "password": "password"
}
```

### Response

```json
{
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "email": "user@email.com"
  }
}
```

---

## Register

Create a new user.

### Endpoint

```
POST /api/v1/auth/register
```

### Request

```json
{
  "email": "user@email.com",
  "password": "password"
}
```

---

# 3. User API

## Get Current User

```
GET /api/v1/user
```

Response:

```json
{
  "id": 1,
  "email": "user@email.com",
  "created_at": "2026-03-13"
}
```

---

# 4. File Management API

## Get Files

Returns a list of files for the authenticated user.

```
GET /api/v1/files
```

Response:

```json
[
  {
    "id": 10,
    "filename": "resume.pdf",
    "size": 204800,
    "created_at": "2026-03-10"
  }
]
```

---

## Get Single File

```
GET /api/v1/files/{id}
```

Response:

```json
{
  "id": 10,
  "filename": "resume.pdf",
  "size": 204800,
  "download_url": "signed_s3_url"
}
```

---

## Request Upload URL

Used for direct file upload to storage.

```
POST /api/v1/files/upload-url
```

Request:

```json
{
  "filename": "photo.jpg",
  "size": 304000
}
```

Response:

```json
{
  "upload_url": "signed_upload_url",
  "file_id": 22
}
```

---

## Delete File

```
DELETE /api/v1/files/{id}
```

Response:

```
204 No Content
```

---

# 5. Folder API (Optional Future Feature)

Allows hierarchical storage like a file explorer.

## Get Folder Contents

```
GET /api/v1/folders/{id}/files
```

Response:

```json
{
  "folders": [],
  "files": []
}
```

---

# 6. Database Schema

The backend stores structured data in a relational database.

## Users Table

```
users
```

| column        | type                  |
| ------------- | --------------------- |
| id            | integer (primary key) |
| email         | varchar               |
| password_hash | varchar               |
| created_at    | timestamp             |

---

## Files Table

```
files
```

| column     | type      |
| ---------- | --------- |
| id         | integer   |
| filename   | varchar   |
| s3_key     | varchar   |
| size       | integer   |
| owner_id   | integer   |
| created_at | timestamp |

---

## Folders Table (optional)

```
folders
```

| column     | type      |
| ---------- | --------- |
| id         | integer   |
| name       | varchar   |
| owner_id   | integer   |
| parent_id  | integer   |
| created_at | timestamp |

---

# 7. Database Relationships

```
users
  │
  ├── files
  │
  └── folders
```

Relationship definitions:

### User → Files

```
users.id → files.owner_id
```

One user can own many files.

---

### Folder Hierarchy

```
folders.parent_id → folders.id
```

Allows nested folders.

Example:

```
Root
 ├── Projects
 │    └── File1
 └── Photos
```

---

# 8. Example Data

### User Record

```
id: 1
email: mark@example.com
```

### File Record

```
id: 22
filename: sunset.jpg
s3_key: users/1/sunset.jpg
owner_id: 1
```

---

# 9. File Storage Strategy

Files are stored externally.

Example storage path:

```
bucket-name
  └── users
       └── user_id
            └── filename
```

Example:

```
users/1/profile.jpg
```

The database only stores:

```
s3_key
```

The backend generates temporary download links when needed.

---

# 10. Example End-to-End Flow

Uploading a file:

```
User selects file
      │
      ▼
Web App requests upload URL
      │
      ▼
Backend generates signed URL
      │
      ▼
Frontend uploads directly to storage
      │
      ▼
Backend records metadata in database
```

---

# 11. Example System Interaction

Full system request path:

```
Web App / Mobile App
        │
HTTP Request
        │
Backend API
        │
Database Query
        │
Storage Access
        │
Response to Client
```

---

# 12. Future API Extensions

Potential future features:

* sharing files
* user permissions
* versioned files
* file previews
* search
* notifications
* activity logs

---

# 13. Summary

This API and database structure allows:

* web and mobile clients to share a single backend
* scalable file storage
* structured metadata management
* easy extension of future features

The architecture keeps responsibilities clearly separated:

```
Client Apps → API → Database + Storage
```

This design provides a solid foundation for building a scalable platform.
