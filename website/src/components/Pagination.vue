<template>

    <nav class="pagination mt-5" role="navigation" aria-label="pagination">
        <!--
        <a class="pagination-previous">Previous</a>
        <a class="pagination-next">Next page</a>
        -->
        <ul class="pagination-list">
            <li v-for="page in parseInt(this.pages)">
                <div v-if="page <= 10">
                    <router-link v-if="page == current" :to="{name: `Page`, params: { page: page}}" class="pagination-link is-current">{{ page }}</router-link>
                    <router-link v-else :to="{name: `Page`, params: { page: page}}" class="pagination-link">{{ page }}</router-link>
                </div>
            </li>
        </ul>
    </nav>

</template>

<script>
export default {
    props: {
        current: { default: 1 },   // current page
        pages: { default: 1 }      // total pages 
    },
    created() {
        console.log(this.current)
        console.log(this.pages)

    },
    methods: {
        getPages() {
            return this.pages;
        }
    }
}
</script>

<style></style>