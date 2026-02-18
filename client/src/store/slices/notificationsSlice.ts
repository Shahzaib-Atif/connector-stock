import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  getUnfinishedNotifications,
  getNotificationWithSample,
  finishNotification,
  markNotificationAsRead,
} from "@/api/notificationsApi";
import { INotification } from "@/utils/types/notificationTypes";

interface NotificationsState {
  notifications: INotification[];
  selectedNotification: INotification | null;
  loading: boolean;
  error: string | null;
  unfinishedCount: number;
  unreadCount: number;
}

const initialState: NotificationsState = {
  notifications: [],
  selectedNotification: null,
  loading: false,
  error: null,
  unfinishedCount: 0,
  unreadCount: 0,
};

// Thunks
export const fetchUnfinishedNotifications = createAsyncThunk(
  "notifications/fetchUnfinished",
  async () => {
    return await getUnfinishedNotifications();
  },
);

export const fetchNotificationWithSample = createAsyncThunk(
  "notifications/fetchWithSample",
  async (id: number) => {
    return await getNotificationWithSample(id);
  },
);

export const finishNotificationThunk = createAsyncThunk(
  "notifications/finish",
  async ({
    id,
    quantityTakenOut,
    finishedBy,
    completionNote,
  }: {
    id: number;
    quantityTakenOut: number;
    finishedBy?: string;
    completionNote?: string;
  }) => {
    await finishNotification(id, quantityTakenOut, finishedBy, completionNote);
    return id;
  },
);

export const markAsReadThunk = createAsyncThunk(
  "notifications/markAsRead",
  async (id: number) => {
    await markNotificationAsRead(id);
    return id;
  },
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
        (state, action: PayloadAction<INotification[]>) => {
          state.loading = false;
          state.notifications = action.payload;
          state.unfinishedCount = action.payload.length;
          state.unreadCount = action.payload.filter(
            (n) => !n.Read && !n.Finished,
          ).length;
        },
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
        (state, action: PayloadAction<INotification>) => {
          state.loading = false;
          state.selectedNotification = action.payload;
        },
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
          state.notifications = state.notifications.filter(
            (n) => n.id !== action.payload,
          );
          state.unfinishedCount = state.notifications.length;
          state.unreadCount = state.notifications.filter(
            (n) => !n.Read && !n.Finished,
          ).length;
          state.selectedNotification = null;
        },
      )
      .addCase(finishNotificationThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to finish notification";
      })
      // Mark as read
      .addCase(
        markAsReadThunk.fulfilled,
        (state, action: PayloadAction<number>) => {
          const notification = state.notifications.find(
            (n) => n.id === action.payload,
          );
          if (notification) {
            if (!notification.Read) {
              state.unreadCount = Math.max(0, state.unreadCount - 1);
            }
            notification.Read = true;
            notification.ReadDate = new Date().toISOString();
          }
        },
      );
  },
});

export const { clearSelectedNotification } = notificationsSlice.actions;
export default notificationsSlice.reducer;
