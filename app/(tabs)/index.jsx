import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { fetchCategories } from "./../api";
import { useRouter } from "expo-router";
import AutoSlidingCarousel from "../components/carousel";

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const data = await fetchCategories();
        if (data) {
          setLoading(false);
          setCategories(data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator color={"#000"} size={"large"} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.main}>
        <Text style={styles.heading}>Krispy Cottage</Text>
        <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        <AutoSlidingCarousel/>
        <Text style={styles.heading}>Categories</Text>
          <View style={styles.grid}>
            {categories.length === 0 ? (
              <Text>No categories found</Text>
            ) : (
              categories.map((category) => (
                <TouchableOpacity
                  key={category._id}
                  style={styles.box}
                  onPress={() =>
                    router.push(`/components/products?slug=${category.slug}`)
                  }
                >
                  {category.image && (
                    <View style={styles.imageContainer}>
                      <Image
                        source={
                          category.image
                            ? { uri: category.image }
                            : require("../../assets/images/notfound.png") // adjust path based on your file structure
                        }
                        style={styles.image}
                      />
                    </View>
                  )}
                  <View style={styles.nameBox}>
                    <Text style={styles.categoryName}>{category.name}</Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },
  heading: {
    fontSize: 35,
    fontWeight: "700",
    color: "#000",
    marginBottom: 10,
  },
  main: {
    flex: 1,
    width: "100%",
    padding: 20,
  },
  scroll: {
    flex: 1,
  },
  // Grid container for two columns per row
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 5,
  },
  // Each category card (fixed height)
  box: {
    width: "48%", // Two items per row with a little spacing
    height: 190, // Total card height
    backgroundColor: "white",
    marginBottom: 10,
    borderRadius: 8,
    overflow: "hidden", // Ensures child elements respect border radius
    position: "relative", // For absolute positioning of image container
    // iOS shadow properties
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    // Android shadow (elevation)
    elevation: 3,
    justifyContent: "flex-end", // Always place the nameBox at the bottom
  },
  // Container for the image (if available)
  imageContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 150,
  },
  // Image style: only top left and top right corners rounded
  image: {
    width: "100%",
    height: "100%",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  // Name container positioned at the bottom of the card
  nameBox: {
    backgroundColor: "#ffbf00",
    width: "100%",
    height: 40,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  categoryName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginVertical: 10,
  },
});
