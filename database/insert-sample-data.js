// Insert sample data into existing tables (if they exist)
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables manually
const envPath = path.join(__dirname, '../.env.local')
let supabaseUrl, supabaseKey

try {
  const envContent = fs.readFileSync(envPath, 'utf8')
  const envLines = envContent.split('\n')

  envLines.forEach(line => {
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
      supabaseUrl = line.split('=')[1].replace(/"/g, '').trim()
    }
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) {
      supabaseKey = line.split('=')[1].replace(/"/g, '').trim()
    }
  })
} catch (error) {
  console.error('Error reading .env.local file:', error)
}

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkTables() {
  console.log('Checking existing tables...')

  // Check if any of our target tables exist by trying to query them
  const tablesToCheck = [
    'expert_certifications',
    'expert_faqs',
    'expert_portfolio',
    'expert_service_areas',
    'reviews',
    'expert_work_process'
  ]

  for (const table of tablesToCheck) {
    try {
      const { data, error } = await supabase.from(table).select('*').limit(1)
      if (error) {
        console.log(`❌ Table '${table}' does not exist or is not accessible:`, error.message)
      } else {
        console.log(`✅ Table '${table}' exists and is accessible`)
      }
    } catch (err) {
      console.log(`❌ Error checking table '${table}':`, err.message)
    }
  }
}

async function insertSampleDataDirectly() {
  console.log('Inserting sample data directly into experts table...')

  // Get an existing expert
  const { data: experts, error: expertError } = await supabase
    .from('experts')
    .select('*')
    .limit(1)

  if (expertError || !experts?.length) {
    console.error('No experts found:', expertError)
    return
  }

  const expert = experts[0]
  console.log('Found expert:', expert.id, expert.category)

  // Update expert with additional portfolio data
  const portfolioImages = [
    'https://example.com/portfolio1.jpg',
    'https://example.com/portfolio2.jpg',
    'https://example.com/portfolio3.jpg'
  ]

  const { error: updateError } = await supabase
    .from('experts')
    .update({
      portfolio_images: portfolioImages,
      description: '전문적이고 신뢰할 수 있는 서비스를 제공합니다. 고객 만족을 최우선으로 생각하며, 정확하고 빠른 작업을 보장합니다.',
      experience_years: 5,
      response_time_hours: 2
    })
    .eq('id', expert.id)

  if (updateError) {
    console.error('Error updating expert:', updateError)
  } else {
    console.log('✅ Expert data updated successfully')
  }
}

async function main() {
  await checkTables()
  await insertSampleDataDirectly()
  console.log('🎉 Data setup complete!')
}

main().catch(console.error)