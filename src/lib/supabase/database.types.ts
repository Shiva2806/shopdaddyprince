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
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          phone: string | null
          role: string
          created_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          role?: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          role?: string
          updated_at?: string
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          slug: string
          name: string
          description: string | null
          price: number
          compare_at_price: number | null
          categories: string[]
          subcategory: string | null
          images: string[]
          stock: number
          status: string
          is_featured: boolean
          tags: string[] | null
          weight_grams: number | null
          dimensions: Json | null
          artist: string | null
          origin: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          description?: string | null
          price: number
          compare_at_price?: number | null
          categories?: string[]
          subcategory?: string | null
          images?: string[]
          stock?: number
          status?: string
          is_featured?: boolean
          tags?: string[] | null
          weight_grams?: number | null
          dimensions?: Json | null
          artist?: string | null
          origin?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          description?: string | null
          price?: number
          compare_at_price?: number | null
          categories?: string[]
          subcategory?: string | null
          images?: string[]
          stock?: number
          status?: string
          is_featured?: boolean
          tags?: string[] | null
          weight_grams?: number | null
          dimensions?: Json | null
          artist?: string | null
          origin?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          items: Json
          subtotal: number
          shipping: number
          total: number
          status: string
          shipping_address: Json
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          items: Json
          subtotal: number
          shipping?: number
          total: number
          status?: string
          shipping_address: Json
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          items?: Json
          subtotal?: number
          shipping?: number
          total?: number
          status?: string
          shipping_address?: Json
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
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
  }
}
