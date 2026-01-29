import React from "react";
import SectionCard from "../helpers/SectionCard";
import { WinePairing as WinePairingType } from "@/types/recipeTypes";
import Chip from "../helpers/Chip";

interface Props {
  wines: WinePairingType | undefined;
}

const WinePairing = ({ wines }: Props) => {
  const hasWinePairing =
    !!wines &&
    ((wines.pairedWines?.length ?? 0) > 0 ||
      !!wines.pairingText ||
      (wines.productMatches?.length ?? 0) > 0);

  return hasWinePairing ? (
    <SectionCard title="Wine pairing">
      {wines ? (
        <div className="space-y-3">
          {wines.pairingText ? (
            <p className="text-sm text-muted-foreground">{wines.pairingText}</p>
          ) : null}

          {(wines.pairedWines?.length ?? 0) > 0 ? (
            <div className="flex flex-wrap gap-2">
              {wines.pairedWines.map((w) => (
                <Chip key={w}>{w}</Chip>
              ))}
            </div>
          ) : null}

          {(wines.productMatches?.length ?? 0) > 0 ? (
            <div className="space-y-2">
              {wines.productMatches.map((p) => (
                <div key={p.id} className="rounded-md border bg-background p-3">
                  <p className="text-sm font-medium leading-snug">{p.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {p.price} • {p.ratingCount} ratings •{" "}
                    {Math.round(p.averageRating * 10) / 10}⭐
                  </p>
                  {p.description ? (
                    <p className="mt-2 text-xs text-muted-foreground line-clamp-3">
                      {p.description}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          No pairing info available.
        </p>
      )}
    </SectionCard>
  ) : null;
};

export default WinePairing;
