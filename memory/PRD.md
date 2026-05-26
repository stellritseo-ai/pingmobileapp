# Ping Buz - Product Requirements Document (PRD)

## Overview
Ping Buz is a hyperlocal real-time workforce marketplace platform built as an Expo/React Native mobile app with FastAPI + MongoDB backend.

## Tech Stack
- Frontend: Expo Router, TypeScript, Zustand, Axios, glassmorphism UI
- Backend: FastAPI + MongoDB
- Brand Colors: #44BD13 (primary), #111317 (bg), #1C1E22 (secondary)

## Complete Frontend Design (COMPLETED ✅)

### Authentication Flow
- ✅ Cinematic splash screen with glow animations
- ✅ 5-slide onboarding (with skip)
- ✅ Role selection (Pro vs Normal)
- ✅ Pro type selection (Worker vs Business)
- ✅ Login (email/mobile toggle + Google/Apple social buttons)
- ✅ Registration (with validation)
- ✅ OTP verification (auto-fill in dev)

### Verification Flow
- ✅ Worker verification (Front ID + Back ID + Selfie upload)
- ✅ Business verification (License + business info)

### Main App (5 Tabs)
- ✅ Home - Categories, hero CTA, nearby workers
- ✅ Jobs - My Jobs / Nearby Jobs with tabs (functional with backend)
- ✅ Map - Workers on map with markers, radius circle, controls
- ✅ Chat - Chat list with online indicators
- ✅ Profile - Full profile with menu items

### Job System (Functional + Backend)
- ✅ Post Job - Multi-step with categories, urgency, photos
- ✅ Job Details - With negotiation UI
- ✅ Negotiation - Offer/counter/accept/reject (works end-to-end)

### Additional Screens (Mock UI, ready for backend)
- ✅ **Live Tracking** - Uber-style map with worker marker, route, ETA badge, progress bar, worker card with call/chat buttons
- ✅ **Worker Dashboard** - Online toggle, earnings hero card, weekly bar chart, stats cards, nearby jobs
- ✅ **Chat Detail** - WhatsApp-style chat with typing indicator, read receipts, attachment, voice
- ✅ **Notifications** - Filterable list with unread badges, icons by type
- ✅ **Wallet** - Balance card with Add/Withdraw/Transfer, payment methods (Stripe/Khalti/eSewa), transaction history
- ✅ **Review/Rating** - 5-star overall + detailed (Quality/Communication/Punctuality) + recommend yes/no
- ✅ **Settings** - 5 sections (Account/Notifications/Security/Preferences/Support) with switches
- ✅ **Edit Profile** - Avatar with camera button, form fields
- ✅ **Job History** - Filterable list with stats summary, ratings display

## Design System
- Glassmorphism cards with green border accents
- Linear gradients for hero sections
- Premium dark mode #111317 → #12221F
- Animated transitions and floating effects
- 44x44 minimum touch targets
- SafeAreaView + KeyboardAvoidingView on all screens

## Backend Status
- Phase 1 Auth: 11/11 tests passed ✅
- Phase 2 Jobs/Offers: 14/14 tests passed ✅
- All endpoints ready to be wired to remaining mock screens

## How to Connect Backend Later
Each mock screen uses static arrays. To connect:
1. Replace mock arrays with `useState` + `useEffect` calling API
2. Endpoints needed for new features:
   - GET /api/notifications/{user_id}
   - GET /api/chat/list/{user_id}
   - GET /api/chat/messages/{chat_id}
   - POST /api/chat/messages
   - GET /api/wallet/{user_id}
   - GET /api/transactions/{user_id}
   - POST /api/reviews
   - GET /api/job-history/{user_id}
   - POST /api/tracking/update-location

## Known Limitations
- All screens after job system are MOCKED (static data)
- OTP is MOCKED (always 123456)
- Maps are static visualizations (not real Google Maps)
- Payments not implemented
- Real-time features (Socket.IO) not implemented

## Test Credentials
See /app/memory/test_credentials.md
