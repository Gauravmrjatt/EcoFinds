# EcoFinds - Sustainable Marketplace

A full-stack web application for buying and selling eco-friendly products built with Next.js and Node.js.

## Project Structure

```
├── backend/          # Node.js/Express API server
├── frontend/         # Next.js frontend application
└── README.md         # This file
```

## Features

### Backend API (Node.js/Express)
- **Authentication**: User registration, login, profile management
- **Products**: CRUD operations, search, filtering, user listings
- **Shopping Cart**: Add/remove items, checkout
- **Purchases**: Order management, purchase history
- **Sales**: View sales made by the user

### Frontend (Next.js/React/Tailwind CSS)
- **Home Page**: Landing page with eco-friendly theme
- **Authentication**: Login and registration pages
- **Products**: Browse products with search and filters
- **Shopping Cart**: Cart management with checkout
- **Sell**: Create new product listings
- **My Listings**: Manage user's products
- **Purchases**: View purchase history
- **Responsive Design**: Mobile-friendly interface

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB database
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the `backend/config/` directory
   - Add your MongoDB connection string and other required variables:
     ```
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     NODE_ENV=development
     PORT=5000
     ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - The `.env.local` file is already configured with:
     ```
     NEXT_PUBLIC_API_URL=http://localhost:5000/api
     ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create new product (auth required)
- `PUT /api/products/:id` - Update product (auth required)
- `DELETE /api/products/:id` - Delete product (auth required)
- `GET /api/products/user/listings` - Get user's products (auth required)

### Shopping Cart
- `GET /api/cart` - Get user's cart (auth required)
- `POST /api/cart` - Add item to cart (auth required)
- `DELETE /api/cart/:productId` - Remove item from cart (auth required)
- `DELETE /api/cart` - Clear cart (auth required)

### Purchases
- `POST /api/purchases` - Create purchase (auth required)
- `GET /api/purchases` - Get user's purchases (auth required)
- `GET /api/purchases/sales` - Get user's sales (auth required)

### User Profile
- `GET /api/users/profile` - Get user profile (auth required)
- `PUT /api/users/profile` - Update user profile (auth required)
- `PUT /api/users/change-password` - Change password (auth required)

## Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcrypt for password hashing
- Express validation and security middleware

### Frontend
- Next.js 15 with App Router
- React 18
- TypeScript
- Tailwind CSS
- Lucide React Icons
- Axios for API calls
- React Hot Toast for notifications

## Development

### Running Both Services

For development, you'll need to run both the backend and frontend:

1. **Terminal 1 - Backend**:
   ```bash
   cd backend
   npm run dev
   ```

2. **Terminal 2 - Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

### Building for Production

**Backend**:
```bash
cd backend
npm start
```

**Frontend**:
```bash
cd frontend
npm run build
npm start
```

## Environment Variables

### Backend (.env in backend/config/)
```
MONGO_URI=mongodb://localhost:27017/ecofinds
JWT_SECRET=your_secret_key_here
NODE_ENV=development
PORT=5000
```

### Frontend (.env.local in frontend/)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.
