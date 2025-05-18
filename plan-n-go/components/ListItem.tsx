import { View, Text, StyleSheet } from 'react-native';

type Props = {
  title: string;
  subTitle?: string;
};

export default function ListItem({ title, subTitle }: Props) {
  return (
    <View style={styles.item}>
      <Text style={styles.title}>{title}</Text>
      {subTitle && <Text style={styles.subTitle}>{subTitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
  subTitle: {
    fontSize: 14,
    color: '#888',
  },
});
