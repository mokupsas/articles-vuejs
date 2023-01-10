export const MessageControl = {
    data() {
        return {
            // Modal message
            msgShow: false,
            msgStyle: null,    // bulma css style
            // Locations:
            // 0 - inside page
            // 1 - inside modal
            msgLocation: null,
            msgText: null,
        }
    },
    methods: {
        showMessage(show, text, loc, style) {
            if(!show)
            {
                this.msgShow = false;
                return 0; 
            }

            this.msgShow = true;
            this.msgLocation = loc; 
            this.msgStyle = style; 
            this.msgText = text;
        },
    }
  }