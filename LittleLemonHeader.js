import * as React from 'react';
import { View, StyleSheet, Image } from 'react-native';

export default function LittleLemonHeader(){
    return (
        <View style={Styles.container}>
            <Image
                source={require('./assets/little-lemon-logo.png')}
                resizeMode='contain'
                style={Styles.image}
            />
        </View>
    );
}

const Styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffffff',
    },
    image: {
        marginTop: 35,
        width: 150,
        height: 50,
        alignSelf: 'center'
    }
});