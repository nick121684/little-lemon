import * as SQLite from 'expo-sqlite'

const db = SQLite.openDatabaseSync('little_lemon')

export const createMenuTable = async () => {
    try{
        db.execSync(
            'create table if not exists menu (id integer primary key not null, name text, description text, price decimal(10,2), image text, category text)'
        )
    }catch(e){
        console.log(`An error occured ${e}`)
    }
}

export const getMenu = async () => {
    try{
        const menuItems = db.getAllSync(
            'select * from menu'
        )
        return menuItems
    }catch(e){
        console.log(`An error occured ${e}`)
    }
}

export const saveMenu = async (dbMenuToSave) => {
    try{
        let sqlInsert = 'insert into menu (name, description, price, image, category) values '
        dbMenuToSave.map((item) => { 
            sqlInsert = sqlInsert + `('${item.name}', '${item.description.replace(/'/g, "''")}', ${item.price}, '${item.image}', '${item.category}'),`
        })
        const newSqlInsert = sqlInsert.slice(0, -1)
        const result = db.execSync(`${newSqlInsert}`)
    }catch(e){
        console.log(`An error occured ${e}`)
    }
}

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
          return categoryItems
      }
  }