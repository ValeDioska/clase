import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export async function registrarUsuario(nombre, correo) {

  const { data, error } = await supabase
    .from("registros")
    .insert([{ nombre, correo }]);

  if (error) throw error;

  return data;
}