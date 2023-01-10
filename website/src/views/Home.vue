<template>

    <div class="columns mt-6 mb-6">
        <div class="column is-three-quarters">
           
            <h1 v-if="!searchText" class="title">Posts</h1>
            <h1 v-else class="title">Search for: {{ searchText }}</h1>
            <hr/>

            <message v-show="msgShow && msgLocation == 0" :type="msgStyle" :close="0" @closeMessage="showMessage(false)">{{ msgText }}</message>

            <modal v-if="modalShow && !error" :type="modalType" :authors="authors" :post="modalPost" @acceptedModal="acceptedModal" @closeModal="showModal(false)">
                <message v-show="msgShow && msgLocation == 1" :type="msgStyle" close="1" @closeMessage="showMessage(false)">{{ msgText }}</message>
            </modal>

            <post-card v-for="post in posts" :post="post" @openDelete="openDelete" @openEdit="openEdit"></post-card>

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
import PostCard from './../components/PostCard'
import Pagination from './../components/Pagination'

export default {
    components: { Modal, Message, Pagination, PostCard },
    data() {
        return {
            // Modal
            modalShow: false,
            // Types:
            // create
            // delete
            // edit
            modalType: null,
            modalPost: 'aa',    // post to display data inside modal

            // Modal message
            msgShow: false,
            msgStyle: null,    // bulma css style
            // Locations:
            // 0 - inside page
            // 1 - inside modal
            msgLocation: null,
            msgText: null,

            posts: [
                /* {
                    id: 1,
                    title: 'Title1',
                    author: 'Author',
                    body: 'Text goes here',
                    created_at: new Date('2022-12-12 05:00:00'.replace(/-/g,"/")),
                    updated_at: new Date('2022-12-19 06:00:00'.replace(/-/g,"/"))
                } */
            ],
            error: false,

            // Authors
            authors: {
               /* id:
                name:
                created_at:
                updated_at: */
            },

            // Pagination
            page: 1,
            totalPages: 0,
            perPage: 10,

            // Search
            searchText: ''
        }
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
        openCreate() {
            this.showModal(true, 'create');
        },
        openEdit(post_id) {
            let post = this.getPostById(post_id);
            this.showModal(true, 'edit', post);
        },
        openDelete(post_id) {
            let post = this.getPostById(post_id);
            this.showModal(true, 'delete', post);
        },
        // data arg gives post id when post is edit/deleted.
        // When creating post, provides input object
        acceptedModal(data) {
            
            // If we delete post
            if(this.modalType === 'delete')
            {
                this.deletePost(data);
            }
            // If we edit post
            else if(this.modalType === 'edit')
            {
                let post = this.getPostById(data);
                this.editPost(post.id, post.title, post.author, post.body, post.created_at);
            }
            // If we create post
            else
                this.createPost(data.title, data.author, data.body);     
        },
        async createPost(title, author, body) {
            if(!this.checkInput(title, author, body))
                return 0;

            
            let dater = new DateFormater();
            let json = JsonBuilder.getArticleJson(title, body, author, dater.regularFormat(), dater.regularFormat())
            let res = await API.create(Constants.URL_ARTICLES, json);

            if(res)
            {
                this.showMessage(true, 'Successfully created post', 0, 'is-success');
                this.showModal(false);
            }
            else {
                this.showMessage(true, 'Problem occurred', 1, 'is-warning');
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
                this.showMessage(true, 'Successfully edited post', 0, 'is-success');
                this.showModal(false);
            }
            else
                this.showMessage(true, 'Problem occurred', 1, 'is-warning');
        },
        async deletePost(id) {
            let res = await API.delete(Constants.URL_ARTICLES+"/"+id);

            if(res)
            {
                this.showMessage(true, 'Successfully deleted post', 0, 'is-success');
                this.showModal(false);
            }
            else
                this.showMessage(true, 'Problem occurred', 1, 'is-warning');
        },
        getPostById(post_id) {
            let index = this.posts.findIndex(item => item.id === post_id)
            return this.posts[index];
        },
        checkInput(title, author, body) {
            if(!title || !author || !body )
            {
                this.showMessage(true, 'You must fill all fields', 1, 'is-warning');
                return false;
            }
            return true;
        },
        async getAuthors() {
            let res = await API.get(Constants.URL_AUTHORS);

            if(res)
                return res.data;
            return false;
        },
        async getPosts() {
            let args = `?_limit=${this.perPage}&_page=${this.page}&q=${this.searchText}`;
            let res = await API.get(Constants.URL_ARTICLES+args);

            if(res && res.data.length > 0)
            {
                let totalPosts = res.headers['x-total-count'];
                this.totalPages = Math.ceil(totalPosts / this.perPage);

                return res.data;
            }
            else
                this.error = true;
            
            return [];
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
    async mounted() {
        // Getting authors
        this.authors = await this.getAuthors();
        // Getting posts
        this.posts = await this.getPosts();

        if(!this.posts[0] && this.error)
            this.showMessage(true, 'Problem occurred', 0, 'is-danger');
        else if(!this.posts[0])
            this.showMessage(true, 'No posts found', 0, 'is-warning');
    }
}
</script>

<style>
    .subtitle {
        color: rgb(110, 110, 110);
    }
</style>