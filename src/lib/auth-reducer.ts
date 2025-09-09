import { AuthState, AuthAction } from "@/types/auth.types";

export const initialAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

export const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, loading: true, error: null };
      
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
      
    case "LOGIN_FAILURE":
      return { 
        ...state, 
        loading: false, 
        error: action.payload,
        user: null,
        isAuthenticated: false,
      };
      
    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        error: null,
        loading: false,
      };
      
    case "UPDATE_PROFILE":
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
      
    case "CLEAR_ERROR":
      return { ...state, error: null };
      
    case "INIT_COMPLETE":
      return { ...state, loading: false };
      
    default:
      return state;
  }
};
