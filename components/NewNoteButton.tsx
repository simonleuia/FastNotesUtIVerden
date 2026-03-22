import { Pressable, StyleSheet, Text } from 'react-native';

type NewNoteButtonProps = {
  onPress: () => void;
};

export default function NewNoteButton({ onPress }: NewNoteButtonProps) {
  return (
    <Pressable style={styles.addButton} onPress={onPress}>
      <Text style={styles.addButtonText}>+ New Note</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});