import { z } from "zod";

const nonEmpty = z.string().min(1);

export const priceRowSchema = z.object({
  id: nonEmpty,
  name: nonEmpty,
  price: z.number().nonnegative(),
  currency: nonEmpty,
  unit: nonEmpty,
  order: z.number().int().nonnegative()
});

export const pricingTableSchema = z.object({
  title: nonEmpty,
  mobileTitle: nonEmpty,
  rows: z.array(priceRowSchema)
});

export const projectSchema = z.object({
  id: z.number().int().nonnegative(),
  title: nonEmpty,
  description: nonEmpty,
  smallImage: nonEmpty,
  featuredImages: z.array(nonEmpty).length(2),
  sort: z.number().int().nonnegative()
});

export const carouselImageSchema = z.object({
  src: nonEmpty,
  alt: z.string().optional().default(""),
  order: z.number().int().nonnegative()
});

export const carouselSchema = z.object({
  id: z.number().int().nonnegative(),
  title: nonEmpty,
  images: z.array(carouselImageSchema)
});

export const serviceSchema = z.object({
  id: z.number().int().nonnegative(),
  title: nonEmpty,
  description: nonEmpty,
  image: nonEmpty,
  order: z.number().int().nonnegative()
});

export const contentSchema = z.object({
  site: z.object({
    title: nonEmpty,
    description: nonEmpty,
    keywords: nonEmpty,
    canonical: nonEmpty,
    yandexVerification: z.string().optional().default(""),
    heroTitleLines: z.array(nonEmpty).min(1),
    nav: z.array(z.object({ label: nonEmpty, href: nonEmpty })).optional().default([]),
    sections: z.object({
      projectsTitle: nonEmpty,
      servicesTitle: nonEmpty,
      pricingTitle: nonEmpty,
      contactsTitle: nonEmpty
    }),
    footerText: nonEmpty
  }),
  projects: z.array(projectSchema),
  carousels: z.array(carouselSchema),
  services: z.array(serviceSchema),
  pricing: z.object({
    note: nonEmpty,
    landscape: pricingTableSchema,
    interior: pricingTableSchema
  }),
  contacts: z.object({
    companyName: nonEmpty,
    phone: nonEmpty,
    displayPhone: nonEmpty,
    email: nonEmpty,
    address: nonEmpty,
    mapUrl: nonEmpty,
    telegramUrl: nonEmpty,
    telegramHandle: nonEmpty,
    aboutTitle: nonEmpty,
    aboutText: nonEmpty,
    logoImage: nonEmpty
  })
});

export type Content = z.infer<typeof contentSchema>;
