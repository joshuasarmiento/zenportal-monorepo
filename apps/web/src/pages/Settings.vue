<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref('branding')

// Mock state for form inputs
const portalLink = ref('juan-cruz')
const settings = ref({
  clientViewReport: true,
  weeklyRecap: true,
  marketing: false
})
</script>

<template>
  <div class="h-full flex flex-col font-inter bg-[#F3F4F6]">
    
    <header class="bg-white border-b border-gray-200 p-6 sticky top-0 z-10">
      <h2 class="text-2xl font-bold text-gray-800">Account Settings</h2>
      <p class="text-sm text-gray-500">Manage your branding, subscription, and preferences.</p>
    </header>

    <div class="p-8 max-w-5xl mx-auto w-full">
      
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        <div class="md:col-span-1 space-y-1">
          <button 
            @click="activeTab = 'branding'" 
            class="w-full text-left px-4 py-2.5 rounded-lg font-medium border transition"
            :class="activeTab === 'branding' ? 'bg-blue-50 text-blue-600 border-blue-200' : 'text-gray-600 border-transparent hover:bg-gray-50'"
          >
            Branding & Look
          </button>
          <button 
            @click="activeTab = 'billing'" 
            class="w-full text-left px-4 py-2.5 rounded-lg font-medium border transition"
            :class="activeTab === 'billing' ? 'bg-blue-50 text-blue-600 border-blue-200' : 'text-gray-600 border-transparent hover:bg-gray-50'"
          >
            Billing (Stripe)
          </button>
          <button 
            @click="activeTab = 'notifications'" 
            class="w-full text-left px-4 py-2.5 rounded-lg font-medium border transition"
            :class="activeTab === 'notifications' ? 'bg-blue-50 text-blue-600 border-blue-200' : 'text-gray-600 border-transparent hover:bg-gray-50'"
          >
            Notifications
          </button>
          <button class="w-full text-left px-4 py-2.5 rounded-lg font-medium text-red-600 hover:bg-red-50 transition mt-6">
            Log Out
          </button>
        </div>

        <div class="md:col-span-3 space-y-6">
          
          <div v-if="activeTab === 'branding'" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="mb-6 pb-6 border-b border-gray-100">
              <h3 class="text-lg font-bold text-gray-900">Portal Appearance</h3>
              <p class="text-sm text-gray-500">Customize how clients see your work logs.</p>
            </div>

            <div class="space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Portal Link</label>
                <div class="flex">
                  <span class="bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg px-3 py-2 text-gray-500 text-sm flex items-center">portal.app/</span>
                  <input 
                    v-model="portalLink" 
                    type="text" 
                    class="flex-1 border border-gray-300 rounded-r-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold text-gray-800"
                  >
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Agency Logo</label>
                <div class="flex items-center gap-4">
                  <div class="w-16 h-16 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-sm">JD</div>
                  <div>
                    <button class="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition">Upload New</button>
                    <p class="text-xs text-gray-500 mt-1">Recommended size: 200x200px</p>
                  </div>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Accent Color</label>
                <div class="flex gap-3">
                  <div class="w-8 h-8 rounded-full bg-indigo-600 cursor-pointer ring-2 ring-offset-2 ring-indigo-600"></div>
                  <div class="w-8 h-8 rounded-full bg-blue-500 cursor-pointer hover:opacity-80"></div>
                  <div class="w-8 h-8 rounded-full bg-emerald-500 cursor-pointer hover:opacity-80"></div>
                  <div class="w-8 h-8 rounded-full bg-rose-500 cursor-pointer hover:opacity-80"></div>
                  <div class="w-8 h-8 rounded-full bg-gray-900 cursor-pointer hover:opacity-80"></div>
                </div>
              </div>
            </div>
            
            <div class="mt-8 pt-6 border-t border-gray-100 flex justify-end">
              <button class="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition">Save Changes</button>
            </div>
          </div>

          <div v-if="activeTab === 'billing'" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="mb-6 pb-6 border-b border-gray-100 flex justify-between items-start">
              <div>
                <h3 class="text-lg font-bold text-gray-900">Subscription</h3>
                <p class="text-sm text-gray-500">Manage your plan and payment methods.</p>
              </div>
              <span class="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full uppercase">Active</span>
            </div>

            <div class="bg-slate-900 text-white rounded-xl p-6 mb-8 relative overflow-hidden">
              <div class="relative z-10">
                <div class="flex justify-between items-center mb-4">
                  <span class="text-blue-400 font-bold text-sm tracking-wider uppercase">Agency Pro</span>
                  <span class="text-2xl font-bold">$12<span class="text-sm text-slate-400 font-normal">/mo</span></span>
                </div>
                <ul class="text-sm text-slate-300 space-y-2 mb-6">
                  <li class="flex items-center gap-2"><i class="ph ph-check text-blue-400"></i> Unlimited Clients</li>
                  <li class="flex items-center gap-2"><i class="ph ph-check text-blue-400"></i> Video Integrations</li>
                  <li class="flex items-center gap-2"><i class="ph ph-check text-blue-400"></i> Priority Support</li>
                </ul>
                <div class="flex gap-3">
                  <button class="bg-white text-slate-900 px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-50 transition">Manage Billing</button>
                  <button class="bg-transparent border border-slate-600 text-slate-300 px-4 py-2 rounded-lg text-sm hover:text-white hover:border-white transition">Cancel Plan</button>
                </div>
              </div>
              <div class="absolute right-0 top-0 opacity-10 pointer-events-none">
                <i class="ph ph-crown text-9xl -mr-4 -mt-4"></i>
              </div>
            </div>

            <div>
              <h4 class="font-bold text-gray-800 text-sm mb-3">Payment Method</h4>
              <div class="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="bg-gray-100 p-2 rounded">
                    <i class="ph ph-credit-card text-xl text-gray-600"></i>
                  </div>
                  <div>
                    <p class="text-sm font-bold text-gray-900">Visa ending in 4242</p>
                    <p class="text-xs text-gray-500">Expires 12/2028</p>
                  </div>
                </div>
                <button class="text-blue-600 text-sm font-medium hover:underline">Update</button>
              </div>
            </div>
          </div>

          <div v-if="activeTab === 'notifications'" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="mb-6 pb-6 border-b border-gray-100">
              <h3 class="text-lg font-bold text-gray-900">Email Alerts</h3>
              <p class="text-sm text-gray-500">Control when ZenPortal sends you emails.</p>
            </div>

            <div class="space-y-6">
              
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-bold text-gray-800">Client Views Report</p>
                  <p class="text-xs text-gray-500">Get notified when a client opens your magic link.</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="settings.clientViewReport" class="sr-only peer">
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-bold text-gray-800">Weekly Earnings Recap</p>
                  <p class="text-xs text-gray-500">Receive a Sunday summary of hours logged.</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="settings.weeklyRecap" class="sr-only peer">
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-bold text-gray-800">Marketing & Tips</p>
                  <p class="text-xs text-gray-500">News about new features and freelance tips.</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="settings.marketing" class="sr-only peer">
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

            </div>
            
            <div class="mt-8 pt-6 border-t border-gray-100 flex justify-end">
              <button class="bg-gray-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-black transition">Update Preferences</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>