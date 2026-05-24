const fs = require('fs');

function replaceFile(path, replacements) {
  let content = fs.readFileSync(path, 'utf8');
  for (const [search, replace] of replacements) {
    if (search instanceof RegExp) {
      content = content.replace(search, replace);
    } else {
      content = content.split(search).join(replace);
    }
  }
  fs.writeFileSync(path, content);
  console.log(`Updated ${path}`);
}

replaceFile('src/api/index.ts', [
  [/import \{ authMiddleware \} from "\.\/middleware\/auth\.js";\n/, '']
]);

replaceFile('src/api/routes/analytics.ts', [
  ['import { eq, desc, and, gte, count, sql } from "drizzle-orm";', 'import { eq, desc, and } from "drizzle-orm";'],
  ['import { eq, desc, and, gte, count, sql }', 'import { eq, desc, and }']
]);

replaceFile('src/api/routes/emails.ts', [
  ['function injectTrackedLinks(\n  html: string,\n  emailId: string,\n  userId: string,\n', 'function injectTrackedLinks(\n  html: string,\n  _emailId: string,\n  _userId: string,\n'],
  ['function injectTrackedLinks(html: string, emailId: string, userId: string, baseUrl: string)', 'function injectTrackedLinks(html: string, _emailId: string, _userId: string, baseUrl: string)']
]);

replaceFile('src/api/routes/notifications.ts', [
  [/import \{ randomUUID \} from "crypto";\n/, '']
]);

replaceFile('src/api/routes/resumes.ts', [
  ['const user = c.get("user")!;\n    const { id } = c.req.param();', 'const { id } = c.req.param();']
]);

replaceFile('src/api/routes/templates.ts', [
  ['import { eq, desc, and, or } from "drizzle-orm";', 'import { eq, desc, and } from "drizzle-orm";'],
  ['const user = c.get("user")!;\n    const { id } = c.req.param();', 'const { id } = c.req.param();']
]);

replaceFile('src/api/routes/tracking.ts', [
  ['import { eq, and } from "drizzle-orm";', 'import { eq } from "drizzle-orm";']
]);

replaceFile('src/web/pages/dashboard.tsx', [
  ['Menu, X, Bell, TrendingUp, Activity, Users, ArrowUpRight, ArrowDownRight', 'Menu, X, Bell, Activity, Users, ArrowUpRight, ArrowDownRight']
]);

replaceFile('src/web/pages/landing.tsx', [
  ['import { useState, useEffect, useRef } from "react";', 'import { useState, useEffect } from "react";'],
  ['import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";', 'import { motion, AnimatePresence } from "framer-motion";'],
  ['Activity, Users, ChevronRight', 'Activity, Users'],
  ['{features.map((f, i) => (', '{features.map((f) => (']
]);
