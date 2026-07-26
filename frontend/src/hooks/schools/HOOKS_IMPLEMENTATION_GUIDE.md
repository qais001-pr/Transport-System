# 🎣 School Dashboard - Hooks Implementation Guide

## Overview

This guide explains how to use the school dashboard query hooks in your components. All hooks follow React Query patterns and are organized by HTTP method (GET, POST, PUT).

---

## 📁 Directory Structure

```
src/hooks/schools/
├── queryKeys.js                    # Centralized query key management
├── get/
│   ├── useSchoolDrivers.js         # Fetch driver list
│   ├── useSchoolComplaints.js      # Fetch complaints list
│   ├── useComplaintDetail.js       # Fetch single complaint
│   ├── useDriverPerformance.js     # Fetch performance metrics
│   └── useSchoolStatistics.js      # Fetch overall statistics
├── post/
│   ├── useAddComplaintResponse.js  # Add complaint response
│   ├── useExportComplaintReport.js # Export complaint as PDF/CSV
│   └── useExportDriverReport.js    # Export driver report as PDF/CSV
└── put/
    ├── useUpdateComplaintStatus.js # Update complaint status
    └── useUpdateDriverVerification.js # Update driver verification
```

---

## 🔑 Query Keys (queryKeys.js)

All query keys are centralized for consistent cache management.

**Key Features:**
- Hierarchical structure for nested caching
- Easy cache invalidation
- Predictable naming convention

**Usage:**
```javascript
import { schoolQueryKeys } from '@/hooks/schools/queryKeys';

// In a mutation's onSuccess callback:
queryClient.invalidateQueries(schoolQueryKeys.complaintsList());
```

---

## 📥 GET Hooks (Read Operations)

### 1. useSchoolDrivers

**Purpose:** Fetch list of drivers for school dashboard

**File:** `src/hooks/schools/get/useSchoolDrivers.js`

**Import:**
```javascript
import useSchoolDrivers from '@/hooks/schools/get/useSchoolDrivers';
```

**Usage in SchoolDashboard.tsx:**
```typescript
import useSchoolDrivers from '@/hooks/schools/get/useSchoolDrivers';

export default function SchoolDashboard() {
  // Replace mock data with API call
  const { data: drivers = [], isLoading, error } = useSchoolDrivers();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  // Use drivers array instead of mockDrivers
  const filteredDrivers = drivers.filter(driver => {
    const matchesStatus = filterStatus === 'all' || driver.verificationStatus === filterStatus;
    const matchesSearch = 
      driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.cnic.includes(searchQuery) ||
      driver.phone.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  // ... rest of component
}
```

**Hook Returns:**
```typescript
{
  data: Array<Driver>,      // Drivers array or undefined
  isLoading: boolean,       // Loading state
  error: Error | null,      // Error if any
  refetch: Function,        // Manual refetch function
  isFetching: boolean       // Currently fetching
}
```

---

### 2. useSchoolComplaints

**Purpose:** Fetch list of all complaints for school

**File:** `src/hooks/schools/get/useSchoolComplaints.js`

**Import:**
```javascript
import useSchoolComplaints from '@/hooks/schools/get/useSchoolComplaints';
```

**Usage in SchoolComplaints.tsx:**
```typescript
import useSchoolComplaints from '@/hooks/schools/get/useSchoolComplaints';
import { schoolQueryKeys } from '@/hooks/schools/queryKeys';

export default function SchoolComplaints() {
  // Replace mock data with API call
  const { data: complaints = [], isLoading, error } = useSchoolComplaints();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  // Filter complaints as before
  const filteredComplaints = complaints
    .filter(c => filterStatus === 'all' || c.status === filterStatus)
    .filter(c => filterPriority === 'all' || c.priority === filterPriority)
    .filter(c => 
      c.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.complaintId.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // ... rest of component
}
```

---

### 3. useComplaintDetail

**Purpose:** Fetch detailed information for a specific complaint

**File:** `src/hooks/schools/get/useComplaintDetail.js`

