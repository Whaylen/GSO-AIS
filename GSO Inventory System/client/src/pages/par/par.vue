<script setup>
import { ref, inject } from 'vue'
import { useRouter } from 'vue-router';

const api = inject('$api')
const pars = ref([])
const router = useRouter()

async function fetchPars(){
    const response = await api.get('/par')
    pars.value = response.data
}

fetchPars()
</script>

<template>
    <div class="flex flex-col w-full p-4">
        <div class="mb-4">
            <h3 class="text-2xl font-semibold">ACKNOWLEDGEMENT RECEIPT OF EQUIPMENT REGISTRY</h3>
            <h5 class="text-stone-500">Registry of New ARE-Issued PPE</h5>
        </div>

        <div class="overflow-x-auto">
            <table class="table-auto w-full border-collapse border border-gray-300">
                <thead class="bg-gray-100">
                    <tr>
                        <th class="border border-gray-300 px-4 py-2">Account Code</th>
                        <th class="border border-gray-300 px-4 py-2">Employee Name</th>
                        <th class="border border-gray-300 px-4 py-2">Article</th>
                        <!-- <th class="border border-gray-300 px-4 py-2">Brand Model</th>
                        <th class="border border-gray-300 px-4 py-2">Particulars</th> -->
                        <th class="border border-gray-300 px-4 py-2">Responsibility Center</th>
                        <th class="border border-gray-300 px-4 py-2">Date Acquired</th>
                        <!-- <th class="border border-gray-300 px-4 py-2">Date Received</th> -->
                        <th class="border border-gray-300 px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr @click="router.push()" v-for="par in pars">
                        <td class="border border-gray-300 px-4 py-2">{{ par.account_code }}</td>
                        <td class="border border-gray-300 px-4 py-2 whitespace-nowrap">Feature not available</td>
                        <td class="border border-gray-300 px-4 py-2">
                            <div class="font-bold">{{ par.article }} {{ par.brand_model }}</div>
                            <div class="pl-4">{{ par.particulars }}</div>
                        </td>
                        <!-- <td class="border border-gray-300 px-4 py-2">{{ par.brand_model }}</td>
                        <td class="border border-gray-300 px-4 py-2">{{ par.particulars }}</td> -->
                        <td class="border border-gray-300 px-4 py-2 whitespace-nowrap">{{ par.responsibility_center }}</td>
                        <td class="border border-gray-300 px-4 py-2">{{ par.date_acquired }}</td>
                        <!-- <td class="border border-gray-300 px-4 py-2">{{ par.date_received }}</td> -->
                        <td class="border border-gray-300 px-4 py-2">
                            <router-link :to="{ name: 'par-show', params: { id: par.hash } }">
                                <TButton icon="visibility"></TButton>
                            </router-link>
                            <!-- <router-link :to="{name: 'par-update', params:{id:par.hash}}">
                                <TButton icon="edit"></TButton>
                            </router-link> -->
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>