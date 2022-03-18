import {tempalteList} from '@/api/avs-video'
const data = {
    state:{
        templateLis:[]
    },
    mutations:{
        GET_TEMLIST:(state, list)=>{
            state.templateLis = list
        }
    },
    actions:{
        GetTemplateList({commit},productId){
            return new Promise(resolve=>{
                tempalteList({productId:productId,publishStatus:0},false,false).then(result=>{
                commit('GET_TEMLIST',result.data)
                resolve(result.data)
            })
            })
            
        }
    }
}
export default data