<template>

    <ul>
        <message v-if="postsFound == false" :close="0" type="is-danger">Posts not found</message>

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
import router from '../routes'
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
            ]
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
        async getPostsRequest() {
            let searchQuery = this.$route.query['s'] ? this.$route.query['s']  : '';
            let args = `?_limit=${this.perPage}&_page=${this.page}&q=${searchQuery}`;
            let res = await API.get(Constants.URL_ARTICLES+args);

            if(res && res.data.length > 0)
                return res;
            
            this.postsFound = false;
            return false;

        }
    },
    async mounted() {
        let res = await this.getPostsRequest();

        if(res)
        {
            this.posts = res.data;
            this.totalPosts = res.headers['x-total-count'];

            let totalPages = Math.ceil(this.totalPosts / this.perPage);

            this.$emit('totalPages', totalPages);
        }
        /*
        if(this.page > totalPages)
            router.push("/404");
            */
    }
}
</script>

<style></style>