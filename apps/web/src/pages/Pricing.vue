<script setup lang="ts">
// No custom components needed to match the raw HTML design exactly
</script>

<template>
  <div class="bg-slate-900 text-white flex flex-col min-h-screen font-inter">
    
    <nav class="max-w-5xl mx-auto w-full p-6 flex justify-between items-center">
      <div class="font-bold text-xl tracking-tight text-blue-400">ZenPortal</div>
      <router-link to="/" class="text-slate-400 hover:text-white text-sm font-medium">
        Back to Dashboard
      </router-link>
    </nav>

    <main class="flex-1 flex flex-col items-center justify-center p-6 text-center">
        
      <div class="mb-10 max-w-2xl">
        <span class="text-blue-400 font-bold tracking-widest uppercase text-xs mb-2 block">Premium Membership</span>
        <h1 class="text-4xl md:text-5xl font-extrabold mb-4">Invest in your career.</h1>
        <p class="text-slate-400 text-lg">You earn $1,000+ per month. Don't risk losing it over a messy email report.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full text-left">
          
        <div class="bg-slate-800 rounded-2xl p-8 border border-slate-700 opacity-70 hover:opacity-100 transition">
          <h3 class="text-xl font-bold text-white mb-2">Starter</h3>
          <div class="text-3xl font-bold mb-6">$0 <span class="text-sm font-normal text-slate-400">/ forever</span></div>
          <ul class="space-y-4 mb-8 text-slate-300 text-sm">
            <li class="flex items-center gap-3"><i class="ph ph-check text-blue-400 text-lg"></i> 1 Client Limit</li>
            <li class="flex items-center gap-3"><i class="ph ph-check text-blue-400 text-lg"></i> Basic Work Logging</li>
            <li class="flex items-center gap-3"><i class="ph ph-x text-slate-600 text-lg"></i> <span class="text-slate-500 line-through">Custom Branding</span></li>
            <li class="flex items-center gap-3"><i class="ph ph-x text-slate-600 text-lg"></i> <span class="text-slate-500 line-through">Video Uploads</span></li>
          </ul>
          <button class="w-full py-3 rounded-lg border border-slate-600 text-white font-medium hover:bg-slate-700 transition">Current Plan</button>
        </div>

        <div class="bg-gradient-to-b from-blue-600 to-blue-800 rounded-2xl p-8 relative shadow-2xl transform md:-translate-y-4">
          <div class="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg uppercase">Best Value</div>
          
          <h3 class="text-xl font-bold text-white mb-2">Agency Pro</h3>
          <div class="text-4xl font-extrabold mb-6">$12 <span class="text-sm font-normal text-blue-200">/ month</span></div>
          <p class="text-blue-100 text-xs mb-6">Less than the cost of one lunch.</p>

          <ul class="space-y-4 mb-8 text-white text-sm font-medium">
            <li class="flex items-center gap-3">
              <div class="bg-blue-500 p-1 rounded-full"><i class="ph ph-check text-white text-xs"></i></div> 
              Unlimited Clients
            </li>
            <li class="flex items-center gap-3">
              <div class="bg-blue-500 p-1 rounded-full"><i class="ph ph-check text-white text-xs"></i></div> 
              Remove "ZenPortal" Branding
            </li>
            <li class="flex items-center gap-3">
              <div class="bg-blue-500 p-1 rounded-full"><i class="ph ph-check text-white text-xs"></i></div> 
              Video/Loom Integrations
            </li>
            <li class="flex items-center gap-3">
              <div class="bg-blue-500 p-1 rounded-full"><i class="ph ph-check text-white text-xs"></i></div> 
              Priority Support
            </li>
          </ul>
          
          <button class="w-full py-4 rounded-xl bg-white text-blue-900 font-bold hover:bg-blue-50 transition shadow-lg flex items-center justify-center gap-2">
            <i class="ph ph-lightning-fill text-yellow-500"></i> Upgrade Now
          </button>
          <p class="text-center text-xs text-blue-200 mt-4">30-day money-back guarantee.</p>
        </div>

      </div>
    </main>
  </div>
</template>