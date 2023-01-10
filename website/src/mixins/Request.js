import * as Constants  from '../constants'
// Classes
import API from '../classes/API'

export const Request = {
    
    data() {
        return {
            error: false,
        }
    },
    methods: {
        checkInput(title, author, body) {
            if(!title || !author || !body )
            {
                this.showMessage(true, 'You must fill all fields', 1, 'is-warning');
                return false;
            }
            return true;
        },
        async getAuthors() {
            let res = await API.get(Constants.URL_AUTHORS);

            if(res)
                return res.data;
            return false;
        },
    }
  }