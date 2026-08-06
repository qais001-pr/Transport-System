
# School Transport Management System

> A cloud-native School Transport Management System built with **React**, **Node.js**, **PostgreSQL**, **Docker**, **Kubernetes**, and **ArgoCD**, featuring real-time vehicle tracking, push notifications, and production-ready deployment.

---

## 📑 Table of Contents

* Features
* Architecture
* Technology Stack
* Project Structure
* Prerequisites
* Installation
* Environment Variables
* Docker Deployment
* Kubernetes Deployment
* API Documentation
* Monitoring & Logging
* Security
* Scalability
* Contributing
* Authors
* License

---

# 🚀 Features

## Student Management

* Student Registration
* Student CRUD Operations
* Guardian Management
* Student Search & Filtering

---

## Driver Management

* Driver CRUD
* License Information
* Driver Assignment
* Driver Availability

---

## Vehicle Management

* Vehicle Registration
* Vehicle Capacity
* Live Vehicle Tracking
* Vehicle Status

---

## Route Management

* Route Creation
* Stop Management
* Route Assignment
* Route Optimization

---

## Live Tracking

* GPS Tracking
* Real-Time Location Updates
* OpenStreetMap Integration
* Driver Live Status

---

## Notifications

* Browser Push Notifications
* Web Push (VAPID)
* Email Notifications

---

## Reports

* Attendance Reports
* Route History
* Vehicle Reports
* Driver Reports

---

# 🏗 Architecture

```
                    React Client
                         │
                         ▼
                  NGINX Ingress
                         │
         ┌───────────────┴───────────────┐
         ▼                               ▼
     Node.js API                   Socket.IO
         │
         ▼
    PostgreSQL Database
         │
         ▼
     Cloudinary Storage

--------------------------------------------

Docker
Kubernetes
Helm
ArgoCD
```

---

# 🛠 Technology Stack

| Category         | Technologies                       |
| ---------------- | ---------------------------------- |
| Frontend         | React, Redux Toolkit, Tailwind CSS |
| Backend          | Node.js, Express.js                |
| Database         | PostgreSQL                         |
| Maps             | OpenStreetMap                      |
| Storage          | Cloudinary                         |
| Authentication   | JWT                                |
| Notifications    | Web Push                           |
| Containerization | Docker                             |
| Orchestration    | Kubernetes                         |
| Package Manager  | Helm                               |
| GitOps           | ArgoCD                             |
| Monitoring       | Prometheus                         |
| Logging          | Loki + Fluent Bit                  |
| Visualization    | Grafana                            |

---

# 📂 Project Structure

```
School-Transport-System
│
├── backend
├── frontend
├── database
├── kubernetes
│   ├── helm
│   ├── argocd
│   ├── ingress
│   ├── postgres
│   ├── network-policies
│   └── hpa
│
├── docker-compose.yml
├── README.md
└── LICENSE
```

---

# ⚙ Prerequisites

* Node.js 22+
* Docker
* Docker Compose
* PostgreSQL
* Git

Optional

* Kubernetes
* Helm
* ArgoCD

---

# 🚀 Installation

## 🚀 Installation Guide

### 1. Clone the Repository

Clone the project and navigate to the project directory.

```bash
git clone https://github.com/qais001-pr/Transport-System.git
cd School-Transport-System
```

---

## 2. Configure Environment Variables

Before running the application, create the required `.env` files for both the **Backend** and **Frontend**.

### Backend (`backend/.env`)

```env
# Application Configuration
PORT=7860
NODE_ENV=production

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=YOUR_CLOUD_NAME
CLOUDINARY_API_KEY=YOUR_API_KEY
CLOUDINARY_API_SECRET=YOUR_API_SECRET

# JWT Configuration
JWT_SECRET=YOUR_JWT_SECRET
JWT_EXPIRES_IN=1d

# PostgreSQL Database
DB_HOST=YOUR_DATABASE_HOST
DB_PORT=5432
DB_NAME=YOUR_DATABASE_NAME
DB_USER=YOUR_DATABASE_USER
DB_PASSWORD=YOUR_DATABASE_PASSWORD
DB_SSL=true

# Email Configuration
EMAIL_SERVICES=gmail
EMAIL_USER=YOUR_EMAIL
EMAIL_PASSWORD=YOUR_EMAIL_PASSWORD
EMAIL_FROM_NAME=YOUR_APP_NAME

# Web Push Notifications
VAPID_PUBLIC_KEY=YOUR_PUBLIC_KEY
VAPID_PRIVATE_KEY=YOUR_PRIVATE_KEY
VAPID_EMAIL=YOUR_EMAIL@gmail.com

# Logging (Optional)
LOKI_URL=http://localhost:3100
```

