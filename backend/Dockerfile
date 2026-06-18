FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN python manage.py collectstatic --noinput

# Use the PORT environment variable Render provides
ENV PORT=10000

# Bind to 0.0.0.0 so Render can route traffic
CMD gunicorn --bind 0.0.0.0:\ maintenance_api.wsgi:application
