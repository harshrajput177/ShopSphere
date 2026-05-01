import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // ➕ ADD TO CART
  const addToCart = (product) => {

      console.log("CONTEXT ADD:", product);
      
    setCartItems((prev) => {
      const exist = prev.find(
        (item) =>
          item._id === product._id &&
          item.size === product.size
      );

      if (exist) {
        return prev.map((item) =>
          item._id === product._id &&
          item.size === product.size
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }

      return [...prev, { ...product, qty: 1 }];
    });
  };

  // ➖ DECREASE
  const decreaseQty = (product) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item._id === product._id &&
          item.size === product.size
            ? { ...item, qty: item.qty - 1 }
            : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  // ➕ INCREASE
  const increaseQty = (product) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === product._id &&
        item.size === product.size
          ? { ...item, qty: item.qty + 1 }
          : item
      )
    );
  };

  // ❌ REMOVE
  const removeItem = (product) => {
    setCartItems((prev) =>
      prev.filter(
        (item) =>
          !(item._id === product._id &&
            item.size === product.size)
      )
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        increaseQty,
        decreaseQty,
        removeItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};