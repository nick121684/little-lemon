import { StyleSheet, View, Image, Text, Pressable, FlatList, SafeAreaView, SectionList } from 'react-native'
import { useState, useEffect, useMemo, useCallback } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as SQLite from 'expo-sqlite'
import { Searchbar } from 'react-native-paper'
import debounce from 'lodash.debounce'
import Filters from '../components/Filters'
import { getSectionListData, useUpdateEffect } from '../utils'
import { filterByQueryAndCategories } from '../database'

const db = SQLite.openDatabaseSync('little_lemon')
const sections = ['starters', 'mains', 'desserts', 'drinks', 'specials']

const Home = ( {navigation} ) => {

    const [firstName, setFirstname] = useState('')
    const [lastName, setLastName] = useState('')
    const [image, setImage] = useState(null)
    const [menu, setMenu] = useState([])
    const [searchBarText, setSearchBarText] = useState('')
    const [query, setQuery] = useState('')
    const [filterSelections, setFilterSelections] = useState(
        sections.map(() => false)
    )

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
                'create table if not exists menu (id integer primary key not null, name text, description text, price decimal(10,2), image text, category text);'
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
            console.log(menuItems)
            return menuItems
        }catch(e){
            console.log(`An error occured ${e}`)
        }
    }

    const saveMenu = async (dbMenuToSave) => {
        try{
            let sqlInsert = 'insert into menu (name, description, price, image, category) values '
            dbMenuToSave.map((item) => { 
                sqlInsert = sqlInsert + `('${item.name}', '${item.description.replace(/'/g, "''")}', ${item.price}, '${item.image}', '${item.category}'),`
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
                const sectionListData = getSectionListData(apiMenu);
                setMenu(sectionListData)
            }else{
                const sectionListData = getSectionListData(dbMenu);
                setMenu(sectionListData)
            }
        })()
    }, [])

    useUpdateEffect(() => {
        (async () => {
            const activeCategories = sections.filter((s, i) => {
                if(filterSelections.every((item) => item === false)){
                    return true
                }
                return filterSelections[i]
            })
            try{
                const menuItems = await filterByQueryAndCategories(
                    query,
                    activeCategories
                )
                const sectionListData = getSectionListData(menuItems)
                setMenu(sectionListData)
            }catch(e){
                console.log(`An error occured: ${e}`)
            }
        })()
    }, [filterSelections, query])

    const lookup = useCallback((q) => {
        setQuery(q)
    }, [])

    const debouncedLookup = useMemo(() => debounce(lookup, 500), [lookup])

    const handleSearchChange = (text) => {
        setSearchBarText(text);
        debouncedLookup(text);
    }

    const handleFiltersChange = async (index) => {
        const arrayCopy = [...filterSelections]
        arrayCopy[index] = !filterSelections[index]
        setFilterSelections(arrayCopy)
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image
                    source={require('../assets/back-circle.png')}
                    resizeMode="contain"
                    style={styles.backCircle}
                />
                <Image
                    source={require('../assets/little-lemon-logo.png')}
                    resizeMode="contain"
                    style={styles.headerLogo}
                />
                <Pressable onPress={() => navigation.navigate('Profile')}>
                    {image && typeof image === 'string' ? (
                        <Image source={{ uri: image }} style={styles.imageTop} />
                    ) : (
                        <View style={styles.noImageTop}>
                            <Text style={styles.noImageText}>
                                {firstName?.[0]?.toUpperCase()}
                                {lastName?.[0]?.toUpperCase()}
                            </Text>
                        </View>
                    )}
                </Pressable>
            </View>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.heroContainer}>
                    <View style={styles.heroTopContainer}>
                        <View style={styles.heroLeftContainer}>
                            <Text style={styles.heroTitle}>Little Lemon</Text>
                            <Text style={styles.heroLocation}>Chicago</Text>
                            <Text style={styles.heroDescription}>
                                We are a family-owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.
                            </Text>
                        </View>
                        <View style={styles.heroRightContainer}>
                            <Image
                                source={require('../assets/hero-image.jpg')}
                                resizeMode="contain"
                                style={styles.heroImage}
                            />
                        </View>
                    </View>
                    <Searchbar
                        onChangeText={handleSearchChange}
                        value={searchBarText}
                        style={styles.searchBar}
                        iconColor="#546861"
                        inputStyle={{ color: 'black' }}
                        elevation={0}
                    />
                </View>
                <Filters
                    selections={filterSelections}
                    onChange={handleFiltersChange}
                    sections={sections}
                />
                <SectionList
                    sections={menu}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.menuContainer}>
                            <View style={styles.menuLeftContainer}>
                                <Text style={styles.menuItemText}>{item.name}</Text>
                                <Text style={styles.menuDescriptionText}>{item.description}</Text>
                                <Text style={styles.menuPriceText}>${item.price}</Text>
                            </View>
                            <Image
                                source={{
                                    uri: `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${item.image}?raw=true`,
                                }}
                                resizeMode="contain"
                                style={styles.menuImage}
                            />
                        </View>
                    )}
                    renderSectionHeader={({ section: { title } }) => (
                        <Text style={styles.sectionHeader}>{title}</Text>
                    )}
                />
            </SafeAreaView>
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
        marginTop: 10,
        marginBottom: 5
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
        height: 100,
        width: 100,
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
    heroContainer: {
        backgroundColor: '#546861',
    },
    heroTitle: {
        color: '#F3D147',
        fontSize: 38,
        fontFamily: 'Times New Roman',
        marginLeft: 10
    },
    heroLocation: {
        color: '#FFFFFF',
        fontSize: 26,
        fontFamily: 'Times New Roman',
        marginLeft: 10
    },
    heroDescription: {
        color: '#FFFFFF',
        marginTop: 20,
        marginLeft: 10
    },
    heroTopContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    heroLeftContainer: {
        width: '55%'
    },
    heroRightContainer: {
        width: '45%'
    },
    heroImage:{
        height: 140,
        width: 140,
        marginLeft: 20,
        borderRadius: 20,
        marginTop: 10
    },
    searchBar: {
        marginBottom: 10,
        marginTop: 10,
        backgroundColor: '#FFFFFF',
        shadowRadius: 0,
        shadowOpacity: 0,
        width: '90%',
        alignSelf: 'center',
        borderRadius: 15
    },
    sectionHeader: {
        fontSize: 24,
        paddingVertical: 8,
        color: '#F3D147',
        backgroundColor: '#546861',
    },
})