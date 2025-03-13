import express from "express";
import cors from "cors";
import mercadopago from "mercadopago";

const app = express();
app.use(express.json());
app.use(cors());

// Configurar credenciales de Mercado Pago
mercadopago.configure({
  access_token: "TEST-8196631391328899-031302-6b028cc9190f3249000055cfe889da5f-2298864338" 
});

// Ruta para crear una preferencia de pago
app.post("/create_preference", async (req, res) => {
  try {
    const { items } = req.body;

    let preference = {
      items: items.map((item) => ({
        title: item.name,
        unit_price: Number(item.price),
        quantity: Number(item.quantity),
      })),
      back_urls: {
        success: "http://localhost:5000/success",
        failure: "http://localhost:5000/failure",
        pending: "http://localhost:5000/pending",
      },
      auto_return: "approved",
    };

    const response = await mercadopago.preferences.create(preference);
    res.json({ id: response.body.id });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Iniciar el servidor en el puerto 5000
app.listen(5000, () => {
  console.log("✅ Servidor corriendo en http://localhost:5173");
});
