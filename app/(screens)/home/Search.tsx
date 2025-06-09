import { ActivityIndicator } from "react-native-paper";
import { useState } from "react";
import { Link } from "expo-router";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import useSearch from "@/hooks/useSearch";

import Input from "@/components/Inputs/TextInput";
import RenderHTML from "react-native-render-html";
import IconSearch from "@/components/Icons/IconSearch";
import Loading from "@/components/Loading";

export default function Search() {
  const search = useSearch();
  const [searchBar, setSearchBar] = useState<string>("");
  const [containerWidth, setContainerWidth] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingNextPage, setLoadingNextPage] = useState(false);

  const handleEndReached = async () => {
    const { current_page, total_pages } = search.page;
    if (current_page < total_pages && !loadingNextPage) {
      setLoadingNextPage(true);
      await search.getNextPage();
      setLoadingNextPage(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    search.getData(searchBar).finally(() => setLoading(false));
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#4442" }}>
      {loading && <Loading />}
      <View style={{ flexDirection: "row", gap: 10, padding: 10 }}>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            gap: 10,
            borderRadius: 10,
            backgroundColor: "#ccc",
            overflow: "hidden",
          }}
        >
          <View style={{ flex: 1 }}>
            <Input
              style={{
                borderColor: "transparent",
              }}
              name="searchBar"
              value={searchBar}
              onChange={(_, value) => setSearchBar(value)}
            />
          </View>
          <TouchableOpacity
            style={{
              justifyContent: "center",
              paddingHorizontal: 10,
              backgroundColor: "#BBB",
            }}
            onPress={handleSearch}
          >
            <IconSearch />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ flex: 1 }}>
        <FlatList
          contentContainerStyle={styles.destinationContent}
          data={search.data}
          keyExtractor={(_, index) => (Date.now() + index).toString()}
          renderItem={({ item, index }) => (
            <Link
              href={{
                pathname: "/(screens)/home/DestinationDetails",
                // params: { index, name: params.location },
              }}
            >
              <View style={styles.destiontionItem}>
                <View style={styles.destinationImg}>
                  {item.images["1"] && (
                    <Image
                      src={item.images["1"].url}
                      style={{ minWidth: "100%", minHeight: "100%" }}
                    />
                  )}
                </View>
                <View
                  onLayout={(event) =>
                    setContainerWidth(event.nativeEvent.layout.width)
                  }
                  style={styles.destinationText}
                >
                  <Text style={styles.destinationTitle}>{item.title}</Text>
                  <RenderHTML
                    contentWidth={containerWidth}
                    source={{ html: item.body ?? "" }}
                    baseStyle={styles.destinationDescription}
                  />
                </View>
              </View>
            </Link>
          )}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.6}
          ListFooterComponent={
            loadingNextPage ? (
              <ActivityIndicator size="small" style={{ marginVertical: 20 }} />
            ) : null
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  destinationContent: { gap: 20, padding: 20 },
  destiontionItem: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    width: "100%",
    height: 140,
    marginBottom: 20,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#CCC",
    overflow: "hidden",
    backgroundColor: "white",
  },
  destinationImg: {
    width: 100,
    height: "100%",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#CCC",
    overflow: "hidden",
  },
  destinationText: {
    flex: 1,
    gap: 5,
    height: "100%",
    overflow: "hidden",
  },
  destinationTitle: {
    fontWeight: "500",
  },
  destinationDescription: {
    fontSize: 12,
    color: "#666",
  },
});
