import { StyleSheet } from "react-native";

export default StyleSheet.create({
    input: {
        width: "100%",
        height: 50,
        padding: 5,
        marginTop: 10,
        marginBottom: 10,
    },
    button: {
        backgroundColor: "blue",
        color: "while",
        textAlign: "center",
        padding: 10
    },
    safe:{
        flex: 1,
        backgroundColor: '#e8ecf4'
    },
    container: {
        padding: 24,
        flex: 1
    },
    header: {
        marginVertical: 36,
    },
    headerImg: {
        width: 80,
        alignSelf: 'center',
        height: 80,
        marginBottom: 36,
    },
    title: {
        fontSize: 27,
        fontWeight: '700',
        color: '#1e1e1e',
        marginBottom: 6,
        textAlign: 'center',
    }, 
    subtitle:{
        fontSize: 15,
        fontWeight: '300',
        color: '#929292',
        textAlign: 'center',
    },
    input: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 17,
        fontWeight: '600',
        color: '#222',
        marginBottom: 8,
    },
    inputControl: {
        height: 44,
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        borderRadius: 12,
        fontSize: 15,
        fontWeight: '500',
        color: '#222',
    },
    btn: {
        backgroundColor: '#075eec',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#075eec',
        flexDirection: 'row',
        alignItems: 'color',
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    btnText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff'
    },
    form: {
        marginBottom: 24,
    },
    formAction: {
        marginVertical: 24,
    },
    formFooter: {
        fontSize: 17,
        fontWeight: '600',
        color: '#222',
        textAlign: 'center'
    }
})