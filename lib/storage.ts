import * as FileSystem from 'expo-file-system/legacy';
import { decode } from 'base64-arraybuffer';

import { ValidatedImage } from './imageValidation';
import { supabase } from './supabase';

const BUCKET_NAME = 'note-images';

function getFileExtension(fileName: string) {
  const parts = fileName.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : 'jpg';
}

function createUniqueFilePath(userId: string, fileName: string) {
  const extension = getFileExtension(fileName);
  const timestamp = Date.now();
  const randomPart = Math.random().toString(36).slice(2, 10);
  return `${userId}/${timestamp}-${randomPart}.${extension}`;
}

export async function uploadNoteImage(
  image: ValidatedImage,
  userId: string
): Promise<{ publicUrl: string | null; filePath: string | null; error: Error | null }> {
  try {
    const base64 = await FileSystem.readAsStringAsync(image.uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const arrayBuffer = decode(base64);
    const filePath = createUniqueFilePath(userId, image.fileName);

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, arrayBuffer, {
        contentType: image.mimeType,
        upsert: false,
      });

    if (uploadError) {
      return { publicUrl: null, filePath: null, error: uploadError };
    }

    const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);

    return { publicUrl: data.publicUrl, filePath, error: null };
  } catch (error) {
    const uploadError =
      error instanceof Error ? error : new Error('Image upload failed.');

    return { publicUrl: null, filePath: null, error: uploadError };
  }
}

export async function deleteNoteImageByPath(
  filePath: string
): Promise<{ error: Error | null }> {
  try {
    const cleanPath = filePath.trim();

    if (!cleanPath) {
      return { error: new Error('Could not determine image path.') };
    }

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([cleanPath]);

    if (error) {
      return { error };
    }

    return { error: null };
  } catch (error) {
    const deleteError =
      error instanceof Error ? error : new Error('Image delete failed.');

    return { error: deleteError };
  }
}