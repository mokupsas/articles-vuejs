import Vue from 'vue';
import VueRouter from 'vue-router';

// Views
import Home from './views/Home.vue';
import Post from './views/Post.vue';
import About from './views/About.vue';
import PageNotFound from './views/PageNotFound.vue';

Vue.use(VueRouter);

let routes = [
    {
        path: '/:page?',
        name: 'Home',
        component: Home
    },
    {
        path: '/post/:id',
        name: 'Post',
        component: Post
    },
    {
        path: '/about',
        name: 'About',
        component: About
    },
    {
        path: '*',
        name: '404',
        component: PageNotFound
    }
];

export default new VueRouter({
    mode: 'history',
    routes
});