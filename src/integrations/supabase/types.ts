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
      loan_applications: {
        Row: {
          created_at: string | null
          down_payment: number
          id: string
          interest_rate: number
          loan_amount: number
          loan_term_years: number
          property_id: string | null
          property_value: number
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          down_payment: number
          id?: string
          interest_rate: number
          loan_amount: number
          loan_term_years: number
          property_id?: string | null
          property_value: number
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          down_payment?: number
          id?: string
          interest_rate?: number
          loan_amount?: number
          loan_term_years?: number
          property_id?: string | null
          property_value?: number
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      mortgage_rates: {
        Row: {
          bank: string
          created_at: string | null
          id: string
          max_loan_amount: number | null
          max_term: number | null
          min_loan_amount: number | null
          min_term: number | null
          processing_fee: number | null
          rate: number
          updated_at: string | null
        }
        Insert: {
          bank: string
          created_at?: string | null
          id?: string
          max_loan_amount?: number | null
          max_term?: number | null
          min_loan_amount?: number | null
          min_term?: number | null
          processing_fee?: number | null
          rate: number
          updated_at?: string | null
        }
        Update: {
          bank?: string
          created_at?: string | null
          id?: string
          max_loan_amount?: number | null
          max_term?: number | null
          min_loan_amount?: number | null
          min_term?: number | null
          processing_fee?: number | null
          rate?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      price_trends: {
        Row: {
          city: string
          created_at: string | null
          id: string
          month: string
          month_num: number
          region: string | null
          value: number
          year: string
        }
        Insert: {
          city: string
          created_at?: string | null
          id?: string
          month: string
          month_num: number
          region?: string | null
          value: number
          year: string
        }
        Update: {
          city?: string
          created_at?: string | null
          id?: string
          month?: string
          month_num?: number
          region?: string | null
          value?: number
          year?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          companyname: string | null
          created_at: string | null
          email: string | null
          id: string
          isseller: boolean | null
          name: string | null
          phone: string | null
          reraid: string | null
          updated_at: string | null
        }
        Insert: {
          companyname?: string | null
          created_at?: string | null
          email?: string | null
          id: string
          isseller?: boolean | null
          name?: string | null
          phone?: string | null
          reraid?: string | null
          updated_at?: string | null
        }
        Update: {
          companyname?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          isseller?: boolean | null
          name?: string | null
          phone?: string | null
          reraid?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      properties: {
        Row: {
          address: string
          bathrooms: number
          bedrooms: number
          created_at: string | null
          id: string
          images: string[] | null
          latitude: number | null
          longitude: number | null
          price: number
          sqft: number
          status: string
          title: string
          type: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          address: string
          bathrooms: number
          bedrooms: number
          created_at?: string | null
          id?: string
          images?: string[] | null
          latitude?: number | null
          longitude?: number | null
          price: number
          sqft: number
          status: string
          title: string
          type: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string
          bathrooms?: number
          bedrooms?: number
          created_at?: string | null
          id?: string
          images?: string[] | null
          latitude?: number | null
          longitude?: number | null
          price?: number
          sqft?: number
          status?: string
          title?: string
          type?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      property_inquiries: {
        Row: {
          created_at: string | null
          id: string
          message: string
          property_id: string
          seller_response: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          property_id: string
          seller_response?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          property_id?: string
          seller_response?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      property_listings: {
        Row: {
          city: string
          created_at: string | null
          id: string
          name: string
          rent: number
          sale: number
          year: string
        }
        Insert: {
          city: string
          created_at?: string | null
          id?: string
          name: string
          rent: number
          sale: number
          year: string
        }
        Update: {
          city?: string
          created_at?: string | null
          id?: string
          name?: string
          rent?: number
          sale?: number
          year?: string
        }
        Relationships: []
      }
      regional_prices: {
        Row: {
          city: string
          created_at: string | null
          id: string
          name: string
          price: number
          year: string
        }
        Insert: {
          city: string
          created_at?: string | null
          id?: string
          name: string
          price: number
          year: string
        }
        Update: {
          city?: string
          created_at?: string | null
          id?: string
          name?: string
          price?: number
          year?: string
        }
        Relationships: []
      }
      saved_searches: {
        Row: {
          created_at: string | null
          criteria: Json
          id: string
          location: string | null
          name: string
          notifications_enabled: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          criteria?: Json
          id?: string
          location?: string | null
          name: string
          notifications_enabled?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          criteria?: Json
          id?: string
          location?: string | null
          name?: string
          notifications_enabled?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_favorites: {
        Row: {
          created_at: string | null
          id: string
          property_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          property_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          property_id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          read: boolean | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          read?: boolean | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          read?: boolean | null
          title?: string
          type?: string
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
