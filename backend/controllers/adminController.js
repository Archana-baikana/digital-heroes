
const supabase = require('../db/database')

// GET ALL USERS
const getUsers = async (req, res) => {
  try {
    const {data, error} = await supabase
      .from('users')
      .select('id, name, email, role, created_at')
      .order('id', {ascending: false})

    if (error) {
      return res.status(500).json({message: error.message})
    }

    res.status(200).json({
      users: data,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    })
  }
}

// GET ALL WINNERS
const getAllWinners = async (req, res) => {
  try {
    const {data, error} = await supabase
      .from('winners')
      .select(`
        id,
        user_id,
        draw_id,
        match_type,
        prize_amount,
        proof_url,
        verification_status,
        payout_status,
        users (
          name,
          email
        ),
        draws (
          draw_date
        )
      `)
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

// APPROVE WINNER
const approveWinner = async (req, res) => {
  try {
    const {id} = req.params

    const {data, error} = await supabase
      .from('winners')
      .update({
        verification_status: 'approved',
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return res.status(500).json({
        message: error.message,
      })
    }

    res.status(200).json({
      message: 'Winner approved successfully',
      winner: data,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    })
  }
}

// REJECT WINNER
const rejectWinner = async (req, res) => {
  try {
    const {id} = req.params

    const {data, error} = await supabase
      .from('winners')
      .update({
        verification_status: 'rejected',
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return res.status(500).json({
        message: error.message,
      })
    }

    res.status(200).json({
      message: 'Winner rejected',
      winner: data,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    })
  }
}

// MARK WINNER AS PAID
const markWinnerPaid = async (req, res) => {
  try {
    const {id} = req.params

    const {data, error} = await supabase
      .from('winners')
      .update({
        payout_status: 'paid',
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return res.status(500).json({
        message: error.message,
      })
    }

    res.status(200).json({
      message: 'Winner marked as paid',
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
  getUsers,
  getAllWinners,
  approveWinner,
  rejectWinner,
  markWinnerPaid,
}