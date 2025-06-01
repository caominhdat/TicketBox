import { StyleSheet } from "react-native";
import { colors } from"../../styles/Colors"

export default StyleSheet.create({
    subject: {
        fontSize: 30,
        color: "blue"
    },
    safeArena: {
        backgroundColor: colors.primaryGreen,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between', // Giữ space-between để logo ở trái, icon ở phải
        alignItems: 'center',
        paddingHorizontal: 25, // Khoảng cách hai bên
        height: 30,
    },
    logo: {
        fontFamily: 'Montserrat-Bold',
        fontSize: 20,
        resizeMode: 'contain',
    },
    searchIcon: {
        width: 20,
        height: 20,
        tintColor: colors.white,
    },
    bannerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
        marginBottom: 5
    },
    flatContainer: {
        flex: 1,
        backgroundColor: '#1a1a1a',
    },
    flatItem: {

    }

})