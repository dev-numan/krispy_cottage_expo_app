import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  Keyboard,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { getLatestProducts, searchProducts } from "../api"; // Adjust this import path
import { useRouter } from "expo-router";

const SearchScreen = () => {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const router = useRouter();
  const [displayedProducts, setDisplayedProducts] = useState([]);

  useEffect(() => {
    const getLatest = async () => {
      setInitialLoading(true);
      try {
        const response = await getLatestProducts();
        if (response?.status === 200) {
          setDisplayedProducts(response?.data?.products);
        }
      } catch (error) {
        console.error("Error fetching latest products:", error);
      } finally {
        setInitialLoading(false);
      }
    };

    getLatest();
  }, []);

  const fetchData = async (reset = false) => {
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const data = await searchProducts(query, reset ? 1 : page);
      const newProducts = reset
        ? data.products
        : [...products, ...data.products];

      setProducts(newProducts);
      setDisplayedProducts(newProducts);
      setHasMore(data.pagination?.hasNextPage);
      setPage(reset ? 2 : page + 1);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    Keyboard.dismiss();
    fetchData(true);
  };

  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      fetchData();
    }
  };

  const handlePress = (item) => {
    router.push({
      pathname: "/components/product-detail",
      params: { product: item?._id }
    });
  };

  const renderProduct = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => handlePress(item)}>
        <View style={styles.card}>
          <Image
            source={{
              uri: `https://krispycottage.com${item.featuredImage?.fileSrc}`,
            }}
            style={styles.image}
          />
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.variantCount}>
              {item.variants?.length || 0} variant
              {item.variants?.length > 1 ? "s" : ""}
            </Text>
          </View>
          <Text style={styles.shortDescription}>{item.shortDescription}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safecontainer}>
      {initialLoading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : (
        <View style={styles.main}>
          <Text style={styles.heading}>Latest Products</Text>
          <View style={styles.searchBar}>
            <Icon name="search" size={20} color="#aaa" />
            <TextInput
              placeholder="Search products..."
              style={styles.searchInput}
                placeholderTextColor="#888"
              value={query}
              onChangeText={setQuery}
              returnKeyType="search"
              onSubmitEditing={handleSubmit}
            />
          </View>

          <FlatList
            data={displayedProducts}
            renderItem={renderProduct}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContainer}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.4}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            ListFooterComponent={
              isLoading && (
                <View style={styles.loader}>
                  <ActivityIndicator color={"#000"} size={"small"} />
                </View>
              )
            }
            ListEmptyComponent={
              !isLoading && (
                <Text style={{ textAlign: "center", marginTop: 20 }}>
                  No products found.
                </Text>
              )
            }
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  safecontainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  main: {
    flex: 1,
    width: "100%",
    padding: 20,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    height: 40,
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 12,
    paddingVertical: 0,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",

  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    backgroundColor: "white",
    height:"100%",
  },
  listContainer: {
    paddingBottom: 30,
  },
  productCard: {
    width: "100%",
    borderRadius: 12,
    backgroundColor: "#fafafa",
    padding: 1,
    marginBottom: 16,
    alignItems: "center",
  },
  productImage: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginBottom: 10,
  },
  productImagePlaceholder: {
    width: "100%",
    height: 180,
    backgroundColor: "#ddd",
    borderRadius: 10,
    marginBottom: 10,
  },
  productName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
    textAlign: "center",
  },
  productPrice: {
    fontSize: 16,
    color: "#555",
  },
  heading: {
    fontSize: 35,
    fontWeight: "700",
    color: "#000",
    marginBottom: 10,
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    paddingBottom: 20,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 20,
    borderWidth: 0.2,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  productInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 0,
    marginTop: 8,
    alignItems: "center",
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    paddingLeft: 10,
    textAlign: "left",
  },
  variantCount: {
    paddingRight: 10,
  },
  shortDescription: {
    fontSize: 10,
    color: "gray",
    paddingHorizontal: 10,
    marginTop: 5,
  },
  loader: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});
