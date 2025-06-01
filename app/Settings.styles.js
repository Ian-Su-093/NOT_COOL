import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F0EFF6",
        paddingTop: 100,
    },
    avatarPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "#D1D1D1",
        alignSelf: "center",
        marginVertical: 20,
    },
    username: {
        textAlign: "center",
        marginTop: 10,
        fontSize: 18,
        color: "#333",
    },
    uid: {
        textAlign: "center",
        color: "#666",
        marginBottom: 20,
    },
    buttonText: {
        textAlign: "center",
        color: "#007AFF",
        fontSize: 16,
        padding: 10,
        backgroundColor: "#F0EFF6",
        borderRadius: 5,
        marginHorizontal: 20,
    },
})