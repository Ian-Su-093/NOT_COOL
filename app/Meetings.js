import React, { useState, useEffect } from "react"
import { ScrollView, View, Text, Pressable } from "react-native"
import { fetchUserMeeting } from "@/firebaseAPI";
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import styles from "./Meetings.styles"

const Meetings = ({ navigation }) => {
    const [Meetings, setMeetings] = useState([])

    const fetchData = async () => {
        try {
            const userID = await AsyncStorage.getItem('userID');
            const MeetingData = await fetchUserMeeting(userID);
            setMeetings(MeetingData);
        } catch (error) {
            console.error("Failed to fetch data: ", error);
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

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