const fs = require("fs");
const invoices = fs.readFileSync("invoices.json", "utf-8");
const plays = fs.readFileSync("plays.json", "utf-8");

function statement(invoice, plays) {
  let totalAmount = 0;
  let volumeCreadits = 0;
  let result = `청구 내역 (고객명: ${invoice.customer})\n`;
  const format = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format;

  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    let thisAmount = 0;

    switch (play.type) {
      case "tragedy":
        thisAmount = 40000;
        if (perf.audience > 30) {
          thisAmount += 1000 * (perf.audience - 30);
        }
        break;
      case "comedy":
        thisAmount = 30000;
        if (perf.audience > 20) {
          thisAmount += 10000 + 500 * (perf.audience - 20);
        }
        thisAmount += 300 * perf.audience;
        break;
      default:
        throw new Error(`알 수 없는 장르: ${play.type}`);
    }

    //포인트 적립
    volumeCreadits += Math.max(perf.audience - 30, 0);
    //희극 관객 5명마다 추가 포인트를 제공한다.
    if ("comedy" === play.type) volumeCreadits += Math.floor(perf.audience / 5);

    //청구 내역 출력
    result += `${play.name}: ${format(thisAmount / 10)} (${perf.audience}석)\n`;
    totalAmount += thisAmount;
  }

  result += `총액 : ${format(totalAmount / 100)}\n`;
  result += `적립 포인트 : ${volumeCreadits}점\n`;
  console.log(result);
}

(function main() {
  statement(JSON.parse(invoices)[0], JSON.parse(plays));
})();
