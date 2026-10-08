from typing import List, Dict, Any, Tuple
from datetime import datetime
from ..models.schemas import TrainingCentre, InventoryItem, AlertItem, SettingsModel
from ..database.supabase_client import db

class ComplianceEngine:
    """
    Transparent, verifiable compliance engine for MSDE training centres.
    Enforces the formula:
    Overall Score = (Attendance Score * Attendance Weight) + (Infrastructure Score * Infrastructure Weight)
    """

    @staticmethod
    def calculate_attendance_score(official_attendance: int, ai_estimated_presence: int) -> Tuple[float, str]:
        """
        Calculates Attendance Match % and status.
        If official_attendance is 0, defaults to 100%.
        """
        if official_attendance <= 0:
            return 100.0, "Compliant"

        # Percentage match
        match_pct = round((min(ai_estimated_presence, official_attendance) / official_attendance) * 100.0, 1)

        if match_pct >= 90.0:
            status = "Compliant"
        elif match_pct >= 75.0:
            status = "Attention Required"
        else:
            status = "Critical"

        return match_pct, status

    @staticmethod
    def calculate_infrastructure_score(inventory: List[InventoryItem]) -> Tuple[float, str]:
        """
        Calculates Infrastructure Compliance Score based on sanctioned items.
        Critical equipment missing imposes higher penalty.
        """
        if not inventory:
            return 100.0, "Compliant"

        total_expected = sum(item.expected_qty for item in inventory)
        total_detected = sum(min(item.detected_qty, item.expected_qty) for item in inventory)

        if total_expected <= 0:
            return 100.0, "Compliant"

        raw_pct = (total_detected / total_expected) * 100.0

        # Check critical equipment
        has_critical_deficit = any(
            item.is_critical and item.detected_qty < item.expected_qty
            for item in inventory
        )

        final_score = round(raw_pct, 1)
        if final_score >= 90.0 and not has_critical_deficit:
            status = "Compliant"
        elif final_score >= 75.0:
            status = "Attention Required"
        else:
            status = "Critical"

        return final_score, status

    @staticmethod
    def calculate_overall_compliance(
        attendance_score: float,
        infrastructure_score: float,
        settings: SettingsModel
    ) -> Tuple[float, str]:
        """
        Formula:
        Overall Score = Attendance Score * (Attendance Weight / 100) +
                        Infrastructure Score * (Infrastructure Weight / 100)
        """
        att_w = settings.attendance_weight / 100.0
        inf_w = settings.infrastructure_weight / 100.0

        # Normalize weights if they don't sum to 1.0
        total_w = att_w + inf_w
        if total_w > 0:
            att_w /= total_w
            inf_w /= total_w

        overall = round((attendance_score * att_w) + (infrastructure_score * inf_w), 1)

        if overall >= 90.0:
            status = "Compliant"
        elif overall >= 75.0:
            status = "Attention Required"
        else:
            status = "Critical"

        return overall, status

    @staticmethod
    def evaluate_and_generate_alerts(
        centre_id: str,
        centre_name: str,
        official_attendance: int,
        estimated_presence: int,
        inventory: List[InventoryItem]
    ) -> List[AlertItem]:
        alerts: List[AlertItem] = []
        now_str = "Today, " + datetime.now().strftime("%I:%M %p")

        # 1. Attendance discrepancy check
        diff = official_attendance - estimated_presence
        if diff > 0:
            match_pct = round((estimated_presence / official_attendance) * 100.0, 1)
            severity = "Critical" if match_pct < 80.0 or diff >= 5 else "Warning"
            alerts.append(AlertItem(
                id=f"ALT-{centre_id}-{int(datetime.now().timestamp())}-1",
                centre_id=centre_id,
                centre_name=centre_name,
                type="Attendance Discrepancy",
                severity=severity,
                timestamp=now_str,
                description=f"Centre reported {official_attendance} trainees while AI estimated {estimated_presence} people present ({diff} unverified absentees).",
                status="New",
                details={"official": official_attendance, "estimated": estimated_presence, "deficit": diff}
            ))

        # 2. Infrastructure deficit checks
        for item in inventory:
            if item.detected_qty < item.expected_qty:
                deficit = item.expected_qty - item.detected_qty
                severity = "Critical" if item.is_critical or (deficit >= item.expected_qty * 0.3) else "Warning"
                alert_type = "Missing Infrastructure" if item.is_critical else "Infrastructure Warning"
                
                alerts.append(AlertItem(
                    id=f"ALT-{centre_id}-{item.id}-{int(datetime.now().timestamp())}",
                    centre_id=centre_id,
                    centre_name=centre_name,
                    type=alert_type,
                    severity=severity,
                    timestamp=now_str,
                    description=f"{item.expected_qty} {item.name.lower()} were sanctioned but only {item.detected_qty} were detected.",
                    status="New",
                    details={"equipment": item.name, "sanctioned": item.expected_qty, "detected": item.detected_qty}
                ))

        return alerts
