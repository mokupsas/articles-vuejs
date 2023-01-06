<template>

    <nav class="pagination mt-5" role="navigation" aria-label="pagination">
        <!--
        <a class="pagination-previous">Previous</a>
        <a class="pagination-next">Next page</a>
        -->
        <ul class="pagination-list">
            <li v-for="page in parseInt(this.pages)">
                <div v-if="buttonLimit(page)">
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
        current: { default: 1 },    // current page
        pages: { default: 1 }      // total pages 
    },
    data() {
        return {
            btnLimit: 9
        }
    },
    created() {
        //console.log(Math.floor(this.btnLimit / 2))
        //console.log(this.current)
        console.log(this.leftOffset(4))
        //console.log(this.rightOffset(4))  
    },
    methods: {
        getPages() {
            return this.pages;
        },
        leftOffset(oneSide) {
            /*
            console.log('-')
            console.log(this.current)
            console.log(this.pages - oneSide)
            */
            if(this.current > this.pages - oneSide)   
                return this.current - this.pages + oneSide;
            return 0;
        },
        rightOffset(oneSide) {
            if(this.current <= oneSide)   
                return oneSide + 1 - this.current;
            return 0;
        },
        buttonLimit(page) {
            /*  Pagination structre
                (left side) (center - current page) (right side)
            */
            let oneSide = Math.floor(this.btnLimit / 2);
            let min = this.current - oneSide - this.leftOffset(oneSide);
            let max = this.current + oneSide + this.rightOffset(oneSide);

            if(page >= min && page <= max)
                return true;
            return false;
        }
    }
}
</script>

<style></style>