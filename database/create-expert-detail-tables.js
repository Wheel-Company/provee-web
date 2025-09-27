// Create expert detail tables in Supabase
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

async function createTables() {
  try {
    console.log('Starting table creation...')

    const sqlFile = path.join(__dirname, 'add_expert_detail_tables.sql')
    const sqlContent = fs.readFileSync(sqlFile, 'utf8')

    // Split SQL by semicolons and execute each statement
    const statements = sqlContent.split(';').filter(stmt => stmt.trim())

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim()
      if (!statement) continue

      console.log(`Executing statement ${i + 1}/${statements.length}...`)

      const { data, error } = await supabase.rpc('exec_sql', {
        sql: statement
      })

      if (error) {
        console.error(`Error in statement ${i + 1}:`, error)
        console.log('Statement:', statement)
      } else {
        console.log(`✅ Statement ${i + 1} executed successfully`)
      }
    }

    console.log('✅ All tables created successfully!')

  } catch (error) {
    console.error('Error creating tables:', error)
  }
}

async function insertSampleData() {
  console.log('Inserting sample data...')

  // Get an existing expert ID
  const { data: experts, error: expertError } = await supabase
    .from('experts')
    .select('id, category')
    .limit(1)

  if (expertError || !experts?.length) {
    console.error('No experts found:', expertError)
    return
  }

  const expertId = experts[0].id
  const category = experts[0].category?.[0] || '청소'

  console.log(`Using expert ID: ${expertId}, category: ${category}`)

  // Sample certifications
  const certifications = [
    { expert_id: expertId, name: '전문 자격증 1', issuer: '한국산업인력공단', type: 'professional', verified: true },
    { expert_id: expertId, name: '플랫폼 인증', issuer: 'Provee', type: 'platform', verified: true }
  ]

  const { error: certError } = await supabase
    .from('expert_certifications')
    .insert(certifications)

  if (certError) {
    console.error('Error inserting certifications:', certError)
  } else {
    console.log('✅ Sample certifications inserted')
  }

  // Sample FAQs
  const faqs = [
    { expert_id: expertId, question: '서비스 시간은 어떻게 되나요?', answer: '평일 오전 9시부터 오후 6시까지 가능합니다.', display_order: 1 },
    { expert_id: expertId, question: '추가 비용이 있나요?', answer: '기본 서비스 외 추가 작업이 있을 경우 사전에 안내드립니다.', display_order: 2 }
  ]

  const { error: faqError } = await supabase
    .from('expert_faqs')
    .insert(faqs)

  if (faqError) {
    console.error('Error inserting FAQs:', faqError)
  } else {
    console.log('✅ Sample FAQs inserted')
  }

  // Sample service areas
  const serviceAreas = [
    { expert_id: expertId, area_name: '서울시 강남구', is_primary: true, travel_fee: 0, travel_time_minutes: 0 },
    { expert_id: expertId, area_name: '서울시 서초구', is_primary: false, travel_fee: 5000, travel_time_minutes: 30 }
  ]

  const { error: areaError } = await supabase
    .from('expert_service_areas')
    .insert(serviceAreas)

  if (areaError) {
    console.error('Error inserting service areas:', areaError)
  } else {
    console.log('✅ Sample service areas inserted')
  }

  // Sample work process
  const workProcess = [
    { expert_id: expertId, step_number: 1, title: '상담', description: '고객과 상세 상담을 진행합니다', icon: '💬' },
    { expert_id: expertId, step_number: 2, title: '준비', description: '필요한 도구와 재료를 준비합니다', icon: '🔧' },
    { expert_id: expertId, step_number: 3, title: '작업', description: '전문적인 서비스를 제공합니다', icon: '⚡' },
    { expert_id: expertId, step_number: 4, title: '완료', description: '고객 확인 후 작업을 완료합니다', icon: '✅' }
  ]

  const { error: processError } = await supabase
    .from('expert_work_process')
    .insert(workProcess)

  if (processError) {
    console.error('Error inserting work process:', processError)
  } else {
    console.log('✅ Sample work process inserted')
  }

  // Sample review
  const reviews = [
    { expert_id: expertId, rating: 5, comment: '정말 만족스러운 서비스였습니다!', service_type: category, is_anonymous: false }
  ]

  const { error: reviewError } = await supabase
    .from('reviews')
    .insert(reviews)

  if (reviewError) {
    console.error('Error inserting reviews:', reviewError)
  } else {
    console.log('✅ Sample review inserted')
  }
}

async function main() {
  await createTables()
  await insertSampleData()
  console.log('🎉 Database setup complete!')
}

main().catch(console.error)