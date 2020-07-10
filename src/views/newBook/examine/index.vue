<template>
    <transition name="fade" mode="out-in">
        <keep-alive :include="cachedViews">
            <router-view></router-view>
        </keep-alive>
    </transition>
</template>

<script>
export default {
    name: 'contract',
    computed: {
        cachedViews() {
          console.log(this.$store.state.tagsView.cachedViews,999)
            return this.$store.state.tagsView.cachedViews
        }
    },
}
</script>
