type ExperienceBrandName = "caterpillar" | "epam" | "cognizant";

const brands: Record<ExperienceBrandName, { label: string; logo: string }> = {
  caterpillar: {
    label: "Caterpillar",
    logo: "https://img.logokit.com/caterpillar.com",
  },
  epam: {
    label: "EPAM",
    logo: "https://img.logokit.com/epam.com",
  },
  cognizant: {
    label: "Cognizant",
    logo: "https://img.logokit.com/cognizant.com",
  },
};

export default function ExperienceBrand({ brand }: { brand: ExperienceBrandName }) {
  const experienceBrand = brands[brand];

  return (
    <div className={`experience-brand experience-brand-${brand}`} aria-hidden="true">
      <span>{experienceBrand.label}</span>
      <i style={{ backgroundImage: `url(${experienceBrand.logo})` }} />
    </div>
  );
}
