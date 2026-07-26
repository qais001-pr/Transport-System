# Van Pooling Management System - Setup Guide

## 🚀 Quick Start

Follow these steps to get your Van Pooling Management System up and running.

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18.0.0 or higher) - [Download](https://nodejs.org/)
- **npm** (v9.0.0 or higher) or **yarn** (v1.22.0 or higher)
- **Git** - [Download](https://git-scm.com/)

### Step 1: Install Dependencies

Open your terminal in the project directory and run:

```bash
npm install
```

Or if you prefer yarn:

```bash
yarn install
```

This will install all required dependencies including:
- Next.js 14
- React 18
- TailwindCSS 3.4
- TypeScript
- Lucide React (icons)

### Step 2: Environment Setup

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` and configure your environment variables:
   - Add your Google Maps API key for live tracking
   - Configure database connection (when ready)
   - Set up authentication providers
   - Add email/SMS service credentials

### Step 3: Run Development Server

Start the development server:

```bash
npm run dev
```

Or with yarn:

```bash
yarn dev
```

The application will be available at: **http://localhost:3000**

### Step 4: Explore the Application

#### Landing Page
- Navigate to `http://localhost:3000`
- Explore the hero section, features, and testimonials
- Professional UI with smooth animations

#### Authentication
- **Login**: `http://localhost:3000/login`
- **Register**: `http://localhost:3000/register`
  - Choose your role: Parent, Driver, Admin, or School Guard

#### Dashboards

**Parent Dashboard**
- URL: `http://localhost:3000/dashboard/parent`
- Features:
  - View children status
  - Real-time van tracking
  - Booking management
  - Payment tracking

**Driver Dashboard**
- URL: `http://localhost:3000/dashboard/driver`
- Features:
  - Route management
  - Student list
  - Live navigation
  - Delay reporting
  - Earnings tracking

**Admin Dashboard**
- URL: `http://localhost:3000/dashboard/admin`
- Features:
  - User management
  - Driver verification
  - Complaint handling
  - System analytics

**School Guard Dashboard**
- URL: `http://localhost:3000/dashboard/guard`
- Features:
  - Van monitoring
  - Student verification
  - Attendance tracking
  - Issue reporting

## 📱 Mobile Responsiveness

The application is fully responsive and works seamlessly on:
- **Desktop** (1920px and above)
- **Laptop** (1024px - 1919px)
- **Tablet** (768px - 1023px)
- **Mobile** (320px - 767px)

### Mobile Navigation
On mobile devices, the sidebar is replaced with a bottom navigation bar for easy thumb access.

## 🎨 Design System

### Color Palette
- **Primary**: #1A2A6C (Navy Blue)
- **Secondary**: #00B8D4 (Aqua Blue)
- **Accent**: #FF6F61 (Coral Red)
- **Highlight**: #FFD460 (Soft Yellow)
- **Neutral**: #F4F4F4 (Light Grey)

### Typography
- **Headings**: Poppins (Bold, SemiBold)
- **Body**: Open Sans (Regular, Medium)

### Components
All components are built with:
- TailwindCSS utility classes
- Consistent spacing and sizing
- Smooth animations
- Accessibility in mind

## 🔧 Project Structure

```
Van_polling_management_system/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Landing page
│   ├── login/                    # Login page
│   ├── register/                 # Registration page
│   ├── dashboard/                # Dashboard pages
│   │   ├── parent/              # Parent portal
│   │   ├── driver/              # Driver portal
│   │   ├── admin/               # Admin portal
│   │   └── guard/               # Guard portal
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles
├── components/
│   ├── ui/                      # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Badge.tsx
│   │   └── Avatar.tsx
│   ├── layout/                  # Layout components
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── dashboard/               # Dashboard components
│   │   ├── Sidebar.tsx
│   │   └── Header.tsx
│   ├── mobile/                  # Mobile components
│   │   └── MobileNav.tsx
│   └── features/                # Feature components
│       ├── LiveMap.tsx
│       ├── VanCard.tsx
│       └── DelayReportModal.tsx
├── lib/
│   └── utils.ts                 # Utility functions
├── public/                      # Static assets
├── tailwind.config.js           # Tailwind configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies
```

## 🛠️ Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Type Checking
npx tsc --noEmit     # Check TypeScript types
```

## 🔌 Integration Points

### Google Maps Integration
For live tracking functionality, you'll need to:
1. Get a Google Maps API key
2. Add it to `.env.local` as `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
3. Enable Maps JavaScript API and Directions API

### Database Integration
The UI is ready for backend integration. You can connect:
- **PostgreSQL** with Prisma
- **MongoDB** with Mongoose
- **Firebase** Firestore
- **Supabase**

### Authentication
Ready for integration with:
- NextAuth.js
- Firebase Auth
- Auth0
- Clerk

### Payment Gateway
Prepared for:
- Stripe
- PayPal
- Razorpay

## 📊 Features Implemented

### ✅ Completed
- [x] Professional landing page with hero section
- [x] Login and registration pages
- [x] Parent dashboard with children tracking
- [x] Driver dashboard with route management
- [x] Admin dashboard with user management
- [x] School guard dashboard with verification
- [x] Real-time tracking interface
- [x] Van search and booking interface
- [x] Mobile-responsive design
- [x] Reusable component library
- [x] Delay reporting system
- [x] Girls-Only van filtering
- [x] Rating and review system
- [x] Comprehensive design system

### 🔄 Ready for Backend Integration
- [ ] User authentication
- [ ] Database models
- [ ] API endpoints
- [ ] Real-time GPS tracking
- [ ] Payment processing
- [ ] Email/SMS notifications
- [ ] File upload for documents

## 🎯 Next Steps

1. **Backend Development**
   - Set up database schema
   - Create API routes
   - Implement authentication
   - Add real-time features with WebSockets

2. **Third-Party Integrations**
   - Integrate Google Maps for live tracking
   - Set up payment gateway
   - Configure email/SMS services
   - Add push notifications

3. **Testing**
   - Write unit tests
   - Add integration tests
   - Perform user acceptance testing
   - Security testing

4. **Deployment**
   - Deploy to Vercel/Netlify
   - Set up CI/CD pipeline
   - Configure production environment
   - Monitor performance

## 🐛 Troubleshooting

### Port Already in Use
If port 3000 is already in use:
```bash
# Kill the process using port 3000
npx kill-port 3000

# Or run on a different port
npm run dev -- -p 3001
```

### Module Not Found Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors
```bash
# Check for type errors
npx tsc --noEmit

# If issues persist, restart TypeScript server in VS Code
# Cmd/Ctrl + Shift + P -> "TypeScript: Restart TS Server"
```

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Lucide Icons](https://lucide.dev/)

## 💡 Tips

1. **Hot Reload**: Changes to files will automatically reload in the browser
2. **Component Development**: Use the component library in `/components/ui` for consistency
3. **Styling**: Follow the design system defined in `tailwind.config.js`
4. **Type Safety**: Leverage TypeScript for better development experience
5. **Mobile First**: Always test on mobile devices or use browser dev tools

## 🤝 Support

For questions or issues:
- Check the README.md for general information
- Review component documentation in code comments
- Contact the development team

---

**Happy Coding! 🚀**

Built with ❤️ using Next.js, TailwindCSS, and TypeScript
