import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const environment = loadEnv(mode, process.cwd(), "");
  const basePath = environment.VITE_BASE_PATH || "/";

  return {
    base: basePath,
    build: {
      outDir: "dist",
      sourcemap: true
    }
  };
});