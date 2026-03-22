import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import DeleteButton from '@/components/DeleteButton';
import EditButton from '@/components/EditButton';
import SaveChangesButton from '@/components/SaveChangesButton';
import { DatabaseNote, deleteNote, fetchNotes, updateNote } from '@/lib/notes';

export default function NoteDetailScreen() {
  const { id } = useLocalSearchParams();

  const [note, setNote] = useState<DatabaseNote | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    async function loadNote() {
      const noteId = Array.isArray(id) ? id[0] : id;

      if (!noteId) {
        setLoading(false);
        return;
      }

      const { data, error } = await fetchNotes();

      if (error || !data) {
        setNote(null);
        setLoading(false);
        return;
      }

      const foundNote = data.find((item) => item.id === noteId) ?? null;

      setNote(foundNote);
      setTitle(foundNote?.title ?? '');
      setContent(foundNote?.content ?? '');
      setLoading(false);
    }

    loadNote();
  }, [id]);

  async function handleSave() {
    if (!note) return;

    if (title.trim() === '' || content.trim() === '') {
      Alert.alert('Missing fields', 'Please fill in both fields.');
      return;
    }

    const { data, error } = await updateNote(note.id, title, content);

    if (error) {
      Alert.alert('Update failed', error.message);
      return;
    }

    Alert.alert('Success', 'Note updated.');
    setIsEditing(false);

    if (data) {
      setNote(data);
      setTitle(data.title);
      setContent(data.content);
    }
  }

  function handleDelete() {
    if (!note) return;

    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const { error } = await deleteNote(note.id);

            if (error) {
              Alert.alert('Delete failed', error.message);
              return;
            }

            Alert.alert('Deleted', 'Note has been deleted.');
            router.replace('/');
          },
        },
      ]
    );
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleString();
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading...</Text>
      </View>
    );
  }

  if (!note) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Note not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.contentWrapper}>
        {isEditing ? (
          <>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
            />

            <TextInput
              style={styles.textArea}
              value={content}
              onChangeText={setContent}
              multiline
              textAlignVertical="top"
            />

            <SaveChangesButton onPress={handleSave} />
          </>
        ) : (
          <>
            <Text style={styles.title}>{note.title}</Text>
            <Text style={styles.content}>{note.content}</Text>

            <View style={styles.metaBox}>
              <Text style={styles.metaText}>
                Created by: {note.creator_email ?? 'Unknown user'}
              </Text>
              <Text style={styles.metaText}>
                Last updated: {formatDate(note.updated_at)}
              </Text>
            </View>

            <EditButton onPress={() => setIsEditing(true)} />
          </>
        )}
      </View>

      {!isEditing && (
        <View style={styles.deleteWrapper}>
          <DeleteButton onPress={handleDelete} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  contentWrapper: {
    flex: 1,
  },
  deleteWrapper: {
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    color: '#000000',
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333333',
  },
  metaBox: {
    marginTop: 20,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
  },
  metaText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 12,
    padding: 12,
    minHeight: 150,
    marginBottom: 12,
  },
});