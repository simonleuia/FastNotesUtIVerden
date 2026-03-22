import { Pressable, StyleSheet, Text } from 'react-native';

type EditButtonProps = {
  onPress: () => void;
};

export default function EditButton({ onPress }: EditButtonProps) {
  return (
    <Pressable style={styles.editButton} onPress={onPress}>
      <Text style={styles.editButtonText}>Edit</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  editButton: {
    marginTop: 20,
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});