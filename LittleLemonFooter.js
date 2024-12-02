import * as React from 'react'
import { View, StyleSheet, Pressable, Text } from 'react-native'

export default function LittleLemonFooter(){
    return(
        <View style={Styles.container}>
            <Pressable style={Styles.button}>
                <Text style={Styles.buttonText}>Next</Text>
            </Pressable>
        </View>
    );
}

const Styles = StyleSheet.create({
    container: {
        backgroundColor: '#d0d7d9'
    },
    text: {
        fontSize: 18,
        color: '#FFFFFF',
        textAlign: 'center',
        fontStyle: 'italic',
    },
    button: {
        padding: 10,
        margin: 20,
        borderRadius: 10,
        width: '30%',
        alignSelf: 'flex-end',
        backgroundColor: '#aeb3b5'
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 20,
    },
});