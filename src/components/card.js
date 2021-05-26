import React, { Component } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";
import { px } from "App/config";
import FlipCardContext from "../context/flipcard";
import CardFlip from "react-native-card-flip";
export default class Card extends Component {
  static propTypes = {
    index: PropTypes.number,
    value: PropTypes.string,
    isOpened: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = {
      flipped: false,
    };
  }

  async _onPress(context) {
    let value = this.props.value,
      index = this.props.index;

    context.cardTapped(index, value);
    this.card.flip();
  }
  componentDidUpdate(prevProps, prevState) {
    setTimeout(() => {
      let value = this.context;
      let current = value.items[this.props.index];
      if (!current.isOpened) {
        if (this.state.flipped === true) {
          this.setState({ flipped: false }, () => {
            this.card.flip();
          });
        }
      }
    }, 1000);
  }
  render() {
    const index = this.props.index;
    return (
      <View style={styles.cardWrapper}>
        <FlipCardContext.Consumer>
          {(context) => {
            let current = context.items[index];

            var backgroundColor, activeOpacity, onPress;
            if (context.isStarted == true) {
              backgroundColor = !current.isOpened ? "#1792e9" : "#fff";
              activeOpacity = !current.isOpened ? 0.5 : 1;
              onPress = !current.isOpened
                ? this._onPress.bind(this, context)
                : () => {};
            } else {
              backgroundColor = "#1792e9";
              activeOpacity = 1;
              onPress = () => {};
            }

            return (
              <CardFlip
                style={styles.cardContainer}
                ref={(card) => (this.card = card)}
              >
                <TouchableOpacity
                  activeOpacity={1}
                  style={[styles.card, styles.card1]}
                  onPress={() =>
                    this.setState({ flipped: true }, () => {
                      onPress();
                    })
                  }
                >
                  <Text style={styles.label1}>?</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={1}
                  style={[styles.card, styles.card2]}
                >
                  <Text style={styles.label2}>{this.props.value}</Text>
                </TouchableOpacity>
              </CardFlip>

              //   <TouchableOpacity
              //     activeOpacity={activeOpacity}
              //     style={[styles.cardTouchable, { backgroundColor }]}
              //     onPress={onPress}
              //   >
              //     <Text>{txtCard}</Text>
              //   </TouchableOpacity>
            );
          }}
        </FlipCardContext.Consumer>
      </View>
    );
  }
}
Card.contextType = FlipCardContext;
const styles = StyleSheet.create({
  cardWrapper: {
    margin: px(5),
  },
  cardTouchable: {
    width: px(100),
    height: px(140),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1792e9",
    borderColor: "#fff",
    borderWidth: px(3),
    borderRadius: px(5),
  },
  cardText: {
    fontSize: px(40),
    color: "#fff",
  },
  cardContainer: {
    width: px(100),
    height: px(140),
  },
  card: {
    width: px(100),
    height: px(140),
    backgroundColor: "#FE474C",
    borderRadius: 5,
    shadowColor: "rgba(0,0,0,0.5)",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.5,
  },
  card1: {
    backgroundColor: "#1792e9",
    justifyContent: "center",
    borderColor: "#fff",
    borderWidth: px(3),
    borderRadius: px(5),
  },
  card2: {
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  label1: {
    textAlign: "center",
    fontSize: px(40),
    color: "#ffffff",
  },
  label2: {
    textAlign: "center",
    fontSize: px(40),
    color: "#333333",
  },
});
