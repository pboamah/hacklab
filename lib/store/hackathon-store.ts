import { makeAutoObservable, runInAction } from "mobx"
import { getBrowserClient } from "@/lib/supabase"
import type { RootStore } from "./root-store"

export interface Hackathon {
  id: string
  name: string
  description: string
  start_date: string
  end_date: string
  location: string
  image_url?: string
  organizer_id: string
  max_participants?: number
  prize_pool?: string
  registration_deadline?: string
  created_at: string
  updated_at: string
  hackathon_participants?: any[]
  organizer?: any
  status?: "upcoming" | "active" | "past"
  registered?: boolean
}

export interface Team {
  id: string
  name: string
  description?: string
  hackathon_id: string
  leader_id: string
  image_url?: string
  created_at: string
  updated_at: string
  team_members?: any[]
  submission_id?: string
  status?: "forming" | "complete" | "submitted"
}

export class HackathonStore {
  hackathons: Hackathon[] = []
  currentHackathon: Hackathon | null = null
  teams: Team[] = []
  currentTeam: Team | null = null
  isLoading = false
  error: string | null = null
  rootStore: RootStore

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore
    makeAutoObservable(this)
  }

  // Actions
  setHackathons = (hackathons: Hackathon[]) => {
    this.hackathons = hackathons
  }

  setCurrentHackathon = (hackathon: Hackathon | null) => {
    this.currentHackathon = hackathon
  }

  setTeams = (teams: Team[]) => {
    this.teams = teams
  }

  setCurrentTeam = (team: Team | null) => {
    this.currentTeam = team
  }

  setLoading = (loading: boolean) => {
    this.isLoading = loading
  }

  setError = (error: string | null) => {
    this.error = error
  }

  // Async actions
  fetchHackathons = async () => {
    this.setLoading(true)
    this.setError(null)
    const supabase = getBrowserClient()
    const now = new Date().toISOString()

    try {
      const { data, error } = await supabase
        .from("hackathons")
        .select(`
          *,
          organizer:users!organizer_id(id, full_name, avatar_url),
          hackathon_participants(user_id)
        `)
        .order("start_date", { ascending: true })

      if (error) throw error

      // Process hackathons
      const processedHackathons = data.map((hackathon) => {
        const startDate = new Date(hackathon.start_date)
        const endDate = new Date(hackathon.end_date)
        const currentDate = new Date()

        let status: "upcoming" | "active" | "past" = "upcoming"
        if (currentDate > endDate) {
          status = "past"
        } else if (currentDate >= startDate && currentDate <= endDate) {
          status = "active"
        }

        return {
          ...hackathon,
          status,
          registered: hackathon.hackathon_participants
            ? hackathon.hackathon_participants.some(
                (participant: any) => participant.user_id === this.rootStore.userStore.currentUser?.id,
              )
            : false,
        }
      })

      runInAction(() => {
        this.setHackathons(processedHackathons)
      })
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to fetch hackathons")
      })
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  fetchHackathonById = async (id: string) => {
    this.setLoading(true)
    this.setError(null)
    const supabase = getBrowserClient()

    try {
      const { data, error } = await supabase
        .from("hackathons")
        .select(`
          *,
          organizer:users!organizer_id(*),
          hackathon_participants(*, user:users(*))
        `)
        .eq("id", id)
        .single()

      if (error) throw error

      // Process the hackathon
      const startDate = new Date(data.start_date)
      const endDate = new Date(data.end_date)
      const currentDate = new Date()

      let status: "upcoming" | "active" | "past" = "upcoming"
      if (currentDate > endDate) {
        status = "past"
      } else if (currentDate >= startDate && currentDate <= endDate) {
        status = "active"
      }

      const processedHackathon = {
        ...data,
        status,
        registered: data.hackathon_participants
          ? data.hackathon_participants.some(
              (participant: any) => participant.user.id === this.rootStore.userStore.currentUser?.id,
            )
          : false,
      }

      runInAction(() => {
        this.setCurrentHackathon(processedHackathon)
      })
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to fetch hackathon")
      })
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  registerForHackathon = async (hackathonId: string) => {
    if (!this.rootStore.userStore.currentUser) return false

    this.setLoading(true)
    this.setError(null)
    const supabase = getBrowserClient()

    try {
      const { error } = await supabase.from("hackathon_participants").insert({
        hackathon_id: hackathonId,
        user_id: this.rootStore.userStore.currentUser.id,
        status: "registered",
      })

      if (error) throw error

      runInAction(() => {
        // Update hackathons list
        this.hackathons = this.hackathons.map((hackathon) => {
          if (hackathon.id === hackathonId) {
            return {
              ...hackathon,
              registered: true,
              hackathon_participants: [
                ...(hackathon.hackathon_participants || []),
                { user_id: this.rootStore.userStore.currentUser?.id },
              ],
            }
          }
          return hackathon
        })

        // Update current hackathon if viewing
        if (this.currentHackathon?.id === hackathonId) {
          this.currentHackathon = {
            ...this.currentHackathon,
            registered: true,
            hackathon_participants: [
              ...(this.currentHackathon.hackathon_participants || []),
              { user: this.rootStore.userStore.currentUser, user_id: this.rootStore.userStore.currentUser?.id },
            ],
          }
        }
      })
      return true
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to register for hackathon")
      })
      return false
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  fetchTeams = async (hackathonId?: string) => {
    this.setLoading(true)
    this.setError(null)
    const supabase = getBrowserClient()

    try {
      let query = supabase.from("hackathon_teams").select(`
          *,
          hackathon:hackathons!hackathon_id(name),
          team_members(*, user:users(*))
        `)

      if (hackathonId) {
        query = query.eq("hackathon_id", hackathonId)
      }

      const { data, error } = await query

      if (error) throw error

      // Process teams
      const processedTeams = data.map((team) => {
        const hasSubmission = !!team.submission_id
        const isComplete = team.team_members.length >= 5

        let status: "forming" | "complete" | "submitted" = "forming"
        if (hasSubmission) {
          status = "submitted"
        } else if (isComplete) {
          status = "complete"
        }

        return {
          ...team,
          status,
        }
      })

      runInAction(() => {
        this.setTeams(processedTeams)
      })
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to fetch teams")
      })
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  createTeam = async (teamData: { name: string; description?: string; hackathonId: string }) => {
    if (!this.rootStore.userStore.currentUser) return null

    this.setLoading(true)
    this.setError(null)
    const supabase = getBrowserClient()

    try {
      // Create the team
      const { data, error } = await supabase
        .from("hackathon_teams")
        .insert({
          name: teamData.name,
          description: teamData.description,
          hackathon_id: teamData.hackathonId,
          leader_id: this.rootStore.userStore.currentUser.id,
        })
        .select()
        .single()

      if (error) throw error

      // Add creator as a team member
      const { error: memberError } = await supabase.from("team_members").insert({
        team_id: data.id,
        user_id: this.rootStore.userStore.currentUser.id,
        role: "leader",
      })

      if (memberError) throw memberError

      const newTeam = {
        ...data,
        hackathon: { name: this.hackathons.find((h) => h.id === teamData.hackathonId)?.name || "Hackathon" },
        team_members: [
          {
            user: this.rootStore.userStore.currentUser,
            user_id: this.rootStore.userStore.currentUser.id,
            role: "leader",
          },
        ],
        status: "forming" as const,
      }

      runInAction(() => {
        this.teams = [...this.teams, newTeam]
        this.setCurrentTeam(newTeam)
      })

      return newTeam
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to create team")
      })
      return null
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }
}
