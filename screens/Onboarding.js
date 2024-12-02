import { StyleSheet, Text, View, TextInput, Pressable, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { validateEmail, validateFirstName } from '../utils';
import useUpdate from '../utils/useUpdate'
import AsyncStorage from '@react-native-async-storage/async-storage';

const Onboarding = () => {

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

    return(
        <>
        <View style={styles.container}>
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
                style={[styles.button, isInputValid ? styles.enableButton : styles.disableButton]}
                disabled={!isInputValid}
                onPress={() => setOnboarded(!onboarded)}
            >
                <Text style={styles.buttonText}>Next</Text>
            </Pressable>
        </View>
        </>
    )
}

export default Onboarding

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff'
    },
    text:{
        fontSize: 22,
        color: '#535657',
        textAlign: 'center',
        marginTop: 50,
        fontWeight: 'bold'
    },
    inputText:{
        fontSize: 22,
        color: '#535657',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    inputBox: {
        height: 50,
        margin: 12,
        width: '75%',
        borderWidth: 2,
        padding: 10,
        fontSize: 16,
        borderColor: '#535657',
        backgroundColor: '#aeb3b5',
        borderRadius: 10,
        alignSelf: 'center'
    },
    inputContainer:{
        paddingTop: 100
    },
    buttonContainer: {
        backgroundColor: '#d0d7d9'
    },
    button: {
        padding: 10,
        margin: 20,
        borderRadius: 10,
        width: '30%',
        alignSelf: 'flex-end',
    },
    enableButton: {
        backgroundColor: '#000000'
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