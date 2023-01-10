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

            <input class="input mb-3" type="text" placeholder="Title" v-model="title">
            <div class="select mb-3">
                <select v-model="author">
                    <option selected disabled value="">Select author</option>
                    <option v-for="author in authors">{{ author.name }}</option>
                </select>
            </div>
            <textarea class="textarea" placeholder="Body" v-model="body">{{ body }}</textarea>

        </section>

        <footer class="modal-card-foot">
            <button class="button is-success" @click="$emit('acceptedModal', getPostData())">Edit</button>
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
    data() {
        return {
            id: this.post.id,
            title: this.post.title,
            body: this.post.body,
            author: this.post.author,
            created_at: this.post.created_at,
            updated_at: this.post.updated_at
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
                id: this.post.id,
                title: this.title,
                body: this.body,
                author: this.author,
                created_at: this.created_at,
                updated_at: this.updated_at
            }
        }
    }
}
</script>

<style></style>