import React, { useContext, useEffect, useState } from "react";
import SelectDropdown from "../atoms/SelectDropdown.js";
import AuthContext from "../../context/AuthContext.js";

const PaymentDropdown = ({
  allow_no_payment = false,
  link = false,
  ...props
}) => {
  const [payment_methods, setPaymentMethods] = useState([
    { label: "Online", value: "ONLINE" },
  ]);

  const { auth } = useContext(AuthContext);

  const getCash = auth.agent.privileges.includes("COLLECT_CASH_PAYMENTS");
  const getBank = auth.agent.privileges.includes("COLLECT_BANK_PAYMENTS");
  const getCard = auth.agent.privileges.includes("COLLECT_CARD_PAYMENTS");

  useEffect(() => {
    const newMethods = payment_methods.slice();

    const cash = { label: "Cash", value: "CASH" };
    const bank = { label: "Bank", value: link ? "LINK" : "BANK" };
    const card = { label: "Card", value: "CARD" };
    const skip = { label: "No Payment", value: "NO_PAYMENT" };

    const includes_cash = newMethods.some(({ value }) => value === "CASH");
    const includes_bank = newMethods.some(({ value }) => value === "BANK");
    const includes_card = newMethods.some(({ value }) => value === "CARD");

    if (getCash && !includes_cash) newMethods.push(cash);
    if (getBank && !includes_bank) newMethods.push(bank);
    if (getCard && !includes_card) newMethods.push(card);
    if (allow_no_payment) newMethods.push(skip);

    setPaymentMethods(newMethods);
  }, [auth]);

  return <SelectDropdown list={payment_methods} {...props} />;
};

export default PaymentDropdown;
