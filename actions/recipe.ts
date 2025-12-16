"use server";
 
import supabase, { getUser } from "@/supabase/client";
import OpenAI from 'openai';
 
export async function ask(formData: FormData) {
  const notion = formData.get("notion") ?? null;
 
  if (!notion) {
    return false;
  }
 
  const client = new OpenAI({apiKey: process.env.OPENAI_KEY!});
 
  const response = await client.responses.create({
    model: 'gpt-4o-mini',
    instructions: `Tu es un assistant qui explique les notions demandées par l'utilisateur`,
    input: `Explique de façon concise, claire et simple la notion suivante : ${notion}`,
  });
 
  if(!response.output_text) {
    console.error(response);
    return false;
  }
 
  const user = await getUser();
 
  if (!user) {
    return false;
  }
 
  const { error } = await (await supabase()).from('recipes').insert({
    question: notion as string,
    answer: response.output_text as string,
    user_id: user.id as string
  });
 
  if (error) {
    console.error(error);
    return false;
  }
 
  return response.output_text;
}