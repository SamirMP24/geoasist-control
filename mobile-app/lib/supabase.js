import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mrwgrqteghlimrfpwwge.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yd2dycXRlZ2hsaW1yZnB3d2dlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3NTY1ODcsImV4cCI6MjA5NTMzMjU4N30.o-liQlMZ0uthX8RWSh4b6XIMTOCLLlJXOLZYxqeqCQY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);