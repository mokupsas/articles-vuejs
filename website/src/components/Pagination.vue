<template>

    <nav class="pagination mt-5" role="navigation" aria-label="pagination">
        <!--
        <a class="pagination-previous">Previous</a>
        <a class="pagination-next">Next page</a>
        -->
        <ul class="pagination-list">
            <li v-for="page in parseInt(this.pages)">
                <div v-if="buttonLimit(page)">
                    <router-link v-if="page == current" :to="{name: `Home`, params: { page: page}}" class="pagination-link is-current" @click.native="$emit('currentPage', page)">{{ page }}</router-link>
                    <router-link v-else :to="{name: `Home`, params: { page: page}}" class="pagination-link" @click.native="$emit('currentPage', page)">{{ page }}</router-link>
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
    /*
    watch: {
        $route: {
            immediate: true,
            deep: true,
            async handler(newValue, oldValue) {
                if(newValue.params.page != 'undefined')
                    this.current = newValue.params.page;
            }
        }
    },
    */
    data() {
        return {
            btnLimit: 9
        }
    },
    methods: {
        getPages() {
            return this.pages;
        },
        leftOffset(oneSide) {
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
            let oneSide = Math.floor(this.btnLimit / 2);
            let min = this.current - oneSide - this.leftOffset(oneSide);
            let max = this.current + oneSide + this.rightOffset(oneSide);

            if(page >= min && page <= max)
                return true;
            return false;
        },
        test() {
            console.log('aaaa')
        }
    }
}
</script>

<style></style>