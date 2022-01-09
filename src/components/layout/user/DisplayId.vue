<template>
    <div v-if="!!user.user_provider">
        <v-tooptip top>
            <template v-slot:activator="{ on, attrs }">
                <span v-on="on" v-bind="attrs">
                    <v-icon left small>mdi-account-network</v-icon>
                    {{ user.user_provider.toUpperCase() }}
                </span>
            </template>
            <span>{{ user.user_id }}</span>
        </v-tooptip>
    </div>
    <div v-else>
        {{ user.user_id }}
    </div>
</template>

<script>
export default {
    name : "DisplayId",
    props : {
        user : {
            type : Object,
            required : true
        }
    }
}
</script>

<style>

</style>