const fs = require("fs");
const invoices = fs.readFileSync("invoices.json", "utf-8");
const plays = fs.readFileSync("plays.json", "utf-8");
const createStatementData = require("./createStatementData");

function statement(invoice, plays) {
  return rederPlainText(createStatementData(invoice, plays));
}

function rederPlainText(data) {
  let result = `청구 내역 (고객명: ${data.customer})\n`;
  for (let perf of data.performances) {
    result += ` ${perf.play.name}: ${usd(perf.amount)} (${perf.audience})석\n`;
  }
  result += `총액 : ${usd(data.totalAmount)}\n`;
  result += `적립 포인트 : ${data.totalVolumeCreadits}점\n`;
  return result;

  function usd(aNumber) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(aNumber / 100);
  }
}

(function main() {
  console.log(statement(JSON.parse(invoices)[0], JSON.parse(plays)));
})();
