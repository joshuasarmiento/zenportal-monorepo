<script setup lang="ts">
import { ref } from "vue"
import type { HTMLAttributes } from "vue"

import { Zap, Loader2 } from "lucide-vue-next"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"

const props = defineProps<{
  class?: HTMLAttributes["class"]
  email?: string
  isLoading?: boolean
}>()

const emit = defineEmits<{
  (e: 'verify', code: string): void
  (e: 'resend'): void
  (e: 'back'): void
}>()

const otpValue = ref('')

const handleSubmit = (e: Event) => {
  e.preventDefault()
  if (otpValue.value.length === 6) {
    emit('verify', otpValue.value)
  }
}
</script>

<template>
  <div :class="cn('flex flex-col gap-6', props.class)">
    <form @submit="handleSubmit">
      <FieldGroup>
        <div class="flex flex-col items-center gap-2 text-center">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900">
            <Zap class="size-5 fill-current" />
          </div>
          <h1 class="text-xl font-bold">
            Verify Identity
          </h1>
          <FieldDescription>
            Enter the 6-digit code sent to <br> <span class="font-medium text-zinc-900 dark:text-white">{{ email || 'your email' }}</span>
          </FieldDescription>
        </div>
        <Field>
          <FieldLabel for="otp" class="sr-only">
            Verification code
          </FieldLabel>
          <InputOTP
            id="otp"
            v-model="otpValue"
            :maxlength="6"
            required
            container-class="justify-center gap-2"
          >
            <InputOTPGroup>
              <InputOTPSlot :index="0" class="h-12 w-10 text-lg md:h-14 md:w-12 md:text-xl" />
              <InputOTPSlot :index="1" class="h-12 w-10 text-lg md:h-14 md:w-12 md:text-xl" />
              <InputOTPSlot :index="2" class="h-12 w-10 text-lg md:h-14 md:w-12 md:text-xl" />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot :index="3" class="h-12 w-10 text-lg md:h-14 md:w-12 md:text-xl" />
              <InputOTPSlot :index="4" class="h-12 w-10 text-lg md:h-14 md:w-12 md:text-xl" />
              <InputOTPSlot :index="5" class="h-12 w-10 text-lg md:h-14 md:w-12 md:text-xl" />
            </InputOTPGroup>
          </InputOTP>
          <div class="text-center text-sm">
            <button type="button" @click="emit('resend')" class="underline underline-offset-4 hover:text-zinc-900 dark:hover:text-white">Resend code</button>
            <span class="mx-2 text-zinc-300">|</span>
            <button type="button" @click="emit('back')" class="underline underline-offset-4 hover:text-zinc-900 dark:hover:text-white">Change email</button>
          </div>
        </Field>
        <Field>
          <Button type="submit" class="w-full" :disabled="isLoading">
            <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
            Verify
          </Button>
        </Field>
      </FieldGroup>
    </form>
    <FieldDescription class="px-6 text-center text-xs">
      By clicking verify, you agree to our <a href="/terms" class="underline hover:text-zinc-900 dark:hover:text-white">Terms of Service</a>
      and <a href="/privacy-policy" class="underline hover:text-zinc-900 dark:hover:text-white">Privacy Policy</a>.
    </FieldDescription>
  </div>
</template>
