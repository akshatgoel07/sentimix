import { Image, Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../screens/Home";
import Profile from "../screens/Profile";
import VideoScreen from "../screens/Video";
import Live from "../screens/Live";
import { Socket } from "socket.io-client";
import SocketCode from "../screens/Socket"; 
import Tensor from "../screens/Tensor";
const Tab = createBottomTabNavigator();
const Tabs = ({ fontsLoaded }) => {
  return (
    <>
      {!fontsLoaded ? null : (
        <Tab.Navigator
          screenOptions={{
            showLabel: false,
            tabBarStyle: {
              backgroundColor: "#fff",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              bottom: 26,
              marginLeft: 15,
              position: "absolute",
              marginRight: 15,
              elevation: 5,
              borderRadius: 14,
              shadowColor: "#000",
              shadowOffset: {
                width: 2,
                height: 2,
              },
              shadowOpacity: 0.16,
              paddingTop: 20,
              shadowRadius: 3.8,
              safeAreaInsets: {
                bottom: 0,
              },
            },
          }}
        >
          <Tab.Screen
            name="Home"
            component={Home}
            options={{
              tabBarLabel: ({ focused }) => (
                <Text
                  style={{
                    fontSize: 14,
                    color: focused ? "#000" : "#ccc",
                    fontFamily: "RedHatMedium",
                    position: "absolute",
                    bottom: -10,
                  }}
                >
                  Home
                </Text>
              ),

              headerShown: false,
              tabBarIcon: ({ focused }) => (
                <Image
                  source={require("../assets/homeicon.png")}
                  style={{
                    tintColor: focused ? "#0067FF" : "#A8A8A8",
                    position: "absolute",
                    bottom: 9,
                    transform: [{ scale: focused ? 1.1 : 1 }],
                  }}
                />
              ),
            }}
          />

          {/* <Tab.Screen
            name="Tensor"
            component={Tensor}
            options={{
              headerShown: false,
              tabBarLabel: ({ focused }) => (
                <Text
                  style={{
                    fontSize: 14,
                    color: focused ? "#000" : "#ccc",
                    fontFamily: "RedHatMedium",
                    position: "absolute",
                    bottom: -10,
                  }}
                >
                  Tensor
                </Text>
              ),
              tabBarIcon: ({ focused }) => (
                <Image
                  source={require("../assets/scanicon.png")}
                  style={{
                    tintColor: focused ? "#0067FF" : "#A8A8A8",
                    position: "absolute",
                    bottom: 9,
                    transform: [{ scale: focused ? 1.1 : 1 }],
                  }}
                />
              ),
            }}
          /> */}
          <Tab.Screen
            name="Video"
            component={VideoScreen}
            options={{
              headerShown: false,
              tabBarLabel: ({ focused }) => (
                <Text
                  style={{
                    fontSize: 14,
                    color: focused ? "#000" : "#ccc",
                    fontFamily: "RedHatMedium",
                    position: "absolute",
                    bottom: -10,
                  }}
                >
                  Video
                </Text>
              ),
              tabBarIcon: ({ focused }) => (
                <Image
                  source={require("../assets/scanicon.png")}
                  style={{
                    tintColor: focused ? "#0067FF" : "#A8A8A8",
                    position: "absolute",
                    bottom: 9,
                    transform: [{ scale: focused ? 1.1 : 1 }],
                  }}
                />
              ),
            }}
          />
          <Tab.Screen
            name="Live"
            component={Live}
            options={{
              headerShown: false,
              tabBarLabel: ({ focused }) => (
                <Text
                  style={{
                    fontSize: 14,
                    color: focused ? "#000" : "#ccc",
                    fontFamily: "RedHatMedium",
                    position: "absolute",
                    bottom: -10,
                  }}
                >
                  Live
                </Text>
              ),
              tabBarIcon: ({ focused }) => (
                <Image
                  source={require("../assets/usericon.png")}
                  style={{
                    tintColor: focused ? "#0067FF" : "#A8A8A8",
                    position: "absolute",
                    bottom: 9,
                    transform: [{ scale: focused ? 1.1 : 1 }],
                  }}
                />
              ),
            }}
          />
        </Tab.Navigator>
      )}
    </>
  );
};
export default Tabs;
