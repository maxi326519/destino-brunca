import { useLocalSearchParams } from "expo-router/build/hooks";
import { useEffect, useState } from "react";
import { Destination } from "@/interface/Destination";
import { router } from "expo-router";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import useDestinations from "@/hooks/useDestinations";
import RenderHTML from "react-native-render-html";
import IconClose from "@/components/Icons/IconClose";
import MapPreview from "@/components/MapPreview";

export default function DestinationDetails() {
  const params = useLocalSearchParams();
  const destinations = useDestinations();
  const [containerWidth, setContainerWidth] = useState(0);
  const [destination, setDestination] = useState<Destination>();

  useEffect(() => {
    if (params.index) {
      const currentDestination = destinations.data.find(
        (_, destinationIndex) => destinationIndex === Number(params.index)
      );
      if (currentDestination) setDestination(currentDestination);
    }
  }, [destination]);

  const safeText = (text?: string | null) =>
    text && text.trim().length > 0 ? text : "No disponible";

  return (
    <ScrollView style={{ flex: 1 }}>
      {/* HEADER */}
      <View style={styles.locationHead}>
        <Text style={styles.locationName}>
          {safeText(destination?.title?.toUpperCase())}
        </Text>
        <View style={styles.locationImg}>
          {destination?.images?.[1]?.url ? (
            <Image
              src={destination.images[1].url}
              style={{ width: "100%", height: "100%", opacity: 0.5 }}
            />
          ) : null}
          <TouchableOpacity
            style={styles.locationCloseBtn}
            onPress={() => router.back()}
          >
            <IconClose fill="white" width={20} height={20} />
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={styles.content}
        onLayout={(event) => setContainerWidth(event.nativeEvent.layout.width)}
      >
        <Text style={styles.sectionTitle}>Detalles del destino</Text>

        <Text style={styles.destinationTitle}>
          {safeText(destination?.title)}
        </Text>

        <RenderHTML
          contentWidth={containerWidth}
          source={{ html: destination?.body || "<p>No disponible</p>" }}
          baseStyle={styles.destinationDescription}
        />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Datos de contacto:</Text>
          <Text>Teléfono: {safeText(destination?.telefono?.[1])}</Text>
          <Text>Correo: {safeText(destination?.email)}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ubicación:</Text>
          <Text>Cantón: {safeText(destination?.canton)}</Text>
          <Text>Distrito: {safeText(destination?.distrito)}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Horario:</Text>
          <Text>
            {safeText(destination?.horario?.[1]?.tipo)}:{" "}
            {safeText(destination?.horario?.[1]?.hora)}
          </Text>
          <Text>
            {safeText(destination?.horario?.[2]?.tipo)}:{" "}
            {safeText(destination?.horario?.[2]?.hora)}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Montaña:</Text>
          <Text>Título: {safeText(destination?.montaña?.title)}</Text>
          <Text>
            Descripción: {safeText(destination?.montaña?.description)}
          </Text>
          <Text>Cantón: {safeText(destination?.montaña?.canton)}</Text>
          <Text>Distrito: {safeText(destination?.montaña?.distrito)}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Playa:</Text>
          <Text>Título: {safeText(destination?.playa?.title)}</Text>
          <Text>Descripción: {safeText(destination?.playa?.description)}</Text>
          <Text>Cantón: {safeText(destination?.playa?.canton)}</Text>
          <Text>Distrito: {safeText(destination?.playa?.distrito)}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Servicios:</Text>
          {destination?.servicios ? (
            <FlatList
              data={Object.values(destination.servicios)}
              keyExtractor={(item) => item}
              renderItem={({ item }) => <Text>{item}</Text>}
              scrollEnabled={false}
            />
          ) : (
            <Text>No hay servicios registrados.</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Alimentos:</Text>
          {destination?.tipo_alimentos ? (
            <FlatList
              data={Object.values(destination.tipo_alimentos)}
              keyExtractor={(item) => item}
              renderItem={({ item }) => <Text>{item}</Text>}
              scrollEnabled={false}
            />
          ) : (
            <Text>No hay tipos de alimentos registrados.</Text>
          )}
        </View>

        {destination?.map?.lat && destination?.map?.lon && (
          <MapPreview
            latitude={Number(destination?.map.lat)}
            longitude={Number(destination?.map.lon)}
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  locationHead: {
    position: "relative",
    height: 200,
    flexDirection: "row",
    backgroundColor: "#555",
    overflow: "hidden",
  },
  locationCloseBtn: {
    position: "absolute",
    zIndex: 10,
    top: 0,
    right: 0,
    padding: 10,
    margin: 10,
    borderRadius: 50,
    backgroundColor: "#0004",
  },
  locationName: {
    position: "absolute",
    zIndex: 100,
    bottom: 0,
    padding: 20,
    fontSize: 25,
    textAlign: "center",
    fontWeight: "500",
    color: "white",
  },
  locationImg: {
    height: "100%",
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#000",
  },
  destinationTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginVertical: 10,
  },
  destinationDescription: {
    color: "black",
    marginBottom: 15,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },

  content: {
    flex: 1,
    padding: 20,
  },
  mapContainer: {
    marginTop: 20,
    borderRadius: 10,
    overflow: "hidden",
    elevation: 4,
    backgroundColor: "#ccc",
  },
  mapPreview: {
    width: "100%",
    height: 200,
  },
  mapText: {
    textAlign: "center",
    padding: 10,
    fontWeight: "bold",
    color: "#007AFF",
  },
});
