<template>
    <div class="breadcrumbs indent">
        {{ crumbs }}
    </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
    name: 'BreadCrumbs',
    data() {
        return {
            crumbs: null,
            names: [
                {path: '/', title: {en: ' / ', ru: ' / '}},
                {path: '/text', title: {en: ' / text', ru: ' / текст'}},
                {path: '/photo', title: {en: ' / photo', ru: ' / фото'}},
                {path: '/video', title: {en: ' / video', ru: ' / видео'}},
                {path: '/feedback', title: {en: ' / feedback', ru: ' / обратная связь'}},
                {path: '/about', title: {en: ' / about', ru: ' / обо мне'}}
            ]
        }
    },
    computed: {
        ...mapState('common', {
            lang: state => state.lang
        })
    },
    methods: {
        setBreadCrumbs() {
            let res = null
            this.names.forEach(item => {
                if(item.path === this.$route.path) {
                    res = item.title[this.lang]
                }
            })
            this.crumbs = (this.lang === 'en' ? 'Home' : 'Главная') + res
        }
    },
    watch: {
        $route(oldVal, newVal) {
            this.setBreadCrumbs();
        },
        lang(oldVal, newVal) {
            this.setBreadCrumbs();
        }
    },
    mounted() {
        this.setBreadCrumbs();
    }
}
</script>

<style lang="sass" scoped>
.breadcrumbs
    padding-top: 2px
    padding-bottom: 2px
    font-size: 0.8rem
    opacity: .5
</style>
