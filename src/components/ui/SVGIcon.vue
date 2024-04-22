<template>
    <div :class="['svg-icon', `${cssPosition}`]">
        <svg
            :width="width"
            :height="height"
            :viewBox="viewBox"
            :fill="fill"
            xmlns="http://www.w3.org/2000/svg"
            :class="[...classes]"
            @click="$emit('click')"
            ref="SVGIcon"
        >
            <template v-if="content.path">
                <path
                    v-for="(item, index) in content.path"
                    :key="`path-${index}`"
                    :d="item.d"
                    :stroke-width="item['stroke-width']"
                ></path>
            </template>
            <template v-if="content.line">
                <line
                    v-for="(item, index) in content.line"
                    :key="`line-${index}`"
                    :x1="item.x1"
                    :y1="item.y1"
                    :x2="item.x2"
                    :y2="item.y2"
                    :transform="item.transform"
                    :stroke-width="item['stroke-width']"
                ></line>
            </template>
            <template v-if="content.rect">
                <rect
                    v-for="(item, index) in content.rect"
                    :key="`rect-${index}`"
                    :x="item.x"
                    :width="item.width"
                    :height="item.height"
                    :stroke-width="item['stroke-width']"
                ></rect>
            </template>
            <template v-if="content.circle">
                <circle
                    v-for="(item, index) in content.circle"
                    :key="`circle-${index}`"
                    :cx="item.cx"
                    :cy="item.cy"
                    :r="item.r"
                    :stroke-width="item['stroke-width']"
                ></circle>
            </template>
        </svg>
        <div
            v-if="tooltipText"
            :class="['tooltip', tooltipLocation ? `tooltip__${tooltipLocation}` : 'tooltip__right']"
            ref="SVGIconTooltip"
        >
            {{ tooltipText }}
        </div>
    </div>
</template>

<script>
import { icons } from "../../mixins/svgicons"
export default {
    name: 'SVGIcon',
    props: {
        iconName: {
            type: String,
            required: true
        },
        tooltipText: {
            type: String,
            required: false
        },
        tooltipLocation: {
            type: String,
            required: false,
            default: 'right'
        },
        classes: {
            type: Array
        },
        color: {
            type: String
        },
        cssPosition: {
            type: String,
            required: false,
            default: 'relative'
        }
    },
    computed: {
        width() {
            return icons[this.iconName].width;
        },
        height() {
            return icons[this.iconName].height;
        },
        fill() {
            return icons[this.iconName].fill;
        },
        viewBox() {
            return icons[this.iconName].viewBox;
        },
        content() {
            return icons[this.iconName].content;
        }
    },
    methods: {
        colorSVGContent() {
            if(this.$refs.SVGIcon) {
                const children = this.$refs.SVGIcon.children;
                children.forEach(child => {
                    if(child.hasAttribute('stroke-width')) {
                        child.setAttribute('stroke', this.color);
                    } else {
                        child.setAttribute('fill', this.color);
                    }
                })
            }
        }
    },
    watch: {
        color() {
            this.colorSVGContent();
        }
    },
    mounted() {
        this.colorSVGContent();
        if(this.tooltipText && this.$refs.SVGIcon) {
            this.$refs.SVGIcon.addEventListener('mouseenter', () => {
                if(!this.$refs.SVGIcon.classList.contains('disabled')) {
                    this.$refs.SVGIconTooltip.style.display = 'block';
                    setTimeout(() => {
                        this.$refs.SVGIconTooltip.style.display = 'none';
                    }, 2000);
                }   
            });
            this.$refs.SVGIcon.addEventListener('mouseleave', () => {
                this.$refs.SVGIconTooltip.style.display = 'none';
            });
        }   
    },
    updated() {
        this.colorSVGContent();
    }
}
</script>

<style lang="sass" scoped>
.svg-icon
    display: flex
    &.relative
        position: relative
    &.absolute
        position: absolute
    svg
        &.disabled
            cursor: default
    svg:not(.disabled):hover
            + .tooltip
                // display: block
    &.player__copied_show
        .tooltip
            display: block !important
    .tooltip
        position: absolute
        background: rgb(46, 46, 46)
        padding: 2px 4px
        font-size: 14px
        border-radius: 4px
        display: none
        transition: all linear .25s
        z-index: 10 !important
        white-space: nowrap
        color: $grey
        &__left
            top: 50%
            transform: translateY(-50%)
            right: calc(100% + 6px)
            &::before
                content: ''
                width: 0 
                height: 0
                border-top: 4px solid transparent
                border-left: 4px solid rgb(46, 46, 46)
                border-bottom: 4px solid transparent
                position: absolute
                top: 50%
                transform: translateY(-50%)
                right: -4px
        &__right
            top: 50%
            transform: translateY(-50%)
            left: calc(100% + 6px)
            &::before
                content: ''
                width: 0
                height: 0
                border-top: 4px solid transparent
                border-right: 4px solid rgb(46, 46, 46)
                border-bottom: 4px solid transparent
                position: absolute
                top: 50%
                transform: translateY(-50%)
                left: -4px
        &__top
            top: calc(-100% - 18px)
            left: 50%
            transform: translateX(-50%)
            &::before
                content: ''
                width: 0
                height: 0
                border-left: 4px solid transparent
                border-right: 4px solid transparent
                border-top: 4px solid rgb(46, 46, 46)
                position: absolute
                left: 50%
                transform: translateX(-50%)
                bottom: -4px
        &__bottom
            top: calc(100% + 6px)
            left: 50%
            transform: translateX(-50%)
            &::before
                content: ''
                width: 0
                height: 0
                border-left: 4px solid transparent
                border-right: 4px solid transparent
                border-bottom: 4px solid rgb(46, 46, 46)
                position: absolute
                left: 50%
                transform: translateX(-50%)
                top: -4px
</style>
