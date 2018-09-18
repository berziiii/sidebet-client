export const AppConfig = {
    Settings: {
        Server: {
            baseUrl: `${process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://sidebet-api.herokuapp.com"}`,
            timeout: 30000,
            context: "SideBet",
        }
    }
};