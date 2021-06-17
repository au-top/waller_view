export function DateFormat(d:Date){
    return `${d.getFullYear()}/${d.getMonth()+1}/${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
}
export function DateFormatNumber(time:number){
    const d= new Date(time);
    return `${d.getFullYear()}/${d.getMonth()+1}/${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
}
export function NegationArray<T>(a:T[],v:T){
    const targetIndex=a.indexOf(v);
    targetIndex==-1?a.push(v):a.splice(targetIndex,1);
    return a;
}