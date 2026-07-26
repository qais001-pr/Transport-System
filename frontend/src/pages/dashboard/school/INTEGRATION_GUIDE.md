# School Dashboard - Integration Guide

## Quick Start

### 1. Routing Setup

Add these routes to your main App.tsx:

```typescript
import SchoolDashboard from '@/pages/dashboard/school/SchoolDashboard';
import SchoolComplaints from '@/pages/dashboard/school/SchoolComplaints';
import SchoolComplaintDetail from '@/pages/dashboard/school/SchoolComplaintDetail';
import SchoolDriverReports from '@/pages/dashboard/school/SchoolDriverReports';

// In your routing configuration
const schoolRoutes = [
  {
    path: '/dashboard/school',
    element: <SchoolDashboard />,
    requiredRole: 'school'
  },
  {
    path: '/dashboard/school/complaints',
    element: <SchoolComplaints />,
    requiredRole: 'school'
  },
  {
    path: '/dashboard/school/complaints/:id',
    element: <SchoolComplaintDetail />,
    requiredRole: 'school'
  },
  {
    path: '/dashboard/school/reports',
    element: <SchoolDriverReports />,
    requiredRole: 'school'
  }
];
```

### 2. Sidebar Navigation

Update Sidebar to include school routes:

```typescript
const schoolNavItems = [
  {
    icon: Users,
    label: 'Dashboard',
    href: '/dashboard/school',
    isActive: location.pathname === '/dashboard/school'
  },
  {
    icon: MessageSquare,
    label: 'Complaints',
    href: '/dashboard/school/complaints',
    isActive: location.pathname === '/dashboard/school/complaints'
  },
  {
    icon: BarChart3,
    label: 'Reports',
    href: '/dashboard/school/reports',
    isActive: location.pathname === '/dashboard/school/reports'
  }
];
```

### 3. User Context Configuration

Ensure userContext provides required fields:

```typescript
const userContext = {
  user: {
    name: 'School Name / Admin Name',
    email: 'admin@school.edu',
    role: 'school'
  },
  logOut: () => { /* logout logic */ }
};
```

### 4. API Integration (Future)

Replace mock data with API calls using React Query:

```typescript
// Create hooks in src/hooks/schools/
const useDrivers = () => {
  return useQuery({
    queryKey: ['school_drivers'],
    queryFn: async () => {
      const response = await apiClient.get('/api/school/drivers');
      return response.data;
    },
  });
};

const useComplaints = () => {
  return useQuery({
    queryKey: ['school_complaints'],
    queryFn: async () => {
      const response = await apiClient.get('/api/school/complaints');
      return response.data;
    },
  });
};
```

## Page Descriptions

### School Dashboard
**Route**: `/dashboard/school`  
**Purpose**: Overview of drivers and their verification status

**Features**:
- Driver list with search and filtering
- Verification status indicators
- Performance ratings
- Complaint count display
- Quick access to driver details

**Data Required**:
- Driver list with verification status
- Driver ratings
- Complaint counts

### Complaint Management
**Route**: `/dashboard/school/complaints`  
**Purpose**: List and manage all complaints

**Features**:
- Complaint filtering (Status, Priority)
- Advanced search
- Complaint statistics
- Response tracking
- Priority indicators

**Data Required**:
- All complaints for school
- Complaint statuses
- Driver names
- Response count

### Complaint Details
**Route**: `/dashboard/school/complaints/:id`  
**Purpose**: Detailed complaint view and response management

**Features**:
- Full complaint information
- Response conversation history
- File attachments
- Driver contact info
- Timeline view
- Add response functionality

**Data Required**:
- Complaint details
- Driver information
- Response history
- Attachments

### Driver Reports
**Route**: `/dashboard/school/reports`  
**Purpose**: Performance analytics and reporting

**Features**:
- Driver performance metrics
- Rating comparison
- Complaint statistics
- Detailed score breakdown
- Export functionality
- Status filtering

