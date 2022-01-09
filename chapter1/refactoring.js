const fs = require("fs");
const invoices = fs.readFileSync("invoices.json", "utf-8");
const plays = fs.readFileSync("plays.json", "utf-8");

function statement(invoice, plays) {
  let result = `청구 내역 (고객명: ${invoice.customer})\n`;

  for (let perf of invoice.performances) {
    result += ` ${playFor(perf).name}: ${usd(amountFor(perf))} (${
      perf.audience
    })석\n`;
  }

  result += `총액 : ${usd(totalAmount())}\n`;
  result += `적립 포인트 : ${totalVolumeCreadits()}점\n`;
  console.log(result);

  function totalAmount() {
    let result = 0;
    for (let perf of invoice.performances) {
      result += amountFor(perf);
    }
    return result;
  }

  function totalVolumeCreadits() {
    let result = 0;
    for (let perf of invoice.performances) {
      result += volumeCreadits(perf);
    }
    return result;
  }

  function usd(aNumber) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(aNumber / 100);
  }

  function volumeCreadits(aPerfomance) {
    let result = 0;
    //포인트 적립
    result += Math.max(aPerfomance.audience - 30, 0);
    //희극 관객 5명마다 추가 포인트를 제공한다.
    if ("comedy" === playFor(aPerfomance).type)
      result += Math.floor(aPerfomance.audience / 5);
    return result;
  }

  function playFor(aPerfomance) {
    return plays[aPerfomance.playID];
  }

  function amountFor(aPerfomance) {
    let result = 0;

    switch (playFor(aPerfomance).type) {
      case "tragedy":
        result = 40000;
        if (aPerfomance.audience > 30) {
          result += 1000 * (aPerfomance.audience - 30);
        }
        break;
      case "comedy":
        result = 30000;
        if (aPerfomance.audience > 20) {
          result += 10000 + 500 * (aPerfomance.audience - 20);
        }
        result += 300 * aPerfomance.audience;
        break;
      default:
        throw new Error(`알 수 없는 장르: ${playFor(aPerfomance).type}`);
    }

    return result;
  }
}

(function main() {
  statement(JSON.parse(invoices)[0], JSON.parse(plays));
})();
