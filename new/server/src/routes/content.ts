import { Router } from "express";
import { contentSchema, projectSchema, serviceSchema, carouselSchema, pricingTableSchema } from "../contentSchema";
import { getContent, saveContent, saveContentSection } from "../contentStore";
import { requireAuth } from "../middleware/auth";
import { requireCsrf } from "../middleware/csrf";

const router = Router();

router.get("/content", async (_req, res) => {
  const content = await getContent();
  res.json(content);
});

router.put("/content", requireAuth, requireCsrf, async (req, res) => {
  const result = contentSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: "Invalid content payload",
      issues: result.error.flatten()
    });
  }

  await saveContent(result.data);
  res.json({ ok: true });
});



router.get("/projects", async (_req, res) => {
  const content = await getContent();
  res.json(content.projects);
});

router.put("/projects", requireAuth, requireCsrf, async (req, res) => {
  const parsed = projectSchema.array().parse(req.body);
  const content = await saveContentSection("projects", parsed);
  res.json(content.projects);
});

router.get("/services", async (_req, res) => {
  const content = await getContent();
  res.json(content.services);
});

router.put("/services", requireAuth, requireCsrf, async (req, res) => {
  const parsed = serviceSchema.array().parse(req.body);
  const content = await saveContentSection("services", parsed);
  res.json(content.services);
});

router.get("/carousels", async (_req, res) => {
  const content = await getContent();
  res.json(content.carousels);
});

router.put("/carousels", requireAuth, requireCsrf, async (req, res) => {
  const parsed = carouselSchema.array().parse(req.body);
  const content = await saveContentSection("carousels", parsed);
  res.json(content.carousels);
});

router.get("/pricing", async (_req, res) => {
  const content = await getContent();
  res.json(content.pricing);
});

router.put("/pricing", requireAuth, requireCsrf, async (req, res) => {
  const payload = req.body || {};
  const parsed = {
    note: String(payload.note || ""),
    landscape: pricingTableSchema.parse(payload.landscape),
    interior: pricingTableSchema.parse(payload.interior)
  };
  const content = await saveContentSection("pricing", parsed);
  res.json(content.pricing);
});

router.get("/contacts", async (_req, res) => {
  const content = await getContent();
  res.json(content.contacts);
});

router.put("/contacts", requireAuth, requireCsrf, async (req, res) => {
  const content = await getContent();
  const updated = { ...content.contacts, ...req.body };
  const parsed = contentSchema.shape.contacts.parse(updated);
  const next = await saveContentSection("contacts", parsed);
  res.json(next.contacts);
});

router.get("/site", async (_req, res) => {
  const content = await getContent();
  res.json(content.site);
});

router.put("/site", requireAuth, requireCsrf, async (req, res) => {
  const content = await getContent();
  const updated = { ...content.site, ...req.body };
  const parsed = contentSchema.shape.site.parse(updated);
  const next = await saveContentSection("site", parsed);
  res.json(next.site);
});

export default router;
