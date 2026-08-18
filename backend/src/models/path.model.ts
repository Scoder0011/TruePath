import { supabase } from '../config/supabase';

export async function getAllPaths() {
  const { data, error } = await supabase
    .from('paths')
    .select('*')
    .order('order_index', { ascending: true });

  if (error) throw error;
  return data;
}

export async function getPathBySlug(slug: string) {
  const { data, error } = await supabase
    .from('paths')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) throw error;
  return data;
}

export async function getPathWithFullTree(slug: string) {
  const { data, error } = await supabase
    .from('paths')
    .select(`
      *,
      specializations (
        *,
        stages (
          *,
          topics (
            *,
            resources (*)
          ),
          notes (*)
        )
      )
    `)
    .eq('slug', slug)
    .single();

  if (error) throw error;
  return data;
}