<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { 
  Book, 
  Database, 
  Server, 
  Shield, 
  Layout, 
  Code, 
  Terminal,
  KeyRound,
  Menu
} from 'lucide-vue-next'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import ModeToggle from '@/components/ModeToggle.vue'

const router = useRouter()
const activeSection = ref('introduction')
const codeTab = ref('curl')

const sections = [
  { id: 'introduction', label: 'Introduction', icon: Book },
  { id: 'architecture', label: 'Architecture', icon: Layout },
  { id: 'programmatic-api', label: 'Programmatic API', icon: KeyRound },
  { id: 'database', label: 'Database Schema', icon: Database },
  { id: 'api', label: 'Web App API', icon: Server },
  { id: 'auth', label: 'Authentication', icon: Shield },
  { id: 'scripts', label: 'Scripts & Cron', icon: Terminal },
]

const scrollTo = (id: string) => {
  activeSection.value = id
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <div class="min-h-screen bg-background font-sans text-foreground flex flex-col">
    
    <header class="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div class="container flex h-14 items-center max-w-screen-2xl">
        <div class="mr-4 flex">
          <a class="mr-6 flex items-center space-x-2 font-bold" href="/">
            <Book class="h-6 w-6" />
            <span class="hidden sm:inline-block">ZenPortal Docs</span>
          </a>
        </div>
        
        <Sheet>
          <SheetTrigger as-child>
            <Button variant="ghost" class="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden">
              <Menu class="h-5 w-5" />
              <span class="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" class="pr-0">
            <nav class="flex flex-col gap-4 px-2">
               <Button 
                v-for="section in sections" 
                :key="section.id"
                variant="ghost" 
                class="justify-start gap-2"
                @click="scrollTo(section.id)"
              >
                <component :is="section.icon" class="h-4 w-4" />
                {{ section.label }}
              </Button>
            </nav>
          </SheetContent>
        </Sheet>

        <div class="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div class="w-full flex-1 md:w-auto md:flex-none">
            </div>
          <nav class="flex items-center gap-2">
            <ModeToggle />
            <Button variant="outline" @click="router.push('/dashboard')">Back to App</Button>
          </nav>
        </div>
      </div>
    </header>

    <div class="flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10 container max-w-screen-2xl">
      
      <aside class="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
        <ScrollArea class="h-full py-6 pr-6 lg:py-8">
          <div class="flex flex-col gap-2">
            <h4 class="rounded-md px-2 py-1 text-sm font-semibold">Table of Contents</h4>
            <Button 
              v-for="section in sections" 
              :key="section.id"
              :variant="activeSection === section.id ? 'secondary' : 'ghost'" 
              class="justify-start gap-2 h-9"
              @click="scrollTo(section.id)"
            >
              <component :is="section.icon" class="h-4 w-4 opacity-70" />
              {{ section.label }}
            </Button>
          </div>
        </ScrollArea>
      </aside>

      <main class="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_200px] px-4 md:px-0">
        <div class="mx-auto w-full min-w-0 space-y-12">
          
          <section id="introduction" class="scroll-m-20">
            <h1 class="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">Documentation</h1>
            <p class="text-xl text-muted-foreground leading-relaxed">
              Technical reference for the ZenPortal Freelancer SaaS application. This system allows freelancers to log work, generate client portals, and track earnings.
            </p>
            <div class="flex gap-4 mt-6">
              <Badge variant="secondary">Version 1.0.0</Badge>
              <Badge variant="outline">Vue 3</Badge>
              <Badge variant="outline">Hono</Badge>
              <Badge variant="outline">Drizzle ORM</Badge>
            </div>
          </section>

          <Separator />

          <section id="architecture" class="scroll-m-20 space-y-4">
            <h2 class="text-3xl font-bold tracking-tight">Architecture</h2>
            <Card>
              <CardHeader>
                <CardTitle>Tech Stack</CardTitle>
                <CardDescription>The application is built using a modern full-stack implementation.</CardDescription>
              </CardHeader>
              <CardContent class="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 class="font-semibold mb-2 flex items-center gap-2"><Layout class="h-4 w-4"/> Frontend</h3>
                  <ul class="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li><strong>Framework:</strong> Vue 3 (Composition API)</li>
                    <li><strong>UI Library:</strong> Shadcn Vue + TailwindCSS</li>
                    <li><strong>State Management:</strong> Pinia</li>
                    <li><strong>Router:</strong> Vue Router</li>
                  </ul>
                </div>
                <div>
                   <h3 class="font-semibold mb-2 flex items-center gap-2"><Server class="h-4 w-4"/> Backend</h3>
                  <ul class="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li><strong>Runtime:</strong> Node.js / Serverless</li>
                    <li><strong>Framework:</strong> Hono</li>
                    <li><strong>Database:</strong> SQLite (Turso) via Drizzle ORM</li>
                    <li><strong>Email:</strong> Resend API</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </section>

          <Separator />

          <section id="programmatic-api" class="scroll-m-20 space-y-6">
            <h2 class="text-3xl font-bold tracking-tight flex items-center gap-3"><KeyRound class="h-8 w-8 text-blue-500"/>Programmatic API</h2>
            <p class="text-muted-foreground text-base leading-relaxed">
              Automate your workflows by interacting with the ZenPortal API. This allows you to integrate with other services like time trackers, project management tools, or build custom reports. API Access is available to <Badge variant="secondary" class="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">Pro</Badge> users.
            </p>

            <h3 class="text-xl font-bold tracking-tight pt-4">Authentication</h3>
            <p class="text-muted-foreground">
              Authentication is handled via Bearer Tokens. You can generate your unique API keys from the
              <a href="/settings" class="text-blue-600 dark:text-blue-400 hover:underline">API Access</a> tab in your settings.
              You must include your API key in the `Authorization` header with every request.
            </p>
            <div class="bg-muted p-3 rounded-lg text-sm font-mono border">
              Authorization: Bearer &lt;YOUR_API_KEY&gt;
            </div>

             <h3 class="text-2xl font-bold tracking-tight pt-6">Endpoints</h3>
            
            <!-- GET /v1/logs -->
            <div class="space-y-4 pt-4 border-t">
              <div class="flex items-center gap-3">
                <Badge variant="secondary" class="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 h-6">GET</Badge>
                <code class="text-lg font-bold">/v1/logs</code>
              </div>
              <p class="text-muted-foreground">Retrieves a list of the 100 most recent work logs for the authenticated user.</p>
              <p class="text-sm"><Badge variant="outline">Permission: `apiKeyRead` or `apiKeyWrite`</Badge></p>

              <Card>
                <CardHeader class="p-0">
                  <div class="flex items-center border-b border-border">
                    <button @click="codeTab = 'curl'" :class="['flex-1 p-3 text-sm font-medium', codeTab === 'curl' ? 'bg-muted' : 'text-muted-foreground']">cURL</button>
                    <button @click="codeTab = 'js'" :class="['flex-1 p-3 text-sm font-medium border-l border-border', codeTab === 'js' ? 'bg-muted' : 'text-muted-foreground']">JavaScript</button>
                    <button @click="codeTab = 'python'" :class="['flex-1 p-3 text-sm font-medium border-l border-border', codeTab === 'python' ? 'bg-muted' : 'text-muted-foreground']">Python</button>
                  </div>
                </CardHeader>
                <CardContent class="p-4 bg-muted/50 text-sm">
                  <div v-if="codeTab === 'curl'" class="font-mono">
                    <pre><code>curl -X GET "https://api.zenportal.io/v1/logs" \
  -H "Authorization: Bearer your_read_key"</code></pre>
                  </div>
                  <div v-if="codeTab === 'js'" class="font-mono">
                    <pre><code>const response = await fetch('https://api.zenportal.io/v1/logs', {
  headers: {
    'Authorization': 'Bearer your_read_key'
  }
});
const logs = await response.json();</code></pre>
                  </div>
                  <div v-if="codeTab === 'python'" class="font-mono">
                    <pre><code>import requests

headers = {'Authorization': 'Bearer your_read_key'}
response = requests.get('https://api.zenportal.io/v1/logs', headers=headers)
logs = response.json()</code></pre>
                  </div>
                </CardContent>
              </Card>
            </div>

            <!-- POST /v1/logs -->
            <div class="space-y-4 pt-8 border-t">
              <div class="flex items-center gap-3">
                <Badge variant="secondary" class="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 h-6">POST</Badge>
                <code class="text-lg font-bold">/v1/logs</code>
              </div>
              <p class="text-muted-foreground">Creates a new work log entry.</p>
              <p class="text-sm"><Badge variant="outline" class="border-red-500/30 text-red-500">Permission: `apiKeyWrite` only</Badge></p>

              <h4 class="font-bold">Body Parameters</h4>
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead class="text-left">
                    <tr class="border-b">
                      <th class="p-2">Parameter</th><th class="p-2">Type</th><th class="p-2">Required</th><th class="p-2">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="border-b"><td class="p-2">`clientId`</td><td class="p-2">`string`</td><td class="p-2">Yes</td><td class="p-2">The ID of the client this log is for.</td></tr>
                    <tr class="border-b"><td class="p-2">`date`</td><td class="p-2">`string`</td><td class="p-2">Yes</td><td class="p-2">Date in "YYYY-MM-DD" format.</td></tr>
                    <tr class="border-b"><td class="p-2">`summary`</td><td class="p-2">`string`</td><td class="p-2">Yes</td><td class="p-2">A description of the work done.</td></tr>
                    <tr><td class="p-2">`hoursWorked`</td><td class="p-2">`number`</td><td class="p-2">Yes</td><td class="p-2">The number of hours worked.</td></tr>
                  </tbody>
                </table>
              </div>

              <Card>
                <CardHeader class="p-0">
                  <div class="flex items-center border-b border-border">
                    <button @click="codeTab = 'curl'" :class="['flex-1 p-3 text-sm font-medium', codeTab === 'curl' ? 'bg-muted' : 'text-muted-foreground']">cURL</button>
                    <button @click="codeTab = 'js'" :class="['flex-1 p-3 text-sm font-medium border-l border-border', codeTab === 'js' ? 'bg-muted' : 'text-muted-foreground']">JavaScript</button>
                    <button @click="codeTab = 'python'" :class="['flex-1 p-3 text-sm font-medium border-l border-border', codeTab === 'python' ? 'bg-muted' : 'text-muted-foreground']">Python</button>
                  </div>
                </CardHeader>
                <CardContent class="p-4 bg-muted/50 text-sm">
                  <div v-if="codeTab === 'curl'" class="font-mono">
                    <pre><code>curl -X POST "https://api.zenportal.io/v1/logs" \
  -H "Authorization: Bearer your_write_key" \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": "clt_abc123",
    "date": "2026-01-25",
    "summary": "Automated log entry via API",
    "hoursWorked": 1.5
  }'</code></pre>
                  </div>
                  <div v-if="codeTab === 'js'" class="font-mono">
                    <pre><code>const response = await fetch('https://api.zenportal.io/v1/logs', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer your_write_key',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    clientId: 'clt_abc123',
    date: '2026-01-25',
    summary: 'Automated log entry via API',
    hoursWorked: 1.5
  })
});
const newLog = await response.json();</code></pre>
                  </div>
                  <div v-if="codeTab === 'python'" class="font-mono">
                    <pre><code>import requests

