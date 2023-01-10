<template>

    <div>
        <header class="modal-card-head">
            <p class="modal-card-title">
                <slot name="title">Create post</slot>
            </p>
            <button button class="delete" aria-label="close" @click="closeModal"></button>
        </header>

        <section class="modal-card-body">

            <slot></slot>

            <input class="input mb-3" type="text" placeholder="Title" v-model="title">
            <div class="select mb-3">
                <select v-model="author">
                    <option selected disabled value="">Select author</option>
                    <option v-for="author in authors">{{ author.name }}</option>
                </select>
            </div>
            <textarea class="textarea" placeholder="Body" v-model="body"></textarea>

        </section>

        <footer class="modal-card-foot">
            <button class="button is-success" @click="$emit('acceptedModal', getPostData())">Create</button>
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
            body: null,
            author: ""
        }
    },
    methods: {
        closeModal()
        {
            this.$emit('closeModal')
        },
        // Creates object with inputed data
        getPostData() {
            return {
                title: this.title,
                body: this.body,
                author: this.author
            }
        }
    }
}
</script>

<style></style>