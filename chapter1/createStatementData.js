class PerformanceCalculator {
  constructor(performances, play) {
    this.performances = performances;
    this.play = play;
  }

  get amount() {
    let result = 0;
    switch (this.play.type) {
      case "tragedy":
        result = 40000;
        if (this.performances.audience > 30) {
          result += 1000 * (this.performances.audience - 30);
        }
        break;
      case "comedy":
        result = 30000;
        if (this.performances.audience > 20) {
          result += 10000 + 500 * (this.performances.audience - 20);
        }
        result += 300 * this.performances.audience;
        break;
      default:
        throw new Error(`알 수 없는 장르: ${this.play.type}`);
    }
    return result;
  }

  get volumeCreadits() {
    let result = 0;
    //포인트 적립
    result += Math.max(this.performances.audience - 30, 0);
    //희극 관객 5명마다 추가 포인트를 제공한다.
    if ("comedy" === this.play.type)
      result += Math.floor(this.performances.audience / 5);
    return result;
  }
}

function createPerformanceCalculator(aPerfomance, aPlay) {
  return new PerformanceCalculator(aPerfomance, aPlay);
}

module.exports = function createStatementData(invoice, plays) {
  const statementData = {};
  statementData.customer = invoice.customer;
  statementData.performances = invoice.performances.map(enrichPerformance);
  statementData.totalAmount = totalAmount(statementData);
  statementData.totalVolumeCreadits = totalVolumeCreadits(statementData);
  return statementData;

  function enrichPerformance(aPerfomance) {
    const calculator = createPerformanceCalculator(
      aPerfomance,
      playFor(aPerfomance)
    );
    const result = Object.assign({}, aPerfomance);
    result.play = calculator.play;
    result.amount = calculator.amount;
    result.volumeCreadits = calculator.volumeCreadits;
    return result;
  }
  function playFor(aPerfomance) {
    return plays[aPerfomance.playID];
  }
  function amountFor(aPerfomance) {
    return new PerformanceCalculator(aPerfomance, playFor[aPerfomance]).amount;
  }
  function volumeCreadits(aPerfomance) {}
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
