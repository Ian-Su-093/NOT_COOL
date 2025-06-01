import { StyleSheet } from "react-native";

export default StyleSheet.create({
    meetings: {
        backgroundColor: "#F0EFF6",
        padding: 20,
        paddingTop: 60,
    },
    meetingsCancel: {
        alignSelf: "flex-end",
        backgroundColor: "transparent",
        padding: 10,
    },
    meetingsHeader: {
        fontSize: 30,
        fontWeight: "bold",
        marginBottom: 20,
    },
    meetingsMeetingPreview: {
        backgroundColor: "#FFFFFF",
        borderRadius: 8,
        paddingVertical: 20,
        paddingLeft: 25,
        paddingRight: 10,
        marginBottom: 10,
        display: "flex",
        flexDirection: "row",
    },
    meetingsMeetingPreviewTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 5,
    },
    meetingsDate: {
        fontSize: 12,
        color: "#888",
    },
    meetingsMeetingDuration: {
        fontSize: 14,
        marginLeft: "auto",
        alignSelf: "center",
        backgroundColor: "#B5E2FF",
        borderRadius: 8,
        paddingVertical: 1,
        paddingHorizontal: 10,
    },
    meetingsNoMeetingsText: {
        fontSize: 24,
        color: "#888",
    },
})