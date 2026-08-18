import { supabase } from '../config/supabase';

export async function getSpecializationWithFullTree(pathSlug: string, specSlug: string) {
  const { data, error } = await supabase
    .from('specializations')
    .select(`
      *,
      stages (
        *,
        topics (
          *,
          resources (*)
        ),
        notes (*)
      )
    `)
    .eq('slug', specSlug)
    .single();

  if (error) throw error;
  return data;
}

export async function getSpecializationsByPath(pathSlug: string) {
  const { data: path, error: pathError } = await supabase
    .from('paths')
    .select('id')
    .eq('slug', pathSlug)
    .single();

  if (pathError) throw pathError;

  const { data, error } = await supabase
    .from('specializations')
    .select('*')
    .eq('path_id', path.id)
    .order('order_index', { ascending: true });

  if (error) throw error;
  return data;
}