<script setup lang="ts">
import { UserProfile } from '@clerk/vue'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
</script>

<template>
    <Card>
        <CardHeader class="border-b border-border pb-6">
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your photo, password, and personal details via Clerk.</CardDescription>
        </CardHeader>

        <CardContent class="py-6 flex items-center justify-center mx-auto">
            <UserProfile :appearance="{
                elements: {
                    rootBox: 'w-full',
                    card: 'shadow-none border-none w-full',
                    navbar: 'hidden', // Hide the top nav as we have our own
                    pageScrollBox: 'p-0',
                    headerTitle: 'hidden',
                    headerSubtitle: 'hidden',
                    profilePage__security: 'p-0',
                    profilePage__account: 'p-0'
                }
            }" />
        </CardContent>
    </Card>
</template>