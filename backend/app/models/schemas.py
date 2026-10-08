from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime

class InventoryItem(BaseModel):
    id: str
    name: str
    category: str = "General"
    expected_qty: int
    detected_qty: int = 0
    is_critical: bool = False
    apparent_availability: str = "Appears Available"  # Appears Available, Partially Obstructed, Not Detected, Requires Manual Verification
    status: str = "Compliant"  # Compliant, Warning, Critical
    confidence: float = 0.95

class TrainingCentre(BaseModel):
    id: str
    name: str
    location: str
    state: str = "Andhra Pradesh"
    capacity: int
    expected_attendance: int
    ai_estimated_presence: int
    attendance_match_pct: float
    infrastructure_score: float
    overall_compliance_score: float
    status: str  # Compliant, Attention Required, Critical
    camera_status: str = "Active"  # Active, Intermittent, Offline
    courses: List[str] = []
    last_inspection: str
    last_analysis: str
    inventory: List[InventoryItem] = []

class AlertItem(BaseModel):
    id: str
    centre_id: str
    centre_name: str
    type: str  # Attendance Discrepancy, Missing Infrastructure, Infrastructure Warning, Camera Issue
    severity: str  # Critical, Warning, Information
    timestamp: str
    description: str
    status: str = "New"  # New, Under Review, Resolved
    details: Optional[Dict[str, Any]] = None

class AttendanceAnalysisRequest(BaseModel):
    centre_id: str
    official_attendance: int
    notes: Optional[str] = None

class TimelineEvent(BaseModel):
    timestamp: str
    time_offset: str
    description: str
    type: str
    severity: str = "Information"
    detected_count: Optional[int] = None

class VideoAnalysisResult(BaseModel):
    analysis_id: str
    centre_id: str
    centre_name: str
    timestamp: str
    video_filename: Optional[str] = "Demo_CCTV_Feed.mp4"
    frames_analyzed: int
    total_frames: int
    processing_time_sec: float
    ai_mode: str  # YOLO Inference / Demonstration Fallback
    low_bandwidth_active: bool = False
    
    # Presence metrics
    official_attendance: int
    estimated_presence: int
    attendance_match_pct: float
    attendance_status: str
    
    # Infrastructure metrics
    total_expected_equipment: int
    total_detected_equipment: int
    infrastructure_compliance_pct: float
    equipment_breakdown: List[InventoryItem]
    
    # Compliance & Alerts
    overall_compliance_score: float
    overall_status: str
    alerts_generated: List[AlertItem]
    timeline_events: List[TimelineEvent]
    average_confidence: float
    privacy_disclaimer: str

class SettingsModel(BaseModel):
    attendance_threshold: float = 85.0
    infrastructure_threshold: float = 90.0
    attendance_weight: float = 50.0
    infrastructure_weight: float = 50.0
    confidence_threshold: float = 0.50
    frame_sampling_rate: int = 5
    low_bandwidth_mode: bool = False
    face_identification: str = "Disabled (Hardcoded System Constraint)"
    anonymous_detection: str = "Enabled"
    selected_language: str = "en"

class AccuracyMetrics(BaseModel):
    dataset_name: str = "MSDE Prototype Demonstration Benchmark Dataset (v1.2)"
    is_demo_dataset: bool = True
    disclaimer: str = (
        "Metrics shown in this prototype are based on the available demonstration dataset "
        "and should not be interpreted as production field accuracy."
    )
    person_detection: Dict[str, float] = {
        "precision": 93.4,
        "recall": 91.2,
        "f1_score": 92.3,
        "true_positives": 456,
        "false_positives": 32,
        "false_negatives": 44,
    }
    infrastructure_detection: Dict[str, float] = {
        "precision": 89.8,
        "recall": 87.5,
        "map_50": 88.6,
        "true_positives": 312,
        "false_positives": 35,
        "false_negatives": 45,
    }
    last_evaluated: str = "2026-10-01"

class APIResponse(BaseModel):
    success: bool
    data: Optional[Any] = None
    error: Optional[Dict[str, str]] = None
