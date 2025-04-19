import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "#fff",
        tabBarStyle: {
          backgroundColor: "#ffbf00",
        },
      }}
    >
      
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,  // Hide the header
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "home-sharp" : "home-outline"}
              color="#FFF"
              size={22}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Cart"
        options={{
          headerShown: false,  // Hide the header
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "cart" : "cart-outline"}
              color="#FFF"
              size={22}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Search"
        options={{
          headerShown: false,  // Hide the header
          tabBarIcon: ({ focused, color }) => (
            <SimpleLineIcons name={focused ? "magnifier" : "magnifier"} size={17} color="#fff" />
            // <FontAwesome name={focused ? "user-circle-o" : "user-circle"} size={20} color="#fff" />
          ),
        }}
      />
    </Tabs>
  );
}

