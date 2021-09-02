'use strict';

const puppeteer = require("puppeteer");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(
    "https://github.com/ethereum/solidity/releases?after=v0.6.11"
  );

  const queue = [];
  const elements = await page.$$(".release-entry");
  for (let elem of elements) {
    try {
      // div:nth-child(0) > ul > li:nth-child(1) > code
      let href;
      const handle = await elem.$$("div > div:nth-child(1) > ul > li");
      const commit = await handle[1].$eval("code", (el) => el.innerText);
      const version = await handle[0].$eval("a > span", (el) => el.innerText);
      // console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
      // console.log(version, commit);

      const divs = await elem.$$(".Box--condensed > div > div");

      for (let div of divs) {
        const text = await div.$eval("a > span", (el) => el.innerText);
        if ("soljson.js" === text.trim()) {
          href = await div.$eval("a", (el) => el.href);
          console.log(href);
        }
      }
      if(href && version && commit){
          queue.push(download(href, `${version}.${commit}.js`))
      }
    } catch (e) {

    }
  }

  await Promise.all(queue);
  browser.close();
})();

async function download(url, name) {
  const filePath = path.join(__dirname, "../files");
  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(filePath);
  }
  const myPath = path.resolve(filePath, name);
  const writer = fs.createWriteStream(myPath);
  const response = await axios.get(url, { responseType: "stream" });
  response.data.pipe(writer);
  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}

