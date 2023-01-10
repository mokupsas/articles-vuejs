<template>

    <div>
        <header class="modal-card-head">
            <p class="modal-card-title">
                <slot name="title">Delete post</slot>
            </p>
            <button button class="delete" aria-label="close" @click="closeModal"></button>
        </header>

        <section class="modal-card-body">

            <slot></slot>

            <p>Post will be deleted permenently</p>
        </section>

        <footer class="modal-card-foot">
            <button class="button is-success" @click="$emit('acceptedModal')">Delete</button>
            <button class="button" @click="closeModal">Close</button>
        </footer>
    </div>

</template>

<script>

export default {
    props: {
        authors: { required: true }
    },
    data() {
        return {
            title: null,
            body: null
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