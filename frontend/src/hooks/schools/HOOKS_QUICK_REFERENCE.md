# 🎯 School Dashboard - Hooks Quick Reference

## At a Glance

### Files to Use in Each Component

#### SchoolDashboard.tsx
```typescript
// Imports
import useSchoolDrivers from '@/hooks/schools/get/useSchoolDrivers';
import useSchoolStatistics from '@/hooks/schools/get/useSchoolStatistics';
import useUpdateDriverVerification from '@/hooks/schools/put/useUpdateDriverVerification';

// Usage
const { data: drivers = [] } = useSchoolDrivers();
const { data: stats } = useSchoolStatistics();
const { mutate: updateDriver } = useUpdateDriverVerification();
```

#### SchoolComplaints.tsx
```typescript
// Imports
import useSchoolComplaints from '@/hooks/schools/get/useSchoolComplaints';
import useSchoolStatistics from '@/hooks/schools/get/useSchoolStatistics';

// Usage
const { data: complaints = [] } = useSchoolComplaints();
const { data: stats } = useSchoolStatistics();
```

#### SchoolComplaintDetail.tsx
```typescript
// Imports
import useComplaintDetail from '@/hooks/schools/get/useComplaintDetail';
import useAddComplaintResponse from '@/hooks/schools/post/useAddComplaintResponse';
import useUpdateComplaintStatus from '@/hooks/schools/put/useUpdateComplaintStatus';
import useExportComplaintReport from '@/hooks/schools/post/useExportComplaintReport';

// Usage
const { data: complaint } = useComplaintDetail(complaintId);
const { mutate: addResponse } = useAddComplaintResponse();
const { mutate: updateStatus } = useUpdateComplaintStatus();
const { mutate: exportReport } = useExportComplaintReport();
```

#### SchoolDriverReports.tsx
```typescript
// Imports
import useDriverPerformance from '@/hooks/schools/get/useDriverPerformance';
import useSchoolStatistics from '@/hooks/schools/get/useSchoolStatistics';
import useExportDriverReport from '@/hooks/schools/post/useExportDriverReport';

// Usage
const { data: performance = [] } = useDriverPerformance();
const { data: stats } = useSchoolStatistics();
const { mutate: exportReport } = useExportDriverReport();
```

---

## 📊 Hooks Summary

| Hook | Type | Component | Purpose |
|------|------|-----------|---------|
| useSchoolDrivers | GET | SchoolDashboard | Fetch driver list |
| useSchoolComplaints | GET | SchoolComplaints | Fetch complaints |
| useComplaintDetail | GET | SchoolComplaintDetail | Fetch one complaint |
| useDriverPerformance | GET | SchoolDriverReports | Fetch performance metrics |
| useSchoolStatistics | GET | All components | Fetch statistics |
| useAddComplaintResponse | POST | SchoolComplaintDetail | Add reply |
| useExportComplaintReport | POST | SchoolComplaintDetail | Export PDF/CSV |
| useExportDriverReport | POST | SchoolDriverReports | Export report |
| useUpdateComplaintStatus | PUT | SchoolComplaintDetail | Update status |
| useUpdateDriverVerification | PUT | SchoolDashboard | Update driver |

---

## 🔄 Cache Invalidation Keys

```typescript
import { schoolQueryKeys } from '@/hooks/schools/queryKeys';

// Driver queries
schoolQueryKeys.driversList()              // Driver list
schoolQueryKeys.driversPerformance()       // Performance metrics
schoolQueryKeys.driversVerification()      // Verification status
schoolQueryKeys.schoolStats()              // Overall statistics

// Complaint queries
schoolQueryKeys.complaintsList()           // Complaint list
schoolQueryKeys.complaintsDetail(id)       // Single complaint
schoolQueryKeys.complaintResponses(id)     // Complaint responses
schoolQueryKeys.complaintStatistics()      // Complaint stats
```

---

## 💬 Common Patterns

### Fetching and Displaying Data
```typescript
const { data = [], isLoading, error } = useSchoolDrivers();

if (isLoading) return <Spinner />;
if (error) return <Error message={error.message} />;

return drivers.map(driver => <DriverCard key={driver.id} driver={driver} />);
```

### Handling Mutations
```typescript
const { mutate, isLoading } = useAddComplaintResponse();
const queryClient = useQueryClient();

const handleSubmit = () => {
  mutate({ complaintId, message }, {
    onSuccess: () => {
      toast.success('Added!');
      queryClient.invalidateQueries(schoolQueryKeys.complaintsList());
    },
    onError: () => toast.error('Failed!')
  });
};
```

### Conditional Fetching
```typescript
// Only fetch when complaintId exists
const { data } = useComplaintDetail(complaintId);

// Only fetch when enabled is true
const { data } = useQuery(key, fn, { 
  enabled: !!userId && isOpen 
});
```

---

## 📁 Directory Structure

```
src/hooks/schools/
├── queryKeys.js
├── get/
│   ├── useSchoolDrivers.js
│   ├── useSchoolComplaints.js
│   ├── useComplaintDetail.js
│   ├── useDriverPerformance.js
│   └── useSchoolStatistics.js
├── post/
│   ├── useAddComplaintResponse.js
│   ├── useExportComplaintReport.js
│   └── useExportDriverReport.js
├── put/
│   ├── useUpdateComplaintStatus.js
│   └── useUpdateDriverVerification.js
└── HOOKS_IMPLEMENTATION_GUIDE.md
```

---

## ✅ Integration Checklist

- [ ] Copy all hooks to `src/hooks/schools/`
- [ ] Update SchoolDashboard.tsx imports
- [ ] Update SchoolComplaints.tsx imports
- [ ] Update SchoolComplaintDetail.tsx imports
- [ ] Update SchoolDriverReports.tsx imports
- [ ] Test GET requests
- [ ] Test POST requests (mutations)
- [ ] Test PUT requests (updates)
- [ ] Verify cache invalidation
- [ ] Test loading states
- [ ] Test error handling
- [ ] Deploy and monitor

---

**Created:** February 24, 2026  
**Version:** 1.0
