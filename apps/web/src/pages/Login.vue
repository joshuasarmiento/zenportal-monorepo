<script setup lang="ts">
import { SignIn } from '@clerk/vue'
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full">
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-gray-900">Welcome Back</h1>
        <p class="text-gray-500">Sign in to manage your portal</p>
      </div>
      <div class="flex justify-center">
        <SignIn redirectUrl="/dashboard" signUpUrl="/signup" />
      </div>
    </div>
  </div>
</template>