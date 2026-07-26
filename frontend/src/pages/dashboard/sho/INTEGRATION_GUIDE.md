# SHO Dashboard - Integration Guide

## Quick Start

### 1. Routing Setup

Add these routes to your main App.tsx or router configuration:

```typescript
import SHODashboard from '@/pages/dashboard/sho/SHODashboard';
import SHOVerificationRecords from '@/pages/dashboard/sho/SHOVerificationRecords';
import SHOViolations from '@/pages/dashboard/sho/SHOViolations';
import SHOReports from '@/pages/dashboard/sho/SHOReports';

// In your routing configuration
const shoRoutes = [
  {
    path: '/dashboard/sho',
    element: <SHODashboard />,
    requiredRole: 'sho'
  },
  {
    path: '/dashboard/sho/records',
    element: <SHOVerificationRecords />,
    requiredRole: 'sho'
  },
  {
    path: '/dashboard/sho/violations',
    element: <SHOViolations />,
    requiredRole: 'sho'
  },
  {
    path: '/dashboard/sho/reports',
    element: <SHOReports />,
    requiredRole: 'sho'
  }
];
```

### 2. Sidebar Navigation

Update your Sidebar component to include SHO navigation items:

```typescript
const shoNavItems = [
  {
    icon: Shield,
    label: 'Dashboard',
    href: '/dashboard/sho',
    isActive: location.pathname === '/dashboard/sho'
  },
  {
    icon: FileText,
    label: 'Verification Records',
    href: '/dashboard/sho/records',
    isActive: location.pathname === '/dashboard/sho/records'
  },
  {
    icon: AlertTriangle,
    label: 'Violations & Issues',
    href: '/dashboard/sho/violations',
    isActive: location.pathname === '/dashboard/sho/violations'
  },
  {
    icon: BarChart3,
    label: 'Reports & Analytics',
    href: '/dashboard/sho/reports',
    isActive: location.pathname === '/dashboard/sho/reports'
  }
];
```

### 3. Role-Based Access

Ensure role-based access control:

```typescript
// In your auth context or middleware
const checkAccess = (userRole: string, requiredRole: string) => {
  return userRole === requiredRole;
};

// Protected route wrapper
<ProtectedRoute 
  requiredRole="sho" 
  element={<SHODashboard />} 
/>
```

### 4. User Context Integration

The dashboard uses `userContext` for user information:

```typescript
const { user, logOut } = useContext(userContext);

// Ensure your context provides:
// - user.name: SHO Officer's name
// - user.email: SHO Officer's email
// - user.role: 'sho'
```

## Features Overview

### Page 1: Main Dashboard (`SHODashboard.tsx`)
**Purpose**: Primary interface for reviewing driver applications

**Key Components**:
- Statistics cards (Pending, Approved, Rejected, Total)
- Search and filter controls
- Driver applications list
- Detail view panel

**Features**:
- Click any driver to view complete details
- Filter by status (All, Pending, Approved, Rejected)
- Search by name, CNIC, or phone
- View license expiry status
- See document verification status
- Quick action buttons (Approve, Reject, Download)

### Page 2: Verification Records (`SHOVerificationRecords.tsx`)
**Purpose**: Audit trail and document verification history

**Key Components**:
- Document records table
- Search and filter controls
- Detail view panel

**Features**:
- View all submitted documents
- Track submission and verification dates
- See verification officer information
- View remarks and notes
- Download/Print capabilities
- Document expiry tracking

### Page 3: Violations & Issues (`SHOViolations.tsx`)
**Purpose**: Track driver violations and problematic applications

**Key Components**:
- Violation statistics cards
- Violations list with severity
- Detail view panel

**Features**:
- Critical violation alerts
- Severity-based filtering
- Violation type categorization
- Criminal record detection
- Previous violations history
- Action history tracking

### Page 4: Reports & Analytics (`SHOReports.tsx`)
**Purpose**: Performance metrics and statistical analysis

**Key Components**:
- Key metrics cards
- Monthly trend visualization
- Verification status breakdown
- Document verification rates
- Violation type analysis

**Features**:
- Monthly/Quarterly/Annual reports
- Trend analysis
- Export to PDF
- Performance metrics
- Compliance tracking
- Document completion rates

## Data Integration

### Current Status
- Dashboard currently uses **mock data** for demonstration
- Ready for API integration

