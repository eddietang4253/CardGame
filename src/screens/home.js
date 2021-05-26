import React, { Component } from "react";
import { StyleSheet, View, Alert, SafeAreaView, Text } from "react-native";

import Steps from "../components/steps";
import Card from "../components/card";
import { px } from "App/config";
import { shuffle } from "lodash";

import FlipcardContext from "../context/flipcard";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isStarted: false,
      loading: true,
      isEnabled: true,
      values: [],
      active: [],
      completed: 0,
      score: 0,
      steps: 0,
      items: [],
      cardTapped: async (index, value) => {
        if (!this.state.isEnabled) {
          return false;
        }
        this.setState({ steps: this.state.steps + 1 });

        let item = await this.state.items[index];

        await this.state.setActive(item);

        var clone = this.state.items.slice(0);

        clone[index].isOpened = true;

        await this.setState({
          items: clone,
        });

        if (this.state.active.length > 1) {
          if (this.state.active[0].value == this.state.active[1].value) {
            await this.state.setScore();

            await this.state.destroyActive();
          } else {
            await this.setState({
              isEnabled: false,
            });

            await setTimeout(async () => {
              var clone = this.state.items.slice(0);
              clone[this.state.active[0].key].isOpened = false;
              clone[this.state.active[1].key].isOpened = false;
              await this.state.destroyActive();
              await this.setState({
                isEnabled: true,
              });
            }, 500);
          }
        }
      },
      setScore: async () => {
        await this.setState({ score: this.state.score + 1 });
      },
      setActive: async (value) => {
        await this.setState({
          active: [...this.state.active, value],
        });
      },
      destroyActive: () => {
        this.setState({
          active: [],
        });
      },
      resetGame: () => {
        this.setState({
          loading: true,
          isStarted: false,
          score: 0,
          steps: 0,
          active: [],
        });

        this._loadValues(0);
      },
      startGame: () => {
        this.setState(
          {
            isStarted: true,
          },
          () => {
            this.setState({ loading: false });
          }
        );
      },
    };
  }

  async componentWillMount() {
    await this._loadValues();
  }
  getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

  async getNumbersArray() {
    var arr = [];
    while (arr.length < 6) {
      var r = Math.floor(Math.random() * 100) + 1;
      if (arr.indexOf(r) === -1) arr.push(r);
    }
    return arr;
  }
  async _loadValues() {
    let numArr = await this.getNumbersArray();
    let values = numArr
      .map((i) => {
        return [i, i];
      })
      .reduce((a, b) => {
        return a.concat(b);
      });

    values = shuffle(values);

    let items = values.map((value, key) => {
      return {
        isOpened: false,
        isMatched: false,
        key,
        value,
      };
    });

    this.setState(
      {
        values,
        items,
      },
      () => {
        this.state.startGame();
      }
    );
  }

  async _loadItems() {
    let items = this.state.values.map((value, key) => {
      return {
        isOpened: false,
        isMatched: false,
        key,
        value,
      };
    });

    await this.setState({
      items,
    });
  }

  _resetGame() {
    Alert.alert(
      "Restart the game",
      "Are You Sure ?",
      [
        { text: "Cancel", onPress: () => {}, style: "cancel" },
        {
          text: "Ok",
          onPress: () => {
            this.state.resetGame();
          },
        },
      ],
      { cancelable: true }
    );
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.score !== this.state.score) {
      if (this.state.score === this.state.values.length / 2) {
        Alert.alert(
          "Congratulations!",
          "You win this game by " + this.state.steps + " steps!",

          [
            {
              text: "Try another round",
              onPress: () => {
                this.state.resetGame();
              },

              style: "cancel",
            },
          ],
          {
            cancelable: true,
            onDismiss: () =>
              Alert.alert(
                "This alert was dismissed by tapping outside of the alert dialog."
              ),
          }
        );
      }
    }
  }
  render() {
    let cards = this.state.values.map((val, key) => (
      <Card
        key={key}
        index={key}
        value={val}
        isOpened={false}
        isMatched={false}
      />
    ));

    const view = (
      <View style={styles.gameContainer}>
        <View style={styles.header}>
          <Text style={styles.resetGame} onPress={this._resetGame.bind(this)}>
            Restart
          </Text>
          <Steps />
        </View>
        <View style={styles.cardsContainer}>{cards}</View>
      </View>
    );

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#000000B3" }}>
        <FlipcardContext.Provider value={this.state}>
          {this.state.loading === false && (
            <View style={{ flex: 1 }}>{view}</View>
          )}
        </FlipcardContext.Provider>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  gameContainer: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
  },
  header: { flexDirection: "row", width: "100%" },
  cardsContainer: {
    flex: 5,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    marginTop: px(20),
  },
  resetGame: {
    color: "#1792e9",
    paddingHorizontal: px(20),
    paddingVertical: px(12),
    fontSize: px(16),
  },
});
