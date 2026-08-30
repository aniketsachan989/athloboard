package com.athloboard.app.data.supabase

/**
 * Supabase Backend Connection Configuration for Athloboard
 * Project Reference: xonuqhgxiswmwllqnpdx
 * Database: PostgreSQL 15 (Supabase Cloud)
 */
object SupabaseConfig {
    const val SUPABASE_URL = "https://xonuqhgxiswmwllqnpdx.supabase.co"
    const val REST_BASE_URL = "$SUPABASE_URL/rest/v1"
    
    // Default public anon key token for Athloboard REST client operations
    const val SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvbnVxaGd4aXN3bXdsbHFucGR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQ3NzIwMDAsImV4cCI6MjA0MDM0ODAwMH0.supabase_public_anon_token_athloboard"

    const val HEADER_API_KEY = "apikey"
    const val HEADER_AUTH = "Authorization"
    const val HEADER_PREFER = "Prefer"
    const val PREFER_RETURN_REPRESENTATION = "return=representation"
}
