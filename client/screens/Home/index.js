import React, { useState, useEffect, useRef } from "react";
import { Camera, CameraType } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { BarChart, XAxis, Grid } from "react-native-svg-charts";
import { Circle, G, Line } from "react-native-svg";

import * as scale from "d3-scale";
const DATA = [
  {
    id: "1",
    backgroundColor: "#0178FE",
    backgroundColor2: "#1984FF",

    date: "30",
    month: "Jan",
    smalltext: "todays",
    bigtext: "mood 🤨",
  },
  {
    id: "2",
    backgroundColor: "#5D5FEE",
    backgroundColor2: "#686AF8",

    date: "30",
    month: "Jan",
    smalltext: "bit",
    bigtext: "happy 😁",
  },
  {
    id: "3",
    backgroundColor: "#FFB400",
    backgroundColor2: "#FFC947",

    date: "30",
    month: "Jan",
    smalltext: "bit",
    bigtext: "happy 😁",
  },
];

const personalizedData = [
  {
    id: "1",
    backgroundColor: "#FFB400",
    backgroundColor2: "#FFC947",
    name: "cafes",
    img: require("../../assets/coffee.png"),
  },
  {
    id: "2",
    backgroundColor: "#5D5FEE",
    backgroundColor2: "#686AF8",
    name: "music",
    img: require("../../assets/music.png"),
  },
];
const Card = ({ item }) => {
  return (
    <TouchableOpacity>
      <View
        style={[
          styles.card,
          {
            backgroundColor: item.backgroundColor,
          },
        ]}
      >
        <View style={styles.cardHeader}>
          <View
            style={[
              styles.cardHeaderImage,
              {
                backgroundColor: item.backgroundColor2,
              },
            ]}
          >
            <Image
              source={require("../../assets/calendar.png")}
              style={[styles.calendar]}
            />
          </View>
          <View style={styles.cardHeaderText}>
            <Text style={styles.cardHeaderText1}>{item.month}</Text>

            <Text style={styles.cardHeaderText2}>{item.date}</Text>
          </View>
        </View>
        <View style={styles.cardContent}>
          {/* <Text style={styles.smalltext}>{item.smalltext}</Text> */}
          <Text style={styles.bigtext}>{item.mood}</Text>
        </View>
        <View
          style={[
            styles.circle,
            {
              backgroundColor: item.backgroundColor2,
            },
          ]}
        ></View>
      </View>
    </TouchableOpacity>
  );
};

