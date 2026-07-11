export const JOB_KEY = "fluxci-job-id";

export function saveJobId(jobId: string) {
  sessionStorage.setItem(JOB_KEY, jobId);
}

export function getJobId() {
  return sessionStorage.getItem(JOB_KEY);
}

export function clearJobId() {
  sessionStorage.removeItem(JOB_KEY);
}