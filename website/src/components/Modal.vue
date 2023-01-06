<template>

    <div class="modal is-active">
        <div class="modal-background"></div>
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">
                    <slot name="title"></slot>
                </p>
                <button button class="delete" aria-label="close" @click="closeModal"></button>
            </header>
            <section class="modal-card-body">
                <slot></slot>
            </section>
            <footer class="modal-card-foot">
                <button class="button is-success" @click="$emit('acceptedModal')">{{ this.acptBtn }}</button>
                <button class="button" @click="closeModal">{{ this.cnclBtn }}</button>
            </footer>
        </div>
    </div>

</template>

<script>
export default {
    name: "Modal",
    props: {
        acptBtn: {
            type: String,
            default: "Save changes"
        },
        cnclBtn: {
            type: String,
            default: "Cancel"
        }
    },
    data() {
        return {
            
        }
    },
    methods: {
        closeModal()
        {
            this.$emit('closeModal')
        }
    }
}
</script>

<style></style>