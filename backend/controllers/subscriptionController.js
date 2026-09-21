
const supabase = require('../db/database')

const createSubscription = async (req, res) => {
  try {
    const userId = req.user.id
    const {plan} = req.body

    if (!plan) {
      return res.status(400).json({
        message: 'Subscription plan is required',
      })
    }

    if (plan !== 'monthly' && plan !== 'yearly') {
      return res.status(400).json({
        message: 'Invalid subscription plan',
      })
    }

    const amount = plan === 'monthly' ? 499 : 4999

    const startDate = new Date()

    const renewalDate = new Date()

    if (plan === 'monthly') {
      renewalDate.setMonth(renewalDate.getMonth() + 1)
    } else {
      renewalDate.setFullYear(renewalDate.getFullYear() + 1)
    }

    const {data, error} = await supabase
      .from('subscriptions')
      .insert([
        {
          user_id: userId,
          plan,
          amount,
          status: 'active',
          start_date: startDate.toISOString().split('T')[0],
          renewal_date: renewalDate.toISOString().split('T')[0],
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
      message: 'Subscription created successfully',
      subscription: data,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    })
  }
}

const getMySubscription = async (req, res) => {
  try {
    const userId = req.user.id

    const {data, error} = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('id', {ascending: false})
      .limit(1)
      .maybeSingle()

    if (error) {
      return res.status(500).json({
        message: error.message,
      })
    }

    res.status(200).json({
      subscription: data,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    })
  }
}

module.exports = {
  createSubscription,
  getMySubscription,
}