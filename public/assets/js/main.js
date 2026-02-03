import { initRouter } from "./router.js";
import { initParticles } from "./particles.js";

document.addEventListener("DOMContentLoaded", () => {
  initParticles();
  initRouter();
});
