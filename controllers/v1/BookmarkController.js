import autoBind from 'auto-bind';
import BaseController from './BaseController';
import Bookmark from './../../models/Bookmark';
import Article from './../../models/Article';
import dotenv from 'dotenv';

dotenv.config();

class BookmarkController extends BaseController{
    constructor(){
        super();
        autoBind(this);
    }

  /**
   * @api {get} /v1/bookmark/:id Create Bookmark
   * @apiName Create Bookmark
   * @apiGroup Bookmarks
   */
    async createBookmark(req, res) {
        const { id } = req.body;

        try {

            let article = await Article.findById({_id: id});
            if (!article) {
                return super.notfound(res, `No article found`);
            }
            let bookmark = new Bookmark();
            bookmark.article = article._id
            await bookmark.save()

            return super.success(res, Bookmark, 'Created Bookmark Successfully');
            
        } catch (error) {
            return super.actionFailure(res, `Couldn't create Bookmark`);
        }
        
    }

    /**
     * @api {get} /v1/bookmark Get Users' Bookmarks
     * @apiName Get Bookmark
     * @apiGroup Bookmark
     */

    async getBookmark(req, res) {
        try {
            let bookmark = await Bookmark.find({isActive: true});
            return super.success(res, bookmark, 'Bookmark Retrieved');
             
        } catch (error) {
            console.log(error);
            return super.actionFailure(res, `Couldn't get bookmark`);
        }
        
    }

    /**
     * @api {delete} /v1/bookmark/:id Remove Bookmark
     * @apiName Remove Bookmark
     * @apiGroup Bookmark
     */
    async removeBookmark(req, res) {
        const { id } = req.body;
        try{
            let bookmark = await Bookmark.findOneAndUpdate({_id: id}, {isActive: false});
            return super.actionSuccess(res, 'Bookmark Deleted');

        }catch(err){
            console.log(err);
            return super.actionFailure(res, `Couldn't delete bookmark`);
        }
    }

    /**
   * @api {patch} /v1/bookmark/restore/:id Restore Bookmark
   * @apiName Restore Bookmark
   * @apiGroup Bookmark
   */
  async restoreBookmark(req, res){
    const { id } = req.body;
    try{
        let bookmark = await Interest.findOneAndUpdate({_id: id}, {isActive: true});
        return super.actionSuccess(res, 'Bookmark Restored');

    }catch(err){
        console.log(err);
        return super.actionFailure(res, `Couldn't restore bookmark`);
    }
  }

}

module.exports = BookmarkController;