### Frontend (`frontend/.env`)

```env
VITE_SOCKET_URL=http://localhost:7860/api
VITE_API_URL=http://localhost:7860/api
VITE_VAPID_PUBLIC_KEY=YOUR_VAPID_PUBLIC_KEY
```

---

## 3. Create Required Services

Before running the application, you'll need to create the following services and obtain their credentials.

| Service | Purpose | Setup Guide |
|---------|---------|-------------|
| ☁️ Cloudinary | Store images and media files | https://cloudinary.com/documentation |
| 🐘 PostgreSQL (Neon) | Managed PostgreSQL Database | https://neon.tech/docs/get-started-with-neon |
| 🔔 Web Push (VAPID Keys) | Browser Push Notifications | https://github.com/web-push-libs/web-push#generate-vapid-keys |

### Generate VAPID Keys

Install the Web Push package globally:

```bash
npm install -g web-push
```

Generate a new VAPID key pair:

```bash
web-push generate-vapid-keys
```

Example Output:

```text
=======================================

Public Key:
YOUR_PUBLIC_KEY

Private Key:
YOUR_PRIVATE_KEY

=======================================
```

Copy these values into:

```env
VAPID_PUBLIC_KEY=YOUR_PUBLIC_KEY
VAPID_PRIVATE_KEY=YOUR_PRIVATE_KEY
```

and use the **Public Key** in the frontend:

```env
VITE_VAPID_PUBLIC_KEY=YOUR_PUBLIC_KEY
```

---

## 4. Build and Run with Docker

Build the Docker images and start all containers.

```bash
# Build Docker images
docker compose build

# Start all services
docker compose up -d
```

To stop the application:

```bash
docker compose down
```

---

## 5. Verify Running Containers

```bash
docker compose ps
```

You should see all containers in the **Up** state.

---

## 6. Access the Application

After the application starts successfully, access it using the following URLs.

| Service | URL |
|---------|-----|
| 🌐 Frontend | http://localhost:3000 |
| 🚀 Backend API | http://localhost:7860 |
| 📖 Swagger API Documentation | http://localhost:7860/api/docs *(Available only when `NODE_ENV` is not `production`)* |

---

## 7. View Logs

View logs for all services:

```bash
docker compose logs -f
```

View logs for a specific service:

```bash
docker compose logs -f backend
```

```bash
docker compose logs -f frontend
```

---

# 🐳 Docker Deployment

```bash
docker compose build

docker compose up -d
```

---

# 🌐 Application URLs

| Service          | URL                                                              |
| ---------------- | ---------------------------------------------------------------- |
| Frontend         | [http://localhost:3000](http://localhost:3000)                   |
| Backend          | [http://localhost:7860](http://localhost:7860)                   |
| Swagger          | [http://localhost:7860/api/docs](http://localhost:7860/api/docs) |
| PostgreSQL Admin | [http://localhost:5050](http://localhost:5050)                   |

---

# 📊 Monitoring & Logging

The project supports production-grade observability.

### Monitoring

* Prometheus
* Grafana

### Logging

* Loki
* Fluent Bit

---

# 🔒 Security

* JWT Authentication
* Kubernetes Network Policies
* HTTPS Ready
* Secrets Management
* Environment Variables
* Secure Password Hashing

---

# 📈 Scalability

The application is designed for Kubernetes environments.

Features include

* Horizontal Pod Autoscaler
* Rolling Updates
* Self Healing Pods
* Stateless Backend
* Persistent PostgreSQL Storage

---

# 📖 API Documentation

Swagger UI

```
/api/docs
```

> Swagger is automatically disabled in the Production environment.

---

# 🤝 Contributing

1. Fork Repository

2. Create Feature Branch

```
git checkout -b feature/new-feature
```

3. Commit

```
git commit -m "Added new feature"
```

4. Push

```
git push origin feature/new-feature
```

5. Create Pull Request

---

# 👨‍💻 Authors

### Qais Muhammad

GitHub

```
https://github.com/qais001-pr
```

Email

```
qaismuhammad742@gmail.com
```

---

### Zaman Ali
