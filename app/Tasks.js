import { ScrollView, View, Text, Pressable } from "react-native"
import styles from "./Tasks.styles"

const Tasks = ({ navigation }) => {
    return (
        <View style={{ flex: 1, backgroundColor: "#F0EFF6" }}>
            <ScrollView contentContainerStyle={styles.tasks}>
                {/* A horizontal pannel with four buttons: sort with deadline and sort with  */}
            </ScrollView>
        </View>
    )
}

export default Tasks