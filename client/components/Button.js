import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
const Button = ({ title, onPress, icon, color }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Entypo name={icon} size={24} color={color ? color : "#f1f1f1"} />
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

export default Button;
const styles = StyleSheet.create({
  button: {
    height: 50,
    flexDirection: "row",
    gap: 10,
    backgroundColor: "#016DFD",
    width: "90%",
    borderRadius: 10,
    marginLeft: "auto",
    marginRight: "auto", 
    alignItems: "center",
    justifyContent: "center", 
    
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});