const HorizontalScrollableCards = ({ moodsData }) => {
  return (
    <ScrollView horizontal>
      {moodsData?.map((item) => (
        <Card key={item.id} item={item} />
      ))}
    </ScrollView>
  );
};
const DescribeCard = ({ navigation }) => {
  return (
    <View style={styles.describeCard}>
      <Text style={styles.describeCarImage}>🚀</Text>
      <TouchableOpacity onPress={() => navigation.navigate("Video")}>
        <Text style={styles.describeCardText}>
          Get in the Mood for a better day with MoodDiary. Describe{" "}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
const Personalized = () => {
  return (
    <View>
      <View style={styles.personalized}>
        <Text style={styles.personalizedText1}>Personalized</Text>
        <Text style={styles.personalizedText}>reccomendations</Text>
      </View>
      <ScrollView horizontal style={styles.personalizedScrollView}>
        {personalizedData.map((item) => {
          return (
            <View
              style={[
                styles.personalizedCard,
                {
                  backgroundColor: item.backgroundColor,
                },
              ]}
            >
              <Image
                source={item.img}
                // source={require(item.img)}
                style={styles.personalizedCardImage}
              />
              <Text style={styles.personalizedCardText}>{item.name}</Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};
const Home = () => {
  const moodData = [
    { date: "2022-05-01", mood: "happy" },
    { date: "2022-05-02", mood: "neutral" },
    { date: "2022-05-03", mood: "sad" },
    { date: "2022-05-04", mood: "happy" },
    { date: "2022-05-05", mood: "happy" },
    { date: "2022-05-06", mood: "neutral" },
    { date: "2022-05-07", mood: "sad" },
  ];
  const [selectedBarIndex, setSelectedBarIndex] = useState(null);


  const [moodsData, setmoodsData] = useState([]);
  useEffect(() => {
    fetch("http://172.20.10.2:5000/users")
      .then((response) => response.json())
      .then((data) => {
        setmoodsData(data[0]?.moods);
      })
      .catch((error) => console.error(error));
  }, []);
  const data = [2, 5, 2, 3, 6, 1, 4];
  const xAxisLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const yAxisLabels = [
    "Happy",
    "Sad",
    "Neutral",
    "Super Happy",

    "Happy",
    "Ultra Happy", 
    "Very Happy",
  ];
  const Decorator = ({ x, y, data }) => {
    return data.map((value, index) => (
      <TouchableOpacity key={index} onPress={() => setSelectedBarIndex(index)}>
        <View
          style={{
            position: "absolute",
            top: y(value) - 30,
            left: x(index) - 25,
            width: 50,

            height: 20,
            backgroundColor: selectedBarIndex === index ? "#1984FF" : "#FFB400",
            borderRadius: 5,
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
          }}
        >
          <Text
            style={{
              color: selectedBarIndex === index ? "#fff" : "#fff",
              fontWeight: "bold",
              fontSize: 8,
            }}
          >
            {yAxisLabels[value - 1]}
          </Text>
        </View>
      </TouchableOpacity>
    ));
  };
  const navigation = useNavigation();
  return (
    <ScrollView style={styles.Wrapcontainer}>
      <View style={styles.homeContainer}>
        <View style={styles.headerWrap}>
          <Text style={styles.header}>
            Good Morning! {"\n"}
            <Text style={styles.name}>Dhairya</Text>
          </Text>
          <Image
            style={styles.headerButtonImage}
            source={require("../../assets/chat.png")}
          />
        </View>
        <View style={styles.cardContainer}>
          <HorizontalScrollableCards moodsData={moodsData} />
        </View>
        <DescribeCard navigation={navigation} />
        <View style={styles.chartcontainer}>
          <View style={styles.moodHistoryHeaderFlex}>
            <View style={styles.moodHistoryHeaderContent}>
              <Text style={styles.moodHistoryHeaderText}>Mood</Text>
              <Text style={styles.moodHistoryHeaderText2}>History</Text>
            </View>
            <View style={styles.moodHistoryHeaderImg}>
              <Image
                style={styles.moodHistoryHeaderImg}
                source={require("../../assets/arrow.png")}
              />
            </View>
          </View>
          <Text style={styles.moodHistoryHeaderSubText}>
            Great job! Your mood improved by 20% this week.
          </Text>
          <BarChart
            style={{ height: 260 }}
            data={data}
            valueAccessor={({ item }) => item}
            svg={{
              fill: "#fff",
              rx: 15,
              ry: 15,
            }}
            // showGrid={false}
            spacingInner={0.35}
            spacingOuter={0.35}
            contentInset={{ top: 10, bottom: 10 }}
            gridMin={0}
            gridMax={yAxisLabels.length}
          >
            <Grid style={styles.grid} />
            <Decorator />
          </BarChart>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 7,
            }}
          >
            {xAxisLabels.map((label, index) => (
              <Text style={styles.label} key={index}>
                {label}
              </Text>
            ))}
          </View>
        </View>
        <Personalized />
      </View>
    </ScrollView>
  );
};

export default Home;
const styles = StyleSheet.create({
  Wrapcontainer: {
    flex: 1,
    height: "100%",
    backgroundColor: "#f4f4f4",
  },
  moodHistoryHeaderFlex: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // marginBottom: 40,
  },
  camera: {
    flex: 1,
  },
  moodHistoryHeaderSubText: {
    marginBottom: 30,
    marginTop: 10,
    color: "#fff",
    fontSize: 16,
    fontFamily: "RedHatMedium",
  },
  moodHistoryHeaderText: {
    fontSize: 24,
    lineHeight: 22,
    fontWeight: "500",
    fontFamily: "RedHatMedium",
    color: "#fff",
  },
  moodHistoryHeaderText2: {
    fontSize: 33,
    lineHeight: 40,
    marginTop: -5,
    fontWeight: "700",
    fontFamily: "RedHatBold",
    color: "#fff",
  },
  chartcontainer: {
    width: "90%",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 20,
    borderRadius: 31,
    backgroundColor: "#0178FE",
    padding: 30,
  },
  chart: {
    height: 200,
  },
  xAxis: {
    marginTop: 10,
    height: 20,
  },
  label: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "RedHatBold",
  },
  personalizedCardImage: {
    width: 70,
    height: 70,
    resizeMode: "contain",
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: 10,
  },
  personalizedCardText: {
    fontSize: 30,
    fontFamily: "RedHatBold",
    color: "#fff",
  },
  personalizedScrollView: {
    marginLeft: 10,
    marginBottom: 130,
    marginTop: 10,
  },
  grid: {
    stroke: "#fff",
    strokeWidth: 1,
  },
  personalizedCard: {
    borderRadius: 31,
    width: 260,
    padding: 20,
    margin: 10,
    overflow: "hidden",
    flexDirection: "column",
    // alignItems: "center",
    justifyContent: "space-between",
  },
  personalizedText: {
    fontSize: 20,
    fontFamily: "RedHatBold",
  },
  personalizedText1: {
    fontSize: 20,
    fontFamily: "RedHatMedium",
  },
  personalized: {
    marginTop: 25,
    
    width: "90%",
    marginLeft: "auto",
    marginRight: "auto",
  },
  describeCardText: {
    fontSize: 15,
    marginLeft: 10,
    wordWrap: "wrap",
    color: "#fff",
    fontFamily: "RedHatBold",
  },
  describeCarImage: {
    fontSize: 36,
  },
  describeCard: {
    marginTop: 10,
    width: "90%",
    marginLeft: "auto",
    marginRight: "auto",
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFB400",
    padding: 18,
    borderRadius: 21,
  },
  headerWrap: {
    flexDirection: "row",
    width: "90%",
    marginLeft: "auto",
    marginRight: "auto",
    justifyContent: "space-between",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardHeaderText: {
    flexDirection: "column",
    alignItems: "flex-end",
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 100 / 2,
    position: "absolute",
    bottom: -30,
    zIndex: -1,
    left: -30,
  },
  cardContent: {
    marginTop: 50,
  },
  homeContainer: {
    marginTop: 80,
  },
  cardContainer: {
    marginLeft: 10,
    marginTop: 20,
  },
  calendar: {
    // backgroundColor: "#fff",
    width: 25,
    height: 25,
    opacity: 0.5,
  },
  headerButtonImage: {
    justifyContent: "center",
    width: 45,
    height: 45,
    margin: 6,
  },
  cardHeaderText1: {
    fontSize: 16,
    color: "#E4E4E4",
    fontFamily: "RedHatMedium",
  },
  cardHeaderText2: {
    fontSize: 34,
    lineHeight: 34,
    color: "#fff",
    fontFamily: "RedHatBold",
  },
  cardHeaderImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 18,
    fontWeight: "500",
    fontFamily: "RedHatRegular",
  },
  smalltext: {
    fontSize: 24,
    lineHeight: 22,
    fontWeight: "500",
    fontFamily: "RedHatBold",
    color: "#fff",
  },
  bigtext: {
    fontSize: 33,
    lineHeight: 40,
    marginTop: 9,
    fontWeight: "700",
    fontFamily: "RedHatBold",
    color: "#fff",
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
    fontFamily: "RedHatBold",
  },
  card: {
    width: 200,
    height: 200,
    margin: 10,
    padding: 16,
    position: "relative",
    overflow: "hidden",
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 35,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 2,
  },
  cardImage: {
    width: "100%",
    height: 120,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    margin: 10,
  },
});