headers = {
    'Authorization': 'Bearer your_write_key',
    'Content-Type': 'application/json'
}
payload = {
    'clientId': 'clt_abc123',
    'date': '2026-01-25',
    'summary': 'Automated log entry via API',
    'hoursWorked': 1.5
}
response = requests.post('https://api.zenportal.io/v1/logs', headers=headers, json=payload)
new_log = response.json()</code></pre>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <Separator />

          <section id="database" class="scroll-m-20 space-y-6">
            <h2 class="text-3xl font-bold tracking-tight">Database Schema</h2>
            <p class="text-muted-foreground">The database consists of three core tables defined in <code>schema.ts</code>.</p>
            
            <div class="grid gap-6">
              <Card>
                <CardHeader>
                  <div class="flex justify-between items-center">
                    <CardTitle class="font-mono text-blue-600 dark:text-blue-400">users</CardTitle>
                    <Badge>Core</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul class="space-y-2 text-sm">
                    <li class="grid grid-cols-[120px_1fr]"><span class="font-bold">id</span> <span>Primary Key (Clerk User ID)</span></li>
                    <li class="grid grid-cols-[120px_1fr]"><span class="font-bold">tier</span> <span>Enum: 'free' | 'pro'</span></li>
                    <li class="grid grid-cols-[120px_1fr]"><span class="font-bold">portalSlug</span> <span>Unique profile handle</span></li>
                    <li class="grid grid-cols-[120px_1fr]"><span class="font-bold">apiKeyRead</span> <span>(Pro) Read-only API key</span></li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                 <CardHeader>
                  <div class="flex justify-between items-center">
                    <CardTitle class="font-mono text-green-600 dark:text-green-400">clients</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul class="space-y-2 text-sm">
                    <li class="grid grid-cols-[120px_1fr]"><span class="font-bold">accessToken</span> <span>Unique "Magic Link" token</span></li>
                    <li class="grid grid-cols-[120px_1fr]"><span class="font-bold">hourlyRate</span> <span>Rate stored per client</span></li>
                    <li class="grid grid-cols-[120px_1fr]"><span class="font-bold">status</span> <span>Enum: 'active' | 'archived'</span></li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                 <CardHeader>
                  <div class="flex justify-between items-center">
                    <CardTitle class="font-mono text-purple-600 dark:text-purple-400">work_logs</CardTitle>
                    <Badge variant="outline">High Volume</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul class="space-y-2 text-sm">
                    <li class="grid grid-cols-[120px_1fr]"><span class="font-bold">videoUrl</span> <span>Loom/Video integration link</span></li>
                    <li class="grid grid-cols-[120px_1fr]"><span class="font-bold">isBlocked</span> <span>Boolean flag for red badge</span></li>
                    <li class="grid grid-cols-[120px_1fr]"><span class="font-bold">blockerDetails</span> <span>Reason for blockage</span></li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          <section id="api" class="scroll-m-20 space-y-6">
             <h2 class="text-3xl font-bold tracking-tight">Web App API Reference</h2>
             <p class="text-muted-foreground">These are the internal endpoints used by the ZenPortal web application. They are all protected by Clerk session authentication.</p>

             <div class="space-y-4">
               
               <div class="border border-border rounded-lg p-4">
                 <div class="flex items-center gap-3 mb-2">
                   <Badge variant="secondary" class="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">GET</Badge>
                   <code class="text-sm font-bold">/api/logs</code>
                 </div>
                 <p class="text-sm text-muted-foreground">Fetches paginated work logs for the dashboard.</p>
               </div>

               <div class="border border-border rounded-lg p-4">
                 <div class="flex items-center gap-3 mb-2">
                   <Badge variant="secondary" class="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">POST</Badge>
                   <code class="text-sm font-bold">/api/logs</code>
                 </div>
                 <p class="text-sm text-muted-foreground">Creates a new work entry. Triggers email notification to client if configured.</p>
               </div>

               <div class="border border-border rounded-lg p-4">
                 <div class="flex items-center gap-3 mb-2">
                   <Badge variant="secondary" class="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">PATCH</Badge>
                   <code class="text-sm font-bold">/api/auth/me</code>
                 </div>
                 <p class="text-sm text-muted-foreground">Updates user preferences (Notifications, Branding). Supports partial updates.</p>
               </div>

             </div>
          </section>

          <section id="auth" class="scroll-m-20 space-y-4">
            <h2 class="text-3xl font-bold tracking-tight">Web App Authentication</h2>
            <p class="text-muted-foreground">
              Authentication for the web application is handled by <strong>Clerk</strong>. The frontend uses the <code>@clerk/vue</code> SDK to manage sessions.
            </p>
            <Card class="bg-muted/50">
              <CardContent class="pt-6">
                <h4 class="font-bold mb-2">Backend Middleware</h4>
                <p class="text-sm text-muted-foreground mb-4">
                  The backend uses <code>clerkMiddleware</code> to verify the JWT sent in the Authorization header.
                </p>
                <div class="bg-black text-white p-3 rounded-md text-xs font-mono">
                  headers: {<br>
                  &nbsp;&nbsp;"Authorization": "Bearer &lt;CLERK_JWT_TOKEN&gt;"<br>
                  }
                </div>
              </CardContent>
            </Card>
          </section>

          <section id="scripts" class="scroll-m-20 space-y-4">
            <h2 class="text-3xl font-bold tracking-tight">Scripts & Automation</h2>
            
            <div class="grid gap-4">
              <div class="flex items-start gap-4">
                <div class="p-2 bg-muted rounded">
                  <Terminal class="h-6 w-6" />
                </div>
                <div>
                  <h3 class="font-bold">Weekly Recap Cron</h3>
                  <code class="text-xs bg-muted px-1 py-0.5 rounded">src/scripts/cron.ts</code>
                  <p class="text-sm text-muted-foreground mt-1">
                    Runs every Sunday. Aggregates logs for the past 7 days and sends an email summary to users who have <code>notifyWeeklyRecap</code> enabled.
                  </p>
                </div>
              </div>

               <div class="flex items-start gap-4">
                <div class="p-2 bg-muted rounded">
                  <Code class="h-6 w-6" />
                </div>
                <div>
                  <h3 class="font-bold">Database Push</h3>
                  <code class="text-xs bg-muted px-1 py-0.5 rounded">npx drizzle-kit push</code>
                  <p class="text-sm text-muted-foreground mt-1">
                    Syncs the schema defined in <code>schema.ts</code> directly to the Turso/SQLite database.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div class="border-t border-border pt-10">
            <p class="text-muted-foreground text-sm">Generated by ZenPortal Documentation Generator.</p>
          </div>

        </div>
        
        <div class="hidden text-sm xl:block">
          <div class="sticky top-20">
            <h4 class="font-bold mb-4">On this page</h4>
            <ul class="space-y-2">
              <li v-for="section in sections" :key="section.id">
                <a :href="`#${section.id}`" class="text-muted-foreground hover:text-foreground transition-colors block py-1 border-l-2 border-transparent hover:border-foreground pl-4" :class="{ 'text-foreground border-foreground': activeSection === section.id }">
                  {{ section.label }}
                </a>
              </li>
            </ul>
          </div>
        </div>

      </main>
    </div>
  </div>
</template>