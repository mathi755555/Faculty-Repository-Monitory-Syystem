export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      awards: {
        Row: {
          certificate_url: string | null
          created_at: string | null
          date_awarded: string
          id: string
          issuing_body: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          certificate_url?: string | null
          created_at?: string | null
          date_awarded: string
          id?: string
          issuing_body: string
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          certificate_url?: string | null
          created_at?: string | null
          date_awarded?: string
          id?: string
          issuing_body?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      fdp_certifications: {
        Row: {
          certificate_url: string | null
          created_at: string | null
          duration_from: string
          duration_to: string
          id: string
          organizer: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          certificate_url?: string | null
          created_at?: string | null
          duration_from: string
          duration_to: string
          id?: string
          organizer: string
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          certificate_url?: string | null
          created_at?: string | null
          duration_from?: string
          duration_to?: string
          id?: string
          organizer?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      memberships: {
        Row: {
          certificate_url: string | null
          created_at: string | null
          expiry_date: string | null
          id: string
          membership_id: string
          professional_body_name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          certificate_url?: string | null
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          membership_id: string
          professional_body_name: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          certificate_url?: string | null
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          membership_id?: string
          professional_body_name?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      patents: {
        Row: {
          created_at: string | null
          document_url: string | null
          id: string
          status: Database["public"]["Enums"]["patent_status"]
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          document_url?: string | null
          id?: string
          status: Database["public"]["Enums"]["patent_status"]
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          document_url?: string | null
          id?: string
          status?: Database["public"]["Enums"]["patent_status"]
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          department: string | null
          designation: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          department?: string | null
          designation?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          department?: string | null
          designation?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string | null
          duration_from: string
          duration_to: string
          funded_amount: number
          funding_agency: string
          id: string
          sanction_letter_url: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          duration_from: string
          duration_to: string
          funded_amount: number
          funding_agency: string
          id?: string
          sanction_letter_url?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          duration_from?: string
          duration_to?: string
          funded_amount?: number
          funding_agency?: string
          id?: string
          sanction_letter_url?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      publications: {
        Row: {
          created_at: string | null
          doi: string | null
          id: string
          index_type: Database["public"]["Enums"]["index_type"]
          journal_conference_name: string
          paper_number: string | null
          paper_title: string
          publication_url: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          doi?: string | null
          id?: string
          index_type: Database["public"]["Enums"]["index_type"]
          journal_conference_name: string
          paper_number?: string | null
          paper_title: string
          publication_url?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          doi?: string | null
          id?: string
          index_type?: Database["public"]["Enums"]["index_type"]
          journal_conference_name?: string
          paper_number?: string | null
          paper_title?: string
          publication_url?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      student_projects: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          project_title: string
          project_type: Database["public"]["Enums"]["project_type"]
          students_involved: string[]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          project_title: string
          project_type: Database["public"]["Enums"]["project_type"]
          students_involved: string[]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          project_title?: string
          project_type?: Database["public"]["Enums"]["project_type"]
          students_involved?: string[]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      teaching_materials: {
        Row: {
          course_code: string
          course_name: string
          created_at: string | null
          description: string | null
          file_url: string | null
          id: string
          material_type: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          course_code: string
          course_name: string
          created_at?: string | null
          description?: string | null
          file_url?: string | null
          id?: string
          material_type: string
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          course_code?: string
          course_name?: string
          created_at?: string | null
          description?: string | null
          file_url?: string | null
          id?: string
          material_type?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      timetable: {
        Row: {
          course_code: string
          course_name: string
          created_at: string | null
          day_of_week: string
          end_time: string
          id: string
          room_number: string | null
          semester: string
          start_time: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          course_code: string
          course_name: string
          created_at?: string | null
          day_of_week: string
          end_time: string
          id?: string
          room_number?: string | null
          semester: string
          start_time: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          course_code?: string
          course_name?: string
          created_at?: string | null
          day_of_week?: string
          end_time?: string
          id?: string
          room_number?: string | null
          semester?: string
          start_time?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      workshops: {
        Row: {
          certificate_url: string | null
          created_at: string | null
          duration_from: string
          duration_to: string
          event_name: string
          id: string
          organizer: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          certificate_url?: string | null
          created_at?: string | null
          duration_from: string
          duration_to: string
          event_name: string
          id?: string
          organizer: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          certificate_url?: string | null
          created_at?: string | null
          duration_from?: string
          duration_to?: string
          event_name?: string
          id?: string
          organizer?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      index_type: "SCI" | "Scopus" | "Website Only"
      patent_status: "Filed" | "Granted"
      project_type: "External" | "In-house" | "Mini" | "Minor" | "Major"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      index_type: ["SCI", "Scopus", "Website Only"],
      patent_status: ["Filed", "Granted"],
      project_type: ["External", "In-house", "Mini", "Minor", "Major"],
    },
  },
} as const
