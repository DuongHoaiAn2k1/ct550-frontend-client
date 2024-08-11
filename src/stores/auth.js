import Cookies from 'js-cookie';
import { defineStore } from "pinia";

export const useAuthStore = defineStore("userLogin", {
  state: () => ({
    isUserLoggedIn: JSON.parse(Cookies.get("isUserLoggedIn") || "false"),
    accessTokenUser: Cookies.get("accessTokenUser") || null,
    refreshTokenUser: Cookies.get("refreshTokenUser") || null,
    user_id: Cookies.get("user_id"),
  }),

  actions: {
    login(access_token, refresh_token, user_id) {
      this.isUserLoggedIn = true;
      this.accessTokenUser = access_token;
      this.refreshTokenUser = refresh_token;
      this.user_id = user_id;
      Cookies.set("isUserLoggedIn", true, {expires: 7});
      Cookies.set("accessTokenUser", access_token, { secure: true, expires: 7});
      Cookies.set("refreshTokenUser", refresh_token, { secure: true, expires: 7});
      Cookies.set("user_id", user_id, { expires: 7});
    },

    logout() {
      this.isUserLoggedIn = false;
      this.accessTokenUser = null;
      this.refreshTokenUser = null;
      this.user_id = null;
      Cookies.set("isUserLoggedIn", false, {expires: 7});
      Cookies.remove("accessTokenUser");
      Cookies.remove("refreshTokenUser");
      Cookies.remove("user_id");
    },
  },
});
