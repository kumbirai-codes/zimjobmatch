const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api"

export async function fetchJobs({ search = "", location = "All", type = "All", minMatch = 0 } = {}) {
  const params = new URLSearchParams()
  if (search) params.append("search", search)
  if (location !== "All") params.append("location", location)
  if (type !== "All") params.append("type", type)
  if (minMatch > 0) params.append("min_match", minMatch)
  const res = await fetch(`${BASE_URL}/jobs?${params.toString()}`)
  if (!res.ok) throw new Error("Failed to fetch jobs")
  return res.json()
}

export async function fetchJob(id) {
  const res = await fetch(`${BASE_URL}/jobs/${id}`)
  if (!res.ok) throw new Error("Job not found")
  return res.json()
}

export async function fetchProfile() {
  const res = await fetch(`${BASE_URL}/profile`)
  if (!res.ok) throw new Error("Failed to fetch profile")
  return res.json()
}

export async function fetchAIMatch(jobId) {
  const res = await fetch(`${BASE_URL}/jobs/${jobId}/ai-match`)
  if (!res.ok) throw new Error("AI match failed")
  return res.json()
}