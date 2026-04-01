# Bolt Bucket - Car Customizer

A full-stack web application for customizing cars with various options like exterior colors, wheels, roof designs, and engines. Built with React frontend and Express.js backend with PostgreSQL database.

## Features

- **Car Customization**: Choose from multiple options for exterior color, wheels, roof design (solid or convertible), and engine
- **Real-time Price Calculation**: See the total price update as you select different options
- **Visual Preview**: See a visual representation of your car that updates with your selections
- **CRUD Operations**: Create, view, edit, and delete custom cars
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: React 18, React Router, Pico CSS
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL (with mock implementation for development)
- **Build Tools**: Vite, ESLint

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd web103_unit4_project
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database (optional - uses mock data by default):
   - Create a PostgreSQL database on Render or locally
   - Update the `.env` file in the `server` directory with your database credentials
   - Run the database reset script:
     ```bash
     cd server
     node config/reset.js
     ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service functions
│   │   ├── utilities/     # Helper functions
│   │   └── App.jsx        # Main app component
├── server/                 # Express backend
│   ├── config/            # Database configuration
│   ├── controllers/       # Route controllers
│   ├── routes/            # API routes
│   └── server.js          # Server entry point
└── package.json           # Project dependencies
```

## API Endpoints

### Cars
- `GET /api/cars` - Get all cars
- `GET /api/cars/:id` - Get car by ID
- `POST /api/cars` - Create a new car
- `PUT /api/cars/:id` - Update a car
- `DELETE /api/cars/:id` - Delete a car

### Options
- `GET /api/options/exterior-colors` - Get exterior color options
- `GET /api/options/wheels` - Get wheel options
- `GET /api/options/interiors` - Get interior options
- `GET /api/options/engines` - Get engine options

## Customization Options

### Exterior Colors
- Midnight Black ($0)
- Pearl White ($500)
- Crimson Red ($800)
- Ocean Blue ($600)
- Forest Green ($700)

### Wheels
- Standard Alloy ($0)
- Sport Rims ($1,200)
- Premium Chrome ($1,800)
- Off-Road Tires ($1,500)

### Interiors
- Standard Cloth ($0)
- Leather Seats ($2,500)
- Premium Leather ($3,500)
- Sport Seats ($2,000)

### Engines
- Base 2.0L (180 HP, $0)
- Turbo 2.5L (250 HP, $3,000)
- V6 3.0L (320 HP, $5,000)
- V8 4.0L (450 HP, $8,000)

## Validation Rules

- V8 engine is not compatible with standard cloth interior
- All customization options must be selected before saving

## Development

### Available Scripts

- `npm run dev` - Start development server (both frontend and backend)
- `npm run build` - Build the frontend for production
- `npm start` - Start production server

### Mock Database

For development purposes, the application uses an in-memory mock database that doesn't require PostgreSQL setup. The mock database includes all the necessary data and CRUD operations.

To switch to a real PostgreSQL database:
1. Set up a PostgreSQL database
2. Update the `.env` file with database credentials
3. Replace the mock database implementation in `server/config/database.js` with the actual PostgreSQL connection

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.