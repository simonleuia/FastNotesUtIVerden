import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import LogoutButton from '@/components/LogoutButton';
import NewNoteButton from '@/components/NewNoteButton';
import { getSession, signOut } from '@/lib/auth';
import { DatabaseNote, fetchNotes } from '@/lib/notes';

const PAGE_SIZE = 5;

export default function HomeScreen() {
  const [notes, setNotes] = useState<DatabaseNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadInitialData = useCallback(async () => {
    setLoading(true);

    const session = await getSession();

    if (!session) {
      router.replace('/login');
      return;
    }

    const { data, error } = await fetchNotes(0, PAGE_SIZE);

    if (error) {
      setNotes([]);
      setHasMore(false);
    } else {
      const fetchedNotes = data ?? [];
      setNotes(fetchedNotes);
      setHasMore(fetchedNotes.length === PAGE_SIZE);
    }

    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadInitialData();
    }, [loadInitialData])
  );

  async function handleLoadMore() {
    if (loadingMore || !hasMore) {
      return;
    }

    setLoadingMore(true);

    const { data, error } = await fetchNotes(notes.length, PAGE_SIZE);

    if (!error && data) {
      setNotes((prev) => [...prev, ...data]);
      setHasMore(data.length === PAGE_SIZE);
    }

    if (error || !data) {
      setHasMore(false);
    }

    setLoadingMore(false);
  }

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
              <View style={styles.noteRow}>
                <View style={styles.textContent}>
                  <Text style={styles.noteTitle}>{item.title}</Text>
                  <Text style={styles.notePreview}>
                    {item.content ? item.content.slice(0, 70) : 'No content'}
                  </Text>
                </View>

                {item.image_url && (
                  <Image
                    source={{ uri: item.image_url }}
                    style={styles.noteImage}
                    resizeMode="cover"
                  />
                )}
              </View>
            </Pressable>
          )}
          ListFooterComponent={
            hasMore ? (
              <Pressable
                style={styles.loadMoreButton}
                onPress={handleLoadMore}
                disabled={loadingMore}>
                <Text style={styles.loadMoreButtonText}>
                  {loadingMore ? 'Loading...' : 'Load more'}
                </Text>
              </Pressable>
            ) : null
          }
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
  noteRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContent: {
    flex: 1,
    paddingRight: 12,
  },
  noteImage: {
    width: 72,
    height: 72,
    borderRadius: 10,
    backgroundColor: '#f3f4f6',
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
  loadMoreButton: {
    marginTop: 8,
    marginBottom: 24,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: '#000000',
    alignItems: 'center',
  },
  loadMoreButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
});