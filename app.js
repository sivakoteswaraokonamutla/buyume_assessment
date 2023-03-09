const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());
let db = null;
const dbpath = path.join(__dirname, "product.db");
const initializedbandserver = async () => {
  try {
    db = await open({ filename: dbpath, driver: sqlite3.Database });
    app.listen(3000, () => {
      console.log("server running at https://localhost:3000");
    });
  } catch (e) {
    console.log(`DB error:${e.message}`);
    process.exit(1);
  }
};
initializedbandserver();
let query = null;

app.post("/update/", async (request, response) => {
  const details = request.body;
  console.log(request.body);
  console.log(details);
  for (let each of details) {
    const { productId, quantity, operation } = each;
    if (operation === "add") {
      query = `insert into todo(product_id,quantity) values(${productId},${quantity});`;
    } else if (operation === "subtract") {
      query = `delete from todo where product_id=${productId};`;
    }
    await db.run(query);
    response.send("updated the table");
  }
});
module.exports = app;
