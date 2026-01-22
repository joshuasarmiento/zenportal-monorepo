<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useApi } from '../../lib/api'
import { useUserStore } from '../../stores/userStore'
import { SignOutButton } from '@clerk/vue'
import Button from '../ui/Button.vue'

const { fetchApi } = useApi()
const userStore = useUserStore()
// const { signOut } = useClerk()

const saving = ref(false)

const form = ref({
    fullName: '',
    email: '', // Read-only
    avatarUrl: ''
})

onMounted(async () => {
    await userStore.fetchUser()
    if (userStore.user) {
        form.value = {
            fullName: userStore.user.fullName || '',
            email: userStore.user.email || '',
            avatarUrl: userStore.user.avatarUrl || ''
        }
    }
})

const save = async () => {
    saving.value = true
    try {
        const updatedUser = await fetchApi('/auth/me', {
            method: 'PATCH',
            body: JSON.stringify({
                fullName: form.value.fullName,
                avatarUrl: form.value.avatarUrl
            })
        })
        userStore.user = { ...userStore.user, ...updatedUser }
        alert('Profile updated successfully!')
    } catch (err) {
        alert('Failed to update profile.')
    } finally {
        saving.value = false
    }
}
</script>

<template>
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="mb-6 pb-6 border-b border-gray-100">
            <h3 class="text-lg font-bold text-gray-900">Personal Information</h3>
            <p class="text-sm text-gray-500">Update your photo and personal details.</p>
        </div>

        <div class="space-y-6 max-w-lg">

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
                <div class="flex items-center gap-4">
                    <img v-if="form.avatarUrl" :src="form.avatarUrl"
                        class="w-16 h-16 rounded-full object-cover border border-gray-200">
                    <div v-else
                        class="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-xl">
                        {{ userStore.initials }}
                    </div>

                    <div class="flex-1">
                        <input v-model="form.avatarUrl" type="text" placeholder="https://..."
                            class="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500">
                        <p class="text-xs text-gray-500 mt-1">Paste an image URL (e.g. from LinkedIn or GitHub).</p>
                    </div>
                </div>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input v-model="form.fullName" type="text"
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 font-medium text-gray-800">
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input v-model="form.email" type="email" disabled
                    class="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-500 cursor-not-allowed">
            </div>

            <div class="pt-6 flex items-center justify-between">
                <SignOutButton
                    class="text-red-600 text-sm font-medium hover:text-red-800 flex items-center gap-2 transition" />

                <Button variant="primary" @click="save" :disabled="saving">
                    {{ saving ? 'Saving...' : 'Save Changes' }}
                </Button>
            </div>

        </div>
    </div>
</template>