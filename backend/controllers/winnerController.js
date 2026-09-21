
const supabase = require('../db/database')

const getMyWinners = async (req, res) => {
  try {
    const userId = req.user.id

    const {data, error} = await supabase
      .from('winners')
      .select(`
        id,
        draw_id,
        match_type,
        prize_amount,
        proof_url,
        verification_status,
        payout_status,
        draws (
          draw_date,
          status
        )
      `)
      .eq('user_id', userId)
      .order('id', {ascending: false})

    if (error) {
      return res.status(500).json({
        message: error.message,
      })
    }

    res.status(200).json({
      winners: data,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    })
  }
}

const submitProof = async (req, res) => {
  try {
    const userId = req.user.id
    const {id} = req.params
    const {proof_url} = req.body

    if (!proof_url) {
      return res.status(400).json({
        message: 'Proof URL is required',
      })
    }

    const {data, error} = await supabase
      .from('winners')
      .update({
        proof_url,
        verification_status: 'pending',
      })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      return res.status(500).json({
        message: error.message,
      })
    }

    res.status(200).json({
      message: 'Proof submitted successfully',
      winner: data,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    })
  }
}

module.exports = {
  getMyWinners,
  submitProof,
}