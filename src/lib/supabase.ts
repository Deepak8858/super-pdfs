import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ozcgtjtxijrxahohnzrp.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96Y2d0anR4aWpyeGFob2huenJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM1NTExMDEsImV4cCI6MjA2OTEyNzEwMX0.JT6N7J_4F4DYcAFVW_qi9ZtUPdr4llVxckxHOJiIdwE'

export const supabase = createClient(supabaseUrl, supabaseKey)
