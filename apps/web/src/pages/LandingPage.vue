<template>
  <div class="bg-white min-h-screen font-inter text-gray-900">
    <nav class="flex justify-between items-center max-w-6xl mx-auto px-6 py-6">
      <div class="font-bold text-xl tracking-tight text-blue-600">ZenPortal</div>
      <div class="space-x-4">
        <router-link to="/login" class="text-sm font-medium hover:text-blue-600">Login</router-link>
        <router-link to="/pricing" class="bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition">Get Started Free</router-link>
      </div>
    </nav>

    <section class="text-center max-w-4xl mx-auto px-6 mt-20 mb-24">
      <span class="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide border border-blue-100">For Premium VAs</span>
      
      <h1 class="text-5xl sm:text-6xl font-extrabold mt-6 tracking-tight text-gray-900">
        Stop sending <span class="text-blue-600">ugly emails</span> to your clients.
      </h1>
      
      <p class="text-xl text-gray-500 mt-6 max-w-2xl mx-auto">
        Replace your messy "End of Day" WhatsApp messages with a professional Client Portal. Prove your value, justify your rates, and become unfireable.
      </p>
      
      <div class="mt-10 flex flex-col sm:flex-row justify-center gap-4">
        <router-link to="/signup" class="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-blue-700 transition">
          Create My Portal
        </router-link>
        <a href="#" class="bg-gray-100 text-gray-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-200 transition">
          View Demo
        </a>
      </div>
      
      <p class="mt-4 text-sm text-gray-400">No credit card required • Free for 1 Client</p>
    </section>

    <section class="bg-gray-50 py-20 border-t border-gray-200">
      <div class="max-w-6xl mx-auto px-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          <div class="opacity-50 hover:opacity-100 transition duration-500">
            <h3 class="text-center font-bold text-gray-400 mb-4 uppercase tracking-widest text-sm">The "Cheap VA" Way</h3>
            <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm relative overflow-hidden h-64">
              <div class="text-xs text-gray-400 mb-2">To: Client &lt;jim@boss.com&gt;</div>
              <div class="font-serif text-gray-800 text-sm leading-relaxed">
                Hi Sir,<br><br>
                Here is update for today. I did the email and also the research. <br>
                Attached is the file <i>screenshot_final_v2.png</i>...
              </div>
              <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span class="text-red-500/20 text-9xl font-bold rotate-12">❌</span>
              </div>
            </div>
          </div>

          <div class="transform md:-translate-y-4">
            <h3 class="text-center font-bold text-blue-600 mb-4 uppercase tracking-widest text-sm">The "Pro Partner" Way</h3>
            <div class="bg-white rounded-xl border-2 border-blue-600 shadow-2xl overflow-hidden relative">
              <div class="bg-blue-600 text-white text-xs py-1 text-center font-bold">CLIENT PORTAL</div>
              <img src="https://ui-avatars.com/api/?name=Dashboard&background=ffffff&color=000&size=512&font-size=0.1" class="w-full opacity-90 blur-[1px]" alt="Dashboard Preview"> 
              <div class="absolute inset-0 flex flex-col items-center justify-center bg-white/10 backdrop-blur-sm">
                <div class="bg-white px-6 py-4 rounded-lg shadow-lg text-center">
                  <p class="text-blue-600 font-bold text-lg">Verified Work Log</p>
                  <p class="text-gray-500 text-sm">Video Summary Included</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  </div>
</template>