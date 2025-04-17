export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          bio: string | null
          location: string | null
          title: string | null
          created_at: string
          updated_at: string
          skills: string[] | null
          social: Json | null
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          location?: string | null
          title?: string | null
          created_at?: string
          updated_at?: string
          skills?: string[] | null
          social?: Json | null
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          location?: string | null
          title?: string | null
          created_at?: string
          updated_at?: string
          skills?: string[] | null
          social?: Json | null
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string
          location: string | null
          start_date: string
          end_date: string | null
          image_url: string | null
          organizer_id: string
          community_id: string | null
          created_at: string
          updated_at: string
          is_virtual: boolean
          max_attendees: number | null
          category: string | null
        }
        Insert: {
          id?: string
          title: string
          description: string
          location?: string | null
          start_date: string
          end_date?: string | null
          image_url?: string | null
          organizer_id: string
          community_id?: string | null
          created_at?: string
          updated_at?: string
          is_virtual?: boolean
          max_attendees?: number | null
          category?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string
          location?: string | null
          start_date?: string
          end_date?: string | null
          image_url?: string | null
          organizer_id?: string
          community_id?: string | null
          created_at?: string
          updated_at?: string
          is_virtual?: boolean
          max_attendees?: number | null
          category?: string | null
        }
      }
      event_attendees: {
        Row: {
          id: string
          event_id: string
          user_id: string
          created_at: string
          status: string
        }
        Insert: {
          id?: string
          event_id: string
          user_id: string
          created_at?: string
          status?: string
        }
        Update: {
          id?: string
          event_id?: string
          user_id?: string
          created_at?: string
          status?: string
        }
      }
      communities: {
        Row: {
          id: string
          name: string
          description: string
          image_url: string | null
          creator_id: string
          created_at: string
          updated_at: string
          category: string | null
          privacy: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          image_url?: string | null
          creator_id: string
          created_at?: string
          updated_at?: string
          category?: string | null
          privacy?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          image_url?: string | null
          creator_id?: string
          created_at?: string
          updated_at?: string
          category?: string | null
          privacy?: string
        }
      }
      community_members: {
        Row: {
          id: string
          community_id: string
          user_id: string
          role: string
          created_at: string
        }
        Insert: {
          id?: string
          community_id: string
          user_id: string
          role?: string
          created_at?: string
        }
        Update: {
          id?: string
          community_id?: string
          user_id?: string
          role?: string
          created_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          title: string
          content: string
          image_url: string | null
          author_id: string
          community_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          image_url?: string | null
          author_id: string
          community_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          image_url?: string | null
          author_id?: string
          community_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      post_likes: {
        Row: {
          id: string
          post_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          user_id?: string
          created_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          content: string
          post_id: string
          author_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          content: string
          post_id: string
          author_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          content?: string
          post_id?: string
          author_id?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
