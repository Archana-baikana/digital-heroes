const supabase = require('../db/database')

const {
  calculateMatch,
  generateWinningNumbers,
} = require('../utils/drawLogic')


// ===============================
// SIMULATE DRAW
// ===============================

const simulateDraw = async (req, res) => {
  try {
    // 1. Get active subscribers
    const {data: subscriptions, error: subscriptionError} =
      await supabase
        .from('subscriptions')
        .select('user_id')
        .eq('status', 'active')

    if (subscriptionError) {
      return res.status(500).json({
        message: subscriptionError.message,
      })
    }

    if (!subscriptions || subscriptions.length === 0) {
      return res.status(400).json({
        message: 'No active subscribers found',
      })
    }

    const userIds = subscriptions.map(item => item.user_id)

    // 2. Get their latest scores
    const {data: scores, error: scoreError} = await supabase
      .from('scores')
      .select('*')
      .in('user_id', userIds)
      .order('score_date', {ascending: false})

    if (scoreError) {
      return res.status(500).json({
        message: scoreError.message,
      })
    }

    // 3. Generate 5 winning numbers
    const winningNumbers = generateWinningNumbers()

    // 4. Calculate matches
    const results = []

    for (const userId of userIds) {
      const userScores = scores.filter(
        item => item.user_id === userId,
      )

      const matchCount = calculateMatch(
        userScores,
        winningNumbers,
      )

      if (matchCount >= 3) {
        results.push({
          user_id: userId,
          match_count: matchCount,
          match_type: `${matchCount}-match`,
          scores: userScores,
        })
      }
    }

    // 5. Separate winners
    const winners5 = results.filter(
      item => item.match_count === 5,
    )

    const winners4 = results.filter(
      item => item.match_count === 4,
    )

    const winners3 = results.filter(
      item => item.match_count === 3,
    )

    res.status(200).json({
      message: 'Draw simulation completed',
      winning_numbers: winningNumbers,
      total_participants: userIds.length,
      winners: {
        five_match: winners5,
        four_match: winners4,
        three_match: winners3,
      },
    })
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    })
  }
}


// ===============================
// CREATE DRAW
// ===============================

