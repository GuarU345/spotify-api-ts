import swaggerAutogen from "swagger-autogen";
import path from "path";

const outputFile = path.join(__dirname, "swagger-output.json");
const routes = ["../src/routes/*.routes.ts"];

const doc = {
  info: {
    title: "API Documentation",
    description: "Documentation for your API",
  },
  host: "localhost:3000",
  schemes: ["http"],
};

swaggerAutogen()(outputFile, routes, doc);
