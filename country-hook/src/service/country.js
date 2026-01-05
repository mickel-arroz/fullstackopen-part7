import axios from 'axios';

export const getCountry = async (name) => {
  try {
    const response = await axios.get(
      `https://restcountries.com/v3.1/name/${name}?fullText=true`
    );
    return { found: true, data: response.data[0] };
  } catch (error) {
    return { found: false };
  }
};
