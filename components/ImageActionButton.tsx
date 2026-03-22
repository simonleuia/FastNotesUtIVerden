import { Pressable, StyleSheet, Text } from 'react-native';

type ImageActionButtonProps = {
  title: string;
  onPress: () => void;
};

export default function ImageActionButton({
  title,
  onPress,
}: ImageActionButtonProps) {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    backgroundColor: '#10b981',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});