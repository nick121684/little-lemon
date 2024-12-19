import { View, TouchableOpacity, Text, StyleSheet } from 'react-native'

const Filters = ({ onChange, selections, sections }) => {
  return (
    <View style={styles.filtersContainer}>
      {sections.map((section, index) => (
        <TouchableOpacity
          key={section}
          onPress={() => {
            onChange(index)
          }}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            padding: 10,
            backgroundColor: selections[index] ? '#495E57' : '#EDEFEE',
            borderWidth: 1,
            borderColor: 'white',
            borderRadius: 18,
            marginTop: 5,
            marginLeft: 7,
          }}>
          <View>
            <Text style={{ color: selections[index] ? 'white' : '#4D5D58' }}>
              {section}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  filtersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
})

export default Filters
