import React, { useState, useEffect } from "react";
import { View, Pressable, Text } from "react-native";
import styles from "./Settings.styles";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Settings = ({ navigation }) => {
    const [user, setUser] = useState({
        name: "John Doe",
        uid: "12345",
    });

    const fetchUser = async () => {
        try {
            const username = await AsyncStorage.getItem("username");
            const userID = await AsyncStorage.getItem("userID");
            setUser({
                name: username,
                uid: userID,
            });
        } catch (error) {
            console.error("Failed to fetch user data:", error);
        }
    }

    const logout = async () => {
        try {
            await AsyncStorage.removeItem("user");
            setUser({ name: "John Doe", uid: "12345" }); // Reset to default state
            navigation.navigate("Login"); // Navigate to Login screen
        }
        catch (error) {
            console.error("Failed to logout:", error);
        }
    }

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.avatarPlaceholder} />
            <Text style={styles.username}>
                {user.name}
            </Text>
            <Text style={styles.uid}>
                UID: {user.uid}
            </Text>
            <Pressable onPress={() => logout()}>
                <Text style={styles.buttonText}>登出</Text>
            </Pressable>
        </View >
    );
}
export default Settings;