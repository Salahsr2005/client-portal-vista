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
      access_tokens: {
        Row: {
          created_at: string | null
          expires_at: string
          is_revoked: boolean | null
          token: string
          token_id: string
          user_id: string
          user_type: Database["public"]["Enums"]["user_type"]
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          is_revoked?: boolean | null
          token: string
          token_id?: string
          user_id: string
          user_type: Database["public"]["Enums"]["user_type"]
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          is_revoked?: boolean | null
          token?: string
          token_id?: string
          user_id?: string
          user_type?: Database["public"]["Enums"]["user_type"]
        }
        Relationships: []
      }
      admin_users: {
        Row: {
          admin_id: string
          created_at: string | null
          email: string
          first_name: string
          last_active: string | null
          last_name: string
          password_hash: string
          phone: string | null
          photo_url: string | null
          role_id: string | null
          status: string | null
          updated_at: string | null
          username: string
        }
        Insert: {
          admin_id?: string
          created_at?: string | null
          email: string
          first_name: string
          last_active?: string | null
          last_name: string
          password_hash: string
          phone?: string | null
          photo_url?: string | null
          role_id?: string | null
          status?: string | null
          updated_at?: string | null
          username: string
        }
        Update: {
          admin_id?: string
          created_at?: string | null
          email?: string
          first_name?: string
          last_active?: string | null
          last_name?: string
          password_hash?: string
          phone?: string | null
          photo_url?: string | null
          role_id?: string | null
          status?: string | null
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      application_documents: {
        Row: {
          application_id: string
          document_id: string
          file_path: string | null
          name: string
          status: string
          uploaded_at: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          application_id: string
          document_id?: string
          file_path?: string | null
          name: string
          status?: string
          uploaded_at: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          application_id?: string
          document_id?: string
          file_path?: string | null
          name?: string
          status?: string
          uploaded_at?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "application_documents_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["application_id"]
          },
          {
            foreignKeyName: "application_documents_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["admin_id"]
          },
        ]
      }
      application_timeline: {
        Row: {
          admin_id: string | null
          application_id: string
          date: string
          event_id: string
          note: string | null
          status: string
        }
        Insert: {
          admin_id?: string | null
          application_id: string
          date: string
          event_id?: string
          note?: string | null
          status: string
        }
        Update: {
          admin_id?: string | null
          application_id?: string
          date?: string
          event_id?: string
          note?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "application_timeline_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["admin_id"]
          },
          {
            foreignKeyName: "application_timeline_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["application_id"]
          },
        ]
      }
      applications: {
        Row: {
          application_id: string
          assigned_to: string | null
          client_id: string
          created_at: string | null
          notes: string | null
          payment_status: Database["public"]["Enums"]["payment_status"] | null
          priority: Database["public"]["Enums"]["priority_level"]
          program_id: string
          status: Database["public"]["Enums"]["application_status"]
          submitted_at: string | null
          updated_at: string | null
        }
        Insert: {
          application_id?: string
          assigned_to?: string | null
          client_id: string
          created_at?: string | null
          notes?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          priority?: Database["public"]["Enums"]["priority_level"]
          program_id: string
          status?: Database["public"]["Enums"]["application_status"]
          submitted_at?: string | null
          updated_at?: string | null
        }
        Update: {
          application_id?: string
          assigned_to?: string | null
          client_id?: string
          created_at?: string | null
          notes?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          priority?: Database["public"]["Enums"]["priority_level"]
          program_id?: string
          status?: Database["public"]["Enums"]["application_status"]
          submitted_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applications_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["admin_id"]
          },
          {
            foreignKeyName: "applications_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client_users"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "applications_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["program_id"]
          },
        ]
      }
      appointments: {
        Row: {
          admin_id: string
          application_id: string | null
          appointment_id: string
          client_id: string
          created_at: string | null
          date_time: string
          duration: number
          location: string
          mode: Database["public"]["Enums"]["appointment_mode"]
          notes: string | null
          service_id: string | null
          status: Database["public"]["Enums"]["appointment_status"]
          type: string
          updated_at: string | null
        }
        Insert: {
          admin_id: string
          application_id?: string | null
          appointment_id?: string
          client_id: string
          created_at?: string | null
          date_time: string
          duration: number
          location: string
          mode?: Database["public"]["Enums"]["appointment_mode"]
          notes?: string | null
          service_id?: string | null
          status?: Database["public"]["Enums"]["appointment_status"]
          type: string
          updated_at?: string | null
        }
        Update: {
          admin_id?: string
          application_id?: string | null
          appointment_id?: string
          client_id?: string
          created_at?: string | null
          date_time?: string
          duration?: number
          location?: string
          mode?: Database["public"]["Enums"]["appointment_mode"]
          notes?: string | null
          service_id?: string | null
          status?: Database["public"]["Enums"]["appointment_status"]
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["admin_id"]
          },
          {
            foreignKeyName: "appointments_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["application_id"]
          },
          {
            foreignKeyName: "appointments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client_users"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "appointments_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["service_id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          attachments: string | null
          chat_id: string
          created_at: string | null
          message: string
          message_id: string
          read: boolean | null
          sender_id: string
          sender_type: string
          timestamp: string | null
        }
        Insert: {
          attachments?: string | null
          chat_id: string
          created_at?: string | null
          message: string
          message_id?: string
          read?: boolean | null
          sender_id: string
          sender_type: string
          timestamp?: string | null
        }
        Update: {
          attachments?: string | null
          chat_id?: string
          created_at?: string | null
          message?: string
          message_id?: string
          read?: boolean | null
          sender_id?: string
          sender_type?: string
          timestamp?: string | null
        }
        Relationships: []
      }
      chats: {
        Row: {
          chat_id: string
          client_id: string
          client_name: string | null
          created_at: string | null
          last_message: string | null
          unread_count: number | null
          updated_at: string | null
        }
        Insert: {
          chat_id?: string
          client_id: string
          client_name?: string | null
          created_at?: string | null
          last_message?: string | null
          unread_count?: number | null
          updated_at?: string | null
        }
        Update: {
          chat_id?: string
          client_id?: string
          client_name?: string | null
          created_at?: string | null
          last_message?: string | null
          unread_count?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      client_documents: {
        Row: {
          client_id: string | null
          created_at: string | null
          document_id: string
          document_name: string
          document_type: string
          file_path: string
          notes: string | null
          status: string | null
          updated_at: string | null
          upload_date: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          document_id?: string
          document_name: string
          document_type: string
          file_path: string
          notes?: string | null
          status?: string | null
          updated_at?: string | null
          upload_date?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          document_id?: string
          document_name?: string
          document_type?: string
          file_path?: string
          notes?: string | null
          status?: string | null
          updated_at?: string | null
          upload_date?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_documents_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client_users"
            referencedColumns: ["client_id"]
          },
        ]
      }
      client_profiles: {
        Row: {
          additional_notes: string | null
          client_id: string | null
          created_at: string | null
          current_address: string | null
          education_background: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          language_proficiency: string | null
          passport_expiry_date: string | null
          passport_number: string | null
          profile_id: string
          updated_at: string | null
          work_experience: string | null
        }
        Insert: {
          additional_notes?: string | null
          client_id?: string | null
          created_at?: string | null
          current_address?: string | null
          education_background?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          language_proficiency?: string | null
          passport_expiry_date?: string | null
          passport_number?: string | null
          profile_id?: string
          updated_at?: string | null
          work_experience?: string | null
        }
        Update: {
          additional_notes?: string | null
          client_id?: string | null
          created_at?: string | null
          current_address?: string | null
          education_background?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          language_proficiency?: string | null
          passport_expiry_date?: string | null
          passport_number?: string | null
          profile_id?: string
          updated_at?: string | null
          work_experience?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_profiles_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client_users"
            referencedColumns: ["client_id"]
          },
        ]
      }
      client_users: {
        Row: {
          city: string | null
          client_id: string
          contact_preference:
            | Database["public"]["Enums"]["contact_preference"]
            | null
          country: string | null
          created_at: string | null
          date_of_birth: string | null
          email: string
          first_name: string | null
          identity_card_number: string | null
          last_login: string | null
          last_name: string | null
          nationality: string | null
          password_hash: string
          phone: string | null
          photo_url: string | null
          profile_status: string | null
          registration_type: string | null
          status: string | null
          updated_at: string | null
          username: string
        }
        Insert: {
          city?: string | null
          client_id?: string
          contact_preference?:
            | Database["public"]["Enums"]["contact_preference"]
            | null
          country?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email: string
          first_name?: string | null
          identity_card_number?: string | null
          last_login?: string | null
          last_name?: string | null
          nationality?: string | null
          password_hash: string
          phone?: string | null
          photo_url?: string | null
          profile_status?: string | null
          registration_type?: string | null
          status?: string | null
          updated_at?: string | null
          username: string
        }
        Update: {
          city?: string | null
          client_id?: string
          contact_preference?:
            | Database["public"]["Enums"]["contact_preference"]
            | null
          country?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string
          first_name?: string | null
          identity_card_number?: string | null
          last_login?: string | null
          last_name?: string | null
          nationality?: string | null
          password_hash?: string
          phone?: string | null
          photo_url?: string | null
          profile_status?: string | null
          registration_type?: string | null
          status?: string | null
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      destination_levels: {
        Row: {
          destination_id: string
          level: Database["public"]["Enums"]["program_level"]
        }
        Insert: {
          destination_id: string
          level: Database["public"]["Enums"]["program_level"]
        }
        Update: {
          destination_id?: string
          level?: Database["public"]["Enums"]["program_level"]
        }
        Relationships: [
          {
            foreignKeyName: "destination_levels_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "destinations"
            referencedColumns: ["destination_id"]
          },
        ]
      }
      destinations: {
        Row: {
          country: string
          created_at: string | null
          description: string | null
          destination_id: string
          fees: number
          image_url: string | null
          name: string
          processing_time: string | null
          region: string | null
          status: string | null
          success_rate: number | null
          updated_at: string | null
          visa_requirements: string | null
        }
        Insert: {
          country: string
          created_at?: string | null
          description?: string | null
          destination_id?: string
          fees: number
          image_url?: string | null
          name: string
          processing_time?: string | null
          region?: string | null
          status?: string | null
          success_rate?: number | null
          updated_at?: string | null
          visa_requirements?: string | null
        }
        Update: {
          country?: string
          created_at?: string | null
          description?: string | null
          destination_id?: string
          fees?: number
          image_url?: string | null
          name?: string
          processing_time?: string | null
          region?: string | null
          status?: string | null
          success_rate?: number | null
          updated_at?: string | null
          visa_requirements?: string | null
        }
        Relationships: []
      }
      message_attachments: {
        Row: {
          attachment_id: string
          created_at: string | null
          message_id: string
          name: string
          url: string
        }
        Insert: {
          attachment_id?: string
          created_at?: string | null
          message_id: string
          name: string
          url: string
        }
        Update: {
          attachment_id?: string
          created_at?: string | null
          message_id?: string
          name?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_attachments_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["message_id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          message_id: string
          read_status: boolean
          recipient_id: string
          recipient_type: Database["public"]["Enums"]["user_type"]
          sender_id: string
          sender_type: Database["public"]["Enums"]["user_type"]
          sent_date: string
          status: string
          subject: string | null
          type: Database["public"]["Enums"]["message_type"]
        }
        Insert: {
          content: string
          created_at?: string | null
          message_id?: string
          read_status?: boolean
          recipient_id: string
          recipient_type: Database["public"]["Enums"]["user_type"]
          sender_id: string
          sender_type: Database["public"]["Enums"]["user_type"]
          sent_date: string
          status?: string
          subject?: string | null
          type?: Database["public"]["Enums"]["message_type"]
        }
        Update: {
          content?: string
          created_at?: string | null
          message_id?: string
          read_status?: boolean
          recipient_id?: string
          recipient_type?: Database["public"]["Enums"]["user_type"]
          sender_id?: string
          sender_type?: Database["public"]["Enums"]["user_type"]
          sent_date?: string
          status?: string
          subject?: string | null
          type?: Database["public"]["Enums"]["message_type"]
        }
        Relationships: []
      }
      notification_delivery_stats: {
        Row: {
          delivered: number
          failed: number
          notification_id: string
          read: number
        }
        Insert: {
          delivered?: number
          failed?: number
          notification_id: string
          read?: number
        }
        Update: {
          delivered?: number
          failed?: number
          notification_id?: string
          read?: number
        }
        Relationships: [
          {
            foreignKeyName: "notification_delivery_stats_notification_id_fkey"
            columns: ["notification_id"]
            isOneToOne: true
            referencedRelation: "notifications"
            referencedColumns: ["notification_id"]
          },
        ]
      }
      notification_recipients: {
        Row: {
          delivered_at: string | null
          is_read: boolean
          notification_id: string
          recipient_id: string
          recipient_type: Database["public"]["Enums"]["user_type"]
        }
        Insert: {
          delivered_at?: string | null
          is_read?: boolean
          notification_id: string
          recipient_id: string
          recipient_type: Database["public"]["Enums"]["user_type"]
        }
        Update: {
          delivered_at?: string | null
          is_read?: boolean
          notification_id?: string
          recipient_id?: string
          recipient_type?: Database["public"]["Enums"]["user_type"]
        }
        Relationships: [
          {
            foreignKeyName: "notification_recipients_notification_id_fkey"
            columns: ["notification_id"]
            isOneToOne: false
            referencedRelation: "notifications"
            referencedColumns: ["notification_id"]
          },
        ]
      }
      notifications: {
        Row: {
          content: string
          created_at: string | null
          notification_id: string
          recipient_count: number
          status: string
          title: string
          type: Database["public"]["Enums"]["notification_type"]
        }
        Insert: {
          content: string
          created_at?: string | null
          notification_id?: string
          recipient_count?: number
          status?: string
          title: string
          type: Database["public"]["Enums"]["notification_type"]
        }
        Update: {
          content?: string
          created_at?: string | null
          notification_id?: string
          recipient_count?: number
          status?: string
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          application_id: string
          client_id: string
          created_at: string | null
          created_by: string | null
          date: string
          description: string | null
          method: string
          notes: string | null
          payment_id: string
          reference: string
          status: Database["public"]["Enums"]["payment_status"]
          transaction_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          application_id: string
          client_id: string
          created_at?: string | null
          created_by?: string | null
          date: string
          description?: string | null
          method: string
          notes?: string | null
          payment_id?: string
          reference: string
          status?: Database["public"]["Enums"]["payment_status"]
          transaction_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          application_id?: string
          client_id?: string
          created_at?: string | null
          created_by?: string | null
          date?: string
          description?: string | null
          method?: string
          notes?: string | null
          payment_id?: string
          reference?: string
          status?: Database["public"]["Enums"]["payment_status"]
          transaction_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["application_id"]
          },
          {
            foreignKeyName: "payments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client_users"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "payments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["admin_id"]
          },
        ]
      }
      permissions: {
        Row: {
          created_at: string | null
          description: string | null
          name: string
          permission_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          name: string
          permission_id?: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          name?: string
          permission_id?: string
        }
        Relationships: []
      }
      program_additional_dates: {
        Row: {
          date: string
          program_id: string
        }
        Insert: {
          date: string
          program_id: string
        }
        Update: {
          date?: string
          program_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "program_additional_dates_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["program_id"]
          },
        ]
      }
      program_bulk_discounts: {
        Row: {
          discount_percentage: number
          min_applications: number
          program_id: string
        }
        Insert: {
          discount_percentage: number
          min_applications: number
          program_id: string
        }
        Update: {
          discount_percentage?: number
          min_applications?: number
          program_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "program_bulk_discounts_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: true
            referencedRelation: "programs"
            referencedColumns: ["program_id"]
          },
        ]
      }
      program_documents: {
        Row: {
          description: string | null
          id: number
          name: string
          program_id: string
          required: boolean
        }
        Insert: {
          description?: string | null
          id?: number
          name: string
          program_id: string
          required?: boolean
        }
        Update: {
          description?: string | null
          id?: number
          name?: string
          program_id?: string
          required?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "program_documents_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["program_id"]
          },
        ]
      }
      program_early_bird_discounts: {
        Row: {
          amount: number
          end_date: string
          program_id: string
        }
        Insert: {
          amount: number
          end_date: string
          program_id: string
        }
        Update: {
          amount?: number
          end_date?: string
          program_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "program_early_bird_discounts_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: true
            referencedRelation: "programs"
            referencedColumns: ["program_id"]
          },
        ]
      }
      program_tiered_fees: {
        Row: {
          amount: number
          id: number
          program_id: string
          threshold: number
        }
        Insert: {
          amount: number
          id?: number
          program_id: string
          threshold: number
        }
        Update: {
          amount?: number
          id?: number
          program_id?: string
          threshold?: number
        }
        Relationships: [
          {
            foreignKeyName: "program_tiered_fees_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["program_id"]
          },
        ]
      }
      programs: {
        Row: {
          admission_type: string
          agency_fee_amount: number
          agency_fee_percentage: number | null
          agency_fee_type: Database["public"]["Enums"]["fee_type"]
          agency_services: string | null
          available_places: number
          created_at: string | null
          deadline: string | null
          destination_id: string
          eligibility_criteria: string | null
          level: Database["public"]["Enums"]["program_level"]
          name: string
          processing_time: string | null
          program_id: string
          requirements: string | null
          service_id: string
          service_tuition: number
          start_date: string
          status: Database["public"]["Enums"]["program_status"]
          success_rate: number | null
          total_places: number
          tuition: number
          tuition_max: number
          tuition_min: number
          university: string
          updated_at: string | null
          waitlist_count: number | null
          waitlist_enabled: boolean
        }
        Insert: {
          admission_type: string
          agency_fee_amount: number
          agency_fee_percentage?: number | null
          agency_fee_type: Database["public"]["Enums"]["fee_type"]
          agency_services?: string | null
          available_places: number
          created_at?: string | null
          deadline?: string | null
          destination_id: string
          eligibility_criteria?: string | null
          level: Database["public"]["Enums"]["program_level"]
          name: string
          processing_time?: string | null
          program_id?: string
          requirements?: string | null
          service_id: string
          service_tuition: number
          start_date: string
          status?: Database["public"]["Enums"]["program_status"]
          success_rate?: number | null
          total_places: number
          tuition: number
          tuition_max: number
          tuition_min: number
          university: string
          updated_at?: string | null
          waitlist_count?: number | null
          waitlist_enabled?: boolean
        }
        Update: {
          admission_type?: string
          agency_fee_amount?: number
          agency_fee_percentage?: number | null
          agency_fee_type?: Database["public"]["Enums"]["fee_type"]
          agency_services?: string | null
          available_places?: number
          created_at?: string | null
          deadline?: string | null
          destination_id?: string
          eligibility_criteria?: string | null
          level?: Database["public"]["Enums"]["program_level"]
          name?: string
          processing_time?: string | null
          program_id?: string
          requirements?: string | null
          service_id?: string
          service_tuition?: number
          start_date?: string
          status?: Database["public"]["Enums"]["program_status"]
          success_rate?: number | null
          total_places?: number
          tuition?: number
          tuition_max?: number
          tuition_min?: number
          university?: string
          updated_at?: string | null
          waitlist_count?: number | null
          waitlist_enabled?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "programs_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "destinations"
            referencedColumns: ["destination_id"]
          },
          {
            foreignKeyName: "programs_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["service_id"]
          },
        ]
      }
      reports: {
        Row: {
          created_at: string | null
          created_by: string
          date_range_end: string
          date_range_start: string
          file_path: string | null
          report_id: string
          title: string
          type: string
        }
        Insert: {
          created_at?: string | null
          created_by: string
          date_range_end: string
          date_range_start: string
          file_path?: string | null
          report_id?: string
          title: string
          type: string
        }
        Update: {
          created_at?: string | null
          created_by?: string
          date_range_end?: string
          date_range_start?: string
          file_path?: string | null
          report_id?: string
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["admin_id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          permission_id: string
          role_id: string
        }
        Insert: {
          permission_id: string
          role_id: string
        }
        Update: {
          permission_id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["permission_id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["role_id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string | null
          description: string | null
          name: string
          role_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          name: string
          role_id?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          name?: string
          role_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      services: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          duration: number
          estimated_completion: string | null
          name: string
          price: number
          service_id: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          duration: number
          estimated_completion?: string | null
          name: string
          price: number
          service_id?: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          duration?: number
          estimated_completion?: string | null
          name?: string
          price?: number
          service_id?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      settings: {
        Row: {
          category: string
          description: string | null
          key: string
          setting_id: string
          updated_at: string | null
          updated_by: string | null
          value: string | null
        }
        Insert: {
          category: string
          description?: string | null
          key: string
          setting_id?: string
          updated_at?: string | null
          updated_by?: string | null
          value?: string | null
        }
        Update: {
          category?: string
          description?: string | null
          key?: string
          setting_id?: string
          updated_at?: string | null
          updated_by?: string | null
          value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "settings_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["admin_id"]
          },
        ]
      }
      user_activity_log: {
        Row: {
          activity_description: string | null
          activity_type: string
          ip_address: string | null
          log_id: string
          timestamp: string | null
          user_id: string
          user_type: Database["public"]["Enums"]["user_type"]
        }
        Insert: {
          activity_description?: string | null
          activity_type: string
          ip_address?: string | null
          log_id?: string
          timestamp?: string | null
          user_id: string
          user_type: Database["public"]["Enums"]["user_type"]
        }
        Update: {
          activity_description?: string | null
          activity_type?: string
          ip_address?: string | null
          log_id?: string
          timestamp?: string | null
          user_id?: string
          user_type?: Database["public"]["Enums"]["user_type"]
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
      application_status:
        | "Draft"
        | "Submitted"
        | "In Review"
        | "Pending Documents"
        | "Approved"
        | "Rejected"
        | "Completed"
        | "Cancelled"
      appointment_mode: "In-Person" | "Online" | "Phone"
      appointment_status: "Scheduled" | "Completed" | "Cancelled" | "No-Show"
      contact_preference: "Email" | "Phone" | "Both"
      fee_type: "Fixed" | "Percentage" | "Tiered"
      message_type: "Email" | "SMS" | "System" | "Chat"
      notification_type:
        | "System"
        | "Application"
        | "Payment"
        | "Appointment"
        | "Document"
      payment_status:
        | "Pending"
        | "Partial"
        | "Completed"
        | "Failed"
        | "Refunded"
      priority_level: "Low" | "Medium" | "High" | "Urgent"
      program_level:
        | "Undergraduate"
        | "Graduate"
        | "PhD"
        | "Certificate"
        | "Diploma"
      program_status: "Active" | "Inactive" | "Full" | "Coming Soon"
      user_type: "Admin" | "Client"
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
