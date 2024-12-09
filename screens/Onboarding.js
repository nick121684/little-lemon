import { StyleSheet, Text, View, TextInput, Pressable, Alert, Image } from 'react-native';
import { useState, useEffect } from 'react';
import { validateEmail, validateFirstName } from '../utils';
import useUpdate from '../utils/useUpdate'
import AsyncStorage from '@react-native-async-storage/async-storage';

const Onboarding = ( {navigation} ) => {
    const [ email, setEmail ] = useState('')
    const [ firstName, setFirstName ] = useState('')
    const isInputValid = validateEmail(email) && validateFirstName(firstName)
    const [ onboarded, setOnboarded ] = useState(false)

    useEffect(() => {
        (async () => {
            try{
                const value = await AsyncStorage.getItem('onboarded')
                if(value !== null){
                    setOnboarded(JSON.parse(value))
                }else{
                    setOnboarded(false)
                }
            }catch(e){
                setOnboarded(false)
                Alert.alert(`An error occured: ${e}`)
            }
        })()
    }, [])

    useUpdate(() => {
        (async () => {
            try{
                await AsyncStorage.setItem('onboarded', JSON.stringify(onboarded))
                await AsyncStorage.setItem('firstName', JSON.stringify(firstName))
                await AsyncStorage.setItem('email', JSON.stringify(email))
            }catch(e){
                Alert.alert(`An error occured: ${e}`)
            }
        })()
    }, [onboarded, firstName, email]) 

    const subscribe = () => {
        setOnboarded(!onboarded)
        navigation.navigate('Profile')
    }

    return(
        <>
        <View style={styles.container}>
        <View style={styles.header}>
            <Image
                source={require('../assets/little-lemon-logo.png')}
                resizeMode='contain'
                style={styles.headerLogo}
            />
        </View>
            <Text style={styles.text}>Let us get to know you</Text>
            <View style={styles.inputContainer}>
                <Text style={styles.inputText}>First Name</Text>
                <TextInput 
                    style={styles.inputBox}
                    value={firstName}
                    onChangeText={setFirstName} 
                />
                <Text style={styles.inputText}>Email</Text>
                <TextInput 
                    style={styles.inputBox} 
                    keyboardType='email-address'
                    value={email}
                    onChangeText={setEmail}
                />
            </View>
        </View>
        <View style={styles.buttonContainer}>
            <Pressable 
                style={[styles.logOutButton, isInputValid ? styles.enableButton : styles.disableButton]}
                disabled={!isInputValid}
                onPress={() => subscribe()}
            >
                <Text style={styles.buttonText}>Next</Text>
            </Pressable>
        </View>
        </>
    )
}

export default Onboarding

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#ffffff',
    },
    headerLogo: {
        marginTop: 35,
        marginBottom: 10,
        width: 150,
        height: 50,
        alignSelf: 'center'
    },
    container: {
        flex: 1,
        backgroundColor: '#ffffff'
    },
    text: {
        fontWeight: 'bold',
        color: '#525263',
        fontSize: 22,
        textAlign: 'center',
        marginTop: 50
    },
    inputText:{
        fontSize: 22,
        color: '#525263',
        textAlign: 'center'
    },
    inputBox: {
        height: 50,
        margin: 12,
        width: '75%',
        padding: 10,
        fontSize: 16,
        borderColor: '#E0E0E0',
        borderWidth: 1,
        color: '#525263',
        borderRadius: 10,
        alignSelf: 'center'
    },
    inputContainer:{
        paddingTop: 100
    },
    buttonContainer: {
        backgroundColor: '#FFFFFF',
        paddingBottom: 20
    },
    button: {
        padding: 10,
        margin: 20,
        borderRadius: 10,
        width: '30%',
        alignSelf: 'flex-end',
    },
    logOutButton: {
        padding: 10,
        borderRadius: 8,
        margin: 10
    },
    enableButton: {
        backgroundColor: '#546861'
    },
    disableButton: {
        backgroundColor: '#aeb3b5'
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 20,
    }
})