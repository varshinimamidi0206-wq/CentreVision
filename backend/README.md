# CentreVision Backend API

**AI-Powered Training Centre Compliance Monitoring**  
Ministry of Skill Development and Entrepreneurship (MSDE)  
Problem Statement ID: 26245

## Overview
High-performance FastAPI service integrating privacy-preserving computer vision (YOLOv8 & OpenCV) with the MSDE statutory compliance evaluation engine.

## Quickstart
```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Run backend server
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```

## Endpoints
- `GET  /api/health` - System health and component status
- `GET  /api/dashboard` - Monitoring overview and KPIs
- `GET  /api/centres` - Centre directory with filters
- `GET  /api/centres/{id}` - Comprehensive centre status & inventory
- `GET  /api/alerts` - Active compliance discrepancy alerts
- `POST /api/alerts/{id}/review` - Mark alert under review
- `POST /api/alerts/{id}/resolve` - Mark alert resolved
- `POST /api/analyze/video` - Video upload & full AI audit
- `POST /api/analyze/attendance` - Anonymous presence estimation
- `POST /api/analyze/infrastructure` - Visual asset audit
- `POST /api/analyze/demo` - Instant 2-minute demo workflow
- `GET  /api/accuracy` - Benchmark metrics & confusion analysis
- `GET  /api/reports/{id}` - Official statutory inspection summary
- `GET  /api/settings` - Compliance weights & thresholds

## Privacy Guarantee
CentreVision operates with zero facial biometric harvesting. Geometric detection extracts human head/body contours and sanctioned equipment coordinates without storing or processing identifiable personal data.
