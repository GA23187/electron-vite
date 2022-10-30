import axios from "axios";

const instance = axios.create({
  baseURL: "",
  timeout: 5000,
});

const getAjax = (url,config)=>{
   return instance.get(url,config)
}
export default getAjax