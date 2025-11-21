import React from "react";
import { Accessory } from "../../types";
import { resolveLiveStock } from "../../utils/stock";
import { AccessoryItem } from "./AccessoryItem";

interface Props {
  accessories: Accessory[];
  stockCache: Record<string, number>;
  onTransaction: (type: "IN" | "OUT", id: string) => void;
  onInspect: (id: string) => void;
}

export const AccessoryList: React.FC<Props> = ({
  accessories,
  stockCache,
  onTransaction,
  onInspect,
}) => {
  return (
    <>
      {accessories.map((acc) => (
        <AccessoryItem
          key={acc.id}
          accessory={acc}
          stock={resolveLiveStock(stockCache, acc.id, acc.stock)}
          onInspect={onInspect}
          onTransaction={onTransaction}
        />
      ))}
    </>
  );
};
