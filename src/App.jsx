import { useState, useEffect } from "react";
import Header from "./components/Header";
import Guitar from "./components/Guitar";
import { db } from "./db";
//import { PayPalScriptProvider } from "@paypal/react-paypal-js";
//import PayPalButton from "./PayPalButton";

function App() {
  //state

  const initialCart = () => {
    const localStorageCart = localStorage.getItem("cart");
    return localStorageCart ? JSON.parse(localStorageCart) : [];
  };

  const [data] = useState(db);
  const [cart, setCart] = useState(initialCart);

  const MAX_ITEMS = 5;
  const MIN_ITEMS = 1;

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  function addToCart(item) {
    const itemExists = cart.findIndex((guitar) => guitar.id === item.id);
    if (itemExists >= 0) {
      //existe el carrito
      if (cart[itemExists].quantity >= MAX_ITEMS) return;
      const updatedCart = [...cart];
      updatedCart[itemExists].quantity++;
      setCart(updatedCart);
    } else {
      item.quantity = 1;
      setCart([...cart, item]);
    }
  }

  function removeFromCart(id) {
    setCart((prevCart) => prevCart.filter((guitar) => guitar.id !== id));
  }

  function increaseQuantity(id) {
    const updatedCart = cart.map((item) => {
      if (item.id === id && item.quantity < MAX_ITEMS) {
        return {
          ...item,
          quantity: item.quantity + 1,
        };
      }
      return item;
    });
    setCart(updatedCart);
  }

  function decreaseQuantity(id) {
    const updatedCart = cart.map((item) => {
      if (item.id === id && item.quantity > MIN_ITEMS) {
        return {
          ...item,
          quantity: item.quantity - 1,
        };
      }
      return item;
    });
    setCart(updatedCart);
  }

  function clearCart() {
    setCart([]);
  }

  const totalAmount = cart
    .reduce((total, item) => total + item.price * item.quantity, 0)
    .toFixed(2);

  console.log("totalAmount:"); // Depuración

  const formattedTotalAmount = Number(totalAmount).toFixed(2); // Asegurar que es número

  return (
    <>
      <Header
        cart={cart}
        removeFromCart={removeFromCart}
        increaseQuantity={increaseQuantity}
        decreaseQuantity={decreaseQuantity}
        clearCart={clearCart}
      />

      {/* /* <PayPalScriptProvider options={{ "client-id": "AZOwea50fTWEcVZIUO-Tp7tOqurJobiCB-CgXMlvfQJpAshn8Uv2R3CXTvrXfMYWO3CzMPDe6ep5g-ym" }}>
          <div className="text-center mt-5">
            
            <h2>Total a pagar: ${formattedTotalAmount}</h2>

            <PayPalButton totalAmount={totalAmount} />
          </div>
        </PayPalScriptProvider> */}

      <main className="container-xl mt-5">
        <h2 className="text-center">Nuestra Colección</h2>

        <div className="row mt-5">
          {data.map((guitar) => {
            return (
              <Guitar
                key={guitar.id} //prop especial al iterar una lista
                guitar={guitar}
                cart={cart}
                setCart={setCart}
                addToCart={addToCart}
              />
            );
          })}
        </div>
      </main>

      <footer className="bg-dark mt-5 py-5">
        <div className="container-xl">
          <p className="text-white text-center fs-4 mt-4 m-md-0">
            GuitarLA - Todos los derechos Reservados
          </p>
        </div>
      </footer>
    </>
  );
}

export default App;
