import { View, Text, Image, SafeAreaView, ScrollView, Dimensions, ActivityIndicator, FlatList, TouchableOpacity } from "react-native";
import Styles from './Styles' 
import React,  { useEffect, useState } from "react";
import API, { endpoints } from "../../configs/API";

const { width } = Dimensions.get("window");

const Home = ({navigation}) => {
    const [events, setEvents] = React.useState([])
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [banners, setBanners] = useState(null);

    const loadEvents = async (pageNum = 1) => {
        if (loading || !hasMore) return;

        setLoading(true);
        try {
            let res = await API.get(`${endpoints['events']}?page=${pageNum}`);
            const newEvents = res.data.results;
            if (newEvents.length > 0) {
                setEvents(prev => [...prev, ...res.data.results]);
                setPage(pageNum + 1);
                if (newEvents.length < 3) {
                    setHasMore(false);
                }
            } else {
                setHasMore(false);
            }
        } catch (err) {
            if (err.response && err.response.status === 404) {
                console.log("No more pages.");
                setHasMore(false);
            } else {
                console.error("Failed to load events:", err);
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        loadEvents();
    }, []);

    React.useEffect(() => {
        const loadBanners = async () => {
            try {
                let res = await API.get(endpoints['banners']);
                setBanners(res.data); // đã là array
            } catch (ex) {
                console.error(ex);
            }
        };
        loadBanners();
    }, []);

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => navigation.navigate("Event", { id: item.id })} style={{ flex: 1, margin: 10 }}>
            <View style={{ margin: 10 }}>
                <Image source={{ uri: item.image }} style={{ height: 200, borderRadius: 10, width: '100%' }} />
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[Styles.safeArena, { flex: 1 }]}>
            <View style={Styles.headerContainer}>
                {/* logo */}
                <Text style={Styles.logo}>TicketBox</Text>
                <View> 
                {/* tim kiem */}
                <Image source={require('../../assets/images/search.png')} style={Styles.searchIcon} />
                </View>
            </View>

            <View style={{ marginVertical: 10 }}>
                {banners === null ? (
                    <ActivityIndicator />
                ) : (
                    <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
                        {banners.map(b => (
                            <View key={b.id} style={{ width, paddingHorizontal: 20 }}>
                                <Image
                                    source={{ uri: b.image }}
                                    style={{ width: '100%', height: 200, borderRadius: 10 }}
                                    resizeMode="cover"
                                />
                            </View>
                        ))}
                    </ScrollView>
                )}
            </View>

            <View style={ Styles.flatContainer }>
                <FlatList
                    key={2}
                    data={events}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    onEndReached={() => loadEvents(page)}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={loading ? <ActivityIndicator /> : null}
                />
            </View>
        </SafeAreaView>
    )
}

export default Home