**Import:**
```javascript
import useComplaintDetail from '@/hooks/schools/get/useComplaintDetail';
```

**Usage in SchoolComplaintDetail.tsx:**
```typescript
import useComplaintDetail from '@/hooks/schools/get/useComplaintDetail';
import { useParams } from 'react-router-dom';

export default function SchoolComplaintDetail() {
  const { id: complaintId } = useParams(); // From URL: /complaints/:id
  
  // Fetch complaint details
  const { data: complaint, isLoading, error } = useComplaintDetail(complaintId);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!complaint) return <NotFound />;

  return (
    <div>
      {/* Use complaint data instead of mock */}
      <h1>{complaint.subject}</h1>
      <p>Priority: {complaint.priority}</p>
      
      {/* Conversation history */}
      {complaint.responses?.map(response => (
        <ResponseCard key={response.id} response={response} />
      ))}

      {/* Reply form */}
      <ReplyForm complaintId={complaintId} />
    </div>
  );
}
```

**Hook Parameters:**
- `complaintId`: string | number - The complaint ID from URL

**Hook Returns:**
```typescript
{
  data: ComplaintDetail,    // Full complaint object
  isLoading: boolean,
  error: Error | null,
  refetch: Function
}
```

---

### 4. useDriverPerformance

**Purpose:** Fetch performance metrics for all drivers

**File:** `src/hooks/schools/get/useDriverPerformance.js`

**Import:**
```javascript
import useDriverPerformance from '@/hooks/schools/get/useDriverPerformance';
```

**Usage in SchoolDriverReports.tsx:**
```typescript
import useDriverPerformance from '@/hooks/schools/get/useDriverPerformance';

export default function SchoolDriverReports() {
  const { data: driverPerformance = [], isLoading, error } = useDriverPerformance();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  // Filter by status
  const filteredDrivers = filterStatus === 'all' 
    ? driverPerformance 
    : driverPerformance.filter(d => d.status === filterStatus);

  return (
    <div>
      {/* Display performance table */}
      <PerformanceTable drivers={filteredDrivers} />
      
      {/* Display detailed metrics */}
      {filteredDrivers.map(driver => (
        <DetailedMetrics key={driver.id} driver={driver} />
      ))}
    </div>
  );
}
```

---

### 5. useSchoolStatistics

**Purpose:** Fetch overall statistics for dashboard

**File:** `src/hooks/schools/get/useSchoolStatistics.js`

**Import:**
```javascript
import useSchoolStatistics from '@/hooks/schools/get/useSchoolStatistics';
```

**Usage in Multiple Components:**

**In SchoolDashboard.tsx:**
```typescript
import useSchoolStatistics from '@/hooks/schools/get/useSchoolStatistics';

export default function SchoolDashboard() {
  const { data: stats } = useSchoolStatistics();

  return (
    <div className="grid grid-cols-4 gap-4">
      <StatCard label="Verified Drivers" value={stats?.driverStats?.verified || 0} />
      <StatCard label="Pending" value={stats?.driverStats?.pending || 0} />
      <StatCard label="Total Complaints" value={stats?.complaintStats?.total || 0} />
      <StatCard label="Total Drivers" value={stats?.driverStats?.total || 0} />
    </div>
  );
}
```

**In SchoolComplaints.tsx:**
```typescript
const { data: stats } = useSchoolStatistics();

// Display complaint statistics
const complaintStats = {
  open: stats?.complaintStats?.open || 0,
  inProgress: stats?.complaintStats?.inProgress || 0,
  resolved: stats?.complaintStats?.resolved || 0,
  total: stats?.complaintStats?.total || 0,
};
```

**In SchoolDriverReports.tsx:**
```typescript
const { data: stats } = useSchoolStatistics();

// Display overall metrics
const metrics = {
  averageRating: stats?.reportStats?.averageRating || 0,
  totalTrips: stats?.reportStats?.totalTrips || 0,
  totalComplaints: stats?.reportStats?.totalComplaints || 0,
};
```

---

## 📤 POST Hooks (Create Operations)

### 1. useAddComplaintResponse

