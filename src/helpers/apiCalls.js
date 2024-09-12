import ApiUrls from "./ApiUrls"
import callApi from "./axios"

const ApiCalls={
    fetchAllConversations:async()=>{
        try{
            const response=await callApi(ApiUrls.getAllConversation)
            return response.data
        }catch(error){
            console.error(error)
        }
    }
}
export default ApiCalls;