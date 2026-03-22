import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import ImageActionButton from '@/components/ImageActionButton';
import RemoveImageButton from '@/components/RemoveImageButton';
import { getSession } from '@/lib/auth';
import { validatePickedImage, ValidatedImage } from '@/lib/imageValidation';
import { createNote } from '@/lib/notes';
import { sendLocalNewNoteNotification } from '@/lib/notifications';
import { uploadNoteImage } from '@/lib/storage';

export default function NewNoteScreen() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<ValidatedImage | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSelectedAsset(asset: ImagePicker.ImagePickerAsset) {
    const { data, error } = await validatePickedImage(asset);

    if (error) {
      setSelectedImage(null);
      Alert.alert('Invalid image', error);
      return;
    }

    setSelectedImage(data);
  }

  async function pickImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permission needed', 'We need access to your gallery.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
    });

    if (!result.canceled) {
      await handleSelectedAsset(result.assets[0]);
    }
  }

  async function takePhoto() {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permission needed', 'We need access to your camera.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 1,
    });

    if (!result.canceled) {
      await handleSelectedAsset(result.assets[0]);
    }
  }

  function handleRemoveImage() {
    setSelectedImage(null);
  }

  async function handleSave() {
    if (title.trim() === '' || content.trim() === '') {
      Alert.alert('Missing fields', 'Please enter both title and content.');
      return;
    }

    const session = await getSession();

    if (!session?.user) {
      Alert.alert('Not logged in', 'Please log in again.');
      router.replace('/login');
      return;
    }

    setIsSaving(true);

    try {
      const creatorEmail = session.user.email ?? 'Unknown user';
      let imageUrl: string | null = null;
      let imagePath: string | null = null;

      if (selectedImage) {
        const {
          publicUrl,
          filePath,
          error: uploadError,
        } = await uploadNoteImage(selectedImage, session.user.id);

        if (uploadError) {
          Alert.alert('Upload failed', uploadError.message);
          return;
        }

        imageUrl = publicUrl;
        imagePath = filePath;
      }

      const { error } = await createNote(
        title,
        content,
        session.user.id,
        creatorEmail,
        imageUrl,
        imagePath
      );

      if (error) {
        Alert.alert('Save failed', error.message);
        return;
      }

      await sendLocalNewNoteNotification(title.trim());

      Alert.alert('Success', 'Note saved successfully.');
      router.back();
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>New Note</Text>

        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter note title"
          value={title}
          onChangeText={setTitle}
          editable={!isSaving}
        />

        <Text style={styles.label}>Content</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Write your note here"
          multiline
          textAlignVertical="top"
          value={content}
          onChangeText={setContent}
          editable={!isSaving}
        />

        <Text style={styles.label}>Image</Text>

        <View style={styles.imageButtons}>
          <ImageActionButton title="Pick Image" onPress={pickImage} />
          <ImageActionButton title="Take Photo" onPress={takePhoto} />
        </View>

        {selectedImage ? (
          <View style={styles.previewWrapper}>
            <View style={styles.imageWrapper}>
              <Image
                source={{ uri: selectedImage.uri }}
                style={styles.preview}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.imageInfo}>
              {selectedImage.fileName} ({(selectedImage.fileSize / (1024 * 1024)).toFixed(2)} MB)
            </Text>

            <RemoveImageButton onPress={handleRemoveImage} />
          </View>
        ) : (
          <View style={styles.noImageBox}>
            <Text style={styles.noImageText}>No image selected</Text>
          </View>
        )}

        {isSaving && (
          <View style={styles.loadingWrapper}>
            <ActivityIndicator size="large" />
            <Text style={styles.loadingText}>Saving note and uploading image...</Text>
          </View>
        )}

        <Pressable
          style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={isSaving}>
          <Text style={styles.saveButtonText}>
            {isSaving ? 'Saving...' : 'Save'}
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 20,
    color: '#000000',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 10,
    color: '#000000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    minHeight: 180,
    backgroundColor: '#ffffff',
  },
  imageButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  previewWrapper: {
    marginTop: 15,
  },
  imageWrapper: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  preview: {
    width: '100%',
    height: '100%',
  },
  imageInfo: {
    marginTop: 8,
    fontSize: 14,
    color: '#374151',
  },
  noImageBox: {
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 24,
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  noImageText: {
    fontSize: 14,
    color: '#6b7280',
  },
  loadingWrapper: {
    marginTop: 16,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: '#374151',
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});