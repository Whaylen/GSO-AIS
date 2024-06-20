<script setup>
import { ref, inject } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const api = inject('$api')
const par = ref(null)

async function fetchPar(){
    const response = await api.get(`/par/${route.params.id}`)
    par.value = response.data
}

fetchPar()
</script>

<template>
    <div class="flex flex-col gap-8 w-full">
        <router-link :to="{name: 'par'}">
            <TButton icon="left-arrow" label="Back to list" class="w-fit" />
        </router-link>
        <div class="flex items-center">
            <h2 class="font-bold text-2xl max-w-lg">{{ par?.article }}</h2>
            <h4 class="text-stone-500">#{{ par?.account_code }}</h4>
        </div>
        <div class="grid grid-cols-2 gap-5">
            <div class="flex flex-col">
                <div class="flex gap-3">
                    <span>Custodian: </span>
                    <span>{{ par?.custodian ?? 'None indicated.' }}</span>
                </div>
                <div class="flex gap-3">
                    <span>Date Acquired: </span>
                    <span>{{ par?.date_acquired ?? 'None indicated.' }}</span>
                </div>
                <div class="flex gap-3">
                    <span>Date Received: </span>
                    <span>{{ par?.date_received ?? 'None indicated.' }}</span>
                </div>
            </div>
            <div class="flex gap-3">
                <span>Responsibility Center: </span>
                <span>{{ par?.responsibility_center ?? 'None indicated.' }}</span>
            </div>
        </div>
        <table class="rounded-xl border">
            <tr>
                <td class="py-2.5 px-8">Brand Model</td>
                <td class="max-w-md">{{par?.brand_model}}</td>
            </tr>
            <tr>
                <td class="py-2.5 px-8">Unit Value</td>
                <td class="max-w-md">PHP {{par?.unit_value}}</td>
            </tr>
            <tr>
                <td class="py-2.5 px-8">Quantity</td>
                <td class="max-w-md">{{ par?.quantity }} {{par?.unit_of_measure}}</td>
            </tr>
        </table>
    </div>
</template>