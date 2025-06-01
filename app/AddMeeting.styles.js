import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#FFF',
    },
    infoBox: {
        marginBottom: 20,
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#F0EFF6',
        borderRadius: 10,
    },
    input: {
        height: 60,
        // borderColor: '#ccc',
        // borderWidth: 1,
        borderBottomWidth: 0.5,
        borderColor: '#aaa',
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    inputArea: {
        height: 180,
        // borderColor: '#ccc',
        // borderWidth: 1,
        borderBottomWidth: 0.5,
        borderColor: '#aaa',
        marginBottom: 30,
        paddingHorizontal: 10,
        textAlignVertical: 'top',
    },
    button: {
        height: 60,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        marginBottom: 20,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
    },
    memberList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 20,
    },
    memberItem: {
        backgroundColor: '#B5E2FF',
        padding: 10,
        borderRadius: 20,
        marginRight: 10,
        marginBottom: 10,
    },
    lastInput: {
        height: 60,
        // borderColor: '#ccc',
        // borderWidth: 1,
        borderColor: '#aaa',
        marginBottom: 30,
        paddingHorizontal: 10,
    },
    submitButton: {
        backgroundColor: '#6200EE',
        color: '#FFF',
        padding: 15,
        borderRadius: 8,
    },
})