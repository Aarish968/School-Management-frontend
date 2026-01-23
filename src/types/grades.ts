// types/grades.ts
export interface Grade {
  id: number;
  student_id: number;
  subject_id: number;
  teacher_id: number;
  assignment_name: string;
  grade_type: string;
  marks_obtained: number;
  total_marks: number;
  percentage: number;
  letter_grade?: string;
  academic_year: string;
  semester?: string;
  term?: string;
  remarks?: string;
  is_published: boolean;
  created_at: string;
  updated_at?: string;
  student_name?: string;
  teacher_name?: string;
  subject_name?: string;
  subject_code?: string;
}

export interface StudentGradesSummary {
  student_id: number;
  student_name: string;
  academic_year: string;
  semester?: string;
  term?: string;
  total_subjects: number;
  average_percentage: number;
  overall_grade: string;
  grades: Grade[];
}

export interface ReportCard {
  id: number;
  student_id: number;
  subject_id: number;
  teacher_id: number;
  academic_year: string;
  semester?: string;
  term?: string;
  total_marks_obtained: number;
  total_marks_possible: number;
  percentage: number;
  letter_grade: string;
  grade_points: number;
  classes_attended: number;
  total_classes: number;
  attendance_percentage: number;
  teacher_remarks?: string;
  strengths?: string;
  areas_for_improvement?: string;
  is_published: boolean;
  is_final: boolean;
  created_at: string;
  updated_at?: string;
  student_name?: string;
  teacher_name?: string;
  subject_name?: string;
  subject_code?: string;
}

export interface StudentReportCardSummary {
  student_id: number;
  student_name: string;
  student_class?: number;
  student_department?: string;
  academic_year: string;
  semester?: string;
  term?: string;
  total_subjects: number;
  overall_percentage: number;
  overall_grade: string;
  overall_gpa: number;
  overall_attendance: number;
  subjects_passed: number;
  subjects_failed: number;
  rank?: number;
  report_cards: ReportCard[];
}