import { Text, View, StyleSheet, Pressable, Image, TextInput, ScrollView } from 'react-native'
import { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as ImagePicker from 'expo-image-picker'
import CheckBox from 'react-native-checkbox'
import { validateEmail, validateFirstName, validatePhoneNumber } from '../utils'

const Profile = () =>{
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
                setEmail(JSON.parse(asyncEmail.toLowerCase()))
                setFirstname(JSON.parse(asyncFirstName))
                setLastName(JSON.parse(asyncLastName))
                setPhoneNumber(JSON.parse(asyncPhoneNumber))
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
        }catch(e){
            console.log(`An error occured: ${e}`)
        }
    }

    const discardChanges = () => {

    }

    const logOut = () => {
        
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.innerContainer}>
                <Text style={styles.largeText}>Personal information</Text>
                <Text style={styles.sectionText}>Avatar</Text>
                <View style={styles.avatarContainer}>
                    {image && <Image source={{ uri: image }} style={styles.image} />}
                    {!image && <View style={styles.noImage}><Text style={styles.noImageText}>{firstName[0]}{lastName[0]}</Text></View>}
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
                        label='Order statuses'
                    />
                    <CheckBox
                        value={isCheckedPasswordChanges}
                        onValueChange={(newValuePasswordChanges) => setIsCheckedPasswordChanges(newValuePasswordChanges)}
                        label='Password changes'
                    />
                    <CheckBox
                        value={isCheckedSpecialOffers}
                        onValueChange={(newValueSpecialOffers) => setIsCheckedSpecialOffers(newValueSpecialOffers)}
                        label='Special offers'
                    />
                    <CheckBox
                        value={isCheckedNewsletter}
                        onValueChange={(newValueNewsletter) => setIsCheckedNewsletter(newValueNewsletter)}
                        label='Newsletter'
                    />
                </View>
                <Pressable style={styles.logOutButton} title="Log out" onPress={logOut}>
                    <Text style={styles.logOutText}>Log out</Text>
                </Pressable>
                <View style={styles.buttonContainer}>
                    <Pressable style={styles.discardButton} title="Discard changes" onPress={discardChanges}>
                        <Text style={styles.lightButtonText}>Discard changes</Text>
                    </Pressable>
                    <Pressable style={styles.saveButton} title="Save changes" onPress={saveChanges}>
                        <Text style={styles.darkButtonText}>Save changes</Text>
                    </Pressable>
                </View>
            </View>
        </ScrollView>
    )
}

export default Profile

const styles = StyleSheet.create({
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
        marginTop: 10
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
        margin: 10
    },
    saveButton: {
        padding: 10,
        margin: 10,
        borderRadius: 8,
        width: '45%',
        height: '70%',
        backgroundColor: '#546861'
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