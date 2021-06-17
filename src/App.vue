<template>
    <div id="main">
        <div class="header">
            <div class="logo">WallerView</div>

            <div class="nullBox"></div>
            <button
                class="showSettingButton bu-button"
                @click="pageData.startSet = !pageData.startSet"
            >Show Setting</button>
        </div>
        <div class="mainContentBox">
            <div class="headerModuleMainCon mini">
                <button class="bu-button" @click="reGetAllData">
                    <img src="/assets/refresh.png" width="30" height="30" />
                    <div class="nullSizeBox"></div>重新连接到服务器
                </button>
            </div>

            <div class="headerModuleMainCon">
                <div id="configServiceModule" class="card">
                    <span>Service Host</span>
                    <div>
                        <input
                            class="bu-input"
                            :disabled="pageData.startSet"
                            v-model="baseConfig.url"
                            type="text"
                            placeholder="Service Host"
                        />
                    </div>
                    <span>Service Passwd</span>
                    <div>
                        <input
                            class="bu-input"
                            v-model="baseConfig.passwd"
                            type="password"
                            :disabled="pageData.startSet"
                            placeholder="Service Passwd"
                        />
                    </div>
                </div>

                <div class="nullSizeBox"></div>
                <div class="nullSizeBox"></div>
                <div class="nullSizeBox"></div>

                <div id="serviceInfoPreview" class="card bu-content">
                    <StatisticsWidget
                        v-if="pageData.statistics != null"
                        :statistics="pageData.statistics"
                    ></StatisticsWidget>
                    <div v-else>No Content</div>
                </div>
            </div>
            <div class="headerModuleMainCon">
                <!-- no use flex -->
                <div
                    id="errorInfoToolsBox"
                    class="card bu-content"
                    :class="pageData.allWindows ? 'allWindow' : ''"
                >
                    <h3>Error Info Lists</h3>
                    <div class="errorInfoTools">
                        <button
                            class="bu-button bu-tag bu-is-info"
                            :class="pageData.useFilterMode.includes('filterInfo') ? 'on' : 'off'"
                            @click="NegationArray(pageData.useFilterMode, 'filterInfo')"
                        >FilterInfo</button>
                        <button
                            class="bu-button bu-tag bu-is-warning"
                            :class="pageData.useFilterMode.includes('filterWarning') ? 'on' : 'off'"
                            @click="NegationArray(pageData.useFilterMode, 'filterWarning')"
                        >FilterWarning</button>
                        <button
                            class="bu-button bu-tag bu-is-danger"
                            :class="pageData.useFilterMode.includes('filterDanger') ? 'on' : 'off'"
                            @click="NegationArray(pageData.useFilterMode, 'filterDanger')"
                        >FilterDanger</button>
                        <button
                            class="bu-button bu-tag bu-is-info"
                            :class="pageData.useFilterMode.includes('aubot24h') ? 'on' : 'off'"
                            @click="NegationArray(pageData.useFilterMode, 'aubot24h')"
                        >Aubot24h</button>
                        <button
                            class="bu-button bu-tag bu-is-info"
                            :class="pageData.useFilterMode.includes('ALL') ? 'on' : 'off'"
                            @click="NegationArray(pageData.useFilterMode, 'ALL')"
                        >ALL</button>

                        <div class="nullBox"></div>

                        <input
                            type="text"
                            class="bu-input bu-is-small searchInput"
                            v-model="pageData.seachContent"
                        />
                        <button
                            class="bu-button bu-is-small"
                            @click="pageData.allWindows = !pageData.allWindows"
                        >
                            <div v-if="pageData.allWindows">ToMinWindow</div>
                            <div v-else>ToMAXWindow</div>
                        </button>
                    </div>

                    <div class="elemData">
                        <!-- index -->
                        <div>Index</div>
                        <!-- level -->
                        <div>Level</div>
                        <!-- appName -->
                        <div>AppName</div>
                        <!-- appVersion -->
                        <div>AppVersion</div>
                        <!-- clitenId -->
                        <div>ClientId</div>
                        <!-- allErrorInfo -->
                        <div>AllErrorInfo</div>
                        <!-- minErrorInfo -->
                        <div>MinErrorInfo</div>
                        <!-- otherInfo -->
                        <div>OtherInfo</div>
                        <!-- recvTime -->
                        <div>RecvTime</div>
                        <!-- sourceIp -->
                        <div>SourceIp</div>
                        <!-- tools -->
                        <div>Tools</div>
                    </div>
                    <div class="errorInfoViewListsBox">
                        <div v-if="showErrorList.length">
                            <ErrorInfoViewElem
                                v-for="(elem,index) in showErrorList"
                                :key="elem._id"
                                :index="index + 1"
                                :elemData="elem"
                                @openSource="openSource"
                            ></ErrorInfoViewElem>
                            <div class="nullContentTips">
                                <div>No Other Content</div>
                            </div>
                        </div>
                        <div class="nullContentTips" v-else>
                            <div>No Other Content</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div
            class="allWindow bu-content centerALL flexbox showSourceBox"
            v-if="pageData.showSourceStart"
            @click.stop="pageData.showSourceStart = false"
        >
            <div @click.stop class="backgroundColroFFF showSourceContent">
                <h3>Source Code</h3>
                <pre>{{ pageData.showSource }}</pre>
                <div class="flexbox">
                    <div class="nullBox"></div>
                    <button
                        class="bu-button bu-is-small"
                        @click="pageData.showSourceStart = false"
                    >Exit</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">

