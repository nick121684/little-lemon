import { useRef, useEffect } from 'react'

export const validateEmail = (email) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
}

export const validateFirstName = (firstName) => {
  const regex = /^[a-zA-Z]+$/
  return regex.test(firstName)
}

export const validatePhoneNumber = (phoneNumber) => {
  const regex = /^(?:\(\d{3}\)\s?|\d{3}[-.\s])?\d{3}[-.\s]?\d{4}$/
  return regex.test(phoneNumber)
}

export function getSectionListData(data) {
  const transformData = (data) => {
    const grouped = data.reduce((acc, item) => {
      if(!acc[item.category]){
        acc[item.category] = []
      }

      acc[item.category].push({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        image: item.image
      })

      return acc
    }, {})

    return Object.keys(grouped).map((category) => ({
      title: category,
      data: grouped[category]
    }))
  }
  const outputData = transformData(data)
  return outputData
}

export function useUpdateEffect(effect, dependencies = []) {
  const isInitialMount = useRef(true)

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
    } else {
      return effect()
    }
  }, dependencies)
}