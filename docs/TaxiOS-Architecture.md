# Taxi OS — Master Architecture v1.0

## Vision

Taxi OS is a multi-tenant taxi operating system for local taxi companies.

First deployment:
Murrys Taxi — Arnprior, Ontario

Long-term goal:
Allow multiple taxi companies to run customer booking, driver dispatch, fleet management, payments, and reporting from one platform.

---

## Main Products

### 1. Customer App

For riders.

Core features:
- Phone login
- Book now
- Book later
- Destination search
- Ride selection
- Fare estimate
- Driver assignment
- Live trip tracking
- Trip complete
- Rating

---

### 2. Driver App

For drivers.

Core features:
- Online / Offline
- New trip request
- Accept / Decline
- Navigate to pickup
- Start trip
- Complete trip
- Daily trip history
- Driver earnings summary

---

### 3. Dispatcher Panel

For taxi office / dispatcher.

Core features:
- View incoming requests
- Assign driver manually
- Reassign driver
- Track active trips
- Track driver locations
- Create phone bookings
- Cancel or edit trips

---

### 4. Company Admin Panel

For taxi company owner.

Core features:
- Manage drivers
- Manage vehicles
- Manage dispatchers
- Manage pricing
- View reports
- View revenue
- View customer history
- Manage service area

---

### 5. Super Admin Panel

For Taxi OS owner.

Core features:
- Create taxi companies
- Manage subscription plans
- Enable/disable companies
- Manage global settings
- Monitor platform health

---

## Multi-Tenant Model

Every important record belongs to an organization.

Examples:

- organizations
- users
- drivers
- vehicles
- rides
- payments
- dispatchers
- pricing_rules

Each taxi company has:
- own logo
- own colors
- own drivers
- own vehicles
- own customers
- own pricing
- own service area

Murrys Taxi is the first organization.

---

## Core Data Models

### Organization

Represents a taxi company.

Fields:
- id
- name
- city
- province
- phone
- logo_url
- primary_color
- status

---

### User

Represents app users.

Types:
- customer
- driver
- dispatcher
- admin
- super_admin

---

### Driver

Represents a driver profile.

Fields:
- user_id
- organization_id
- status
- rating
- current_location
- online_status

---

### Vehicle

Represents taxi vehicle.

Fields:
- organization_id
- driver_id
- make
- model
- color
- plate
- vehicle_type

---

### Ride

Represents a taxi trip.

Statuses:
- requested
- assigned
- driver_arriving
- in_progress
- completed
- cancelled

---

### Payment

Phase 1:
- Pay in car

Phase 2:
- In-app card payment

---

## Dispatch Logic

MVP:
Manual dispatch.

Flow:
Customer requests ride.
Dispatcher receives request.
Dispatcher assigns driver.
Driver accepts.
Customer tracks driver.

Future:
Automatic dispatch based on:
- nearest driver
- driver queue
- vehicle type
- customer preference
- airport bookings
- scheduled rides

---

## Pricing Engine

MVP:
Static demo fare.

Future:
- base fare
- distance
- duration
- airport fixed fare
- waiting time
- service fee
- promo discount

---

## AI Features

Future AI Dispatcher:

Examples:
- “I need a ride to the airport tomorrow at 5 AM.”
- “Book a wheelchair-accessible taxi.”
- “Send the nearest available driver.”

AI should assist, not replace dispatcher control.

---

## Product Principle

Simple for customers.
Fast for drivers.
Controlled by dispatchers.
Profitable for taxi companies.
Scalable for Taxi OS.