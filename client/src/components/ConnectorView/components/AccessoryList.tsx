import React from "react";
import { Accessory } from "../../../types";
import { AccessoryItem } from "./AccessoryItem";

interface Props {
  accessories: Accessory[];
  onTransaction: (type: "IN" | "OUT", id: string) => void;
  onInspect: (id: string) => void;
}

export const AccessoryList: React.FC<Props> = ({
  accessories,
  onTransaction,
  onInspect,
}) => {
  return (
    <>
      {accessories.map((acc) => (
        <AccessoryItem
          key={acc.id}
          accessory={acc}
          stock={acc.stock}
          onInspect={onInspect}
          onTransaction={onTransaction}
        />
      ))}{" "}
      {accessories.map((acc) => (
        <AccessoryItem
          key={acc.id}
          accessory={acc}
          stock={acc.stock}
          onInspect={onInspect}
          onTransaction={onTransaction}
        />
      ))}
    </>
  );
};
