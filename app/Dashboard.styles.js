import { on } from "events";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    content: {
        flexGrow: 1,
        paddingTop: 60,
    },
    headBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    },
    taskContent: {
        padding: 20,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 10,
    },
    topTask: {
        backgroundColor: '#8B0000',
        borderRadius: 8,
        padding: 15,
        marginBottom: 20,
    },
    topTaskTitle: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    topTaskDetail: {
        backgroundColor: '#FFFFFF',
        color: '#000000',
        borderRadius: 8,
        minHeight: 160,
        fontSize: 16,
        marginBottom: 10,
    },
    memberBadge: {
        color: '#000',
        fontSize: 14,
        backgroundColor: '#fff',
        padding: 5,
        paddingHorizontal: 10,
        borderRadius: 20,
        alignSelf: 'flex-start',
    },
    ongoingTask: {
        borderRadius: 8,
        padding: 20,
        marginBottom: 20,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    taskGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    finishedTask: {
        borderRadius: 8,
        padding: 15,
        marginBottom: 15,
        width: '48%', // 讓每個卡片佔據約一半寬度
        minHeight: 60,
    },
    taskInfo: {
        color: '#FFFFFF',
        fontSize: 14,
        marginBottom: 4,
    },
    tasksNoTasksText: {
        textAlign: 'center',
        color: '#666',
        fontStyle: 'italic',
        width: '100%', // 確保無任務文字佔滿整行
    },


    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: '50%', // 半頁面高度
        paddingTop: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333',
    },
    modalBody: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    filterOption: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 10,
        marginTop: 15,
    },
    filterItem: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
})