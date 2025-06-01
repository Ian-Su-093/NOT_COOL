import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { addTask, fetchUserTask, fetchUserIDByUserName } from "@/firebaseAPI";

// Notification
import { registerForPushNotificationsAsync } from './notifications';

import DateTimePicker from "@react-native-community/datetimepicker";

import styles from "./Home.styles"; // 引入樣式

const backend_url = 'http://192.168.199.81:3000';   // For physical phone

const Home = ({ navigation }) => {

    // Test notification
    useEffect(() => {
        registerForPushNotificationsAsync().then(token => {
            console.log("Current token status:", token);
            if (token) {
                console.log("Sending token to backend...");
                // send token to your backend
                fetch(`${backend_url}/tokens/push`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token }),
                });
            }
        });
    }, []);

    // 4 個輸入欄位
    const [UserName, setUserName] = useState("");
    const [TaskName, setTaskName] = useState("");
    const [TaskDetail, setTaskDetail] = useState("");
    const [EndTime, setEndTime] = useState(new Date());
    const [ExpectedTime, setExpectedTime] = useState("");
    const [Penalty, setPenalty] = useState("");

    const [displayText, setDisplayText] = useState("");
    const [showPicker, setShowPicker] = useState(false); // 控制時間選擇器顯示

    // 提交資料到 Firebase
    const handleSubmit = async () => {
        if (!UserName || !TaskName || !TaskDetail || !EndTime) {
            alert("請填寫所有欄位！");
            return;
        }

        const Userinfo = await fetchUserIDByUserName(UserName);

        try {
            await addTask({
                UserID: Userinfo.UserID,
                TaskName,
                TaskDetail,
                EndTime,
                ExpectedTime,
                Penalty
            });

            setDisplayText(`已儲存：${UserName} - ${TaskName}`);
            setUserName("");
            setTaskName("");
            setTaskDetail("");
        } catch (error) {
            console.error("❌ 儲存失敗：", error);
            alert("儲存失敗！");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>請輸入資料：</Text>

            <TextInput
                style={styles.input}
                placeholder="使用者名字"
                value={UserName}
                onChangeText={setUserName}
            />
            <TextInput
                style={styles.input}
                placeholder="工作名稱"
                value={TaskName}
                onChangeText={setTaskName}
            />
            <TextInput
                style={styles.input}
                placeholder="工作描述"
                value={TaskDetail}
                onChangeText={setTaskDetail}
            />

            {/* 時間選擇器 */}
            <Text>當前截止時間：{EndTime.toLocaleString()}</Text>
            <Button title="選擇截止時間" onPress={() => setShowPicker(true)} />
            {showPicker && (
                <DateTimePicker
                    value={EndTime}
                    mode="datetime"
                    display="default"
                    onChange={(event, selectedDate) => {
                        setShowPicker(false);
                        if (selectedDate) {
                            setEndTime(selectedDate);
                        }
                    }}
                />
            )}
            <TextInput
                style={styles.input}
                placeholder="所需時間"
                value={ExpectedTime}
                onChangeText={setExpectedTime}
            />
            <TextInput
                style={styles.input}
                placeholder="遲交懲罰"
                value={Penalty}
                onChangeText={setPenalty}
            />

            <Button title="送出" onPress={handleSubmit} />

            <Text style={styles.displayText}>{displayText}</Text>
        </View>
    );
};

export default Home;