#!/usr/bin/env tsx

/**
 * Database Seeding Script for The Ecosystem × SAM AI
 * 
 * This script populates the database with:
 * - Sample users and profiles
 * - Example signals and embeddings
 * - Test matches and interactions
 * - Sample events and feedback
 */

import 'dotenv/config'
import { createServiceClient } from '../lib/supabase'
import { generateUserEmbeddings } from '../lib/embeddings'
import { faker } from '@faker-js/faker'

interface SeedUser {
  id: string
  email: string
  display_name: string
  avatar_url?: string
  bio?: string
  strengths_text: string
  needs_text: string
  goals_text: string
  shared_values: string[]
  onboarding_status: 'completed'
}

interface SeedEvent {
  id: string
  title: string
  description: string
  event_date: string
  location: string
  event_type: string
  max_attendees: number
  created_by: string
}

const supabase = createServiceClient()

// Sample user profiles with realistic data
const sampleUsers: SeedUser[] = [
  {
    id: faker.string.uuid(),
    email: 'alice.johnson@example.com',
    display_name: 'Alice Johnson',
    avatar_url: 'https://randomuser.me/api/portraits/women/1.jpg',
    bio: 'AI researcher passionate about ethical AI and open-source contributions. Building the future of responsible technology.',
    strengths_text: 'Machine learning, Python, research methodology, technical writing, open-source development, AI ethics',
    needs_text: 'Collaboration on AI ethics projects, mentorship in scaling research, connections with industry leaders',
    goals_text: 'Launch open-source AI ethics framework, publish research papers, build community around responsible AI',
    shared_values: ['open-source', 'ethical-technology', 'collaboration', 'innovation'],
    onboarding_status: 'completed'
  },
  {
    id: faker.string.uuid(),
    email: 'bob.williams@example.com',
    display_name: 'Bob Williams',
    avatar_url: 'https://randomuser.me/api/portraits/men/2.jpg',
    bio: 'Experienced software engineer seeking mentorship in scaling distributed systems. Love clean code and team leadership.',
    strengths_text: 'System design, Go, distributed systems, team leadership, code review, performance optimization',
    needs_text: 'Mentorship in scaling systems, guidance on technical leadership, connections with senior engineers',
    goals_text: 'Become staff engineer, build scalable architecture, mentor junior developers, contribute to open source',
    shared_values: ['technical-excellence', 'mentorship', 'clean-code', 'teamwork'],
    onboarding_status: 'completed'
  },
  {
    id: faker.string.uuid(),
    email: 'charlie.brown@example.com',
    display_name: 'Charlie Brown',
    avatar_url: 'https://randomuser.me/api/portraits/men/3.jpg',
    bio: 'Startup founder exploring new markets for sustainable tech solutions. Focused on climate tech and social impact.',
    strengths_text: 'Business development, market research, product strategy, fundraising, team building, sustainability',
    needs_text: 'Technical co-founder, market validation partners, investor connections, sustainability expertise',
    goals_text: 'Launch sustainable tech startup, raise Series A, build impactful product, create positive environmental change',
    shared_values: ['sustainability', 'social-impact', 'innovation', 'entrepreneurship'],
    onboarding_status: 'completed'
  },
  {
    id: faker.string.uuid(),
    email: 'diana.prince@example.com',
    display_name: 'Diana Prince',
    avatar_url: 'https://randomuser.me/api/portraits/women/4.jpg',
    bio: 'Product manager with deep expertise in user research and design systems. Passionate about creating inclusive products.',
    strengths_text: 'Product strategy, user research, design systems, data analysis, stakeholder management, UX design',
    needs_text: 'Technical implementation partners, design system contributors, user research collaborators, product mentors',
    goals_text: 'Build world-class design system, launch inclusive product, mentor product managers, advance UX research',
    shared_values: ['inclusive-design', 'user-centered', 'collaboration', 'excellence'],
    onboarding_status: 'completed'
  },
  {
    id: faker.string.uuid(),
    email: 'eve.adams@example.com',
    display_name: 'Eve Adams',
    avatar_url: 'https://randomuser.me/api/portraits/women/5.jpg',
    bio: 'Data scientist specializing in healthcare analytics. Using ML to improve patient outcomes and healthcare accessibility.',
    strengths_text: 'Machine learning, healthcare analytics, Python, statistical modeling, data visualization, research',
    needs_text: 'Healthcare domain experts, ML engineers, research collaborators, healthcare industry connections',
    goals_text: 'Improve healthcare outcomes through ML, publish research, build healthcare analytics platform, mentor students',
    shared_values: ['healthcare', 'research', 'social-impact', 'data-driven'],
    onboarding_status: 'completed'
  },
  {
    id: faker.string.uuid(),
    email: 'frank.miller@example.com',
    display_name: 'Frank Miller',
    avatar_url: 'https://randomuser.me/api/portraits/men/6.jpg',
    bio: 'DevOps engineer and infrastructure specialist. Building scalable, secure, and reliable systems for growing companies.',
    strengths_text: 'AWS, Kubernetes, Terraform, CI/CD, monitoring, security, infrastructure automation, team scaling',
    needs_text: 'Security expertise, cloud architecture guidance, automation tools, infrastructure mentorship',
    goals_text: 'Build world-class infrastructure, improve system reliability, mentor DevOps engineers, contribute to open source',
    shared_values: ['reliability', 'automation', 'security', 'scalability'],
    onboarding_status: 'completed'
  }
]

