import next from "eslint-config-next";

// eslint-config-next v16 ships a flat config array bundling core-web-vitals,
// TypeScript rules, and default ignores (.next, out, build, next-env.d.ts).
/** @type {import("eslint").Linter.Config[]} */
const eslintConfig = [...next];

export default eslintConfig;
