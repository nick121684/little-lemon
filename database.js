import * as SQLite from 'expo-sqlite'

const db = SQLite.openDatabaseSync('little_lemon')

export async function filterByQueryAndCategories(query, activeCategories) {
      const placeholders = activeCategories.map(() => '?').join(', ')
  
      if(query.length) {
         const queryAndCategoryItems = db.getAllSync(
            `SELECT * FROM menu WHERE name LIKE ? AND category IN (${placeholders})`, 
            [`%${query}%`, ...activeCategories]
          )
          return queryAndCategoryItems
      } else {
          const categoryItems = db.getAllSync(
            `SELECT * FROM menu WHERE category IN (${placeholders})`, 
            activeCategories
          )
          console.log(categoryItems)
          return categoryItems
      }
  }