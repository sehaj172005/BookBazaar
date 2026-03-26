# BookBazaar Backend

## Setup

1. Fill in your MongoDB URI in `.env`:
```
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/bookbazaar
JWT_SECRET=bookbazaar_super_secret_key_2025
PORT=5000
```

2. Install dependencies:
```bash
npm install
```

3. Run in development:
```bash
npm run dev
```

## API Endpoints

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | /auth/register | Register new user |
| POST | /auth/login | Login + get JWT |

### Books
| Method | Route | Description |
|--------|-------|-------------|
| GET | /books | All books (supports ?q=, ?category=, ?condition=, ?demand=, ?maxPrice=) |
| GET | /books/:id | Single book (auto-increments views) |
| POST | /books | Create listing (Protected, multipart with images) |
| DELETE | /books/:id | Delete listing (Protected, owner only) |
| GET | /books/user/:userId | Books by a seller |

### Requests
| Method | Route | Description |
|--------|-------|-------------|
| POST | /requests | Send request (Protected) |
| GET | /requests/sent | My sent requests (Protected) |
| GET | /requests/received | Received requests (Protected) |
| PUT | /requests/:id | Accept/Reject (Protected, seller only) |
| PUT | /requests/:id/complete | Mark deal complete (Protected) |

### Chat
| Method | Route | Description |
|--------|-------|-------------|
| POST | /chat/send | Send message (Protected, accepted requests only) |
| GET | /chat/:requestId | Get chat messages (Protected) |

### Profile
| Method | Route | Description |
|--------|-------|-------------|
| GET | /profile/me | Full profile + books + requests (Protected) |
| PUT | /profile/me | Update name/location (Protected) |
