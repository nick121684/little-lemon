import { Text, View, StyleSheet, Pressable, Image, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as ImagePicker from 'expo-image-picker'
import CheckBox from 'expo-checkbox'
import { validateEmail, validateFirstName, validatePhoneNumber } from '../utils'
import * as ImageManipulator from 'expo-image-manipulator'

const Profile = ( {navigation} ) =>{
    const [email, setEmail] = useState('')
    const [firstName, setFirstname] = useState('')
    const [lastName, setLastName] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [image, setImage] = useState(null)
    const [isCheckedOrderStatuses, setIsCheckedOrderStatuses] = useState(false)
    const [isCheckedPasswordChanges, setIsCheckedPasswordChanges] = useState(false)
    const [isCheckedSpecialOffers, setIsCheckedSpecialOffers] = useState(false)
    const [isCheckedNewsletter, setIsCheckedNewsletter] = useState(false)

    useEffect (() => {
        (async () => {
            try{
                const asyncEmail = await AsyncStorage.getItem('email')
                const asyncFirstName = await AsyncStorage.getItem('firstName')
                const asyncLastName = await AsyncStorage.getItem('lastName')
                const asyncPhoneNumber = await AsyncStorage.getItem('phoneNumber')
                const asyncOrderStatuses = await AsyncStorage.getItem('orderStatuses')
                const asyncPasswordChanges = await AsyncStorage.getItem('passwordChanges')
                const asyncSpecialOffers = await AsyncStorage.getItem('specialOffers')
                const asyncNewsletter = await AsyncStorage.getItem('newsletter')
                const asyncImage = await AsyncStorage.getItem('image')
                setEmail(JSON.parse(asyncEmail.toLowerCase()))
                setFirstname(JSON.parse(asyncFirstName))
                setLastName(JSON.parse(asyncLastName))
                setPhoneNumber(JSON.parse(asyncPhoneNumber))
                setIsCheckedOrderStatuses(JSON.parse(asyncOrderStatuses))
                setIsCheckedPasswordChanges(JSON.parse(asyncPasswordChanges))
                setIsCheckedSpecialOffers(JSON.parse(asyncSpecialOffers))
                setIsCheckedNewsletter(JSON.parse(asyncNewsletter))
                setImage(JSON.parse(asyncImage))
            }catch(e){
                console.log(`An error occured: ${e}`)
            }
        })()
    }, [])

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images', 'videos'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
        setImage(result.assets[0].uri);
        }
    };

    const removeImage = () => {
        setImage(null)
    }

    const saveChanges = async () => {
        try{
            await AsyncStorage.setItem('firstName', JSON.stringify(firstName))
            await AsyncStorage.setItem('lastName', JSON.stringify(lastName))
            await AsyncStorage.setItem('email', JSON.stringify(email))
            await AsyncStorage.setItem('phoneNumber', JSON.stringify(phoneNumber))
            await AsyncStorage.setItem('passwordChanges', JSON.stringify(isCheckedPasswordChanges))
            await AsyncStorage.setItem('orderStatuses', JSON.stringify(isCheckedOrderStatuses))
            await AsyncStorage.setItem('specialOffers', JSON.stringify(isCheckedSpecialOffers))
            await AsyncStorage.setItem('newsletter', JSON.stringify(isCheckedNewsletter))
            await AsyncStorage.setItem('image', JSON.stringify(image))
        }catch(e){
            console.log(`An error occured: ${e}`)
        }
    }

    const discardChanges = async () => {
        try{
            const asyncEmail = await AsyncStorage.getItem('email')
            const asyncFirstName = await AsyncStorage.getItem('firstName')
            const asyncLastName = await AsyncStorage.getItem('lastName')
            const asyncPhoneNumber = await AsyncStorage.getItem('phoneNumber')
            const asyncOrderStatuses = await AsyncStorage.getItem('orderStatuses')
            const asyncPasswordChanges = await AsyncStorage.getItem('passwordChanges')
            const asyncSpecialOffers = await AsyncStorage.getItem('specialOffers')
            const asyncNewsletter = await AsyncStorage.getItem('newsletter')
            const asyncImage = await AsyncStorage.getItem('image')
            setEmail(JSON.parse(asyncEmail.toLowerCase()))
            setFirstname(JSON.parse(asyncFirstName))
            setLastName(JSON.parse(asyncLastName))
            setPhoneNumber(JSON.parse(asyncPhoneNumber))
            setIsCheckedOrderStatuses(JSON.parse(asyncOrderStatuses))
            setIsCheckedPasswordChanges(JSON.parse(asyncPasswordChanges))
            setIsCheckedSpecialOffers(JSON.parse(asyncSpecialOffers))
            setIsCheckedNewsletter(JSON.parse(asyncNewsletter))
            setImage(JSON.parse(asyncImage))
        }catch(e){
            console.log(`An error occured: ${e}`)
        }
    }

    const logOut = async () => {
        try{
            await AsyncStorage.clear()
            setEmail('')
            setFirstname('')
            setLastName('')
            setPhoneNumber('')
            setImage('')
            setIsCheckedNewsletter(false)
            setIsCheckedOrderStatuses(false)
            setIsCheckedPasswordChanges(false)
            setIsCheckedSpecialOffers(false)
            navigation.navigate('Onboarding')
        }catch(e){
            console.log(`An error occured: ${e}`)
        }
    }

    const isValid = validateEmail(email) && validateFirstName(firstName) && validatePhoneNumber(phoneNumber)

    return (
        <View style={styles.container}>
        <View style={styles.header}>
            <Pressable
                onPress={() => navigation.goBack()}
            >
                <Image
                source={require('../assets/back-circle.png')}
                resizeMode='contain'
                style={styles.backCircle}
                />
            </Pressable>
            <Image
                source={require('../assets/little-lemon-logo.png')}
                resizeMode='contain'
                style={styles.headerLogo}
            />
            {image && typeof image === 'string' && (
                <Image source={{ uri: image }} style={styles.imageTop} />
            )}
            {(!image || typeof image !== 'string') && (
                <View style={styles.noImageTop}>
                    <Text style={styles.noImageText}>
                    {firstName?.[0]?.toUpperCase()}{lastName?.[0]?.toUpperCase()}
                    </Text>
                </View>
            )}
        </View>
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}
        >
        <ScrollView>
            <View style={styles.innerContainer}>
                <Text style={styles.largeText}>Personal information</Text>
                <Text style={styles.sectionText}>Avatar</Text>
                <View style={styles.avatarContainer}>
                    {image && typeof image === 'string' && (
                        <Image source={{ uri: image }} style={styles.image} />
                    )}
                    {(!image || typeof image !== 'string') && (
                        <View style={styles.noImage}>
                            <Text style={styles.noImageText}>
                            {firstName?.[0]?.toUpperCase()}{lastName?.[0]?.toUpperCase()}
                            </Text>
                        </View>
                    )}
                    <Pressable style={styles.darkButton} title="Change" onPress={pickImage}>
                        <Text style={styles.darkButtonText}>Change</Text>
                    </Pressable>
                    <Pressable style={styles.lightButton} title="Remove" onPress={removeImage}>
                        <Text style={styles.lightButtonText}>Remove</Text>
                    </Pressable>
                </View>
                <Text style={styles.sectionText}>First name</Text>
                <TextInput
                    style={styles.inputBox}
                    value={firstName}
                    onChangeText={setFirstname}
                />
                <Text style={styles.sectionText}>Last name</Text>
                <TextInput
                    style={styles.inputBox}
                    value={lastName}
                    onChangeText={setLastName}
                />
                <Text style={styles.sectionText}>Email</Text>
                <TextInput
                    style={styles.inputBox}
                    value={email}
                    onChangeText={setEmail}
                />
                <Text style={styles.sectionText}>Phone Number</Text>
                <TextInput
                    style={styles.inputBox}
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                />
                <Text style={styles.largeTextEmail}>Email notifications</Text>
                <View style={styles.checkboxContainer}>
                    <CheckBox
                        value={isCheckedOrderStatuses}
                        onValueChange={(newValueOrderStatuses) => setIsCheckedOrderStatuses(newValueOrderStatuses)}
                        color={isCheckedOrderStatuses ? '#546861' : ''}
                        style={styles.checkBoxStyle}
                    />
                    <Text style={styles.checkboxText}>Order Statuses</Text>
                </View>
                <View style={styles.checkboxContainer}>
                    <CheckBox
                        value={isCheckedPasswordChanges}
                        onValueChange={(newValuePasswordChanges) => setIsCheckedPasswordChanges(newValuePasswordChanges)}
                        color={isCheckedPasswordChanges ? '#546861' : ''}
                        style={styles.checkBoxStyle}
                    />
                    <Text style={styles.checkboxText}>Password Changes</Text>
                </View>
                <View style={styles.checkboxContainer}>
                    <CheckBox
                        value={isCheckedSpecialOffers}
                        onValueChange={(newValueSpecialOffers) => setIsCheckedSpecialOffers(newValueSpecialOffers)}
                        color={isCheckedSpecialOffers ? '#546861' : ''}
                        style={styles.checkBoxStyle}
                    />
                    <Text style={styles.checkboxText}>Special Offers</Text>
                </View>
                <View style={styles.checkboxContainer}>
                    <CheckBox
                        value={isCheckedNewsletter}
                        onValueChange={(newValueNewsletter) => setIsCheckedNewsletter(newValueNewsletter)}
                        color={isCheckedNewsletter ? '#546861' : ''}
                        style={styles.checkBoxStyle}
                    />
                    <Text style={styles.checkboxText}>Newsletter</Text>
                </View>
                <Pressable style={styles.logOutButton} title="Log out" onPress={logOut}>
                    <Text style={styles.logOutText}>Log out</Text>
                </Pressable>
                <View style={styles.buttonContainer}>
                    <Pressable style={styles.discardButton} title="Discard changes" onPress={discardChanges}>
                        <Text style={styles.lightButtonText}>Discard changes</Text>
                    </Pressable>
                    <Pressable 
                        style={isValid ? styles.saveButtonEnabled : styles.saveButtonDisabled} 
                        title="Save changes" 
                        disabled={!isValid}
                        onPress={saveChanges}>
                        <Text style={isValid ? styles.darkButtonText : styles.lightButtonText}>Save changes</Text>
                    </Pressable>
                </View>
            </View>
        </ScrollView>
        </KeyboardAvoidingView>
        </View>
    )
}

