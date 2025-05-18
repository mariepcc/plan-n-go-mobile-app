import { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { supabase } from "../../lib/supabase-client";

export default function CreateGroupScreen() {
  const router = useRouter();
  const { name: initialName } = useLocalSearchParams();
  const [groupName, setGroupName] = useState('');

  useEffect(() => {
    if (initialName) {
      setGroupName(initialName);
    }
  }, [initialName]);

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      Alert.alert('Error', 'Please enter a group name.');
      return;
    }

    const { data, error } = await supabase
      .from('groups')
      .insert({ name: groupName })
      .select()
      .single();

    if (error) {
      console.error(error);
      Alert.alert('Error', 'Could not create group.');
    } else {
      router.push(`/(app)/chats/${data.id}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create New Group</Text>
      <TextInput
        placeholder="Enter group name"
        style={styles.input}
        value={groupName}
        onChangeText={setGroupName}
      />
      <Button title="Create Group" onPress={handleCreateGroup} />
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
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 6,
    marginBottom: 20,
  },
});
