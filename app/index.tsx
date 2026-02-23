import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";

export default function Home() {
  //Cambios de estados
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Datos para la consulta
  const city = "Madrid"; // Hardcoded para propositos de pruebas
  const apiKey = process.env.EXPO_PUBLIC_WEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setWeather(data);
        setLoading(false);
      });
  }, [url]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Construimos la URL del icono si tenemos los datos
  const iconUrl = weather?.weather?.[0]?.icon
    ? `https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`
    : null;

  return (
    <View style={styles.container}>
      {weather && weather.main ? (
        <View style={styles.card}>
          <Text style={styles.city}>{weather.name}</Text>
          {/* AQUÍ ESTÁ EL ICONO DINÁMICO */}
          {iconUrl && (
            <Image source={{ uri: iconUrl }} style={styles.weatherIcon} />
          )}
          <Text style={styles.temp}>{Math.round(weather.main.temp)}°C</Text>
          <Text style={styles.description}>
            {weather.weather[0].description}
          </Text>
          <View style={styles.extraInfo}>
            <Text>Humedad: {weather.main.humidity}%</Text>
            <Text>Sensacion Termica: {weather.main.feels_like}°C</Text>
            {/* <Text>Viento: {weather.main.wind_speed} m/s</Text> */}
          </View>
        </View>
      ) : (
        <Text>No se pudieron cargar los datos!</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2067a8",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "white",
    padding: 30,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  city: {
    fontSize: 24,
    fontWeight: "bold",
  },
  weatherIcon: {
    width: 120,
    height: 120,
  },
  temp: {
    fontSize: 60,
    fontWeight: "300",
    marginVertical: 10,
  },
  description: {
    fontSize: 18,
    color: "gray",
    textTransform: "capitalize",
  },
  extraInfo: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 10,
  },
});
