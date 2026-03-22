import { supabase } from './supabase';

export type DatabaseNote = {
  id: string;
  title: string;
  content: string;
  user_id: string;
  creator_email: string | null;
  image_url: string | null;
  image_path: string | null;
  updated_at: string;
};

export async function fetchNotes() {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .order('updated_at', { ascending: false });

  return { data, error };
}

export async function createNote(
  title: string,
  content: string,
  userId: string,
  creatorEmail: string,
  imageUrl?: string | null,
  imagePath?: string | null
) {
  const { data, error } = await supabase
    .from('notes')
    .insert([
      {
        title: title.trim(),
        content: content.trim(),
        user_id: userId,
        creator_email: creatorEmail,
        image_url: imageUrl ?? null,
        image_path: imagePath ?? null,
      },
    ])
    .select()
    .single();

  return { data, error };
}

export async function updateNote(id: string, title: string, content: string) {
  const { data, error } = await supabase
    .from('notes')
    .update({
      title: title.trim(),
      content: content.trim(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  return { data, error };
}

export async function deleteNote(id: string) {
  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', id);

  return { error };
}