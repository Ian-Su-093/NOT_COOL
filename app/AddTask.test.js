import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AddTask from './AddTask';

// Mock dependencies
jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
}));
jest.mock('@react-native-community/datetimepicker', () => 'DateTimePicker');
jest.mock('./util/helpers', () => ({
    getLocalIP: jest.fn(() => '192.168.1.100')
}));

// Mock global fetch
global.fetch = jest.fn();
global.alert = jest.fn();

// Mock navigation
const mockNavigation = {
    goBack: jest.fn(),
};

// Mock route
const mockRoute = {
    params: {}
};

describe('AddTask Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        AsyncStorage.getItem.mockResolvedValue('test-user-id');
        fetch.mockClear();
        alert.mockClear();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('Component Rendering', () => {
        test('renders all input fields correctly', () => {
            const { getByPlaceholderText } = render(
                <AddTask route={mockRoute} navigation={mockNavigation} />
            );

            expect(getByPlaceholderText('任務名稱')).toBeTruthy();
            expect(getByPlaceholderText('任務描述')).toBeTruthy();
            expect(getByPlaceholderText('預計所需時間（分鐘）')).toBeTruthy();
            expect(getByPlaceholderText('重要性 (1-10)')).toBeTruthy();
            expect(getByPlaceholderText('新增成員')).toBeTruthy();
        });

        test('renders all buttons correctly', () => {
            const { getByText } = render(
                <AddTask route={mockRoute} navigation={mockNavigation} />
            );

            expect(getByText('選擇截止時間')).toBeTruthy();
            expect(getByText('新增成員')).toBeTruthy();
            expect(getByText('新增')).toBeTruthy();
        });

        test('displays current end time', () => {
            const { getByText } = render(
                <AddTask route={mockRoute} navigation={mockNavigation} />
            );

            expect(getByText(/截止時間：/)).toBeTruthy();
        });
    });

    describe('Form Validation', () => {
        test('shows alert when required fields are empty', async () => {
            const { getByText } = render(
                <AddTask route={mockRoute} navigation={mockNavigation} />
            );

            const submitButton = getByText('新增');

            await act(async () => {
                fireEvent.press(submitButton);
            });

            expect(alert).toHaveBeenCalledWith('請填寫所有欄位！');
        });

        test('shows alert when penalty is out of range', async () => {
            const { getByPlaceholderText, getByText } = render(
                <AddTask route={mockRoute} navigation={mockNavigation} />
            );

            // Fill required fields
            fireEvent.changeText(getByPlaceholderText('任務名稱'), 'Test Task');
            fireEvent.changeText(getByPlaceholderText('任務描述'), 'Test Description');
            fireEvent.changeText(getByPlaceholderText('預計所需時間（分鐘）'), '30');
            fireEvent.changeText(getByPlaceholderText('重要性 (1-10)'), '11'); // Invalid penalty

            const submitButton = getByText('新增');

            await act(async () => {
                fireEvent.press(submitButton);
            });

            expect(alert).toHaveBeenCalledWith('請填寫所有欄位！');
        });

        test('validates penalty matches parent task penalty', async () => {
            const routeWithParent = {
                params: { parentTaskID: 'parent-task-id' }
            };

            // Mock parent task fetch
            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ task: { Penalty: 5 } })
            });

            const { getByPlaceholderText, getByText } = render(
                <AddTask route={routeWithParent} navigation={mockNavigation} />
            );

            await waitFor(() => {
                expect(fetch).toHaveBeenCalledWith('http://192.168.1.100:3000/tasks/parent-task-id');
            });

            // Fill form with different penalty
            fireEvent.changeText(getByPlaceholderText('任務名稱'), 'Test Task');
            fireEvent.changeText(getByPlaceholderText('任務描述'), 'Test Description');
            fireEvent.changeText(getByPlaceholderText('預計所需時間（分鐘）'), '30');
            fireEvent.changeText(getByPlaceholderText('重要性 (1-10)'), '3'); // Different from parent

            const submitButton = getByText('新增');

            await act(async () => {
                fireEvent.press(submitButton);
            });

            expect(alert).toHaveBeenCalledWith('重要性必須與父任務 (5) 相同！');
        });
    });

    describe('Task Submission', () => {
        test('successfully submits task with valid data', async () => {
            // Mock successful task creation
            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ TaskID: 'new-task-id' })
            });

            const { getByPlaceholderText, getByText } = render(
                <AddTask route={mockRoute} navigation={mockNavigation} />
            );

            // Fill form
            fireEvent.changeText(getByPlaceholderText('任務名稱'), 'Test Task');
            fireEvent.changeText(getByPlaceholderText('任務描述'), 'Test Description');
            fireEvent.changeText(getByPlaceholderText('預計所需時間（分鐘）'), '30');
            fireEvent.changeText(getByPlaceholderText('重要性 (1-10)'), '5');

            const submitButton = getByText('新增');

            await act(async () => {
                fireEvent.press(submitButton);
            });

            await waitFor(() => {
                expect(fetch).toHaveBeenCalledWith('http://192.168.1.100:3000/tasks', 
                    expect.objectContaining({
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: expect.stringContaining('Test Task'),
                    })
                );
            });

            expect(alert).toHaveBeenCalledWith('成功', '任務已新增！', [
                { text: '確定' }
            ]);
            expect(mockNavigation.goBack).toHaveBeenCalled();
        });

        test('handles task submission error', async () => {
            // Mock failed task creation
            fetch.mockResolvedValueOnce({
                ok: false,
                json: async () => ({ message: 'Server error' })
            });

            const { getByPlaceholderText, getByText } = render(
                <AddTask route={mockRoute} navigation={mockNavigation} />
            );

            // Fill form
            fireEvent.changeText(getByPlaceholderText('任務名稱'), 'Test Task');
            fireEvent.changeText(getByPlaceholderText('任務描述'), 'Test Description');
            fireEvent.changeText(getByPlaceholderText('預計所需時間（分鐘）'), '30');
            fireEvent.changeText(getByPlaceholderText('重要性 (1-10)'), '5');

            const submitButton = getByText('新增');

            await act(async () => {
                fireEvent.press(submitButton);
            });

            await waitFor(() => {
                expect(alert).toHaveBeenCalledWith('錯誤', '新增任務失敗: Server error');
            });
        });

        test('handles network error during submission', async () => {
            // Mock network error
            fetch.mockRejectedValueOnce(new Error('Network error'));

            const { getByPlaceholderText, getByText } = render(
                <AddTask route={mockRoute} navigation={mockNavigation} />
            );

            // Fill form
            fireEvent.changeText(getByPlaceholderText('任務名稱'), 'Test Task');
            fireEvent.changeText(getByPlaceholderText('任務描述'), 'Test Description');
            fireEvent.changeText(getByPlaceholderText('預計所需時間（分鐘）'), '30');
            fireEvent.changeText(getByPlaceholderText('重要性 (1-10)'), '5');

            const submitButton = getByText('新增');

            await act(async () => {
                fireEvent.press(submitButton);
            });

            await waitFor(() => {
                expect(alert).toHaveBeenCalledWith('錯誤', '新增任務時發生錯誤，請稍後再試。');
            });
        });

        test('handles missing user ID', async () => {
            AsyncStorage.getItem.mockResolvedValueOnce(null);

            const { getByPlaceholderText, getByText } = render(
                <AddTask route={mockRoute} navigation={mockNavigation} />
            );

            // Fill form
            fireEvent.changeText(getByPlaceholderText('任務名稱'), 'Test Task');
            fireEvent.changeText(getByPlaceholderText('任務描述'), 'Test Description');
            fireEvent.changeText(getByPlaceholderText('預計所需時間（分鐘）'), '30');
            fireEvent.changeText(getByPlaceholderText('重要性 (1-10)'), '5');

            const submitButton = getByText('新增');

            await act(async () => {
                fireEvent.press(submitButton);
            });

            expect(alert).toHaveBeenCalledWith('錯誤', '未找到用戶ID，請先登入。');
        });
    });

    describe('Member Management', () => {
        test('adds member successfully', async () => {
            // Mock user lookup
            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ UserID: 'member-user-id' })
            });

            const { getByPlaceholderText, getByText } = render(
                <AddTask route={mockRoute} navigation={mockNavigation} />
            );

            const memberInput = getByPlaceholderText('新增成員');
            const addMemberButton = getByText('新增成員');

            fireEvent.changeText(memberInput, 'testuser');

            await act(async () => {
                fireEvent.press(addMemberButton);
            });

            await waitFor(() => {
                expect(fetch).toHaveBeenCalledWith('http://192.168.1.100:3000/users/by-username/testuser');
                expect(getByText('testuser')).toBeTruthy();
            });
        });

        test('shows alert when adding empty member name', async () => {
            const { getByText } = render(
                <AddTask route={mockRoute} navigation={mockNavigation} />
            );

            const addMemberButton = getByText('新增成員');

            await act(async () => {
                fireEvent.press(addMemberButton);
            });

            expect(alert).toHaveBeenCalledWith('請輸入成員名稱！');
        });

        test('shows alert when adding duplicate member', async () => {
            // Mock user lookup
            fetch.mockResolvedValue({
                ok: true,
                json: async () => ({ UserID: 'member-user-id' })
            });

            const { getByPlaceholderText, getByText } = render(
                <AddTask route={mockRoute} navigation={mockNavigation} />
            );

            const memberInput = getByPlaceholderText('新增成員');
            const addMemberButton = getByText('新增成員');

            // Add member first time
            fireEvent.changeText(memberInput, 'testuser');
            await act(async () => {
                fireEvent.press(addMemberButton);
            });

            // Try to add same member again
            fireEvent.changeText(memberInput, 'testuser');
            await act(async () => {
                fireEvent.press(addMemberButton);
            });

            expect(alert).toHaveBeenCalledWith('成員已存在！');
        });

        test('shows alert when user not found', async () => {
            // Mock user not found
            fetch.mockResolvedValueOnce({
                ok: false
            });

            const { getByPlaceholderText, getByText } = render(
                <AddTask route={mockRoute} navigation={mockNavigation} />
            );

            const memberInput = getByPlaceholderText('新增成員');
            const addMemberButton = getByText('新增成員');

            fireEvent.changeText(memberInput, 'nonexistentuser');

            await act(async () => {
                fireEvent.press(addMemberButton);
            });

            expect(alert).toHaveBeenCalledWith('錯誤', '無法找到該成員，請確認用戶名是否正確。');
        });

        test('removes member when pressed', async () => {
            // Mock user lookup
            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ UserID: 'member-user-id' })
            });

            const { getByPlaceholderText, getByText, queryByText } = render(
                <AddTask route={mockRoute} navigation={mockNavigation} />
            );

            const memberInput = getByPlaceholderText('新增成員');
            const addMemberButton = getByText('新增成員');

            // Add member
            fireEvent.changeText(memberInput, 'testuser');
            await act(async () => {
                fireEvent.press(addMemberButton);
            });

            // Verify member is added
            expect(getByText('testuser')).toBeTruthy();

            // Remove member by pressing on it
            await act(async () => {
                fireEvent.press(getByText('testuser'));
            });

            // Verify member is removed
            expect(queryByText('testuser')).toBeNull();
        });
    });

    describe('DateTime Picker', () => {
        test('shows date picker when button is pressed', () => {
            const { getByText, UNSAFE_getByType } = render(
                <AddTask route={mockRoute} navigation={mockNavigation} />
            );

            const dateButton = getByText('選擇截止時間');
            fireEvent.press(dateButton);

            expect(UNSAFE_getByType('DateTimePicker')).toBeTruthy();
        });

        test('updates end time when date is selected', () => {
            const { getByText, UNSAFE_getByType } = render(
                <AddTask route={mockRoute} navigation={mockNavigation} />
            );

            const dateButton = getByText('選擇截止時間');
            fireEvent.press(dateButton);

            const datePicker = UNSAFE_getByType('DateTimePicker');
            const testDate = new Date('2024-12-31T23:59:59');

            act(() => {
                datePicker.props.onChange({ type: 'set' }, testDate);
            });

            expect(getByText(/截止時間：.*2024.*12.*31/)).toBeTruthy();
        });
    });

    describe('Parent Task Integration', () => {
        test('fetches parent task penalty on mount', async () => {
            const routeWithParent = {
                params: { parentTaskID: 'parent-task-id' }
            };

            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ task: { Penalty: 7 } })
            });

            render(<AddTask route={routeWithParent} navigation={mockNavigation} />);

            await waitFor(() => {
                expect(fetch).toHaveBeenCalledWith('http://192.168.1.100:3000/tasks/parent-task-id');
            });
        });

        test('handles parent task fetch error', async () => {
            const routeWithParent = {
                params: { parentTaskID: 'parent-task-id' }
            };

            fetch.mockResolvedValueOnce({
                ok: false,
                statusText: 'Not Found'
            });

            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

            render(<AddTask route={routeWithParent} navigation={mockNavigation} />);

            await waitFor(() => {
                expect(consoleSpy).toHaveBeenCalledWith('獲取父任務失敗:', 'Not Found');
            });

            consoleSpy.mockRestore();
        });
    });
});