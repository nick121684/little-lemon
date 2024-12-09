import { StyleSheet, View, Image, Text, Pressable, FlatList } from 'react-native'
import { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as SQLite from 'expo-sqlite'

const db = SQLite.openDatabaseSync('little_lemon')

const Home = ( {navigation} ) => {

    const [firstName, setFirstname] = useState('')
    const [lastName, setLastName] = useState('')
    const [image, setImage] = useState(null)
    const [menu, setMenu] = useState([])

    const getDataFromApiSync = async () => {
        try{
            const response = await fetch('https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json')
            const json = await response.json()
            return json.menu
        }catch(e){
            console.log(`An error occured: ${e}`)
        }
    }

    const createMenuTable = async () => {
        try{
            db.execSync(
                'create table if not exists menu (id integer primary key not null, name text, description text, price decimal(10,2), image text);'
            )
        }catch(e){
            console.log(`An error occured ${e}`)
        }
    }

    const getMenu = async () => {
        try{
            const menuItems = db.getAllSync(
                'select * from menu;'
            )
            return menuItems
        }catch(e){
            console.log(`An error occured ${e}`)
        }
    }

    const saveMenu = async (dbMenuToSave) => {
        try{
            let sqlInsert = 'insert into menu (name, description, price, image) values '
            dbMenuToSave.map((item) => { 
                sqlInsert = sqlInsert + `('${item.name}', '${item.description.replace(/'/g, "''")}', ${item.price}, '${item.image}'),`
            })
            const newSqlInsert = sqlInsert.slice(0, -1)
            //console.log(newSqlInsert)
            const result = db.execSync(`${newSqlInsert};`)
        }catch(e){
            console.log(`An error occured ${e}`)
        }
    }

    useEffect (() => {
        (async () => {
            try{
                const asyncFirstName = await AsyncStorage.getItem('firstName')
                const asyncLastName = await AsyncStorage.getItem('lastName')
                const asyncImage = await AsyncStorage.getItem('image')
                setFirstname(JSON.parse(asyncFirstName))
                setLastName(JSON.parse(asyncLastName))
                setImage(JSON.parse(asyncImage))
            }catch(e){
                console.log(`An error occured: ${e}`)
            }
            await createMenuTable()
            const dbMenu = await getMenu()
            if(!dbMenu.length){
                const apiMenu = await getDataFromApiSync()
                const menuToSave =  apiMenu.map(item => ({
                    ...item
                }))
                saveMenu(menuToSave)
                setMenu(apiMenu)
            }else{
                setMenu(dbMenu)
            }
        })()
    }, [])

    const renderSeperator = () => (
        <View style={styles.separator} />
    )

    return(
        <View style={styles.container}>
            <View style={styles.header}>
                <Image
                    source={require('../assets/back-circle.png')}
                    resizeMode='contain'
                    style={styles.backCircle}
                />
                <Image
                    source={require('../assets/little-lemon-logo.png')}
                    resizeMode='contain'
                    style={styles.headerLogo}
                />
                <Pressable
                    onPress={() => navigation.navigate('Profile')}
                >
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
                </Pressable>
            </View>
            <FlatList
                data={menu}
                renderItem={({item}) => (
                    <View style={styles.menuContainer}>
                        <View style={styles.menuLeftContainer}>
                            <View style={styles.menuTopElement}><Text style={styles.menuItemText}>{item.name}</Text></View>
                            <View style={styles.menuBottomElement}><Text style={styles.menuDescriptionText}>{item.description}</Text></View>
                            <View style={styles.menuPriceElement}><Text style={styles.menuPriceText}>${item.price}</Text></View>
                        </View>
                        <View style={styles.menuRightElement}>
                            <Image
                                source={{ uri: `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${item.image}?raw=true` }}
                                resizeMode='contain'
                                style={styles.menuImage}
                            />
                        </View>
                    </View>
                )}
                keyExtractor={(item) => [item.category, item.name]}
                ItemSeparatorComponent={renderSeperator}
            >
            </FlatList>
        </View>
    )
}

export default Home

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
    noImageText: {
        textAlign: 'center',
        fontSize: 30,
        color: '#ffffff'
    },
    separator: {
        height: 1,
        backgroundColor: '#ccc',
        margin: 10,
    },
    menuDescriptionText: {
        marginHorizontal: 10,
        width: '75%'
    },
    menuItemText: {
        marginHorizontal: 10,
        marginBottom: 10,
        fontWeight: 'bold',
        width: '75%'
    },
    menuImage:{
        height: 75,
        width: 75,
        marginRight: 20
    },
    menuContainer: {
        flex: 1,
        flexDirection: 'row'
    },
    menuLeftContainer: {
        flex: 1,
        justifyContent: 'space-between',
    },
    menuTopElement: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    menuBottomElement: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    menuRightElement: {
        verticalAlign: 'center'
    },
    menuPriceElement: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    menuPriceText: {
        marginHorizontal: 10,
        marginTop: 10,
        width: '75%',
        color: '#546861',
        fontWeight: 'bold'
    },
})