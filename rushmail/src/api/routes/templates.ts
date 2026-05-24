import { Hono } from "hono";
import { db } from '../database/index.js';
import * as schema from '../database/schema.js';
import { eq, desc, or } from "drizzle-orm";
import { requireAuth, authMiddleware } from '../middleware/auth.js';
import { randomUUID } from "crypto";

const DEFAULT_TEMPLATES = [
  {
    name: "Job Application - Software Engineer",
    subject: "Software Engineer Application — [Your Name]",
    category: "job",
    body: `<p>Hi [Recruiter Name],</p>
<p>I came across the Software Engineer role at [Company] and I'm genuinely excited about the opportunity.</p>
<p>I'm a [X]-year developer specializing in [skills]. I recently [achievement], which resulted in [impact].</p>
<p>I'd love to learn more about the team and how I can contribute. Here's my <a href="[resume_link]">resume</a> and <a href="[portfolio_link]">portfolio</a>.</p>
<p>Looking forward to hearing from you!</p>
<p>Best,<br>[Your Name]</p>`,
  },
  {
    name: "Freelance Pitch",
    subject: "Freelance [Skill] Services — Quick Question",
    category: "freelance",
    body: `<p>Hi [Name],</p>
<p>I noticed [Company] is working on [project/product]. I'm a freelance [skill] specialist who's helped companies like [example] achieve [result].</p>
<p>I'd love to offer a quick free audit of your [area] — no strings attached. Interested?</p>
<p>Here's my work: <a href="[portfolio_link]">Portfolio</a></p>
<p>Best,<br>[Your Name]</p>`,
  },
  {
    name: "LinkedIn Connection Follow-up",
    subject: "Following up on our LinkedIn connection",
    category: "general",
    body: `<p>Hi [Name],</p>
<p>Thanks for connecting on LinkedIn! I noticed your work at [Company] in [area] — really impressive.</p>
<p>I'm currently exploring opportunities in [field] and would love a quick 15-minute chat if you're open to it.</p>
<p>Happy to share my background: <a href="[resume_link]">Resume</a> | <a href="[linkedin_link]">LinkedIn</a></p>
<p>Thanks for your time!</p>`,
  },
  {
    name: "Internship Request",
    subject: "Internship Inquiry — [University] CS Student",
    category: "job",
    body: `<p>Dear [Recruiter/Hiring Manager],</p>
<p>I'm a [year] Computer Science student at [University] looking for a Summer [year] internship at [Company].</p>
<p>I've built [project] using [tech stack], and I'm passionate about [area the company works in].</p>
<p>Would love to explore if there's a fit. My resume: <a href="[resume_link]">View Resume</a></p>
<p>Best regards,<br>[Your Name]<br>[Phone] | [Email]</p>`,
  },
];

export const templatesRouter = new Hono()
  .use("*", authMiddleware)
  .get("/", requireAuth, async (c) => {
    const user = c.get("user")!;
    const userTemplates = await db
      .select()
      .from(schema.templates)
      .where(eq(schema.templates.userId, user.id))
      .orderBy(desc(schema.templates.createdAt));

    // Prepend default templates
    const defaults = DEFAULT_TEMPLATES.map((t, i) => ({
      id: `default_${i}`,
      userId: "system",
      name: t.name,
      subject: t.subject,
      body: t.body,
      category: t.category,
      usageCount: 0,
      openRate: 0,
      createdAt: new Date(),
    }));

    return c.json({ templates: [...defaults, ...userTemplates] }, 200);
  })
  .post("/", requireAuth, async (c) => {
    const user = c.get("user")!;
    const body = await c.req.json();
    const { name, subject, bodyText, category } = body;

    if (!name || !subject || !bodyText) {
      return c.json({ message: "name, subject, and body are required" }, 400);
    }

    const [template] = await db.insert(schema.templates).values({
      id: randomUUID(),
      userId: user.id,
      name,
      subject,
      body: bodyText,
      category: category || "general",
    }).returning();

    return c.json({ template }, 201);
  })
  .delete("/:id", requireAuth, async (c) => {
    const user = c.get("user")!;
    const { id } = c.req.param();
    await db.delete(schema.templates)
      .where(eq(schema.templates.id, id));
    return c.json({ success: true }, 200);
  });
