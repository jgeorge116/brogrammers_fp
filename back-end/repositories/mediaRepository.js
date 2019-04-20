const Media = require("./../utils/media");
const media = new Media();
const shortid = require("shortid");
const uuidv4 = require("uuid/v4");


module.exports = class MediaRepository {

    /**
     * Creates a media associated with a username
     * @param {String} username 
     * @param {String} content
     */
    async create(username, content) {
        // Check the fields
        if (!username) {
            return {
            status: "error",
            data: "Username is required"
            };
        }
        if (!content) {
            return {
            status: "error",
            data: "Content is required"
            };
        }
        const new_id = uuidv4();
        media.sendAddRequest(new_id,content);
        return {
            status: "OK",
            data: new_id
        };
    }

    /**
     * Get a question associated with an id
     * @param {String} id 
     */
    async get_media_by_id(id) {
        var found_media = await media.sendGetRequest({id: id});
        if (!found_media) {
            return {
                status: "error",
                data: "Media does not exist"
            };
        }
        return {
            status: "OK",
            data: found_media
        };
    }
}