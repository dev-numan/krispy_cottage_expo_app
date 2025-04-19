import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { addToCart, fetchProductDetails } from "../api"; // 👈 import your function
import { useLocalSearchParams, useRouter } from "expo-router";

export default function ProductDetail() {
  const { product } = useLocalSearchParams(); // product is ID
  const navigation = useNavigation();
  const router = useRouter();
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [item, setItem] = useState(null);
  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(0);

  useEffect(() => {
    // Set default title immediately
    navigation.setOptions({ title: "" });
  
    const loadProduct = async () => {
      try {
        console.log("dgdsgg", product);
        const data = await fetchProductDetails(product);
        setItem(data?.product);
        setRelatedProducts(data?.relatedProducts);
        // Update title once product name is available
        navigation.setOptions({ title: data?.product?.category?.name  });
      } catch (error) {
        console.error("Error loading product details", error);
      }
    };
  
    loadProduct();
  }, [product]);
  

  const handlePress = (item) => {
    router.push({
      pathname: "/product-details",
      params: { product: item?._id },
    });
  };
  
  const handleSelectVariant = (variantId) => {
    setSelectedVariantId(variantId);
    setSelectedQuantity(0);
  };

  const increaseQuantity = () => setSelectedQuantity((prev) => prev + 1);
  const decreaseQuantity = () =>
    setSelectedQuantity((prev) => (prev > 0 ? prev - 1 : 0));

  const hasSelectedValid = selectedVariantId && selectedQuantity > 0;

  const renderVariant = ({ item: variant }) => {
    const isSelected = selectedVariantId === variant._id;

    return (
      <TouchableOpacity
        style={[
          styles.variantCard,
          isSelected && { borderColor: "#ffbf00", borderWidth: 2 },
        ]}
        onPress={() => handleSelectVariant(variant._id)}
      >
        <View style={styles.variantFlex}>
          <Text style={styles.variantText}>{variant.attributes}</Text>
          <View style={styles.variantFlex}>
            <Text style={styles.priceText}>
              <Text style={styles.strikeThrough}>
                Rs{variant.price.toFixed(2)}
              </Text>{" "}
              Rs {variant.salePrice.toFixed(2)}/-
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (!item) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: `https://krispycottage.com${item?.featuredImage?.fileSrc}`,
        }}
        style={styles.image}
      />

      <View style={styles.productHeader}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.variantCount}>
          {item.variants?.length} Variants
        </Text>
      </View>

      <Text style={styles.description}>{item.longDescription}</Text>

      <View
        style={[styles.globalCounter, !selectedVariantId && { opacity: 0.5 }]}
      >
        <TouchableOpacity
          onPress={decreaseQuantity}
          disabled={!selectedVariantId || selectedQuantity === 0}
        >
          <AntDesign
            name="minuscircleo"
            size={24}
            color={
              !selectedVariantId || selectedQuantity === 0 ? "gray" : "black"
            }
          />
        </TouchableOpacity>

        <Text style={styles.quantityText}>{selectedQuantity}</Text>

        <TouchableOpacity
          onPress={increaseQuantity}
          disabled={!selectedVariantId}
        >
          <AntDesign
            name="pluscircleo"
            size={24}
            color={!selectedVariantId ? "gray" : "black"}
          />
        </TouchableOpacity>
      </View>

      <FlatList
        data={item.variants}
        keyExtractor={(variant) => variant._id}
        renderItem={renderVariant}
        contentContainerStyle={styles.variantList}
        showsVerticalScrollIndicator={false}
      />

      

      <View style={styles.btnBox}>
        {hasSelectedValid && (
          <TouchableOpacity
            style={styles.addToCartButton}
            onPress={async () => {
              const productId = item._id;
              const quantity = selectedQuantity;
              const hasVariants = item.variants.length > 1;
              const variantIndex = item.variants.findIndex(
                (v) => v._id === selectedVariantId
              );

              const payload = {
                productId,
                quantity,
                hasVariants,
                variantIndex,
              };

              try {
                const res = await addToCart(payload);
                if (res.status === 200) {
                  console.log("Added to cart successfully");
                  router.push({ pathname: "/(tabs)/Cart" });
                }
              } catch (err) {
                console.error("Failed to add to cart:", err);
              }
            }}
          >
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </TouchableOpacity>
        )}
      </View>

      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 10,
  },
  image: {
    width: "100%",
    height: 220,
    resizeMode: "cover",
    borderRadius: 10,
  },
  productHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  productName: {
    fontSize: 22,
    fontWeight: "bold",
  },
  variantCount: {
    fontSize: 16,
    color: "gray",
  },
  description: {
    fontSize: 16,
    marginVertical: 10,
    color: "#444",
    paddingLeft: 10,
  },
  globalCounter: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    gap: 20,
  },
  variantList: {
    marginTop: 10,
  },
  variantCard: {
    backgroundColor: "#f8f8f8",
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  variantInfo: {},
  variantText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  priceText: {
    fontSize: 16,
    color: "#333",
  },
  strikeThrough: {
    textDecorationLine: "line-through",
    color: "gray",
    marginRight: 5,
    fontSize: 12,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: "bold",
    minWidth: 20,
    textAlign: "center",
  },
  addToCartButton: {
    position: "absolute",
    bottom: 10,
    width: "100%",
    height: 44,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  addToCartText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  btnBox: {
    width: "100vw",
    height: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  variantFlex: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100vw",
    // backgroundColor: "pink",
  },
  loader: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    paddingBottom: 20,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
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
});
