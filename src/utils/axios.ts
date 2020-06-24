import axios from 'axios'
const xhr =  axios.create({
  baseURL: process.env.NODE_ENV==='production'?'/':'/api'
})
export default xhr
