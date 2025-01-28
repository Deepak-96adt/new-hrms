
import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, {getState, rejectWithValue }) => {
    try {
      const state = getState();
      const refreshToken = state.auth.refreshToken;
      const response = await axios.post(`/apigateway/api/auth/login`, {
        email,
        password,
        deviceInfo: {
          deviceId: 'D1',
          deviceType: 'DEVICE_TYPE_ANDROID',
        },
      });
      console.log(refreshToken);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message); 
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    refreshToken: null,
    tokenExpiry:null,
    empId: null,
    permissions: [],
    loading: false,
    error: null,
    name: null,
    roles: []
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.refreshToken = null;
      state.tokenExpiry=null;
      state.empId = null;
      state.permissions = [];
      state.name = null;
      state.roles = [];
    },
    updateTokens: (state, action) => {
      state.token = action.payload.ntoken;
      state.refreshToken = action.payload.nrefreshToken;
      state.tokenExpiry = action.payload.ntokenExpiry;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.jwtAuthenticationResponse.accessToken;
        state.refreshToken = action.payload.jwtAuthenticationResponse.refreshToken;
        state.tokenExpiry = action.payload.jwtAuthenticationResponse.expiryDuration;
        state.empId = action.payload.employeeId;
        state.name = action.payload.employeeName;
        state.roles = action.payload.roles.map(role => role.role);
        
        // Flattening permissions from all roles
        const allPermissions = action.payload.roles.flatMap(role => role.permission);
        state.permissions = Array.from(new Set(allPermissions)); 
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Server error';
      });
  },
});

export const { logout, updateTokens } = authSlice.actions;
export default authSlice.reducer;


