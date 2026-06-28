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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      chat_messages: {
        Row: {
          created_at: string
          id: string
          message_content: string
          order_id: string
          sender: string
        }
        Insert: {
          created_at?: string
          id?: string
          message_content: string
          order_id: string
          sender: string
        }
        Update: {
          created_at?: string
          id?: string
          message_content?: string
          order_id?: string
          sender?: string
        }
        Relationships: []
      }
      checks: {
        Row: {
          created_at: string
          id: string
          order_id: string
          status: string
          subtotal_cents: number
          tab_id: string | null
          tax_cents: number
          tenant_id: string
          tip_cents: number
          total_cents: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          status?: string
          subtotal_cents?: number
          tab_id?: string | null
          tax_cents?: number
          tenant_id: string
          tip_cents?: number
          total_cents?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          status?: string
          subtotal_cents?: number
          tab_id?: string | null
          tax_cents?: number
          tenant_id?: string
          tip_cents?: number
          total_cents?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "checks_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "checks_tab_id_fkey"
            columns: ["tab_id"]
            isOneToOne: false
            referencedRelation: "tabs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "checks_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      courier_status: {
        Row: {
          courier_id: string
          current_delivery_id: string | null
          id: string
          is_available: boolean
          last_location_update: string | null
          latitude: number | null
          location_id: string
          longitude: number | null
          tenant_id: string
          updated_at: string
        }
        Insert: {
          courier_id: string
          current_delivery_id?: string | null
          id?: string
          is_available?: boolean
          last_location_update?: string | null
          latitude?: number | null
          location_id: string
          longitude?: number | null
          tenant_id: string
          updated_at?: string
        }
        Update: {
          courier_id?: string
          current_delivery_id?: string | null
          id?: string
          is_available?: boolean
          last_location_update?: string | null
          latitude?: number | null
          location_id?: string
          longitude?: number | null
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "courier_status_current_delivery_id_fkey"
            columns: ["current_delivery_id"]
            isOneToOne: false
            referencedRelation: "delivery_assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "courier_status_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "courier_status_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_assignments: {
        Row: {
          assigned_at: string
          created_at: string
          delivered_at: string | null
          dropoff_point: string | null
          estimated_delivery_minutes: number | null
          id: string
          notes: string | null
          order_id: string
          picked_up_at: string | null
          pickup_point: string | null
          runner_id: string
          status: Database["public"]["Enums"]["delivery_status"]
          tenant_id: string
          updated_at: string
        }
        Insert: {
          assigned_at?: string
          created_at?: string
          delivered_at?: string | null
          dropoff_point?: string | null
          estimated_delivery_minutes?: number | null
          id?: string
          notes?: string | null
          order_id: string
          picked_up_at?: string | null
          pickup_point?: string | null
          runner_id: string
          status?: Database["public"]["Enums"]["delivery_status"]
          tenant_id: string
          updated_at?: string
        }
        Update: {
          assigned_at?: string
          created_at?: string
          delivered_at?: string | null
          dropoff_point?: string | null
          estimated_delivery_minutes?: number | null
          id?: string
          notes?: string | null
          order_id?: string
          picked_up_at?: string | null
          pickup_point?: string | null
          runner_id?: string
          status?: Database["public"]["Enums"]["delivery_status"]
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "delivery_assignments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delivery_assignments_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_routes: {
        Row: {
          created_at: string
          delivery_id: string
          estimated_distance_meters: number | null
          estimated_duration_seconds: number | null
          id: string
          waypoints: Json
        }
        Insert: {
          created_at?: string
          delivery_id: string
          estimated_distance_meters?: number | null
          estimated_duration_seconds?: number | null
          id?: string
          waypoints?: Json
        }
        Update: {
          created_at?: string
          delivery_id?: string
          estimated_distance_meters?: number | null
          estimated_duration_seconds?: number | null
          id?: string
          waypoints?: Json
        }
        Relationships: [
          {
            foreignKeyName: "delivery_routes_delivery_id_fkey"
            columns: ["delivery_id"]
            isOneToOne: true
            referencedRelation: "delivery_assignments"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_stations: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          location: Json
          metadata: Json
          name: string
          operating_hours: Json
          resort_id: string
          serves_areas: string[]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          location: Json
          metadata?: Json
          name: string
          operating_hours?: Json
          resort_id: string
          serves_areas?: string[]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          location?: Json
          metadata?: Json
          name?: string
          operating_hours?: Json
          resort_id?: string
          serves_areas?: string[]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "delivery_stations_resort_id_fkey"
            columns: ["resort_id"]
            isOneToOne: false
            referencedRelation: "resorts"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_zones: {
        Row: {
          avg_delivery_minutes: number | null
          color: string | null
          created_at: string
          id: string
          is_active: boolean
          location_id: string
          name: string
          polygon: unknown
          tenant_id: string
          updated_at: string
        }
        Insert: {
          avg_delivery_minutes?: number | null
          color?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          location_id: string
          name: string
          polygon?: unknown
          tenant_id: string
          updated_at?: string
        }
        Update: {
          avg_delivery_minutes?: number | null
          color?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          location_id?: string
          name?: string
          polygon?: unknown
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "delivery_zones_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delivery_zones_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      dispatch_decisions: {
        Row: {
          chosen_courier_id: string | null
          decided_at: string
          eligible_count: number | null
          eligible_summary: Json | null
          error_message: string | null
          id: string
          mode: string
          order_id: string
          outcome: string
          tenant_id: string
        }
        Insert: {
          chosen_courier_id?: string | null
          decided_at?: string
          eligible_count?: number | null
          eligible_summary?: Json | null
          error_message?: string | null
          id?: string
          mode: string
          order_id: string
          outcome: string
          tenant_id: string
        }
        Update: {
          chosen_courier_id?: string | null
          decided_at?: string
          eligible_count?: number | null
          eligible_summary?: Json | null
          error_message?: string | null
          id?: string
          mode?: string
          order_id?: string
          outcome?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dispatch_decisions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dispatch_decisions_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      dispatch_queue: {
        Row: {
          enqueued_at: string
          order_id: string
          scheduled_for: string
          tenant_id: string
        }
        Insert: {
          enqueued_at?: string
          order_id: string
          scheduled_for: string
          tenant_id: string
        }
        Update: {
          enqueued_at?: string
          order_id?: string
          scheduled_for?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dispatch_queue_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: true
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dispatch_queue_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          assigned_resorts: string[] | null
          assigned_stores: string[] | null
          avatar: string | null
          created_at: string | null
          email: string
          id: string
          name: string
          resort_id: string | null
          role: string
          status: string
          store: string | null
          tenant_id: string | null
          updated_at: string | null
        }
        Insert: {
          assigned_resorts?: string[] | null
          assigned_stores?: string[] | null
          avatar?: string | null
          created_at?: string | null
          email: string
          id?: string
          name: string
          resort_id?: string | null
          role?: string
          status?: string
          store?: string | null
          tenant_id?: string | null
          updated_at?: string | null
        }
        Update: {
          assigned_resorts?: string[] | null
          assigned_stores?: string[] | null
          avatar?: string | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          resort_id?: string | null
          role?: string
          status?: string
          store?: string | null
          tenant_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employees_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      guest_locations: {
        Row: {
          accuracy_m: number | null
          expires_at: string
          heading_deg: number | null
          latitude: number
          longitude: number
          order_id: string
          speed_mps: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          accuracy_m?: number | null
          expires_at?: string
          heading_deg?: number | null
          latitude: number
          longitude: number
          order_id: string
          speed_mps?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          accuracy_m?: number | null
          expires_at?: string
          heading_deg?: number | null
          latitude?: number
          longitude?: number
          order_id?: string
          speed_mps?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "guest_locations_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: true
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      guest_seat_locations: {
        Row: {
          chair_number: string | null
          coordinates: unknown
          created_at: string
          description: string | null
          guest_id: string | null
          id: string
          location_type: Database["public"]["Enums"]["guest_location_type"]
          order_id: string | null
          room_number: string | null
          table_number: string | null
          tenant_id: string
          updated_at: string
          zone: string | null
        }
        Insert: {
          chair_number?: string | null
          coordinates?: unknown
          created_at?: string
          description?: string | null
          guest_id?: string | null
          id?: string
          location_type?: Database["public"]["Enums"]["guest_location_type"]
          order_id?: string | null
          room_number?: string | null
          table_number?: string | null
          tenant_id: string
          updated_at?: string
          zone?: string | null
        }
        Update: {
          chair_number?: string | null
          coordinates?: unknown
          created_at?: string
          description?: string | null
          guest_id?: string | null
          id?: string
          location_type?: Database["public"]["Enums"]["guest_location_type"]
          order_id?: string | null
          room_number?: string | null
          table_number?: string | null
          tenant_id?: string
          updated_at?: string
          zone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_guest_locations_order"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guest_locations_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "guests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guest_locations_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      guests: {
        Row: {
          created_at: string
          email: string | null
          first_visit: string
          id: string
          last_visit: string
          loyalty_id: string | null
          name: string | null
          phone: string | null
          preferences: Json
          room_number: string | null
          tenant_id: string
          total_orders: number
          total_spent_cents: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          first_visit?: string
          id?: string
          last_visit?: string
          loyalty_id?: string | null
          name?: string | null
          phone?: string | null
          preferences?: Json
          room_number?: string | null
          tenant_id: string
          total_orders?: number
          total_spent_cents?: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          first_visit?: string
          id?: string
          last_visit?: string
          loyalty_id?: string | null
          name?: string | null
          phone?: string | null
          preferences?: Json
          room_number?: string | null
          tenant_id?: string
          total_orders?: number
          total_spent_cents?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "guests_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      image_generation_jobs: {
        Row: {
          completed_at: string | null
          completed_items: number
          created_at: string
          error_message: string | null
          failed_items: Json
          id: string
          started_at: string | null
          status: string
          successful_urls: Json
          tenant_id: string | null
          total_items: number
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          completed_items?: number
          created_at?: string
          error_message?: string | null
          failed_items?: Json
          id?: string
          started_at?: string | null
          status?: string
          successful_urls?: Json
          tenant_id?: string | null
          total_items: number
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          completed_items?: number
          created_at?: string
          error_message?: string | null
          failed_items?: Json
          id?: string
          started_at?: string | null
          status?: string
          successful_urls?: Json
          tenant_id?: string | null
          total_items?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "image_generation_jobs_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          address: string | null
          coordinates: unknown
          created_at: string
          email: string | null
          id: string
          is_active: boolean
          name: string
          operating_hours: Json
          phone: string | null
          slug: string
          tenant_id: string
          timezone: string
          type: Database["public"]["Enums"]["location_type"]
          updated_at: string
        }
        Insert: {
          address?: string | null
          coordinates?: unknown
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean
          name: string
          operating_hours?: Json
          phone?: string | null
          slug: string
          tenant_id: string
          timezone?: string
          type?: Database["public"]["Enums"]["location_type"]
          updated_at?: string
        }
        Update: {
          address?: string | null
          coordinates?: unknown
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean
          name?: string
          operating_hours?: Json
          phone?: string | null
          slug?: string
          tenant_id?: string
          timezone?: string
          type?: Database["public"]["Enums"]["location_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "locations_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean
          location_id: string | null
          name: string
          pos_external_id: string | null
          sort_order: number
          tenant_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          location_id?: string | null
          name: string
          pos_external_id?: string | null
          sort_order?: number
          tenant_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          location_id?: string | null
          name?: string
          pos_external_id?: string | null
          sort_order?: number
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "menu_categories_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "menu_categories_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_item_modifier_groups: {
        Row: {
          created_at: string
          id: string
          menu_item_id: string
          modifier_group_id: string
          sort_order: number
          tenant_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          menu_item_id: string
          modifier_group_id: string
          sort_order?: number
          tenant_id: string
        }
        Update: {
          created_at?: string
          id?: string
          menu_item_id?: string
          modifier_group_id?: string
          sort_order?: number
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "menu_item_modifier_groups_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "menu_item_modifier_groups_modifier_group_id_fkey"
            columns: ["modifier_group_id"]
            isOneToOne: false
            referencedRelation: "modifier_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "menu_item_modifier_groups_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_items: {
        Row: {
          allergens: string[]
          calories: number | null
          category_id: string | null
          created_at: string
          description: string | null
          dietary_tags: string[]
          id: string
          image_url: string | null
          is_active: boolean
          is_available: boolean
          is_featured: boolean | null
          kitchen_station: string | null
          name: string
          omnivore_item_id: string | null
          pos_external_id: string | null
          pos_item_id: string | null
          pos_price_level_id: string | null
          prep_time_minutes: number | null
          price_cents: number
          sort_order: number
          tenant_id: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          allergens?: string[]
          calories?: number | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          dietary_tags?: string[]
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_available?: boolean
          is_featured?: boolean | null
          kitchen_station?: string | null
          name: string
          omnivore_item_id?: string | null
          pos_external_id?: string | null
          pos_item_id?: string | null
          pos_price_level_id?: string | null
          prep_time_minutes?: number | null
          price_cents: number
          sort_order?: number
          tenant_id: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          allergens?: string[]
          calories?: number | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          dietary_tags?: string[]
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_available?: boolean
          is_featured?: boolean | null
          kitchen_station?: string | null
          name?: string
          omnivore_item_id?: string | null
          pos_external_id?: string | null
          pos_item_id?: string | null
          pos_price_level_id?: string | null
          prep_time_minutes?: number | null
          price_cents?: number
          sort_order?: number
          tenant_id?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "menu_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "menu_items_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      modifier_groups: {
        Row: {
          created_at: string
          id: string
          is_required: boolean
          max_selections: number
          min_selections: number
          name: string
          pos_external_id: string | null
          tenant_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_required?: boolean
          max_selections?: number
          min_selections?: number
          name: string
          pos_external_id?: string | null
          tenant_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_required?: boolean
          max_selections?: number
          min_selections?: number
          name?: string
          pos_external_id?: string | null
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "modifier_groups_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      modifiers: {
        Row: {
          created_at: string
          group_id: string
          id: string
          is_available: boolean
          is_default: boolean
          name: string
          pos_external_id: string | null
          pos_modifier_id: string | null
          price_cents: number
          sort_order: number
          tenant_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          group_id: string
          id?: string
          is_available?: boolean
          is_default?: boolean
          name: string
          pos_external_id?: string | null
          pos_modifier_id?: string | null
          price_cents?: number
          sort_order?: number
          tenant_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          group_id?: string
          id?: string
          is_available?: boolean
          is_default?: boolean
          name?: string
          pos_external_id?: string | null
          pos_modifier_id?: string | null
          price_cents?: number
          sort_order?: number
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "modifiers_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "modifier_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "modifiers_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_checklists: {
        Row: {
          client_id: string
          created_at: string
          id: string
          items: Json
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          id?: string
          items?: Json
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          id?: string
          items?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_checklists_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: true
            referencedRelation: "onboarding_clients"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_clients: {
        Row: {
          assigned_to: string | null
          company_name: string
          contact_email: string
          contact_name: string
          contact_phone: string | null
          created_at: string
          estimated_locations: number | null
          id: string
          notes: string | null
          pos_system: string | null
          property_type: Database["public"]["Enums"]["property_type"]
          stage: Database["public"]["Enums"]["onboarding_stage"]
          tenant_id: string | null
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          company_name: string
          contact_email: string
          contact_name: string
          contact_phone?: string | null
          created_at?: string
          estimated_locations?: number | null
          id?: string
          notes?: string | null
          pos_system?: string | null
          property_type?: Database["public"]["Enums"]["property_type"]
          stage?: Database["public"]["Enums"]["onboarding_stage"]
          tenant_id?: string | null
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          company_name?: string
          contact_email?: string
          contact_name?: string
          contact_phone?: string | null
          created_at?: string
          estimated_locations?: number | null
          id?: string
          notes?: string | null
          pos_system?: string | null
          property_type?: Database["public"]["Enums"]["property_type"]
          stage?: Database["public"]["Enums"]["onboarding_stage"]
          tenant_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_clients_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_documents: {
        Row: {
          client_id: string
          created_at: string
          file_url: string
          id: string
          name: string
          type: Database["public"]["Enums"]["document_type"]
          uploaded_by: string | null
        }
        Insert: {
          client_id: string
          created_at?: string
          file_url: string
          id?: string
          name: string
          type?: Database["public"]["Enums"]["document_type"]
          uploaded_by?: string | null
        }
        Update: {
          client_id?: string
          created_at?: string
          file_url?: string
          id?: string
          name?: string
          type?: Database["public"]["Enums"]["document_type"]
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_documents_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "onboarding_clients"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          menu_item_id: string | null
          modifiers: Json
          name: string
          order_id: string
          quantity: number
          special_instructions: string | null
          status: Database["public"]["Enums"]["order_item_status"]
          subtotal_cents: number
          unit_price_cents: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          menu_item_id?: string | null
          modifiers?: Json
          name: string
          order_id: string
          quantity?: number
          special_instructions?: string | null
          status?: Database["public"]["Enums"]["order_item_status"]
          subtotal_cents?: number
          unit_price_cents: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          menu_item_id?: string | null
          modifiers?: Json
          name?: string
          order_id?: string
          quantity?: number
          special_instructions?: string | null
          status?: Database["public"]["Enums"]["order_item_status"]
          subtotal_cents?: number
          unit_price_cents?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_items_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_status_history: {
        Row: {
          changed_at: string
          changed_by: string | null
          id: string
          metadata: Json | null
          order_id: string
          status: Database["public"]["Enums"]["order_status"]
        }
        Insert: {
          changed_at?: string
          changed_by?: string | null
          id?: string
          metadata?: Json | null
          order_id: string
          status: Database["public"]["Enums"]["order_status"]
        }
        Update: {
          changed_at?: string
          changed_by?: string | null
          id?: string
          metadata?: Json | null
          order_id?: string
          status?: Database["public"]["Enums"]["order_status"]
        }
        Relationships: [
          {
            foreignKeyName: "order_status_history_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          cancellation_reason: string | null
          cancelled_at: string | null
          completed_at: string | null
          courier_user_id: string | null
          created_at: string
          customer_email: string | null
          customer_name: string | null
          customer_phone: string | null
          delivery_location: string | null
          discount: number | null
          estimated_ready_at: string | null
          guest_id: string | null
          guest_location: Json | null
          guest_session_id: string | null
          id: string
          idempotency_key: string | null
          items: Json | null
          location_id: string | null
          omnivore_ticket_id: string | null
          order_number: string
          order_type: Database["public"]["Enums"]["order_type"]
          payment_method: string | null
          payment_status: string | null
          pickup_location: string | null
          platform_fee_bps: number
          platform_fee_cents: number
          platform_fee_status: string
          pos_ticket_id: string | null
          restaurant_id: string | null
          room_number: string | null
          share_live_location: boolean
          sms_consent: boolean
          sms_consent_at: string | null
          source: string | null
          special_instructions: string | null
          status: Database["public"]["Enums"]["order_status"]
          store_id: number | null
          stripe_payment_intent_id: string | null
          subtotal: number | null
          subtotal_cents: number
          tab_id: string | null
          tax: number | null
          tax_cents: number
          tenant_id: string
          tip: number | null
          tip_cents: number
          total: number | null
          total_cents: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          cancellation_reason?: string | null
          cancelled_at?: string | null
          completed_at?: string | null
          courier_user_id?: string | null
          created_at?: string
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          delivery_location?: string | null
          discount?: number | null
          estimated_ready_at?: string | null
          guest_id?: string | null
          guest_location?: Json | null
          guest_session_id?: string | null
          id?: string
          idempotency_key?: string | null
          items?: Json | null
          location_id?: string | null
          omnivore_ticket_id?: string | null
          order_number: string
          order_type: Database["public"]["Enums"]["order_type"]
          payment_method?: string | null
          payment_status?: string | null
          pickup_location?: string | null
          platform_fee_bps?: number
          platform_fee_cents?: number
          platform_fee_status?: string
          pos_ticket_id?: string | null
          restaurant_id?: string | null
          room_number?: string | null
          share_live_location?: boolean
          sms_consent?: boolean
          sms_consent_at?: string | null
          source?: string | null
          special_instructions?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          store_id?: number | null
          stripe_payment_intent_id?: string | null
          subtotal?: number | null
          subtotal_cents?: number
          tab_id?: string | null
          tax?: number | null
          tax_cents?: number
          tenant_id: string
          tip?: number | null
          tip_cents?: number
          total?: number | null
          total_cents?: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          cancellation_reason?: string | null
          cancelled_at?: string | null
          completed_at?: string | null
          courier_user_id?: string | null
          created_at?: string
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          delivery_location?: string | null
          discount?: number | null
          estimated_ready_at?: string | null
          guest_id?: string | null
          guest_location?: Json | null
          guest_session_id?: string | null
          id?: string
          idempotency_key?: string | null
          items?: Json | null
          location_id?: string | null
          omnivore_ticket_id?: string | null
          order_number?: string
          order_type?: Database["public"]["Enums"]["order_type"]
          payment_method?: string | null
          payment_status?: string | null
          pickup_location?: string | null
          platform_fee_bps?: number
          platform_fee_cents?: number
          platform_fee_status?: string
          pos_ticket_id?: string | null
          restaurant_id?: string | null
          room_number?: string | null
          share_live_location?: boolean
          sms_consent?: boolean
          sms_consent_at?: string | null
          source?: string | null
          special_instructions?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          store_id?: number | null
          stripe_payment_intent_id?: string | null
          subtotal?: number | null
          subtotal_cents?: number
          tab_id?: string | null
          tax?: number | null
          tax_cents?: number
          tenant_id?: string
          tip?: number | null
          tip_cents?: number
          total?: number | null
          total_cents?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_orders_tab"
            columns: ["tab_id"]
            isOneToOne: false
            referencedRelation: "tabs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "guests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount_cents: number
          application_fee_cents: number | null
          check_id: string | null
          connected_account_id: string | null
          created_at: string
          id: string
          metadata: Json
          method: Database["public"]["Enums"]["payment_method"]
          order_id: string
          pos_payment_id: string | null
          pos_tender_type: string | null
          refund_amount_cents: number | null
          refund_id: string | null
          status: Database["public"]["Enums"]["payment_status"]
          stripe_payment_id: string | null
          stripe_payment_intent_id: string | null
          stripe_transfer_id: string | null
          tenant_id: string
          tip_cents: number
          updated_at: string
        }
        Insert: {
          amount_cents: number
          application_fee_cents?: number | null
          check_id?: string | null
          connected_account_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json
          method: Database["public"]["Enums"]["payment_method"]
          order_id: string
          pos_payment_id?: string | null
          pos_tender_type?: string | null
          refund_amount_cents?: number | null
          refund_id?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          stripe_payment_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_transfer_id?: string | null
          tenant_id: string
          tip_cents?: number
          updated_at?: string
        }
        Update: {
          amount_cents?: number
          application_fee_cents?: number | null
          check_id?: string | null
          connected_account_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json
          method?: Database["public"]["Enums"]["payment_method"]
          order_id?: string
          pos_payment_id?: string | null
          pos_tender_type?: string | null
          refund_amount_cents?: number | null
          refund_id?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          stripe_payment_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_transfer_id?: string | null
          tenant_id?: string
          tip_cents?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_check_id_fkey"
            columns: ["check_id"]
            isOneToOne: false
            referencedRelation: "checks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      pin_attempts: {
        Row: {
          attempted_at: string
          id: string
          ip: string
          succeeded: boolean
          tenant_id: string
        }
        Insert: {
          attempted_at?: string
          id?: string
          ip: string
          succeeded?: boolean
          tenant_id: string
        }
        Update: {
          attempted_at?: string
          id?: string
          ip?: string
          succeeded?: boolean
          tenant_id?: string
        }
        Relationships: []
      }
      pos_configs: {
        Row: {
          account_id: string | null
          api_key: string | null
          created_at: string | null
          env: string
          id: string
          location_id: string | null
          ordering_api_base: string | null
          provider: string
          store_slug: string
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          account_id?: string | null
          api_key?: string | null
          created_at?: string | null
          env?: string
          id?: string
          location_id?: string | null
          ordering_api_base?: string | null
          provider?: string
          store_slug: string
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          account_id?: string | null
          api_key?: string | null
          created_at?: string | null
          env?: string
          id?: string
          location_id?: string | null
          ordering_api_base?: string | null
          provider?: string
          store_slug?: string
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pos_configs_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_configurations: {
        Row: {
          api_key_encrypted: string | null
          application_id: string | null
          created_at: string
          environment: Database["public"]["Enums"]["pos_environment"]
          id: string
          last_error_message: string | null
          last_menu_sync: string | null
          location_id: string | null
          merchant_id: string | null
          oauth_credentials: Json | null
          omnivore_employee_id: string | null
          omnivore_location_id: string | null
          omnivore_order_type_id: string | null
          omnivore_revenue_center_id: string | null
          omnivore_tender_type_id: string | null
          provider: Database["public"]["Enums"]["pos_provider"]
          settings: Json
          status: Database["public"]["Enums"]["pos_config_status"]
          tenant_id: string
          toast_restaurant_guid: string | null
          updated_at: string
        }
        Insert: {
          api_key_encrypted?: string | null
          application_id?: string | null
          created_at?: string
          environment?: Database["public"]["Enums"]["pos_environment"]
          id?: string
          last_error_message?: string | null
          last_menu_sync?: string | null
          location_id?: string | null
          merchant_id?: string | null
          oauth_credentials?: Json | null
          omnivore_employee_id?: string | null
          omnivore_location_id?: string | null
          omnivore_order_type_id?: string | null
          omnivore_revenue_center_id?: string | null
          omnivore_tender_type_id?: string | null
          provider: Database["public"]["Enums"]["pos_provider"]
          settings?: Json
          status?: Database["public"]["Enums"]["pos_config_status"]
          tenant_id: string
          toast_restaurant_guid?: string | null
          updated_at?: string
        }
        Update: {
          api_key_encrypted?: string | null
          application_id?: string | null
          created_at?: string
          environment?: Database["public"]["Enums"]["pos_environment"]
          id?: string
          last_error_message?: string | null
          last_menu_sync?: string | null
          location_id?: string | null
          merchant_id?: string | null
          oauth_credentials?: Json | null
          omnivore_employee_id?: string | null
          omnivore_location_id?: string | null
          omnivore_order_type_id?: string | null
          omnivore_revenue_center_id?: string | null
          omnivore_tender_type_id?: string | null
          provider?: Database["public"]["Enums"]["pos_provider"]
          settings?: Json
          status?: Database["public"]["Enums"]["pos_config_status"]
          tenant_id?: string
          toast_restaurant_guid?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pos_configurations_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_configurations_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_location_map: {
        Row: {
          created_at: string
          daze_location_id: string
          id: string
          is_default: boolean
          metadata: Json
          pos_config_id: string
          provider_location_id: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          daze_location_id: string
          id?: string
          is_default?: boolean
          metadata?: Json
          pos_config_id: string
          provider_location_id: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          daze_location_id?: string
          id?: string
          is_default?: boolean
          metadata?: Json
          pos_config_id?: string
          provider_location_id?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pos_location_map_daze_location_id_fkey"
            columns: ["daze_location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_location_map_pos_config_id_fkey"
            columns: ["pos_config_id"]
            isOneToOne: false
            referencedRelation: "pos_configurations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_location_map_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_order_map: {
        Row: {
          created_at: string
          daze_order_id: string
          error_message: string | null
          id: string
          pos_order_id: string
          pos_provider: Database["public"]["Enums"]["pos_provider"]
          status: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          daze_order_id: string
          error_message?: string | null
          id?: string
          pos_order_id: string
          pos_provider: Database["public"]["Enums"]["pos_provider"]
          status?: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          daze_order_id?: string
          error_message?: string | null
          id?: string
          pos_order_id?: string
          pos_provider?: Database["public"]["Enums"]["pos_provider"]
          status?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pos_order_map_daze_order_id_fkey"
            columns: ["daze_order_id"]
            isOneToOne: true
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_order_map_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_sync_logs: {
        Row: {
          completed_at: string | null
          created_at: string
          direction: Database["public"]["Enums"]["pos_sync_direction"]
          error_message: string | null
          id: string
          items_synced: number | null
          pos_config_id: string
          request_payload: Json | null
          response_payload: Json | null
          started_at: string
          status: Database["public"]["Enums"]["pos_sync_status"]
          sync_type: Database["public"]["Enums"]["pos_sync_type"]
          tenant_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          direction?: Database["public"]["Enums"]["pos_sync_direction"]
          error_message?: string | null
          id?: string
          items_synced?: number | null
          pos_config_id: string
          request_payload?: Json | null
          response_payload?: Json | null
          started_at?: string
          status?: Database["public"]["Enums"]["pos_sync_status"]
          sync_type: Database["public"]["Enums"]["pos_sync_type"]
          tenant_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          direction?: Database["public"]["Enums"]["pos_sync_direction"]
          error_message?: string | null
          id?: string
          items_synced?: number | null
          pos_config_id?: string
          request_payload?: Json | null
          response_payload?: Json | null
          started_at?: string
          status?: Database["public"]["Enums"]["pos_sync_status"]
          sync_type?: Database["public"]["Enums"]["pos_sync_type"]
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pos_sync_logs_pos_config_id_fkey"
            columns: ["pos_config_id"]
            isOneToOne: false
            referencedRelation: "pos_configurations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_sync_logs_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      print_agents: {
        Row: {
          created_at: string
          description: string | null
          device_hostname: string | null
          enabled: boolean
          heartbeat_interval_seconds: number
          id: string
          last_error: string | null
          last_seen_at: string | null
          local_ip: string | null
          metadata: Json
          name: string
          network_name: string | null
          status: string
          tenant_id: string
          token_hash: string | null
          token_last_rotated_at: string | null
          updated_at: string
          version: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          device_hostname?: string | null
          enabled?: boolean
          heartbeat_interval_seconds?: number
          id?: string
          last_error?: string | null
          last_seen_at?: string | null
          local_ip?: string | null
          metadata?: Json
          name: string
          network_name?: string | null
          status?: string
          tenant_id: string
          token_hash?: string | null
          token_last_rotated_at?: string | null
          updated_at?: string
          version?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          device_hostname?: string | null
          enabled?: boolean
          heartbeat_interval_seconds?: number
          id?: string
          last_error?: string | null
          last_seen_at?: string | null
          local_ip?: string | null
          metadata?: Json
          name?: string
          network_name?: string | null
          status?: string
          tenant_id?: string
          token_hash?: string | null
          token_last_rotated_at?: string | null
          updated_at?: string
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "print_agents_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      print_jobs: {
        Row: {
          attempts: number
          canceled_at: string | null
          claimed_at: string | null
          created_at: string
          failed_at: string | null
          id: string
          last_error: string | null
          location_id: string | null
          max_attempts: number
          metadata: Json
          next_retry_at: string | null
          order_id: string | null
          order_number: string | null
          payload: Json
          print_agent_id: string | null
          printed_at: string | null
          printer_id: string | null
          printing_at: string | null
          priority: number
          raw_encoding: string
          station: string
          status: string
          store_id: number | null
          store_slug: string | null
          tenant_id: string
          ticket_text: string | null
          updated_at: string
          venue_slug: string | null
        }
        Insert: {
          attempts?: number
          canceled_at?: string | null
          claimed_at?: string | null
          created_at?: string
          failed_at?: string | null
          id?: string
          last_error?: string | null
          location_id?: string | null
          max_attempts?: number
          metadata?: Json
          next_retry_at?: string | null
          order_id?: string | null
          order_number?: string | null
          payload?: Json
          print_agent_id?: string | null
          printed_at?: string | null
          printer_id?: string | null
          printing_at?: string | null
          priority?: number
          raw_encoding?: string
          station?: string
          status?: string
          store_id?: number | null
          store_slug?: string | null
          tenant_id: string
          ticket_text?: string | null
          updated_at?: string
          venue_slug?: string | null
        }
        Update: {
          attempts?: number
          canceled_at?: string | null
          claimed_at?: string | null
          created_at?: string
          failed_at?: string | null
          id?: string
          last_error?: string | null
          location_id?: string | null
          max_attempts?: number
          metadata?: Json
          next_retry_at?: string | null
          order_id?: string | null
          order_number?: string | null
          payload?: Json
          print_agent_id?: string | null
          printed_at?: string | null
          printer_id?: string | null
          printing_at?: string | null
          priority?: number
          raw_encoding?: string
          station?: string
          status?: string
          store_id?: number | null
          store_slug?: string | null
          tenant_id?: string
          ticket_text?: string | null
          updated_at?: string
          venue_slug?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "print_jobs_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "print_jobs_print_agent_id_fkey"
            columns: ["print_agent_id"]
            isOneToOne: false
            referencedRelation: "print_agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "print_jobs_printer_id_fkey"
            columns: ["printer_id"]
            isOneToOne: false
            referencedRelation: "printers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "print_jobs_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      printers: {
        Row: {
          category_filters: string[]
          connection_type: string
          created_at: string
          description: string | null
          enabled: boolean
          host: string | null
          id: string
          is_default: boolean
          item_tag_filters: string[]
          location_id: string | null
          metadata: Json
          model: string | null
          name: string
          port: number
          printer_type: string
          serial_number: string | null
          station: string
          store_id: number | null
          store_slug: string | null
          tenant_id: string
          updated_at: string
          venue_slug: string | null
        }
        Insert: {
          category_filters?: string[]
          connection_type?: string
          created_at?: string
          description?: string | null
          enabled?: boolean
          host?: string | null
          id?: string
          is_default?: boolean
          item_tag_filters?: string[]
          location_id?: string | null
          metadata?: Json
          model?: string | null
          name: string
          port?: number
          printer_type?: string
          serial_number?: string | null
          station?: string
          store_id?: number | null
          store_slug?: string | null
          tenant_id: string
          updated_at?: string
          venue_slug?: string | null
        }
        Update: {
          category_filters?: string[]
          connection_type?: string
          created_at?: string
          description?: string | null
          enabled?: boolean
          host?: string | null
          id?: string
          is_default?: boolean
          item_tag_filters?: string[]
          location_id?: string | null
          metadata?: Json
          model?: string | null
          name?: string
          port?: number
          printer_type?: string
          serial_number?: string | null
          station?: string
          store_id?: number | null
          store_slug?: string | null
          tenant_id?: string
          updated_at?: string
          venue_slug?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "printers_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          language: string | null
          phone: string | null
          timezone: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          language?: string | null
          phone?: string | null
          timezone?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          language?: string | null
          phone?: string | null
          timezone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      promotions: {
        Row: {
          applicable_stores: number[] | null
          code: string | null
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          is_active: boolean | null
          name: string
          start_date: string | null
          tenant_id: string | null
          type: string
          updated_at: string | null
          usage_count: number | null
          usage_limit: number | null
          value: number
        }
        Insert: {
          applicable_stores?: number[] | null
          code?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          start_date?: string | null
          tenant_id?: string | null
          type?: string
          updated_at?: string | null
          usage_count?: number | null
          usage_limit?: number | null
          value?: number
        }
        Update: {
          applicable_stores?: number[] | null
          code?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          start_date?: string | null
          tenant_id?: string | null
          type?: string
          updated_at?: string | null
          usage_count?: number | null
          usage_limit?: number | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "promotions_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      resort_amenities: {
        Row: {
          created_at: string
          geometry: Json
          id: string
          is_active: boolean
          label: string
          properties: Json
          resort_id: string
          section: string | null
          sort_order: number
          status: Database["public"]["Enums"]["amenity_status"]
          type: Database["public"]["Enums"]["amenity_type"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          geometry: Json
          id?: string
          is_active?: boolean
          label: string
          properties?: Json
          resort_id: string
          section?: string | null
          sort_order?: number
          status?: Database["public"]["Enums"]["amenity_status"]
          type: Database["public"]["Enums"]["amenity_type"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          geometry?: Json
          id?: string
          is_active?: boolean
          label?: string
          properties?: Json
          resort_id?: string
          section?: string | null
          sort_order?: number
          status?: Database["public"]["Enums"]["amenity_status"]
          type?: Database["public"]["Enums"]["amenity_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "resort_amenities_resort_id_fkey"
            columns: ["resort_id"]
            isOneToOne: false
            referencedRelation: "resorts"
            referencedColumns: ["id"]
          },
        ]
      }
      resorts: {
        Row: {
          address: string | null
          bounds: Json | null
          center_lat: number | null
          center_lng: number | null
          created_at: string | null
          default_zoom: number | null
          email: string | null
          id: string
          location: string | null
          logo: string | null
          manager: string | null
          map_style: string | null
          max_zoom: number | null
          metadata: Json | null
          min_zoom: number | null
          name: string
          phone: string | null
          status: string | null
          store_count: number | null
          tenant_id: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          bounds?: Json | null
          center_lat?: number | null
          center_lng?: number | null
          created_at?: string | null
          default_zoom?: number | null
          email?: string | null
          id?: string
          location?: string | null
          logo?: string | null
          manager?: string | null
          map_style?: string | null
          max_zoom?: number | null
          metadata?: Json | null
          min_zoom?: number | null
          name: string
          phone?: string | null
          status?: string | null
          store_count?: number | null
          tenant_id?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          bounds?: Json | null
          center_lat?: number | null
          center_lng?: number | null
          created_at?: string | null
          default_zoom?: number | null
          email?: string | null
          id?: string
          location?: string | null
          logo?: string | null
          manager?: string | null
          map_style?: string | null
          max_zoom?: number | null
          metadata?: Json | null
          min_zoom?: number | null
          name?: string
          phone?: string | null
          status?: string | null
          store_count?: number | null
          tenant_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resorts_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      routine_success_log: {
        Row: {
          id: number
          routine_name: string
          succeeded_at: string
          summary: string | null
          tokens_used: number | null
        }
        Insert: {
          id?: number
          routine_name: string
          succeeded_at?: string
          summary?: string | null
          tokens_used?: number | null
        }
        Update: {
          id?: number
          routine_name?: string
          succeeded_at?: string
          summary?: string | null
          tokens_used?: number | null
        }
        Relationships: []
      }
      shift_reconciliations: {
        Row: {
          cash_actual_cents: number | null
          cash_expected_cents: number
          created_at: string
          daze_total_cents: number
          id: string
          notes: string | null
          pos_total_cents: number | null
          reconciled_at: string
          reconciled_by: string
          reconciled_by_staff_id: string | null
          shift_id: string
          tenant_id: string
          tip_total_cents: number
          variance_cents: number | null
          variance_flagged: boolean
        }
        Insert: {
          cash_actual_cents?: number | null
          cash_expected_cents?: number
          created_at?: string
          daze_total_cents?: number
          id?: string
          notes?: string | null
          pos_total_cents?: number | null
          reconciled_at?: string
          reconciled_by: string
          reconciled_by_staff_id?: string | null
          shift_id: string
          tenant_id: string
          tip_total_cents?: number
          variance_cents?: number | null
          variance_flagged?: boolean
        }
        Update: {
          cash_actual_cents?: number | null
          cash_expected_cents?: number
          created_at?: string
          daze_total_cents?: number
          id?: string
          notes?: string | null
          pos_total_cents?: number | null
          reconciled_at?: string
          reconciled_by?: string
          reconciled_by_staff_id?: string | null
          shift_id?: string
          tenant_id?: string
          tip_total_cents?: number
          variance_cents?: number | null
          variance_flagged?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "shift_reconciliations_reconciled_by_staff_id_fkey"
            columns: ["reconciled_by_staff_id"]
            isOneToOne: false
            referencedRelation: "staff_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shift_reconciliations_shift_id_fkey"
            columns: ["shift_id"]
            isOneToOne: false
            referencedRelation: "shifts"
            referencedColumns: ["id"]
          },
        ]
      }
      shifts: {
        Row: {
          closed_at: string | null
          created_at: string
          id: string
          register_id: string | null
          staff_name: string | null
          started_at: string | null
          status: string
          tenant_id: string
        }
        Insert: {
          closed_at?: string | null
          created_at?: string
          id?: string
          register_id?: string | null
          staff_name?: string | null
          started_at?: string | null
          status?: string
          tenant_id: string
        }
        Update: {
          closed_at?: string | null
          created_at?: string
          id?: string
          register_id?: string | null
          staff_name?: string | null
          started_at?: string | null
          status?: string
          tenant_id?: string
        }
        Relationships: []
      }
      sms_send_log: {
        Row: {
          attempt_number: number
          created_at: string
          delivered_at: string | null
          error_code: string | null
          error_message: string | null
          id: string
          message_sid: string | null
          notification_type: string
          order_id: string | null
          raw_request: Json | null
          raw_response: Json | null
          retry_after: string | null
          status: string
          tenant_id: string | null
          terminal_at: string | null
          to_phone: string
          updated_at: string
        }
        Insert: {
          attempt_number?: number
          created_at?: string
          delivered_at?: string | null
          error_code?: string | null
          error_message?: string | null
          id?: string
          message_sid?: string | null
          notification_type: string
          order_id?: string | null
          raw_request?: Json | null
          raw_response?: Json | null
          retry_after?: string | null
          status?: string
          tenant_id?: string | null
          terminal_at?: string | null
          to_phone: string
          updated_at?: string
        }
        Update: {
          attempt_number?: number
          created_at?: string
          delivered_at?: string | null
          error_code?: string | null
          error_message?: string | null
          id?: string
          message_sid?: string | null
          notification_type?: string
          order_id?: string | null
          raw_request?: Json | null
          raw_response?: Json | null
          retry_after?: string | null
          status?: string
          tenant_id?: string | null
          terminal_at?: string | null
          to_phone?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sms_send_log_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      spatial_ref_sys: {
        Row: {
          auth_name: string | null
          auth_srid: number | null
          proj4text: string | null
          srid: number
          srtext: string | null
        }
        Insert: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid: number
          srtext?: string | null
        }
        Update: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid?: number
          srtext?: string | null
        }
        Relationships: []
      }
      square_webhook_events: {
        Row: {
          daze_order_id: string | null
          event_id: string
          event_type: string
          merchant_id: string | null
          payload: Json
          processed_at: string | null
          processing_error: string | null
          received_at: string
          signature_verified: boolean
          square_environment: string
          tenant_id: string | null
        }
        Insert: {
          daze_order_id?: string | null
          event_id: string
          event_type: string
          merchant_id?: string | null
          payload: Json
          processed_at?: string | null
          processing_error?: string | null
          received_at?: string
          signature_verified?: boolean
          square_environment: string
          tenant_id?: string | null
        }
        Update: {
          daze_order_id?: string | null
          event_id?: string
          event_type?: string
          merchant_id?: string | null
          payload?: Json
          processed_at?: string | null
          processing_error?: string | null
          received_at?: string
          signature_verified?: boolean
          square_environment?: string
          tenant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "square_webhook_events_daze_order_id_fkey"
            columns: ["daze_order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "square_webhook_events_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_members: {
        Row: {
          active: boolean
          auth_user_id: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          pin_hash: string
          pin_last_four: string | null
          role: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          auth_user_id?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          pin_hash: string
          pin_last_four?: string | null
          role?: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          auth_user_id?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          pin_hash?: string
          pin_last_four?: string | null
          role?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_members_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_sessions: {
        Row: {
          created_at: string
          device_id: string
          ended_at: string | null
          id: string
          staff_member_id: string
          started_at: string
          status: string
          tenant_id: string
        }
        Insert: {
          created_at?: string
          device_id: string
          ended_at?: string | null
          id?: string
          staff_member_id: string
          started_at?: string
          status?: string
          tenant_id: string
        }
        Update: {
          created_at?: string
          device_id?: string
          ended_at?: string | null
          id?: string
          staff_member_id?: string
          started_at?: string
          status?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_sessions_staff_member_id_fkey"
            columns: ["staff_member_id"]
            isOneToOne: false
            referencedRelation: "staff_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_sessions_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      store_resort_availability: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          resort_id: string
          store_id: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          resort_id: string
          store_id: number
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          resort_id?: string
          store_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "store_resort_availability_resort_id_fkey"
            columns: ["resort_id"]
            isOneToOne: false
            referencedRelation: "resorts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "store_resort_availability_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      store_resort_links: {
        Row: {
          created_at: string | null
          id: string
          resort_id: string
          store_id: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          resort_id: string
          store_id: number
        }
        Update: {
          created_at?: string | null
          id?: string
          resort_id?: string
          store_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "store_resort_links_resort_id_fkey"
            columns: ["resort_id"]
            isOneToOne: false
            referencedRelation: "resorts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "store_resort_links_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      stores: {
        Row: {
          active_orders: number | null
          address: string | null
          bg_color: string | null
          created_at: string | null
          custom_logo: string | null
          hours: Json | null
          id: number
          is_active: boolean | null
          location_description: string | null
          logo: string | null
          name: string
          resort_id: string | null
          slug: string | null
          tenant_id: string | null
          updated_at: string | null
        }
        Insert: {
          active_orders?: number | null
          address?: string | null
          bg_color?: string | null
          created_at?: string | null
          custom_logo?: string | null
          hours?: Json | null
          id?: number
          is_active?: boolean | null
          location_description?: string | null
          logo?: string | null
          name: string
          resort_id?: string | null
          slug?: string | null
          tenant_id?: string | null
          updated_at?: string | null
        }
        Update: {
          active_orders?: number | null
          address?: string | null
          bg_color?: string | null
          created_at?: string | null
          custom_logo?: string | null
          hours?: Json | null
          id?: number
          is_active?: boolean | null
          location_description?: string | null
          logo?: string | null
          name?: string
          resort_id?: string | null
          slug?: string | null
          tenant_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stores_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      stripe_accounts: {
        Row: {
          account_type: string
          charges_enabled: boolean | null
          created_at: string | null
          id: string
          metadata: Json | null
          onboarding_complete: boolean | null
          payouts_enabled: boolean | null
          platform_fee_percent: number
          stripe_account_id: string | null
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          account_type?: string
          charges_enabled?: boolean | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          onboarding_complete?: boolean | null
          payouts_enabled?: boolean | null
          platform_fee_percent?: number
          stripe_account_id?: string | null
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          account_type?: string
          charges_enabled?: boolean | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          onboarding_complete?: boolean | null
          payouts_enabled?: boolean | null
          platform_fee_percent?: number
          stripe_account_id?: string | null
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      tab_closures: {
        Row: {
          closed_at: string
          closed_by: string | null
          closed_by_staff_id: string | null
          created_at: string | null
          id: string
          order_id: string
          payment_method: string
          shift_id: string
          tenant_id: string
          tip_cents: number
        }
        Insert: {
          closed_at?: string
          closed_by?: string | null
          closed_by_staff_id?: string | null
          created_at?: string | null
          id?: string
          order_id: string
          payment_method?: string
          shift_id: string
          tenant_id: string
          tip_cents?: number
        }
        Update: {
          closed_at?: string
          closed_by?: string | null
          closed_by_staff_id?: string | null
          created_at?: string | null
          id?: string
          order_id?: string
          payment_method?: string
          shift_id?: string
          tenant_id?: string
          tip_cents?: number
        }
        Relationships: [
          {
            foreignKeyName: "tab_closures_closed_by_staff_id_fkey"
            columns: ["closed_by_staff_id"]
            isOneToOne: false
            referencedRelation: "staff_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tab_closures_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tab_closures_shift_id_fkey"
            columns: ["shift_id"]
            isOneToOne: false
            referencedRelation: "shifts"
            referencedColumns: ["id"]
          },
        ]
      }
      tabs: {
        Row: {
          closed_at: string | null
          created_at: string
          guest_id: string | null
          id: string
          location_id: string
          opened_at: string
          status: string
          table_number: string
          tenant_id: string
          total_cents: number
          updated_at: string
        }
        Insert: {
          closed_at?: string | null
          created_at?: string
          guest_id?: string | null
          id?: string
          location_id: string
          opened_at?: string
          status?: string
          table_number: string
          tenant_id: string
          total_cents?: number
          updated_at?: string
        }
        Update: {
          closed_at?: string | null
          created_at?: string
          guest_id?: string | null
          id?: string
          location_id?: string
          opened_at?: string
          status?: string
          table_number?: string
          tenant_id?: string
          total_cents?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tabs_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "guests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tabs_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tabs_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_members: {
        Row: {
          created_at: string
          granted_by: string | null
          id: string
          is_active: boolean
          location_id: string | null
          role: Database["public"]["Enums"]["staff_role"]
          tenant_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          granted_by?: string | null
          id?: string
          is_active?: boolean
          location_id?: string | null
          role?: Database["public"]["Enums"]["staff_role"]
          tenant_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          granted_by?: string | null
          id?: string
          is_active?: boolean
          location_id?: string | null
          role?: Database["public"]["Enums"]["staff_role"]
          tenant_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenant_members_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tenant_members_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          brand_color: string | null
          created_at: string
          currency: string
          id: string
          is_active: boolean
          logo_url: string | null
          name: string
          settings: Json
          slug: string
          subscription_tier: Database["public"]["Enums"]["subscription_tier"]
          timezone: string
          updated_at: string
        }
        Insert: {
          brand_color?: string | null
          created_at?: string
          currency?: string
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name: string
          settings?: Json
          slug: string
          subscription_tier?: Database["public"]["Enums"]["subscription_tier"]
          timezone?: string
          updated_at?: string
        }
        Update: {
          brand_color?: string | null
          created_at?: string
          currency?: string
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name?: string
          settings?: Json
          slug?: string
          subscription_tier?: Database["public"]["Enums"]["subscription_tier"]
          timezone?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_saved_items: {
        Row: {
          created_at: string
          id: string
          item_id: string
          tenant_id: string | null
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          item_id: string
          tenant_id?: string | null
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          item_id?: string
          tenant_id?: string | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      user_tenants: {
        Row: {
          created_at: string | null
          id: string
          role: string | null
          tenant_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: string | null
          tenant_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string | null
          tenant_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_tenants_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      venues: {
        Row: {
          client_id: string | null
          created_at: string | null
          id: string
          name: string | null
          venue_layout_file_name: string | null
          venue_layout_url: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          id?: string
          name?: string | null
          venue_layout_file_name?: string | null
          venue_layout_url?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          id?: string
          name?: string | null
          venue_layout_file_name?: string | null
          venue_layout_url?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      delivery_performance: {
        Row: {
          avg_delivery_minutes: number | null
          completed_deliveries: number | null
          max_delivery_minutes: number | null
          min_delivery_minutes: number | null
          on_time_deliveries: number | null
          runner_id: string | null
          tenant_id: string | null
          total_deliveries: number | null
        }
        Relationships: [
          {
            foreignKeyName: "delivery_assignments_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      geography_columns: {
        Row: {
          coord_dimension: number | null
          f_geography_column: unknown
          f_table_catalog: unknown
          f_table_name: unknown
          f_table_schema: unknown
          srid: number | null
          type: string | null
        }
        Relationships: []
      }
      geometry_columns: {
        Row: {
          coord_dimension: number | null
          f_geometry_column: unknown
          f_table_catalog: string | null
          f_table_name: unknown
          f_table_schema: unknown
          srid: number | null
          type: string | null
        }
        Insert: {
          coord_dimension?: number | null
          f_geometry_column?: unknown
          f_table_catalog?: string | null
          f_table_name?: unknown
          f_table_schema?: unknown
          srid?: number | null
          type?: string | null
        }
        Update: {
          coord_dimension?: number | null
          f_geometry_column?: unknown
          f_table_catalog?: string | null
          f_table_name?: unknown
          f_table_schema?: unknown
          srid?: number | null
          type?: string | null
        }
        Relationships: []
      }
      order_analytics: {
        Row: {
          avg_order_value_cents: number | null
          cancelled_orders: number | null
          completed_orders: number | null
          date: string | null
          location_id: string | null
          orders_bar: number | null
          orders_beach_pool: number | null
          orders_room_dining: number | null
          orders_tablepay: number | null
          tenant_id: string | null
          total_orders: number | null
          total_revenue_cents: number | null
          total_tax_cents: number | null
          total_tips_cents: number | null
          type_bar: number | null
          type_beach: number | null
          type_dine_in: number | null
          type_pool: number | null
          type_room_service: number | null
          type_takeout: number | null
          unique_guests: number | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      peak_hours_30d: {
        Row: {
          avg_order_value_cents: number | null
          day_of_week: number | null
          hour: number | null
          location_id: string | null
          order_count: number | null
          tenant_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      popular_items_7d: {
        Row: {
          avg_price_cents: number | null
          item_name: string | null
          location_id: string | null
          menu_item_id: string | null
          order_count: number | null
          tenant_id: string | null
          total_quantity_sold: number | null
          total_revenue_cents: number | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_menu_items: {
        Row: {
          category: string | null
          category_sort_order: number | null
          description: string | null
          id: string | null
          image_url: string | null
          is_available: boolean | null
          is_featured: boolean | null
          item_sort_order: number | null
          name: string | null
          omnivore_item_id: string | null
          price: number | null
          restaurant_id: string | null
          video_url: string | null
        }
        Relationships: []
      }
      sms_delivery_health: {
        Row: {
          attempts_delivered: number | null
          attempts_failed: number | null
          attempts_in_flight: number | null
          attempts_skipped: number | null
          attempts_total: number | null
          delivery_rate_pct: number | null
          notification_type: string | null
          orders_delivered: number | null
          orders_failed: number | null
          orders_total: number | null
          window: string | null
        }
        Relationships: []
      }
      v_eligible_couriers: {
        Row: {
          active_orders: number | null
          courier_id: string | null
          last_location_update: string | null
          latitude: number | null
          longitude: number | null
          max_concurrent: number | null
          tenant_id: string | null
        }
        Insert: {
          active_orders?: never
          courier_id?: string | null
          last_location_update?: string | null
          latitude?: number | null
          longitude?: number | null
          max_concurrent?: never
          tenant_id?: string | null
        }
        Update: {
          active_orders?: never
          courier_id?: string | null
          last_location_update?: string | null
          latitude?: number | null
          longitude?: number | null
          max_concurrent?: never
          tenant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "courier_status_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      _postgis_deprecate: {
        Args: { newname: string; oldname: string; version: string }
        Returns: undefined
      }
      _postgis_index_extent: {
        Args: { col: string; tbl: unknown }
        Returns: unknown
      }
      _postgis_pgsql_version: { Args: never; Returns: string }
      _postgis_scripts_pgsql_version: { Args: never; Returns: string }
      _postgis_selectivity: {
        Args: { att_name: string; geom: unknown; mode?: string; tbl: unknown }
        Returns: number
      }
      _postgis_stats: {
        Args: { ""?: string; att_name: string; tbl: unknown }
        Returns: string
      }
      _st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_coveredby:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_covers:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_crosses: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      _st_equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_intersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      _st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      _st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      _st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_sortablehash: { Args: { geom: unknown }; Returns: number }
      _st_touches: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_voronoi: {
        Args: {
          clip?: unknown
          g1: unknown
          return_polygons?: boolean
          tolerance?: number
        }
        Returns: unknown
      }
      _st_within: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      addauth: { Args: { "": string }; Returns: boolean }
      addgeometrycolumn:
        | {
            Args: {
              catalog_name: string
              column_name: string
              new_dim: number
              new_srid_in: number
              new_type: string
              schema_name: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              column_name: string
              new_dim: number
              new_srid: number
              new_type: string
              schema_name: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              column_name: string
              new_dim: number
              new_srid: number
              new_type: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
      assign_courier_to_order: {
        Args: { target_order_id: string }
        Returns: string
      }
      can_access_tenant: { Args: { target_tenant: string }; Returns: boolean }
      claim_print_jobs: {
        Args: { p_agent_token: string; p_limit?: number }
        Returns: {
          attempts: number
          created_at: string
          id: string
          max_attempts: number
          order_id: string
          order_number: string
          payload: Json
          printer_host: string
          printer_id: string
          printer_name: string
          printer_port: number
          printer_type: string
          station: string
          tenant_id: string
          ticket_text: string
        }[]
      }
      courier_active_order_count: {
        Args: { target_courier: string }
        Returns: number
      }
      create_staff_member_with_pin: {
        Args: {
          p_email: string
          p_name: string
          p_pin: string
          p_role: string
          p_tenant_id: string
        }
        Returns: string
      }
      disablelongtransactions: { Args: never; Returns: string }
      dropgeometrycolumn:
        | {
            Args: {
              catalog_name: string
              column_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | {
            Args: {
              column_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | { Args: { column_name: string; table_name: string }; Returns: string }
      dropgeometrytable:
        | {
            Args: {
              catalog_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | { Args: { schema_name: string; table_name: string }; Returns: string }
        | { Args: { table_name: string }; Returns: string }
      enablelongtransactions: { Args: never; Returns: string }
      equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      generate_order_number:
        | { Args: never; Returns: string }
        | { Args: { p_tenant_id: string }; Returns: number }
      geometry: { Args: { "": string }; Returns: unknown }
      geometry_above: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_below: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_cmp: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_contained_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_distance_box: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_distance_centroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_eq: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_ge: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_gt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_le: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_left: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_lt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overabove: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overbelow: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overleft: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overright: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_right: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_within: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geomfromewkt: { Args: { "": string }; Returns: unknown }
      get_customer_analytics_report: {
        Args: {
          p_end_date?: string
          p_start_date?: string
          p_store_ids?: number[]
        }
        Returns: {
          metric: string
          value: number
        }[]
      }
      get_my_reviews: {
        Args: never
        Returns: {
          comment: string
          created_at: string
          id: string
          order_id: string
          rating: number
          restaurant_id: string
          updated_at: string
        }[]
      }
      get_payment_types_report: {
        Args: {
          p_end_date?: string
          p_start_date?: string
          p_store_ids?: number[]
        }
        Returns: {
          order_count: number
          payment_method: string
        }[]
      }
      get_product_mix_report: {
        Args: {
          p_end_date?: string
          p_start_date?: string
          p_store_ids?: number[]
        }
        Returns: {
          item_name: string
          quantity_sold: number
          total_sales: number
        }[]
      }
      get_public_reviews: {
        Args: { restaurant_uuid?: string }
        Returns: {
          comment: string
          created_at: string
          id: string
          rating: number
          restaurant_id: string
          updated_at: string
        }[]
      }
      get_restaurant_review_stats: {
        Args: { restaurant_uuid: string }
        Returns: {
          average_rating: number
          rating_1_count: number
          rating_2_count: number
          rating_3_count: number
          rating_4_count: number
          rating_5_count: number
          restaurant_id: string
          total_reviews: number
        }[]
      }
      get_revenue_report: {
        Args: {
          p_end_date: string
          p_start_date: string
          p_store_ids: number[]
          p_tenant_id: string
        }
        Returns: {
          average_order_value: number
          period: string
          total_orders: number
          total_revenue: number
        }[]
      }
      get_routine_last_success: {
        Args: { p_routine_names: string[] }
        Returns: {
          last_succeeded_at: string
          last_summary: string
          routine_name: string
          success_count_24h: number
        }[]
      }
      get_tenant_id: { Args: never; Returns: string }
      gettransactionid: { Args: never; Returns: unknown }
      hash_print_agent_token: { Args: { p_token: string }; Returns: string }
      haversine_meters: {
        Args: { lat1: number; lat2: number; lng1: number; lng2: number }
        Returns: number
      }
      longtransactionsenabled: { Args: never; Returns: boolean }
      mark_print_job_status: {
        Args: {
          p_agent_token: string
          p_error?: string
          p_job_id: string
          p_metadata?: Json
          p_status: string
        }
        Returns: {
          attempts: number
          id: string
          next_retry_at: string
          status: string
          updated_at: string
        }[]
      }
      order_items_insert_allowed: {
        Args: { p_order_id: string }
        Returns: boolean
      }
      populate_geometry_columns:
        | { Args: { tbl_oid: unknown; use_typmod?: boolean }; Returns: number }
        | { Args: { use_typmod?: boolean }; Returns: string }
      postgis_constraint_dims: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: number
      }
      postgis_constraint_srid: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: number
      }
      postgis_constraint_type: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: string
      }
      postgis_extensions_upgrade: { Args: never; Returns: string }
      postgis_full_version: { Args: never; Returns: string }
      postgis_geos_version: { Args: never; Returns: string }
      postgis_lib_build_date: { Args: never; Returns: string }
      postgis_lib_revision: { Args: never; Returns: string }
      postgis_lib_version: { Args: never; Returns: string }
      postgis_libjson_version: { Args: never; Returns: string }
      postgis_liblwgeom_version: { Args: never; Returns: string }
      postgis_libprotobuf_version: { Args: never; Returns: string }
      postgis_libxml_version: { Args: never; Returns: string }
      postgis_proj_version: { Args: never; Returns: string }
      postgis_scripts_build_date: { Args: never; Returns: string }
      postgis_scripts_installed: { Args: never; Returns: string }
      postgis_scripts_released: { Args: never; Returns: string }
      postgis_svn_version: { Args: never; Returns: string }
      postgis_type_name: {
        Args: {
          coord_dimension: number
          geomname: string
          use_new_name?: boolean
        }
        Returns: string
      }
      postgis_version: { Args: never; Returns: string }
      postgis_wagyu_version: { Args: never; Returns: string }
      print_agent_heartbeat: {
        Args: {
          p_agent_token: string
          p_device_hostname?: string
          p_local_ip?: string
          p_metadata?: Json
          p_status?: string
          p_version?: string
        }
        Returns: {
          agent_id: string
          heartbeat_interval_seconds: number
          server_time: string
          status: string
          tenant_id: string
        }[]
      }
      process_due_dispatches: { Args: never; Returns: number }
      record_routine_success: {
        Args: {
          p_routine_name: string
          p_summary?: string
          p_tokens_used?: number
        }
        Returns: number
      }
      refresh_analytics: { Args: never; Returns: undefined }
      resolve_print_agent: {
        Args: { p_agent_token: string }
        Returns: {
          created_at: string
          description: string | null
          device_hostname: string | null
          enabled: boolean
          heartbeat_interval_seconds: number
          id: string
          last_error: string | null
          last_seen_at: string | null
          local_ip: string | null
          metadata: Json
          name: string
          network_name: string | null
          status: string
          tenant_id: string
          token_hash: string | null
          token_last_rotated_at: string | null
          updated_at: string
          version: string | null
        }
        SetofOptions: {
          from: "*"
          to: "print_agents"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      retry_failed_sms: { Args: never; Returns: number }
      set_staff_pin: {
        Args: { p_new_pin: string; p_staff_member_id: string }
        Returns: undefined
      }
      set_tenant_context: { Args: { p_tenant_id: string }; Returns: undefined }
      st_3dclosestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3ddistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_3dlongestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmakebox: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmaxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dshortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_addpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_angle:
        | { Args: { line1: unknown; line2: unknown }; Returns: number }
        | {
            Args: { pt1: unknown; pt2: unknown; pt3: unknown; pt4?: unknown }
            Returns: number
          }
      st_area:
        | { Args: { geog: unknown; use_spheroid?: boolean }; Returns: number }
        | { Args: { "": string }; Returns: number }
      st_asencodedpolyline: {
        Args: { geom: unknown; nprecision?: number }
        Returns: string
      }
      st_asewkt: { Args: { "": string }; Returns: string }
      st_asgeojson:
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | {
            Args: {
              geom_column?: string
              maxdecimaldigits?: number
              pretty_bool?: boolean
              r: Record<string, unknown>
            }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_asgml:
        | {
            Args: {
              geog: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
            }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
        | {
            Args: {
              geog: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
              version: number
            }
            Returns: string
          }
        | {
            Args: {
              geom: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
              version: number
            }
            Returns: string
          }
      st_askml:
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; nprefix?: string }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; nprefix?: string }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_aslatlontext: {
        Args: { geom: unknown; tmpl?: string }
        Returns: string
      }
      st_asmarc21: { Args: { format?: string; geom: unknown }; Returns: string }
      st_asmvtgeom: {
        Args: {
          bounds: unknown
          buffer?: number
          clip_geom?: boolean
          extent?: number
          geom: unknown
        }
        Returns: unknown
      }
      st_assvg:
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; rel?: number }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; rel?: number }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_astext: { Args: { "": string }; Returns: string }
      st_astwkb:
        | {
            Args: {
              geom: unknown
              prec?: number
              prec_m?: number
              prec_z?: number
              with_boxes?: boolean
              with_sizes?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              geom: unknown[]
              ids: number[]
              prec?: number
              prec_m?: number
              prec_z?: number
              with_boxes?: boolean
              with_sizes?: boolean
            }
            Returns: string
          }
      st_asx3d: {
        Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
        Returns: string
      }
      st_azimuth:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: number }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
      st_boundingdiagonal: {
        Args: { fits?: boolean; geom: unknown }
        Returns: unknown
      }
      st_buffer:
        | {
            Args: { geom: unknown; options?: string; radius: number }
            Returns: unknown
          }
        | {
            Args: { geom: unknown; quadsegs: number; radius: number }
            Returns: unknown
          }
      st_centroid: { Args: { "": string }; Returns: unknown }
      st_clipbybox2d: {
        Args: { box: unknown; geom: unknown }
        Returns: unknown
      }
      st_closestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_collect: { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
      st_concavehull: {
        Args: {
          param_allow_holes?: boolean
          param_geom: unknown
          param_pctconvex: number
        }
        Returns: unknown
      }
      st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_coorddim: { Args: { geometry: unknown }; Returns: number }
      st_coveredby:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_covers:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_crosses: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_curvetoline: {
        Args: { flags?: number; geom: unknown; tol?: number; toltype?: number }
        Returns: unknown
      }
      st_delaunaytriangles: {
        Args: { flags?: number; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_difference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_disjoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_distance:
        | {
            Args: { geog1: unknown; geog2: unknown; use_spheroid?: boolean }
            Returns: number
          }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
      st_distancesphere:
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
        | {
            Args: { geom1: unknown; geom2: unknown; radius: number }
            Returns: number
          }
      st_distancespheroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      st_equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_expand:
        | { Args: { box: unknown; dx: number; dy: number }; Returns: unknown }
        | {
            Args: { box: unknown; dx: number; dy: number; dz?: number }
            Returns: unknown
          }
        | {
            Args: {
              dm?: number
              dx: number
              dy: number
              dz?: number
              geom: unknown
            }
            Returns: unknown
          }
      st_force3d: { Args: { geom: unknown; zvalue?: number }; Returns: unknown }
      st_force3dm: {
        Args: { geom: unknown; mvalue?: number }
        Returns: unknown
      }
      st_force3dz: {
        Args: { geom: unknown; zvalue?: number }
        Returns: unknown
      }
      st_force4d: {
        Args: { geom: unknown; mvalue?: number; zvalue?: number }
        Returns: unknown
      }
      st_generatepoints:
        | { Args: { area: unknown; npoints: number }; Returns: unknown }
        | {
            Args: { area: unknown; npoints: number; seed: number }
            Returns: unknown
          }
      st_geogfromtext: { Args: { "": string }; Returns: unknown }
      st_geographyfromtext: { Args: { "": string }; Returns: unknown }
      st_geohash:
        | { Args: { geog: unknown; maxchars?: number }; Returns: string }
        | { Args: { geom: unknown; maxchars?: number }; Returns: string }
      st_geomcollfromtext: { Args: { "": string }; Returns: unknown }
      st_geometricmedian: {
        Args: {
          fail_if_not_converged?: boolean
          g: unknown
          max_iter?: number
          tolerance?: number
        }
        Returns: unknown
      }
      st_geometryfromtext: { Args: { "": string }; Returns: unknown }
      st_geomfromewkt: { Args: { "": string }; Returns: unknown }
      st_geomfromgeojson:
        | { Args: { "": Json }; Returns: unknown }
        | { Args: { "": Json }; Returns: unknown }
        | { Args: { "": string }; Returns: unknown }
      st_geomfromgml: { Args: { "": string }; Returns: unknown }
      st_geomfromkml: { Args: { "": string }; Returns: unknown }
      st_geomfrommarc21: { Args: { marc21xml: string }; Returns: unknown }
      st_geomfromtext: { Args: { "": string }; Returns: unknown }
      st_gmltosql: { Args: { "": string }; Returns: unknown }
      st_hasarc: { Args: { geometry: unknown }; Returns: boolean }
      st_hausdorffdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_hexagon: {
        Args: { cell_i: number; cell_j: number; origin?: unknown; size: number }
        Returns: unknown
      }
      st_hexagongrid: {
        Args: { bounds: unknown; size: number }
        Returns: Record<string, unknown>[]
      }
      st_interpolatepoint: {
        Args: { line: unknown; point: unknown }
        Returns: number
      }
      st_intersection: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_intersects:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_isvaliddetail: {
        Args: { flags?: number; geom: unknown }
        Returns: Database["public"]["CompositeTypes"]["valid_detail"]
        SetofOptions: {
          from: "*"
          to: "valid_detail"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      st_length:
        | { Args: { geog: unknown; use_spheroid?: boolean }; Returns: number }
        | { Args: { "": string }; Returns: number }
      st_letters: { Args: { font?: Json; letters: string }; Returns: unknown }
      st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      st_linefromencodedpolyline: {
        Args: { nprecision?: number; txtin: string }
        Returns: unknown
      }
      st_linefromtext: { Args: { "": string }; Returns: unknown }
      st_linelocatepoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_linetocurve: { Args: { geometry: unknown }; Returns: unknown }
      st_locatealong: {
        Args: { geometry: unknown; leftrightoffset?: number; measure: number }
        Returns: unknown
      }
      st_locatebetween: {
        Args: {
          frommeasure: number
          geometry: unknown
          leftrightoffset?: number
          tomeasure: number
        }
        Returns: unknown
      }
      st_locatebetweenelevations: {
        Args: { fromelevation: number; geometry: unknown; toelevation: number }
        Returns: unknown
      }
      st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makebox2d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makeline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makevalid: {
        Args: { geom: unknown; params: string }
        Returns: unknown
      }
      st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_minimumboundingcircle: {
        Args: { inputgeom: unknown; segs_per_quarter?: number }
        Returns: unknown
      }
      st_mlinefromtext: { Args: { "": string }; Returns: unknown }
      st_mpointfromtext: { Args: { "": string }; Returns: unknown }
      st_mpolyfromtext: { Args: { "": string }; Returns: unknown }
      st_multilinestringfromtext: { Args: { "": string }; Returns: unknown }
      st_multipointfromtext: { Args: { "": string }; Returns: unknown }
      st_multipolygonfromtext: { Args: { "": string }; Returns: unknown }
      st_node: { Args: { g: unknown }; Returns: unknown }
      st_normalize: { Args: { geom: unknown }; Returns: unknown }
      st_offsetcurve: {
        Args: { distance: number; line: unknown; params?: string }
        Returns: unknown
      }
      st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_perimeter: {
        Args: { geog: unknown; use_spheroid?: boolean }
        Returns: number
      }
      st_pointfromtext: { Args: { "": string }; Returns: unknown }
      st_pointm: {
        Args: {
          mcoordinate: number
          srid?: number
          xcoordinate: number
          ycoordinate: number
        }
        Returns: unknown
      }
      st_pointz: {
        Args: {
          srid?: number
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
        }
        Returns: unknown
      }
      st_pointzm: {
        Args: {
          mcoordinate: number
          srid?: number
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
        }
        Returns: unknown
      }
      st_polyfromtext: { Args: { "": string }; Returns: unknown }
      st_polygonfromtext: { Args: { "": string }; Returns: unknown }
      st_project: {
        Args: { azimuth: number; distance: number; geog: unknown }
        Returns: unknown
      }
      st_quantizecoordinates: {
        Args: {
          g: unknown
          prec_m?: number
          prec_x: number
          prec_y?: number
          prec_z?: number
        }
        Returns: unknown
      }
      st_reduceprecision: {
        Args: { geom: unknown; gridsize: number }
        Returns: unknown
      }
      st_relate: { Args: { geom1: unknown; geom2: unknown }; Returns: string }
      st_removerepeatedpoints: {
        Args: { geom: unknown; tolerance?: number }
        Returns: unknown
      }
      st_segmentize: {
        Args: { geog: unknown; max_segment_length: number }
        Returns: unknown
      }
      st_setsrid:
        | { Args: { geog: unknown; srid: number }; Returns: unknown }
        | { Args: { geom: unknown; srid: number }; Returns: unknown }
      st_sharedpaths: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_shortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_simplifypolygonhull: {
        Args: { geom: unknown; is_outer?: boolean; vertex_fraction: number }
        Returns: unknown
      }
      st_split: { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
      st_square: {
        Args: { cell_i: number; cell_j: number; origin?: unknown; size: number }
        Returns: unknown
      }
      st_squaregrid: {
        Args: { bounds: unknown; size: number }
        Returns: Record<string, unknown>[]
      }
      st_srid:
        | { Args: { geog: unknown }; Returns: number }
        | { Args: { geom: unknown }; Returns: number }
      st_subdivide: {
        Args: { geom: unknown; gridsize?: number; maxvertices?: number }
        Returns: unknown[]
      }
      st_swapordinates: {
        Args: { geom: unknown; ords: unknown }
        Returns: unknown
      }
      st_symdifference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_symmetricdifference: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_tileenvelope: {
        Args: {
          bounds?: unknown
          margin?: number
          x: number
          y: number
          zoom: number
        }
        Returns: unknown
      }
      st_touches: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_transform:
        | {
            Args: { from_proj: string; geom: unknown; to_proj: string }
            Returns: unknown
          }
        | {
            Args: { from_proj: string; geom: unknown; to_srid: number }
            Returns: unknown
          }
        | { Args: { geom: unknown; to_proj: string }; Returns: unknown }
      st_triangulatepolygon: { Args: { g1: unknown }; Returns: unknown }
      st_union:
        | { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
        | {
            Args: { geom1: unknown; geom2: unknown; gridsize: number }
            Returns: unknown
          }
      st_voronoilines: {
        Args: { extend_to?: unknown; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_voronoipolygons: {
        Args: { extend_to?: unknown; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_within: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_wkbtosql: { Args: { wkb: string }; Returns: unknown }
      st_wkttosql: { Args: { "": string }; Returns: unknown }
      st_wrapx: {
        Args: { geom: unknown; move: number; wrap: number }
        Returns: unknown
      }
      unlockrows: { Args: { "": string }; Returns: number }
      updategeometrysrid: {
        Args: {
          catalogn_name: string
          column_name: string
          new_srid_in: number
          schema_name: string
          table_name: string
        }
        Returns: string
      }
      verify_staff_pin: {
        Args: { p_pin: string; p_tenant_id: string }
        Returns: {
          active: boolean
          email: string
          id: string
          name: string
          pin_last_four: string
          role: string
          tenant_id: string
        }[]
      }
    }
    Enums: {
      amenity_status: "available" | "occupied" | "reserved" | "maintenance"
      amenity_type:
        | "pool"
        | "lounger"
        | "umbrella"
        | "cabana"
        | "bar"
        | "restroom"
        | "beach_zone"
        | "walkway"
        | "entrance"
        | "building"
        | "fire_pit"
        | "tiki_bar"
        | "palm_tree"
        | "boardwalk"
      delivery_status: "assigned" | "picked_up" | "en_route" | "delivered"
      document_type:
        | "contract"
        | "menu"
        | "floor_plan"
        | "pos_credentials"
        | "branding"
        | "other"
      guest_location_type:
        | "table"
        | "room"
        | "beach"
        | "pool"
        | "bar"
        | "lobby"
        | "custom"
      location_type:
        | "beach"
        | "pool"
        | "restaurant"
        | "room_service"
        | "bar"
        | "lobby"
      onboarding_stage:
        | "lead"
        | "demo"
        | "contract"
        | "setup"
        | "pos_integration"
        | "training"
        | "live"
        | "churned"
      order_item_status:
        | "pending"
        | "preparing"
        | "ready"
        | "delivered"
        | "cancelled"
      order_status:
        | "pending"
        | "confirmed"
        | "preparing"
        | "ready"
        | "delivering"
        | "delivered"
        | "cancelled"
      order_type:
        | "beach"
        | "pool"
        | "dine_in"
        | "room_service"
        | "takeout"
        | "bar"
        | "delivery"
        | "pickup"
      payment_method: "card" | "apple_pay" | "google_pay" | "room_charge"
      payment_status: "pending" | "captured" | "refunded" | "failed" | "paid"
      pos_config_status: "active" | "inactive" | "error"
      pos_environment: "sandbox" | "production"
      pos_provider: "toast" | "omnivore" | "square"
      pos_sync_direction: "inbound" | "outbound"
      pos_sync_status: "started" | "success" | "failed"
      pos_sync_type: "menu" | "order" | "payment"
      property_type:
        | "hotel"
        | "resort"
        | "restaurant"
        | "bar"
        | "club"
        | "other"
      staff_role:
        | "owner"
        | "admin"
        | "manager"
        | "server"
        | "runner"
        | "kitchen"
      subscription_tier: "starter" | "professional" | "enterprise"
    }
    CompositeTypes: {
      geometry_dump: {
        path: number[] | null
        geom: unknown
      }
      valid_detail: {
        valid: boolean | null
        reason: string | null
        location: unknown
      }
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
      amenity_status: ["available", "occupied", "reserved", "maintenance"],
      amenity_type: [
        "pool",
        "lounger",
        "umbrella",
        "cabana",
        "bar",
        "restroom",
        "beach_zone",
        "walkway",
        "entrance",
        "building",
        "fire_pit",
        "tiki_bar",
        "palm_tree",
        "boardwalk",
      ],
      delivery_status: ["assigned", "picked_up", "en_route", "delivered"],
      document_type: [
        "contract",
        "menu",
        "floor_plan",
        "pos_credentials",
        "branding",
        "other",
      ],
      guest_location_type: [
        "table",
        "room",
        "beach",
        "pool",
        "bar",
        "lobby",
        "custom",
      ],
      location_type: [
        "beach",
        "pool",
        "restaurant",
        "room_service",
        "bar",
        "lobby",
      ],
      onboarding_stage: [
        "lead",
        "demo",
        "contract",
        "setup",
        "pos_integration",
        "training",
        "live",
        "churned",
      ],
      order_item_status: [
        "pending",
        "preparing",
        "ready",
        "delivered",
        "cancelled",
      ],
      order_status: [
        "pending",
        "confirmed",
        "preparing",
        "ready",
        "delivering",
        "delivered",
        "cancelled",
      ],
      order_type: [
        "beach",
        "pool",
        "dine_in",
        "room_service",
        "takeout",
        "bar",
        "delivery",
        "pickup",
      ],
      payment_method: ["card", "apple_pay", "google_pay", "room_charge"],
      payment_status: ["pending", "captured", "refunded", "failed", "paid"],
      pos_config_status: ["active", "inactive", "error"],
      pos_environment: ["sandbox", "production"],
      pos_provider: ["toast", "omnivore", "square"],
      pos_sync_direction: ["inbound", "outbound"],
      pos_sync_status: ["started", "success", "failed"],
      pos_sync_type: ["menu", "order", "payment"],
      property_type: ["hotel", "resort", "restaurant", "bar", "club", "other"],
      staff_role: ["owner", "admin", "manager", "server", "runner", "kitchen"],
      subscription_tier: ["starter", "professional", "enterprise"],
    },
  },
} as const
