import { useReducer } from "react";
import { createContext } from "react";

export const Store = createContext();

const initialState = {
  cart: {
    cartItems: localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [],
      shippingAddress: localStorage.getItem("shippingAddress")
      ? JSON.parse(localStorage.getItem("shippingAddress"))
      : {},
      paymentMethod: localStorage.getItem("paymentMethod")
      ? JSON.parse(localStorage.getItem("paymentMethod"))
      : null,
       
  },
  userInfo: 
     localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null,

};
function reducer(state, action) {
  switch (action.type) {
    case "CART_ADD_ITEM":
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find(
        (item) => item._id === newItem._id
      );
      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
            item._id === existItem._id ? newItem : item
          )
        : [...state.cart.cartItems, newItem];

        localStorage.setItem("cartItems", JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };

    case "CART_REMOVE_ITEM": {
      const cartItems = state.cart.cartItems.filter(
        (item) => item._id !== action.payload._id
      );

      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case "USER_SIGNIN": {
      localStorage.setItem('userInfo', JSON.stringify(action.payload))
      
      return { ...state, userInfo: action.payload };
    }
    case "CART_CLEAR": {
      localStorage.removeItem('cartItems');
      
      return { ...state, cart:{...state.cart, cartItems: [] } };
    }
    case "USER_SIGNUP": {
      localStorage.setItem('userInfo', JSON.stringify(action.payload))
      
      return { ...state, userInfo: action.payload };
    }
    case "USER_PROFILE_UPDATE": {
      localStorage.setItem('userInfo', JSON.stringify(action.payload))
      
      return { ...state, userInfo: action.payload };
    }
    case "USER_SIGNOUT": {
      localStorage.removeItem('userInfo');
      localStorage.removeItem('shippingAddress');
      localStorage.removeItem('paymentMethod');
     
      return { ...state, userInfo: null, cart: {cartItems: [],  shippingAddress: {}, paymentMethod: null} };
    }
    case "SAVE_SHIPPING_ADDRESS": {
      localStorage.setItem('shippingAddress', JSON.stringify(action.payload));
     
      return { ...state, cart: {...state.cart,  shippingAddress: action.payload}};
    }
    case "ADD_PAYMENT_METHOD": {
      localStorage.setItem('paymentMethod', JSON.stringify(action.payload));
     
      return { ...state, cart: {...state.cart,  paymentMethod: action.payload}};
    }

    default:
      return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };

  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
