<template>

    <ul>
        <message v-if="!postsFound && !error" :close="0" type="is-danger">Posts not found</message>
        <message v-if="error" :close="0" type="is-danger">An error has occurred</message>


        <li class="block" v-for="post in posts">
        
            <h3 class="title is-4">
                <router-link :to="getPostUrl(post)">{{ post.title }}</router-link>
            </h3>
            <p class="subtitle is-6">
                {{ displayDate(post) }} by {{ post.author }}
                <ul>
                    <li><a href="#" onclick="return false;" @click="$emit('openModalEdit', post.id)">Edit</a></li>
                    <li><a href="#" onclick="return false;" @click="$emit('openModalDelete', post.id)">Delete</a></li>
                </ul>  
            </p>
        </li>
    </ul>

</template>

<script>
// Routes
import * as Constants  from '../constants'
// Classes
import API from '../classes/API'
// Components
import Modal from '../components/Modal'
import Message from '../components/Message'

export default {
    components: {
        Modal,
        Message
    },
    props: {
        perPage: { default: 10 },
        deletePost: { default: null },
        editPost: { default: null },
        search: { default: ''},
    },
    data() {
        return {
            page: this.$route.params.page ? this.$route.params.page:1,
            totalPosts: 1,
            // Data about posts
            postsFound: true,
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
            error: false
        }
    },
    watch: {
        deletePost: {
            immediate: true,
            handler(newValue, oldValue) {
                if(newValue >= 0)
                {
                    let index = this.posts.findIndex(item => item.id === newValue)
                    this.posts.splice(index, 1)
                }
            }
        },
        editPost: {
            immediate: true,
            handler(newValue, oldValue) {
                if(newValue.id !== undefined)
                {
                    let index = this.posts.findIndex(item => item.id === newValue.id)
                    this.posts[index].title = newValue.title;
                    this.posts[index].body = newValue.body;
                    this.posts[index].author = newValue.author;
                    this.posts[index].updated_at = newValue.updated_at;
                }
            }
        },
        search: {
            immediate: true,
            async handler(newValue, oldValue) {
               console.log(newValue)
               this.search = newValue;
               this.posts = await this.getPosts();
            }
        }
    },
    methods: {
        getPostUrl(post) {
            return `/post/${post.id}`;
        },
        displayDate(post) {
            if (post.updated_at > post.created_at)
            {
                return `Edited at ${post.updated_at}`;
            }
            return `Posted at ${post.created_at}`;
        },
        async getPosts() {
            
            let args = `?_limit=${this.perPage}&_page=${this.page}&q=${this.search}`;
            console.log(Constants.URL_ARTICLES+args)
            let res = await API.get(Constants.URL_ARTICLES+args);

            if(res && res.data.length > 0)
            {
                this.postsFound = true;
                this.totalPosts = res.headers['x-total-count'];
                let totalPages = Math.ceil(this.totalPosts / this.perPage);
                this.$emit('totalPages', totalPages);
                console.log(totalPages);
                return res.data;
            }
            else if(!res)
                this.error = true
            
            this.$emit('totalPages', 0);
            this.postsFound = false;
            return [];
        }
    },
    async mounted() {
        this.posts = await this.getPosts();
    }
}
</script>

<style></style>