import React, { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { supabase } from '../app/lib/supabase-client';

export function MemberSelector({
  selectedContacts,
  setSelectedContacts,
  userId,
}: {
  selectedContacts: Set<string>;
  setSelectedContacts: React.Dispatch<React.SetStateAction<Set<string>>>;
  userId: string;
}) {
  const [search, setSearch] = useState('');
  const [contacts, setContacts] = useState<any[]>([]);

  useEffect(() => {
    const loadContacts = async () => {
      const { data, error } = await supabase
        .from('contacts')
        .select(
          `
          profile_id,
          profiles!contacts_profile_id_fkey (
            id,
            username
          )
        `
        )
        .eq('owner_id', userId)
        .order('created_at', { ascending: false });


      if (error) {
        console.error('Error fetching contacts:', error);
      } else {
        setContacts(data ?? []);

      }
    };

    if (userId) loadContacts();
  }, [userId]);

  const handleContactSelection = (contactId: string) => {
    setSelectedContacts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(contactId)) {
        newSet.delete(contactId);
      } else {
        newSet.add(contactId);
      }
      console.log("do dodania: ", selectedContacts)

      return newSet;
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <TextInput
          style={styles.input}
          placeholder="Search..."
          value={search}
          onChangeText={(text) => setSearch(text)}
        />
      </View>

      <FlatList
        data={contacts.filter((c) =>
          c.profiles.username.toLowerCase().includes(search.toLowerCase())
        )}
        keyExtractor={(item) => item.profile_id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => handleContactSelection(item.profile_id)}
          >
            <View style={styles.iconLeft}>
              <FontAwesome name="user" size={20} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.name}>@{item.profiles.username}</Text>
            </View>
            <View style={styles.iconRight}>
              {selectedContacts.has(item.profile_id) ? (
                <FontAwesome name="check-circle" size={20} color="#007AFF" />
              ) : (
                <FontAwesome name="circle-thin" size={20} />
              )}
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: 12,
  },
  searchRow: {
    flexDirection: 'row',
    marginHorizontal: 12,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  iconLeft: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
  },
  iconRight: {
    marginLeft: 12,
  },
});