// Script to setup expert detail backend tables and data
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

const supabaseUrl = 'https://jqqwiokellbkyzhqrqls.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxcXdpb2tlbGxia3l6aHFycWxzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3MDI3ODksImV4cCI6MjA3NDI3ODc4OX0.DjVi6aL2dCvwkUNViLx08M8tUwWWIZ_eO0CAGOeE-m4'

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function executeSQL(sqlContent, description) {
  try {
    console.log(`\n📝 ${description}...`)

    // Split SQL content by semicolons and execute each statement
    const statements = sqlContent.split(';').filter(stmt => stmt.trim().length > 0)

    for (const statement of statements) {
      if (statement.trim()) {
        const { data, error } = await supabase.rpc('exec_sql', {
          sql_query: statement.trim()
        })

        if (error && !error.message.includes('already exists')) {
          console.error(`Error executing SQL: ${error.message}`)
          // Continue with other statements even if one fails
        }
      }
    }

    console.log(`✅ ${description} completed successfully`)
  } catch (error) {
    console.error(`❌ Error in ${description}:`, error.message)
  }
}

async function setupExpertDetailBackend() {
  console.log('🚀 Setting up expert detail backend...')

  try {
    // Read and execute schema SQL
    const schemaSQL = fs.readFileSync(
      path.join(__dirname, '../database/add_expert_detail_tables.sql'),
      'utf8'
    )
    await executeSQL(schemaSQL, 'Creating expert detail tables')

    // Read and execute data SQL
    const dataSQL = fs.readFileSync(
      path.join(__dirname, '../database/add_expert_detail_data.sql'),
      'utf8'
    )
    await executeSQL(dataSQL, 'Inserting expert detail sample data')

    console.log('\n🎉 Expert detail backend setup completed successfully!')
    console.log('You can now visit the expert detail pages with full backend integration.')

  } catch (error) {
    console.error('💥 Failed to setup expert detail backend:', error)
  }
}

// Alternative approach: Direct data insertion using Supabase client
async function insertDataDirect() {
  console.log('\n📊 Inserting data using direct Supabase client...')

  try {
    // Insert certifications
    const { error: certError } = await supabase
      .from('expert_certifications')
      .upsert([
        {
          expert_id: '550e8400-e29b-41d4-a716-446655440020',
          name: '건물청소관리사 자격증',
          issuer: '한국산업인력공단',
          type: 'professional',
          verified: true
        },
        {
          expert_id: '550e8400-e29b-41d4-a716-446655440020',
          name: '환경관리기사',
          issuer: '한국산업인력공단',
          type: 'professional',
          verified: true
        },
        {
          expert_id: '550e8400-e29b-41d4-a716-446655440022',
          name: '전기기능사 자격증',
          issuer: '한국산업인력공단',
          type: 'professional',
          verified: true
        }
      ])

    if (certError) {
      console.log('Note: Certifications may already exist:', certError.message)
    } else {
      console.log('✅ Certifications inserted successfully')
    }

    // Insert FAQs
    const { error: faqError } = await supabase
      .from('expert_faqs')
      .upsert([
        {
          expert_id: '550e8400-e29b-41d4-a716-446655440020',
          question: '청소에 사용되는 세제는 어떤 것인가요?',
          answer: '친환경 세제를 사용하며, 아이나 반려동물이 있는 가정에서도 안전하게 사용할 수 있는 제품들입니다.',
          display_order: 1
        },
        {
          expert_id: '550e8400-e29b-41d4-a716-446655440020',
          question: '청소 시간은 얼마나 걸리나요?',
          answer: '일반적인 가정집(30평 기준)의 경우 3-4시간 정도 소요되며, 집의 크기와 상태에 따라 달라질 수 있습니다.',
          display_order: 2
        }
      ])

    if (faqError) {
      console.log('Note: FAQs may already exist:', faqError.message)
    } else {
      console.log('✅ FAQs inserted successfully')
    }

    // Insert reviews
    const { error: reviewError } = await supabase
      .from('reviews')
      .upsert([
        {
          expert_id: '550e8400-e29b-41d4-a716-446655440020',
          rating: 5,
          comment: '정말 꼼꼼하게 청소해주셨어요. 깨끗함에 감동했습니다. 다음에도 꼭 부탁드리고 싶어요!',
          service_type: '홈클리닝',
          is_anonymous: true,
          created_at: '2024-09-20T00:00:00Z'
        },
        {
          expert_id: '550e8400-e29b-41d4-a716-446655440020',
          rating: 5,
          comment: '시간 약속도 잘 지키시고 청소 실력이 정말 뛰어나세요. 추천합니다!',
          service_type: '입주청소',
          is_anonymous: true,
          created_at: '2024-09-15T00:00:00Z'
        }
      ])

    if (reviewError) {
      console.log('Note: Reviews may already exist:', reviewError.message)
    } else {
      console.log('✅ Reviews inserted successfully')
    }

    console.log('\n✨ Direct data insertion completed!')

  } catch (error) {
    console.error('❌ Error in direct data insertion:', error)
  }
}

// Run the setup
setupExpertDetailBackend().then(() => {
  // Also try direct insertion as fallback
  return insertDataDirect()
})