const TEST_MODE = import.meta.env.VITE_TEST_MODE
export const WS_ENDPOINT = TEST_MODE
  ? import.meta.env.VITE_TEST_WS_ENDPOINT
  : import.meta.env.VITE_MAIN_WS_ENDPOINT
export const JWT_TOKEN = TEST_MODE
  ? import.meta.env.VITE_TEST_JWT_TOKEN
  : import.meta.env.VITE_MAIN_JWT_TOKEN
