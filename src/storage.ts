const globalSaveMap={} as Record<string,[any,string[]]>;


setInterval(()=>{
    for(let saveKey in globalSaveMap){
        let saveTargetO=globalSaveMap[saveKey][0];
        let saveFieldArr=globalSaveMap[saveKey][1];
        const saveO=Object.create(null);
        saveFieldArr.forEach((keyVal)=>{
            saveO[keyVal]=saveTargetO[keyVal];
        });
        window.localStorage[saveKey]=JSON.stringify(saveO);
    }
},1400);


export function autoSaveMap(saveKey:string,saveObj:any,saveField:string[]){
    globalSaveMap[saveKey]=[saveObj,saveField];
}

export function readSaveMap(saveKey:string){
    return JSON.parse(window.localStorage.getItem(saveKey)??"{}");
}