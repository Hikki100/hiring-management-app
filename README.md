# Hiring Management Web App

Platform manajemen rekrutmen untuk Admin (HRD) dan Job Seeker (Pelamar).

## 🚀 Tech Stack

- Next.js 16.0.3
- React 19.2.0
- TailwindCSS 3.4.1
- Lucide React (Icons)

## 📦 How to Run Locally

1. Install dependencies:

```bash
npm install
```

2. Run development server:

```bash
npm run dev
```

3. Open browser: http://localhost:3000

## 🔑 Demo Credentials

**Admin Account:**

- Email: admin@company.com
- Password: admin123

**User Account:**

- Email: user@email.com
- Password: user123

## ✨ Key Features Implemented

### Admin (HRD) Features:

- ✅ Job Management (Create, View, Filter, Search)
- ✅ Dynamic Form Configuration (Set mandatory/optional/hidden fields)
- ✅ Candidate Management Table (Sort, Search, Pagination, Column Resize)
- ✅ Job Statistics Dashboard

### User (Job Seeker) Features:

- ✅ Browse Active Job Listings
- ✅ Dynamic Application Form (Adapts to admin configuration)
- ✅ Webcam Capture with Gesture Detection (Keyboard simulation: Press 1-2-3)
- ✅ Form Validation (Required/Optional fields)

## 🎨 Design Highlights

- Pixel-perfect implementation from Figma design
- Responsive layout (mobile, tablet, desktop)
- Modern UI with smooth transitions
- Accessible components with proper contrast

## 🔧 Optional Enhancements Added

- Real-time search filtering
- Job statistics cards
- Success/error states with animations
- Loading indicators for better UX

## 📝 Design Assumptions

- Backend API is mocked with JSON files (jobs.json, users.json, candidates.json)
- Authentication uses localStorage (client-side only)
- Webcam gesture uses keyboard simulation (1-2-3 keys) instead of real hand detection library
- Photo capture works with standard browser MediaStream API

## ⚠️ Known Limitations

- No persistent database (data resets on page refresh)
- Webcam gesture uses keyboard simulation instead of real hand tracking
- No email notifications for applications
- No file upload for resume/CV
