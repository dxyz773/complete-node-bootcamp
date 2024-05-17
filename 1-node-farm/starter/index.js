const fs = require("fs");
const http = require("http");
const url = require("url");
const replaceTemplate = require("./modules/replaceTemplate");
//////////////////////////////////////////////////////////////////
// FILES //

// Blocking, synchronous file reading
// const textInput = fs.readFileSync("./txt/input.txt", "utf-8");

// const textOutput = `This is what we know about the avocado: ${textInput}\n Created on ${Date.now()}`;
// // Blocking, synchronous file writing
// fs.writeFileSync("./txt/output.txt", textOutput);

// // Non-blocking, asynchronous file reading
// const asyncTextInput = fs.readFile("./txt/start.txt", "utf-8", (err, data1) =>
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) =>
//     fs.readFile("./txt/append.txt", "utf-8", (err, data3) =>
//       fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", (err) =>
//         console.log("Done!")
//       )
//     )
//   )
// );
// // Non-blocking, asynchronous file writing
// console.log("File created!");

//////////////////////////////////////////////////////////////////
// SERVER //

const productData = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf8"
);

const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

const productDataObj = JSON.parse(productData);

const server = http.createServer((req, res) => {
  // const pathName = req.url;
  const baseURL = `http://${req.headers.host}`;
  const requestURL = new URL(req.url, baseURL);
  const pathname = requestURL.pathname;
  // console.log(pathname);

  // Overview page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });

    const cardsHTML = productDataObj.map((el) => replaceTemplate(tempCard, el));
    // console.log(cardsHTML);

    res.end(tempOverview.replace("{%PRODUCT_CARDS%}", cardsHTML));
  }
  // Product page
  else if (pathname === `/product`) {
    const query = requestURL.searchParams.get("id");
    const product = productDataObj[query];
    if (!product) {
      res.writeHead(404, { "Content-type": "text/html" });
      res.end(
        "<div><h1>Oops! 404. Product not found</h1><a href='/overview'>Back</a></div>"
      );
    } else {
      res.writeHead(200, { "Content-type": "text/html" });
      const productEl = replaceTemplate(tempProduct, product);
      // console.log(productEl);
      res.end(productEl);
    }
  }
  // API
  else if (pathname === "/API") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(productData);
  }
  // Not found
  else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "Hello world!",
    });
    res.end("<h1>Page not found!</h1>");
  }
  // console.log(pathname);
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Server started!");
});
