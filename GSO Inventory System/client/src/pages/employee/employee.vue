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
    <div class="flex flex-col w-full">
        <div class="flex flex-col">
            <h3 class="text-2xl">ACKNOWLEDGEMENT RECEIPT OF EQUIPMENT REGISTRY</h3>
            <h5 class="text-stone-500">Registry of New ARE-Issued PPE</h5>
            <!-- <p class="text-sm text-stone-600 max-w-sm">Fill up the form below to register an new Acknowledgement Receipt of Equipment
                record.</p> -->
        </div>

        <table>
            <thead>
                <th>Code</th>
                <th>Employee name</th>
                <th>Article</th>
                <th>Brand Model</th>
                <th>Particulars</th>
                <th>Responsibility Center</th>
                <th>Date acquired</th>
                <th>Date Recieved</th>
            </thead>
            <tbody>
                <tr @click="router.push()" v-for="par in pars">
                    <td>{{par.account_code}}</td>
                    <td>Feature not available</td>
                    <td>{{par.article}}</td>
                    <td>{{par.brand_model}}</td>
                    <td>{{par.particulars}}</td>
                    <td>{{par.responsibility_center}}</td>
                    <td>{{par.date_acquired}}</td>
                    <td>{{par.date_received}}</td>
                    <td>
                        <router-link :to="{name: 'par-show', params: {id: par.hash}}">
                            <TButton icon="visibility"></TButton>
                        </router-link>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>