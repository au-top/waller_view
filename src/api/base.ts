import { reactive } from "vue";
import { autoSaveMap, readSaveMap } from "../storage";

const saveBaseConfig="saveBaseConfigName";
const _readCache=readSaveMap(saveBaseConfig);
const baseConfig =reactive({
    url:_readCache["url"]??"",
    passwd:_readCache["passwd"]??""
});
autoSaveMap(saveBaseConfig,baseConfig,["url","passwd"]);
export {
    baseConfig
}