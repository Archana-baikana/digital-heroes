
const supabase = require('../db/database')

// Get all active charities
const getCharities = async (req, res) => {
  try {
    const {data, error} = await supabase
      .from('charities')
      .select('*')
      .eq('active', true)
      .order('id', {ascending: true})

    if (error) {
      return res.status(500).json({
        message: error.message,
      })
    }

    res.status(200).json({
      charities: data,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    })
  }
}

// Select a charity
const selectCharity = async (req, res) => {
  try {
    const userId = req.user.id
    const {charity_id, percentage} = req.body

    if (!charity_id) {
      return res.status(400).json({
        message: 'Charity is required',
      })
    }

    const contributionPercentage = percentage || 10

    if (contributionPercentage < 10 || contributionPercentage > 100) {
      return res.status(400).json({
        message: 'Charity percentage must be between 10 and 100',
      })
    }

    // Check charity exists
    const {data: charity, error: charityError} = await supabase
      .from('charities')
      .select('*')
      .eq('id', charity_id)
      .eq('active', true)
      .maybeSingle()

    if (charityError) {
      return res.status(500).json({
        message: charityError.message,
      })
    }

    if (!charity) {
      return res.status(404).json({
        message: 'Charity not found',
      })
    }

    // Check whether user already selected a charity
    const {data: existingCharity, error: existingError} = await supabase
      .from('user_charities')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    if (existingError) {
      return res.status(500).json({
        message: existingError.message,
      })
    }

    let data
    let error

    if (existingCharity) {
      const result = await supabase
        .from('user_charities')
        .update({
          charity_id,
          percentage: contributionPercentage,
        })
        .eq('user_id', userId)
        .select()
        .single()

      data = result.data
      error = result.error
    } else {
      const result = await supabase
        .from('user_charities')
        .insert([
          {
            user_id: userId,
            charity_id,
            percentage: contributionPercentage,
          },
        ])
        .select()
        .single()

      data = result.data
      error = result.error
    }

    if (error) {
      return res.status(500).json({
        message: error.message,
      })
    }

    res.status(200).json({
      message: 'Charity selected successfully',
      charity: data,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    })
  }
}

// Get current user's charity
const getMyCharity = async (req, res) => {
  try {
    const userId = req.user.id

    const {data, error} = await supabase
      .from('user_charities')
      .select(`
        id,
        percentage,
        charity_id,
        charities (
          id,
          name,
          description,
          image,
          active
        )
      `)
      .eq('user_id', userId)
      .maybeSingle()

    if (error) {
      return res.status(500).json({
        message: error.message,
      })
    }

    res.status(200).json({
      charity: data,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    })
  }
}

module.exports = {
  getCharities,
  selectCharity,
  getMyCharity,
}