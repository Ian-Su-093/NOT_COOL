# 📋 To-Do List App (Frontend)

## 📝 Description

A simple and responsive to-do list mobile application built with **React Native**. This app allows users to add, complete, and delete tasks and meetings. This is the **frontend only** part of the app, intended to connect to a backend API.

---

## 🚀 Features

- Add, edit, and delete tasks
- Create a tree-like structure for your tasks
- Mark tasks as completed
- Clean and minimal UI
- Cross-platform support (iOS and Android)

---

## 🧱 Tech Stack

- React Native
- Expo
- React Navigation
- AsyncStorage
- Fetch

---

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ian-Su-093/NOT_COOL
   cd NOT_COOL
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the app**
   ```bash
   npx expo start
   ```

---

## ⚙️ Configuration
Set up local server IP
```js
// app/util/helper.js
export function getLocalIP() {
  return '192.168.1.10'; // Replace with your actual local IP address
}
```
💡 You can find your local IP by running ipconfig (Windows) or ifconfig / ip a (macOS/Linux) in your terminal.

---

## 📁 Project Structure
```
NOT_COOL/
├── App.js # 主應用程式入口點和導航設定
├── app.json # Expo 配置文件
├── package.json # 專案依賴和腳本
├── babel.config.js # Babel 編譯配置
├── tsconfig.json # TypeScript 配置
├── app/
│ ├── util/
│ │ └── helpers.js # 工具函數（IP 配置等）
│ ├── notifications.js # 推播通知設定
│ ├── Login.js # 登入頁面
│ ├── SignUp.js # 註冊頁面
│ ├── Dashboard.js # 儀表板主頁
│ ├── Tasks.js # 任務列表頁面
│ ├── TaskDetails.js # 任務詳情頁面
│ ├── AddTask.js # 新增任務頁面
│ ├── EditTask.js # 編輯任務頁面
│ ├── Meetings.js # 會議列表頁面
│ ├── MeetingDetails.js # 會議詳情頁面
│ ├── AddMeeting.js # 新增會議頁面
│ ├── EditMeeting.js # 編輯會議頁面
│ ├── Settings.js # 設定頁面
│ └── *.styles.js # 各頁面對應的樣式文件
└── assets/ # 圖片和靜態資源
```