const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Techtube api",
    description: "Description",
  },
  host: "localhost:8080",
  schemes: ["http"],
};

const outputFile = "./swagger.json";
const endpointsFiles = ["./index.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);
