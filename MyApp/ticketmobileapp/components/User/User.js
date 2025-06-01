import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import API, { authApi, endpoints } from '../../configs/API';
import { ActivityIndicator } from 'react-native';
import MyContext from '../../configs/MyContext';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'

const User = () => {
    const [user, dispatch] = useContext(MyContext);
    const navigation = useNavigation();   
    const [users, setUser] = useState(null)
    const [avatar, setAvatar] = useState()

    React.useEffect(() => {
        const loadUser = async () => {
            try {
                const accessToken = await AsyncStorage.getItem('access-token');

                if (!accessToken) {
                    console.warn("Không tìm thấy accessToken");
                    return;
                }
    
                let res = await authApi(accessToken).get(endpoints['current-user']);
                setUser(res.data);
            } catch (error) {
                console.error("Fail to load user:", error);
            }
        };
    
        if (user !== null) loadUser();
    }, []);

    const pickAvatar = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
        });

        if (!result.canceled) {
        setAvatar(result.assets[0].uri);
        }
    };

    const handleLogout = () => {
        Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất?', [
          { text: 'Hủy', style: 'cancel' },
          {
            text: 'Đăng xuất',
            onPress: () => {
              dispatch({ type: 'logout' });
              navigation.navigate('Tài khoản');
            },
          },
        ]);
      };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Thông tin tài khoản</Text>
            {users === null ? ( 
                <ActivityIndicator/> 
            ) : (
                <ScrollView>
                    <View>
                        <TouchableOpacity onPress={pickAvatar} style={styles.avatarContainer}>
                            {/* <Image source={{ uri: users.avatar }} style={styles.avatar} /> */}
                            <View style={styles.cameraIcon}>
                                <Text style={{ color: 'white' }}>📷</Text>
                            </View>
                        </TouchableOpacity>

                        <Text style={styles.label}>Họ và tên</Text>
                        <Text style={styles.input}>{users.first_name}</Text>

                        <Text style={styles.label}>Email</Text>
                        <Text style={[styles.input, { color: '#999' }]}>{users.email}</Text>
                    </View>
                </ScrollView>
            )}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Đăng xuất</Text>
            </TouchableOpacity>
        </View>
    );
};

export default User

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'white',
    },
    title: {
        paddingTop: 50,
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 30,
        alignSelf: 'center',
        color: 'black',
    },
    avatarContainer: {
        alignSelf: 'center',
        position: 'relative',
    },
    avatar: {
        width: 110,
        height: 110,
        borderRadius: 55,
        backgroundColor: '#ccc',
    },
    cameraIcon: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        backgroundColor: '#28c76f',
        borderRadius: 12,
        padding: 4,
    },
    label: {
        color: '#bbb',
        marginTop: 25,
        marginBottom: 5,
    },
    input: {
        backgroundColor: '#1e1e1e',
        padding: 10,
        borderRadius: 10,
        color: 'white',
    },
    logoutButton: {
        marginTop: 40,
        backgroundColor: '#28c76f',
        padding: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    logoutText: {
        color: 'white',
        fontWeight: 'bold',
    },
});