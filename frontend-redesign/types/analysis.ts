export interface Analysis {
  id: number;
  job_id: string;
  error_type: string;
  root_cause: string;
  explanation: string;
  fix_suggestion: string;
  fix_command: string;
  analysis_source: string;
  created_at: string;
}