<template>

    <div>
        <header class="modal-card-head">
            <p class="modal-card-title">
                <slot name="title">Edit post</slot>
            </p>
            <button button class="delete" aria-label="close" @click="closeModal"></button>
        </header>

        <section class="modal-card-body">
    
            <slot></slot>

            <input class="input mb-3" type="text" placeholder="Title" v-model="post.title">
            <div class="select mb-3">
                <select v-model="post.author">
                    <option selected disabled value="">Select author</option>
                    <option v-for="author in authors">{{ author.name }}</option>
                </select>
            </div>
            <textarea class="textarea" placeholder="Body">{{ post.body }}</textarea>

        </section>

        <footer class="modal-card-foot">
            <button class="button is-success" @click="$emit('acceptedModal')">Edit</button>
            <button class="button" @click="closeModal">Close</button>
        </footer>
    </div>

</template>

<script>

export default {
    props: {
        authors: { required: true },
        post: { default: null }
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