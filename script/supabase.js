
import { createClient } from
    "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

// Credenciais do seu projeto
const SUPABASE_URL = "SUA_PROJECT_URL";
const SUPABASE_KEY = "SUA_PUBLISHABLE_KEY";

// Cria a conexão
export const supabase = createClient(
    "https://qjbcrxfpiavqysasjuzz.supabase.co",
    "sb_publishable_IGcpfpbMTFklieTFWTjLoQ_IqmiRaVh"
);