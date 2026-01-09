import React from "react";
import { Accessory } from "../../../utils/types";
import { AccessoryItem } from "./AccessoryItem";
import { CollapsibleSection } from "@/components/common/CollapsibleSection";
import { Wrench } from "lucide-react";

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
    <CollapsibleSection
      title="Associated Accessories"
      icon={<Wrench className="w-4 h-4" />}
      count={accessories.length}
    >
      {accessories.map((acc) => (
        <AccessoryItem
          key={acc.id}
          accessory={acc}
          stock={acc.Qty}
          onInspect={onInspect}
          onTransaction={onTransaction}
        />
      ))}{" "}
      {accessories.map((acc) => (
        <AccessoryItem
          key={acc.id}
          accessory={acc}
          stock={acc.Qty}
          onInspect={onInspect}
          onTransaction={onTransaction}
        />
      ))}
    </CollapsibleSection>
  );
};
