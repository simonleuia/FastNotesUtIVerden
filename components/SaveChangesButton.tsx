import { Pressable, StyleSheet, Text } from 'react-native';

type SaveChangesButtonProps = {
  onPress: () => void;
};

export default function SaveChangesButton({ onPress }: SaveChangesButtonProps) {
  return (
    <Pressable style={styles.saveButton} onPress={onPress}>
      <Text style={styles.saveButtonText}>Save Changes</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  saveButton: {
    backgroundColor: '#16a34a',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});