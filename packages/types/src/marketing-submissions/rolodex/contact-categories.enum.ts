export const categoriesEnum = [
  "Churches/Schools",
  "Construction",
  "Energy",
  "Environmental",
  "Farm/Ranch",
  "General Industries (Mid Market)",
  "Inland Marine",
  "London Facilities",
  "Management Lines",
  "Ocean Marine",
  "Property",
  "Select/Small Business",
  "Transportation",
  "Umbrella",
  "Wholesale Brokers",
] as const;

export const categoriesOptions = categoriesEnum.map((category) => category);
