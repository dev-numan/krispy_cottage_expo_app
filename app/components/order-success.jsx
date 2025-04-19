import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";

import { useNavigation, useRouter } from "expo-router";
import LottieView from "lottie-react-native";
export default function OrderSuccess() {
  const navigation = useNavigation();
  const router = useRouter();
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.main}>
        <Text style={styles.heading}>Order Successfull</Text>
        <View style={styles.innerView}>
          <LottieView
            source={require("./../../assets/order.json")}
            autoPlay
            loop={false}
            style={styles.animation}
          />
          <Text style={styles.text}>Your order was successful!</Text>

          <View>
            <TouchableOpacity
              onPress={() => {
                router.push({
                  pathname: "/(tabs)/Search",
                });
              }}
              style={styles.checkoutBtn}
            >
              <Text style={styles.checkoutText}>Continue Shopping</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  animation: {
    width: 250,
    height: 250,
  },
  text: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "600",
    color: "#2e7d32",
  },
  checkoutBtn: {
    marginTop: 15,
    backgroundColor: "#000",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    paddingInline: 20,
  },
  checkoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    paddingInline: 20,
  },
  innerView: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
});
