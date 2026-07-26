# School Dashboard - Features Specification

## Table of Contents
1. [Feature Overview](#feature-overview)
2. [Component Specifications](#component-specifications)
3. [Data Models](#data-models)
4. [UI/UX Specifications](#uiux-specifications)
5. [Functional Requirements](#functional-requirements)
6. [Non-Functional Requirements](#non-functional-requirements)

---

## Feature Overview

| Feature | Component | Status |
|---------|-----------|--------|
| Driver Verification Management | SchoolDashboard | ✅ Complete |
| Complaint Management | SchoolComplaints | ✅ Complete |
| Complaint Details View | SchoolComplaintDetail | ✅ Complete |
| Performance Reports | SchoolDriverReports | ✅ Complete |

---

## Component Specifications

### 1. SchoolDashboard.tsx

#### File Size: 456 lines

#### Responsibilities:
- Display driver list from school perspective
- Show driver verification status
- Filter and search drivers
- Display driver performance metrics
- Quick access to detailed views

#### State Management:
```typescript
const [selectedDriver, setSelectedDriver] = useState<number | null>(null);
const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all');
const [searchQuery, setSearchQuery] = useState('');
```

#### Props: None (Standalone Page)

#### Key Functions:

**filteredDrivers()**
- Filters drivers by status
- Filters by search query (name, CNIC, phone)
- Returns filtered array

**getComplianceIcon(status)**
- Returns CheckCircle for verified
- Returns Clock for pending
- Returns AlertTriangle for rejected

#### UI Sections:
1. Header with breadcrumb
2. Statistics cards (4 cards)
3. Search bar
4. Status filter dropdown
5. Driver list (grid/table)
6. Detail panel (sticky on desktop)

#### Statistics Displayed:
- Verified Drivers: Green badge
- Pending Drivers: Orange badge
- Total Complaints: Red badge
- Total Drivers: Blue badge

#### Mock Data Structure:
```typescript
{
  id: 1,
  name: 'Ahmed Khan',
  cnic: '12345-6789012-3',
  email: 'ahmed@example.com',
  phone: '03001234567',
  vanNumber: 'VP-001',
  route: 'Route A',
  verificationStatus: 'verified' | 'pending' | 'rejected',
  totalComplaints: 2,
  avgRating: 4.5,
  totalTrips: 150,
  experienceMonths: 24,
  performanceScore: 85
}
```

#### Responsive Grid:
- Mobile: 1 column (width: full)
- Tablet: 2 columns (width: ~50%)
- Desktop: 3 columns (width: ~33%)

---

### 2. SchoolComplaints.tsx

#### File Size: 410+ lines

#### Responsibilities:
- Display all complaints
- Filter by status and priority
- Search complaints
- Show complaint statistics
- Display complaint details in panel

#### State Management:
```typescript
const [selectedComplaint, setSelectedComplaint] = useState<number | null>(null);
const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'resolved' | 'in-progress'>('all');
const [filterPriority, setFilterPriority] = useState<'all' | 'high' | 'medium' | 'low'>('all');
const [searchQuery, setSearchQuery] = useState('');
const [replyText, setReplyText] = useState('');
```

#### Filter Logic:
```typescript
const filteredComplaints = complaints
  .filter(c => filterStatus === 'all' || c.status === filterStatus)
  .filter(c => filterPriority === 'all' || c.priority === filterPriority)
  .filter(c => 
    c.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.complaintId.toLowerCase().includes(searchQuery.toLowerCase())
  );
```

#### Statistics:
- Open: Count of status === 'open'
- In Progress: Count of status === 'in-progress'
- Resolved: Count of status === 'resolved'
- Total: complaints.length

#### Complaint Card Display:
- Subject (title)
- Complaint ID (badge)
- Driver Name
- Priority badge (color-coded)
- Status badge (color-coded)
- Response count indicator
- Click handler for selection

#### Detail Panel Content:
- Complaint ID and date
- Driver name
- Student details
- Subject
- Priority/Status badges
- Response count
- "View Full" button
- "Reply" button

#### Mock Complaint Data:
```typescript
{
  id: 1,
  complaintId: 'C-2026-0001',
  driverId: 1,
  driverName: 'Ahmed Khan',
  category: 'Safety Concern',
  subject: 'Speeding on school route',
  description: 'The driver was speeding...',
  priority: 'high' | 'medium' | 'low',
  status: 'open' | 'in-progress' | 'resolved',
  submittedDate: '2026-02-20',
  submittedBy: 'Parent Name',
  studentName: 'Student Name',
  responses: [
    {
      id: 1,
      date: '2026-02-21',
      time: '10:30 AM',
      message: 'We will investigate...',
      from: 'School Admin',
      details: 'Initial response'
    }
  ]
}
```

#### Priority Color Scheme:
- High: Red (#EF4444)
- Medium: Orange (#F97316)
- Low: Blue (#3B82F6)

#### Status Color Scheme:
- Open: Red (#EF4444)
- In Progress: Orange (#F97316)
- Resolved: Green (#22C55E)

---

### 3. SchoolComplaintDetail.tsx

#### File Size: 385 lines

#### Responsibilities:
- Display full complaint details
- Show conversation history
- Handle responses
- Display attachments
- Show driver information
- Track complaint timeline

#### State Management:
```typescript
const [replyText, setReplyText] = useState('');
```

#### Layout (Responsive):
**Desktop (3 columns):**
- Left: Complaint details (70%)
- Right: Side panels (30%)

**Mobile (1 column):**
- Full width stacked

#### Main Content Sections:

1. **Header**
   - Title
   - Complaint ID with badge
   - Priority badge
   - Status badge
   - Submitted date

2. **Complaint Details Card**
   - Category
   - Subject
   - Description (full text)
   - Location (with MapPin icon)
   - Witnesses
   - Submitted by
   - Submitted date

3. **Attachments Card**
   - File list (if any)
   - Download buttons
   - File icon indicator

4. **Conversation History**
   - Response cards in chronological order
   - Avatar
   - Responder name and email
   - Timestamp
   - Message content

5. **Reply Form**
   - Textarea input
   - Send button (disabled if empty)

#### Side Panels (Desktop Only):

**Driver Information Panel**
- Avatar
- Driver name
- Phone (clickable)
- Email (clickable)
- Profile button

**Actions Panel**
- Mark Resolved button
- Contact Driver button
- Download Report button

**Timeline Panel**
- Complaint submitted event
- Response added events
- Dates and times

#### Mock Complaint Detail Data:
```typescript
{
  id: 1,
  complaintId: 'C-2026-0001',
  driverId: 1,
  driverName: 'Ahmed Khan',
  driverPhone: '03001234567',
  driverEmail: 'ahmed@example.com',
  category: 'Safety Concern',
  subject: 'Speeding on school route',
  description: 'Detailed description...',
  priority: 'high' | 'medium' | 'low',
  status: 'open' | 'in-progress' | 'resolved',
  submittedDate: '2026-02-20',
  submittedBy: 'Parent Name',
  studentName: 'Student Name',
  studentAge: '10',
  studentPhone: '+92-300-1234567',
  location: 'Main Road near School',
  witnesses: 'Other parents',
  attachments: ['photo1.jpg', 'photo2.jpg'],
  responses: [
    {
      id: 1,
      date: '2026-02-21',
      time: '10:30 AM',
      message: 'We will investigate...',
      from: 'School Admin',
      fromEmail: 'admin@school.edu'
    }
  ]
}
```

---

### 4. SchoolDriverReports.tsx

#### File Size: 340+ lines

#### Responsibilities:
- Display driver performance metrics
- Show comparative analysis
- Display detailed performance cards
- Export reports
- Filter by status

#### State Management:
```typescript
const [filterStatus, setFilterStatus] = useState<'all' | 'verified' | 'pending'>('all');
```

#### Statistics Cards:

| Card | Value | Color | Formula |
|------|-------|-------|---------|
| Average Rating | 4.4/5 | Yellow | Sum of all ratings / driver count |
| Total Complaints | 3 | Red | Sum of all complaint counts |
| Verified Drivers | 3/4 | Green | Count of verified status |
| Total Trips | 593 | Blue | Sum of all trips |

#### Performance Table:

| Column | Type | Color Logic | Width |
|--------|------|-------------|-------|
| Driver | Text | - | 25% |
| Rating | Number + Star | Yellow | 15% |
| Score % | Number | Green (≥85), Yellow (≥70), Red (<70) | 15% |
| Complaints | Badge | Success (0), Warning (≤2), Danger (>2) | 15% |
| Trips | Number | - | 15% |
| Status | Badge | Success (verified), Warning (pending) | 15% |

#### Detailed Metrics Cards:

Per-driver detailed breakdown:

```typescript
{
  safety: 90,           // 0-100
  punctuality: 85,      // 0-100
  cleanliness: 80,      // 0-100
  behavior: 88          // 0-100
}
```

Each metric shown with:
- Label
- Score percentage
- Progress bar
- Color coding (green ≥85, yellow ≥70, red <70)

#### Mock Performance Data:
```typescript
{
  id: 1,
  name: 'Ahmed Khan',
  status: 'verified' | 'pending',
  rating: 4.5,           // 0-5
  complaints: 1,         // integer
  performance: 85,       // 0-100%
  trips: 150,           // integer
  safety: 90,
  punctuality: 88,
  cleanliness: 85,
  behavior: 82
}
```

#### Responsive Layout:
- Mobile: 1 column detail cards
- Tablet: 2 column detail cards
- Desktop: 2 column detail cards

---

## Data Models

### Driver Type (School View)
```typescript
interface Driver {
  id: number;
  name: string;
  cnic: string;
  email: string;
  phone: string;
  vanNumber: string;
  route: string;
  verificationStatus: 'verified' | 'pending' | 'rejected';
  approvalDate?: string;
  submittedDate?: string;
  rejectionDate?: string;
  totalComplaints: number;
  avgRating: number;  // 0-5
  totalTrips: number;
  experienceMonths: number;
  performanceScore: number;  // 0-100
}
```

### Complaint Type
```typescript
interface Complaint {
  id: number;
  complaintId: string;  // Format: C-YYYY-XXXX
  driverId: number;
  driverName: string;
  category: string;
  subject: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'open' | 'in-progress' | 'resolved';
  submittedDate: string;  // ISO format
  submittedBy: string;
  studentName: string;
  responses: Response[];
}
```

### Response Type
```typescript
interface Response {
  id: number;
  date: string;
  time: string;
  message: string;
  from: string;
  details?: string;
  fromEmail?: string;
}
```

### Driver Performance Type
```typescript
interface DriverPerformance {
  id: number;
  name: string;
  status: 'verified' | 'pending';
  rating: number;  // 0-5
  complaints: number;
  performance: number;  // 0-100%
  trips: number;
  safety: number;  // 0-100
  punctuality: number;  // 0-100
  cleanliness: number;  // 0-100
  behavior: number;  // 0-100
}
```

---

## UI/UX Specifications

### Color Palette

| Purpose | Color | Hex | Usage |
|---------|-------|-----|-------|
| Success | Green | #22C55E | Verified, Resolved, Good |
| Warning | Orange | #F97316 | Pending, In Progress |
| Danger | Red | #EF4444 | Rejected, Critical |
| Secondary | Gray | #6B7280 | Neutral, Medium |
| Primary | Blue | #3B82F6 | Links, Actions |
| Rating | Yellow | #FBBF24 | Star ratings |

### Typography

| Element | Font | Size | Weight |
|---------|------|------|--------|
| Page Title | Inter | 28px | 700 |
| Card Title | Inter | 18px | 600 |
| Body Text | Inter | 14px | 400 |
| Small Text | Inter | 12px | 400 |
| Badge Text | Inter | 12px | 500 |

### Spacing

| Element | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Page Padding | p-4 | p-6 | p-8 |
| Card Gap | gap-4 | gap-4 | gap-6 |
| Section Spacing | mb-6 | mb-8 | mb-10 |

### Responsive Breakpoints

- **xs**: 320px-479px (phone)
- **sm**: 480px-639px (large phone)
- **md**: 640px-1023px (tablet)
- **lg**: 1024px-1279px (desktop)
- **xl**: 1280px+ (large desktop)

### Component Sizing

| Component | Mobile | Desktop |
|-----------|--------|---------|
| Card | Full width | Auto |
| Detail Panel | Full width (below) | 400px (sticky) |
| Button | h-10 | h-9 |
| Input | h-10 | h-9 |
| Avatar | w-10 h-10 | w-12 h-12 |
| Icon | w-5 h-5 | w-5 h-5 |

---

## Functional Requirements

### FR1: Driver Management
- **Requirement**: School must see list of drivers
- **Acceptance Criteria**:
  - [ ] Display all drivers in list/grid
  - [ ] Show driver details (name, van, route)
  - [ ] Display verification status
  - [ ] Show performance metrics
  - [ ] Search functionality works
  - [ ] Filter by status works

### FR2: Complaint Management
- **Requirement**: School must manage driver complaints
- **Acceptance Criteria**:
  - [ ] View all complaints
  - [ ] Filter by status
  - [ ] Filter by priority
  - [ ] Search complaints
  - [ ] View complaint details
  - [ ] Add responses to complaints
  - [ ] Update complaint status

### FR3: Performance Reports
- **Requirement**: School must view driver performance
- **Acceptance Criteria**:
  - [ ] Display performance metrics
  - [ ] Show comparison table
  - [ ] Display detailed scores
  - [ ] Filter by status
  - [ ] Export reports

### FR4: Complaint Details
- **Requirement**: School must manage detailed complaints
- **Acceptance Criteria**:
  - [ ] View full complaint info
  - [ ] See driver contact details
  - [ ] View conversation history
  - [ ] Add new responses
  - [ ] Mark as resolved
  - [ ] Contact driver

### FR5: Search & Filter
- **Requirement**: Users can quickly find information
- **Acceptance Criteria**:
  - [ ] Real-time search
  - [ ] Multiple filters work together
  - [ ] Filters persist
  - [ ] Clear filter button

---

## Non-Functional Requirements

### NFR1: Performance
- Page load time: < 2 seconds
- Search results: < 300ms
- Filter operations: < 200ms
- Smooth animations: 60fps

### NFR2: Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatible
- Color-blind friendly

### NFR3: Responsive Design
- Mobile: 320px minimum
- Tablet support
- Desktop optimization
- Touch-friendly (minimum 48px tap targets)

### NFR4: Security
- Role-based access
- No sensitive data exposure
- HTTPS only
- CSRF protection

### NFR5: Usability
- Intuitive navigation
- Consistent UI patterns
- Clear error messages
- Visual feedback on interactions

---

**Document Version**: 1.0  
**Last Updated**: February 24, 2026  
**Status**: Complete
