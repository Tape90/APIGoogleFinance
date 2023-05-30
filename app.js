require("dotenv").config();
const express = require("express");
const app = express();
const axios = require("axios");
const cheerio = require("cheerio");

const Port = process.env.PORT || 3000;

let indizes = [];

const setIndexName = (num, indexName) => {
  const index = {
    name: "",
    score: 0,
    gainToday: 0,
    gainTodayPercentage: 0,
  };
  index["name"] = indexName;
  indizes.push(index);
};

const score = (num, score) => {
    let actualIndex = indizes[num];
    actualIndex.score = score;
};

const gainToday = (num, gainToday) => {
    let actualIndex = indizes[num];
    actualIndex.gainToday = gainToday;
};

const gainTodayPercentage = (num, gainTodayPercentage) => {
    let actualIndex = indizes[num];
    if (indizes[num].gainToday <= 0){
        gainTodayPercentage = "-" + gainTodayPercentage;
    };
    actualIndex.gainTodayPercentage = gainTodayPercentage;
};

function parseHTML(parser, classString, callback) {
    parser(classString).each((num, element) => {
      const storageVal = parser(element).text();
      callback(num, storageVal);
    });
  };

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.get("/america", async (req, res) => {
    indizes = [];
  const response = await axios.get(
    "https://www.google.com/finance/markets/indexes/americas"
  );
  const htmlCode = response.data;
  const $ = cheerio.load(htmlCode);
  parseHTML($, ".sbnBtf .ZvmM7", setIndexName);
  parseHTML($, ".sbnBtf .YMlKec", score);
  parseHTML($, ".sbnBtf .BAftM", gainToday);
  parseHTML($, ".sbnBtf .JwB6zf", gainTodayPercentage);
  res.json(indizes);
});

app.get("/asia", async (req, res) => {
    indizes = [];
    const response = await axios.get(
        "https://www.google.com/finance/markets/indexes/asia-pacific"
    );
    const htmlCode = response.data;
    const $ = cheerio.load(htmlCode);
    parseHTML($, ".sbnBtf .ZvmM7", setIndexName);
    parseHTML($, ".sbnBtf .YMlKec", score);
    parseHTML($, ".sbnBtf .BAftM", gainToday);
    parseHTML($, ".sbnBtf .JwB6zf", gainTodayPercentage);
    res.json(indizes);
});

app.get("/europeandother", async (req, res) => {
    indizes = [];
    const response = await axios.get(
        "https://www.google.com/finance/markets/indexes/europe-middle-east-africa"
    );
    const htmlCode = response.data;
    const $ = cheerio.load(htmlCode);
    parseHTML($, ".sbnBtf .ZvmM7", setIndexName);
    parseHTML($, ".sbnBtf .YMlKec", score);
    parseHTML($, ".sbnBtf .BAftM", gainToday);
    parseHTML($, ".sbnBtf .JwB6zf", gainTodayPercentage);
    res.json(indizes);
});

app.listen(Port, () => {
  console.info(`Running on Port ${Port}`);
});