**Purpose:** Add a reply/response to a complaint

**File:** `src/hooks/schools/post/useAddComplaintResponse.js`

**Import:**
```javascript
import useAddComplaintResponse from '@/hooks/schools/post/useAddComplaintResponse';
import { schoolQueryKeys } from '@/hooks/schools/queryKeys';
```

**Usage in SchoolComplaintDetail.tsx:**
```typescript
import useAddComplaintResponse from '@/hooks/schools/post/useAddComplaintResponse';
import { useQueryClient } from 'react-query';

export default function SchoolComplaintDetail() {
  const queryClient = useQueryClient();
  const { mutate: addResponse, isLoading } = useAddComplaintResponse();
  const [replyText, setReplyText] = useState('');
  const { id: complaintId } = useParams();

  const handleSendReply = () => {
    if (!replyText.trim()) return;

    addResponse(
      {
        complaintId,
        message: replyText,
        from: 'School Admin' // Or from userContext
      },
      {
        onSuccess: () => {
          setReplyText(''); // Clear form
          // Manually refetch or use cache invalidation
          queryClient.invalidateQueries(
            schoolQueryKeys.complaintsDetail(complaintId)
          );
        },
        onError: (error) => {
          console.error('Failed to add response:', error);
          // Show error toast
        }
      }
    );
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSendReply(); }}>
      <textarea 
        value={replyText} 
        onChange={(e) => setReplyText(e.target.value)}
        placeholder="Type your response..."
      />
      <button type="submit" disabled={isLoading || !replyText.trim()}>
        {isLoading ? 'Sending...' : 'Send Reply'}
      </button>
    </form>
  );
}
```

**Hook Parameters:**
```typescript
{
  complaintId: string | number,
  message: string,
  from?: string
}
```

**Hook Returns:**
```typescript
{
  mutate: Function,        // Call this to add response
  isLoading: boolean,
  error: Error | null,
  data: ResponseObject
}
```

---

### 2. useExportComplaintReport

**Purpose:** Export complaint as PDF or CSV

**File:** `src/hooks/schools/post/useExportComplaintReport.js`

**Import:**
```javascript
import useExportComplaintReport from '@/hooks/schools/post/useExportComplaintReport';
```

**Usage in SchoolComplaintDetail.tsx:**
```typescript
import useExportComplaintReport from '@/hooks/schools/post/useExportComplaintReport';

export default function SchoolComplaintDetail() {
  const { mutate: exportReport, isLoading } = useExportComplaintReport();
  const { id: complaintId } = useParams();

  const handleDownloadReport = (format = 'pdf') => {
    exportReport({
      complaintId,
      format, // 'pdf' or 'csv'
      includeResponses: true
    });
  };

  return (
    <div className="flex gap-2">
      <button onClick={() => handleDownloadReport('pdf')} disabled={isLoading}>
        <Download size={16} /> Download PDF
      </button>
      <button onClick={() => handleDownloadReport('csv')} disabled={isLoading}>
        <Download size={16} /> Download CSV
      </button>
    </div>
  );
}
```

**Hook Parameters:**
```typescript
{
  complaintId: string | number,
  format?: 'pdf' | 'csv',    // Default: 'pdf'
  includeResponses?: boolean  // Default: true
}
```

---

### 3. useExportDriverReport

**Purpose:** Export driver performance report

**File:** `src/hooks/schools/post/useExportDriverReport.js`

**Import:**
```javascript
import useExportDriverReport from '@/hooks/schools/post/useExportDriverReport';
```

**Usage in SchoolDriverReports.tsx:**
```typescript
import useExportDriverReport from '@/hooks/schools/post/useExportDriverReport';

export default function SchoolDriverReports() {
  const { mutate: exportReport, isLoading } = useExportDriverReport();

  const handleExportReport = () => {
    exportReport({
      format: 'pdf',
      status: filterStatus, // 'all', 'verified', or 'pending'
      includeMetrics: true
    });
  };

  return (
    <button onClick={handleExportReport} disabled={isLoading}>
      <Download size={16} /> Export Report
    </button>
  );
}
```

