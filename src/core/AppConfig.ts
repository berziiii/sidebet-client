export const AppConfig = {
    Settings: {
        Server: {
            // baseUrl: "https://sidebet-api.herokuapp.com",
            baseUrl: `${process.env.NODE_ENV ? "http://localhost:3000" : "https://sidebet-api.herokuapp.com"}`,
            timeout: 30000,
            context: "SideBet",
        }
    }
};