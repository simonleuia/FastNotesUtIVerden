import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import LogoutButton from '@/components/LogoutButton';
import NewNoteButton from '@/components/NewNoteButton';
import { getSession, signOut } from '@/lib/auth';
import { DatabaseNote, fetchNotes } from '@/lib/notes';

export default function HomeScreen() {
  const [notes, setNotes] = useState<DatabaseNote[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      async function loadData() {
        const session = await getSession();

        if (!session) {
          router.replace('/login');
          return;
        }

        const { data, error } = await fetchNotes();

        if (error) {
          setNotes([]);
        } else {
          setNotes(data ?? []);
        }

        setLoading(false);
      }

      loadData();
    }, [])
  );

  async function handleLogout() {
    const { error } = await signOut();

    if (error) {
      Alert.alert('Logout failed', error.message);
      return;
    }

    Alert.alert('Success', 'You have been logged out.');
    router.replace('/login');
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Jobb Notater</Text>
        <LogoutButton onPress={handleLogout} />
      </View>

      {loading ? (
        <Text style={styles.subtitle}>Loading notes...</Text>
      ) : notes.length === 0 ? (
        <Text style={styles.subtitle}>No notes yet</Text>
      ) : (
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <Pressable
              style={styles.noteCard}
              onPress={() =>
                router.push({
                  pathname: '/note-detail',
                  params: { id: item.id },
                })
              }>
              <Text style={styles.noteTitle}>{item.title}</Text>
              <Text style={styles.notePreview}>
                {item.content ? item.content.slice(0, 50) : 'No content'}
              </Text>
            </Pressable>
          )}
        />
      )}

      <NewNoteButton onPress={() => router.push('/new-note')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
  },
  headerRow: {
    marginTop: 20,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
  },
  listContent: {
    paddingBottom: 100,
  },
  noteCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#eeeeee',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  notePreview: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
});