// Sample events
const sampleEvents: SeedEvent[] = [
  {
    id: faker.string.uuid(),
    title: 'AI Ethics Workshop',
    description: 'Join us for a deep dive into ethical AI development. We\'ll cover bias detection, fairness metrics, and responsible AI practices.',
    event_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
    location: 'San Francisco, CA',
    event_type: 'workshop',
    max_attendees: 50,
    created_by: sampleUsers[0].id // Alice Johnson
  },
  {
    id: faker.string.uuid(),
    title: 'Startup Pitch Night',
    description: 'Present your startup ideas to a panel of investors and industry experts. Great networking opportunity for entrepreneurs.',
    event_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks from now
    location: 'New York, NY',
    event_type: 'networking',
    max_attendees: 100,
    created_by: sampleUsers[2].id // Charlie Brown
  },
  {
    id: faker.string.uuid(),
    title: 'Healthcare Data Science Meetup',
    description: 'Monthly meetup for healthcare data scientists. This month: "Predictive Analytics for Patient Outcomes".',
    event_date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(), // 3 weeks from now
    location: 'Boston, MA',
    event_type: 'meetup',
    max_attendees: 75,
    created_by: sampleUsers[4].id // Eve Adams
  }
]

async function seedDatabase() {
  console.log('🌱 Starting database seeding...')

  try {
    // 1. Create users in Supabase Auth
    console.log('📧 Creating users in Supabase Auth...')
    for (const user of sampleUsers) {
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: 'password123', // Default password for demo
        email_confirm: true,
        user_metadata: {
          display_name: user.display_name
        }
      })

      if (authError) {
        console.error(`❌ Failed to create auth user ${user.email}:`, authError.message)
        continue
      }

      // Update the user ID to match the auth user ID
      user.id = authData.user.id
      console.log(`✅ Created auth user: ${user.email}`)
    }

    // 2. Create profiles
    console.log('👤 Creating user profiles...')
    const { error: profilesError } = await supabase
      .from('profiles')
      .insert(sampleUsers.map(user => ({
        user_id: user.id,
        display_name: user.display_name,
        avatar_url: user.avatar_url,
        bio: user.bio,
        strengths_text: user.strengths_text,
        needs_text: user.needs_text,
        goals_text: user.goals_text,
        shared_values: user.shared_values,
        onboarding_status: user.onboarding_status
      })))

    if (profilesError) {
      throw new Error(`Failed to create profiles: ${profilesError.message}`)
    }

    console.log(`✅ Created ${sampleUsers.length} user profiles`)

    // 3. Generate embeddings for all users
    console.log('🧠 Generating embeddings for users...')
    for (const user of sampleUsers) {
      try {
        await generateUserEmbeddings(user.id, {
          user_id: user.id,
          strengths_text: user.strengths_text,
          needs_text: user.needs_text,
          goals_text: user.goals_text,
          shared_values: user.shared_values
        })
        console.log(`✅ Generated embeddings for ${user.display_name}`)
      } catch (error) {
        console.error(`❌ Failed to generate embeddings for ${user.display_name}:`, error)
      }
    }

    // 4. Create sample events
    console.log('📅 Creating sample events...')
    const { error: eventsError } = await supabase
      .from('events')
      .insert(sampleEvents)

    if (eventsError) {
      throw new Error(`Failed to create events: ${eventsError.message}`)
    }

    console.log(`✅ Created ${sampleEvents.length} sample events`)

    // 5. Create some sample RSVPs
    console.log('🎫 Creating sample RSVPs...')
    const sampleRsvps = []
    for (const event of sampleEvents) {
      // Randomly select 2-4 users to RSVP to each event
      const rsvpCount = Math.floor(Math.random() * 3) + 2
      const shuffledUsers = [...sampleUsers].sort(() => 0.5 - Math.random())
      
      for (let i = 0; i < rsvpCount; i++) {
        sampleRsvps.push({
          id: faker.string.uuid(),
          user_id: shuffledUsers[i].id,
          event_id: event.id,
          status: 'confirmed',
          created_at: new Date().toISOString()
        })
      }
    }

    const { error: rsvpsError } = await supabase
      .from('rsvps')
      .insert(sampleRsvps)

    if (rsvpsError) {
      console.warn(`⚠️ Failed to create RSVPs: ${rsvpsError.message}`)
    } else {
      console.log(`✅ Created ${sampleRsvps.length} sample RSVPs`)
    }

    // 6. Create sample feedback
    console.log('💬 Creating sample feedback...')
    const sampleFeedback = [
      {
        id: faker.string.uuid(),
        user_id: sampleUsers[1].id,
        match_id: faker.string.uuid(), // This would be a real match ID in production
        rating: 5,
        comment: 'Great match! Bob was exactly the kind of technical mentor I was looking for.',
        feedback_type: 'match_quality',
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: faker.string.uuid(),
        user_id: sampleUsers[3].id,
        match_id: faker.string.uuid(),
        rating: 4,
        comment: 'Good connection, but the timing wasn\'t quite right for collaboration.',
        feedback_type: 'match_quality',
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]

    const { error: feedbackError } = await supabase
      .from('feedback')
      .insert(sampleFeedback)

    if (feedbackError) {
      console.warn(`⚠️ Failed to create feedback: ${feedbackError.message}`)
    } else {
      console.log(`✅ Created ${sampleFeedback.length} sample feedback entries`)
    }

    console.log('🎉 Database seeding completed successfully!')
    console.log('\n📊 Summary:')
    console.log(`   • ${sampleUsers.length} users created`)
    console.log(`   • ${sampleUsers.length} profiles created`)
    console.log(`   • ${sampleEvents.length} events created`)
    console.log(`   • ${sampleRsvps.length} RSVPs created`)
    console.log(`   • ${sampleFeedback.length} feedback entries created`)
    console.log('\n🔑 Demo credentials:')
    console.log('   Email: alice.johnson@example.com')
    console.log('   Password: password123')
    console.log('\n   Email: bob.williams@example.com')
    console.log('   Password: password123')

  } catch (error) {
    console.error('❌ Database seeding failed:', error)
    process.exit(1)
  }
}

// Run the seeding script
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('✅ Seeding completed successfully')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error)
      process.exit(1)
    })
}

export { seedDatabase }