**Data Required**:
- Driver performance scores
- Ratings
- Complaint counts
- Trip counts

## Component Dependencies

```
SchoolDashboard
├── Sidebar
├── Header
├── Card, Badge, Avatar
└── UI Components (Button, Input, Select)

SchoolComplaints
├── Sidebar
├── Header
├── Card, Badge
└── UI Components

SchoolComplaintDetail
├── Sidebar
├── Header
├── Card, Badge, Avatar
└── UI Components

SchoolDriverReports
├── Sidebar
├── Header
├── Card, Badge
└── UI Components
```

## Customization Options

### Change Badge Colors
```typescript
<Badge variant="success">Verified</Badge>      // Green
<Badge variant="warning">Pending</Badge>       // Orange
<Badge variant="danger">Rejected</Badge>       // Red
<Badge variant="secondary">Medium</Badge>      // Gray
```

### Add Custom Complaint Categories
```typescript
const complaintCategories = [
  'Safety Concern',
  'Behavior',
  'Cleanliness',
  'Timing',
  'Vehicle Maintenance',
  // Add more categories
];
```

### Modify Performance Metrics
```typescript
const performanceMetrics = [
  { label: 'Safety', weight: 30 },
  { label: 'Punctuality', weight: 25 },
  { label: 'Cleanliness', weight: 20 },
  { label: 'Behavior', weight: 25 },
];
```

## Testing Checklist

- [ ] Mobile responsiveness on various devices
- [ ] Search functionality working correctly
- [ ] Filter operations functioning
- [ ] Detail views opening smoothly
- [ ] Keyboard navigation accessible
- [ ] Touch interactions on mobile
- [ ] Icons loading correctly
- [ ] Badges displaying with correct colors
- [ ] Tables responsive on mobile
- [ ] Forms submitting without errors
- [ ] Role-based access working

## Deployment Checklist

- [ ] Copy school dashboard files
- [ ] Add routes to App.tsx
- [ ] Update Sidebar navigation
- [ ] Configure user context
- [ ] Set up API endpoints
- [ ] Test on mobile devices
- [ ] Verify user login flow
- [ ] Test all features
- [ ] Deploy to staging
- [ ] User acceptance testing
- [ ] Deploy to production

## Performance Optimization Tips

1. **Lazy Load Components**
   ```typescript
   const SchoolComplaints = lazy(() => import('./SchoolComplaints'));
   ```

2. **Use useMemo for Filtered Data**
   ```typescript
   const filteredComplaints = useMemo(() => {
     return complaints.filter(/* ... */);
   }, [complaints, filterStatus]);
   ```

3. **Implement Pagination**
   - Add pagination for large lists
   - Load more on scroll

4. **Cache API Responses**
   - Use React Query for caching
   - Set appropriate cache times

## Security Considerations

1. **Role-Based Access**
   - Verify user role before rendering
   - Restrict to 'school' role only

2. **Data Protection**
   - Don't expose sensitive data
   - Mask personal information where needed

3. **API Security**
   - Use auth tokens for all requests
   - Validate responses on backend

4. **Audit Logging**
   - Log complaint responses
   - Track status changes

## Common Issues & Solutions

### Issue: Data not updating after API call
**Solution**: Invalidate React Query cache after mutations
```typescript
queryClient.invalidateQueries(['school_complaints']);
```

### Issue: Detail panel not showing
**Solution**: Check if selectedComplaint is set correctly
```typescript
setSelectedComplaint(complaint.id);
```

### Issue: Responsive design issues
**Solution**: Check Tailwind breakpoints (sm:, lg:)
```typescript
<div className="grid grid-cols-1 lg:grid-cols-3">
```

## Support Resources

- React: https://react.dev
- TypeScript: https://www.typescriptlang.org/docs
- Tailwind CSS: https://tailwindcss.com
- Lucide Icons: https://lucide.dev

---

**Last Updated**: February 24, 2026  
**Version**: 1.0.0
