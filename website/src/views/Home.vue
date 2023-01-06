<template>

    <div class="columns mt-6">
        <div class="column is-three-quarters">
            <h1 class="title">Posts</h1>
            <hr/>

            <post-preview @totalPages="setTotalPages" @openModalEdit="openEdit" @openModalDelete="openDelete"></post-preview>

            <pagination :current="page" :pages="totalPages"></pagination>

            <modal v-if="modalShow" @acceptedModal="acceptedModal()" @closeModal="showModal(false)" :acptBtn="modalAcptText">
                <template slot="title">{{ modalTitle }}</template>
            
                <message :type="moMsgType" close="1" v-show="moShowMsg" @closeMessage="showMessage(false)">{{ moMsgText }}</message>       

                <div v-if="this.modalType === 0">Post will be deleted permenently</div>
                <div v-if="this.modalType === 1">

                    <input class="input mb-3" type="text" placeholder="Title" v-model="post.title" :text="post.title">
                    <div class="select mb-3">
                        <select v-model="post.author">
                            <option disabled value="">Select author</option>
                            <option v-for="author in authors">{{ author.name }}</option>
                        </select>
                    </div>
                    <textarea class="textarea" placeholder="Body" v-model="post.body" :text="post.body"></textarea>

                </div>
                <div v-if="this.modalType === 2">

                    <input class="input mb-3" type="text" placeholder="Title" v-model="title" :text="title">
                    <div class="select mb-3">
                        <select v-model="author">
                            <option selected disabled value="">Select author</option>
                            <option v-for="author in authors">{{ author.name }}</option>
                        </select>
                    </div>
                    <textarea class="textarea" placeholder="Body" v-model="body" :text="body"></textarea>

                </div>
            </modal>
        </div>

        <div class="column">

            <a class="button is-primary mb-5" @click="openCreate()">
              <strong>Create post</strong>
            </a>

            <div class="field mb-5">
                <label class="label">Search</label>
                <div class="control mb-2">
                    <input class="input" type="text" placeholder="Text input" v-model="searchText">
                </div>
                <button class="button" @click="search">Search</button>
            </div>

            <label class="label">Authors</label>
            <ul>
                <li v-for="author in authors">
                    <p>{{ author.name }}</p>
                </li>
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
import Modal from './../components/Modal'
import Message from './../components/Message'
import PostPreview from './../components/PostPreview'
import Pagination from './../components/Pagination'

export default {
    components: { Modal, Message, Pagination, PostPreview },
    data() {
        return {
            // Modal
            modalShow: false,
            modalTitle: null,
            // Types:
            // 0 - delete
            // 1 - edit
            // 2 - create
            modalType: null,
            modalAcptText: null,

            // Modal message
            moShowMsg: false,
            moMsgType: null,    // bulma css style
            moMsgText: null,

            // Create post form
            title: '',
            author: '',
            body: '',

            // Edit or delete post ID
            fetchId: null,

            // Post data to edit
            post: {
                /* id: 1,
                title: 'Title1',
                author: 'Author',
                body: 'Text goes here',
                created_at: '2022-12-12 05:00:00',
                updated_at: '2022-12-19 06:00:00' */
            },

            // Authors
            authors: {
               /* id:
                name:
                created_at:
                updated_at: */
            },

            // Post/article data
            page: this.$route.params.page ? this.$route.params.page:1,
            totalPages: 1,
            perPage: 2,

            // Search
            searchText: null
        }
    },
    methods: {
        setTotalPages(pages) {
            this.totalPages = pages;
        },
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
                this.moShowMsg = false;
                return 0; 
            }

            this.moShowMsg = true;
            this.moMsgType = style; 
            this.moMsgText = text;
        },
        openCreate() {
            this.showModal(true, 'Create post', 2, 'Create');
        },
        async openEdit(id) {
            this.showModal(true, 'Edit post', 1, 'Edit');
            this.fetchId = id;

            // Fetching post data into input
            let res = await API.get(Constants.URL_ARTICLES+"/"+this.fetchId);
            this.post = res.data;
        },
        openDelete(id) {
            this.showModal(true, 'Delete post', 0, 'Delete');
            this.fetchId = id;
        },
        acceptedModal() {
            // If we delete post
            if(this.modalType === 0)
            {
                this.deletePost(this.fetchId);
            }
            // If we edit post
            else if(this.modalType === 1)
            {
                this.editPost(this.post.id, this.post.title, this.post.author, this.post.body, this.post.created_at);
            }
            // If we create post
            else
                this.createPost(this.title, this.author, this.body);     
        },
        async createPost(title, author, body) {
            if(!this.checkInput(title, author, body))
                return 0;

            let dater = new DateFormater();
            let json = JsonBuilder.getArticleJson(title, body, author, dater.regularFormat(), dater.regularFormat())
            let res = await API.create(Constants.URL_ARTICLES, json);

            // On success
            if(res)
                this.showMessage(true, 'Successfully deleted post', 'is-success');
            
            this.cleanInput();
        },
        async editPost(id, title, author, body, created_at) {
            if(!this.checkInput(title, author, body))
                return 0;

            let dater = new DateFormater(new Date);
            let json = JsonBuilder.getArticleJson(title, body, author, created_at, dater.regularFormat());

            let res = await API.put(Constants.URL_ARTICLES+"/"+id, json);

            if(!res)
            {
                this.showMessage(true, 'Problem occurred', 'is-warning');
                return;
            }
            else
                this.showMessage(true, 'Successfully deleted post', 'is-success');
        },
        async deletePost(id) {
            let res = await API.delete(Constants.URL_ARTICLES+"/"+id);
            console.log(res);
            if(!res)
            {
                this.showMessage(true, 'Problem occurred', 'is-warning');
            }
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
        cleanInput() {
            this.title = '';
            this.author = '';
            this.body = '';
        },
        async getAuthors() {
            let res = await API.get(Constants.URL_AUTHORS);

            if(res)
                this.authors = res.data;
        },
        search() {
            router.push({ 
                name: 'Page', 
                query: { s: this.searchText } 
            }).catch((error) => {});
        },
    },
    mounted() {
        // Getting authors
        this.getAuthors();
    }
};
</script>

<style>
    .subtitle {
        color: rgb(110, 110, 110);
    }
</style>