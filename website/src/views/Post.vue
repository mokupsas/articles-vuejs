<template>

    <div class="columns mt-6">
        <div class="column is-three-quarters">
            <message v-if="postFound == false" :close="0" type="is-danger">Post not found</message>

            <modal v-if="modalShow" @acceptedModal="acceptedModal()" @closeModal="showModal(false)" :acptBtn="modalAcptText">
                <template slot="title">{{ modalTitle }}</template>
            
                <message :type="msgType" close="1" v-show="msgShow" @closeMessage="showMessage(false)">{{ msgText }}</message>       

                <div v-if="this.modalType === 0">Post will be deleted permenently</div>
                <div v-if="this.modalType === 1">

                    <input class="input mb-3" type="text" placeholder="Title" v-model="post.title" :text="post.title">
                    <div class="select mb-3">
                        <select v-model="post.author">
                            <option disabled value="">Select author</option>
                            <option>Alex</option>
                            <option>Bob</option>
                        </select>
                    </div>
                    <textarea class="textarea" placeholder="Body" v-model="post.body" :text="post.body"></textarea>

                </div>
            </modal>

            <h1 class="title">{{ post.title }}</h1>
            <p class="subtitle is-6">
                <div v-if="this.post.id">{{ displayDate(post) }} by {{ post.author }}</div>
            </p>

            <hr/>

            <p>
                {{ post.body }}
            </p>
        </div>
        <div v-if="this.post.id" class="column">
            <label class="label">Actions</label>
                <ul>
                    <li><a href="#" onclick="return false;" @click="openEdit()">Edit</a></li>
                    <li><a href="#" onclick="return false;" @click="openDelete()">Delete</a></li>
                </ul>  
        </div>

    </div>

</template>

<script>
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
            modalTitle: null,
            // Types:
            // 0 - delete
            // 1 - edit
            modalType: null,
            modalAcptText: null,

            // Modal message
            msgShow: false,
            msgType: null,    // bulma css style
            msgText: null,

            // Post data
            postFound: true,
            post: {
                /* id: 1,
                title: 'Title1',
                author: 'Author',
                body: 'Text goes here',
                created_at: new Date('2022-12-12 05:00:00'.replace(/-/g,"/")),
                updated_at: new Date('2022-12-19 06:00:00'.replace(/-/g,"/")) */
            }
        };
    },

    methods: {
        showModal(show, title, type, acptText) {
            if(!show)
            {
                this.modalShow = false;
                this.showMessage(false);
                this.fetchId = null;
                return 0; 
            }

            this.modalShow = true
            this.modalTitle = title;
            this.modalType = type;
            this.modalAcptText = acptText;
        },
        showMessage(show, text, style) {
            if(!show)
            {
                this.msgShow = false;
                return 0; 
            }

            this.msgShow = true;
            this.msgType = style; 
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
            this.showModal(true, 'Create post', 1, 'Edit');
        },
        openDelete() {
            this.showModal(true, 'Delete post', 0, 'Delete');
        },
        acceptedModal() {
            // If we delete post
            if(this.modalType === 0)
            {
                this.deletePost(this.post.id);
            }
            // If we edit post
            else
            {
                this.editPost(this.post.id, this.post.title, this.post.author, this.post.body, this.post.created_at);
            }
        },
        async deletePost(id) {
            let res = await API.delete(Constants.URL_ARTICLES+"/"+id);

            if(!res)
                this.showMessage(true, 'Problem occurred', 'is-warning');
            else
                this.showMessage(true, 'Successfully deleted post', 'is-success');
        },
        async editPost(id, title, author, body, created_at) {
            if(!this.checkInput(title, author, body))
                return 0;

            let dater = new DateFormater(new Date);
            let json = JsonBuilder.getArticleJson(title, body, author, created_at, dater.regularFormat());

            let res = await API.put(Constants.URL_ARTICLES+"/"+id, json);

            if(!res)
                this.showMessage(true, 'Problem occurred', 'is-warning');
            else
                this.showMessage(true, 'Successfully deleted post', 'is-success');
        },
        checkInput(title, author, body) {
            if(!title || !author || !body )
            {
                this.showMessage(true, 'You must fill all fields', 'is-warning');
                return false;
            }
            return true;
        },
        async getPost(id) {
            let res = await API.get(Constants.URL_ARTICLES+"/"+id);

            if(res)
                this.post = res.data;
            else
                this.postFound = false;
        }
    },
    mounted() {
        this.getPost(this.$route.params.id);
    }
}
</script>

<style>
</style>