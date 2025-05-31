import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F0EFF6",
    },
    content: {
        flexGrow: 1,
        paddingTop: 60,
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
        padding: 20,
        flex: 1,
    },
    taskHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
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
    dateSection: {
        flexDirection: "row",
        justifyContent: "space-between",
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
    subtaskButton: {
        paddingVertical: 12,
        paddingHorizontal: 10,
        alignItems: "left",
        borderBottomWidth: 0.5,
        borderBottomColor: "#D0D0D0",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    subtaskText: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 15,
    },
    subtaskDate: {
        fontSize: 14,
        color: "#888",
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
    addButton: {
        backgroundColor: "#34C759",
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 20,
        alignItems: "center",
        marginTop: 20,
    },
    addButtonText: {
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