<script setup>
import { ref, inject, readonly } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const api = inject('$api')
const par = ref(null)
const isEditing = ref(false)

async function fetchPar() {
    const response = await api.get(`/par/${route.params.id}`)
    par.value = response.data
}

async function saveFields() {
    try {
        const response = await api.patch(`/par/${route.params.id}`, par.value)
        par.value = response.data
        isEditing.value = false
    } catch (error) {
        console.error('Failed to save fields:', error)
    }
}

fetchPar()
</script>

<template>
    <div class="flex flex-col gap-8 w-full">
        <router-link :to="{ name: 'par' }">
            <div class="mt-6 flex items-center justify-left">
                <TButton label="Back" class="rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white" />
            </div>
        </router-link>
        <!-- <div class="flex items-center">
            <h2 class="font-bold text-2xl max-w-lg">{{ par?.article }}</h2>
            <h4 class="text-stone-500"># {{ par?.account_code }}</h4>
        </div> -->
        <div class="grid grid-cols-2 gap-5">
            <!-- Left Column -->
            <div class="flex flex-col">
                <div class="flex gap-8 p-3">
                    <span class="font-bold p-4">Custodian:</span>
                    <TInput v-model="par.custodian" :readonly="!isEditing"/>
                </div>
                <div class="flex gap-7">
                    <span class="font-bold p-4">Department:</span>
                    <TInput v-model="par.responsibility_center" :readonly="!isEditing"/>
                </div>
            </div>

            <!-- Right Column -->
            <div class="flex flex-col">
                <div class="flex gap-12 items-end p-3">
                    <span class="font-bold p-4">ARE No.:</span>
                    <TInput v-model="par.are_number" :readonly="!isEditing"/>
                </div>
                <div class="flex gap-4 items-end">
                    <span class="font-bold p-4">Account Code:</span>
                    <TInput v-model="par.account_code" :readonly="!isEditing"/>
                </div>
            </div>
        </div>
        <table class="w-full text-md bg-white shadow-md border border-gray-300 px-4 py-2">

            <colgroup>
                <col style="width: 5%;">
                <col style="width: 5%;">
                <col style="width: 20%;">
                <col style="width: 10%;">
                <col style="width: 15%;">
                <col style="width: 10%;">
                <col style="width: 15%;">
            </colgroup>
            <tr>
                <th class="border border-gray-300 px-3 py-2">Quantity</th>
                <th class="border border-gray-300 px-4 py-2">Unit</th>
                <th class="border border-gray-300 px-4 py-2">Name and Description</th>
                <th class="border border-gray-300 px-4 py-2">Date Acquired</th>
                <th class="border border-gray-300 px-4 py-2">Property No.</th>
                <th class="border border-gray-300 px-4 py-2">Unit Value</th>
                <th class="border border-gray-300 px-4 py-2">Total Value</th>
            </tr>
            <tr>
                <td class="border border-gray-300 px-4 py-2">
                    <input class="text-center" type="text" v-model="par.quantity" :readonly="!isEditing"   >
                </td>
                <td class="border border-gray-300 px-4 py-2">
                    <input class="text-center" v-model="par.unit_of_measure" :readonly="!isEditing">
                </td>
                <td class="border border-gray-300 px-4 py-2">
                    <input v-model="par.article" :readonly="!isEditing">
                    <span>Brand/Model: </span>
                        <input class="text-center" v-model="par.brand_model" :readonly="!isEditing">
                    <span>Description: </span>
                        <TTextArea class="text-center" v-model="par.particulars" :readonly="!isEditing"/>
                </td>
                <td class="border border-gray-300 px-4 py-2">
                    <TDate class="text-center" v-model="par.date_acquired" :readonly="!isEditing"/>
                </td>
                <td class="border border-gray-300 px-4 py-2">
                    <input class="text-center" v-model="par.property_no" :readonly="!isEditing">
                </td>
                <td class="border border-gray-300 px-4 py-2">
                    <input class="text-center" v-model="par.unit_value":readonly="!isEditing"  >
                </td>
                <td class="border border-gray-300 px-4 py-2">
                    <input class="text-center" v-model="par.total_value":readonly="!isEditing" >
                </td>
            </tr>
            <!-- <tr>
                <td class="py-2.5 px-8">Brand Model</td>
                <td class="max-w-md">
                    <input v-model="par.brand_model" type="text" :readonly="!isEditing"/>
                </td>
            </tr> -->
            <!-- <tr>
                <td class="py-2.5 px-8">Unit Value</td>
                <td class="max-w-md">
                    <input v-model="par.unit_value" type="number" step="0.01" :readonly="!isEditing"/>
                </td>
            </tr> -->
            <!-- <tr>
                <td class="py-2.5 px-8">Quantity</td>
                <td class="max-w-md">
                    <input v-model="par.quantity" type="number" step="1" :readonly="!isEditing"/>
                </td>
            </tr> -->
        </table>
        <div class="mt-6 flex items-center justify-center">
            <button v-if="!isEditing" @click="isEditing = true" class="rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white">Edit</button>
            <button v-else @click="saveFields" class="rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white">Save</button>
            <button v-if="isEditing" @click="isEditing = false" class="rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white">Cancel</button>
        </div>
    </div>
</template>

<style>
    .border {
        border: 1px solid #ccc;
        border-radius: 4px;
        padding: 5px;
    }
</style>