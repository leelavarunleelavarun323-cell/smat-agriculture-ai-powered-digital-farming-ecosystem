# SMART AGRICULTURE – AI POWERED DIGITAL FARMING ECOSYSTEM

A full-stack, modular, production-ready digital agriculture operating system connecting Farmers, Agronomists, Agricultural Labour, Machinery Owners, Cold-Chain Transporters, Inputs Stores, and Wholesale Commodity Buyers into one seamless, real-time ecosystem.

---

## 🌾 Ecosystem Architecture & Highlights

1. **Role-Based Access Control (RBAC)**
   - 7 distinct stakeholder personas: `FARMER`, `ADMIN`, `WORKER`, `TRANSPORT`, `BUYER`, `STORE_OWNER`, and `MACHINE_OWNER`.
   - Dynamic navbar quick-switcher allowing instant 1-click simulation of all 7 roles to experience every workflow.

2. **Connected Lifecycle & Closed-Loop Economy**
   - **Farm & Sensor Telemetry**: Live soil moisture probes, valve controls (Auto/Manual), and weather stations.
   - **AI Agronomy**: Gemini 3.8 Flash multi-factor crop recommendations (soil NPK, pH, season, irrigation type, and APMC demand elasticity).
   - **Inputs Store**: 1-click ordering for recommended seeds, nano urea, and bio-pesticides.
   - **Labour & Machinery**: Hire harvesters and rent 45–100 HP tractors or autonomous spraying drones.
   - **Crop Marketplace**: Farmers list harvested produce directly; wholesale buyers place procurement contracts.
   - **Freight Logistics**: Integrated agricultural transport with live delivery milestone tracking.
   - **Financial Ledger**: Automated P&L reconciliation where store orders, machinery rentals, labour bookings, and crop sales update net margins automatically.

3. **Security & Governance**
   - Government Land Record & Aadhaar KYC verification workflow.
   - Immutable security audit logs recording IP address, timestamp, module, and authorization result.

---

## 🚀 Quick Start Guide

### 1. Installation
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file based on `.env.example`:
```env
# Optional Gemini API Key for server-side GenAI crop recommendation & pest diagnostics
GEMINI_API_KEY="your-gemini-api-key"
PORT=3000
```
*(Note: If no API key is provided, the platform automatically switches to its high-precision agronomic heuristic rule engine)*.

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm start
```

---

## 🧪 Testing Personas & Ecosystem Flows

You can switch roles directly from the top-right persona selector in the navbar:

| Persona | Name | Role Capabilities |
|---|---|---|
| **Farmer** | Ramesh Patel | Dashboard, AI Crop Advisory, Sensors, Labour/Machine Booking, Harvest Listings, P&L |
| **Admin** | Dr. Sunita Rao | Platform KPIs, User KYC verification, Listing Moderation, Security Audit Logs |
| **Worker / Labour** | Vikram Singh | Browse harvesting jobs, view bookings, track wages |
| **Agri Buyer** | Rajesh Agrotech | Direct farmgate procurement contracts, mandi benchmark tracking |
| **Transport Provider** | Gurpreet Logistics | Freight dispatch, reefer fleet management, live milestone progress |
| **Store Owner** | Kisan Krishi Seva | Seed & fertilizer catalog, inventory tracking, order fulfillment |
| **Machine Owner** | Bharat Agro Fleet | Tractor & drone fleet leasing, approval workflows, rental revenue |

---

## 🗄️ Database Schema Reference (PostgreSQL / Prisma)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum UserRole {
  FARMER
  ADMIN
  WORKER
  TRANSPORT
  BUYER
  STORE_OWNER
  MACHINE_OWNER
}

model User {
  id           String       @id @default(uuid())
  name         String
  email        String       @unique
  phone        String
  role         UserRole
  location     String
  isVerified   Boolean      @default(false)
  status       String       @default("ACTIVE")
  createdAt    DateTime     @default(now())
  farms        Farm[]
  cropOrders   CropOrder[]
  transactions FinancialTransaction[]
}

model Farm {
  id             String      @id @default(uuid())
  farmerId       String
  name           String
  location       String
  totalAreaAcres Float
  soilType       String
  irrigationType String
  activeCrops    CropField[]
}

model CropField {
  id                  String   @id @default(uuid())
  farmId              String
  fieldName           String
  cropName            String
  variety             String
  sownDate            DateTime
  expectedHarvestDate DateTime
  areaAcres           Float
  stage               String
  healthScore         Int
  soilMoisturePercent Float
  targetYieldTons     Float
}
```

---

## 🛡️ Centralized REST API Endpoints

- `GET /api/auth/me` - Current session
- `POST /api/auth/switch-role` - Instant RBAC simulation
- `POST /api/ai/crop-recommendation` - Gemini AI agronomy engine
- `POST /api/ai/pest-diagnosis` - Symptom & disease diagnosis
- `GET /api/weather` - Live agricultural weather & spraying advisories
- `GET /api/market/prices` - APMC mandi prices & ARIMA prediction
- `GET /api/irrigation/zones` - Soil moisture & valve states
- `POST /api/irrigation/toggle` - Solenoid valve actuator toggle
- `GET /api/labour/workers` & `POST /api/labour/book` - Labour marketplace
- `GET /api/machines` & `POST /api/machines/book` - Machinery rental
- `GET /api/store/products` & `POST /api/store/order` - Inputs store & orders
- `GET /api/marketplace/listings` & `POST /api/marketplace/order` - Direct crop trading
- `GET /api/transport/vehicles` & `POST /api/transport/book` - Freight dispatch
- `POST /api/transport/bookings/:id/step` - Live shipment tracking stepper
- `GET /api/finance/summary` & `GET /api/finance/transactions` - P&L ledger
- `GET /api/community/posts` & `POST /api/community/posts` - Discussions & expert answers
- `GET /api/admin/metrics`, `GET /api/admin/users`, `GET /api/admin/audit-logs` - Governance
