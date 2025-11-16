
## Tech Stack

- **Node.js** with Express - backend server
- **MySQL** - database to store user info
- **JWT** - for authentication tokens
- **bcrypt** - to hash passwords securely

## Project Structure

```
Harsh_backend/
├── server.js              # Main server file - starts everything
├── db.js                  # MySQL database connection
├── package.json           # Dependencies and scripts
├── controllers/
│   └── usercontroller.js  # All the user logic (register, login, etc.)
├── middleware/
│   └── auth.js            # Checks if user is logged in
└── Routes/
    └── userroutes.js      # API endpoints/routes
```

## Setup Instructions

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Setup MySQL database**
   - Create a database called `node_api`
   - Create a `users` table:
   ```sql
   CREATE TABLE users (
       id INT AUTO_INCREMENT PRIMARY KEY,
       name VARCHAR(255),
       email VARCHAR(255) UNIQUE,
       password VARCHAR(255),
       role VARCHAR(50),
       phone VARCHAR(20),
       city VARCHAR(100),
       country VARCHAR(100)
   );
   ```

3. **Configure database connection**
   - Update `db.js` with your MySQL credentials if needed
   - Default is localhost, root user, no password

4. **Run the server**
   ```bash
   npm start
   ```
   Server will start at `http://localhost:5000`

## API Endpoints

### Public Routes (no login needed)

**Register a new user**
```
POST /nodeapi/register
Body: {
  "name": "harsh",
  "email": "savaliyaharsh25@gmail.com",
  "password": "password123",
  "role": "Admin",
  "phone": "9879712066",
  "city": "Rajkot",
  "country": "india"
}
```

**Login**
```
POST /nodeapi/login
Body: {
  "email": "savaliyaharsh25@gmail.com",
  "password": "password123"
}
Returns: { "message": "Login Successful", "token": "your-jwt-token" }
```

### Protected Routes (need login token)

Add token to header: `Authorization: Bearer your-jwt-token`

**Get all users** (Admin only)
```
GET /nodeapi/users
Optional params: ?search=harsh&country=india
```

**Get user details** (your own or admin can see anyone's)
```
GET /nodeapi/users/:id
```


- **Admin** - can see all users and their details
- **User** - can only see their own profile


## Quick Test

1. Register a user
2. Login to get a token
3. Use that token to access protected routes

## Notes

- Passwords are hashed before storing
- JWT tokens expire after 1 day
- Default port is 5000
- Make sure MySQL is running before starting the server
