// /assets/js/config.js

// IMPORTANTE: Esta chave 'anon' é segura para ser exposta no lado do cliente (navegador).
// A segurança real é garantida pelas Políticas de Row Level Security (RLS) no seu painel do Supabase.
// Certifique-se de que o RLS está ATIVADO para suas tabelas sensíveis.

const SUPABASE_URL = 'https://fkyxxdcpgadztqgfxewz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZreXh4Y2RwZ2FkenRxZ2Z4ZXd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2ODU5MTksImV4cCI6MjA3MDI2MTkxOX0.-jEi7L_nOxC5PvEztkVMb_T4ksjpDC_rKKAp76-7AC0';

// A variável `supabase` agora está disponível globalmente para outros scripts que forem carregados depois deste.
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);