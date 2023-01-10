<template>

    <div class="mb-5">
        <h3 class="title is-4">
            <router-link :to="getPostUrl(post)">{{ post.title }}</router-link>
        </h3>

        <p class="subtitle is-6">
            {{ displayDate(post) }} by {{ post.author }}
            <ul>
                <li><a href="#" onclick="return false;" @click="$emit('openEdit', post.id)">Edit</a></li>
                <li><a href="#" onclick="return false;" @click="$emit('openDelete', post.id)">Delete</a></li>
            </ul>  
        </p>
    </div>

</template>

<script>
export default {
    props: {
        post: { required: true } 
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
    }
}
</script>

<style></style>