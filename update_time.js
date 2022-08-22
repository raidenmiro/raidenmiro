const fs = require("fs");
const path = require("path");
const dayjs = require("dayjs");

const random = (callbacks) => {
  const length = callbacks.length;

  return (label) => callbacks[Math.floor(Math.random() * length)](label);
};

const readmeDateStamp = random([
  (date) => `This text has been updated ${date} 😇`,
  (date) => `The last update was ${date} 😉`,
  (date) => `Has been updated ${date} 😅`,
]);

const toHightLight = (string) => `\**${string}**`;
const fromScratch = (string) => `\n${string}`;

const headingText = `
# Hi all 👋

<a href="https://t.me/yukimirio"><img src="https://img.shields.io/badge/-Telegram-0088cc?style=flat-square&logo=telegram" alt="telegram"/></a>
<a href="https://twitter.com/RKuzhin" target="_blank"><img src="https://img.shields.io/badge/-Twitter-1ca0f1?style=flat-square&labelColor=1ca0f1&logo=twitter&logoColor=white" alt="Twitter"></a>\n`;

const saveLastTime = (readme) => {
  const today = new Date();
  const formattedTodayDate = dayjs(today).format("YYYY-MM-DD HH:mm");

  const phase = toHightLight(readmeDateStamp(formattedTodayDate));
  const readmeText = headingText.concat(fromScratch(phase));

  fs.writeFile(readme, readmeText, (error) => {
    if (error) throw new Error("readme not updated");

    console.info("readme successfully updated");
  });
};

const ENTRY = path.join("README.md");

saveLastTime(ENTRY);
