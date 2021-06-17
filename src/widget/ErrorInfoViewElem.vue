<template>
    <div class="elemData" :key="elemData._id" :title="elemData._id">
        <!-- index -->
        <div>{{ index }}</div>
        <!-- level -->
        <div>
            <span v-show="elemData.level == 300" class="bu-tag bu-is-info">Info</span>
            <span v-show="elemData.level == 200" class="bu-tag bu-is-warning">Warning</span>
            <span v-show="elemData.level == 100" class="bu-tag bu-is-danger">Danger</span>
        </div>
        <!-- appName -->
        <div>{{ elemData.appName ?? "- NULL -" }}</div>
        <!-- appVersion -->
        <div>{{ elemData.appVersion ?? "- NULL -" }}</div>
        <!-- clitenId -->
        <div>{{ elemData.clientId ?? "- NULL -" }}</div>
        <!-- allErrorInfo -->
        <div>{{ elemData.allErrorInfo ?? "- NULL -" }}</div>
        <!-- minErrorInfo -->
        <div>{{ elemData.minErrorInfo ?? "- NULL -" }}</div>
        <!-- otherInfo -->
        <div>{{ elemData.otherInfo ?? "- NULL -" }}</div>
        <!-- recvTime -->
        <div
            :title="(elemData.recvTime != null ? elemData.recvTime : '').toString()"
        >{{ DateFormatNumber(elemData.recvTime) }}</div>
        <!-- sourceIp -->
        <div>{{ elemData.sourceIp ?? "- NULL -" }}</div>
        <!-- tools -->
        <div>
            <button
                class="bu-button bu-is-small"
                @click="onOpenSource(JSON.stringify(elemData, null, 4))"
            >ALLInfo</button>
        </div>
    </div>
</template> 


<script lang="ts" >
import { defineComponent } from "vue"
import { ErrorStruct } from "../api/showErrors"
import { DateFormat, DateFormatNumber } from "../functions";
export default defineComponent({
    name: "ErrorInfoViewElem",
    props: {
        elemData: Object,
        index: Number
    },
    methods: {
        onOpenSource: function(source: string) {
            this.$emit("openSource", source)
        }
    },
    setup: function(props: any) {
        return {
            elemData: props.elemData as ErrorStruct,
            DateFormatNumber,
            JSON
        };
    }
})
</script>

<style lang="scss" scoped>
.elemData {
    display: flex;
    margin: 10px 0;
    padding: 5px 10px;
    border-radius: 5px;
    align-items: center;
    &:hover {
        background-color: #f3f3f3;
    }
    & > div {
        flex-grow: 1;
        margin-right: 8px;
        width: 50px;
        margin: 0 10px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 13px;
    }
}
</style>
