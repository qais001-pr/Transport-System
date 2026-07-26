# School Transport System - Final Year Project

## Project Overview
A comprehensive school transport management system designed to streamline and automate the daily operations of school transportation. The system provides a robust platform for managing students, vehicles, routes, drivers, and monitoring vehicle locations in real-time.

## Key Features

### Student Management
- **CRUD Operations**: Complete Create, Read, Update, and Delete functionality for student records.
- **Data Validation**: Ensures accurate and consistent student information.
- **Student Details**: Captures essential information including name, contact details, class, section, and guardian information.

### Vehicle Management
- **Vehicle Tracking**: Real-time monitoring of vehicle locations using GPS.
- **Vehicle Details**: Manages comprehensive vehicle information including make, model, year, license plate, and capacity.
- **Status Management**: Tracks vehicle availability and operational status.

### Route Management
- **Route Creation**: Definable routes with multiple stops.
- **Route Optimization**: Efficient path planning for optimal transport operations.
- **Stop Management**: Customizable stop locations with timing information.

### Driver Management
- **Driver Profiles**: Detailed driver information including contact details and driving license information.
- **Assignment**: Easy assignment of drivers to specific routes.
- **Status Tracking**: Monitors driver availability and status.

### Real-Time Monitoring
- **Live Tracking**: Real-time visualization of all vehicles on a map interface.
- **Location Updates**: Frequent updates of vehicle positions for accurate monitoring.
- **Activity Dashboard**: Comprehensive overview of ongoing transport operations.

### Reporting & Analytics
- **Attendance Records**: Tracks student and driver attendance.
- **Route History**: Comprehensive logs of completed routes and stops.
- **Performance Metrics**: Insights into transport efficiency and vehicle utilization.

## Technology Stack

### Frontend
- **Framework**: [Insert Frontend Framework, e.g., React, Angular, Vue.js]
- **Language**: [Insert Frontend Language, e.g., TypeScript, JavaScript]
- **Styling**: [Insert Styling Solution, e.g., Tailwind CSS, Material UI]
- **Mapping**: [Insert Mapping Library, e.g., Google Maps API, Leaflet]

### Backend
- **Framework**: [Insert Backend Framework, e.g., Express.js, Django, Spring Boot]
- **Language**: [Insert Backend Language, e.g., JavaScript, Python, Java]
- **Database**: [Insert Database, e.g., PostgreSQL, MySQL]
- **ORM**: [Insert ORM if applicable]

### Infrastructure
- **Containerization**: Docker
- **Orchestration**: Kubernetes (K8s)
- **Deployment**: [Insert Deployment Strategy]
- **Monitoring**: [Insert Monitoring Tools]

## Deployment & Setup

### Prerequisites
- Docker installed and running
- Kubernetes cluster configured (Minikube, Kind, or cloud-based)
- [Any other prerequisites]

### Installation
1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd School-Transport-System
   ```

2. **Build and run using Docker**
   ```bash
   # Build Docker images (if needed)
   docker-compose build
   
   # Start the application
   docker-compose up -d
   ```

3. **Access the application**
   - Frontend: [Frontend URL]
   - Backend: [Backend URL]
   - Database Admin: [Database Admin URL]

### Kubernetes Deployment
To deploy using Kubernetes:

1. **Apply the manifests**
   ```bash
   kubectl apply -f Kubernetes/
   ```

2. **Using Helm**
   ```bash
   helm install my-transport-app ./Kubernetes/van_system_chart
   ```

## Project Structure

```
School-Transport-System/
├── client/              # Frontend application
│   ├── src/
│   └── package.json
├── server/              # Backend application
│   ├── src/
│   └── package.json
├── Kubernetes/          # Kubernetes manifests
│   ├── client/
│   ├── server/
│   ├── postgres/
│   ├── postgres_admin/
│   ├── networkPolicies/
│   ├── horizontalpodscalar/
│   ├── ingress.yaml
│   └── van_system_chart/  # Helm chart
├── .env.example         # Environment variable template
├── docker-compose.yml   # Docker Compose configuration
├── Dockerfile           # Dockerfiles for services
└── README.md            # Project documentation
```

## Database

The database is managed using PostgreSQL with the following structure:

- **Database Name**: [Database Name]
- **Tables**: 
  - students
  - vehicles
  - routes
  - stops
  - drivers
  - assignments
  - attendance
  - tracking
  - [other tables]

See `Kubernetes/van_system_chart/sql/fyp_db.sql` for the complete database schema.

## API Endpoints

### Student Endpoints
- `GET /students`: Get all students
- `POST /students`: Create a new student
- `GET /students/:id`: Get student by ID
- `PUT /students/:id`: Update student
- `DELETE /students/:id`: Delete student

### Vehicle Endpoints
- `GET /vehicles`: Get all vehicles
- `POST /vehicles`: Create a new vehicle
- `GET /vehicles/:id`: Get vehicle by ID
- `PUT /vehicles/:id`: Update vehicle
- `DELETE /vehicles/:id`: Delete vehicle

### Route Endpoints
- `GET /routes`: Get all routes
- `POST /routes`: Create a new route
- `GET /routes/:id`: Get route by ID
- `PUT /routes/:id`: Update route
- `DELETE /routes/:id`: Delete route

### Driver Endpoints
- `GET /drivers`: Get all drivers
- `POST /drivers`: Create a new driver
- `GET /drivers/:id`: Get driver by ID
- `PUT /drivers/:id`: Update driver
- `DELETE /drivers/:id`: Delete driver

### Tracking Endpoints
- `GET /tracking/live`: Get real-time vehicle locations
- `GET /tracking/:vehicleId/history`: Get vehicle location history
- `POST /tracking/update`: Update vehicle location

## Security

### Security Features
- **Network Policies**: Configured to restrict traffic between services
- **Authentication**: [Describe authentication method, e.g., JWT]
- **Authorization**: [Describe authorization method]
- **Encryption**: [Describe encryption methods]

### Security Best Practices
- Keep database credentials secure
- Regularly update container images
- Implement proper access control
- Monitor application logs for suspicious activity

## Scalability

The system is designed for scalability with:
- Horizontal Pod Autoscaling (HPA) for frontend, backend, and database
- Stateless frontend architecture
- Containerized services for easy scaling

## Performance

### Performance Features
- Real-time location updates
- Efficient database queries
- Optimized routing algorithms
- Caching for frequently accessed data

### Performance Metrics
- [Add performance metrics if available]

## License

[Add license information here, e.g., MIT License]

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Authors

- **Zaman Ali**: [Contact Info/GitHub]
- **Qais**: [Contact Info/GitHub]
- [Other contributors]

## Acknowledgments

- Special thanks to [Mentors/Contributors]
- Built using [Tools/Technologies]

## Contact

For any questions or support, please contact:
- Email: [Your Email]
- GitHub: [Your GitHub]

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
