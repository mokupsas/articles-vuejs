<script>
export default {
    props: {
        type: {},
        close: { default: 1 } // sow close button or not : bool
    },
    template: `
        <div class='notification' v-bind:class="type">
            <button class="delete" v-show="close" @click="$emit('closeMessage')"></button>
            <slot></slot>
        </div>
    `
}
</script>

<style></style>