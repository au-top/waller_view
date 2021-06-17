<template>
    <h3>Service Info Statistics</h3>
    <hr />
    <div>
        <div>Aubot 24h Error</div>
        <div class="dispersed">
            <span class="bu-tag bu-is-info">
                Info:
                <span>{{ elemData[24][300] }}</span>
            </span>
            <span class="bu-tag bu-is-warning">
                Warning:
                <span>{{ elemData[24][200] }}</span>
            </span>
            <span class="bu-tag bu-is-danger">
                Error:
                <span>{{ elemData[24][100] }}</span>
            </span>
        </div>
    </div>
    <div class="nullSizeBox"></div>
    <div>
        <div>Aubot ALL Error</div>
        <div class="dispersed">
            <span class="bu-tag bu-is-info">
                Info:
                <span>{{ elemData.ALL[300] }}</span>
            </span>
            <span class="bu-tag bu-is-warning">
                Warning:
                <span>{{ elemData.ALL[200] }}</span>
            </span>
            <span class="bu-tag bu-is-danger">
                Error:
                <span>{{ elemData.ALL[100] }}</span>
            </span>
        </div>
    </div>
</template>


<script lang="ts" >
import { defineComponent } from "vue";
import { Statistics } from "../api/showErrors";
export default defineComponent({
    name: "ErrorInfoViewElem",
    props: {
        statistics: Object,
    },
    setup: function(props: any) {
        return {
            elemData: props.statistics as Statistics
        }
    }
})
</script>

<style lang="scss">
</style>
