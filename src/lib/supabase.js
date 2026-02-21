import { createClient } from '@supabase/supabase-js'

const isPublic = window.location.hostname.endsWith('.ts.net')
const supabaseUrl = isPublic
  ? 'https://raspberrypi.tailfe9ba0.ts.net/supabase'
  : (import.meta.env.VITE_SUPABASE_URL || 'http://192.168.1.14:54321')
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseKey)