**Hook Parameters:**
```typescript
{
  format?: 'pdf' | 'csv',
  status?: 'all' | 'verified' | 'pending',
  includeMetrics?: boolean,
  dateRange?: { startDate: string, endDate: string }
}
```

---

## 🔄 PUT Hooks (Update Operations)

### 1. useUpdateComplaintStatus

**Purpose:** Update complaint status (mark as resolved, in-progress, etc.)

**File:** `src/hooks/schools/put/useUpdateComplaintStatus.js`

**Import:**
```javascript
import useUpdateComplaintStatus from '@/hooks/schools/put/useUpdateComplaintStatus';
import { schoolQueryKeys } from '@/hooks/schools/queryKeys';
```

**Usage in SchoolComplaintDetail.tsx:**
```typescript
import useUpdateComplaintStatus from '@/hooks/schools/put/useUpdateComplaintStatus';
import { useQueryClient } from 'react-query';

export default function SchoolComplaintDetail() {
  const queryClient = useQueryClient();
  const { mutate: updateStatus, isLoading } = useUpdateComplaintStatus();
  const { id: complaintId } = useParams();

  const handleMarkResolved = () => {
    updateStatus(
      {
        complaintId,
        status: 'resolved',
        notes: 'Driver has been counseled and given feedback.',
        resolvedBy: 'School Admin'
      },
      {
        onSuccess: () => {
          // Show success message
          toast.success('Complaint marked as resolved');
          
          // Refetch to get updated data
          queryClient.invalidateQueries(
            schoolQueryKeys.complaintsDetail(complaintId)
          );
          queryClient.invalidateQueries(schoolQueryKeys.complaintsList());
        },
        onError: (error) => {
          toast.error('Failed to update complaint status');
        }
      }
    );
  };

  return (
    <button onClick={handleMarkResolved} disabled={isLoading}>
      {isLoading ? 'Marking...' : 'Mark as Resolved'}
    </button>
  );
}
```

**Hook Parameters:**
```typescript
{
  complaintId: string | number,
  status: 'open' | 'in-progress' | 'resolved',
  notes?: string,
  resolvedBy?: string
}
```

---

### 2. useUpdateDriverVerification

**Purpose:** Update driver verification status

**File:** `src/hooks/schools/put/useUpdateDriverVerification.js`

**Import:**
```javascript
import useUpdateDriverVerification from '@/hooks/schools/put/useUpdateDriverVerification';
import { schoolQueryKeys } from '@/hooks/schools/queryKeys';
```

**Usage in SchoolDashboard.tsx:**
```typescript
import useUpdateDriverVerification from '@/hooks/schools/put/useUpdateDriverVerification';
import { useQueryClient } from 'react-query';

export default function SchoolDashboard() {
  const queryClient = useQueryClient();
  const { mutate: updateDriver, isLoading } = useUpdateDriverVerification();
  const [selectedDriver, setSelectedDriver] = useState(null);

  const handleApproveDriver = (driverId) => {
    updateDriver(
      {
        driverId,
        verificationStatus: 'verified',
        action: 'approve',
        notes: 'Documents verified successfully',
        approvedBy: 'School Admin'
      },
      {
        onSuccess: () => {
          toast.success('Driver approved successfully');
          queryClient.invalidateQueries(schoolQueryKeys.driversList());
          queryClient.invalidateQueries(schoolQueryKeys.schoolStats());
        }
      }
    );
  };

  const handleRejectDriver = (driverId) => {
    updateDriver(
      {
        driverId,
        verificationStatus: 'rejected',
        action: 'reject',
        notes: 'Documents do not meet requirements',
        approvedBy: 'School Admin'
      },
      {
        onSuccess: () => {
          toast.error('Driver rejected');
          queryClient.invalidateQueries(schoolQueryKeys.driversList());
        }
      }
    );
  };

  return (
    <div className="flex gap-2">
      <button onClick={() => handleApproveDriver(selectedDriver)} disabled={isLoading}>
        Approve
      </button>
      <button onClick={() => handleRejectDriver(selectedDriver)} disabled={isLoading}>
        Reject
      </button>
    </div>
  );
}
```

