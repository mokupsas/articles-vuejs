<template>

    <div class="columns mt-6">
        <div class="column is-three-quarters">
            <message v-show="msgShow && msgLocation == 0" :type="msgStyle" :close="0" @closeMessage="showMessage(false)">{{ msgText }}</message>

            <modal v-if="modalShow" :type="modalType" :authors="authors" :post="modalPost" @acceptedModal="acceptedModal" @closeModal="showModal(false)">
                <message v-show="msgShow && msgLocation == 1" :type="msgStyle" close="1" @closeMessage="showMessage(false)">{{ msgText }}</message>
            </modal>

            <h1 class="title">{{ post.title }}</h1>
            <p class="subtitle is-6">
                <div v-if="!error">{{ displayDate(post) }} by {{ post.author }}</div>
            </p>

            <hr/>

            <p>
                {{ post.body }}
            </p>
        </div>
        <div v-if="!error" class="column">
            <label class="label">Actions</label>
                <ul>
                    <li><a href="#" onclick="return false;" @click="openEdit()">Edit</a></li>
                    <li><a href="#" onclick="return false;" @click="openDelete()">Delete</a></li>
                </ul>  
        </div>

    </div>

</template>

<script>
import router from '../routes'
import * as Constants  from '../constants'
// Classes
import API from '../classes/API'
import JsonBuilder from '../classes/JsonBuilder'
import DateFormater from '../classes/DateFormater'
// Components
import Modal from '../components/Modal'
import Message from './../components/Message'

export default {
    components: { Modal, Message },
    data() {
        return {
            // Modal
            modalShow: false,
            // Types:
            // create
            // delete
            // edit
            modalType: null,
            modalPost: null,    // post to display data inside modal

            // Modal message
            msgShow: false,
            msgStyle: null,    // bulma css style
            // Locations:
            // 0 - inside page
            // 1 - inside modal
            msgLocation: null,
            msgText: null,

            // Post data
            post: {
                /* id: 1,
                title: 'Title1',
                author: 'Author',
                body: 'Text goes here',
                created_at: new Date('2022-12-12 05:00:00'.replace(/-/g,"/")),
                updated_at: new Date('2022-12-19 06:00:00'.replace(/-/g,"/")) */
            },
            error: false,

            // Authors
            authors: {
               /* id:
                name:
                created_at:
                updated_at: */
            },
        };
    },

    methods: {
        showModal(show, type, post) {
            if(!show)
            {
                this.modalShow = false;
                if(this.msgLocation == 1)
                    this.showMessage(false);
                return 0; 
            }

            this.modalShow = true
            this.modalType = type;
            this.modalPost = post;
        },
        showMessage(show, text, loc, style) {
            if(!show)
            {
                this.msgShow = false;
                return 0; 
            }

            this.msgShow = true;
            this.msgLocation = loc; 
            this.msgStyle = style; 
            this.msgText = text;
        },
        displayDate(post) {
            if (post.updated_at > post.created_at)
            {
                return `Edited at ${post.updated_at}`;
            }
            return `Posted at ${post.created_at}`;
        },
        openEdit() {
            this.showModal(true, 'edit', this.post);
        },
        openDelete() {
            this.showModal(true, 'delete', this.post);
        },
        acceptedModal(data) {
            // If we delete post
            if(this.modalType == 'delete')
            {
                this.deletePost(this.post.id);
            }
            // If we edit post
            else
            {
                this.editPost(data.id, data.title, data.author, data.body, data.created_at);
            }
        },
        async deletePost(id) {
            let res = await API.delete(Constants.URL_ARTICLES+"/"+id);

            if(res)
            {
                this.showMessage(true, 'Successfully deleted post', 0, 'is-success');
                this.showModal(false);

                // Redirecting to home page
                router.push({ name: 'Home', });
            }
            else
                this.showMessage(true, 'Problem occurred', 1, 'is-warning');
        },
        async editPost(id, title, author, body, created_at) {
            if(!this.checkInput(title, author, body))
                return 0;

            let dater = new DateFormater(new Date);
            let json = JsonBuilder.getArticleJson(title, body, author, created_at, dater.regularFormat());

            let res = await API.put(Constants.URL_ARTICLES+"/"+id, json);

            if(res)
            {
                this.post = json;
                this.post.id = id;  // json doesnt have ID, so we add manually

                this.showMessage(true, 'Successfully edited post', 0, 'is-success');
                this.showModal(false);
            }
            else
                this.showMessage(true, 'Problem occurred', 1, 'is-warning');
        },
        checkInput(title, author, body) {
            if(!title || !author || !body )
            {
                this.showMessage(true, 'You must fill all fields', 1, 'is-warning');
                return false;
            }
            return true;
        },
        async getPost(id) {
            let res = await API.get(Constants.URL_ARTICLES+"/"+id);

            if(res)
               return res.data;
            else if(!res)
                this.error = true;

            return [];
        },
        async getAuthors() {
            let res = await API.get(Constants.URL_AUTHORS);

            if(res)
                return res.data;
            return false;
        },
    },
    async mounted() {
        let post_id = this.$route.params.id;
        // Getting authors
        this.authors = await this.getAuthors();
        // Getting current post
        this.post = await this.getPost(post_id); 

        if(!this.post.id && this.error)
            this.showMessage(true, 'Problem occurred', 0, 'is-danger');
        else if(!this.post.id)
        {
            this.showMessage(true, 'No posts found', 0, 'is-warning');
        }
    }
}
</script>

<style>
</style>