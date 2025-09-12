# Institute Management System

## Overview
A React-based Institute Management System that provides comprehensive management features for educational institutes including student management, course administration, fee tracking, exam management, and reporting capabilities.

## Project Architecture
- **Frontend**: React 18 loaded via CDN with Babel for JSX transformation
- **Styling**: Tailwind CSS via CDN
- **Data Storage**: LocalStorage for offline mode (Firebase Firestore support available)
- **Build System**: None required - static file serving
- **Server**: Python SimpleHTTPRequestHandler for development

## Current Setup
- Server configured to run on port 5000 with host 0.0.0.0 for Replit compatibility
- Workflow configured to run `python server.py`
- Deployment configured for autoscale mode
- Cache-Control headers set to prevent caching issues in development

## Features
- User authentication with role-based access control (Admin, Teacher, Data Entry)
- Student management with personal details and course enrollment
- Course management and administration
- Fee collection and tracking
- Exam management and result tracking
- Employee management and salary tracking
- Enquiry management system
- Reporting and PDF generation
- Institute details management
- Notification system

## Default Login Credentials
- Username: admin
- Password: password

## Recent Changes
- December 12, 2025: Initial setup for Replit environment
  - Created Python HTTP server with SPA routing support
  - Configured workflow for port 5000 with 0.0.0.0 host binding
  - Set up deployment configuration for production autoscale
  - Added cache control headers for development

## User Preferences
- None documented yet

## Project Dependencies
- Python 3.11 (for HTTP server)
- No npm dependencies (using CDN for React, Tailwind CSS)
- External CDN libraries: React 18, ReactDOM, Babel, jsPDF, html2canvas, Tailwind CSS