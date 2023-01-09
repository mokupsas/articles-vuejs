<template>

    <div class="modal is-active">
        <div class="modal-background"></div>
        <div class="modal-card">   

            <component :is="type" :authors="authors" :post="post" @closeModal="closeModal">
                <slot></slot>
            </component>

        </div>
    </div>

</template>

<script>
// Components
import CreatePost from './modalcontent/CreatePost'
import DeletePost from './modalcontent/DeletePost'
import EditPost from './modalcontent/EditPost'

export default {
    components: {
        'create': CreatePost,
        'delete': DeletePost,
        'edit': EditPost,
    },
    name: "Modal",
    props: {
        type: { required: true },
        authors: { required: true },
        post: { default: {} }
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