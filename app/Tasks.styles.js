import { StyleSheet } from "react-native";

export default StyleSheet.create({
    tasks: {
        backgroundColor: "#F0EFF6",
        padding: 20,
        paddingTop: 60,
    },
    panel: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 16,
    },
    button: {
        backgroundColor: "#D0D0D0",
        paddingHorizontal: 8,
        paddingVertical: 5,
        borderRadius: 5,
    },
    buttonText: {
        color: "#000000",
        fontSize: 16,
        textAlign: "center",
    },
    tasksTaskList: {
        paddingTop: 20,
    },
    tasksTaskPreview: {
        backgroundColor: "#FFFFFF",
        borderRadius: 8,
        paddingVertical: 20,
        paddingLeft: 25,
        paddingRight: 20,
        marginBottom: 10,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    tasksTaskPreviewTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 15,
    },
    tasksTaskPreviewProgress: {
        fontSize: 14,
    },
    tasksNoTasksText: {
        fontSize: 16,
        color: "#888",
    },
    tasksDate: {
        fontSize: 12,
        color: "#888",
    },
    tasksAddTaskButton: {
        backgroundColor: "#34C759",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 20,
    },
    tasksAddTaskButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },
})