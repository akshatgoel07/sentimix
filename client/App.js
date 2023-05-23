import { useEffect ,useState} from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as Font from "expo-font";
import Home from "./screens/Home";
import Profile from "./screens/Profile";
import Tabs from "./components/tabs";

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        RedHatMedium: require("./assets/fonts/RedHatMedium.ttf"),
        RedHatBold: require("./assets/fonts/RedHatBold.ttf"),
        RedHatRegular: require("./assets/fonts/RedHatRegular.ttf"),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);
  

  return (
    <NavigationContainer 
    >
      <Tabs fontsLoaded={fontsLoaded}/>
    </NavigationContainer>
  );
}
