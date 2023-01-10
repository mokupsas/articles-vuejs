export const ModalControl = {
    data() {
        return {
            // Modal
            modalShow: false,
            // Types:
            // create
            // delete
            // edit
            modalType: null,
            modalPost: null,    // post to display data inside modal
        }
    },
    methods: {
        showModal(show, type, post) {
            if(!show)
            {
                this.modalShow = false;
                if(this.msgLocation == 1)
                    this.showMessage(false);
                return 0; 
            }

            this.modalShow = true
            this.modalType = type;
            this.modalPost = post;
        }
    }
  }