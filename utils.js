const random = (callbacks) => {
  const length = callbacks.length;

  return (label) => callbacks[Math.floor(Math.random() * length)](label);
};

const toHightLight = (string) => `\**${string}**`;
const fromScratch = (string) => `\n${string}`;

function getNumberOfDays(start, end) {
  const startDate = new Date(start);
  const endDate = new Date(end);

  const oneDay = 1000 * 60 * 60 * 24;

  const diffInTime = startDate.getTime() - endDate.getTime();
  const diffInDays = Math.round(diffInTime / oneDay);

  return diffInDays;
}

function format(str, ...args) {
  return str.replace(/{(\d+)}/g, function (match, number) {
    return typeof args[number] != "undefined" ? args[number] : match;
  });
}

exports.text = {toHightLight, fromScratch};
exports.generate = {random};
exports.date = {getNumberOfDays};
exports.string = {format};
