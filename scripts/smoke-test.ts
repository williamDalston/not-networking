#!/usr/bin/env ts-node

/**
 * Smoke test script for production deployment
 * 
 * This script runs basic tests to ensure the deployed application is working correctly.
 * Run with: npm run smoke-test
 */

import 'dotenv/config'

interface TestResult {
  name: string
  status: 'pass' | 'fail' | 'skip'
  message: string
  duration?: number
}

class SmokeTester {
  private results: TestResult[] = []
  private baseUrl: string

  constructor(baseUrl: string = process.env.VERCEL_URL || 'http://localhost:3000') {
    this.baseUrl = baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`
  }

  private addResult(result: TestResult) {
    this.results.push(result)
    const status = result.status === 'pass' ? '✅' : result.status === 'fail' ? '❌' : '⏭️'
    console.log(`${status} ${result.name}: ${result.message}`)
  }

  private async makeRequest(url: string, options: RequestInit = {}) {
    const fullUrl = `${this.baseUrl}${url}`
    const startTime = Date.now()
    
    try {
      const response = await fetch(fullUrl, {
        ...options,
        headers: {
          'User-Agent': 'SmokeTest/1.0',
          ...options.headers
        }
      })
      
      const duration = Date.now() - startTime
      return { response, duration }
    } catch (error) {
      const duration = Date.now() - startTime
      throw { error, duration }
    }
  }

  async testHomePage() {
    try {
      const { response, duration } = await this.makeRequest('/')
      
      if (response.ok) {
        this.addResult({
          name: 'Home Page',
          status: 'pass',
          message: `Loads successfully (${response.status})`,
          duration
        })
      } else {
        this.addResult({
          name: 'Home Page',
          status: 'fail',
          message: `HTTP ${response.status}`,
          duration
        })
      }
    } catch ({ error, duration }) {
      this.addResult({
        name: 'Home Page',
        status: 'fail',
        message: `Failed to load: ${error.message}`,
        duration
      })
    }
  }

  async testAuthPages() {
    const authPages = [
      { path: '/auth/login', name: 'Login Page' },
      { path: '/auth/signup', name: 'Signup Page' }
    ]

    for (const page of authPages) {
      try {
        const { response, duration } = await this.makeRequest(page.path)
        
        if (response.ok) {
          this.addResult({
            name: page.name,
            status: 'pass',
            message: `Loads successfully (${response.status})`,
            duration
          })
        } else {
          this.addResult({
            name: page.name,
            status: 'fail',
            message: `HTTP ${response.status}`,
            duration
          })
        }
      } catch ({ error, duration }) {
        this.addResult({
          name: page.name,
          status: 'fail',
          message: `Failed to load: ${error.message}`,
          duration
        })
      }
    }
  }

  async testAPIEndpoints() {
    const apiEndpoints = [
      { path: '/api/health', name: 'Health Check', expectedStatus: 200 },
      { path: '/api/onboarding/social-proof', name: 'Social Proof API', expectedStatus: 200 }
    ]

    for (const endpoint of apiEndpoints) {
      try {
        const { response, duration } = await this.makeRequest(endpoint.path)
        
        if (response.status === endpoint.expectedStatus) {
          this.addResult({
            name: endpoint.name,
            status: 'pass',
            message: `Returns ${response.status}`,
            duration
          })
        } else {
          this.addResult({
            name: endpoint.name,
            status: 'fail',
            message: `Expected ${endpoint.expectedStatus}, got ${response.status}`,
            duration
          })
        }
      } catch ({ error, duration }) {
        this.addResult({
          name: endpoint.name,
          status: 'fail',
          message: `Failed: ${error.message}`,
          duration
        })
      }
    }
  }

  async testStaticAssets() {
    const assets = [
      { path: '/robots.txt', name: 'Robots.txt' },
      { path: '/sitemap.xml', name: 'Sitemap' }
    ]

    for (const asset of assets) {
      try {
        const { response, duration } = await this.makeRequest(asset.path)
        
        if (response.ok) {
          this.addResult({
            name: asset.name,
            status: 'pass',
            message: `Loads successfully`,
            duration
          })
        } else {
          this.addResult({
            name: asset.name,
            status: 'fail',
            message: `HTTP ${response.status}`,
            duration
          })
        }
      } catch ({ error, duration }) {
        this.addResult({
          name: asset.name,
          status: 'fail',
          message: `Failed: ${error.message}`,
          duration
        })
      }
    }
  }

  async testDatabaseConnection() {
    try {
      // Test if we can make a request that requires database access
      const { response, duration } = await this.makeRequest('/api/admin/ai-health')
      
      // We expect this to fail with 401 (unauthorized) or succeed with 200
      // If it fails with 500, that might indicate database issues
      if (response.status === 401) {
        this.addResult({
          name: 'Database Connection',
          status: 'pass',
          message: 'API accessible (authentication required)',
          duration
        })
      } else if (response.ok) {
        this.addResult({
          name: 'Database Connection',
          status: 'pass',
          message: 'API accessible and working',
          duration
        })
      } else if (response.status === 500) {
        this.addResult({
          name: 'Database Connection',
          status: 'fail',
          message: 'Server error - possible database issue',
          duration
        })
      } else {
        this.addResult({
          name: 'Database Connection',
          status: 'pass',
          message: `API accessible (${response.status})`,
          duration
        })
      }
    } catch ({ error, duration }) {
      this.addResult({
        name: 'Database Connection',
        status: 'fail',
        message: `Failed: ${error.message}`,
        duration
      })
    }
  }

  async testPerformance() {
    const pages = ['/', '/auth/login', '/auth/signup']
    
    for (const page of pages) {
      try {
        const { response, duration } = await this.makeRequest(page)
        
        if (response.ok) {
          if (duration < 2000) {
            this.addResult({
              name: `Performance: ${page}`,
              status: 'pass',
              message: `Fast load time (${duration}ms)`,
              duration
            })
          } else if (duration < 5000) {
            this.addResult({
              name: `Performance: ${page}`,
              status: 'pass',
              message: `Acceptable load time (${duration}ms)`,
              duration
            })
          } else {
            this.addResult({
              name: `Performance: ${page}`,
              status: 'fail',
              message: `Slow load time (${duration}ms)`,
              duration
            })
          }
        }
      } catch ({ error, duration }) {
        this.addResult({
          name: `Performance: ${page}`,
          status: 'fail',
          message: `Failed to load: ${error.message}`,
          duration
        })
      }
    }
  }

  async runAllTests() {
    console.log(`🚀 Running smoke tests against: ${this.baseUrl}\n`)

    await this.testHomePage()
    await this.testAuthPages()
    await this.testAPIEndpoints()
    await this.testStaticAssets()
    await this.testDatabaseConnection()
    await this.testPerformance()

    this.printSummary()
  }

  private printSummary() {
    const passed = this.results.filter(r => r.status === 'pass').length
    const failed = this.results.filter(r => r.status === 'fail').length
    const skipped = this.results.filter(r => r.status === 'skip').length
    const total = this.results.length

    console.log('\n📊 Test Summary:')
    console.log(`   ✅ Passed: ${passed}`)
    console.log(`   ❌ Failed: ${failed}`)
    console.log(`   ⏭️  Skipped: ${skipped}`)
    console.log(`   📈 Total: ${total}`)

    const avgDuration = this.results
      .filter(r => r.duration)
      .reduce((sum, r) => sum + (r.duration || 0), 0) / this.results.filter(r => r.duration).length

    if (avgDuration) {
      console.log(`   ⏱️  Average Response Time: ${Math.round(avgDuration)}ms`)
    }

    if (failed === 0) {
      console.log('\n🎉 All tests passed! Deployment looks healthy.')
    } else {
      console.log('\n⚠️  Some tests failed. Please investigate before going live.')
    }

    return failed === 0
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2)
  const baseUrl = args[0] || process.env.VERCEL_URL || 'http://localhost:3000'
  
  const tester = new SmokeTester(baseUrl)
  const success = await tester.runAllTests()
  
  process.exit(success ? 0 : 1)
}

// Run the script
if (require.main === module) {
  main().catch((error) => {
    console.error('❌ Smoke test failed:', error)
    process.exit(1)
  })
}

export { SmokeTester }
