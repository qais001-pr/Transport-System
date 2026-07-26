# 🚀 School Dashboard - Hooks Integration & API Setup

## Complete Integration Guide

This document provides step-by-step instructions for integrating the school dashboard hooks into your application components and setting up API endpoints.

---

## 📂 File Structure Overview

```
src/hooks/schools/
├── queryKeys.js                           # Query key management
├── HOOKS_IMPLEMENTATION_GUIDE.md         # Detailed guide (this file)
├── HOOKS_QUICK_REFERENCE.md              # Quick reference
├── get/                                   # GET operations
│   ├── useSchoolDrivers.js
│   ├── useSchoolComplaints.js
│   ├── useComplaintDetail.js
│   ├── useDriverPerformance.js
│   └── useSchoolStatistics.js
├── post/                                  # POST operations
│   ├── useAddComplaintResponse.js
│   ├── useExportComplaintReport.js
│   └── useExportDriverReport.js
└── put/                                   # PUT operations
    ├── useUpdateComplaintStatus.js
    └── useUpdateDriverVerification.js
```

---

## 🔌 API Endpoints Required

### GET Endpoints

```
GET /api/schools/drivers
  Returns: Array<Driver>
  Description: List of all drivers for the school

GET /api/schools/complaints
  Returns: Array<Complaint>
  Description: List of all complaints for the school

GET /api/schools/complaints/:id
  Returns: ComplaintDetail
  Description: Detailed view of a specific complaint

GET /api/schools/drivers/performance
  Returns: Array<DriverPerformance>
  Description: Performance metrics for all drivers

GET /api/schools/statistics
  Returns: Statistics
  Description: Overall dashboard statistics
```

### POST Endpoints

```
POST /api/schools/complaints/:id/responses
  Body: { message, from }
  Returns: Response
  Description: Add a new response to a complaint

POST /api/schools/complaints/:id/export
  Body: { format, includeResponses }
  Returns: Blob
  Description: Export complaint as PDF or CSV

POST /api/schools/drivers/export-report
  Body: { format, status, includeMetrics, dateRange }
  Returns: Blob
  Description: Export driver report
```

### PUT Endpoints

```
PUT /api/schools/complaints/:id/status
  Body: { status, notes, resolvedBy, updatedAt }
  Returns: Complaint
  Description: Update complaint status

PUT /api/schools/drivers/:id/verification
  Body: { verificationStatus, action, notes, approvedBy, updatedAt }
  Returns: Driver
  Description: Update driver verification status
```

---

## 🛠️ Step-by-Step Integration

### Step 1: Set Up React Query (if not already done)

**In main.tsx or App.tsx:**

```typescript
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 10, // 10 minutes
      retry: 2,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Your app */}
    </QueryClientProvider>
  );
}
```

### Step 2: Update SchoolDashboard.tsx

**Replace mock data with hooks:**

```typescript
// OLD: Using mock data
const [drivers, setDrivers] = useState(mockDrivers);

// NEW: Using hooks
import useSchoolDrivers from '@/hooks/schools/get/useSchoolDrivers';
import useSchoolStatistics from '@/hooks/schools/get/useSchoolStatistics';
import useUpdateDriverVerification from '@/hooks/schools/put/useUpdateDriverVerification';

export default function SchoolDashboard() {
  const { data: drivers = [], isLoading: driversLoading } = useSchoolDrivers();
  const { data: stats } = useSchoolStatistics();
  const { mutate: updateDriver } = useUpdateDriverVerification();

  // ... rest of component
}
```

**Remove this section:**
```typescript
// DELETE THIS
const mockDrivers = [
  { id: 1, name: '...', ... },
  // ...
];
```

**Update statistics cards:**
```typescript
// OLD
const statsCards = [
  { label: 'Verified Drivers', value: drivers.filter(d => d.verificationStatus === 'verified').length },
  // ...
];

// NEW
const statsCards = [
  { label: 'Verified Drivers', value: stats?.driverStats?.verified || 0 },
  { label: 'Pending', value: stats?.driverStats?.pending || 0 },
  { label: 'Total Complaints', value: stats?.complaintStats?.total || 0 },
  { label: 'Total Drivers', value: stats?.driverStats?.total || 0 },
];
```

**Add loading state:**
```typescript
if (driversLoading) return <LoadingSpinner />;
```

### Step 3: Update SchoolComplaints.tsx