### API Integration Steps

1. **Create React Query Hooks**
```typescript
// src/hooks/sho/get/useDriverVerifications.ts
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/apiClient';
import { QUERY_KEYS } from '@/hooks/queryKeys';

export const useDriverVerifications = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.SHO.DRIVER_VERIFICATIONS],
    queryFn: async () => {
      const response = await apiClient.get('/api/sho/driver-verifications');
      return response.data;
    },
  });
};
```

2. **Update Query Keys**
```typescript
// src/hooks/queryKeys.js
export const QUERY_KEYS = {
  // ... existing keys
  SHO: {
    DRIVER_VERIFICATIONS: "sho_driver_verifications",
    DRIVER_DETAIL: "sho_driver_detail",
    VERIFICATION_RECORDS: "sho_verification_records",
    VIOLATIONS: "sho_violations",
    REPORTS: "sho_reports",
    VERIFY_DRIVER: "sho_verify_driver",
    REJECT_DRIVER: "sho_reject_driver",
  }
};
```

3. **Integrate in Components**
```typescript
// In SHODashboard.tsx
const { data, isLoading, error } = useDriverVerifications();

// Normalize and use data instead of mock
const driverVerifications = data?.verifications || [];
```

## Responsive Design Tested

✅ Mobile (< 640px)
- Single column layout
- Full-width cards
- Compact detail panels
- Touch-friendly spacing

✅ Tablet (640px - 1024px)
- Two column layouts
- Flexible spacing

✅ Desktop (> 1024px)
- Three column layouts
- Side-by-side panels
- Expanded features

## Customization Options

### Change Badge Colors
```typescript
<Badge variant="success">Verified</Badge>  // Green
<Badge variant="warning">Pending</Badge>   // Orange
<Badge variant="danger">Rejected</Badge>   // Red
<Badge variant="secondary">Medium</Badge>  // Gray
```

### Add New Violation Types
```typescript
const violationTypes = [
  'License Violation',
  'Missing Documentation',
  'Document Fraud Attempt',
  'Criminal Record',
  'Traffic Violation History',
  // Add more types here
];
```

### Extend Statistics
```typescript
const stats = [
  // Add new stat objects with title, value, icon, color, bgColor
  {
    title: 'Average Processing Time',
    value: '2.5 hrs',
    icon: Clock,
    color: 'text-primary',
    bgColor: 'bg-primary-50',
  }
];
```

## Performance Considerations

1. **List Virtualization** (Future Enhancement)
   - Implement virtual scrolling for large lists
   - Use `react-window` or `react-virtual`

2. **Pagination** (Future Enhancement)
   - Add pagination for driver lists
   - Load more on scroll

3. **Caching** (Future Enhancement)
   - Cache verification records
   - Use React Query cache management

## Security Checklist

- [ ] Role-based access control implemented
- [ ] User authentication verified
- [ ] API endpoints secured with auth tokens
- [ ] Sensitive data fields identified and protected
- [ ] Audit logging enabled
- [ ] Download/Export permissions verified
- [ ] Data validation on form submissions
- [ ] XSS protection enabled

## Testing Checklist

- [ ] Mobile responsiveness on various devices
- [ ] Search functionality working correctly
- [ ] Filter operations functioning as expected
- [ ] Detail view popup smooth and fast
- [ ] Keyboard navigation accessible
- [ ] Touch interactions on mobile working
- [ ] Icons loading correctly
- [ ] Badges displaying with correct colors
- [ ] Tables responsive on mobile
- [ ] Forms submitting without errors

## Deployment Notes

1. Ensure `userContext` is properly configured
2. Verify Sidebar supports 'sho' role
3. Update routing with SHO routes
4. Configure API endpoints in `apiConstant.js`
5. Test user login flow for SHO role
6. Verify mobile responsiveness before deployment
7. Check icon library (lucide-react) is installed
8. Ensure all UI components are available

## Support & Documentation

- **Icon Library**: [lucide.dev](https://lucide.dev)
- **Tailwind CSS**: [tailwindcss.com](https://tailwindcss.com)
- **React Query**: [tanstack.com/query](https://tanstack.com/query)
- **Component Library**: See `/src/components/ui/`

---

**Last Updated**: February 24, 2026
**Version**: 1.0.0
