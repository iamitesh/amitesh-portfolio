import { siCaterpillar, siDiscover } from "simple-icons";
import type { CSSProperties } from "react";

type Brand = "caterpillar" | "discover" | "lseg" | "everest" | "epam";

const localBrands = {
  caterpillar: siCaterpillar,
  discover: siDiscover,
};

const remoteBrands: Partial<Record<Brand, string>> = {
  lseg: "https://img.logokit.com/lseg.com",
  everest: "https://img.logokit.com/everestglobal.com",
  epam: "https://img.logokit.com/epam.com",
};

const brandLabels: Record<Brand, string> = {
  caterpillar: "Caterpillar",
  discover: "Discover",
  lseg: "LSEG",
  everest: "Everest",
  epam: "EPAM",
};

export default function ProjectBrand({ brand }: { brand: Brand }) {
  const localBrand = brand === "caterpillar" || brand === "discover" ? localBrands[brand] : null;
  const remoteBrand = remoteBrands[brand];

  return (
    <div className={`project-brand project-brand-${brand}`} aria-hidden="true">
      {localBrand ? (
        <svg
          viewBox="0 0 24 24"
          style={{ "--project-brand-color": `#${localBrand.hex}` } as CSSProperties}
        >
          <path d={localBrand.path} />
        </svg>
      ) : (
        <>
          <span>{brandLabels[brand]}</span>
          {remoteBrand ? (
            <i style={{ backgroundImage: `url(${remoteBrand})` }} />
          ) : null}
        </>
      )}
    </div>
  );
}
