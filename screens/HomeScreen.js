import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Switch,
  Button,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

import ProductCard from "../components/ProductCard";
import BlogCard from "../components/BlogCard";

const SITE_ID = "698c80bf232508e34c8cc076";
const PRODUCT_TOKEN = "27ead1a2643ea48a8c21805674eb2038df9bde9cfbf3d7ffc0f0eea3ba921218";
const BLOG_COLLECTION_ID = "699ef94bfd810a565599ad94";
const BLOG_TOKEN = "8b8bff0c35f6ffa165c245c51625af962a75682dac1cd49e5b18985fb94fe39a";

const CATEGORY_NAMES = {
  "69af05503ab9fffc3e1246ae": "Street",
  "69aeff9a3f041172578b91fd": "Touring",
  "69af0b2cd0e284809d495b5b": "Training & Veiligheid",
  "69af0b209df79a1fe47d7165": "Community & Stories",
  "69af0b151f166875737f4f83": "Events & Festivals",
};

export default function HomeScreen({ navigation }) {

  const [products, setProducts] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("");

  const [sortOption, setSortOption] = useState("price-asc");

  const [showBlogs, setShowBlogs] = useState(true);

  useEffect(() => {
    fetchProducts();
    fetchBlogs();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `https://api.webflow.com/v2/sites/${SITE_ID}/products`,
        {
          headers: {
            Authorization: `Bearer ${PRODUCT_TOKEN}`,
            "accept-version": "1.0.0",
          },
        }
      );

      const data = await response.json();
      
      const formatted = data.items.map(({ id, product, skus }) => ({
        id,
        title: product.fieldData.name,
        subtitle: product.fieldData["description"] || "",
        price: (skus[0].fieldData["price"]?.value / 100).toFixed(2) || "0.00",
        image: skus[0].fieldData["main-image"]?.url || "",
        category: CATEGORY_NAMES[product.fieldData["category"]?.[0]] || "Onbekend",
      }));

      setProducts(formatted);
    } catch (err) {
     
      setError("Producten konden niet geladen worden.");
      console.error("API fout producten:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBlogs = async () => {
    try {
      const response = await fetch(
        `https://api.webflow.com/v2/collections/${BLOG_COLLECTION_ID}/items`,
        {
          headers: {
            Authorization: `Bearer ${BLOG_TOKEN}`,
            "accept-version": "1.0.0",
          },
        }
      );

      const data = await response.json();

      const formatted = data.items.map(({ id, fieldData }) => ({
        id,
        title: fieldData.name,
        description: fieldData["short-description"] || "",
        image: fieldData["main-image"]?.url || "",
        category: CATEGORY_NAMES[fieldData["category"]] || "Nieuws",
      }));

      setBlogs(formatted);
    } catch (err) {
      console.error("API fout blogs:", err);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "" || product.category === selectedCategory;
    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === "price-asc") return a.price - b.price;
    if (sortOption === "price-desc") return b.price - a.price;
    if (sortOption === "name-asc") return a.title.localeCompare(b.title);
    if (sortOption === "name-desc") return b.title.localeCompare(a.title);
    return 0;
  });

  const uniqueCategories = [...new Set(products.map((p) => p.category))];

  // LAADSCHERM
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#CC0000" />
        <Text style={styles.loadingText}>Motoren laden...</Text>
      </View>
    );
  }

  // FOUTSCHERM
  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
    
        <Button title="Opnieuw proberen" onPress={fetchProducts} color="#CC0000" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      <TextInput
        style={styles.searchInput}
        placeholder="🔍  Zoek een motor..."
        placeholderTextColor="#aaa"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <View style={styles.pickerWrapper}>
        <Text style={styles.label}>Categorie</Text>
        <Picker
          selectedValue={selectedCategory}
          onValueChange={setSelectedCategory}
          style={styles.picker}
        >
          <Picker.Item label="Alle categorieën" value="" />
          {uniqueCategories.map((cat) => (
            <Picker.Item key={cat} label={cat} value={cat} />
          ))}
        </Picker>
      </View>

      <View style={styles.pickerWrapper}>
        <Text style={styles.label}>Sorteren op</Text>
        <Picker
          selectedValue={sortOption}
          onValueChange={setSortOption}
          style={styles.picker}
        >
          <Picker.Item label="Prijs: laag → hoog" value="price-asc" />
          <Picker.Item label="Prijs: hoog → laag" value="price-desc" />
          <Picker.Item label="Naam: A → Z" value="name-asc" />
          <Picker.Item label="Naam: Z → A" value="name-desc" />
        </Picker>
      </View>

      <Text style={styles.sectionTitle}>🏍️ Modellen ({sortedProducts.length})</Text>

      {sortedProducts.length === 0 ? (
        <Text style={styles.emptyText}>Geen resultaten gevonden.</Text>
      ) : (

        sortedProducts.map((product) => (
          <ProductCard
            key={product.id}
            title={product.title}
            subtitle={product.subtitle}
            price={product.price}
            image={product.image}
            
            onPress={() => navigation.navigate("ProductDetails", { product })}
          />
        ))
      )}

      <View style={styles.blogHeader}>
        <Text style={styles.sectionTitle}>📰 Blogs ({blogs.length})</Text>
        
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Toon blogs</Text>
          <Switch
            value={showBlogs}
            onValueChange={setShowBlogs}
            trackColor={{ false: "#ccc", true: "#CC0000" }}
            thumbColor="#fff"
          />
        </View>
      </View>

      {showBlogs &&
        blogs.map((blog) => (
          <BlogCard
            key={blog.id}
            title={blog.title}
            description={blog.description}
            image={blog.image}
            category={blog.category}
            onPress={() => navigation.navigate("BlogDetails", { blog })}
          />
        ))}

      <TouchableOpacity
        style={styles.refreshButton}
        onPress={() => {
          setLoading(true);
          fetchProducts();
          fetchBlogs();
        }}
      >
        <Text style={styles.refreshButtonText}>🔄 Vernieuwen</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

// STYLING
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#555",
  },
  errorText: {
    fontSize: 16,
    color: "#CC0000",
    marginBottom: 16,
    textAlign: "center",
  },
  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    color: "#333",
  },
  pickerWrapper: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    overflow: "hidden",
    paddingHorizontal: 8,
  },
  label: {
    fontSize: 11,
    color: "#999",
    marginTop: 6,
    marginLeft: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  picker: {
    height: 44,
    color: "#333",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 12,
    marginTop: 4,
  },
  emptyText: {
    color: "#888",
    fontStyle: "italic",
    textAlign: "center",
    marginVertical: 20,
  },
  blogHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 4,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  switchLabel: {
    fontSize: 13,
    color: "#555",
  },
  refreshButton: {
    backgroundColor: "#CC0000",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 16,
  },
  refreshButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
});
