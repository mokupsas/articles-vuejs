export default class JsonBuilder {
    static getArticleJson(titl, bod, aut, cre, upd) {
        let str = `
        {
            "title": "${titl}",
            "body": "${bod}",
            "author": "${aut}",
            "created_at": "${cre}",
            "updated_at": "${upd}"  
        } 
        `;
        return JSON.parse(str);
    }
}