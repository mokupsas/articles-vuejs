<template>

    <div class="columns mt-6 mb-6">
        <div class="column is-three-quarters">

            <message v-show="msgShow && msgLocation == 0" :type="msgStyle" :close="0" @closeMessage="showMessage(false)">j</message>
           
            <h1 v-if="!searchText" class="title">Posts</h1>
            <h1 v-else class="title">Search for: {{ searchText }}</h1>
            <hr/>

            <modal v-if="modalShow" :type="modalType" :authors="authors" :post="post" @acceptedModal="acceptedModal()" @closeModal="showModal(false)">
                <message v-show="msgShow && msgLocation == 1" :type="msgStyle" close="1" @closeMessage="showMessage(false)">j</message>
            </modal>
            
            <post-preview :deletePost="deleteId" :editPost="post" :search="searchText" @totalPages="setTotalPages" @openModalEdit="openEdit" @openModalDelete="openDelete"></post-preview>

            <pagination :current="page" :pages="totalPages" @currentPage="changePage"></pagination>
            
        </div>

        <div class="column">

            <a class="button is-primary mb-5" @click="openCreate()">
              <strong>Create post</strong>
            </a>

            <div class="field mb-5">
                <label class="label">Search</label>
                <div class="control mb-2">
                    <input class="input" type="text" placeholder="Text input" ref="searchInput">
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
            // create
            // delete
            // edit
            modalType: null,
            modalAcptText: null,

            // Modal message
            msgShow: false,
            msgStyle: null,    // bulma css style
            // Locations:
            // 0 - inside page
            // 1 - inside modal
            msgLocation: null,
            msgText: null,

            // Create post form
            title: '',
            author: '',
            body: '',

            // Edit or delete post ID
            fetchId: null,

            // Post data to edit
            post: {
                id: 1,
                title: 'Title1',
                author: 'Alex',
                body: 'Text goes here',
                created_at: '2022-12-12 05:00:00',
                updated_at: '2022-12-19 06:00:00'
            },

            deleteId: -1,

            // Authors
            authors: {
               /* id:
                name:
                created_at:
                updated_at: */
            },

            // Post/article data
            page: 1,
            totalPages: 0,
            perPage: 10,

            // Search
            searchText: ''
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
        openCreate() {
            this.showModal(true, 'Create post', 'create', 'Create');
        },
        async openEdit(id) {
            this.showModal(true, 'Edit post', 'edit', 'Edit');
            this.fetchId = id;

            // Fetching post data into input
            let res = await API.get(Constants.URL_ARTICLES+"/"+this.fetchId);
            this.post = res.data;
        },
        openDelete(id) {
            this.showModal(true, 'Delete post', 'delete', 'Delete');
            this.fetchId = id;
        },
        acceptedModal() {
            console.log('a')
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

            if(res)
            {
                this.showMessage(true, 'Successfully created post', 'is-success');
            }
            else {
                this.showMessage(true, 'Problem occurred', 'is-warning');
            }
        },
        async editPost(id, title, author, body, created_at) {
            if(!this.checkInput(title, author, body))
                return 0;

            let dater = new DateFormater(new Date);
            let json = JsonBuilder.getArticleJson(title, body, author, created_at, dater.regularFormat());

            let res = await API.put(Constants.URL_ARTICLES+"/"+id, json);

            if(res)
            {
                this.showMessage(true, 'Successfully edited post', 'is-success');
                this.post = json;
                this.post.id = id;
            }
            else
                this.showMessage(true, 'Problem occurred', 'is-warning');
        },
        async deletePost(id) {
            let res = await API.delete(Constants.URL_ARTICLES+"/"+id);

            if(res)
            {
                this.showMessage(true, 'Successfully deleted post', 'is-success');
                this.deleteId = id; // given to post-preview as property
            }
            else
                this.showMessage(true, 'Problem occurred', 'is-warning');
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
            this.searchText = this.$refs.searchInput.value;
            
            router.push({ 
                name: 'Page', 
                query: { s: this.searchText } 
            }).catch((error) => {});
        },
        changePage(page) {
            if(this.page != page)
            {
                console.log(page);
            }
        }
    },
    mounted() {
        // Getting authors
        this.getAuthors();
        this.showMessage(true, 'Successfully created post', 0, 'is-success');
    }
};
</script>

<style>
    .subtitle {
        color: rgb(110, 110, 110);
    }
</style>