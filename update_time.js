const fs = require("fs");
const path = require("path");
const dayjs = require("dayjs");
const {date, string, text} = require("./utils");
const fetch = require("node-fetch");
require("dotenv").config();

const ENTRY = path.join("README.md");
const DAYS = path.join("./days.txt");

const END_DAY = new Date("11/01/2023");

const whereIamEn = "Day {0} in the Army {1}, remainder {2}";
const whereIamRu = "День {0} в армии {1}, осталось {2}";

const parseDays = () => {
  fs.readFile(DAYS, (error, data) => {
    if (error) {
      console.error(error.stack);
      return;
    }

    const today = new Date();

    let beginner = false;
    let [lastDay] = data.toString().split("\n").at(0).split(",");

    if (lastDay === "") {
      lastDay = 1;
      beginner = true;
    } else {
      lastDay = Number(lastDay);
    }

    writeDay(today, {lastDay, beginner});
    saveToReadme(today, {lastDay, beginner});
    notifyBot(today, {lastDay, beginner});
  });
};

const writeDay = (today, {lastDay, beginner}) => {
  const formattedTodayDate = dayjs(today).format("YYYY-MM-DD");

  const dayAmount = beginner ? lastDay : lastDay + 1;
  const remainder = date.getNumberOfDays(END_DAY, today);
  const template = `${dayAmount}, ${formattedTodayDate}, ${remainder}`;

  fs.writeFile(DAYS, template, (error) => {
    if (error) {
      console.error(error.stack);
      return;
    }
  });
};

const headingText = `
# Hi all 👋
<a href="https://t.me/sumikono"><img src="https://img.shields.io/badge/-Telegram-0088cc?style=flat-square&logo=telegram" alt="telegram"/></a>
<a href="https://twitter.com/RKuzhin" target="_blank"><img src="https://img.shields.io/badge/-Twitter-1ca0f1?style=flat-square&labelColor=1ca0f1&logo=twitter&logoColor=white" alt="Twitter"></a>\n`;

const saveToReadme = (today, {lastDay, beginner}) => {
  const dayAmount = beginner ? lastDay : lastDay + 1;
  const formattedTodayDate = dayjs(today).format("YYYY-MM-DD");
  const remainder = date.getNumberOfDays(END_DAY, today);

  const phase = string.format(
    whereIamEn,
    dayAmount,
    formattedTodayDate,
    remainder
  );
  const readmeText = headingText.concat(text.fromScratch(phase));

  fs.writeFile(ENTRY, readmeText, (error) => {
    if (error) throw error;

    console.log("Success readme updated");
  });
};

const webhookUrl = `${process.env.BOT_URL}/api/webhook?secret_hash=${process.env.SECRET_HASH}&`;

const notifyBot = async (today, {lastDay, beginner}) => {
  const dayAmount = beginner ? lastDay : lastDay + 1;
  const formattedTodayDate = dayjs(today).format("YYYY-MM-DD");
  const remainder = date.getNumberOfDays(END_DAY, today);

  const phase = string.format(
    whereIamRu,
    dayAmount,
    formattedTodayDate,
    remainder
  );

  try {
    const query = new URLSearchParams();
    query.set("phase", phase);

    await fetch(new URL(webhookUrl.concat(query.toString())));
  } catch (error) {
    console.error(error);
  }
};

parseDays();
