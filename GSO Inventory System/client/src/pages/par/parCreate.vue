<script setup>
import { ref, inject, onMounted } from 'vue'

const api = inject('$api')

const PARForm = ref({
    scanned_documents: '',
    date_received: '',
    article: '',
    brand_model: '',
    particulars: '',
    responsibility_center: '',
    account_code: '',
    date_acquired: '',
    unit_value: 0,
    quantity: 0,
    total_value: 500,
    unit_of_measure: '',
    custodians: [
        {
            employee: '',
            par_number: '',
            serial_number: '',
            property_number: '',
            location: ''
        }
    ]
})


async function submit(){
    const response = await api.post('/par', PARForm.value)
    console.log(response.data)

}

//TODO:: Fix this shit
function removeCustodian(custodian){
    // const index = 
    // console.log(index)
    console.log(custodian)
    PARForm.value.custodians.splice(PARForm.value.custodians.indexOf(custodian), 1)
}

function addCustodian(){
    PARForm.value.custodians.push({
        employee: '',
        par_number: '',
        serial_number: '',
        property_number: '',
        location: ''
    })
}

</script>


<template>
    <div class="flex flex-col w-full">
        <div class="flex flex-col">
            <h3 class="text-2xl">ACKNOWLEDGEMENT RECEIPT OF EQUIPMENT REGISTRY</h3>
            <h5 class="text-stone-500">Registry of New ARE-Issued PPE</h5>
            <!-- <p class="text-sm text-stone-600 max-w-sm">Fill up the form below to register an new Acknowledgement Receipt of Equipment
                record.</p> -->
        </div>
        <!-- Main PAR form -->
        <div class="grid grid-cols-4 w-full p-5 gap-5">
            <!-- Scanned Documents -->
            <TInput v-model="PARForm.scanned_documents" label="Scanned Documents" type="file" />
            <TDate v-model="PARForm.date_received" label="Date Received" />
            <!-- Date Received -->
            <TInput v-model="PARForm.article" label="Article" />
            <TInput v-model="PARForm.brand_model" label="Brand/Model" />
            <TInput v-model="PARForm.particulars" label="Particulars" />
            <TInput v-model="PARForm.responsibility_center" label="Responsibility Center" />
            <TInput v-model="PARForm.account_code" label="Account Code" />
            <!-- Place Acquisition Date here -->
            <TDate v-model="PARForm.date_acquired" label="Date Acquired" />
            <TInput v-model="PARForm.unit_value" label="Unit Value" />
            <TInput v-model="PARForm.quantity" label="Quantity" />
            <TInput v-model="PARForm.total_value" label="Total Value" disabled />
            <TInput v-model="PARForm.unit_of_measure" label="Unit of Measure" />
        </div>

        <!-- Custodian Form -->
        <div class="flex flex-col">
            <div class="flex justify-end">
                <TButton @click="addCustodian" label="ADD" />
            </div>
            <div class="flex flex-col space-y-3">
                <div v-for="custodian in PARForm.custodians" class="grid grid-cols-11 w-full px-5 gap-5">
                    <!-- Scanned Documents -->
                    <TInput class="col-span-2" label="Custodian" type="file" />
                    <TDate class="col-span-2" label="ARE/MR Number" />
                    <!-- Date Received -->
                    <TInput class="col-span-2" label="Serial Number" />
                    <TInput class="col-span-2" label="Property Number" />
                    <TInput class="col-span-2" label="Location" />
                    <TButton icon="remove" iconClass="text-stone-950" @click="removeCustodian(custodian)"></TButton>
                </div>
            </div>
        </div>
        <div class="mt-6 flex items-center justify-end gap-x-6">
            <TButton @click="submit" label="Submit" class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white"/>
        </div>
    </div>
</template>