```typescript
// Imports
import useSchoolComplaints from '@/hooks/schools/get/useSchoolComplaints';
import useSchoolStatistics from '@/hooks/schools/get/useSchoolStatistics';

export default function SchoolComplaints() {
  const { data: complaints = [], isLoading } = useSchoolComplaints();
  const { data: stats } = useSchoolStatistics();

  // Remove mockComplaints
  // Update stats references
  // Add loading state
}
```

### Step 4: Update SchoolComplaintDetail.tsx

```typescript
// Imports
import useComplaintDetail from '@/hooks/schools/get/useComplaintDetail';
import useAddComplaintResponse from '@/hooks/schools/post/useAddComplaintResponse';
import useUpdateComplaintStatus from '@/hooks/schools/put/useUpdateComplaintStatus';
import useExportComplaintReport from '@/hooks/schools/post/useExportComplaintReport';
import { useParams } from 'react-router-dom';
import { useQueryClient } from 'react-query';
import { schoolQueryKeys } from '@/hooks/schools/queryKeys';

export default function SchoolComplaintDetail() {
  const { id: complaintId } = useParams();
  const queryClient = useQueryClient();
  
  const { data: complaint, isLoading } = useComplaintDetail(complaintId);
  const { mutate: addResponse, isLoading: isAddingResponse } = useAddComplaintResponse();
  const { mutate: updateStatus, isLoading: isUpdatingStatus } = useUpdateComplaintStatus();
  const { mutate: exportReport, isLoading: isExporting } = useExportComplaintReport();

  // Replace mock complaint with complaint from hook
  // Connect form handlers to mutations
  // Add cache invalidation
}
```

**Connect Reply Form:**
```typescript
const handleSendReply = () => {
  addResponse(
    { complaintId, message: replyText },
    {
      onSuccess: () => {
        setReplyText('');
        queryClient.invalidateQueries(
          schoolQueryKeys.complaintsDetail(complaintId)
        );
      },
    }
  );
};
```

**Connect Mark Resolved Button:**
```typescript
const handleMarkResolved = () => {
  updateStatus(
    {
      complaintId,
      status: 'resolved',
      notes: 'Resolved by school admin',
    },
    {
      onSuccess: () => {
        toast.success('Complaint marked as resolved');
        queryClient.invalidateQueries(
          schoolQueryKeys.complaintsDetail(complaintId)
        );
      },
    }
  );
};
```

**Connect Export Button:**
```typescript
const handleDownload = (format) => {
  exportReport({ complaintId, format });
};
```

### Step 5: Update SchoolDriverReports.tsx

```typescript
// Imports
import useDriverPerformance from '@/hooks/schools/get/useDriverPerformance';
import useSchoolStatistics from '@/hooks/schools/get/useSchoolStatistics';
import useExportDriverReport from '@/hooks/schools/post/useExportDriverReport';

export default function SchoolDriverReports() {
  const { data: driverPerformance = [], isLoading } = useDriverPerformance();
  const { data: stats } = useSchoolStatistics();
  const { mutate: exportReport, isLoading: isExporting } = useExportDriverReport();

  // Remove mockDriverPerformance
  // Update stats references
  // Connect export button
}
```

---

## 🔑 Query Key Management

**Always use query keys for cache invalidation:**

```typescript
import { schoolQueryKeys } from '@/hooks/schools/queryKeys';
import { useQueryClient } from 'react-query';

const queryClient = useQueryClient();

// After mutation success
queryClient.invalidateQueries(schoolQueryKeys.driversList());
queryClient.invalidateQueries(schoolQueryKeys.complaintsList());
```

---

## 🧪 Testing Integration

### Test GET Operations
```typescript
// In your component
const { data, isLoading, error } = useSchoolDrivers();

// Verify:
// 1. isLoading is true while fetching
// 2. data is populated after fetch
// 3. error is shown if request fails
```

### Test POST Operations
```typescript
// In your component
const { mutate, isLoading } = useAddComplaintResponse();

// Verify:
// 1. Calling mutate triggers API request
// 2. isLoading is true during request
// 3. onSuccess callback fires
// 4. Cache is invalidated
// 5. UI updates with new data
```

### Test Cache Invalidation
```typescript
// Verify query cache is cleared after mutations
queryClient.getQueryData(schoolQueryKeys.complaintsList()); // Should be undefined after mutation
```

---

## 📋 Complete Migration Checklist

### Before Integration
- [ ] All hooks created in `src/hooks/schools/`
- [ ] API endpoints documented
- [ ] Backend ready with endpoints

