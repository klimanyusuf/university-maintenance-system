# University Maintenance System

A full-stack web application for managing maintenance requests, built with Django REST Framework and React.

## Features

- **JWT Authentication** – secure login/registration.
- **Role-Based Dashboards** – students, staff, officers, and admins see different views.
- **Service Request Workflow** – submit, assign, complete.
- **In-App Notifications** – real‑time updates on request status.
- **File Upload** – attach images to requests.
- **Search, Filter, Pagination** – easily find requests.
- **Data Export** – CSV and PDF reports.
- **API Documentation** – Swagger UI.
- **Real‑time Updates** (WebSocket ready).

## Tech Stack

- **Backend**: Django, Django REST Framework, PostgreSQL (Supabase), Celery (email)
- **Frontend**: React, Material‑UI, Axios
- **Deployment**: Vercel (frontend), Hugging Face Spaces (backend)

## Local Development

### Backend
\\\ash
cd backend
python -m venv venv
source venv/bin/activate  # or .\venv\Scripts\activate on Windows
pip install -r requirements.txt
cp .env.example .env  # fill in your Supabase credentials
python manage.py migrate
python manage.py runserver
\\\

### Frontend
\\\ash
cd frontend
npm install
npm start
\\\

## Deployment

- Frontend: Vercel (set REACT_APP_API_URL to your backend URL)
- Backend: Hugging Face Spaces (Docker)

## License

MIT
