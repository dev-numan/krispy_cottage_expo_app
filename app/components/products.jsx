import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { fetchProductsBySlug } from "../api";

export default function Products() {
  const { slug } = useLocalSearchParams();
  const navigation = useNavigation();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (slug) {
      navigation.setOptions({ title: slug });
    } else {
      navigation.setOptions({ title: "Product Details" });
    }
  }, [navigation, slug]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProductsBySlug(slug);
        if (data) {
          setProducts(data?.products);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [slug]);

  const handlePress = (item) => {
    console.log("firdvdfvdst", item);
    router.push({ pathname: "/components/product-detail", params: { product: item?._id } });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handlePress(item)}>
      <View style={styles.card}>
        <Image
          source={{
            uri: `https://krispycottage.com${item.featuredImage.fileSrc}`,
          }}
          style={styles.image}
        />
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.variantCount}>{item.variants?.length || 0} variant</Text>
        </View>
        <Text style={styles.shortDescription}>{item.shortDescription}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
            <View style={styles.main}>
      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator color={"#000"} size={"large"} />
        </View>
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        />
      )}
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",

  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    width: "100%",
    height: "auto",
    backgroundColor: "#fff",
    paddingBottom: 20,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  
    borderWidth: 0.2,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    paddingLeft: 10,
    textAlign: "left",
  },
  loadingText: {
    textAlign: "center",
    fontSize: 18,
    marginTop: 20,
  },
  errorText: {
    textAlign: "center",
    fontSize: 18,
    color: "red",
    marginTop: 20,
  },
  productInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 0,
    marginTop: 8,
    alignItems: "center",
    
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
  main: {
    flex: 1,
    width: "100%",
    padding: 20,
  },
});
