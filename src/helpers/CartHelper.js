import { useAuthStore } from "@/stores/auth";
import { useCartStore } from "@/stores/cart";
import cartService from "@/services/cart.service";
import {useRouter} from "vue-router";
import { showSuccess, showWarning } from "@/helpers/NotificationHelper";


const authStore = useAuthStore();
const cartStore = useCartStore();
const router = useRouter();

const addToCart = async (product_id, weight) => {
    if (authStore.isUserLoggedIn) {
      try {
        const user_id = authStore.user_id;
        const response = await cartService.create({
          user_id: user_id,
          product_id: product_id,
          quantity: 1,
          total_weight: weight,
        });
        await cartStore.fetchCartCount();
        console.log("Ket qua them: ", response);
        showSuccess("Thêm vào giỏ hàng thành công")
      } catch (error) {
        console.log(error.response);
        if (error.response.data.message === "Qúa số lượng cho phép") {
          showWarning("Đã quá số lướng cho phép");
        }
      }
    } else {
      warning();
      setTimeout(() => {
        router.push({ name: "login" });
      }, 500);
    }
  };


export { addToCart };