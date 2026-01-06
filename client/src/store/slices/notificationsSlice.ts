import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  Notification,
  NotificationWithSample,
} from "@/types";
import {
  getUnfinishedNotifications,
  getNotificationWithSample,
  finishNotification,
  markNotificationAsRead,
} from "@/api/notificationsApi";

interface NotificationsState {
  notifications: Notification[];
  selectedNotification: NotificationWithSample | null;
  loading: boolean;
  error: string | null;
  unfinishedCount: number;
}

const initialState: NotificationsState = {
  notifications: [],
  selectedNotification: null,
  loading: false,
  error: null,
  unfinishedCount: 0,
};

// Thunks
export const fetchUnfinishedNotifications = createAsyncThunk(
  "notifications/fetchUnfinished",
  async () => {
    return await getUnfinishedNotifications();
  }
);

export const fetchNotificationWithSample = createAsyncThunk(
  "notifications/fetchWithSample",
  async (id: number) => {
    return await getNotificationWithSample(id);
  }
);

export const finishNotificationThunk = createAsyncThunk(
  "notifications/finish",
  async ({
    id,
    quantityTakenOut,
    finishedBy,
  }: {
    id: number;
    quantityTakenOut: number;
    finishedBy?: string;
  }) => {
    await finishNotification(id, quantityTakenOut, finishedBy);
    return id;
  }
);

export const markAsReadThunk = createAsyncThunk(
  "notifications/markAsRead",
  async (id: number) => {
    await markNotificationAsRead(id);
    return id;
  }
);

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    clearSelectedNotification(state) {
      state.selectedNotification = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch unfinished notifications
      .addCase(fetchUnfinishedNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchUnfinishedNotifications.fulfilled,
        (state, action: PayloadAction<Notification[]>) => {
          state.loading = false;
          state.notifications = action.payload;
          state.unfinishedCount = action.payload.length;
        }
      )
      .addCase(fetchUnfinishedNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch notifications";
      })
      // Fetch notification with sample
      .addCase(fetchNotificationWithSample.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchNotificationWithSample.fulfilled,
        (state, action: PayloadAction<NotificationWithSample>) => {
          state.loading = false;
          state.selectedNotification = action.payload;
        }
      )
      .addCase(fetchNotificationWithSample.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch notification";
      })
      // Finish notification
      .addCase(finishNotificationThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        finishNotificationThunk.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.loading = false;
          // Remove finished notification from list
          state.notifications = state.notifications.filter(
            (n) => n.id !== action.payload
          );
          state.unfinishedCount = state.notifications.length;
          state.selectedNotification = null;
        }
      )
      .addCase(finishNotificationThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to finish notification";
      })
      // Mark as read
      .addCase(markAsReadThunk.fulfilled, (state, action: PayloadAction<number>) => {
        const notification = state.notifications.find(
          (n) => n.id === action.payload
        );
        if (notification) {
          notification.Read = true;
          notification.ReadDate = new Date().toISOString();
        }
      });
  },
});

export const { clearSelectedNotification } = notificationsSlice.actions;
export default notificationsSlice.reducer;
