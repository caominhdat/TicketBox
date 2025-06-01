import React from "react"
import { View, Text, ActivityIndicator, Image, ScrollView } from "react-native"
import API, { authApi, endpoints } from "../../configs/API"
import { useRoute } from "@react-navigation/native"
import RenderHTML from "react-native-render-html"
import { useWindowDimensions, Pressable } from 'react-native'
import Styles from "./Styles"
import AsyncStorage from '@react-native-async-storage/async-storage'
import moment from "moment"
import { useNavigation } from '@react-navigation/native';


const Event = () => {
    const route = useRoute()
    const { id: eventId } = route.params
    const [event, setEvent] = React.useState(null)
    const navigation = useNavigation();
    const [type, setType] = React.useState(null)
    const [comment, setComment] = React.useState(null)
    const [loadCommentsTriggered, setLoadCommentsTriggered] = React.useState(false);
    const [loadingComments, setLoadingComments] = React.useState(false);
    const [loading, setLoading] = React.useState(true)
    const { width: contentWidth } = useWindowDimensions()
    const [showFullDescription, setShowFullDescription] = React.useState(false)
    const renderersProps = React.useMemo(() => ({
        img: {
          enableExperimentalPercentWidth: true,
        }
    }), []);

    const fixImageUrls = (html) => {
        const domain = "http://127.0.0.1:8000/static";
        return html.replace(/src="\/(.*?)"/g, `src="${domain}/$1"`)
    };

    React.useEffect(() => {
        const loadEventDetails = async () => {
            try {
                let res = await API.get(`/events/${eventId}/`)
                setEvent(res.data);
            } catch (error) {
                console.error("Failed to load event:", error)
            } finally {
                setLoading(false)
            }
        }

        loadEventDetails()
    }, [eventId]);

    React.useEffect(() => {
        const loadTypeTickets = async () => {
            try {
                let res = await API.get(`/events/${eventId}/type_ticket/`)
                setType(res.data);
            } catch (error) {
                console.error("Failed to load type ticket:", error)
            } finally{
                setLoading(false)
            }
        }

        loadTypeTickets()
    }, [eventId])

    React.useEffect(() => {
        if (loadCommentsTriggered && !comment && !loadingComments){
            const loadComments = async () => {
                setLoadingComments(true);
                try {
                    const accessToken = await AsyncStorage.getItem("access-token")

                    if (!accessToken) {
                        console.warn("Không tìm thấy access token");
                        return;
                    }
                    let res = await authApi(accessToken).get(endpoints['comments'](eventId))
                    setComment(res.data)
                } catch (error) {
                    console.error("Failed to load comment:", error)
                } finally{
                    setLoadingComments(false);
                }
            }
    
            loadComments()
        }
        
    }, [eventId, loadCommentsTriggered, comment, loadingComments])

    if (loading) return <ActivityIndicator style={{ marginTop: 50 }} size="large" color="#00b300" />;
    if (!event) return <Text style={{ marginTop: 50 }}>Không tìm thấy sự kiện.</Text>;

    return (
        <ScrollView contentContainerStyle={{paddingBottom: 30, paddingHorizontal: 15,}}
          showsVerticalScrollIndicator={false}
          horizontal={false}>
            <Image
                source={{ uri: event.image }} style={{ width: '100%', height: 220, borderRadius: 10 }} resizeMode="cover"/>
            <View style={{ padding: 15 }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#222' }}>{event.name}</Text>
            </View>
            
            <View style={{ margin: 2 ,horizontal: false}}>
                <View style={{ backgroundColor: '#fff', margin: 15, borderRadius: 12, padding: 16, elevation: 2 }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#222', marginBottom: 10 }}>Giới thiệu</Text>
                    <View style={{ maxHeight: showFullDescription ? undefined : 300, overflow: 'hidden' }}>
                        <RenderHTML
                            contentWidth={contentWidth}
                            source={{ html: fixImageUrls(event.description || "<p>Không có mô tả</p>") }}
                            baseStyle={{ fontSize: 15, color: '#444', lineHeight: 22 }}
                            tagsStyles={{
                                img: {
                                    width: '100%',
                                    height: 'auto',
                                    marginVertical: 10,
                                    borderRadius: 10,
                                },
                                p: {
                                marginBottom: 10,
                                },
                            }}
                            renderersProps={renderersProps}
                        />
                    </View>

                    <Pressable onPress={() => setShowFullDescription(!showFullDescription)}>
                        <Text style={Styles.seeMore}>
                            {showFullDescription ? 'Thu gọn ▲' : 'Xem thêm ▼'}
                        </Text>
                    </Pressable>
                </View>
            </View>

            <View style={{ margin: 15 ,horizontal: false}}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Thông tin vé</Text>

                {type === null ? (
                    <ActivityIndicator />
                ) : (
                    <View style={{ backgroundColor: '#2d2d2d', borderRadius: 10, overflow: 'hidden' }}>
                        {/* Thời gian & nút */}
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: 15,
                            borderBottomWidth: 1,
                            borderBottomColor: '#444'
                        }}>
                            <Pressable 
                                onPress={() => navigation.navigate("BookTicket", { eventId })} 
                                style={{ backgroundColor: '#00b300', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 5 }}
                            >
                                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Mua vé ngay</Text>
                            </Pressable>

                        </View>

                        {/* Danh sách vé */}
                        {type.map(t => (
                            <View
                                key={t.id}
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    paddingVertical: 15,
                                    paddingHorizontal: 15,
                                    borderBottomWidth: 1,
                                    borderBottomColor: '#444',
                                }}
                            >
                                <Text style={{ color: '#fff', fontSize: 16 }}>{t.name}</Text>
                                <Text style={{ color: '#00b300', fontSize: 14, fontWeight: 'bold' }}>
                                    {Number(t.price).toLocaleString('vi-VN')} đ
                                </Text>
                            </View>
                        ))}
                    </View>
                )}
            </View>

            <View style={{ margin: 15, horizontal: false }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Bình luận</Text>

                {/* Nút để kích hoạt tải comment */}
                {!loadCommentsTriggered ? (
                    <Pressable
                        style={{
                            backgroundColor: '#007bff', // Màu xanh dương để nhấn
                            paddingVertical: 12,
                            paddingHorizontal: 20,
                            borderRadius: 8,
                            alignItems: 'center',
                            marginTop: 10,
                        }}
                        onPress={() => setLoadCommentsTriggered(true)} // Khi nhấn sẽ tải comment
                    >
                        <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
                            Xem bình luận.
                        </Text>
                    </Pressable>
                ) : (
                    loadingComments ? (
                        <ActivityIndicator style={{ marginTop: 20 }} size="small" color="#00b300" />
                    ) : comment && comment.length > 0 ? (
                        <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 16, elevation: 2, marginTop: 10 }}>
                            {comment.map(c => (
                                <View key={c.id} style={{ marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 10 }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#333' }}>{c.user.username}</Text>
                                    <Text style={{ fontSize: 14, color: '#555', marginTop: 5 }}>{c.content}</Text>
                                    <Text style={{ fontSize: 12, color: '#888', marginTop: 5 }}>{moment(c.created_date).fromNow()}</Text>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 16, elevation: 2, marginTop: 10 }}>
                            <Text style={{ textAlign: 'center', color: '#666' }}>Chưa có bình luận nào.</Text>
                        </View>
                    )
                )}
            </View>
        </ScrollView>
    );
}

export default Event;
