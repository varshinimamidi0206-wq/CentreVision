export type CentreStatus = 'Compliant' | 'Attention Required' | 'Critical';
export type AlertSeverity = 'Critical' | 'Warning' | 'Information';
export type AlertStatus = 'New' | 'Under Review' | 'Resolved';
export type VisualAvailability = 'Appears Available' | 'Partially Obstructed' | 'Not Detected' | 'Requires Manual Verification';

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  expected_qty: number;
  detected_qty: number;
  is_critical: boolean;
  apparent_availability: VisualAvailability;
  status: 'Compliant' | 'Warning' | 'Critical';
  confidence?: number;
}

export interface TrainingCentre {
  id: string;
  name: string;
  location: string;
  state: string;
  capacity: number;
  expected_attendance: number;
  ai_estimated_presence: number;
  attendance_match_pct: number;
  infrastructure_score: number;
  overall_compliance_score: number;
  status: CentreStatus;
  camera_status: 'Active' | 'Intermittent' | 'Offline';
  courses: string[];
  last_inspection: string;
  last_analysis: string;
  inventory: InventoryItem[];
}

export interface AlertItem {
  id: string;
  centre_id: string;
  centre_name: string;
  type: string;
  severity: AlertSeverity;
  timestamp: string;
  description: string;
  status: AlertStatus;
  details?: Record<string, any>;
}

export interface DashboardSummary {
  total_centres: number;
  compliant_centres: number;
  attention_required_centres: number;
  critical_centres: number;
  average_attendance: number;
  infrastructure_compliance: number;
  active_alerts: number;
  attendance_trend: Array<{ time: string; expected: number; ai_estimated: number }>;
  infrastructure_compliance_categories: Array<{ category: string; compliance: number; benchmark: number }>;
  alert_distribution: Array<{ category: string; count: number; color: string }>;
  centres: TrainingCentre[];
}

export interface SystemStatus {
  status: string;
  backend_api: string;
  ai_engine: string;
  database: string;
  camera_service: string;
  timestamp: string;
}

export interface TimelineEvent {
  timestamp: string;
  time_offset: string;
  description: string;
  type: string;
  severity: string;
  detected_count?: number | null;
}

export interface VideoAnalysisResult {
  analysis_id: string;
  centre_id: string;
  centre_name: string;
  timestamp: string;
  video_filename: string;
  frames_analyzed: number;
  total_frames: number;
  processing_time_sec: number;
  ai_mode: string;
  low_bandwidth_active: boolean;
  official_attendance: number;
  estimated_presence: number;
  attendance_match_pct: number;
  attendance_status: string;
  total_expected_equipment: number;
  total_detected_equipment: number;
  infrastructure_compliance_pct: number;
  equipment_breakdown: InventoryItem[];
  overall_compliance_score: number;
  overall_status: string;
  alerts_generated: AlertItem[];
  timeline_events: TimelineEvent[];
  average_confidence: number;
  privacy_disclaimer: string;
}

export interface AccuracyMetrics {
  dataset_name: string;
  is_demo_dataset: boolean;
  disclaimer: string;
  person_detection: {
    precision: number;
    recall: number;
    f1_score: number;
    true_positives: number;
    false_positives: number;
    false_negatives: number;
  };
  infrastructure_detection: {
    precision: number;
    recall: number;
    map_50: number;
    true_positives: number;
    false_positives: number;
    false_negatives: number;
  };
  last_evaluated: string;
}

export interface Settings {
  attendance_threshold: number;
  infrastructure_threshold: number;
  attendance_weight: number;
  infrastructure_weight: number;
  confidence_threshold: number;
  frame_sampling_rate: number;
  low_bandwidth_mode: boolean;
  face_identification: string;
  anonymous_detection: string;
  selected_language: string;
}
