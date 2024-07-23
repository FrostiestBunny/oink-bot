const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const chooseWithProbabilities = (array, intervals) => {
  const r = getRandomInt(1, 100);

  for (let i = 0; i < array.length; i++) {
    if (r >= intervals[i][0] && r <= intervals[i][1]) {
      return array[i];
    }
  }
};

module.exports = { chooseWithProbabilities };

// let test = ['gomenasorry', 'gomenyasorry', 'sowwy'];

// const results = [];

// for (let i = 0; i < 1000; i++) {
//   const result = choose(test, [
//     [1, 80],
//     [81, 90],
//     [91, 100],
//   ]);
//   results.push(result);
// }

// const occurrences = results.reduce((acc, curr) => {
//   return acc[curr] ? ++acc[curr] : (acc[curr] = 1), acc;
// }, {});
// console.log(occurrences);
