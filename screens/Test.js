import { View, Text } from 'react-native'
import * as SQLite from 'expo-sqlite'
import { useEffect } from 'react'

const db = SQLite.openDatabaseSync('databaseName');

// `getAllAsync()` is useful when you want to get all results as an array of objects.
const allRows = db.getAllSync('SELECT * FROM test');
for (const row of allRows) {
  console.log(row.id, row.value, row.intValue);
}

// // `getEachAsync()` is useful when you want to iterate SQLite query cursor.
// for await (const row of db.getEachAsync('SELECT * FROM test')) {
//   console.log(row.id, row.value, row.intValue);
// }

export default function Test(){
    console.log('golden')
    
    return (
        <View>
            <Text style='color: white'>Here</Text>
        </View>
    )
}