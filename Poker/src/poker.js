/*
  Greetings, algorithmics!

  Your task for today is to classify poker hands!  You have two functions to complete:

    - labelHand, which gives the name of a single hand.
    - findWinner, which determines which of several hands is best.

  Hands are 14-character strings that look like "8H TC KS 2C AD", where
    - there are exactly five cards
    - each card is separated by a space
    - each card is represented by a value followed by a suit
    - ace is "A" (remember, aces can be either low or high!)
    - king is "K"
    - queen is "Q"
    - jack is "J"
    - ten is "T"
    - all other cards are represented by their number.
    - the four suits are represented by "H", "C", "S", and "D"

  Hands will be legal, with no duplicate cards.

  Remember, the order of hands, from highest to lowest is
    - Royal flush:      like a straight flush from Ten to Ace(no pair)
    - Straight flush:   5 cards in a row of the same suit(no pair)
    - Four of a kind:   4 cards of the same value(has pair)
    - Full house:       3 cards of the same value and one pair.(has pair)
    - Flush:            5 cards of the same suit(no pair)
    - Straight:         5 cards in a row(no pair)
    - Three of a kind:  3 cards of the same value(has pair)
    - Two pair:         you got this one.(has pair)
    - Pair:             this one too.(has pair)
    - High card:        basically, no hand.(no pair)

  There are no helper functions provided this time.
  You're on your own, but feel free to write whatever helpers you need!
*/


var Evaluation = function(dataSet) {
  this.dataSet = dataSet;
  this.evaluate();
};
// @counts: repeated times of number of suit
// @maxCount: the most repeated times; for three A, max count = 3;
//and maxCountNum is 'A'
_.extend(Evaluation.prototype, {
  maxCount: 0,
  maxCountNum: 0,
  evaluate: function() {
    this.counts = {};
    //note: in inheritance pattern, the prototype is sharing the same counts object? why?
    _.each(this.dataSet, function(dataPoint) {
      this.counts[dataPoint] = this.counts[dataPoint] ? this.counts[dataPoint] + 1 : 1;
      if (this.counts[dataPoint] > this.maxCount) {
        this.maxCount = this.counts[dataPoint];
        this.maxCountNum = dataPoint;
      }
    }, this);
  }
});

var NumEvaluation = function(dataSet) {
  Evaluation.call(this, dataSet);
};
NumEvaluation.prototype = Object.create(Evaluation.prototype);
NumEvaluation.prototype.constructor = NumEvaluation;
_.extend(NumEvaluation.prototype, {
  aboveTen: {
    'T': 10,
    'J': 11,
    'Q': 12,
    'K': 13,
  },
  aboveTenReverse: {
    '10': 'T',
    '11': 'J',
    '12': 'Q',
    '13': 'K',
    '14': 'A'
  },
  isRoyalStraight: false,
  isStraight: false,
  getNonPairResults: function() {
    var aboveTen = _.clone(this.aboveTen);
    aboveTen.A = _.contains(this.dataSet, '2') ? 1 : 14;
    var sorted = _(this.dataSet).sortBy(function(num){
      if (aboveTen[num]) return aboveTen[num];
      return +num;
    });
    // an array of numbers
    var convertedSorted = _.map(sorted, function(num) {
      if (aboveTen[num]) return aboveTen[num];
      return +num;
    });

    var max = convertedSorted[4];
    this.isStraight = max - convertedSorted[0] === 4;
    this.highCard = max >= 10 ?
      this.aboveTenReverse[max] : max + '';
    if (this.isStraight) {
      if (max === 14) this.isRoyalStraight = true;
      if (max === 4) this.highCard = '4';
    }
  },

  showTwoPairs: function() {
    var msg = ['Two pair of'], counts = _.clone(this.counts);
    _.each(this.dataSet, function(number, i) {
      if (counts[number] === 2) {
        msg.push(number);
        delete counts[number];
      }
    });
    return msg[0] + ' ' + msg[1] + ' and ' + msg[2];
  },
  getPairResults: function() {
    var len = Object.keys(this.counts).length;
    // 1,1,1,1,1;2,1,1,1;2,2,1;3,1,1;3,2;4,1;
    switch (this.maxCount) {
      case 1:
        this.getNonPairResults();
        return false;
      case 2:
        if (len === 4) return 'Pair of ' + this.maxCountNum;
        if (len === 3) {
          return this.showTwoPairs();
        }
      case 3:
        if (len === 2) return 'Full house of ' + this.maxCountNum;
        if (len === 3) return 'Three of kind of ' + this.maxCountNum
      case 4:
        return 'Four of a kind of ' + this.maxCountNum;
    }
  }
});


var SuiteEvaluation = function(dataSet) {
  Evaluation.call(this, dataSet);
};
SuiteEvaluation.prototype = Object.create(Evaluation.prototype);
SuiteEvaluation.prototype.constructor = SuiteEvaluation;
SuiteEvaluation.prototype.isFlush = function() {
  return this.maxCount === 5;
};
// SuiteEvaluation.prototype.getPairResults = function() {

// };

var poker = {
  // Returns the name of the input hand.
  // See the specs for the required formats.
  labelHand: function(hand) {
    var cards = hand.toUpperCase().split(' '),
        numbers = _.map(cards, function(card) { return card.slice(0, 1); }),
        suits = _.map(cards, function(card) { return card.slice(1, 2); }),
        numEvaluation = new NumEvaluation(numbers),
        isPair = numEvaluation.getPairResults();
    if (isPair) return isPair;
    numEvaluation.getNonPairResults();
    var highCard = numEvaluation.highCard,
        suiteEvaluation = new SuiteEvaluation(suits);
    if(suiteEvaluation.isFlush()) {
      if (numEvaluation.isStraight) {
        return numEvaluation.isRoyalStraight ? 'Royal flush' :
          'Straight flush up to ' + highCard;
      } else {
        return 'Flush with high card ' + highCard;
      }
    } else {
      if (numEvaluation.isStraight) {
        return 'Straight up to ' + highCard;
      } else {
        return highCard + ' High';
      }
    }
  },

  // Takes an array of hands and returns the index of the winning hand.
  // If two or more hands tie for the win, instead return an array of the winning hands.
  findWinner: function(hands) {

  }
};