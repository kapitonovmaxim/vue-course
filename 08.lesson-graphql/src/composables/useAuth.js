const auth = {
    get: () => {
        const authValue = localStorage.getItem("auth");
        return authValue === "true";
    },

    set: (value) => {
        localStorage.setItem("auth", value.toString());
    },

    clear: () => {
        localStorage.removeItem("auth");
    },

    isAuthenticated: () => {
        return auth.get();
    }
};

export default auth;