const createDraw = async (req, res) => {
  try {
    const {prize_pool} = req.body

    if (!prize_pool || Number(prize_pool) <= 0) {
      return res.status(400).json({
        message: 'Valid prize pool is required',
      })
    }

    // Get the latest published draw
    const {data: previousDraw, error: previousDrawError} =
      await supabase
        .from('draws')
        .select('rollover_amount')
        .eq('status', 'published')
        .order('id', {ascending: false})
        .limit(1)
        .maybeSingle()

    if (previousDrawError) {
      return res.status(500).json({
        message: previousDrawError.message,
      })
    }

    // Previous unclaimed jackpot
    const previousRollover =
      Number(previousDraw?.rollover_amount || 0)

    // New prize pool includes previous rollover
    const totalPrizePool =
      Number(prize_pool) + previousRollover

    // Create new draw
    const {data, error} = await supabase
      .from('draws')
      .insert([
        {
          draw_date: new Date().toISOString().split('T')[0],
          draw_type: 'monthly',
          status: 'draft',
          prize_pool: totalPrizePool,
          rollover_amount: 0,
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
      message: 'Draw created successfully',
      draw: data,
      previous_rollover: previousRollover,
      total_prize_pool: totalPrizePool,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    })
  }
}


// ===============================
// RUN DRAW
// ===============================

const runDraw = async (req, res) => {
  try {
    const {draw_id} = req.body

    if (!draw_id) {
      return res.status(400).json({
        message: 'Draw ID is required',
      })
    }

    // 1. Get draw
    const {data: draw, error: drawError} = await supabase
      .from('draws')
      .select('*')
      .eq('id', draw_id)
      .single()

    if (drawError || !draw) {
      return res.status(404).json({
        message: 'Draw not found',
      })
    }

    // Prevent running an already published draw
    if (draw.status === 'published') {
      return res.status(400).json({
        message: 'This draw has already been published',
      })
    }

    // 2. Get active subscribers
    const {data: subscriptions, error: subscriptionError} =
      await supabase
        .from('subscriptions')
        .select('user_id')
        .eq('status', 'active')

    if (subscriptionError) {
      return res.status(500).json({
        message: subscriptionError.message,
      })
    }

    const userIds = subscriptions.map(item => item.user_id)

    if (userIds.length === 0) {
      return res.status(400).json({
        message: 'No active subscribers found',
      })
    }

    // 3. Get scores
    const {data: scores, error: scoreError} = await supabase
      .from('scores')
      .select('*')
      .in('user_id', userIds)
      .order('score_date', {ascending: false})

    if (scoreError) {
      return res.status(500).json({
        message: scoreError.message,
      })
    }

    // 4. Generate winning numbers
    const winningNumbers = generateWinningNumbers()

    const winners = []

    // 5. Calculate matches
    for (const userId of userIds) {
      const userScores = scores.filter(
        item => item.user_id === userId,
      )

      const matchCount = calculateMatch(
        userScores,
        winningNumbers,
      )

      if (matchCount >= 3) {
        winners.push({
          user_id: userId,
          match_count: matchCount,
          match_type: `${matchCount}-match`,
        })
      }
    }

    // 6. Separate winners
    const fiveWinners = winners.filter(
      item => item.match_count === 5,
    )

    const fourWinners = winners.filter(
      item => item.match_count === 4,
    )

    const threeWinners = winners.filter(
      item => item.match_count === 3,
    )

    // 7. Calculate prize categories
    const fiveMatchAmount =
      Number(draw.prize_pool) * 0.40

    const fourMatchAmount =
      Number(draw.prize_pool) * 0.35

    const threeMatchAmount =
      Number(draw.prize_pool) * 0.25

    // 8. Calculate rollover
    let rolloverAmount = 0

    if (fiveWinners.length === 0) {
      rolloverAmount = fiveMatchAmount
    }

    // 9. Calculate individual prizes
    const fivePrize =
      fiveWinners.length > 0
        ? fiveMatchAmount / fiveWinners.length
        : 0

    const fourPrize =
      fourWinners.length > 0
        ? fourMatchAmount / fourWinners.length
        : 0

    const threePrize =
      threeWinners.length > 0
        ? threeMatchAmount / threeWinners.length
        : 0

    // 10. Save winners
    const winnerRecords = winners.map(winner => {
      let prizeAmount = 0

      if (winner.match_count === 5) {
        prizeAmount = fivePrize
      } else if (winner.match_count === 4) {
        prizeAmount = fourPrize
      } else if (winner.match_count === 3) {
        prizeAmount = threePrize
      }

      return {
        draw_id: draw.id,
        user_id: winner.user_id,
        match_type: winner.match_type,
        prize_amount: prizeAmount,
        verification_status: 'pending',
        payout_status: 'pending',
      }
    })

    if (winnerRecords.length > 0) {
      const {error: winnerError} = await supabase
        .from('winners')
        .insert(winnerRecords)

      if (winnerError) {
        return res.status(500).json({
          message: winnerError.message,
        })
      }
    }

    // 11. Update draw
    const {data: updatedDraw, error: updateError} =
      await supabase
        .from('draws')
        .update({
          status: 'simulated',
          rollover_amount: rolloverAmount,
        })
        .eq('id', draw.id)
        .select()
        .single()

    if (updateError) {
      return res.status(500).json({
        message: updateError.message,
      })
    }

    // 12. Response
    res.status(200).json({
      message: 'Draw completed successfully',
      draw_id: draw.id,
      winning_numbers: winningNumbers,
      prize_pool: draw.prize_pool,
      rollover_amount: rolloverAmount,
      winners: winnerRecords,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    })
  }
}


// ===============================
// PUBLISH DRAW
// ===============================


const publishDraw = async (req, res) => {
  try {
    const {id} = req.params

    // First check whether the draw exists
    const {data: existingDraw, error: fetchError} = await supabase
      .from('draws')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError) {
      return res.status(404).json({
        message: 'Draw not found',
        error: fetchError.message,
      })
    }

    // Draw must be simulated before publishing
    if (existingDraw.status !== 'simulated') {
      return res.status(400).json({
        message: `Draw cannot be published. Current status: ${existingDraw.status}`,
      })
    }

    // Publish the draw
    const {data, error} = await supabase
      .from('draws')
      .update({
        status: 'published',
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return res.status(500).json({
        message: error.message,
      })
    }

    return res.status(200).json({
      message: 'Draw published successfully',
      draw: data,
    })
  } catch (error) {
    return res.status(500).json({
      message: 'Server error',
      error: error.message,
    })
  }
}

// ===============================
// GET PUBLISHED DRAWS
// ===============================

const getPublishedDraws = async (req, res) => {
  try {
    const {data, error} = await supabase
      .from('draws')
      .select(`
        id,
        draw_date,
        draw_type,
        status,
        prize_pool,
        rollover_amount,
        created_at
      `)
      .eq('status', 'published')
      .order('id', {ascending: false})

    if (error) {
      return res.status(500).json({
        message: error.message,
      })
    }

    return res.status(200).json({
      draws: data || [],
    })
  } catch (error) {
    return res.status(500).json({
      message: 'Server error',
      error: error.message,
    })
  }
}
module.exports = {
  simulateDraw,
  createDraw,
  runDraw,
  publishDraw,
  getPublishedDraws
}