export default Profile

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 20,
        marginBottom: 20
    },
    headerLogo: {
        marginTop: 35,
        marginBottom: 10,
        width: 150,
        height: 50,
    },
    backCircle: {
        marginTop: 35,
        marginBottom: 10,
        width: 50,
        height: 50,
        backgroundColor: '#546861',
        borderRadius: 50,
        marginLeft: 10
    },
    imageTop: {
        width: 50,
        height: 50,
        borderRadius: 50,
        marginTop: 35,
        marginBottom: 10,
        marginRight: 10
    },
    noImageTop: {
        width: 50,
        height: 50,
        marginTop: 35,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#62D6C4',
        marginBottom: 10,
        marginRight: 10
    },
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    innerContainer: {
        flex: 1,
        backgroundColor: '#ffffff',
        borderColor: '#E0E0E0',
        borderWidth: 1,
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
        padding: 15
    },
    largeText: {
        fontWeight: 'bold',
        color: '#525263',
        fontSize: 18
    },
    largeTextEmail: {
        fontWeight: 'bold',
        color: '#525263',
        fontSize: 18,
        marginTop: 15
    },
    image: {
        width: 75,
        height: 75,
        borderRadius: 37.5,
        marginRight: 10
    },
    noImage: {
        width: 75,
        height: 75,
        borderRadius: 37.5,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#62D6C4'
    },
    noImageText: {
        textAlign: 'center',
        fontSize: 30,
        color: '#ffffff'
    },
    avatarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10
    },
    checkboxContainer: {
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center'
    },
    darkButton: {
        padding: 10,
        margin: 10,
        borderRadius: 8,
        width: '25%',
        height: '50%',
        backgroundColor: '#546861'
    },
    darkButtonText: {
        color: '#ffffff',
        textAlign: 'center',
        fontSize: '12',
        fontWeight: 'bold'
    },
    lightButton: {
        padding: 10,
        margin: 10,
        borderWidth: 1,
        borderColor: '#546861',
        width: '25%',
        height: '50%',
        borderRadius: 8
    },
    lightButtonText: {
        color: '#525263',
        fontWeight: 'bold',
        fontSize: 12,
        textAlign: 'center'
    },
    logOutText: {
        color: '#221D02',
        fontWeight: 'bold',
        fontSize: 12,
        textAlign: 'center'
    },
    sectionText: {
        marginTop: 15,
        color: '#A0A2B4',
        fontSize: 11,
    },
    checkboxText: {
        color: '#A0A2B4',
        fontSize: 11,
    },
    checkBoxStyle: {
        borderRadius: 5,
        marginRight: 5
    },
    inputBox: {
        height: 40,
        marginTop: 5,
        width: '100%',
        borderWidth: 1,
        padding: 10,
        fontSize: 16,
        borderColor: '#E0E0E0',
        borderRadius: 10,
        alignSelf: 'center',
        color: '#525263',
        fontSize: 12
    },
    logOutButton: {
        backgroundColor: '#F4CE14',
        padding: 10,
        borderRadius: 8,
        borderColor: '#D7A763',
        borderWidth: 2,
        marginTop: 20
    },
    saveButtonEnabled: {
        padding: 10,
        margin: 10,
        borderRadius: 8,
        width: '45%',
        height: '70%',
        backgroundColor: '#546861'
    },
    saveButtonDisabled: {
        padding: 10,
        margin: 10,
        borderRadius: 8,
        width: '45%',
        height: '70%',
        borderWidth: 1,
        borderColor: '#546861'
    },
    discardButton: {
        padding: 10,
        margin: 10,
        borderWidth: 1,
        borderColor: '#546861',
        width: '45%',
        height: '70%',
        borderRadius: 8
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10
    },
})