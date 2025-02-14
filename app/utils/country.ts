import axios from "axios";

export async function getCountryInformation(params) {
  console.log("params :>> ", params);
  const country = params.country;

  try {
    const url = `https://restcountries.com/v3.1/name/${encodeURIComponent(
      country
    )}`;
    const response = await axios.get(url);
    // console.log(response.data); if you want to inspect the output
    return JSON.stringify(response.data);
  } catch (error) {
    console.error(error);
    return null;
  }
}
