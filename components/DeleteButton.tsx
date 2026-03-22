import { Pressable, StyleSheet, Text } from 'react-native';

type DeleteButtonProps = {
  onPress: () => void;
};

export default function DeleteButton({ onPress }: DeleteButtonProps) {
  return (
    <Pressable style={styles.deleteButton} onPress={onPress}>
      <Text style={styles.deleteButtonText}>Delete</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  deleteButton: {
    marginTop: 20,
    backgroundColor: '#dc2626',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});