<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
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
</template>