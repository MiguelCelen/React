import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
} from "react-native";

export default function BlogDetailsScreen({ route }) {

  const { blog } = route.params;

  return (
    <ScrollView style={styles.container}>

      {blog.image ? (
        <Image
          source={{ uri: blog.image }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.placeholderIcon}>📰</Text>
        </View>
      )}

      <View style={styles.content}>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>{blog.category}</Text>
        </View>

        <Text style={styles.title}>{blog.title}</Text>

        <Text style={styles.description}>{blog.description}</Text>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Lees meer over dit onderwerp op de Honda website of in onze community.
          </Text>
        </View>

      </View>
    </ScrollView>
  );
}

// STYLING
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  image: {
    width: "100%",
    height: 220,
  },
  imagePlaceholder: {
    width: "100%",
    height: 220,
    backgroundColor: "#e8e8e8",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderIcon: {
    fontSize: 60,
  },
  content: {
    padding: 20,
  },
  badge: {
    backgroundColor: "#CC0000",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 14,
    lineHeight: 30,
  },
  description: {
    fontSize: 15,
    color: "#444",
    lineHeight: 24,
    marginBottom: 24,
  },
  footer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#CC0000",
  },
  footerText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    fontStyle: "italic",
  },
});
