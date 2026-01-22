<script setup lang="ts">
import { ref } from 'vue'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/vue'

// Import the sub-components
import ProfileSettings from '../components/settings/ProfileSettings.vue' // <--- NEW
import BrandingSettings from '../components/settings/BrandingSettings.vue'
import BillingSettings from '../components/settings/BillingSettings.vue'
import NotificationSettings from '../components/settings/NotificationSettings.vue'

const activeTab = ref('profile')
</script>

<template>
    <div class="h-full flex flex-col font-inter bg-[#F3F4F6]">
        <header class="bg-white border-b border-gray-200 p-6 sticky top-0 z-10">
            <div>
                <h2 class="text-2xl font-bold text-gray-800">Account Settings</h2>
                <p class="text-sm text-gray-500">Manage your branding, subscription, and preferences.</p>
            </div>
        </header>

        <div class="p-8 max-w-5xl mx-auto w-full">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div class="md:col-span-1 space-y-1">
                    <button @click="activeTab = 'profile'"
                        class="w-full text-left px-4 py-2.5 rounded-lg font-medium border transition"
                        :class="activeTab === 'profile' ? 'bg-blue-50 text-blue-600 border-blue-200' : 'text-gray-600 border-transparent hover:bg-gray-50'">
                        My Profile
                    </button>
                    <button @click="activeTab = 'branding'"
                        class="w-full text-left px-4 py-2.5 rounded-lg font-medium border transition"
                        :class="activeTab === 'branding' ? 'bg-blue-50 text-blue-600 border-blue-200' : 'text-gray-600 border-transparent hover:bg-gray-50'">
                        Branding & Look
                    </button>
                    <button @click="activeTab = 'billing'"
                        class="w-full text-left px-4 py-2.5 rounded-lg font-medium border transition"
                        :class="activeTab === 'billing' ? 'bg-blue-50 text-blue-600 border-blue-200' : 'text-gray-600 border-transparent hover:bg-gray-50'">
                        Billing (Stripe)
                    </button>
                    <button @click="activeTab = 'notifications'"
                        class="w-full text-left px-4 py-2.5 rounded-lg font-medium border transition"
                        :class="activeTab === 'notifications' ? 'bg-blue-50 text-blue-600 border-blue-200' : 'text-gray-600 border-transparent hover:bg-gray-50'">
                        Notifications
                    </button>
                </div>

                <div class="md:col-span-3 space-y-6">
                    <ProfileSettings v-if="activeTab === 'profile'" />
                    <BrandingSettings v-if="activeTab === 'branding'" />
                    <BillingSettings v-if="activeTab === 'billing'" />
                    <NotificationSettings v-if="activeTab === 'notifications'" />
                </div>

            </div>
        </div>
    </div>
</template>