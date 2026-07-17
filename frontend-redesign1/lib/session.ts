export const JOB_KEY = "fluxci-job-id";

function hasStorage() {
  return typeof window !== "undefined" && "sessionStorage" in window;
}

export function saveJobId(jobId: string) {
  if (!hasStorage()) return;
  sessionStorage.setItem(JOB_KEY, jobId);
}

export function getJobId(): string | null {
  if (!hasStorage()) return null;
  return sessionStorage.getItem(JOB_KEY);
}

export function clearJobId() {
  if (!hasStorage()) return;
  sessionStorage.removeItem(JOB_KEY);
}
