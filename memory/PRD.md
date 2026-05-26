# Ping Buz - Product Requirements Document (PRD)

## Overview
Ping Buz - hyperlocal workforce marketplace (Uber + TaskRabbit style) built with Expo/React Native + FastAPI + MongoDB. **COMPLETE UI DESIGN DONE** ready for backend wiring.

## Brand
- Primary Green: #44BD13 | Dark Forest: #12221F | Background: #111317

## Complete Frontend - 25+ Screens Built ✅

### 🔐 Auth & Onboarding (8 screens)
1. Splash with cinematic animations
2. Onboarding (5 slides)
3. Role Selection (Pro vs Normal)
4. Pro Type Selection (Worker vs Business)
5. Login with Email/Mobile + Google/Apple buttons
6. Register
7. OTP Verification
8. Verification Status (Pending/Approved/Rejected)

### ✅ Verification Flows (3 screens)
9. Worker Verification (Front ID + Back ID + Selfie)
10. Business Verification (License + business info)
11. Become a Worker form (Skills, rate, languages, radius)

### 🏠 Main App Tabs (5 screens)
12. Home (categories, hero CTA, nearby workers)
13. Jobs (My Jobs / Nearby tabs)
14. Map (worker pins, radius circle, controls)
15. Chat list (with online status, unread badges)
16. Profile (full menu)

### 💼 Job System (3 screens, functional with backend)
17. Post Job (categories, urgency, photos)
18. Job Details with Negotiation
19. Job History (filterable, stats summary)

### 🚗 Tracking & Communication (2 screens)
20. Live Tracking (Uber-style map + progress + worker card)
21. Chat Detail (WhatsApp-style with typing indicator)

### 📊 Worker Tools (1 screen)
22. Worker Dashboard (online toggle, earnings chart, stats, jobs)

### 💰 Payment Flow (3 screens)
23. Work Time Adjustment (hours, extras, tip selection)
24. Payment Checkout (Stripe/Khalti/eSewa/Wallet)
25. Wallet (balance, payment methods, transactions)

### 👤 Profile & Reviews (4 screens)
26. Edit Profile
27. Worker Public Profile (when viewing other workers)
28. Review/Rating (overall + detailed + recommend)
29. Notifications (filterable feed)

### ⚙️ Settings
30. Settings (5 sections with switches)

## Backend (Optional - Already Tested)
- Phase 1 Auth: 11/11 tests passed ✅
- Phase 2 Jobs/Offers: 14/14 tests passed ✅
- All other screens use static mock data ready to be wired

## Design System
- Glassmorphism with green accent borders
- Premium dark mode (#111317 → #12221F gradients)
- 8pt grid spacing
- Lucide-style icons (@expo/vector-icons)
- Floating cards with shadows
- Smooth animations (60fps)

## Components Library
- Button (primary/secondary/outline + 3 sizes)
- Input (with icons, errors, multiline)
- GlassCard (blur + green border)

## Mock Data Locations (For Backend Integration Later)
All mock screens use static `const` arrays at top of file. To wire backend:
1. Replace arrays with `useState` + `useEffect` + API call
2. Use existing `api.ts` in `/src/services/`
3. Backend endpoints documented in this PRD

## How to Test in Preview
Run `https://hyperlocal-gigs-3.preview.emergentagent.com/<screen-name>`:
- `/onboarding`, `/role-selection`, `/login`, `/register`, `/verify-otp`
- `/(main)/home`, `/post-job`, `/jobs`, `/live-tracking`
- `/worker-dashboard`, `/worker-profile`, `/become-worker`
- `/wallet`, `/payment-checkout`, `/work-adjustment`
- `/review`, `/notifications`, `/settings`, `/edit-profile`, `/job-history`
- `/chat-detail`, `/verification-status?status=pending|approved|rejected`

## Test Credentials
See `/app/memory/test_credentials.md` (OTP is always 123456)