### SchoolDashboard.tsx
- [ ] Import `useSchoolDrivers`
- [ ] Import `useSchoolStatistics`
- [ ] Import `useUpdateDriverVerification`
- [ ] Remove `mockDrivers`
- [ ] Replace `drivers` state with hook
- [ ] Update stats cards
- [ ] Add loading state
- [ ] Add error handling
- [ ] Test all filters work

### SchoolComplaints.tsx
- [ ] Import `useSchoolComplaints`
- [ ] Import `useSchoolStatistics`
- [ ] Remove `mockComplaints`
- [ ] Replace with hook data
- [ ] Update stats
- [ ] Add loading state
- [ ] Test all filters

### SchoolComplaintDetail.tsx
- [ ] Import all required hooks
- [ ] Get complaintId from params
- [ ] Fetch complaint with hook
- [ ] Connect reply form
- [ ] Connect update status button
- [ ] Connect export button
- [ ] Add cache invalidation
- [ ] Test all features

### SchoolDriverReports.tsx
- [ ] Import all required hooks
- [ ] Replace mock performance data
- [ ] Update stats
- [ ] Connect export button
- [ ] Add loading state
- [ ] Test status filter

### Final
- [ ] All components updated
- [ ] All imports correct
- [ ] No mock data remains
- [ ] All features tested
- [ ] Error handling in place
- [ ] Loading states visible
- [ ] Cache invalidation working
- [ ] Ready for deployment

---

## 🚀 Deployment Checklist

- [ ] All hooks installed
- [ ] React Query configured
- [ ] API endpoints available
- [ ] All components updated
- [ ] Testing completed
- [ ] Error handling tested
- [ ] Loading states verified
- [ ] Performance monitored
- [ ] User acceptance testing
- [ ] Production deployment

---

## 🆘 Troubleshooting

### Issue: Data not updating after mutation

**Solution:** Ensure `onSuccess` callback includes cache invalidation:
```typescript
onSuccess: () => {
  queryClient.invalidateQueries(schoolQueryKeys.complaintsList());
}
```

### Issue: "Cannot read property of undefined"

**Solution:** Use optional chaining or default value:
```typescript
// Bad
const name = complaint.name;

// Good
const name = complaint?.name || 'Unknown';
const drivers = data?.map(...) || [];
```

### Issue: Hook called multiple times

**Solution:** Check the `enabled` property:
```typescript
const { data } = useQuery(key, fn, {
  enabled: !!complaintId // Only fetch if complaintId exists
});
```

### Issue: CORS errors

**Solution:** Ensure API client has proper CORS headers and backend allows requests

### Issue: 401 Unauthorized

**Solution:** Verify auth token is being sent with requests in API client

---

## 📊 Performance Optimization

### Stale Time & Cache Time
```typescript
useQuery(key, fn, {
  staleTime: 1000 * 60 * 5,    // 5 minutes - data is fresh
  cacheTime: 1000 * 60 * 10,   // 10 minutes - keep data in memory
})
```

### Pagination (if needed)
```typescript
const [page, setPage] = useState(1);
const { data } = useQuery(
  [key, page],
  () => fetchDrivers({ page }),
  { enabled: !!page }
);
```

### Infinite Queries (for load-more)
```typescript
const { data, fetchNextPage } = useInfiniteQuery(
  key,
  ({ pageParam = 0 }) => fetchComplaints({ page: pageParam }),
  { getNextPageParam: (last) => last.nextPage }
);
```

---

## 🔗 Related Files

- **Hooks Directory:** `src/hooks/schools/`
- **Components:** `src/pages/dashboard/school/`
- **API Client:** `src/api/apiClient.js`
- **Query Keys:** `src/hooks/schools/queryKeys.js`
- **Guides:**
  - `HOOKS_IMPLEMENTATION_GUIDE.md` - Detailed usage
  - `HOOKS_QUICK_REFERENCE.md` - Quick reference

---

## ✅ Summary

You now have:
- ✅ 10 ready-to-use hooks
- ✅ Centralized query key management
- ✅ Comprehensive documentation
- ✅ Cache invalidation patterns
- ✅ Error handling setup
- ✅ Loading state management
- ✅ Complete integration guide
- ✅ Troubleshooting section

**Next Steps:**
1. Copy hooks to your project
2. Follow the integration steps
3. Update components one by one
4. Test each component thoroughly
5. Deploy with confidence

---

**Created:** February 24, 2026  
**Version:** 1.0  
**Status:** Ready for Integration
