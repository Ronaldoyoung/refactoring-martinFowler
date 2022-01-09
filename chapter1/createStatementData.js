module.exports = function createStatementData(invoice, plays) {
  const statementData = {};
  statementData.customer = invoice.customer;
  statementData.performances = invoice.performances.map(enrichPerformance);
  statementData.totalAmount = totalAmount(statementData);
  statementData.totalVolumeCreadits = totalVolumeCreadits(statementData);
  return statementData;

  function enrichPerformance(aPerfomance) {
    const result = Object.assign({}, aPerfomance);
    result.play = playFor(result);
    result.amount = amountFor(result);
    result.volumeCreadits = volumeCreadits(result);
    return result;
  }
  function playFor(aPerfomance) {
    return plays[aPerfomance.playID];
  }
  function amountFor(aPerfomance) {
    let result = 0;
    switch (aPerfomance.play.type) {
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
        throw new Error(`알 수 없는 장르: ${aPerfomance.play.type}`);
    }
    return result;
  }
  function volumeCreadits(aPerfomance) {
    let result = 0;
    //포인트 적립
    result += Math.max(aPerfomance.audience - 30, 0);
    //희극 관객 5명마다 추가 포인트를 제공한다.
    if ("comedy" === aPerfomance.play.type)
      result += Math.floor(aPerfomance.audience / 5);
    return result;
  }
  function totalAmount(data) {
    return data.performances.reduce((total, p) => total + p.amount, 0);
  }
  function totalVolumeCreadits(data) {
    let result = 0;
    for (let perf of data.performances) {
      result += perf.volumeCreadits;
    }
    return result;
  }
};
