import axios from 'axios';

const api_key = "AIzaSyDzJyT7Wci5pXjqOY2Vd9WnPoRkiuuzO08";

const geocodeAddress = async (addressObj) => {
  const { street, number, city, zip_code, province, country } = addressObj;

  // Construir la dirección completa
  const fullAddress = `${street} ${number}, ${city}, ${zip_code}, ${province}, ${country}`;
  
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(fullAddress)}&key=${api_key}`;

  try {
    // Realiza la solicitud HTTP utilizando axios
    const response = await axios.get(url);

    // Procesa la respuesta para obtener las coordenadas
    if (response.data.results && response.data.results.length > 0) {
      const location = response.data.results[0].geometry.location;
      const latitud = location.lat;
      const longitud = location.lng;
      console.log(`Latitud: ${latitud}, Longitud: ${longitud}`);
      return { latitud, longitud };
    } else {
      console.log('No se encontraron resultados para la dirección proporcionada.');
      return null;
    }
  } catch (error) {
    console.error('Error al obtener las coordenadas:', error);
    return null;
  }
};

export default geocodeAddress;
