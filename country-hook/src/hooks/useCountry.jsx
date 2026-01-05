import { useState, useEffect } from 'react'
import { getCountry } from '../service/country'

const useCountry = (name) => {
  const [country, setCountry] = useState(null)

  useEffect(() => {
    if (!name) {
      setCountry(null)
      return
    }

    const fetchCountry = async () => {
      const result = await getCountry(name)

      if (result && result.found) {
        const formatted = {
          found: true,
          data: {
            name: result.data.name.common,
            capital: result.data.capital[0],
            population: result.data.population,
            flag: result.data.flags.png
          }
        }
        setCountry(formatted)
      } else {
        setCountry({ found: false })
      }
    }

    fetchCountry()

  }, [name])

  return country
}

export default useCountry
