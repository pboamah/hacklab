import { makeAutoObservable, runInAction } from "mobx"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "../../types/supabase"

interface Job {
  id: string
  title: string
  company: string
  description: string
  location: string
  salary_range: string
  job_type: string
  experience_level: string
  skills_required: string[]
  posted_by: string
  status: string
  application_deadline: string
  created_at: string
  updated_at: string
}

interface JobApplication {
  id: string
  job_id: string
  user_id: string
  cover_letter: string
  resume_url: string
  status: string
  created_at: string
  updated_at: string
}

interface JobState {
  jobs: Job[]
  currentJob: Job | null
  userApplications: JobApplication[]
  loading: boolean
  error: string | null
}

export class JobStore {
  state: JobState = {
    jobs: [],
    currentJob: null,
    userApplications: [],
    loading: false,
    error: null,
  }

  constructor() {
    makeAutoObservable(this)
  }

  // Fetch all jobs
  async fetchJobs() {
    this.state.loading = true
    this.state.error = null

    try {
      const supabase = createClientComponentClient<Database>()
      const { data, error } = await supabase.from("jobs").select("*").order("created_at", { ascending: false })

      runInAction(() => {
        if (error) {
          this.state.error = error.message
        } else {
          this.state.jobs = data || []
        }
        this.state.loading = false
      })
    } catch (error) {
      runInAction(() => {
        this.state.error = error instanceof Error ? error.message : "Unknown error occurred"
        this.state.loading = false
      })
    }
  }

  // Fetch a single job by ID
  async fetchJobById(id: string) {
    this.state.loading = true
    this.state.error = null

    try {
      const supabase = createClientComponentClient<Database>()
      const { data, error } = await supabase.from("jobs").select("*").eq("id", id).single()

      runInAction(() => {
        if (error) {
          this.state.error = error.message
        } else {
          this.state.currentJob = data
        }
        this.state.loading = false
      })
    } catch (error) {
      runInAction(() => {
        this.state.error = error instanceof Error ? error.message : "Unknown error occurred"
        this.state.loading = false
      })
    }
  }

  // Create a new job
  async createJob(job: Omit<Job, "id" | "created_at" | "updated_at">) {
    this.state.loading = true
    this.state.error = null

    try {
      const supabase = createClientComponentClient<Database>()
      const { data, error } = await supabase.from("jobs").insert([job]).select()

      runInAction(() => {
        if (error) {
          this.state.error = error.message
        } else if (data && data.length > 0) {
          this.state.jobs = [data[0], ...this.state.jobs]
          this.state.currentJob = data[0]
        }
        this.state.loading = false
      })

      return { data, error }
    } catch (error) {
      runInAction(() => {
        this.state.error = error instanceof Error ? error.message : "Unknown error occurred"
        this.state.loading = false
      })
      return { data: null, error }
    }
  }

  // Update an existing job
  async updateJob(id: string, updates: Partial<Job>) {
    this.state.loading = true
    this.state.error = null

    try {
      const supabase = createClientComponentClient<Database>()
      const { data, error } = await supabase.from("jobs").update(updates).eq("id", id).select()

      runInAction(() => {
        if (error) {
          this.state.error = error.message
        } else if (data && data.length > 0) {
          this.state.jobs = this.state.jobs.map((j) => (j.id === id ? { ...j, ...data[0] } : j))
          if (this.state.currentJob?.id === id) {
            this.state.currentJob = data[0]
          }
        }
        this.state.loading = false
      })

      return { data, error }
    } catch (error) {
      runInAction(() => {
        this.state.error = error instanceof Error ? error.message : "Unknown error occurred"
        this.state.loading = false
      })
      return { data: null, error }
    }
  }

  // Delete a job
  async deleteJob(id: string) {
    this.state.loading = true
    this.state.error = null

    try {
      const supabase = createClientComponentClient<Database>()
      const { error } = await supabase.from("jobs").delete().eq("id", id)

      runInAction(() => {
        if (error) {
          this.state.error = error.message
        } else {
          this.state.jobs = this.state.jobs.filter((j) => j.id !== id)
          if (this.state.currentJob?.id === id) {
            this.state.currentJob = null
          }
        }
        this.state.loading = false
      })

      return { error }
    } catch (error) {
      runInAction(() => {
        this.state.error = error instanceof Error ? error.message : "Unknown error occurred"
        this.state.loading = false
      })
      return { error }
    }
  }

  // Fetch user's job applications
  async fetchUserApplications(userId: string) {
    this.state.loading = true
    this.state.error = null

    try {
      const supabase = createClientComponentClient<Database>()
      const { data, error } = await supabase
        .from("job_applications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      runInAction(() => {
        if (error) {
          this.state.error = error.message
        } else {
          this.state.userApplications = data || []
        }
        this.state.loading = false
      })
    } catch (error) {
      runInAction(() => {
        this.state.error = error instanceof Error ? error.message : "Unknown error occurred"
        this.state.loading = false
      })
    }
  }

  // Apply for a job
  async applyForJob(application: Omit<JobApplication, "id" | "created_at" | "updated_at">) {
    this.state.loading = true
    this.state.error = null

    try {
      const supabase = createClientComponentClient<Database>()
      const { data, error } = await supabase.from("job_applications").insert([application]).select()

      runInAction(() => {
        if (error) {
          this.state.error = error.message
        } else if (data && data.length > 0) {
          this.state.userApplications = [data[0], ...this.state.userApplications]
        }
        this.state.loading = false
      })

      return { data, error }
    } catch (error) {
      runInAction(() => {
        this.state.error = error instanceof Error ? error.message : "Unknown error occurred"
        this.state.loading = false
      })
      return { data: null, error }
    }
  }

  // Reset current job
  resetCurrentJob() {
    this.state.currentJob = null
  }

  // Reset error
  resetError() {
    this.state.error = null
  }
}

export const jobStore = new JobStore()
