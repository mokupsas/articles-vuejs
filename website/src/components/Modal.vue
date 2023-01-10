<template>

    <div class="modal is-active">
        <div class="modal-background"></div>
        <div class="modal-card">   

            <component :is="type" :authors="authors" :post="post" @acceptedModal="sendData" @closeModal="closeModal">
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
        post: { required: false }
    },
    data() {
        return {
            
        }
    },
    methods: {
        closeModal()
        {
            this.$emit('closeModal')
        },
        // Returns post id if edited or input object if created post
        getPostId() {
            if(typeof this.post !== 'undefined')
                return this.post.id;
            return null;
        },
        sendData(data) {
            let ret = this.makeData(data);
            this.$emit('acceptedModal', ret);
        },
        makeData(data) {
            // When creating, returns input object
            // ---
            // data.title
            // data.author
            // data.body
            if(this.type == 'create')
                return data;
            // When post editing or deleting, returns post id
            else
            {
               if(typeof this.post !== 'undefined')
                        return this.post.id;
            }

            return null;
        }
    }
}
</script>

<style></style>