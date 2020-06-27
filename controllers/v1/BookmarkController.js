import autoBind from 'auto-bind';
import BaseController from './BaseController';
import Bookmark from './../../models/Bookmark';
import User from './../../models/User';
import Article from './../../models/Article';
import dotenv from 'dotenv';

dotenv.config();

class BookmarkController extends BaseController{
    constructor(){
        super();
        autoBind(this);
    }

  /**
   * @api {post} /v1/bookmark/ Create Bookmark
   * @apiName Create Bookmark
   * @apiGroup Bookmarks
   */
    async createBookmark(req, res) {
        const { useremail, bookmarktitle } = req.body;

        try {
            let user = await User.findOne({email:useremail});
            if (user) {
                console.log(user);
                
                let article = await Article.findOne({title:bookmarktitle});
                if (!article) {
                    return super.notfound(res, `No article found`);
                }
                let articleId = article._id;
                let userId = user._id;
                let bookmark = new Bookmark({article: articleId,user: userId});
                await bookmark.save()
                return super.success(res, Bookmark, 'Created Bookmark Successfully');
            }
            return super.notfound(res, `user not found`);
            
        } catch (error) {
            return super.actionFailure(res, `Couldn't create Bookmark`);
        }
        
    }

    /**
     * @api {get} /v1/bookmark/:id Get Users' Bookmarks
     * @apiName Get Bookmark
     * @apiGroup Bookmark
     */

    async getBookmark(req, res) {
        const {id} = req.body
        try {
            let user = await User.findOne({_id:id});
            if (user) {
                let bookmark = await Bookmark.find({user:id, isActive:true });
                return super.success(res, bookmark, 'Bookmark Retrieved');
            }
            return super.notfound(res, `user not found`);
             
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
            let user = await User.findOne({_id:id});
            if (user) {
                let bookmark = await Bookmark.findOne({user: id});
                bookmark.isActive = false;
                bookmark.save();
                console.log(bookmark);
                
                return super.actionSuccess(res, 'Bookmark Deleted');
            }
            return super.notfound(res, `user not found`);
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
        let user = await User.findOne({_id:id});
        if (user) {
            let bookmark = await Bookmark.findOne({user: id});
            bookmark.isActive = true;
            bookmark.save();
            return super.actionSuccess(res, 'Bookmark Restored');
        }
        return super.notfound(res, `user not found`);   
    }catch(err){
        console.log(err);
        return super.actionFailure(res, `Couldn't restore bookmark`);
    }
  }

}

module.exports = BookmarkController;
