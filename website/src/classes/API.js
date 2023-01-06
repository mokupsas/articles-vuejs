import axios from 'axios';

export default class API {
    static async create(url, json) {
        let res = await axios.post(url, json)
            .then((response) => {
                return true;
            }).catch((error) => {
                return false;
            });
        return res;
    }
    static async get(url) {
        let res =  await axios.get(url)
            .catch(async (error) => {
                return false;
            });
        return res;
    }
    static async put(url, json) {
        let res = await axios.put(url, json)
            .then((response) => {
                return true; 
            })
            .catch((error) => {
                return false;
            });
        return res;
    }
    static async delete(url) {
        let res = await axios.delete(url)
            .then((response) => {
                return true;
            })
            .catch((error) => {
                return false;
            });
        return res;
    }
}