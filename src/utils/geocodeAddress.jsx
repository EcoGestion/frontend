import axios from 'axios';

const geocodeAddress = async (addressObj) => {
  const { street, number, city, zip_code, province, country } = addressObj;

  // Construir la dirección completa
  const fullAddress = `${street} ${number}, ${city}, ${zip_code}, ${province}, ${country}`;

  const apiKey = 'cd488d28945d461ebe99d5febcc4cef4';
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(fullAddress)}&key=${apiKey}&limit=1`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    if (data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry;
      return { latitude: lat, longitude: lng };
    } else {
      throw new Error('No se encontraron coordenadas para esta dirección');
    }
  } catch (error) {
    console.error('Error al geocodificar la dirección:', error);
    return null;
  }
};

export default geocodeAddress;
