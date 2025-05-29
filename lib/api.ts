// API configuration and utilities
const BASE_API_URL = "https://vaaqef8o.app.n8n.cloud/webhook-test"

export const API_ENDPOINTS = {
  BASE: BASE_API_URL,
  UPDATE_USER_INFO: `${BASE_API_URL}/test`,
  // Add other endpoints as needed
  LOGIN: `${BASE_API_URL}/login`,
  PROFILE: `${BASE_API_URL}/profile`,
  INTERESTS: `${BASE_API_URL}/interests`,

}

// API utility functions
export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const defaultHeaders = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  try {
    const response = await fetch(endpoint, {
      ...options,
      headers: defaultHeaders,
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("API request error:", error)
    throw error
  }
}

// User signup API call
export const signupUser = async (email: string) => {
  try {
    return await apiRequest(API_ENDPOINTS.UPDATE_USER_INFO, {
      method: "POST",
      body: JSON.stringify({ email, interests: [] }),
    })
  } catch (error) {
    console.error("Signup error:", error)
    throw new Error("Failed to create account. Please try again.")
  }
}

// User login API call
export const loginUser = async (email: string, password: string) => {
  return apiRequest(API_ENDPOINTS.LOGIN, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  })
}

// Update user profile
export const updateUserProfile = async (userData: any) => {
  return apiRequest(API_ENDPOINTS.PROFILE, {
    method: "PUT",
    body: JSON.stringify(userData),
  })
}

// Update user interests
export const updateUserInterests = async (interests: string[]) => {
  return apiRequest(API_ENDPOINTS.INTERESTS, {
    method: "POST",
    body: JSON.stringify({ interests }),
  })
}

// Perform analysis
export const performAnalysis = async (analysisData: {
  ticker: string;
  risk_tolerance: string;
  time_horizon: string;
  analysis_type: string;
  data_request_flags: {
    fetch_current_price: boolean;
    fetch_historical_data: boolean;
    fetch_fundamental_data: boolean;
    fetch_news: boolean;
    fetch_economic_indicator: boolean;
    fetch_emotions: boolean;
  };
}) => {
  return apiRequest(`${BASE_API_URL}/analysis`, {
    method: "POST",
    body: JSON.stringify(analysisData),
  });
};
