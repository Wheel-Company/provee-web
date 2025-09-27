// Execute SQL scripts directly with Supabase client
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

async function executeSQL() {
  console.log('🚀 Starting DB table creation...')

  // Try creating tables directly with client
  console.log('1️⃣ Creating expert_certifications table...')
  try {
    // First test if we can query - if not, table doesn't exist
    await supabase.from('expert_certifications').select('count').limit(1)
    console.log('✅ expert_certifications already exists')
  } catch (error) {
    console.log('⚠️ Table does not exist or error:', error.message)
  }

  console.log('2️⃣ Testing real table access...')

  // Test each table
  const tables = [
    'expert_certifications',
    'expert_faqs',
    'expert_portfolio',
    'expert_service_areas',
    'reviews',
    'expert_work_process'
  ]

  for (const tableName of tables) {
    try {
      const { data, error } = await supabase.from(tableName).select('*').limit(1)
      if (error) {
        console.log(`❌ ${tableName}: ${error.message}`)
      } else {
        console.log(`✅ ${tableName}: Accessible (${data?.length || 0} rows)`)
      }
    } catch (err) {
      console.log(`❌ ${tableName}: ${err.message}`)
    }
  }

  console.log('\n3️⃣ Inserting sample data for existing expert...')

  // Get existing expert
  const { data: experts, error: expertError } = await supabase
    .from('experts')
    .select('id, category')
    .limit(1)

  if (expertError || !experts?.length) {
    console.error('❌ No experts found:', expertError)
    return
  }

  const expert = experts[0]
  console.log(`📋 Using expert: ${expert.id} (${expert.category})`)

  // Try inserting data directly using client methods
  console.log('4️⃣ Attempting to insert sample data...')

  // Insert certifications if table exists
  try {
    const { error } = await supabase
      .from('expert_certifications')
      .insert([
        {
          expert_id: expert.id,
          name: 'TESOL 자격증',
          issuer: 'TESOL International',
          type: 'professional',
          verified: true
        },
        {
          expert_id: expert.id,
          name: '신원 인증 완료',
          issuer: 'Provee',
          type: 'platform',
          verified: true
        }
      ])

    if (error) {
      console.log(`❌ Certifications insert failed: ${error.message}`)
    } else {
      console.log('✅ Certifications inserted successfully')
    }
  } catch (err) {
    console.log(`❌ Certifications insert error: ${err.message}`)
  }

  // Insert FAQs
  try {
    const { error } = await supabase
      .from('expert_faqs')
      .insert([
        {
          expert_id: expert.id,
          question: '과외 시간은 어떻게 되나요?',
          answer: '평일 오후 3시~10시, 주말 오전 9시~오후 8시까지 가능합니다.',
          display_order: 1
        },
        {
          expert_id: expert.id,
          question: '과외비는 어떻게 책정되나요?',
          answer: '학년, 과목, 수업 횟수에 따라 달라집니다. 체험 수업 후 상담해드립니다.',
          display_order: 2
        }
      ])

    if (error) {
      console.log(`❌ FAQs insert failed: ${error.message}`)
    } else {
      console.log('✅ FAQs inserted successfully')
    }
  } catch (err) {
    console.log(`❌ FAQs insert error: ${err.message}`)
  }

  // Insert portfolio
  try {
    const { error } = await supabase
      .from('expert_portfolio')
      .insert([
        {
          expert_id: expert.id,
          image_url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800',
          title: '개별 맞춤 수업',
          description: '학생 개별 수준에 맞춘 1:1 맞춤 수업',
          category: 'work',
          display_order: 1
        }
      ])

    if (error) {
      console.log(`❌ Portfolio insert failed: ${error.message}`)
    } else {
      console.log('✅ Portfolio inserted successfully')
    }
  } catch (err) {
    console.log(`❌ Portfolio insert error: ${err.message}`)
  }

  // Insert service areas
  try {
    const { error } = await supabase
      .from('expert_service_areas')
      .insert([
        {
          expert_id: expert.id,
          area_name: '서울시 강남구',
          is_primary: true,
          travel_fee: 0,
          travel_time_minutes: 0
        },
        {
          expert_id: expert.id,
          area_name: '온라인 수업',
          is_primary: false,
          travel_fee: 0,
          travel_time_minutes: 0
        }
      ])

    if (error) {
      console.log(`❌ Service areas insert failed: ${error.message}`)
    } else {
      console.log('✅ Service areas inserted successfully')
    }
  } catch (err) {
    console.log(`❌ Service areas insert error: ${err.message}`)
  }

  // Insert work process
  try {
    const { error } = await supabase
      .from('expert_work_process')
      .insert([
        {
          expert_id: expert.id,
          step_number: 1,
          title: '학습 상담 및 진단',
          description: '학생의 현재 수준과 목표를 파악하여 맞춤형 학습 계획을 수립합니다.',
          icon: '📋'
        },
        {
          expert_id: expert.id,
          step_number: 2,
          title: '체험 수업 진행',
          description: '1회 무료 체험 수업을 통해 학습 방법과 효과를 확인해보실 수 있습니다.',
          icon: '📚'
        }
      ])

    if (error) {
      console.log(`❌ Work process insert failed: ${error.message}`)
    } else {
      console.log('✅ Work process inserted successfully')
    }
  } catch (err) {
    console.log(`❌ Work process insert error: ${err.message}`)
  }

  // Insert reviews
  try {
    const { error } = await supabase
      .from('reviews')
      .insert([
        {
          expert_id: expert.id,
          rating: 5,
          comment: '아이가 수학을 정말 좋아하게 되었어요. 선생님이 너무 잘 가르쳐주세요!',
          service_type: '초등수학 과외',
          is_anonymous: true
        }
      ])

    if (error) {
      console.log(`❌ Reviews insert failed: ${error.message}`)
    } else {
      console.log('✅ Reviews inserted successfully')
    }
  } catch (err) {
    console.log(`❌ Reviews insert error: ${err.message}`)
  }

  console.log('\n🎉 Database setup attempt completed!')
  console.log('📄 If tables don\'t exist, they need to be created through Supabase Dashboard SQL Editor')
  console.log('🔗 Go to: https://app.supabase.com → Your Project → SQL Editor')
  console.log('📝 Run the SQL from: /database/create-tables-manual.sql')
}

executeSQL().catch(console.error)