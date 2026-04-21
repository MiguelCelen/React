import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "./screens/HomeScreen";
import ProductDetailsScreen from "./screens/ProductDetailsScreen";
import BlogDetailsScreen from "./screens/BlogDetailsScreen";

const Stak = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stak.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: "#CC0000" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      >
        <Stak.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Honda Motoren" }}
        />

        <Stak.Screen
          name="ProductDetails"
          component={ProductDetailsScreen}
          options={{ title: "Product Details" }}
        />

        <Stak.Screen
          name="BlogDetails"
          component={BlogDetailsScreen}
          options={{ title: "Blog" }}
        />
      </Stak.Navigator>
    </NavigationContainer>
  );
}
