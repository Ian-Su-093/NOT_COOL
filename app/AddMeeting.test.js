import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AddMeeting from './AddMeeting';

// Mock dependencies
jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
}));

jest.mock('./util/helpers', () => ({
    getLocalIP: jest.fn(() => '192.168.1.1'),
}));

jest.mock('@react-native-community/datetimepicker', () => {
    const React = require('react');
    const { View, Text, Pressable } = require('react-native');

    return ({ value, onChange, ...props }) => (
        <View testID="datetime-picker">
            <Pressable
                testID="datetime-picker-button"
                onPress={() => onChange({ type: 'set' }, new Date('2024-06-15T10:30:00'))}
            >
                <Text>Mock DateTime Picker</Text>
            </Pressable>
        </View>
    );
});

// Mock fetch
global.fetch = jest.fn();

// Mock navigation
const mockNavigation = {
    goBack: jest.fn(),
};

// Mock route
const mockRoute = {
    params: {
        taskID: 'test-task-id',
    },
};

// Mock alert
global.alert = jest.fn();

describe('AddMeeting Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        AsyncStorage.getItem.mockResolvedValue('test-user-id');
        fetch.mockClear();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    const renderComponent = (route = mockRoute) => {
        return render(
            <AddMeeting
                route={route}
                navigation={mockNavigation}
            />
        );
    };

    describe('Component Rendering', () => {
        test('renders all input fields correctly', () => {
            const { getByPlaceholderText, getByText } = renderComponent();

            expect(getByPlaceholderText('會議標題')).toBeTruthy();
            expect(getByPlaceholderText('會議描述')).toBeTruthy();
            expect(getByPlaceholderText('預計所需時間（分鐘）')).toBeTruthy();
            expect(getByText('選擇會議時間')).toBeTruthy();
            expect(getByText('新增')).toBeTruthy();
        });

        test('displays initial date correctly', () => {
            const { getByText } = renderComponent();

            // Check if date text is displayed (format may vary based on locale)
            const dateText = getByText(/會議時間：/);
            expect(dateText).toBeTruthy();
        });
    });

    describe('Form Input Handling', () => {
        test('updates title when user types', () => {
            const { getByPlaceholderText } = renderComponent();
            const titleInput = getByPlaceholderText('會議標題');

            fireEvent.changeText(titleInput, '測試會議');
            expect(titleInput.props.value).toBe('測試會議');
        });

        test('updates description when user types', () => {
            const { getByPlaceholderText } = renderComponent();
            const descriptionInput = getByPlaceholderText('會議描述');

            fireEvent.changeText(descriptionInput, '測試描述');
            expect(descriptionInput.props.value).toBe('測試描述');
        });

        test('updates expected time when user types', () => {
            const { getByPlaceholderText } = renderComponent();
            const timeInput = getByPlaceholderText('預計所需時間（分鐘）');

            fireEvent.changeText(timeInput, '60');
            expect(timeInput.props.value).toBe('60');
        });

        test('only accepts numeric input for expected time', () => {
            const { getByPlaceholderText } = renderComponent();
            const timeInput = getByPlaceholderText('預計所需時間（分鐘）');

            expect(timeInput.props.keyboardType).toBe('numeric');
        });
    });

    describe('Date Time Picker', () => {
        test('shows date picker when button is pressed', () => {
            const { getByText, queryByTestId } = renderComponent();

            // Initially picker should not be visible
            expect(queryByTestId('datetime-picker')).toBeFalsy();

            // Press the button to show picker
            fireEvent.press(getByText('選擇會議時間'));

            // Now picker should be visible
            expect(queryByTestId('datetime-picker')).toBeTruthy();
        });

        test('updates date when picker value changes', async () => {
            const { getByText, getByTestId } = renderComponent();

            // Show the picker
            fireEvent.press(getByText('選擇會議時間'));

            // Simulate date selection
            const pickerButton = getByTestId('datetime-picker-button');
            fireEvent.press(pickerButton);

            await waitFor(() => {
                // Check if the date text was updated
                expect(getByText(/會議時間：/)).toBeTruthy();
            });
        });
    });

    describe('Form Validation', () => {
        test('shows alert when title is missing', async () => {
            const { getByPlaceholderText, getByText } = renderComponent();

            // Fill only some fields
            fireEvent.changeText(getByPlaceholderText('會議描述'), '測試描述');
            fireEvent.changeText(getByPlaceholderText('預計所需時間（分鐘）'), '60');

            // Try to submit without title
            fireEvent.press(getByText('新增'));

            await waitFor(() => {
                expect(global.alert).toHaveBeenCalledWith('請填寫所有欄位！');
            });
        });

        test('shows alert when description is missing', async () => {
            const { getByPlaceholderText, getByText } = renderComponent();

            // Fill only some fields
            fireEvent.changeText(getByPlaceholderText('會議標題'), '測試會議');
            fireEvent.changeText(getByPlaceholderText('預計所需時間（分鐘）'), '60');

            // Try to submit without description
            fireEvent.press(getByText('新增'));

            await waitFor(() => {
                expect(global.alert).toHaveBeenCalledWith('請填寫所有欄位！');
            });
        });

        test('shows alert when expected time is missing', async () => {
            const { getByPlaceholderText, getByText } = renderComponent();

            // Fill only some fields
            fireEvent.changeText(getByPlaceholderText('會議標題'), '測試會議');
            fireEvent.changeText(getByPlaceholderText('會議描述'), '測試描述');

            // Try to submit without expected time
            fireEvent.press(getByText('新增'));

            await waitFor(() => {
                expect(global.alert).toHaveBeenCalledWith('請填寫所有欄位！');
            });
        });
    });

    describe('API Integration', () => {
        test('submits meeting successfully', async () => {
            const { getByPlaceholderText, getByText } = renderComponent();

            // Mock successful API response
            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ id: 'meeting-123', message: 'Success' }),
            });

            // Fill all fields
            fireEvent.changeText(getByPlaceholderText('會議標題'), '測試會議');
            fireEvent.changeText(getByPlaceholderText('會議描述'), '測試描述');
            fireEvent.changeText(getByPlaceholderText('預計所需時間（分鐘）'), '60');

            // Submit form
            await act(async () => {
                fireEvent.press(getByText('新增'));
            });

            await waitFor(() => {
                expect(fetch).toHaveBeenCalledWith(
                    'http://192.168.1.1:3000/meetings',
                    expect.objectContaining({
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: expect.stringContaining('測試會議'),
                    })
                );
            });

            await waitFor(() => {
                expect(global.alert).toHaveBeenCalledWith(
                    '成功',
                    '已新增！',
                    [{ text: '確定' }]
                );
            });

            expect(mockNavigation.goBack).toHaveBeenCalled();
        });

        test('handles API error response', async () => {
            const { getByPlaceholderText, getByText } = renderComponent();

            // Mock API error response
            fetch.mockResolvedValueOnce({
                ok: false,
                json: async () => ({ error: 'Server error' }),
            });

            // Fill all fields
            fireEvent.changeText(getByPlaceholderText('會議標題'), '測試會議');
            fireEvent.changeText(getByPlaceholderText('會議描述'), '測試描述');
            fireEvent.changeText(getByPlaceholderText('預計所需時間（分鐘）'), '60');

            // Submit form
            await act(async () => {
                fireEvent.press(getByText('新增'));
            });

            await waitFor(() => {
                expect(global.alert).toHaveBeenCalledWith('新增會議失敗，請稍後再試。');
            });

            expect(mockNavigation.goBack).not.toHaveBeenCalled();
        });

        test('handles network error', async () => {
            const { getByPlaceholderText, getByText } = renderComponent();

            // Mock network error
            fetch.mockRejectedValueOnce(new Error('Network error'));

            // Fill all fields
            fireEvent.changeText(getByPlaceholderText('會議標題'), '測試會議');
            fireEvent.changeText(getByPlaceholderText('會議描述'), '測試描述');
            fireEvent.changeText(getByPlaceholderText('預計所需時間（分鐘）'), '60');

            // Submit form
            await act(async () => {
                fireEvent.press(getByText('新增'));
            });

            await waitFor(() => {
                expect(global.alert).toHaveBeenCalledWith('新增會議失敗，請稍後再試。');
            });
        });

        test('sends correct data structure to API', async () => {
            const { getByPlaceholderText, getByText } = renderComponent();

            // Mock successful API response
            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ id: 'meeting-123' }),
            });

            // Fill all fields
            fireEvent.changeText(getByPlaceholderText('會議標題'), '測試會議');
            fireEvent.changeText(getByPlaceholderText('會議描述'), '測試描述');
            fireEvent.changeText(getByPlaceholderText('預計所需時間（分鐘）'), '60');

            // Submit form
            await act(async () => {
                fireEvent.press(getByText('新增'));
            });

            await waitFor(() => {
                const [url, options] = fetch.mock.calls[0];
                const requestBody = JSON.parse(options.body);

                expect(requestBody).toEqual({
                    TaskID: 'test-task-id',
                    MeetingName: '測試會議',
                    MeetingDetail: '測試描述',
                    Duration: 3600, // 60 minutes * 60 seconds
                    StartTime: expect.any(String),
                });
            });
        });
    });

    describe('User Authentication', () => {
        test('handles missing user ID', async () => {
            // Mock AsyncStorage to return null
            AsyncStorage.getItem.mockResolvedValueOnce(null);

            const { getByPlaceholderText, getByText } = renderComponent();

            // Fill all fields
            fireEvent.changeText(getByPlaceholderText('會議標題'), '測試會議');
            fireEvent.changeText(getByPlaceholderText('會議描述'), '測試描述');
            fireEvent.changeText(getByPlaceholderText('預計所需時間（分鐘）'), '60');

            // Submit form
            await act(async () => {
                fireEvent.press(getByText('新增'));
            });

            await waitFor(() => {
                expect(global.alert).toHaveBeenCalledWith('錯誤', '未找到用戶ID，請先登入。');
            });

            expect(fetch).not.toHaveBeenCalled();
        });
    });

    describe('Form Reset', () => {
        test('resets form after successful submission', async () => {
            const { getByPlaceholderText, getByText } = renderComponent();

            // Mock successful API response
            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ id: 'meeting-123' }),
            });

            // Fill all fields
            const titleInput = getByPlaceholderText('會議標題');
            const descriptionInput = getByPlaceholderText('會議描述');
            const timeInput = getByPlaceholderText('預計所需時間（分鐘）');

            fireEvent.changeText(titleInput, '測試會議');
            fireEvent.changeText(descriptionInput, '測試描述');
            fireEvent.changeText(timeInput, '60');

            // Submit form
            await act(async () => {
                fireEvent.press(getByText('新增'));
            });

            await waitFor(() => {
                expect(titleInput.props.value).toBe('');
                expect(descriptionInput.props.value).toBe('');
                expect(timeInput.props.value).toBe('');
            });
        });
    });

    describe('Edge Cases', () => {
        test('handles component without route params', () => {
            const routeWithoutParams = { params: {} };

            expect(() => {
                renderComponent(routeWithoutParams);
            }).not.toThrow();
        });

        test('handles zero expected time', async () => {
            const { getByPlaceholderText, getByText } = renderComponent();

            // Mock successful API response
            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ id: 'meeting-123' }),
            });

            // Fill fields with zero time
            fireEvent.changeText(getByPlaceholderText('會議標題'), '測試會議');
            fireEvent.changeText(getByPlaceholderText('會議描述'), '測試描述');
            fireEvent.changeText(getByPlaceholderText('預計所需時間（分鐘）'), '0');

            // Submit form
            await act(async () => {
                fireEvent.press(getByText('新增'));
            });

            await waitFor(() => {
                const [url, options] = fetch.mock.calls[0];
                const requestBody = JSON.parse(options.body);
                expect(requestBody.Duration).toBe(0);
            });
        });
    });
});