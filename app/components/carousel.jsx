import React from "react";
import { View, Dimensions, Image } from "react-native";
import Carousel from "react-native-reanimated-carousel";
// import Carousel from 'react-native-reanimated-carousel';

const { width } = Dimensions.get("window");

const images = [
  require("../../assets/images/1.jpg"),
  require("../../assets/images/2.jpg"),
  require("../../assets/images/3.jpg"),
  require("../../assets/images/4.jpg"),
  require("../../assets/images/5.jpg"),
];

export default function AutoSlidingCarousel() {
  return (
    <View style={{ marginTop:10, justifyContent: "center", marginBlock:30 }}>
      <Carousel
        width={width}
        height={200}
        autoPlay={true}
        autoPlayInterval={2000}
        data={images}
        scrollAnimationDuration={1000}
        renderItem={({ item }) => (
          <Image
            source={item}
            style={{ width: "90%", height: 200, borderRadius: 10 }}
            resizeMode="cover"
          />
        )}
        loop={true}
      />
    </View>
  );
}
