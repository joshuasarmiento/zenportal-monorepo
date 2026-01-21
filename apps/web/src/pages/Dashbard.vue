<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useApi } from '../lib/api'
import { useRouter } from 'vue-router'

const router = useRouter()
const { fetchApi } = useApi()

const logs = ref<any[]>([])
const stats = ref({
    hoursThisMonth: 0,
    activeClients: 0,
    pendingBlockers: 0
})
const loading = ref(true)

// Fetch Data on Load
onMounted(async () => {
    try {
        // Run both fetches in parallel
        const [logsRes, statsRes] = await Promise.all([
            fetchApi('/logs'),
            fetchApi('/stats')
        ])
        logs.value = logsRes
        stats.value = statsRes
    } catch (err) {
        console.error(err)
    } finally {
        loading.value = false
    }
})

const navigateToLog = () => {
    router.push('/log/new')
}

// Navigate to single detail page
const viewLog = (id: string) => {
    router.push(`/log/${id}`)
}
</script>

<template>
    <div class="flex h-screen overflow-hidden font-inter bg-slate-50 text-gray-800">
        <main class="flex-1 flex flex-col overflow-y-auto">

            <header class="bg-white border-b border-gray-200 p-6 flex justify-between items-center sticky top-0 z-10">
                <h2 class="text-2xl font-bold text-gray-800">Dashboard</h2>
                <button @click="navigateToLog"
                    class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm flex items-center gap-2 transition">
                    <i class="ph ph-plus-circle text-lg"></i>
                    Log New Work
                </button>
            </header>

            <div class="p-8 max-w-6xl mx-auto w-full space-y-8">

                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="bg-white border border-gray-200 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] p-6 rounded-xl flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-500 font-medium">Total Hours</p>
                            <p class="text-3xl font-bold text-gray-900 mt-1">{{ stats.hoursThisMonth }} h</p>
                        </div>
                        <div class="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                            <i class="ph ph-clock text-2xl"></i>
                        </div>
                    </div>
                    <div class="bg-white border border-gray-200 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] p-6 rounded-xl flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-500 font-medium">Active Clients</p>
                            <p class="text-3xl font-bold text-gray-900 mt-1">{{ stats.activeClients }}</p>
                        </div>
                        <div class="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                            <i class="ph ph-briefcase text-2xl"></i>
                        </div>
                    </div>
                    <div class="bg-white border border-gray-200 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] p-6 rounded-xl flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-500 font-medium">Total Blockers</p>
                            <p class="text-3xl font-bold text-red-600 mt-1">{{ stats.pendingBlockers }}</p>
                        </div>
                        <div class="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-600">
                            <i class="ph ph-warning-circle text-2xl"></i>
                        </div>
                    </div>
                </div>

                <div>
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-bold text-gray-800">Recent Proof of Work</h3>
                    </div>

                    <div v-if="loading" class="text-center py-20 bg-white rounded-xl border border-gray-200">
                        <div class="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p class="text-gray-400">Loading your data...</p>
                    </div>

                    <div v-else-if="logs.length === 0" class="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                        <div class="text-4xl mb-3">📝</div>
                        <h3 class="text-lg font-bold text-gray-900">No work logged yet</h3>
                        <p class="text-gray-500 mb-6">Create your first entry to impress your client.</p>
                    </div>

                    <div v-else class="bg-white border border-gray-200 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] rounded-xl overflow-hidden">
                        <table class="w-full text-left border-collapse">
                            <thead class="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th class="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                                    <th class="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Client</th>
                                    <th class="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wide w-1/3">Summary</th>
                                    <th class="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Evidence</th>
                                    <th class="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                                    <th class="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wide"></th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-100">
                                <tr 
                                    v-for="log in logs" 
                                    :key="log.id" 
                                    @click="viewLog(log.id)"
                                    class="hover:bg-gray-50 transition cursor-pointer group"
                                    :class="{ 'bg-red-50/30': log.isBlocked }"
                                >
                                    <td class="p-4 text-sm text-gray-600">{{ log.date }}</td>
                                    <td class="p-4">
                                        <span class="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-md font-semibold">
                                            {{ log.client?.companyName || 'Unknown' }}
                                        </span>
                                    </td>
                                    <td class="p-4 text-sm text-gray-800 font-medium truncate max-w-50">{{ log.summary }}</td>

                                    <td class="p-4">
                                        <div class="flex flex-col gap-1 items-start">
                                            <span v-if="log.videoUrl" class="flex items-center gap-1.5 text-blue-600 text-xs font-semibold">
                                                <i class="ph ph-video-camera text-sm"></i> Loom
                                            </span>
                                            <span v-if="log.attachmentUrl" class="flex items-center gap-1.5 text-indigo-600 text-xs font-semibold">
                                                <i class="ph ph-paperclip text-sm"></i> File
                                            </span>
                                            <span v-if="!log.videoUrl && !log.attachmentUrl" class="text-gray-400 text-xs">No evidence</span>
                                        </div>
                                    </td>
                                    <td class="p-4">
                                        <span v-if="log.isBlocked" class="flex items-center gap-1 text-red-600 text-xs font-bold bg-red-100 px-2 py-1 rounded-full w-fit">
                                            <i class="ph ph-warning"></i> Blocked
                                        </span>
                                        <span v-else class="flex items-center gap-1 text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded-full w-fit">
                                            <div class="w-2 h-2 rounded-full bg-green-500"></div> Done
                                        </span>
                                    </td>
                                    <td class="p-4 text-right">
                                        <i class="ph ph-caret-right text-gray-400 group-hover:text-blue-600 transition"></i>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </main>
    </div>
</template>