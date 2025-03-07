import React from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";

const PayPalButton = ({ totalAmount }) => {
  return (
    <PayPalButtons
      createOrder={(data, actions) => {
        return actions.order.create({
          purchase_units: [{ amount: { value: totalAmount } }],
        });
      }}
      onApprove={(data, actions) => {
        return actions.order.capture().then((details) => {
          alert(`Pago exitoso por ${details.payer.name.given_name}`);
        });
      }}
    />
  );
};

export default PayPalButton;
