import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { checkout, fetchCheckoutDetails } from "../api";
import { z } from "zod";
import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams,useRouter } from "expo-router";

// Zod schema for validation (all fields required)
const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  mobileNo: z.string().min(7, "Invalid mobile number"),
  addressLine1: z.string().min(1, "Address Line 1 is required"),
  addressLine2: z.string().min(1, "Address Line 2 is required"),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(3, "Invalid zip code"),
});

export default function Checkout() {
  const [checkoutData, setCheckoutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const { cart } = useLocalSearchParams();
  const cartProductList = cart ? JSON.parse(cart) : [];
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNo: "",
    addressLine1: "",
    addressLine2: "",
    country: "",
    city: "",
    state: "",
    zipCode: "",
  });
  // Object to hold field-specific errors.
  const [errors, setErrors] = useState({});

  useEffect(() => {
    navigation.setOptions({ headerShown: false });

    const loadCheckout = async () => {
      try {
        const data = await fetchCheckoutDetails();
        setCheckoutData(data);
      } catch (error) {
        console.error("Checkout fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCheckout();
  }, [navigation]);

  const checkoutOrder = async (payload) => {
    setLoading(true); // Start loading
    try {
      const response = await checkout(payload);
      if (response.status == 200) {
        console.log("✅ Order placed successfully:", response.data);
        router.push({
          pathname: "/components/order-success",
        });
      }else {
        Alert.alert("Error", "Failed to place order. Please try again.");
      }
    } catch (error) {
      console.error("Failed to place order:", error);
    } finally {
      setLoading(false); // End loading
    }
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear field-specific error on change
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handlePlaceOrder = async () => {
    // Validate entire form
    const result = schema.safeParse(form);
    if (!result.success) {
      const newErrors = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0];
        newErrors[field] = err.message;
      });
      setErrors(newErrors);
      return;
    }

    const payload = {
      ...result.data,
      cart: cartProductList,
    };

    try {
      await checkoutOrder(payload);
      // Optionally clear form or navigate to success screen here
    } catch (error) {
    }
  };

  if (loading || !checkoutData) {
    return (
      <View style={styles.loaderOverlay}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.main}>
        <Text style={styles.heading}>Checkout</Text>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Unified Form Section */}
          {/* <Text style={styles.sectionTitle}>Customer & Address Information</Text> */}

          {/* Personal Information Fields */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>First Name *</Text>
            <TextInput
              style={styles.input}
              value={form.firstName}
              onChangeText={(text) => handleChange("firstName", text)}
            />
            {errors.firstName && (
              <Text style={styles.errorText}>{errors.firstName}</Text>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Last Name *</Text>
            <TextInput
              style={styles.input}
              value={form.lastName}
              onChangeText={(text) => handleChange("lastName", text)}
            />
            {errors.lastName && (
              <Text style={styles.errorText}>{errors.lastName}</Text>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={styles.input}
              keyboardType="email-address"
              value={form.email}
              onChangeText={(text) => handleChange("email", text)}
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Mobile No *</Text>
            <TextInput
              style={styles.input}
              keyboardType="phone-pad"
              value={form.mobileNo}
              onChangeText={(text) => handleChange("mobileNo", text)}
            />
            {errors.mobileNo && (
              <Text style={styles.errorText}>{errors.mobileNo}</Text>
            )}
          </View>

          {/* Address Information Fields */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Address Line 1 *</Text>
            <TextInput
              style={styles.input}
              value={form.addressLine1}
              onChangeText={(text) => handleChange("addressLine1", text)}
            />
            {errors.addressLine1 && (
              <Text style={styles.errorText}>{errors.addressLine1}</Text>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Address Line 2 *</Text>
            <TextInput
              style={styles.input}
              value={form.addressLine2}
              onChangeText={(text) => handleChange("addressLine2", text)}
            />
            {errors.addressLine2 && (
              <Text style={styles.errorText}>{errors.addressLine2}</Text>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Country *</Text>
            <TextInput
              style={styles.input}
              value={form.country}
              onChangeText={(text) => handleChange("country", text)}
            />
            {errors.country && (
              <Text style={styles.errorText}>{errors.country}</Text>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>City *</Text>
            <TextInput
              style={styles.input}
              value={form.city}
              onChangeText={(text) => handleChange("city", text)}
            />
            {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>State *</Text>
            <TextInput
              style={styles.input}
              value={form.state}
              onChangeText={(text) => handleChange("state", text)}
            />
            {errors.state && (
              <Text style={styles.errorText}>{errors.state}</Text>
            )}
          </View>

          <View style={styles.lastformGroup}>
            <Text style={styles.label}>Zip Code *</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={form.zipCode}
              onChangeText={(text) => handleChange("zipCode", text)}
            />
            {errors.zipCode && (
              <Text style={styles.errorText}>{errors.zipCode}</Text>
            )}
          </View>
        </ScrollView>

        {/* Bottom Summary & Place Order Button */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryRow}>
            <Text style={styles.labelBold}>Total</Text>
            <Text style={styles.valueBold}>
              ${checkoutData.total.toFixed(2)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.labell}>Shipping</Text>
            <Text style={styles.value}>
              ${checkoutData.shipping.toFixed(2)}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.placeOrderButton}
            onPress={handlePlaceOrder}
          >
            <Text style={styles.buttonText}>Place Order</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  main: { flex: 1, width: "100%", padding: 20 },
  scrollContent: { paddingBottom: 120 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  summaryCard: {
    backgroundColor: "#f6f6f6",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
  },
  summaryText: { fontSize: 16, marginBottom: 6 },
  totalText: { fontSize: 18, fontWeight: "bold", color: "#c00" },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 16,
  },
  formGroup: { marginBottom: 16 },
  lastformGroup: { marginBottom: 50 },

  input: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 7,
  },
  errorText: {
    fontSize: 10,
    color: "#c00",
    marginTop: 4,
    marginLeft: 4,
  },
  // Bottom summary container styled similar to your Cart component
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
  labelBold: { fontSize: 18, fontWeight: "bold" },
  valueBold: { fontSize: 18, fontWeight: "bold" },
  label: { fontSize: 12, color: "#444" },
  labell: {
    fontSize: 12,
    color: "#000",
    marginBottom: 4,
  },
  value: { fontSize: 16, color: "#444" },
  placeOrderButton: {
    marginTop: 15,
    backgroundColor: "#000",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  heading: {
    fontSize: 35,
    fontWeight: "700",
    color: "#000",
    marginBottom: 10,
  },
  loaderOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
});
