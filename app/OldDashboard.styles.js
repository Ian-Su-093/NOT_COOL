import { StyleSheet } from "react-native";

export default StyleSheet.create({
    dashboard: {
        backgroundColor: "#FFFFFF",
        padding: 20,
        paddingTop: 80,
    },
    dashboardHeader: {
        fontSize: 30,
        fontWeight: "bold",
        marginBottom: 20,
    },
    dashboardBlock: {
        backgroundColor: "#F0EFF6",
        borderRadius: 10,
        padding: 20,
        marginBottom: 30,
        elevation: 3,
    },
    dashboardBlockHeader: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
    dashboardTaskPreview: {
        backgroundColor: "#FFFFFF",
        borderWidth: 2,
        borderColor: "#E0E0E0",
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
    },
    dashboardTaskPreviewTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 5,
    },
    dashboardTaskPreviewProgress: {
        fontSize: 14,
    },
    dashboardNoTasksText: {
        fontSize: 16,
        color: "#888",
    },
    dashboardDate: {
        fontSize: 12,
        color: "#888",
    },
    dashboardMeetingPreview: {
        backgroundColor: "#FFFFFF",
        borderWidth: 2,
        borderColor: "#E0E0E0",
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
        display: "flex",
        flexDirection: "row",
    },
    dashboardMeetingDuration: {
        fontSize: 12,
        marginLeft: "auto",
        alignSelf: "center",
        backgroundColor: "#B5E2FF",
        borderRadius: 8,
        paddingVertical: 1,
        paddingHorizontal: 10,
    },
});