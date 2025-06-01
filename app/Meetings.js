import React, { useState, useEffect } from "react"
import { ScrollView, View, Text, Pressable } from "react-native"
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from "@react-navigation/native";

import styles from "./Meetings.styles"

const backend_url = 'http://192.168.199.81:3000'   // For physical phone

const Meetings = ({ navigation }) => {
    const [Meetings, setMeetings] = useState([])

    const fetchMeetings = async () => {
        try {
            const userID = await AsyncStorage.getItem('userID');
            if (!userID) {
                alert("錯誤", "未找到用戶ID，請先登入。");
                return;
            }

            console.log("Fetching meetings for userID: ", userID);
            const res = await fetch(`${backend_url}/users/${userID}/meetings`);
            if (res.ok) {
                const data = await res.json();
                setMeetings(data.meetings || []);
            } else {
                const errorData = await res.json();
                console.error("Error fetching meetings: ", errorData);
                alert("錯誤", "無法獲取會議資料，請稍後再試。");
                return;
            }
        } catch (error) {
            console.error("Failed to fetch meetings: ", error);
            alert("錯誤", "無法獲取會議資料，請稍後再試。");
            return;
        }
    }

    useEffect(() => {
        fetchMeetings();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            fetchMeetings();
        }, [])
    );

    return (
        <View style={{ flex: 1, backgroundColor: "#F0EFF6" }}>
            <ScrollView contentContainerStyle={styles.meetings}>
                <Pressable style={styles.meetingsCancel}>
                    <Text style={styles.meetingsCancelText}>約時間</Text>
                </Pressable>
                <Text style={styles.meetingsHeader}>會議</Text>
                {
                    Meetings.length > 0 ? (
                        Meetings.map((meeting, index) => (
                            <Pressable key={index} onPress={() => navigation.navigate("MeetingDetails", { meeting })}>
                                <View style={styles.meetingsMeetingPreview}>
                                    <View>
                                        <Text style={styles.meetingsMeetingPreviewTitle}>{meeting.MeetingName}</Text>
                                        <Text style={styles.meetingsDate}>
                                            {meeting.StartTime ? new Date(meeting.StartTime).toLocaleString("zh-TW", {
                                                year: 'numeric',
                                                month: '2-digit',
                                                day: '2-digit',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: true
                                            }).replace(/\//g, "/") : "無"}
                                        </Text>
                                    </View>
                                    <Text style={styles.meetingsMeetingDuration}>{meeting.Duration} min</Text>
                                    <Icon name="chevron-right" size={30} color="#aaa" style={{ alignSelf: "center", paddingLeft: 10 }} />
                                </View>
                            </Pressable>
                        ))
                    ) : (
                        <Text style={styles.meetingsNoMeetingsText}>目前無會議</Text>
                    )
                }
            </ScrollView>
        </View>
    )
}

export default Meetings