import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
} from 'react-native';

import { getSession } from '@/lib/auth';
import { createNote } from '@/lib/notes';

export default function NewNoteScreen() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

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

    const creatorEmail = session.user.email ?? 'Unknown user';

    const { error } = await createNote(
      title,
      content,
      session.user.id,
      creatorEmail
    );

    if (error) {
      Alert.alert('Save failed', error.message);
      return;
    }

    Alert.alert('Success', 'Note saved successfully.');
    router.back();
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Text style={styles.title}>New Note</Text>

      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter note title"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Content</Text>
      <TextInput
        style={styles.textArea}
        placeholder="Write your note here"
        multiline
        textAlignVertical="top"
        value={content}
        onChangeText={setContent}
      />

      <Pressable style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </Pressable>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
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
  saveButton: {
    marginTop: 20,
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});