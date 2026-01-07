import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardContent } from '@/components/dashboard/dashboard-content'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  // Get user's household membership
  const { data: member } = await supabase
    .from('household_members')
    .select('*, household:households(*)')
    .eq('user_id', user.id)
    .single()

  // If no household, redirect to setup
  if (!member) {
    redirect('/setup')
  }

  const household = member.household as any

  // Get current month and 6 months ago for trend
  const now = new Date()
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`
  const sixMonthsAgo = new Date(now)
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5)
  const trendStartMonth = `${sixMonthsAgo.getFullYear()}-${String(sixMonthsAgo.getMonth() + 1).padStart(2, '0')}-01`

  // Fetch all dashboard data in parallel
  const [
    { data: members },
    { data: categories },
    { data: accounts },
    { data: transactions },
    { data: allTransactions },
    { data: budgets }
  ] = await Promise.all([
    supabase
      .from('household_members')
      .select('*')
      .eq('household_id', household.id)
      .order('display_name'),
    supabase
      .from('categories')
      .select('*')
      .eq('household_id', household.id)
      .order('type')
      .order('name'),
    supabase
      .from('accounts')
      .select('*')
      .eq('household_id', household.id)
      .order('name'),
    supabase
      .from('transactions')
      .select(`
        *,
        category:categories(*),
        member:household_members(*),
        account:accounts(*)
      `)
      .eq('household_id', household.id)
      .gte('date', currentMonth)
      .order('date', { ascending: false })
      .limit(50),
    // All transactions for last 6 months (for trend chart)
    supabase
      .from('transactions')
      .select(`
        *,
        category:categories(*)
      `)
      .eq('household_id', household.id)
      .gte('date', trendStartMonth)
      .order('date', { ascending: false }),
    supabase
      .from('budgets')
      .select('*, category:categories(*)')
      .eq('household_id', household.id)
      .eq('month', currentMonth)
  ])

  return (
    <DashboardContent
      household={household}
      currentMember={member}
      members={members || []}
      categories={categories || []}
      accounts={accounts || []}
      transactions={transactions || []}
      allTransactions={allTransactions || []}
      budgets={budgets || []}
      currentMonth={currentMonth}
    />
  )
}
