# Ping Buz - Product Requirements Document (PRD)

## Overview
Ping Buz is a hyperlocal real-time workforce marketplace platform built as an Expo/React Native mobile app with FastAPI + MongoDB backend.

## Tech Stack
- Frontend: Expo Router, TypeScript, Zustand, Axios, glassmorphism UI
- Backend: FastAPI + MongoDB
- Brand Colors: #44BD13 (primary), #111317 (bg), #1C1E22 (secondary)

## User Types
1. Normal User - Posts jobs, hires workers
2. Individual Worker - Accepts jobs, makes offers
3. Business Owner - Manages business profile

## Phase 1: Authentication & Verification (COMPLETED ✅)
- Splash screen with cinematic animations
- 5-slide onboarding flow
- Role selection (Pro vs Normal)
- Pro type selection (Worker vs Business)
- Email/Mobile + Password + OTP auth (mock OTP: 123456)
- Worker verification (Front ID + Back ID + Selfie)
- Business verification (License + business info)
- Main app with 5-tab navigation
- Profile with "Become a Worker" option
- Google & Apple social login buttons (UI only)

## Phase 2: Job System (COMPLETED ✅)
### Features
- Post Job flow with category, title, description, budget, duration, urgency, location, photos
- Job listings (My Jobs for users, Nearby Jobs for workers)
- Job details with full information display
- **Negotiation System** - Workers make offers, users counter or accept
- Offer status tracking (pending → counter_offered → accepted/rejected)
- Auto-reject other offers when one is accepted
- Job status transitions (open → negotiating → accepted)

### Backend Endpoints
- POST /api/jobs - Create job
- GET /api/jobs/my - User's jobs
- GET /api/jobs/nearby - Available jobs for workers
- GET /api/jobs/{id} - Job details with offers
- POST /api/jobs/{id}/offers - Worker submits offer
- POST /api/offers/{id}/counter - User counter offer
- POST /api/offers/{id}/accept - Accept offer
- POST /api/offers/{id}/reject - Reject offer

### Testing
- Phase 1: 11/11 tests passed (100%)
- Phase 2: 14/14 tests passed (100%)

## Future Phases

### Phase 3: Real-time Features (Pending)
- Socket.IO chat
- Live GPS tracking
- Push notifications
- Worker arrival ETA

### Phase 4: Payments (Pending)
- Stripe, Khalti, eSewa integration
- Escrow wallet system

### Phase 5: Reviews & Admin (Pending)
- Star rating system
- Admin verification dashboard
- Dispute handling

## Known Limitations
- OTP is MOCKED (always 123456 in dev)
- No real SMS/email service integrated
- Google Maps not integrated (location is text-based)
- Payments not implemented
- Real-time features not implemented
- Auth uses query params (not JWT) - needs hardening before prod
- Passwords use SHA-256 (should be bcrypt in prod)

## Test Credentials
See /app/memory/test_credentials.md
