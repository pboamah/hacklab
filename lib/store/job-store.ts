import { makeAutoObservable, runInAction } from "mobx"
import { getBrowserClient } from "@/lib/supabase"
import type { RootStore } from "./root-store"

export interface Job {
  id: string
  title: string
  company: string
  company_id: string
  location: string
  type: string
  experience_level: string
  description: string
  salary_min?: number
  salary_max?: number
  skills: string[]
  requirements?: string[]
  benefits?: string[]
  created_at: string
  updated_at: string
  posted_by: string
  applied?: boolean
  saved?: boolean
}

export class JobStore {
  jobs: Job[] = []
  savedJobs: Job[] = []
  appliedJobs: Job[] = []
  currentJob: Job | null = null
  isLoading = false
  error: string | null = null
  rootStore: RootStore

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore
    makeAutoObservable(this)
  }

  // Actions
  setJobs = (jobs: Job[]) => {
    this.jobs = jobs
  }

  setSavedJobs = (jobs: Job[]) => {
    this.savedJobs = jobs
  }

  setAppliedJobs = (jobs: Job[]) => {
    this.appliedJobs = jobs
  }

  setCurrentJob = (job: Job | null) => {
    this.currentJob = job
  }

  setLoading = (loading: boolean) => {
    this.isLoading = loading
  }

  setError = (error: string | null) => {
    this.error = error
  }

  // Async actions
  fetchJobs = async () => {
    this.setLoading(true)
    this.setError(null)
    const supabase = getBrowserClient()

    try {
      const { data, error } = await supabase
        .from("jobs")
        .select(`
          *,
          company:companies(*),
          job_applications(user_id),
          job_saves(user_id)
        `)
        .order("created_at", { ascending: false })

      if (error) throw error

      // Process jobs
      const processedJobs = data.map((job) => {
        const isApplied = job.job_applications
          ? job.job_applications.some((app: any) => app.user_id === this.rootStore.userStore.currentUser?.id)
          : false

        const isSaved = job.job_saves
          ? job.job_saves.some((save: any) => save.user_id === this.rootStore.userStore.currentUser?.id)
          : false

        return {
          ...job,
          applied: isApplied,
          saved: isSaved,
        }
      })

      runInAction(() => {
        this.setJobs(processedJobs)
        this.setSavedJobs(processedJobs.filter((job) => job.saved))
        this.setAppliedJobs(processedJobs.filter((job) => job.applied))
      })
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to fetch jobs")
      })
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  fetchJobById = async (id: string) => {
    this.setLoading(true)
    this.setError(null)
    const supabase = getBrowserClient()

    try {
      const { data, error } = await supabase
        .from("jobs")
        .select(`
          *,
          company:companies(*),
          job_applications(user_id),
          job_saves(user_id)
        `)
        .eq("id", id)
        .single()

      if (error) throw error

      // Process the job
      const isApplied = data.job_applications
        ? data.job_applications.some((app: any) => app.user_id === this.rootStore.userStore.currentUser?.id)
        : false

      const isSaved = data.job_saves
        ? data.job_saves.some((save: any) => save.user_id === this.rootStore.userStore.currentUser?.id)
        : false

      const processedJob = {
        ...data,
        applied: isApplied,
        saved: isSaved,
      }

      runInAction(() => {
        this.setCurrentJob(processedJob)
      })
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to fetch job")
      })
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  applyForJob = async (jobId: string) => {
    if (!this.rootStore.userStore.currentUser) return false

    this.setLoading(true)
    this.setError(null)
    const supabase = getBrowserClient()

    try {
      const { error } = await supabase.from("job_applications").insert({
        job_id: jobId,
        user_id: this.rootStore.userStore.currentUser.id,
        status: "applied",
      })

      if (error) throw error

      runInAction(() => {
        // Update jobs list
        this.jobs = this.jobs.map((job) => {
          if (job.id === jobId) {
            return {
              ...job,
              applied: true,
            }
          }
          return job
        })

        // Add to applied jobs
        const jobToAdd = this.jobs.find((j) => j.id === jobId)
        if (jobToAdd && !this.appliedJobs.some((j) => j.id === jobId)) {
          this.appliedJobs = [...this.appliedJobs, { ...jobToAdd, applied: true }]
        }

        // Update current job if viewing
        if (this.currentJob?.id === jobId) {
          this.currentJob = {
            ...this.currentJob,
            applied: true,
          }
        }
      })
      return true
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to apply for job")
      })
      return false
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  saveJob = async (jobId: string) => {
    if (!this.rootStore.userStore.currentUser) return false

    this.setLoading(true)
    this.setError(null)
    const supabase = getBrowserClient()

    try {
      const { error } = await supabase.from("job_saves").insert({
        job_id: jobId,
        user_id: this.rootStore.userStore.currentUser.id,
      })

      if (error) throw error

      runInAction(() => {
        // Update jobs list
        this.jobs = this.jobs.map((job) => {
          if (job.id === jobId) {
            return {
              ...job,
              saved: true,
            }
          }
          return job
        })

        // Add to saved jobs
        const jobToAdd = this.jobs.find((j) => j.id === jobId)
        if (jobToAdd && !this.savedJobs.some((j) => j.id === jobId)) {
          this.savedJobs = [...this.savedJobs, { ...jobToAdd, saved: true }]
        }

        // Update current job if viewing
        if (this.currentJob?.id === jobId) {
          this.currentJob = {
            ...this.currentJob,
            saved: true,
          }
        }
      })
      return true
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to save job")
      })
      return false
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  unsaveJob = async (jobId: string) => {
    if (!this.rootStore.userStore.currentUser) return false

    this.setLoading(true)
    this.setError(null)
    const supabase = getBrowserClient()

    try {
      const { error } = await supabase
        .from("job_saves")
        .delete()
        .eq("job_id", jobId)
        .eq("user_id", this.rootStore.userStore.currentUser.id)

      if (error) throw error

      runInAction(() => {
        // Update jobs list
        this.jobs = this.jobs.map((job) => {
          if (job.id === jobId) {
            return {
              ...job,
              saved: false,
            }
          }
          return job
        })

        // Remove from saved jobs
        this.savedJobs = this.savedJobs.filter((j) => j.id !== jobId)

        // Update current job if viewing
        if (this.currentJob?.id === jobId) {
          this.currentJob = {
            ...this.currentJob,
            saved: false,
          }
        }
      })
      return true
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to unsave job")
      })
      return false
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }
}
