import { useState, useEffect } from "react";
import Header from "./components/Header";
import Guitar from "./components/Guitar";
import { db } from "./db";



function App() {
  //state


  const initialCart = () => {
    const localStorageCart = localStorage.getItem("cart");
    return localStorageCart ? JSON.parse(localStorageCart) : [];
  };

  const [data] = useState(db);
  const [cart, setCart] = useState(initialCart);

  const [search, setSearch] = useState("");

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

  const totalAmount = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  //const totalAmount = cart
    //.reduce((total, item) => total + item.price * item.quantity, 0)
    //.toFixed(2);

  console.log("totalAmount:"); // Depuración

  //const formattedTotalAmount = Number(totalAmount).toFixed(2); // Asegurar que es número
  const formattedTotalAmount = parseFloat(totalAmount);


  async function handleCheckout() {
    try {
      const cartItems = cart.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }));

      const response = await fetch("http://localhost:5000/create_preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cartItems }),
      });

      const data = await response.json();

      if (data.id) {
        window.location.href = `https://www.mercadopago.com.pe/checkout/v1/redirect?preference_id=${data.id}`;
      }
    } catch (error) {
      console.error("Error al procesar el pago:", error);
    }
  }

  

  const filteredGuitars = data.filter((guitar) =>
    guitar.name.toLowerCase().includes(search.toLowerCase())
  );


  return (
    <>

    
      <Header
        cart={cart}
        removeFromCart={removeFromCart}
        increaseQuantity={increaseQuantity}
        decreaseQuantity={decreaseQuantity}
        clearCart={clearCart}
      />
 
  <div className="container text-center mt-5">
        <button className="btn-mercadopago" onClick={handleCheckout}>Pagar con Mercado Pago</button>
      </div>

      <h2 className="text-center">Nuestra Colección</h2>

      <a 
  href="https://wa.me/+51986165341" 
  target="_blank" 
  rel="noopener noreferrer"
  className="whatsapp-button"
>
  Contactar por WhatsApp
</a>

      <div className="container-buscador">
        <h2>Buscador</h2>
        <input type="text"
          placeholder="Escribe el nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        </div>



      <main className="container-xl mt-5">
        <div className="row mt-5">
   

        {search.trim() !== "" ? (
            filteredGuitars.length > 0 ? (
              filteredGuitars.map((guitar) => (
                <Guitar
                  key={guitar.id}
                  guitar={guitar}
                  cart={cart}
                  setCart={setCart}
                  addToCart={addToCart}
                />
                
              ))
            ) : (
              <p className="text-center">No se encontraron guitarras</p>
            )
          ) : (

            
            data.map((guitar) => (
              <Guitar
                key={guitar.id}
                guitar={guitar}
                cart={cart}
                setCart={setCart}
                addToCart={addToCart}
              />
              
            ))
          )}
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
