# Ping Buz - Product Requirements Document (PRD)

## Overview
Ping Buz is a hyperlocal real-time workforce marketplace platform built as an Expo/React Native mobile app with a FastAPI backend and MongoDB database. It combines concepts from Uber, inDrive, Bark, and TaskRabbit.

## Tech Stack
- **Frontend:** Expo (React Native) with TypeScript
- **Backend:** FastAPI with Python
- **Database:** MongoDB
- **State Management:** Zustand
- **Navigation:** Expo Router
- **HTTP Client:** Axios
- **UI:** Custom glassmorphism design system

## Brand Colors
- Primary Green: #44BD13
- Dark Forest: #12221F
- Deep Green: #203E29
- Slate Accent: #3D4A5E
- Main Background: #111317
- Secondary Background: #1C1E22

## User Types
1. **Normal User** - Posts jobs, hires workers
2. **Individual Worker** - Accepts jobs, earns money
3. **Business Owner** - Manages business profile, gets leads

## Phase 1: Authentication & Verification (COMPLETED)

### Implemented Features
- Cinematic splash screen with glow animations
- 5-slide onboarding flow
- Role selection (Pro vs Normal User)
- Pro type selection (Worker vs Business)
- Email/Mobile login with OTP
- Registration for all 3 user types
- OTP verification (mock: 123456)
- Worker verification (Front ID + Back ID + Selfie)
- Business verification (License + business info)
- Main app with 5-tab bottom navigation
- Profile screen with "Become a Worker" option
- Logout functionality

## Backend API Endpoints
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/verify-otp
- POST /api/auth/send-otp
- GET /api/user/profile/{user_id}
- POST /api/user/become-worker
- POST /api/worker/verification
- GET /api/worker/verification/{user_id}
- POST /api/business/verification
- GET /api/business/verification/{user_id}

## Future Phases (Not Implemented Yet)

### Phase 2: Job System
- Post job flow with photos, budget, location
- Worker dashboard with nearby jobs
- Job acceptance & negotiation
- Price counter-offers

### Phase 3: Real-time Features
- Socket.IO chat
- Live GPS tracking
- Real-time notifications
- Worker arrival ETA

### Phase 4: Payments
- Stripe, Khalti, eSewa integration
- Escrow wallet system

### Phase 5: Reviews & Admin
- Star rating system
- Admin verification dashboard
- Dispute handling

## Known Limitations
- OTP is MOCKED (always returns 123456 in dev)
- No real SMS/email service integrated yet
- Google Maps not integrated
- Payments not yet implemented
- Real-time features not yet implemented
