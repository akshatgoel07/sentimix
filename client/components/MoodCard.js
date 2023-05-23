import React from 'react'

const MoodCard = (props) => {
    return (
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
            <Text style={styles.smalltext}>{item.smalltext}</Text>
            <Text style={styles.bigtext}>{item.bigtext}</Text>
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
      );
}

export default MoodCard