<script setup>
import { ref, inject } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const api = inject('$api')
const par = ref(null)

async function fetchPar() {
    const response = await api.get(`/par/${route.params.id}`)
    par.value = response.data
    PARForm.defaults({
        article:response.data.article,
        date_received:response.data.date_received,
        brand_model:response.data.brand_model,
        particulars:response.data.particulars,
        responsibility_center:response.data.responsibility_center,
        account_code:response.data.account_code,
        date_acquired:response.data.date_acquired,
        unit_value:response.data.unit_value,
        quantity:response.data.quantity,
        total_value:response.data.total_value,
        unit_of_measure:response.data.unit_of_measure
    })
    PARForm.reset()
}

async function submit(){
    await PARForm.validate()
    console.log("Form Errors: ", PARForm.hasErrors)
    if(!PARForm.hasErrors){
        const response = await PARForm.submit('patch', `/par/${route.params.id}`)
        if(response.status == 200){
            await fetchPar()
        }
    }
}

await fetchPar()
</script>
<template>
    <div v-if="par" class="p-12">
        <div class="grid grid-cols-2">
            <Component :is="PARForm.meta[field]?.component ?? 'TInput'"
                v-for="(value, field) in PARForm.data()" v-model="PARForm[field]"
                :label="PARForm.meta[field]?.label ?? Helpers.snakeToHuman(field)"
                :type="PARForm.meta[field]?.type ?? 'text'"
                :error="Boolean(PARForm.errors[field])" :errorMessage="PARForm.errors[field]"
                :hint="PARForm.meta[field]?.hint ?? ''"
                v-bind="PARForm.meta[field]?.bindings">
            </Component>
            <button v-if="PARForm.isDirty" @click="submit" type="button">Save</button>
        </div>
    </div>
</template>