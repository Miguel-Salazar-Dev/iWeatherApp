import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function Home() {
  //Cambios de estados
  const [current, setCurrent] = useState<any>(null);
  const [forecast, setForecast] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Datos para la consulta
  const city = "Madrid"; // Hardcoded para propositos de pruebas
  const apiKey = process.env.EXPO_PUBLIC_WEATHER_API_KEY;

  // URLs para clima actual y predicción
  const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}&lang=es`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}&lang=es`;

  useEffect(() => {
    Promise.all([fetch(currentUrl), fetch(forecastUrl)])
      .then(async ([resCurrent, resForecast]) => {
        const dataCurrent = await resCurrent.json();
        const dataForecast = await resForecast.json();

        setCurrent(dataCurrent);

        // Filtramos para obtener solo un pronóstico por día (el de las 12:00 PM)
        const dailyData = dataForecast.list.filter((reading: any) =>
          reading.dt_txt.includes("12:00:00"),
        );
        setForecast(dailyData);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, [currentUrl, forecastUrl]);

  if (loading)
    return (
      <ActivityIndicator size="large" color="#0000ff" style={{ flex: 1 }} />
    );

  {
    /*
  // Construimos la URL del icono si tenemos los datos
  const iconUrl = weather?.weather?.[0]?.icon
    ? `https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`
    : null;
  */
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ alignItems: "center", paddingVertical: 50 }}
    >
      {/* Seccion Hoy Resaltada */}
      <View style={styles.mainCard}>
        <Text style={styles.todayLabel}>HOY</Text>
        <Text style={styles.city}>{current?.name}</Text>
        <Image
          source={{
            uri: `https://openweathermap.org/img/wn/${current?.weather[0].icon}@4x.png`,
          }}
          style={styles.mainIcon}
        />
        <Text style={styles.mainTemp}>{Math.round(current?.main.temp)}°C</Text>
        <Text style={styles.description}>
          {current?.weather[0].description}
        </Text>
      </View>

      {/* Seccion Semana */}
      <View style={styles.forecastContainer}>
        <Text style={styles.sectionTitle}>Próximos días (12:00 PM)</Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={forecast}
          keyExtractor={(item) => item.dt.toString()}
          renderItem={({ item }) => {
            // Formatear fecha para mostrar dia de la semana
            const date = new Date(item.dt * 1000);
            const dayName = date.toLocaleDateString("es-ES", {
              weekday: "short",
            });

            return (
              <View style={styles.forecastCard}>
                <Text style={styles.forecastDay}>{dayName}</Text>
                <Image
                  source={{
                    uri: `https://openweathermap.org/img/wn/${item.weather[0].icon}.png`,
                  }}
                  style={styles.smallIcon}
                />
                <Text style={styles.forecastTemp}>
                  {Math.round(item.main.temp)}°
                </Text>
              </View>
            );
          }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101010",
  },
  mainCard: {
    backgroundColor: "#1e1e1e",
    width: "90%",
    borderRadius: 30,
    padding: 30,
    alignItems: "center",
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#333",
  },
  todayLabel: {
    color: "#00d4ff",
    fontWeight: "bold",
    letterSpacing: 2,
  },
  city: {
    fontSize: 24,
    color: "white",
    marginTop: 10,
  },
  mainIcon: {
    width: 150,
    height: 150,
  },
  mainTemp: {
    fontSize: 80,
    fontWeight: "bold",
    color: "white",
  },
  description: {
    fontSize: 18,
    color: "#aaa",
    textTransform: "capitalize",
  },
  forecastContainer: {
    width: "100%",
    paddingLeft: "5%",
  },
  sectionTitle: {
    color: "white",
    fontSize: 18,
    marginBottom: 15,
    fontWeight: "600",
  },
  forecastCard: {
    backgroundColor: "#1e1e1e",
    padding: 15,
    borderRadius: 20,
    alignItems: "center",
    marginRight: 15,
    width: 80,
  },
  forecastDay: {
    color: "#aaa",
    textTransform: "uppercase",
    fontSize: 12,
  },
  smallIcon: {
    width: 50,
    height: 50,
  },
  forecastTemp: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
