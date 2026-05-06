export type Role = 'platform_admin' | 'school_admin' | 'staff'
export type Department = 'Pedagógico' | 'Coordenação' | 'Secretaria' | 'Manutenção' | 'Eventos'
export type TaskPriority = 'critical' | 'high' | 'normal'
export type TaskStatus = 'open' | 'in_progress' | 'done' | 'overdue'

export type Database = {
  public: {
    Tables: {
      schools: {
        Row: {
          id: string
          name: string
          slug: string
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          created_by?: string | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['schools']['Insert']>
      }
      profiles: {
        Row: {
          id: string
          full_name: string
          role: Role
          department: Department | null
          avatar_color: string
          school_id: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id: string
          full_name: string
          role: Role
          department?: Department | null
          avatar_color?: string
          school_id?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      invitations: {
        Row: {
          id: string
          school_id: string
          role: Role
          department: Department | null
          label: string | null
          token: string
          invited_by: string | null
          expires_at: string
          accepted_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          school_id: string
          role: Role
          department?: Department | null
          label?: string | null
          token?: string
          invited_by?: string | null
          expires_at?: string
          accepted_at?: string | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['invitations']['Insert']>
      }
      tasks: {
        Row: {
          id: string
          school_id: string
          title: string
          area: Department
          priority: TaskPriority
          status: TaskStatus
          progress: number
          due_date: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          school_id: string
          title: string
          area: Department
          priority: TaskPriority
          status?: TaskStatus
          progress?: number
          due_date?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['tasks']['Insert']>
      }
      task_assignees: {
        Row: { task_id: string; user_id: string }
        Insert: { task_id: string; user_id: string }
        Update: never
      }
      events: {
        Row: {
          id: string
          school_id: string
          title: string
          starts_at: string
          area: Department | null
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          school_id: string
          title: string
          starts_at: string
          area?: Department | null
          created_by?: string | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['events']['Insert']>
      }
      event_attendees: {
        Row: { event_id: string; user_id: string }
        Insert: { event_id: string; user_id: string }
        Update: never
      }
    }
  }
}
