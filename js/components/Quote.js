import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Quote(props) {
    const { text, author } = props;
    return (
        <View style={ styles.container }>
            <Text style={ styles.text }>{ text }</Text>
            <Text style={ styles.author }>&mdash; { author }</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20
    },
    text: {
        fontSize: 36,
        fontStyle: 'italic',
        marginBottom: 10,
        textAlign: 'center',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 2,
        textShadowColor: 'grey',
    },
    author: {
        fontSize: 20,
        textAlign: 'right'
    }
});


