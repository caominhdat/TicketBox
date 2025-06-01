import React, { useContext } from "react";
import { Button } from "react-native";
import MyContext from "../../configs/MyContext";

const Logout = ({navigation}) => {
    const [user, dispatch] = useContext(MyContext);

    const logout = () => {
        dispatch({
            "type": "logout"
        })
    }

    if (user ===  null)
        return <Button title="Đăng nhập" onPress={() => navigation.navigate("login")} />

    return (
        <Button title="Logout" color="red" onPress={logout} />
    );
};

export default Logout;
