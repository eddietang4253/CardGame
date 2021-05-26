import React, { Component } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import FlipcardContext from "../context/flipcard";

export default class App extends Component {
  render() {
    return (
      <View style={styles.container}>
        <FlipcardContext.Consumer>
          {(context) => (
            <Text style={styles.stepsLabel}>
              STEPS:<Text style={styles.stepsNumber}>{context.steps}</Text>
            </Text>
          )}
        </FlipcardContext.Consumer>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 20,
  },
  stepsLabel: {
    fontSize: 25,
    marginTop: 5,
    color: "#fff",
  },
  stepsNumber: {
    fontSize: 30,
    marginTop: 5,
    color: "#1792e9",
  },
});
