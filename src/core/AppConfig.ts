export const AppConfig = {
    Settings: {
        Server: {
            // baseUrl: "https://sidebet-api.herokuapp.com",
            baseUrl: `${process.env.NODE_ENV === "Production" ? "https://sidebet-api.herokuapp.com" : "http://localhost:3000"}`,
            timeout: 30000,
            context: "SideBet",
        }
    }
};