import { defineComponent, reactive, ref, Ref } from 'vue'
import { baseConfig } from './api/base';
import { getShowErrorStruct, getStatistics, Statistics, ErrorStruct } from "./api/showErrors";
import ErrorInfoViewElem from "./widget/ErrorInfoViewElem.vue";
import StatisticsWidget from "./widget/Statistics.vue";
import { NegationArray } from "./functions";
import { autoSaveMap, readSaveMap } from './storage';

const saveIndexInfo = "appuseCacheSaveIndexInfo";


const _readCacheData = readSaveMap(saveIndexInfo);
const pageData = reactive({
    startSet: (_readCacheData["startSet"] ?? ref(true)) as boolean,
    errorsData: [] as ErrorStruct[],
    statistics: null as Statistics | null,
    useFilterMode: (_readCacheData["useFilterMode"] ?? []) as Array<string>,
    seachFunc: (v: ErrorStruct) => {
        if (pageData.seachContent != null && pageData.seachContent.length > 0) {
            return Object.values(v).join('').includes(pageData.seachContent)
        } else {
            return true;
        }
    },
    sortFunc: (a: ErrorStruct, b: ErrorStruct) => b.recvTime - a.recvTime,
    seachContent: ref(""),
    allWindows: ref(false),
    showSource: ref(""),
    showSourceStart: ref(false),
});
// auto save 
autoSaveMap(saveIndexInfo, pageData, ["startSet", "useFilterMode"]);
const filterMode = {
    "filterInfo": (v: ErrorStruct) => v.level == 300,
    "filterWarning": (v: ErrorStruct) => v.level == 200,
    "filterDanger": (v: ErrorStruct) => v.level == 100,
    "aubot24h": (v: ErrorStruct) => {
        let top24TimeToken = Date.now() - 3600 * 24 * 1000; //to 24h
        return top24TimeToken < v.recvTime
    },
    "ALL": (v: any) => true
} as Record<string, (esValue: ErrorStruct) => boolean>;

const reGetAllData = async () => {
    pageData.errorsData = await getShowErrorStruct();
    pageData.statistics = await getStatistics();
};

let autoUpdateTimer: number | null = null;

export default defineComponent({
    created: function() {
        //autoLink
        setTimeout(reGetAllData, 100);
        autoUpdateTimer = setInterval(reGetAllData, 5000);
    },
    destroyed: function() {
        if (autoUpdateTimer) {
            clearInterval(autoUpdateTimer);
        }
    },
    name: 'frameBox',
    components: {
        ErrorInfoViewElem,
        StatisticsWidget
    },
    methods: {
        openSource: function(showData: any) {
            pageData.showSource = showData;
            pageData.showSourceStart = true;
        }
    },
    computed: {
        "showErrorList": function() {
            let cache = pageData.errorsData;
            pageData.useFilterMode.forEach(useFilterName => {
                cache = cache.filter(filterMode[useFilterName]!);
            });
            cache = cache.filter(pageData.seachFunc);
            cache.sort(pageData.sortFunc);
            return cache;
        }
    },
    setup: (props) => ({
        pageData,
        baseConfig,
        getShowErrorStruct,
        reGetAllData,
        filterMode,
        NegationArray,
        console
    })
});

</script>

<style lang="scss">
.header {
    padding: 0 40px;
    background-color: rgb(0, 132, 255);
    height: 60px;
    display: flex;
    align-items: center;

    & > .showSettingButton {
        border-radius: 3;
        &:hover {
            background-color: #f5f5f5;
        }
        &:active {
            background-color: #eee;
        }
    }
}

.mainContentBox {
    & > .headerModuleMainCon {
        display: flex;
        padding: 40px;
        &.mini {
            padding: 10px 40px 5px 40px;
        }

        & > #serviceInfoPreview {
            .dispersed {
                & > * {
                    margin-right: 4px;
                }
            }
        }
        & > #configServiceModule {
            & > div {
                margin: 5px 0;
            }
        }
        & > #errorInfoToolsBox {
            display: flex;
            flex-direction: column;
            background-color: #fff;
            width: 100%;
            &.allWindow {
                .errorInfoViewListsBox {
                    flex-grow: 3;
                }
            }
            .bu-tag.bu-button {
                &.on {
                    filter: brightness(1);
                }
                &.off {
                    filter: brightness(0.5);
                }
            }

            .errorInfoTools {
                display: flex;
                .searchInput {
                    border-radius: 4px;
                    box-shadow: 0 2px 2px #eee5;
                    max-width: 200px;
                    margin: 0 10px;
                }
                .bu-tag {
                    margin: 0 10px 0 0;
                    cursor: pointer;
                    user-select: none;
                }
            }

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
            .errorInfoViewListsBox {
                height: 300px;
                width: 100%;
                overflow-y: scroll;
                padding: 15px;
                & > .nullContentTips {
                    display: flex;
                    align-items: center;
                    user-select: none;
                    justify-content: center;
                }
            }
        }
    }
}

.showSourceBox {
    .showSourceContent {
        box-shadow: 2px 6px 30px #0003;
        width: 75%;
        padding: 30px;
    }
}
</style>
