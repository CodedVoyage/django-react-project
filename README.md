# Django + React Project

A full-stack web application with Django REST Framework backend and React TypeScript frontend.

## Project Structure

```
django-react-project/
├── backend/               # Django REST API
│   ├── api/              # API app with endpoints
│   ├── myproject/        # Django project settings
│   ├── venv/             # Python virtual environment
│   ├── manage.py         # Django management script
│   └── package.json      # Backend development scripts
└── frontend/             # React TypeScript app
    ├── src/              # React source code
    ├── public/           # Static files
    └── package.json      # Frontend dependencies and scripts
```

## Features

- **Backend (Django + DRF)**:
  - Django REST Framework for API development
  - CORS configuration for React integration
  - SQLite database (development)
  - API endpoints for testing

- **Frontend (React + TypeScript)**:
  - Create React App with TypeScript template
  - Axios for API communication
  - Modern React hooks (useState, useEffect)
  - Real-time API connection testing

## Quick Start

### Prerequisites

- Python 3.8+
- Node.js 14+
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd django-react-project/backend
   ```

2. Activate virtual environment:
   ```bash
   # Windows
   venv\Scripts\activate

   # macOS/Linux
   source venv/bin/activate
   ```

3. Install dependencies (already installed):
   ```bash
   pip install django djangorestframework django-cors-headers python-decouple
   ```

4. Run migrations:
   ```bash
   python manage.py migrate
   ```

5. Start Django development server:
   ```bash
   python manage.py runserver
   ```

   Or using npm script:
   ```bash
   npm run dev
   ```

   Server will run on: http://localhost:8000

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd django-react-project/frontend
   ```

2. Install dependencies (already installed):
   ```bash
   npm install
   ```

3. Start React development server:
   ```bash
   npm start
   ```

   Server will run on: http://localhost:3000

## API Endpoints

### Base URL: `http://localhost:8000/api/`

- **GET** `/api/` - API overview with available endpoints
- **GET** `/api/test/` - Test GET request
- **POST** `/api/test/` - Test POST request (echoes back sent data)

### Example API Response
```json
{
  "message": "Hello from Django API!",
  "status": "success",
  "endpoints": [
    "/api/",
    "/api/test/"
  ]
}
```

## Development Commands

### Backend Commands

```bash
# Using npm scripts (recommended)
npm run dev              # Start Django server
npm run migrate          # Run database migrations
npm run makemigrations   # Create new migrations
npm run createsuperuser  # Create Django admin user
npm run shell           # Django shell

# Direct Python commands
python manage.py runserver
python manage.py migrate
python manage.py makemigrations
python manage.py createsuperuser
python manage.py shell
```

### Frontend Commands

```bash
npm start       # Start development server
npm run build   # Build for production
npm test        # Run tests
npm run eject   # Eject from Create React App
```

## Running Both Servers

For development, you'll need to run both servers simultaneously:

1. **Terminal 1** - Backend:
   ```bash
   cd django-react-project/backend
   npm run dev
   ```

2. **Terminal 2** - Frontend:
   ```bash
   cd django-react-project/frontend
   npm start
   ```

3. **Open your browser** to http://localhost:3000

The React app will automatically test the connection to the Django backend and display the results.

## Configuration

### CORS Settings

The backend is configured to accept requests from the React development server:

```python
# backend/myproject/settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # React development server
    "http://127.0.0.1:3000",
]
```

### Django REST Framework

```python
# backend/myproject/settings.py
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ],
}
```

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure Django server is running and CORS is properly configured
2. **Port Conflicts**:
   - Django runs on port 8000
   - React runs on port 3000
   - Make sure these ports are available
3. **Virtual Environment**: Always activate the Python virtual environment before running Django commands

### Connection Test

The React frontend includes built-in connection testing:
- Green success message = Backend is running and accessible
- Red error message = Backend is not running or unreachable

## Next Steps

### Adding New Features

1. **Backend**: Create new Django apps and add models, serializers, and views
2. **Frontend**: Add new React components and pages
3. **API**: Extend the API with authentication, file uploads, real-time features

### Production Deployment

- Configure environment variables using `python-decouple`
- Set up production database (PostgreSQL recommended)
- Configure static file serving
- Set `DEBUG = False` in production
- Use proper CORS origins for production domains

## Tech Stack

- **Backend**: Django 5.2, Django REST Framework 3.16, django-cors-headers
- **Frontend**: React 18, TypeScript, Axios
- **Database**: SQLite (development)
- **Development**: Node.js, npm, Python virtual environment