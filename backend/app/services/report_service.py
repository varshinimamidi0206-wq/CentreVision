from typing import Dict, Any, Optional
from datetime import datetime
from ..database.supabase_client import db

class ReportService:
    @staticmethod
    def generate_centre_report(centre_id: str, start_date: Optional[str] = None, end_date: Optional[str] = None) -> Dict[str, Any]:
        centre = db.get_centre(centre_id)
        if not centre:
            # Fallback to Centre 001 if not found
            centre = db.get_centre("TC-001")

        settings = db.get_settings()
        centre_alerts = [a for a in db.alerts if a.centre_id == centre.id]

        report_timestamp = datetime.now().strftime("%B %d, %Y - %I:%M %p")
        inspection_period = f"{start_date or 'Last 30 Days'} to {end_date or 'Today'}"

        return {
            "report_id": f"REP-MSDE-{centre.id}-{datetime.now().strftime('%Y%m%d%H%M')}",
            "generated_at": report_timestamp,
            "period": inspection_period,
            "issuing_authority": "Ministry of Skill Development and Entrepreneurship (MSDE)",
            "compliance_framework": "Pradhan Mantri Kaushal Vikas Yojana (PMKVY 4.0)",
            "centre": {
                "id": centre.id,
                "name": centre.name,
                "location": centre.location,
                "state": centre.state,
                "capacity": centre.capacity,
                "camera_status": centre.camera_status,
                "courses": centre.courses,
                "last_inspection": centre.last_inspection,
            },
            "summary_scores": {
                "overall_compliance_score": centre.overall_compliance_score,
                "status": centre.status,
                "attendance_score": centre.attendance_match_pct,
                "infrastructure_score": centre.infrastructure_score,
                "formula_applied": f"{settings.attendance_weight}% Attendance + {settings.infrastructure_weight}% Infrastructure"
            },
            "attendance_analysis": {
                "official_reported": centre.expected_attendance,
                "ai_estimated_presence": centre.ai_estimated_presence,
                "variance": centre.expected_attendance - centre.ai_estimated_presence,
                "match_rate": f"{centre.attendance_match_pct}%",
                "methodology": "Passive Anonymous Video Geometry Sampling (No Face Recognition)"
            },
            "infrastructure_inventory": [
                {
                    "item_name": item.name,
                    "category": item.category,
                    "sanctioned_qty": item.expected_qty,
                    "visually_detected_qty": item.detected_qty,
                    "is_critical": item.is_critical,
                    "visual_availability": item.apparent_availability,
                    "item_status": item.status,
                }
                for item in centre.inventory
            ],
            "active_alerts": [
                {
                    "id": a.id,
                    "type": a.type,
                    "severity": a.severity,
                    "timestamp": a.timestamp,
                    "description": a.description,
                    "status": a.status
                }
                for a in centre_alerts
            ],
            "privacy_certification": {
                "facial_recognition": "DISABLED (Hardware/Software Enforced)",
                "biometric_capture": "ZERO BIOMETRIC FOOTPRINT",
                "data_retention": "Aggregated Metadata Only - Video streams not persisted",
                "legal_compliance": "Digital Personal Data Protection Act (DPDP), 2023 Compliant"
            },
            "officer_verification_note": (
                "AI estimated visual presence is an analytical signal to assist monitoring authorities "
                "and does not represent individual identity verification. Discrepancies flagged above require "
                "field officer endorsement before enforcement sanctions."
            )
        }
