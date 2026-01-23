export type NavItem = { label: string; href: string };

export type SiteSettings = {
  title: string;
  description: string;
  keywords: string;
  canonical: string;
  yandexVerification?: string;
  heroTitleLines: string[];
  nav?: NavItem[];
  sections: {
    projectsTitle: string;
    servicesTitle: string;
    pricingTitle: string;
    contactsTitle: string;
  };
  footerText: string;
};

export type Project = {
  id: number;
  title: string;
  description: string;
  smallImage: string;
  featuredImages: [string, string];
  sort: number;
};

export type CarouselImage = {
  src: string;
  alt?: string;
  order: number;
};

export type Carousel = {
  id: number;
  title: string;
  images: CarouselImage[];
};

export type Service = {
  id: number;
  title: string;
  description: string;
  image: string;
  order: number;
};

export type PriceRow = {
  id: string;
  name: string;
  price: number;
  currency: string;
  unit: string;
  order: number;
};

export type PricingTable = {
  title: string;
  mobileTitle: string;
  rows: PriceRow[];
};

export type Pricing = {
  note: string;
  landscape: PricingTable;
  interior: PricingTable;
};

export type Contacts = {
  companyName: string;
  phone: string;
  displayPhone: string;
  email: string;
  address: string;
  mapUrl: string;
  telegramUrl: string;
  telegramHandle: string;
  aboutTitle: string;
  aboutText: string;
  logoImage: string;
};

export type Content = {
  site: SiteSettings;
  projects: Project[];
  carousels: Carousel[];
  services: Service[];
  pricing: Pricing;
  contacts: Contacts;
};
