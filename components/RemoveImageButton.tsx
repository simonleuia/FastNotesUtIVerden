import { Pressable, StyleSheet, Text } from 'react-native';

type RemoveImageButtonProps = {
  onPress: () => void;
};

export default function RemoveImageButton({
  onPress,
}: RemoveImageButtonProps) {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>Remove Image</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 10,
    backgroundColor: '#dc2626',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});