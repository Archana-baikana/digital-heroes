
const calculateMatch = (userScores, winningNumbers) => {
  const scoreValues = userScores.map(item => item.score)

  let matchCount = 0

  winningNumbers.forEach(number => {
    if (scoreValues.includes(number)) {
      matchCount += 1
    }
  })

  return matchCount
}

const generateWinningNumbers = () => {
  const numbers = []

  while (numbers.length < 5) {
    const number = Math.floor(Math.random() * 45) + 1

    if (!numbers.includes(number)) {
      numbers.push(number)
    }
  }

  return numbers
}

module.exports = {
  calculateMatch,
  generateWinningNumbers,
}