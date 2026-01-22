<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useApi } from '../../lib/api'
import { useUserStore } from '../../stores/userStore'
import { SignOutButton } from '@clerk/vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Loader2, LogOut } from 'lucide-vue-next'
import ModeToggle from '@/components/ModeToggle.vue' // <--- 1. Import Component

const { fetchApi } = useApi()
const userStore = useUserStore()
const saving = ref(false)

const form = ref({
    fullName: '',
    email: '',
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
    <Card>
        <CardHeader class="border-b border-border pb-6">
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your photo and personal details.</CardDescription>
        </CardHeader>

        <CardContent class="space-y-6 pt-6 max-w-lg">

            <div class="space-y-2">
                <Label>Profile Photo</Label>
                <div class="flex items-center gap-4">
                    <Avatar class="h-16 w-16 border">
                        <AvatarImage :src="form.avatarUrl" />
                        <AvatarFallback class="bg-indigo-100 text-indigo-600 text-xl font-bold">
                            {{ userStore.initials }}
                        </AvatarFallback>
                    </Avatar>

                    <div class="flex-1 space-y-1">
                        <Input v-model="form.avatarUrl" placeholder="https://..." />
                        <p class="text-xs text-muted-foreground">Paste an image URL (e.g. from LinkedIn or GitHub).</p>
                    </div>
                </div>
            </div>

            <div class="space-y-2">
                <Label>Full Name</Label>
                <Input v-model="form.fullName" />
            </div>

            <div class="space-y-2">
                <Label>Email Address</Label>
                <Input v-model="form.email" disabled class="bg-muted text-muted-foreground" />
            </div>

            <div class="space-y-2">
                <Label>Theme Preference</Label>
                <div class="flex items-center gap-3">
                    <ModeToggle />
                    <span class="text-sm text-muted-foreground">Switch between light and dark mode.</span>
                </div>
            </div>

        </CardContent>

        <CardFooter class="border-t border-border pt-6 flex items-center justify-between">
            <SignOutButton>
                <Button variant="ghost" class="text-red-600 hover:text-red-700 hover:bg-red-50">
                    <LogOut class="mr-2 h-4 w-4" />
                    Sign Out
                </Button>
            </SignOutButton>

            <Button @click="save" :disabled="saving">
                <Loader2 v-if="saving" class="mr-2 h-4 w-4 animate-spin" />
                {{ saving ? 'Saving...' : 'Save Changes' }}
            </Button>
        </CardFooter>
    </Card>
</template>