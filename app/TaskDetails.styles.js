import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F0EFF6",
    },
    content: {
        padding: 20,
        paddingTop: 60,
    },
    header: {
        fontSize: 30,
        fontWeight: "bold",
        marginBottom: 20,
        color: "#333",
    },
    backButton: {
        alignSelf: "flex-start",
        backgroundColor: "transparent",
        padding: 10,
        marginBottom: 10,
    },
    backButtonText: {
        color: "#007AFF",
        fontSize: 16,
    },
    taskCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 8,
        padding: 20,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    taskTitle: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 15,
        color: "#333",
    },
    section: {
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#666",
        marginBottom: 5,
    },
    sectionContent: {
        fontSize: 14,
        color: "#333",
        lineHeight: 20,
    },
    statusBadge: {
        alignSelf: "flex-start",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
        marginBottom: 10,
    },
    statusCompleted: {
        backgroundColor: "#4CAF50",
    },
    statusInProgress: {
        backgroundColor: "#FF9800",
    },
    statusText: {
        color: "#FFFFFF",
        fontSize: 12,
        fontWeight: "bold",
    },
    membersList: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 5,
    },
    memberBadge: {
        backgroundColor: "#E3F2FD",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginRight: 8,
        marginBottom: 8,
    },
    memberText: {
        fontSize: 12,
        color: "#1976D2",
    },
    taskId: {
        fontSize: 10,
        color: "#999",
        fontFamily: "monospace",
        marginTop: 10,
    },
    editButton: {
        backgroundColor: "#007AFF",
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 20,
        alignItems: "center",
        marginTop: 20,
    },
    editButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },
    loadingText: {
        fontSize: 16,
        color: "#888",
        textAlign: "center",
        marginTop: 40,
    },
    errorText: {
        fontSize: 16,
        color: "#FF5722",
        textAlign: "center",
        marginTop: 40,
    },
});