**Hook Parameters:**
```typescript
{
  driverId: string | number,
  verificationStatus?: 'verified' | 'pending' | 'rejected',
  action?: 'approve' | 'reject' | 'block' | 'unblock',
  notes?: string,
  approvedBy?: string
}
```

---

## 🔗 Complete Implementation Checklist

### SchoolDashboard.tsx
- [ ] Import `useSchoolDrivers`
- [ ] Import `useSchoolStatistics`
- [ ] Import `useUpdateDriverVerification`
- [ ] Replace `mockDrivers` with `useSchoolDrivers().data`
- [ ] Replace stats calculations with `useSchoolStatistics()`
- [ ] Add loading states
- [ ] Add error handling
- [ ] Test filtering and search

### SchoolComplaints.tsx
- [ ] Import `useSchoolComplaints`
- [ ] Import `useSchoolStatistics`
- [ ] Replace `mockComplaints` with `useSchoolComplaints().data`
- [ ] Replace stats with `useSchoolStatistics()`
- [ ] Add loading states
- [ ] Add error handling
- [ ] Test all filters

### SchoolComplaintDetail.tsx
- [ ] Import `useComplaintDetail`
- [ ] Import `useAddComplaintResponse`
- [ ] Import `useUpdateComplaintStatus`
- [ ] Import `useExportComplaintReport`
- [ ] Replace mock complaint with `useComplaintDetail(id)`
- [ ] Connect reply form to `useAddComplaintResponse`
- [ ] Connect "Mark Resolved" button to `useUpdateComplaintStatus`
- [ ] Connect export button to `useExportComplaintReport`
- [ ] Add cache invalidation
- [ ] Add loading/error states

### SchoolDriverReports.tsx
- [ ] Import `useDriverPerformance`
- [ ] Import `useSchoolStatistics`
- [ ] Import `useExportDriverReport`
- [ ] Replace mock performance data with `useDriverPerformance().data`
- [ ] Replace stats with `useSchoolStatistics()`
- [ ] Connect export button to `useExportDriverReport`
- [ ] Add loading states
- [ ] Test status filtering

---

## 💡 Best Practices

### 1. Always Handle Loading States
```typescript
const { data, isLoading, error } = useSchoolDrivers();

if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;
```

### 2. Use Proper Cache Invalidation
```typescript
const { mutate } = useAddComplaintResponse();

mutate(data, {
  onSuccess: () => {
    queryClient.invalidateQueries(schoolQueryKeys.complaintsList());
  }
});
```

### 3. Show User Feedback
```typescript
const { mutate, isLoading } = useMutation();

const handleAction = () => {
  mutate(data, {
    onSuccess: () => toast.success('Success!'),
    onError: () => toast.error('Failed!')
  });
};

<button disabled={isLoading}>
  {isLoading ? 'Loading...' : 'Click me'}
</button>
```

### 4. Extract Data Safely
```typescript
// Bad
const drivers = data.map(...);

// Good
const drivers = data?.map(...) || [];
```

---

## 🐛 Troubleshooting

### Queries Not Updating
**Problem:** Data not refreshing after mutation
**Solution:** Add `onSuccess` callback with `queryClient.invalidateQueries()`

### Data is Undefined
**Problem:** Cannot read property of undefined
**Solution:** Use optional chaining: `data?.property` or default value: `data || []`

### Too Many API Calls
**Problem:** Hook called too many times
**Solution:** Check `enabled` property, use `enabled: !!id` for conditional queries

### Mutation Errors Not Showing
**Problem:** Error callback not called
**Solution:** Ensure API returns proper error responses with status codes

---

## 📚 Related Files

- Query Keys: `src/hooks/schools/queryKeys.js`
- API Client: `src/api/apiClient.js`
- API Constants: `src/api/apiConstant.js`
- Components: `src/pages/dashboard/school/*.tsx`

---

**Last Updated:** February 24, 2026  
**Version:** 1.0  
**Status:** Ready for Integration
