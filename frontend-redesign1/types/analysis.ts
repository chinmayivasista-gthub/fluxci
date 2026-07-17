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

export type JobStatusValue =
  | "PENDING"
  | "RUNNING"
  | "COMPLETED"
  | "FAILED"
  | string;

export interface Job {
  job_id: string;
  status: JobStatusValue;
  current_step: string;
  analysis?: Analysis | null;
  error?: string | null;
}
