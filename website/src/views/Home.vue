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
                    <input v-debounce:1000ms="search" class="input" type="text" placeholder="Search text goes here..." ref="searchInput">
                </div>
                <!-- <button class="button" @click="search">Search</button> -->
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
// Mixins
import { ModalControl } from '../mixins/ModalControl'
import { MessageControl } from '../mixins/MessageControl'
import { Request } from '../mixins/Request'
// Components
import Modal from './../components/Modal'
import Message from './../components/Message'
import PostCard from './../components/PostCard'
import Pagination from './../components/Pagination'

export default {
    mixins:[ ModalControl, MessageControl, Request ],
    components: { Modal, Message, Pagination, PostCard },
    data() {
        return {
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
            totalPosts: 0,
            perPage: 10,

            // Search
            searchText: ''
        }
    },
    methods: {
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
                this.deletePost(data.id);
            }
            // If we edit post
            else if(this.modalType === 'edit')
            {
                this.editPost(data.id, data.title, data.author, data.body, data.created_at);
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
                json.id = this.getLastPost().id + 1;
                this.posts.push(json);

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
                let index = this.posts.findIndex(item => item.id === id)
                this.posts[index] = json;

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
                let index = this.posts.findIndex(item => item.id === id)
                this.removeFromArray(this.posts, index);

                this.showMessage(true, 'Successfully deleted post', 0, 'is-success');
                this.showModal(false);
            }
            else
                this.showMessage(true, 'Problem occurred', 1, 'is-warning');
        },
        async getPosts() {
            let args = `?_limit=${this.perPage}&_page=${this.page}&q=${this.searchText}`;
            let res = await API.get(Constants.URL_ARTICLES+args);
            
            if(res && res.data.length > 0)
            {
                this.totalPosts = res.headers['x-total-count'];
                this.totalPages = Math.ceil(this.totalPosts / this.perPage);

                return res.data;
            }
            else if(!res)
            {
                this.error = true;
                this.showMessage(true, 'Problem occurred', 0, 'is-danger');
            }
            else
                this.showMessage(true, 'No posts found', 0, 'is-warning');
            
            this.totalPages = 0;
            return [];
        },
        async search(text) {
            //this.searchText = this.$refs.searchInput.value;
            this.searchText = text;

            router.push({ 
                name: 'Home', 
                query: { s: this.searchText } 
            }).catch((error) => {});

            this.posts = await this.getPosts();

            // If post found, clean previous message
            if(this.arePostFound())
                this.showMessage(false)
        },
        getSearchedFor() {
            return this.$route.query['s'] ? this.$route.query['s'] : '';
        },
        async changePage(page) {
            if(this.page != page)
            {
                this.page = page;
                this.posts = await this.getPosts();
            }
        },
        arePostFound() {
            return this.posts.length > 0;
        },
        getPostById(post_id) {
            let index = this.posts.findIndex(item => item.id === post_id)
            return this.posts[index];
        },
        removeFromArray(array, index) {
            array.splice(index, 1)
        },
        getLastPost() {
            return this.posts[this.posts.length - 1];
        }
    },
    created() {
        // Setting searched data
        this.searchText = this.getSearchedFor();

        // Getting current page if given
        this.page = this.$route.params.page ? this.$route.params.page : this.page;
    },
    async mounted() {
        // Getting authors
        this.authors = await this.getAuthors();
        // Getting posts
        this.posts = await this.getPosts(); 
    }
}
</script>

<style>
    .subtitle {
        color: rgb(110, 110, 110);
    }
</style>