import { Text, View, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function GroupInfoScreen() {
  const { group_id } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Group Info</Text>
      <Text style={styles.subtitle}>Group ID: {group_id}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 48,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});
