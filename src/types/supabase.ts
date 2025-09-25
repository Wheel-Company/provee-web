export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      experts: {
        Row: {
          category: Database["public"]["Enums"]["service_category"][] | null
          completed_projects: number | null
          created_at: string
          description: string | null
          experience_years: number | null
          hourly_rate: number | null
          id: string
          is_available: boolean | null
          location: string
          portfolio_images: string[] | null
          price_max: number
          price_min: number
          rating: number | null
          response_time_hours: number | null
          review_count: number | null
          services: string[]
          updated_at: string
          verified: boolean | null
        }
        Insert: {
          category?: Database["public"]["Enums"]["service_category"][] | null
          completed_projects?: number | null
          created_at?: string
          description?: string | null
          experience_years?: number | null
          hourly_rate?: number | null
          id: string
          is_available?: boolean | null
          location: string
          portfolio_images?: string[] | null
          price_max?: number
          price_min?: number
          rating?: number | null
          response_time_hours?: number | null
          review_count?: number | null
          services?: string[]
          updated_at?: string
          verified?: boolean | null
        }
        Update: {
          category?: Database["public"]["Enums"]["service_category"][] | null
          completed_projects?: number | null
          created_at?: string
          description?: string | null
          experience_years?: number | null
          hourly_rate?: number | null
          id?: string
          is_available?: boolean | null
          location?: string
          portfolio_images?: string[] | null
          price_max?: number
          price_min?: number
          rating?: number | null
          response_time_hours?: number | null
          review_count?: number | null
          services?: string[]
          updated_at?: string
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "experts_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          created_at: string
          customer_id: string
          expert_id: string
          id: string
          location_score: number | null
          match_score: number
          price_score: number | null
          request_id: string
          service_score: number | null
          status: Database["public"]["Enums"]["match_status"] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          expert_id: string
          id?: string
          location_score?: number | null
          match_score: number
          price_score?: number | null
          request_id: string
          service_score?: number | null
          status?: Database["public"]["Enums"]["match_status"] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          expert_id?: string
          id?: string
          location_score?: number | null
          match_score?: number
          price_score?: number | null
          request_id?: string
          service_score?: number | null
          status?: Database["public"]["Enums"]["match_status"] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "matches_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_expert_id_fkey"
            columns: ["expert_id"]
            isOneToOne: false
            referencedRelation: "experts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "service_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          district: string | null
          email: string
          id: string
          name: string
          phone: string | null
          updated_at: string
          user_type: Database["public"]["Enums"]["user_type"]
          username: string | null
        }
        Insert: {
          created_at?: string
          district?: string | null
          email: string
          id?: string
          name: string
          phone?: string | null
          updated_at?: string
          user_type: Database["public"]["Enums"]["user_type"]
          username?: string | null
        }
        Update: {
          created_at?: string
          district?: string | null
          email?: string
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string
          user_type?: Database["public"]["Enums"]["user_type"]
          username?: string | null
        }
        Relationships: []
      }
      service_requests: {
        Row: {
          budget_max: number
          budget_min: number
          category: Database["public"]["Enums"]["service_category"]
          created_at: string
          customer_id: string
          description: string
          id: string
          location: string
          status: Database["public"]["Enums"]["request_status"] | null
          title: string
          updated_at: string
        }
        Insert: {
          budget_max: number
          budget_min: number
          category?: Database["public"]["Enums"]["service_category"]
          created_at?: string
          customer_id: string
          description: string
          id?: string
          location: string
          status?: Database["public"]["Enums"]["request_status"] | null
          title: string
          updated_at?: string
        }
        Update: {
          budget_max?: number
          budget_min?: number
          category?: Database["public"]["Enums"]["service_category"]
          created_at?: string
          customer_id?: string
          description?: string
          id?: string
          location?: string
          status?: Database["public"]["Enums"]["request_status"] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_requests_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_match_score: {
        Args: {
          expert_category: Database["public"]["Enums"]["service_category"][]
          expert_location: string
          expert_price_max: number
          expert_price_min: number
          request_budget_max: number
          request_budget_min: number
          request_category: Database["public"]["Enums"]["service_category"]
          request_location: string
        }
        Returns: number
      }
      create_matches_for_request: {
        Args: { request_id: string }
        Returns: undefined
      }
    }
    Enums: {
      match_status: "pending" | "accepted" | "declined" | "completed"
      request_status: "pending" | "matched" | "completed" | "cancelled"
      service_category: "청소" | "수리" | "과외" | "디자인"
      user_type: "customer" | "expert"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      match_status: ["pending", "accepted", "declined", "completed"],
      request_status: ["pending", "matched", "completed", "cancelled"],
      service_category: ["청소", "수리", "과외", "디자인"],
      user_type: ["customer", "expert"],
    },
  },
} as const
