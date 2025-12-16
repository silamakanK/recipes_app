"use server";
 
import { getSession } from '@/utils/sessions';
import { createClient } from '@supabase/supabase-js'
 
export default async function supabase(){
  const accessToken = await getSession();
  const client = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_KEY!,
      accessToken
        ? { global: { headers: { Authorization: `Bearer ${accessToken}` } } }
        : undefined
  );

  console.log("SUPABASE_URL =", process.env.SUPABASE_URL);
  console.log("HAS ANON KEY =", process.env.SUPABASE_KEY);

  return client;
}
 
export async function getUser() {
  const { data, error } = await (await supabase()).auth.getUser();
 
  if (error) {
      console.error(error);
      return false;
  }
 
  return data.user;
}