
const supabase = require('../db/database')

const addScore = async (req, res) => {
  try {
    const userId = req.user.id
    const {score, score_date} = req.body

    if (score === undefined || !score_date) {
      return res.status(400).json({
        message: 'Score and score date are required',
      })
    }

    const numericScore = Number(score)

    if (numericScore < 1 || numericScore > 45) {
      return res.status(400).json({
        message: 'Score must be between 1 and 45',
      })
    }

    // Check whether score already exists for this date
    const {data: existingScore, error: existingError} = await supabase
      .from('scores')
      .select('*')
      .eq('user_id', userId)
      .eq('score_date', score_date)
      .maybeSingle()

    if (existingError) {
      return res.status(500).json({
        message: existingError.message,
      })
    }

    // If same date exists, update it
    if (existingScore) {
      const {data, error} = await supabase
        .from('scores')
        .update({
          score: numericScore,
        })
        .eq('id', existingScore.id)
        .select()
        .single()

      if (error) {
        return res.status(500).json({
          message: error.message,
        })
      }

      return res.status(200).json({
        message: 'Score updated successfully',
        score: data,
      })
    }

    // Get current scores
    const {data: existingScores, error: fetchError} = await supabase
      .from('scores')
      .select('*')
      .eq('user_id', userId)
      .order('score_date', {ascending: false})

    if (fetchError) {
      return res.status(500).json({
        message: fetchError.message,
      })
    }

    // Keep only latest 5 scores
    if (existingScores.length >= 5) {
      const oldestScore = existingScores[existingScores.length - 1]

      const {error: deleteError} = await supabase
        .from('scores')
        .delete()
        .eq('id', oldestScore.id)

      if (deleteError) {
        return res.status(500).json({
          message: deleteError.message,
        })
      }
    }

    // Add new score
    const {data, error} = await supabase
      .from('scores')
      .insert([
        {
          user_id: userId,
          score: numericScore,
          score_date,
        },
      ])
      .select()
      .single()

    if (error) {
      return res.status(500).json({
        message: error.message,
      })
    }

    res.status(201).json({
      message: 'Score added successfully',
      score: data,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    })
  }
}

const getMyScores = async (req, res) => {
  try {
    const userId = req.user.id

    const {data, error} = await supabase
      .from('scores')
      .select('*')
      .eq('user_id', userId)
      .order('score_date', {ascending: false})

    if (error) {
      return res.status(500).json({
        message: error.message,
      })
    }

    res.status(200).json({
      scores: data,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    })
  }
}

const deleteScore = async (req, res) => {
  try {
    const userId = req.user.id
    const {id} = req.params

    const {error} = await supabase
      .from('scores')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) {
      return res.status(500).json({
        message: error.message,
      })
    }

    res.status(200).json({
      message: 'Score deleted successfully',
    })
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    })
  }
}

module.exports = {
  addScore,
  getMyScores,
  deleteScore,
}