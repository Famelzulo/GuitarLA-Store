import express from "express";
import cors from "cors";
import mercadopago from "mercadopago";

const app = express();
const PORT = 5000;

app.use(cors()); // Permite peticiones desde el frontend
app.use(express.json()); // Permite recibir JSON en requests

mercadopago.configure({
  access_token: "TEST-5583470321193484-031103-613f0a58bead2b835f7a00accb976f51-2298864338"
});

app.post("/create_preference", async (req, res) => {
  try {
    const preference = {
      items: [
        {
          title: "Producto de prueba",
          unit_price: 100,
          quantity: 1,
        },
      ],
    };

    const response = await mercadopago.preferences.create(preference);
    res.json({ id: response.body.id });
  } catch (error) {
    console.error("Error al crear la preferencia:", error);
    res.status(500).json({ error: "Error al crear la preferencia de pago" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});
