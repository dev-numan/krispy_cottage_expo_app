import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Alert,
} from "react-native";
import { AntDesign, Feather } from "@expo/vector-icons";
import { getCart, deleteFromCart, updateCart } from "../api";
import { useRouter } from "expo-router";

export default function Cart() {
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartProductList, setCartProductList] = useState([]);

  const router = useRouter();
  const fetchCart = async () => {
    setLoading(true); // Start loading
    try {
      const response = await getCart();
      setCartData(response?.data);
      setCartProductList(response?.data?.products);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateCartQuantity = async (productId, variantIndex, quantity) => {
    const payload = {
      productId,
      variantIndex,
      quantity,
    };
    setLoading(true); // Start loading
    try {
      await updateCart(payload); // Send the update request
      fetchCart(); // Refresh cart after update
    } catch (error) {
      console.error("Failed to update cart:", error);
    } finally {
      setLoading(false); // End loading
    }
  };

  const increaseQuantity = (index) => {
    const updated = [...cartData.products];
    const productId = updated[index]._id;
    const variantIndex = updated[index].variantIndex;
    updated[index].quantity += 1;
    setCartData({ ...cartData, products: updated });

    updateCartQuantity(productId, variantIndex, updated[index].quantity); // Update cart API
  };

  const decreaseQuantity = (index) => {
    const updated = [...cartData.products];
    const productId = updated[index]._id;
    const variantIndex = updated[index].variantIndex;
    if (updated[index].quantity > 1) {
      updated[index].quantity -= 1;
      setCartData({ ...cartData, products: updated });

      updateCartQuantity(productId, variantIndex, updated[index].quantity); // Update cart API
    }
  };

  const handleDelete = async (productId, variantIndex) => {
    const payload = {
      productId,
      variantIndex,
    };
    setLoading(true); // Start loading
    try {
      await deleteFromCart(payload);
      fetchCart(); // Refresh cart
    } catch (error) {
      console.error("Failed to delete item:", error);
    } finally {
      setLoading(false); // End loading
    }
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.cartItem}>
      <Image
        source={{ uri: `https://krispycottage.com${item.featuredImage}` }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.itemDetails}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.variant}>
          {typeof item.attributes === "object"
            ? Object.entries(item.attributes)
                .map(([key, value]) => `${key}: ${value}`)
                .join(", ")
            : item.attributes}
        </Text>

        <View style={styles.quantityRow}>
          <TouchableOpacity onPress={() => decreaseQuantity(index)}>
            <AntDesign
              name="minuscircleo"
              size={18}
              color={item.quantity === 1 ? "gray" : "black"}
            />
          </TouchableOpacity>

          <Text style={styles.quantityText}>{item.quantity}</Text>

          <TouchableOpacity onPress={() => increaseQuantity(index)}>
            <AntDesign name="pluscircleo" size={18} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.cartItemsFlex}>
        <Text style={styles.price}>
          ${(item.price * item.quantity)?.toFixed(2)}
        </Text>

        <TouchableOpacity
          onPress={() => handleDelete(item._id, item.variantIndex)}
        >
          <Feather name="trash-2" size={18} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.main}>
        {loading && (
          <View style={styles.loaderOverlay}>
            <ActivityIndicator size="large" color="#000" />
          </View>
        )}

        {/* Cart Content */}
        <Text style={styles.heading}>Cart</Text>

        {!cartData?.products?.length? (
          <View style={styles.emptyCartContainer}>
            <Text style={styles.emptyCartText}>Cart is empty</Text>
          </View>
        ) : (
          <FlatList
            data={cartData?.products}
            keyExtractor={(_, index) => index.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 220 }}
            showsVerticalScrollIndicator={false}
          />
        )}

        {/* Cart Summary */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryRow}>
            <Text style={styles.labelBold}>Total</Text>
            <Text style={styles.valueBold}>
            ${cartData?.total?.toFixed(2)}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => {
              if (!cartProductList || cartProductList.length === 0) {
                Alert.alert(
                  "Cart is empty",
                  "Please add items to your cart before proceeding to checkout."
                );
              } else {
                router.push({
                  pathname: "/components/checkout",
                  params: { cart: JSON.stringify(cartProductList) },
                });
              }
            }}
            style={styles.checkoutBtn}
          >
            <Text style={styles.checkoutText}>Go to Checkout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  main: {
    flex: 1,
    width: "100%",
    padding: 20,
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#f7f7f7",
    gap: 12,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  itemDetails: {
    flex: 1,
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
  },
  variant: {
    color: "#555",
    fontSize: 14,
  },
  price: {
    marginTop: 4,
    fontSize: 14,
    color: "#222",
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 10,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "500",
  },
  summaryContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 6,
    elevation: 5,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    color: "#444",
  },
  value: {
    fontSize: 16,
    color: "#444",
  },
  labelBold: {
    fontSize: 18,
    fontWeight: "bold",
  },
  valueBold: {
    fontSize: 18,
    fontWeight: "bold",
  },
  checkoutBtn: {
    marginTop: 15,
    backgroundColor: "#000",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  checkoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  cartItemsFlex: {
    display: "flex",
    flexDirection: "column-reverse",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: 33,
  },
  loaderOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(36, 36, 36, 0.2)", // Light opacity gray
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1, // Ensure the loader appears on top
  },
  heading: {
    fontSize: 35,
    fontWeight: "700",
    color: "#000",
    marginBottom: 10,
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  emptyCartText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#555",
  },
});
