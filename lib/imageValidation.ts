import * as FileSystem from 'expo-file-system/legacy';
import * as ImagePicker from 'expo-image-picker';

const MAX_IMAGE_SIZE_BYTES = 15 * 1024 * 1024;

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];

export type ValidatedImage = {
  uri: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
};

function getExtensionFromUri(uri: string) {
  const cleanUri = uri.split('?')[0];
  const parts = cleanUri.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
}

function normalizeMimeType(
  asset: ImagePicker.ImagePickerAsset,
  uri: string
) {
  if (asset.mimeType && ALLOWED_MIME_TYPES.includes(asset.mimeType)) {
    return asset.mimeType;
  }

  const extension = getExtensionFromUri(uri);

  if (extension === 'jpg' || extension === 'jpeg') {
    return 'image/jpeg';
  }

  if (extension === 'png') {
    return 'image/png';
  }

  if (extension === 'webp') {
    return 'image/webp';
  }

  return '';
}

function normalizeFileName(
  asset: ImagePicker.ImagePickerAsset,
  uri: string,
  mimeType: string
) {
  if (asset.fileName && asset.fileName.trim() !== '') {
    return asset.fileName;
  }

  const extension = getExtensionFromUri(uri);

  if (extension) {
    return `image.${extension}`;
  }

  if (mimeType === 'image/jpeg') {
    return 'image.jpg';
  }

  if (mimeType === 'image/png') {
    return 'image.png';
  }

  if (mimeType === 'image/webp') {
    return 'image.webp';
  }

  return 'image';
}

export async function validatePickedImage(
  asset: ImagePicker.ImagePickerAsset
): Promise<{ data: ValidatedImage | null; error: string | null }> {
  const uri = asset.uri;

  if (!uri) {
    return { data: null, error: 'Could not read the selected image.' };
  }

  const mimeType = normalizeMimeType(asset, uri);
  const fileName = normalizeFileName(asset, uri, mimeType);
  const extension = getExtensionFromUri(fileName);

  if (!mimeType || !ALLOWED_EXTENSIONS.includes(extension)) {
    return {
      data: null,
      error: 'Invalid image format. Please use JPG, PNG, or WebP.',
    };
  }

  let fileSize = asset.fileSize ?? 0;

  if (!fileSize) {
    const fileInfo = await FileSystem.getInfoAsync(uri);

    if (!fileInfo.exists) {
      return { data: null, error: 'Could not access the selected image.' };
    }

    fileSize = fileInfo.size ?? 0;
  }

  if (!fileSize) {
    return {
      data: null,
      error: 'Could not determine the image file size.',
    };
  }

  if (fileSize > MAX_IMAGE_SIZE_BYTES) {
    return {
      data: null,
      error: 'Image is too large. Maximum allowed size is 15 MB.',
    };
  }

  return {
    data: {
      uri,
      fileName,
      mimeType,
      fileSize,
    },
    error: null,
  };
}