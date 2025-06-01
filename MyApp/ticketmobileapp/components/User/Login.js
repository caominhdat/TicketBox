import { View, Text, TextInput, TouchableOpacity, Image, SafeAreaView, Alert } from "react-native"
import Style from "./Style"
import { useContext, useState } from "react"
import MyContext from "../../configs/MyContext"
import API, { authApi, endpoints } from "../../configs/API"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useNavigation } from '@react-navigation/native';

const Login = () => {
    const navigation = useNavigation();
    const[username, setUsername] = useState()
    const[password, setPassword] = useState()
    const[user, dispatch] = useContext(MyContext)

    const login = async () =>{
        try {
            let res = await API.post(endpoints['login'], 
                {
                    'username': username,
                    'password': password,
                    'client_id': "gr7KDetPsvfSCRGHJrMPDk4pu5HAgykbhb1mKXD7",       
                    'client_secret': "YSbD9vljj3u4DEJUAgYFaxFUs2sPnqdjHOWhpZhORdK1MvdHzzsq5Tzznx16RGR6ZnnJS1HLwx055rOYipgWF8PiypaPz6EriVe8RSBYJMpBAHO1UHqwoQZ0gRBstXZ5", 
                    "grant_type": "password"
            });

            const accessToken = res.data.access_token;
            await AsyncStorage.setItem("access-token", accessToken); // ✅ Lưu token
            await AsyncStorage.setItem("refresh-token", res.data.refresh_token);
            console.info(res.data)

            let user = await authApi(res.data.access_token).get(endpoints['current-user'])
            dispatch({
                "type": "login",
                "payload":user.data
            })
    
            Alert.alert("Thành công", "Đăng nhập thành công!");

        } catch (err) {
            console.error(err);
            console.error("LOGIN ERROR:", err.response?.data || err.message);
            Alert.alert("Đăng nhập thất bại", "Sai tài khoản hoặc mật khẩu");
        }
    }

    return (
        <SafeAreaView style={Style.safe}>
            <View style={Style.container}>
                <View style={Style.header}>
                    <Image source={require('../../assets/images/background.jpg')} style={Style.headerImg} alt="Logo"/>
                    <Text style={Style.title}>Sign in to MyApp</Text>
                    <Text style={Style.subtitle}>abc</Text>
                </View>
                <View style={Style.form}>
                    <View style={Style.input}>
                        <Text style={Style.inputLabel}>Username</Text>
                        <TextInput value={username} onChangeText={t => setUsername(t)} placeholder="Tên đăng nhập..." style={Style.inputControl}/>
                    </View>
                    <View style={Style.input}>
                        <Text style={Style.inputLabel}>Password</Text>
                        <TextInput value={password} onChangeText={t => setPassword(t)} secureTextEntry={true} placeholder="Mật khẩu..." style={Style.inputControl     }/>
                    </View>
                    <View style={Style.input}>
                        <TouchableOpacity style={Style.btn} onPress={login}>
                            <Text style={Style.btnText}>Login</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ alignItems: 'center', marginTop: 20 }}>
                    <Text>Bạn chưa có tài khoản?</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                            <Text style={{ color: '#28c76f', fontWeight: 'bold', marginTop: 5 }}>
                            Tạo tài khoản ngay
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
        
    )
}

export default Login;