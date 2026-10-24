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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      clients: {
        Row: {
          address: string | null
          avatar_bg: string | null
          city: string | null
          created_at: string | null
          email: string | null
          email_pec: string | null
          id: string
          name: string
          ninea: string | null
          phone: string | null
          rccm: string | null
          status: string | null
          updated_at: string | null
          user_id: string
          whatsapp: string | null
        }
        Insert: {
          address?: string | null
          avatar_bg?: string | null
          city?: string | null
          created_at?: string | null
          email?: string | null
          email_pec?: string | null
          id?: string
          name: string
          ninea?: string | null
          phone?: string | null
          rccm?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
          whatsapp?: string | null
        }
        Update: {
          address?: string | null
          avatar_bg?: string | null
          city?: string | null
          created_at?: string | null
          email?: string | null
          email_pec?: string | null
          id?: string
          name?: string
          ninea?: string | null
          phone?: string | null
          rccm?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      company_settings: {
        Row: {
          address: string | null
          bank_account_holder: string | null
          bank_enabled: boolean | null
          bank_iban: string | null
          bank_name: string | null
          bank_rib_key: string | null
          city: string | null
          company_logo: string | null
          company_name: string
          country: string | null
          created_at: string | null
          currency: string | null
          default_due_days: number | null
          default_language: string | null
          default_tax_rate: number | null
          email: string | null
          footer_legal_text: string | null
          id: string
          invoice_prefix: string | null
          late_fee_interest_rate: number | null
          legal_form: string | null
          next_invoice_sequence: number | null
          ninea: string | null
          om_enabled: boolean | null
          om_merchant_code: string | null
          om_number: string | null
          phone: string | null
          postal_code: string | null
          rate_eur: number | null
          rate_usd: number | null
          rccm: string | null
          show_exchange_rate_on_invoices: boolean | null
          signature_image_data: string | null
          signature_name: string | null
          signature_type: string | null
          tax_applicable: boolean | null
          trade_name: string | null
          updated_at: string | null
          user_id: string
          wave_account_name: string | null
          wave_enabled: boolean | null
          wave_number: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          bank_account_holder?: string | null
          bank_enabled?: boolean | null
          bank_iban?: string | null
          bank_name?: string | null
          bank_rib_key?: string | null
          city?: string | null
          company_logo?: string | null
          company_name?: string
          country?: string | null
          created_at?: string | null
          currency?: string | null
          default_due_days?: number | null
          default_language?: string | null
          default_tax_rate?: number | null
          email?: string | null
          footer_legal_text?: string | null
          id?: string
          invoice_prefix?: string | null
          late_fee_interest_rate?: number | null
          legal_form?: string | null
          next_invoice_sequence?: number | null
          ninea?: string | null
          om_enabled?: boolean | null
          om_merchant_code?: string | null
          om_number?: string | null
          phone?: string | null
          postal_code?: string | null
          rate_eur?: number | null
          rate_usd?: number | null
          rccm?: string | null
          show_exchange_rate_on_invoices?: boolean | null
          signature_image_data?: string | null
          signature_name?: string | null
          signature_type?: string | null
          tax_applicable?: boolean | null
          trade_name?: string | null
          updated_at?: string | null
          user_id: string
          wave_account_name?: string | null
          wave_enabled?: boolean | null
          wave_number?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          bank_account_holder?: string | null
          bank_enabled?: boolean | null
          bank_iban?: string | null
          bank_name?: string | null
          bank_rib_key?: string | null
          city?: string | null
          company_logo?: string | null
          company_name?: string
          country?: string | null
          created_at?: string | null
          currency?: string | null
          default_due_days?: number | null
          default_language?: string | null
          default_tax_rate?: number | null
          email?: string | null
          footer_legal_text?: string | null
          id?: string
          invoice_prefix?: string | null
          late_fee_interest_rate?: number | null
          legal_form?: string | null
          next_invoice_sequence?: number | null
          ninea?: string | null
          om_enabled?: boolean | null
          om_merchant_code?: string | null
          om_number?: string | null
          phone?: string | null
          postal_code?: string | null
          rate_eur?: number | null
          rate_usd?: number | null
          rccm?: string | null
          show_exchange_rate_on_invoices?: boolean | null
          signature_image_data?: string | null
          signature_name?: string | null
          signature_type?: string | null
          tax_applicable?: boolean | null
          trade_name?: string | null
          updated_at?: string | null
          user_id?: string
          wave_account_name?: string | null
          wave_enabled?: boolean | null
          wave_number?: string | null
          website?: string | null
        }
        Relationships: []
      }
      invoice_items: {
        Row: {
          amount: number
          created_at: string | null
          description: string
          id: string
          invoice_id: string
          quantity: number
          sort_order: number | null
          tax_rate: number
          unit_price: number
        }
        Insert: {
          amount?: number
          created_at?: string | null
          description: string
          id?: string
          invoice_id: string
          quantity?: number
          sort_order?: number | null
          tax_rate?: number
          unit_price?: number
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string
          id?: string
          invoice_id?: string
          quantity?: number
          sort_order?: number | null
          tax_rate?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount_ht: number
          amount_paid: number
          amount_ttc: number
          applied_rate: number | null
          balance_due: number
          client_address: string | null
          client_avatar_color: string | null
          client_city: string | null
          client_email: string | null
          client_id: string | null
          client_name: string
          client_ninea: string | null
          client_phone: string | null
          created_at: string | null
          currency: string | null
          discount_amount: number | null
          due_date: string
          id: string
          invoice_number: string
          issue_date: string
          language: string | null
          notes: string | null
          payment_method: string | null
          show_exchange_rate: boolean | null
          status: string
          tax_amount: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount_ht?: number
          amount_paid?: number
          amount_ttc?: number
          applied_rate?: number | null
          balance_due?: number
          client_address?: string | null
          client_avatar_color?: string | null
          client_city?: string | null
          client_email?: string | null
          client_id?: string | null
          client_name: string
          client_ninea?: string | null
          client_phone?: string | null
          created_at?: string | null
          currency?: string | null
          discount_amount?: number | null
          due_date: string
          id?: string
          invoice_number: string
          issue_date?: string
          language?: string | null
          notes?: string | null
          payment_method?: string | null
          show_exchange_rate?: boolean | null
          status?: string
          tax_amount?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount_ht?: number
          amount_paid?: number
          amount_ttc?: number
          applied_rate?: number | null
          balance_due?: number
          client_address?: string | null
          client_avatar_color?: string | null
          client_city?: string | null
          client_email?: string | null
          client_id?: string | null
          client_name?: string
          client_ninea?: string | null
          client_phone?: string | null
          created_at?: string | null
          currency?: string | null
          discount_amount?: number | null
          due_date?: string
          id?: string
          invoice_number?: string
          issue_date?: string
          language?: string | null
          notes?: string | null
          payment_method?: string | null
          show_exchange_rate?: boolean | null
          status?: string
          tax_amount?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          actor_bg: string | null
          actor_name: string | null
          amount: number | null
          category: string | null
          client_name: string | null
          created_at: string | null
          id: string
          invoice_id: string | null
          invoice_number: string | null
          message: string
          read: boolean | null
          title: string
          user_id: string
        }
        Insert: {
          actor_bg?: string | null
          actor_name?: string | null
          amount?: number | null
          category?: string | null
          client_name?: string | null
          created_at?: string | null
          id?: string
          invoice_id?: string | null
          invoice_number?: string | null
          message: string
          read?: boolean | null
          title: string
          user_id: string
        }
        Update: {
          actor_bg?: string | null
          actor_name?: string | null
          amount?: number | null
          category?: string | null
          client_name?: string | null
          created_at?: string | null
          id?: string
          invoice_id?: string | null
          invoice_number?: string | null
          message?: string
          read?: boolean | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          phone: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          phone?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: string | null
          updated_at?: string | null
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
